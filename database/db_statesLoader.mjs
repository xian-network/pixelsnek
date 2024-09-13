import { getDatabase } from "./database.mjs";
import { getStateChangesQuery } from "./graphqlQuries.mjs";
import {
  groupByTxHash,
  makeGraphQLRequest,
  processExtractedValues
} from "./loaderPollerUtils.mjs"

process.on("SIGTERM", (signal) => {
  console.log(`Process ${process.pid} received a SIGTERM signal`);
  process.exit(0);
});

process.on("SIGINT", (signal) => {
  console.log(`Process ${process.pid} has been interrupted`);
  process.kill(process.pid, "SIGTERM");
});


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