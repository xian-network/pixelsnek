import { getDatabase } from "./database.mjs";
import * as saveToDB from "./contractStatesStorage.mjs";


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

export function* extractValues(groupedData) {
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
        if (!groupResult["uid"]){
          const isUid = key.split(":")[1];
          if (isUid.length === 64){
            groupResult["uid"] = isUid;
          }
        }

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