<script>
    import { onMount } from "svelte";
    import {userAccount, auctions} from "../js/stores";
    import {decodeFrames, formatAccountAddress, stringToFixed} from "../js/utils";
    import { hasAuctionTxHappened } from "../js/processGraphql";
    import {createSnack} from "../js/store-utils";
    import {config} from "../js/config";

    let init = false

    onMount(async () => {
        await initialize()

        let socket = new WebSocket(config.webSocketUrl);

        socket.onopen = () => {
            console.log('Connected to WebSocket');
            const subscriptionRequest = {
                jsonrpc: "2.0",
                method: "subscribe",
                id: 0,
                params: {
                    query: "tm.event='Tx'"
                }
            };

            socket.send(JSON.stringify(subscriptionRequest));
        };

        socket.onmessage = async (event) => {
            // Handle incoming message from server
            // console.log("socketDataType: ", typeof(event.data), "| socketData: ", event.data);
            
            const parsedMessage = JSON.parse(event.data);
            // Skip initial subscription confirmation message
            if (parsedMessage.result && Object.keys(parsedMessage.result).length === 0) {
                return;
            }

            const auctionTx = hasAuctionTxHappened(parsedMessage);

            // console.log({auctionTx})

            if (auctionTx){
                console.log({parsedMessage});
                const decodedAuctions = decodeAuctions(await getActiveAuctions())
                auctions.set([...decodedAuctions]);
            }
        };

        socket.onclose = () => {
            console.log('websocket connection closed');
        };

        socket.onerror = () => {
        // Handle error
        };
    });

    async function initialize(){
        auctions.set(decodeAuctions(await getActiveAuctions()))
        init = true
    }

    async function getActiveAuctions(){
        const res = await fetch(`./auctionsAll.json?limit=1000000`)
		let json = await res.json()

		if (!json) return []
	    // return json.data.sort((a, b) => a.last_tx_uid > b.last_tx_uid ? -1 : 1)
        return json.data

        // getAuctionThingQuery()

    }

    async function getThingInfo(uid){
        const res = await fetch(`./frames/${uid}.json`)
		let json = await res.json()
	    return json.thingInfo
    }

    function decodeAuctions(activeAuctions){
        return activeAuctions.map(a => decodeAuction(a))
    }

    function decodeAuction(auctionInfo){
        auctionInfo.thingInfo.frames = decodeFrames(auctionInfo.thingInfo.thing)
        return auctionInfo
    }

	function replaceAuctionInfo (auctionUpdate) {
        let found
        auctions.update(current => {
            current.forEach((a, index) => {
                if(a.uid === auctionUpdate.uid) {
                    current[index] = {...current[index], ...auctionUpdate};
                    found = current[index]
                }
            });
            return current
        })
        //console.log({found})
        return found
	}

    const announceNewBid = (auctionInfo) => {
        if (!auctionInfo) return
		let [currentBidInfo, previousBidInfo] = auctionInfo.bid_history
		if (!currentBidInfo) return

		let auctionIsYours = false

		if ($userAccount){
			if ($userAccount === auctionInfo.old_owner) auctionIsYours = true
		}

		let message = `${formatAccountAddress(currentBidInfo.bidder, 8)} bid ${stringToFixed(currentBidInfo.bid, 4)} ${config.currencySymbol}${auctionIsYours ? " on your auction" : ""}.`

		if (!previousBidInfo){
			createSnack({
                title: `First Bid!`,
                body: message,
				type: auctionIsYours ? 'success' : 'info',
                delay: 10000,
				thingInfo: auctionInfo.thingInfo
            })
			return
		}

		let lastBidYours = previousBidInfo.bidder === $userAccount

		if (lastBidYours){
			createSnack({
                title: `You have been OUTBID!`,
                body: message,
				type: 'warning',
                delay: 10000,
				thingInfo: auctionInfo.thingInfo
            })
			return
		}

		createSnack({
			title: `New higher bid!`,
			body: message,
			type: auctionIsYours ? 'success' : 'info',
			delay: 10000,
			thingInfo: auctionInfo.thingInfo
		})
    }

    function announceNewAuction(auctionInfo){
        if (!auctionInfo) return
        //console.log({announceNewAuction: auctionInfo})
        auctions.set([auctionInfo, ...$auctions])
/*
        if ($userAccount){
            if ($userAccount === auctionInfo.old_owner) return
        }
*/
        createSnack({
            title: `New Auction!`,
            body: `${formatAccountAddress(auctionInfo.old_owner, 8)} has listed "${auctionInfo.thingInfo.name}".`,
            type: 'success',
            delay: 10000,
            thingInfo: auctionInfo.thingInfo
        })
    }

    function announceAuctionEnded(auctionInfo){
        if (!auctionInfo) return
        //console.log({announceNewAuction: auctionInfo})

        if ($userAccount){
            if ($userAccount === auctionInfo.old_owner){
                if (auctionInfo.reserve_met){
                    createSnack({
                        title: `Your Auction Ended!`,
                        body: `${formatAccountAddress(auctionInfo.winner, 8)} has won this auction.`,
                        type: 'success',
                        delay: 10000,
                        thingInfo: auctionInfo.thingInfo
                    })
                }else{
                    createSnack({
                        title: `Your Auction Ended!`,
                        body: `The reserve price was not met. "${auctionInfo.thingInfo.name}" has been returned to you.`,
                        type: 'info',
                        delay: 10000,
                        thingInfo: auctionInfo.thingInfo
                    })
                }

            }
            if ($userAccount === auctionInfo.winner){
                   createSnack({
                    title: `You Won an Auction!`,
                    body: `Congratulations, you won the auction for "${auctionInfo.thingInfo.name}"!`,
                    type: 'success',
                    delay: 10000,
                    thingInfo: auctionInfo.thingInfo
                })
            }
        }else{
            if (auctionInfo.reserve_met){
                createSnack({
                    title: `Auction Ended!`,
                    body: `${formatAccountAddress(auctionInfo.winner, 8)} won the auction for "${auctionInfo.thingInfo.name}".`,
                    type: 'success',
                    delay: 10000,
                    thingInfo: auctionInfo.thingInfo
                })
            }else{
                if (auctionInfo.ended_early){
                    createSnack({
                        title: `Auction Cancelled!`,
                        body: `The owner of "${auctionInfo.thingInfo.name}" has cancelled this auction.`,
                        type: 'info',
                        delay: 10000,
                        thingInfo: auctionInfo.thingInfo
                    })
                }else{
                    createSnack({
                        title: `Auction Ended!`,
                        body: `Reserve was not met. "${auctionInfo.thingInfo.name}" returned to owner.`,
                        type: 'info',
                        delay: 10000,
                        thingInfo: auctionInfo.thingInfo
                    })
                }

            }

        }



    }

</script>

