import fs from "fs";
import { fetchAuctionThings, fetchValues } from "../js/processGraphql";
import { constructValuesQuery, getAuctionThingQuery } from "../js/graphqlQueries";
export async function get(req, res) {
	let { limit, offset } = req.query;
	limit = parseInt(limit) || 25

	let auctionInfo = [];
	try {
		const eventData = JSON.parse(fs.readFileSync(`./events/artist.json`, 'utf8'));
		const auctionThings = await fetchAuctionThings(getAuctionThingQuery(eventData.artistVk));
		// const uids = auctionThings.map((thing) => thing.uid);
		const uids = auctionThings.map((thing) => { 
            if (thing[eventData.artistVk] === 'True'){
                return thing.uid 
            }
        });
		const valuesQuery = constructValuesQuery(uids);
		const thingInfoArray = await fetchValues(valuesQuery);
		// console.log({values});
		
		auctionInfo = await Promise.all(auctionThings.map(async (info, index) => {
			//assuming items in auctionThings and thingInfoArray are arranged in the same order
			const thingInfo = thingInfoArray[index];

			info.start_date = (new Date(info.start_date)).getTime();
			info.scheduled_end_date = (new Date(info.end_date)).getTime();
			info.current_bid = info.current_bid == null? 0 : info.current_bid

			return {
				...info, 
				thingInfo,
				ended: new Date() > info.scheduled_end_date, 
				reserve_met: Number(info.reserve_price) >= Number(info.current_bid === null? 0: info.current_bid)
			}
		}))
	} catch (err){
		console.log(err);
	}

	// console.log({auctionInfo})

	res.setHeader('Content-Type', 'application/json');
	res.end(JSON.stringify({data: auctionInfo, count: auctionInfo.length}));
}
