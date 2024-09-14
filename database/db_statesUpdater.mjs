import WebSocket from 'ws';
import { processExtractedValues } from "./loaderPollerUtils.mjs";

const socket = new WebSocket('wss://testnet.xian.org/websocket');
const messageQueue = [];

function enqueue(message) {
    messageQueue.push(message);
}

function dequeue() {
    return messageQueue.shift();
}

socket.on('open', () => {
    console.log('Connected to WebSocket');
    
    const subscriptionRequest = {
        jsonrpc: "2.0",
        method: "subscribe",
        id: 0,
        params: {
            query: "tm.event='Tx'"
        }
    };
    
    socket.send(JSON.stringify(subscriptionRequest));
});

socket.on('message', (data) => {
    const message = data.toString('utf8');
    if(message !== '{"jsonrpc":"2.0","id":0,"result":{}}'){
        enqueue(message);
        console.log('Message added to queue');
    }    
});

socket.on('close', () => {
    console.log('Disconnected from WebSocket');
});

socket.on('error', (error) => {
    console.error('WebSocket error:', error);
});



// Process queue items (non-blocking)
setInterval(() => {
    if (messageQueue.length > 0) {
        let message = dequeue();
        console.log('Processing message:', message);
        message = JSON.parse(message);
        // Add your message processing logic here
        const encodedData = message.result.data.value.TxResult.result.data;
        const decodedBuffer = Buffer.from(encodedData, 'base64');
        const decodedfromB64 = JSON.parse(decodedBuffer.toString('utf8'));
        
        const currentDate = new Date().toISOString().slice(0, 23);
        
        const prepareData = {
            "created": currentDate,
            "txHash": message.result.events["tx.hash"][0],
            "stamps_used": decodedfromB64.stamps_used,
            "sender": "sender undefined",
            "stateChanges": decodedfromB64.state
        };
        console.log('Prepared data:', prepareData);

        processExtractedValues([prepareData]);
    }
}, 2000); // Adjust the interval as needed




// import { getStateChangesQuery } from "./graphqlQuries.mjs";
// import {
//   groupByTxHash,
//   makeGraphQLRequest,
//   processExtractedValues
// } from "./loaderPollerUtils.mjs"

// const processContractStates = async (contractType) => {
//   const query = getStateChangesQuery(contractType, 0);
//   const queryResults = await makeGraphQLRequest(query);
//   let resultsTotalCount = queryResults?.data.allStateChanges.nodes.length;

//   if (resultsTotalCount > 0) {
//     const groupedData = groupByTxHash(queryResults);
//     await processExtractedValues(groupedData);
//     console.log(`${contractType} resultsTotalCount: `, resultsTotalCount);
//   }

// };

// const pollContractStates = async (pollInterval = 10000) => {
//   const poll = async () => {
//     console.log('Polling contract states');
    
//     // Process info contract states
//     await processContractStates("info");

//     // Process auction contract states
//     // await processContractStates("auction", 0);

//     setTimeout(poll, pollInterval);
//   };

//   poll();
// };

// const [pollIntervalArg] = process.argv.slice(2);
// const pollInterval = parseInt(pollIntervalArg) || 10000; // Default to 10 seconds if not provided

// pollContractStates(pollInterval);