import util from "util";
import BN from 'bignumber.js'

const AUCTION_CONTRACT = process.env.AUCTION_CONTRACT || null
if (!AUCTION_CONTRACT ) throw Error("Must pass AUCTION_CONTRACT via .env file")

const INFO_CONTRACT = process.env.INFO_CONTRACT || null
if (!INFO_CONTRACT ) throw Error("Must pass INFO_CONTRACT via .env file")

export const auctionContractProcessor = (database, socket_server, services) =>{
    const processorName = 'Auction Contract'
    let db = database
/*
    setInterval(() => {
        console.log("sending new bid")
        socket_server.to('auction-updates').emit("auction-update", {type: 'new-bid', auction: {bids: []}})
    }, 5000)
*/


    const updateProcessors = {
        'newAuction': newAuction,
        'endAuction': endAuction,
        'newBid': newBid,
    }

    async function processUpdate(update, loader=false){
        if (!loader) console.log(util.inspect({processorName, update}, false, null, true))
        
        

        let { state_changes_obj, txInfo } = update
        const { transaction } = txInfo
        const { metadata, payload } = transaction

        if (typeof state_changes_obj === 'string'){
            state_changes_obj = JSON.parse(state_changes_obj)
        }

        // if (await db.queries.shouldProcess('AuctionHistoryContract', last_tx_uid)){
        let contractUpdate = {}
        try{
            contractUpdate = state_changes_obj[AUCTION_CONTRACT]["S"]
        }catch (e){}

        let infoContractUpdate
        try{
            infoContractUpdate = state_changes_obj[INFO_CONTRACT]["S"]
        }catch (e){}

        for (const uid of Object.keys(contractUpdate || {})){
            if (uid.length === 64) {
                let updateType = determineUpdateType(contractUpdate[uid])
                //console.log({updateType})
                if (Object.keys(updateProcessors).includes(updateType)) {
                    await updateProcessors[updateType]({
                        uid,
                        update: contractUpdate[uid],
                        infoContractUpdate,
                        sender: payload.sender,
                        timestamp: metadata.timestamp,
                        loader
                    })
                }
            }
        }
        //doesn't seem important
        // await db.queries.update_processed('AuctionHistoryContract', last_tx_uid)
        // }
    }

    function determineUpdateType(update){
        if (typeof update === "undefined") return

        let updateKeys = Object.keys(update)

        if (typeof update === "boolean" && update === false) return "endAuction"
        if (updateKeys.includes("__hash_self__")){
            if (update.__hash_self__ === true) return "newAuction"
        }
        if (updateKeys.length === 2 && updateKeys.every(i => ['current_bid', 'current_winner'].includes(i))) return 'newBid'

        console.log('undetermined')
        console.log(util.inspect(update, false, null, true))
    }

    async function newAuction(args){
        const { update, timestamp, loader } = args
        if (determineUpdateType(update) !== "newAuction") return
        //console.log(util.inspect({newAuction: update}, false, null, true))

        const { end_date, start_date, reserve_price} = update
        const { __fixed__: reserve_price_fixed } = reserve_price
        const [end_year, end_month, end_day, end_hour, end_minute, end_second, end_ms] = end_date.__time__
        const [start_year, start_month, start_day, start_hour, start_minute, start_second, start_ms] = start_date.__time__

        let reserve_price_BN = new BN(reserve_price_fixed || reserve_price)

        let auction = await new db.models.AuctionHistory({
            uid: update.uid,
            created_date: new Date(timestamp * 1000),
            start_date: Date.UTC(start_year, start_month-1, start_day, start_hour, start_minute, start_second, start_ms),
            scheduled_end_date: Date.UTC(end_year, end_month-1, end_day, end_hour, end_minute, end_second, end_ms),
            ended: false,
            ended_early: false,
            old_owner: update.current_owner,
            new_owner: "",
            reserve_price: reserve_price_BN.toString(),
            reserve_met: reserve_price_BN.isEqualTo(0),
            winning_bid: "0",
            bid_history: [],
            winner: "",
            paid_to_owner: "0",
            paid_to_creator: "0",
            royalty_percent: update.royalty_percent,
            creator: update.creator,
        })
        //console.log({auction})
        auction.save((err, doc) => {
            //console.log({err, doc})
            if (!loader) socket_server.to(`auction-updates`).emit("auction-update", {type: 'new-auction', auction: doc})
        })


    }

    async function newBid(args){
        const { uid, update, timestamp, loader} = args
        if (determineUpdateType(update) !== "newBid") return
        //console.log(util.inspect({newBid: update}, false, null, true))

        let auction = await db.models.AuctionHistory.findOne({uid, ended: false})
        if (!auction) return

        const { current_bid } = update
        const { __fixed__: current_bid_fixed } = current_bid

        let current_bid_BN = new BN(current_bid_fixed || winning_bid)

        auction.bid_history.unshift({
            bid: current_bid_BN.toString(), bidder: update.current_winner, timestamp: new Date(timestamp * 1000)
        })
        auction.reserve_met = current_bid_BN.isGreaterThanOrEqualTo(new BN(auction.reserve_price))

        auction.save((err, doc) => {
            //console.log({err, doc})
            if (!loader) socket_server.to(`auction-updates`).emit("auction-update", {type: 'new-bid', auction: doc})
        })


    }

    async function endAuction(args){
        const { uid, update, infoContractUpdate, timestamp, loader } = args
        if (determineUpdateType(update) !== "endAuction") return
        //console.log(util.inspect({endAuction: update, uid, infoContractUpdate}, false, null, true))

        let auction = await db.models.AuctionHistory.findOne({uid, ended: false})
        if (!auction) return

        let pixel_frame = await db.models.PixelFrame.findOne({uid})
        if (!pixel_frame) return

        let ended_date = new Date(timestamp * 1000)
        let new_owner = infoContractUpdate[uid].owner

        let winning_bid_info = auction.bid_history.shift()
        if (winning_bid_info && auction.reserve_met) {
            auction.winning_bid = winning_bid_info.bid
            auction.winner = winning_bid_info.bidder

            let royaltyPaidToCreator_BN = new BN(0)
            let paidToOwner_BN = new BN(winning_bid_info.bid)

            if (auction.royalty_percent > 0) {
                let winning_bid_BN = new BN(winning_bid_info.bid)
                royaltyPaidToCreator_BN = winning_bid_BN.multipliedBy(pixel_frame.royalty_percent / 100)
                if (royaltyPaidToCreator_BN.isNaN()) royaltyPaidToCreator_BN = new BN("0")
                if (royaltyPaidToCreator_BN.isGreaterThan(0)) {
                    let currentRoyalties_BN = new BN(pixel_frame.royalties_earned)
                    pixel_frame.royalties_earned = currentRoyalties_BN.plus(royaltyPaidToCreator_BN)
                }
            }
            auction.paid_to_owner = paidToOwner_BN.minus(royaltyPaidToCreator_BN).toString()
            auction.paid_to_creator = royaltyPaidToCreator_BN.toString()

            pixel_frame.owner = new_owner
            pixel_frame.lastSaleDate = new Date(timestamp * 1000)
            pixel_frame.lastUpdate = new Date(timestamp * 1000)

            await new db.models.SalesHistory({
                uid,
                saleDate: new Date(timestamp * 1000),
                price: winning_bid_info.bid,
                royaltyPaid: royaltyPaidToCreator_BN.toString(),
                seller: auction.old_owner,
                buyer: new_owner,
                wasHeld: false,
                gift: false,
                auction: true
            }).save()
        }

        auction.ended = true
        auction.ended_early = ended_date < auction.scheduled_end_date
        auction.ended_early_date = ended_date
        auction.new_owner = new_owner

        auction.save((err, doc) => {
            //console.log({err, doc})
            if (!loader) socket_server.to(`auction-updates`).emit("auction-update", {type: 'auction-ended', auction: doc})
        })

        await pixel_frame.save()
    }

    return {
        setDb: (database) => db = database,
        processUpdate
    }
}