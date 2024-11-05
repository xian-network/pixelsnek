import { fetchThings } from "../js/processGraphql.js";
import { getMostLikedUidsQuery, getRecentUidsQuery, getOwnedUidsQuery, getThingsForSaleUidsQuery } from "../js/graphqlQueries.js";

// export const ssr = false;

export const load = async () => {
    let data = await Promise.all([
        fetchThings(getRecentUidsQuery()),
        fetchThings(getThingsForSaleUidsQuery()),
        // fetchData(getMostLikedUidsQuery()),
        // fetchData(getOwnedUidsQuery()),
    ])
    // let eventInfo = data[3]
    // try{
    // 	console.log("WE DOIN IT")
    // 	let endDate = new Date(eventInfo.endDate)
    // 	let shouldShowEvent = new Date() <= endDate.setDate(endDate.getDate() + 3) && new Date() >= new Date(eventInfo.announceDate)
    // 	if (!shouldShowEvent) eventInfo = false
    // 	console.log({shouldShowEvent})
    // }catch (e) {
    // 	eventInfo = null
    // }
    // console.log("RECENT: ", data[0])
    return {
        // mostLiked: data[0],
        recent: data[0],
        forsale: data[1],
        // eventInfo
    }
};