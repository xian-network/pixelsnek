import { mockPixelThing, processThings } from "../js/processGraphql";

export async function get(req, res, next) {
	let { limit, offset } = req.query;
	limit = parseInt(limit) || 25

	// var match = { $match : {blacklist: false}}
	// var match = { $match : {}}
	// var sort = { $sort : {"creationBlock" : -1.0}}
	// var skip = { $skip: parseInt(offset) }
	// var reclimit = { $limit: limit}
	// let dataPipeline = []
	// let countPipeline = [match]
	// if (offset) {
	// 	dataPipeline = [match, sort, skip, reclimit]
	// }
	// else dataPipeline = [match, sort, reclimit]
	// let facet = { $facet: {data: dataPipeline, "count": countPipeline}}
	// let collation = { locale : "en_US", numericOrdering : true }

	// let things = await global.db.models.PixelFrame
	// 	.aggregate([facet])
	// 	.collation(collation)

	// res.setHeader('Content-Type', 'application/json');
	// res.end(JSON.stringify({data: things[0].data, count: things[0].count.length}));

	const things = [];
	let count = 0;

	try {
		for await (const thing of processThings(offset)) {
			things.push(thing);
			count++;
		}

		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify({ data: things, count }));
	} catch (error) {
		console.error("Error processing owner things:", error);
		res.statusCode = 500;
		res.end(JSON.stringify({ error: "Internal server error" }));
	}
}