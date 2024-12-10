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
		const uids = auctionThings.map((thing) => thing.uid);
		const valuesQuery = constructValuesQuery(uids);
		const thingInfoArray = await fetchValues(valuesQuery);
		// console.log({values});
		
		auctionInfo = await Promise.all(auctionThings.map(async (info, index) => {
			//assuming items in auctionThings and thingInfoArray are arranged in the same order
			const thingInfo = thingInfoArray[index];
			const endDate = new Date(info.end_date);
			const startDate = new Date(info.start_date);
			info.start_date = Date.UTC(startDate.getFullYear(), startDate.getMonth() - 1, startDate.getDay(), startDate.getHours(), startDate.getMinutes(), startDate.getSeconds(), startDate.getMilliseconds())
			info.scheduled_end_date = Date.UTC(endDate.getFullYear(), endDate.getMonth() - 1, endDate.getDay(), endDate.getHours(), endDate.getMinutes(), endDate.getSeconds(), endDate.getMilliseconds())
			info.current_bid = info.current_bid == null? 0 : info.current_bid
			return {
				...info, 
				thingInfo,
				ended: new Date() > endDate, 
				// ended_early: info[eventData.artistVk] === "False"? new Date() < new Date(info.scheduled_end_date) : false, 
				// ended_early_date:
				// bid_history: [], 
				reserve_met: Number(info.reserve_price) >= Number(info.current_bid === null? 0: info.current_bid)}
		}))
	} catch (err){
		console.log(err);
	}

	console.log({auctionInfo})

	res.setHeader('Content-Type', 'application/json');
	res.end(JSON.stringify({data: auctionInfo, count: auctionInfo.length}));
}
