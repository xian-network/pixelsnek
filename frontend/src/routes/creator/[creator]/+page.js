import { fetchThings } from "../../../js/processGraphql.js";
import { getOwnedUidsQuery } from "../../../js/graphqlQueries.js";

export async function load({ params }) {
    let data = await fetchThings(getOwnedUidsQuery(params.creator))
    return {
        created: data,
        creator: params.creator
    }
}