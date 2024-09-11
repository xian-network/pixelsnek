import { getDatabase } from "./database.mjs";
import { getStateChangesQuery } from "./graphqlQuries.mjs";
import * as saveToDB from "./contractStatesStorage.mjs";

process.on("SIGTERM", (signal) => {
  console.log(`Process ${process.pid} received a SIGTERM signal`);
  process.exit(0);
});

process.on("SIGINT", (signal) => {
  console.log(`Process ${process.pid} has been interrupted`);
  process.kill(process.pid, "SIGTERM");
});

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

    return response.json();
  } catch (error) {
    console.error("There was an error:", error);
  }
};

export const groupByTxHash= (data) => {
  const nodes = data.data.allStateChanges.nodes;
  const txMap = Object.create(null);

  for (let i = 0, len = nodes.length; i < len; i++) {
    const node = nodes[i];
    const { created, txHash, key, value, transactionByTxHash } = node;

    if (!(txHash in txMap)) {
      txMap[txHash] = {
        created,
        txHash,
        stamps: transactionByTxHash.stamps,
        sender: transactionByTxHash.sender,
        stateChanges: [],
      };
    }

    txMap[txHash].stateChanges.push({ key, value });
  }

  return Object.values(txMap);
};

function* extractValues(groupedData) {
  const  rules = {
    ":thing": "thing",
    ":type": "type",
    ":name": "name",
    "S:names:": { key: "names.uid", value: "uid" },
    ":description": "description",
    ":owner": "owner",
    ":creator": "creator",
    ":meta:speed": "meta.speed",
    ":meta:num_of_frames": "meta.num_of_frames",
    ":meta:royalty_percent": "meta.royalty_percent",
    ":proof": "proof",
    ":price:hold": "price.hold",
    ":price:amount": "price.amount", 
  };

  const objectEntries = Object.entries(rules);

  for (const group of groupedData) {
    const groupResult = {};
    groupResult["created"] = group.created;
    groupResult["txHash"] = group.txHash;
    groupResult["stamps_used"] = group.stamps;
    groupResult["sender"] = group.sender;
    let updateType = null;
    let hasThingKey = false;
    let hasPriceKey = false;
    let hasOwnerKey = false;

    for (const change of group.stateChanges) {
      const { key, value } = change;
      if (key.endsWith(":thing")) {
        hasThingKey = true;
      } else if (key.endsWith(":owner")) {
        hasOwnerKey = true;
      } else if (key.includes(":price:")) {
        hasPriceKey = true;
      }
      // } else if (key.endsWith(":proof") && !updateType) {
      //   updateType = "set_proof";
      // }

      for (const [endsWith, resultKey] of objectEntries) {
        if (typeof resultKey === "object") {
          if (key.includes(endsWith)) {
            groupResult[resultKey.key] = key.split(":").pop();
            groupResult[resultKey.value] = value;
          }
        } else if (key.endsWith(endsWith)) {
          groupResult[resultKey] = value;
        }
      }
    }

    if (hasThingKey && !updateType){
      updateType = "create_thing";
    }else if (hasPriceKey && hasOwnerKey) {
      updateType = "sold_thing";
    } else if (hasPriceKey && !updateType) {
      updateType = "sell_thing";
    } else if (hasOwnerKey && !updateType) {
      updateType = "transfer_thing";
    }

    if (Object.keys(groupResult).length > 0) {
      yield { updateType: updateType, data: groupResult };
    }
  }
}

export const processExtractedValues = async (groupedData) => {
  let db = await getDatabase();

  for (const result of extractValues(groupedData)) {
    try {
      console.log(`Processing ${result.updateType}`);
      switch (result.updateType) {
        case "create_thing":
          await saveToDB.creatNewThing(db, result.data);
          break;
        case "transfer_thing":
          await saveToDB.transferThing(db, result.data);
          break;
        case "set_proof":
          // await saveToDB.setProof(db, result.data);
          break;
        case "sell_thing":
          await saveToDB.sellThing(db, result.data);
          break;
        case "sold_thing":
          await saveToDB.soldThing(db, result.data);
          break;
        default:
          console.log(`Unhandled function: ${result.updateType}`);
      }
    } catch (error) {
      console.error(`Error processing ${result.updateType}:`, error);
    }
  }
};

export const drop_collections = async () => {
  let db = await getDatabase();
  await db.queries.drop_collection("PixelFrame");
  await db.queries.drop_collection("Likes");
  await db.queries.drop_collection("LikedByUser");
  await db.queries.drop_collection("SalesHistory");
  await db.queries.drop_collection('AuctionHistory')
  
  // await db.queries.delete_processed("InfoContractUpdates");
  //await db.queries.delete_processed('AuctionHistoryContract')
};

const startLoading = async (offset, drop = true) => {
  if (drop && offset === 0) await drop_collections();

  // Process info contract states
  await processContractStates("info", offset);

  // Process auction contract states
  //await processContractStates("auction", offset);

  process.exit(0);
};

export const processContractStates = async (contractType, offset) => {
  const query = getStateChangesQuery(contractType, offset);
  const queryResults = await makeGraphQLRequest(query);
  let resultsTotalCount = queryResults?.data.allStateChanges.nodes.length;

  if (resultsTotalCount === 0) {
    return;
  }

  const groupedData = groupByTxHash(queryResults);
  await processExtractedValues(groupedData);
  console.log(`${contractType} resultsTotalCount: `, resultsTotalCount);

  if (resultsTotalCount < 100) {
    return;
  }

  // Recursive call with a delay to prevent stack overflow
  setTimeout(async () => {
    const newOffset = offset + 100;
    console.log(`${contractType} newOffset: `, newOffset);
    await processContractStates(contractType, newOffset);
  }, 1000); // 1 second delay
};

let [drop] = process.argv.slice(2);

startLoading(0, drop);