import { decodeFrames } from "../../../js/utils.js";
import { getThingByUid } from "../../../js/graphqlQueries.js";
import { fetchThings } from "../../../js/processGraphql.js";

export async function load({ params }) {
    let data = await Promise.all([
        fetchThings(getThingByUid(params.uid)),
        // this.fetch(`./history/${params.uid}.json`).then(res => res.json())
    ]);
    // console.log({ data: JSON.stringify(data) });
    let thingInfo = data[0][0];
    console.log({ thingInfo });
    try {
        thingInfo.frames = decodeFrames(thingInfo.thing);
        console.log({ thingInfo });
    } catch (e) {
        thingInfo = {
            name: "Not Found",
            owner: "",
            uid: params.uid,
            description: "",
            notFound: true,
        };
    }

    return {
        thingInfo,
        // auctionInfo,
        // salesHistory: data[1]
    };
}