// import WebSocket from 'ws';

// const socket = new WebSocket('wss://testnet.xian.org/websocket');

// socket.on('open', () => {
//     console.log('Connected to WebSocket');
    
//     const subscriptionRequest = {
//         jsonrpc: "2.0",
//         method: "subscribe",
//         id: 0,
//         params: {
//             query: "tm.event='NewBlock'"
//         }
//     };
    
//     socket.send(JSON.stringify(subscriptionRequest));
// });

// socket.on('message', (data) => {
//     // const parsedData = JSON.parse(data);
//     // console.log('Received:', parsedData);
//     console.log(data.toString('utf8'));
// });

// socket.on('close', () => {
//     console.log('Disconnected from WebSocket');
// });

// socket.on('error', (error) => {
//     console.error('WebSocket error:', error);
// });

import { getStateChangesQuery } from "./graphqlQuries.mjs";
import {
  groupByTxHash,
  makeGraphQLRequest,
  processExtractedValues
} from "./loaderPollerUtils.mjs"

const processContractStates = async (contractType) => {
  const query = getStateChangesQuery(contractType, 0);
  const queryResults = await makeGraphQLRequest(query);
  let resultsTotalCount = queryResults?.data.allStateChanges.nodes.length;

  if (resultsTotalCount > 0) {
    const groupedData = groupByTxHash(queryResults);
    await processExtractedValues(groupedData);
    console.log(`${contractType} resultsTotalCount: `, resultsTotalCount);
  }

  

  // if (resultsTotalCount < 100) {
  //   return;
  // }

  // Recursive call with a delay to prevent stack overflow
  // setTimeout(async () => {
  //   const newOffset = offset + 100;
  //   console.log(`${contractType} newOffset: `, newOffset);
  //   await processContractStates(contractType, newOffset);
  // }, 1000); // 1 second delay
};

const pollContractStates = async (pollInterval = 10000) => {
  const poll = async () => {
    console.log('Polling contract states');
    
    // Process info contract states
    await processContractStates("info");

    // Process auction contract states
    // await processContractStates("auction", 0);

    // Schedule the next poll
    setTimeout(poll, pollInterval);
  };

  // Start polling
  poll();
};

const [pollIntervalArg] = process.argv.slice(2);
const pollInterval = parseInt(pollIntervalArg) || 10000; // Default to 10 seconds if not provided

pollContractStates(pollInterval);