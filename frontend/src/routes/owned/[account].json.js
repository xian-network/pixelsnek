import { processThings } from "../../js/processGraphql";

export async function get(req, res, next) {
	let { account } = req.params;
	let { limit, offset } = req.query;

	limit = parseInt(limit) || 25

	const things = [];
	let count = 0;

	try {
		for await (const thing of processThings(offset, account)) {
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

	// res.setHeader('Content-Type', 'application/json');
	// res.end(JSON.stringify({data: things[0].data, count: things[0].count.length}));
	// res.end(JSON.stringify({data: things, count: things.length}));
}