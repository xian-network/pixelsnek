import fs from 'fs'
import { fetchAuctionThings,  fetchValues } from '../js/processGraphql';
import { constructValuesQuery, getAuctionThingQuery } from '../js/graphqlQueries';

export async function get(req, res) {
    let { event } = req.query;
    let eventData = {endDate: new Date(0)}

    try {
        eventData = JSON.parse(fs.readFileSync(`./events/${event}.json`, 'utf8'));
        //const auctionThings = await fetchAuctionThings(getAuctionThingQuery(eventData.artistVk));
        // collect uids of only auctioned things
		// const uids = auctionThings.map((thing) => { 
        //     if (thing[eventData.artistVk] === 'True'){
        //         return thing.uid 
        //     }
        // });
        const uids = eventData.artList;
        if (uids.length > 0){
            const valuesQuery = constructValuesQuery(uids);
            eventData.artThingList = await fetchValues(valuesQuery);
        }
        
    } catch (err) {
        console.log(err)
    }

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(eventData));
}