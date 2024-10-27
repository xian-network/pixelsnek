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
  console.log({ query })
  console.log(query.length)
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
    console.log({ responseData })
    // console.log({responseData: responseData.errors})
    // Construct an array of JSON objects
    const resultArray = [];
    const uidMap = new Map();

    for (const alias in responseData.data) {
      const nodes = responseData.data[alias].nodes;
      console.log({ nodes })
      if (nodes && nodes.length > 0) {
        // const [_, uid, field] = alias.split('_');
        for (const node of nodes) {
          const { key, value } = node;
          const key_parts = key.split(':')
          const uid = key_parts[1]
          const field = key_parts[3] ? key_parts[2] + key_parts[3] : key_parts[2]
          if (!uidMap.has(uid)) {
            uidMap.set(uid, { uid });
          }
          const currentObject = uidMap.get(uid);
          // Extract the first item from the array
          currentObject[field] = value;
          console.log({ field })
        }
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
