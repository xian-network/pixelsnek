// import { getThingByUid } from "../../js/graphqlQueries";
// import { extractThingValues } from "../../js/processGraphql";

// export async function get(req, res, next) {
	// const { uid } = req.params;

	// let auctionInfo = null

	// const thingQuery = getThingByUid(uid);
	// console
	// const thingQueryResults = await makeGraphQLRequest(thingQuery);
	// const thingData = thingQueryResults?.data
	// const thingInfo = extractThingValues(uid, thingData);

	//let thingInfo = await global.db.models.PixelFrame.findOne({uid})

	// if (!thingInfo) thingInfo = null
	// else {
	// 	if (thingInfo.blacklist) thingInfo = null
	// 	auctionInfo = await global.db.queries.getActiveAuction(uid)
	// }

	

	// res.setHeader('Content-Type', 'application/json');
	// res.end(JSON.stringify({thingInfo, auctionInfo}));

// }