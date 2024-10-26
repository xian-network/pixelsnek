import { getOwnedUids, getKeys, getThingByUid, constructValuesQuery } from "./graphqlQueries.js";
import { config } from "./config.js";

export async function fetchThings(query) {
  let uids = [];

  const url = config.graphqlEndpoint;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();
    uids = json.data.allStates.nodes.map((node) => node.key.split(':')[1]);

    // Construct a new query using the uids
    const valuesQuery = constructValuesQuery(uids);
    const values = await fetchValues(valuesQuery);
    return values
  } catch (error) {
    console.error('Error with request:', error);
  }
}


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


export async function fetchValues(query) {
  const data = JSON.stringify({
    query: query,
  });

  const url = config.graphqlEndpoint;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
      },
      body: data,
    });

    const responseData = await response.json();

    // Construct an array of JSON objects
    const resultArray = [];
    const uidMap = new Map();

    for (const key in responseData.data) {
      const nodes = responseData.data[key].nodes;
      if (nodes && nodes.length > 0) {
        const [_, uid, field] = key.split('_');
        if (!uidMap.has(uid)) {
          uidMap.set(uid, { uid });
        }
        const currentObject = uidMap.get(uid);
        // Extract the first item from the array
        currentObject[field] = nodes.map((node) => node.value)[0];
      }
    }

    uidMap.forEach((value) => {
      if (!value.likes) value.likes = 0

      value.num_of_frames = value.metanumofframes
      delete (value.metanumofframes)

      value.royalty_percent = value.metaroyaltypercent
      delete (value.metaroyaltypercent)

      value.price_amount = value.priceamount
      delete (value.priceamount)

      value.price_hold = value.pricehold
      delete (value.pricehold)

      value.speed = value.metaspeed
      delete (value.metaspeed)

      resultArray.push(value)
    })
    return resultArray;

  } catch (error) {
    console.error('Error with request:', error);
  }
}

export async function executeGraphQlQuery(query) {
  const url = config.graphqlEndpoint;
  const response = await fetch(url, {
    method: 'POST', headers: {
      'Content-Type': 'application/json',
      'Content-Length': query.length,
    }, body: JSON.stringify({ query })
  });
  return response.json();
}
