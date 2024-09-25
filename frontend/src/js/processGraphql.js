import { getOwnedUids, getThing2 } from "./graphqlQueries.js";

export const makeGraphQLRequest = async (query) => {
    const url = "https://testnet.xian.org/graphql";
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      try {
        return JSON.parse(text);
      } catch (parseError) {
        console.error("Failed to parse JSON response:", text);
        throw new Error(`Invalid JSON response: ${parseError.message}`);
      }
    } catch (error) {
      console.error("There was an error:", error);
      throw error;
    }
};

export const extractUids = (nodes) => {
    const uniqueUids = new Set();
    for (const node of nodes) {
        const { key } = node;
        if (key && key.includes(":") && key.split(":")[1].length === 64) {
            uniqueUids.add(key.split(":")[1]);
        }
            }

    return Array.from(uniqueUids); 
}

export const extractThingValues = (uid, queryData) =>{
    const thing = {};

    function getValue(field){
        if (field.nodes.length === 0){
            return ""
        }else{
            return field.nodes[0].value
        }
    }
    
    thing.uid = uid;
    thing.thing = getValue(queryData.thing);
    thing.created = queryData.thing.nodes[0].updated
    thing.owner = getValue(queryData.owner);
    thing["price_hold"] = getValue(queryData.price_hold);
    thing["price_amount"] = getValue(queryData.price_amount);
    thing.type = getValue(queryData.type);
    thing.name = getValue(queryData.name);
    thing.description = getValue(queryData.description);
    thing.creator = getValue(queryData.creator);
    thing.likes = getValue(queryData.likes);
    thing["speed"] = getValue(queryData.speed);
    thing["num_of_frames"] = getValue(queryData.frames);
    thing["royalty_percent"] = getValue(queryData.royalty);
    thing.proof = getValue(queryData.proof);
    // thing["names.uid"] =getValue(queryData.S_names);

    return thing; 
}

export async function* processOwnerThings(owner, offset) {
    const uidQuery = getOwnedUids(owner, offset);
    const uidQueryResults = await makeGraphQLRequest(uidQuery);

    const uids = extractUids(uidQueryResults?.data.allStates.nodes)

    for (const uid of uids) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Add a 1-second delay
        
        const thingQuery = getThing2(uid);
        const thingQueryResults = await makeGraphQLRequest(thingQuery);
        const thingData = thingQueryResults?.data

        yield extractThingValues(uid, thingData);
    }
}