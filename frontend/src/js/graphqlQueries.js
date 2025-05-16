import { config } from "./config.js";

export const getOwnedUidsQuery = (address, offset = 0, take = 10) => {
  return `
  query MyQuery {
      allStates(
        filter: {
          key: { startsWith: "${config.infoContract}.S", endsWith: "owner" }
          value: {
            equalTo: "${address}"
          }
        }
        offset: ${offset}
        first: ${take}
        orderBy: UPDATED_DESC
      ) {
        nodes {
          key
        }
      }
    }
  `;
};

export const getCreatedUidsQuery = (address, offset = 0, take = 10) => {
  return `
  query MyQuery {
      allStates(
        filter: {
          key: { startsWith: "${config.infoContract}.S", endsWith: "creator" }
          value: {
            equalTo: "${address}"
          }
        }
        offset: ${offset}
        first: ${take}
        orderBy: UPDATED_DESC
      ) {
        nodes {
          key
        }
      }
    }
  `;
};

export const isLikedQuery = (uid, account) => {
  return `
  query MyQuery {
    allStates(filter: {key: {equalTo: "${config.masterContract}.S:liked:${uid}:${account}"}}) {
      nodes {
        key
      }
    }
  }
  `
}

export const getRecentUidsQuery = (offset = 0, take = 10) => {
  return `
  query MyQuery {
    allStates(
      filter: {
        key: {startsWith: "${config.infoContract}", endsWith:"creator"},
        value: {notEqualTo: "595921837690c968dc87c5404941fda8c1a80b6819a3824cf3952db111cdf593"}
      }
      orderBy: UPDATED_DESC
      first: ${take}
      offset: ${offset}
    ) {
      nodes {
        key
        updated
      }
    }
  }
  `;
};


export const getMostLikedUidsQuery = (offset = 0, take = 10) => {
  return `
  query MyQuery {
    allStates(
      filter: {key: {startsWith: "${config.infoContract}.S:", endsWith: ":meta:likes"}}
      orderBy: VALUE_DESC
      first: ${take}
      offset: ${offset}
    ) {
      nodes {
        key
        value
      }
    }
  }
  `
}

export const getThingsForSaleUidsQuery = (take = 10, offset = 0) => {
  return `
  query MyQuery {
    allStates(
      filter: {key: {startsWith: "${config.infoContract}", endsWith: "price:amount"}, value: {notEqualTo: "0"}}
      orderBy: UPDATED_DESC
      first: ${take}
      offset: ${offset}
    ) {
      nodes {
        key
        value
      }
    }
  }
  `
}



export const getStateChangesQuery = (contractType, offset = 0) => {
  const infoQuery = `
  query MyQuery {
    allStateChanges(
      filter: { key: { startsWith: "${config.infoContract}" } }
      offset: ${offset}
    ) {
      totalCount
      nodes {
        created
        txHash
        key
        value
        transactionByTxHash {
          stamps
          sender
        }
      }
    }
  }
  `;

  const auctionQuery = `
  query MyQuery {
    allStateChanges(
      filter: { key: { startsWith: "${config.auctionContract}" } }
      offset: ${offset}
    ) {
      totalCount
      nodes {
        created
        txHash
        key
        value
        transactionByTxHash {
          stamps
          sender
        }
      }
    }
  }
  `;

  const queries = {
    "info": infoQuery,
    "auction": auctionQuery
  }
  return queries[contractType]
};



export const getThingByUid = (uid) => {
  return `
  query MyQuery {
    allStates(
      filter: {key: {equalTo: "${config.infoContract}.S:${uid}"}}
      first: 1
    ) {
      nodes {
        key
        value
      }
    }
  }
  `
}

export const getOwnedUids = (owner, offset = 0) => {
  return `
  query MyQuery {
    allStates(
      filter: {
        key: { startsWith: "${config.infoContract}", endsWith: "owner" }
        value: {
          equalTo: "${owner}"
        }
      }
      offset: ${offset}
    ) {
      nodes {
        key
      }
    }
  }
  `
}

export const getKeys = (offset = 0) => {
  return `
  query MyQuery {
    allStateChanges(
      filter: { key: { startsWith: "${config.infoContract}" } }
      offset: ${offset}
    ) {
      nodes {
        key
      }
    }
  }
  `
}

export function constructValuesQuery(uids) {
  const baseKey = `${config.infoContract}.S`;
  // const fields = [
  //   "name",
  //   "names",
  //   "owner",
  //   "creator",
  //   "created",
  //   "description",
  //   "title",
  //   "thing",
  //   "type",
  //   "likes",
  //   "price:hold",
  //   "price:amount",
  //   "meta:royalty_percent",
  //   "meta:num_of_frames",
  //   "meta:speed",
  //   "meta:likes",
  //   "meta:proof"
  // ];

  let query = `query MyQuery {`;

  uids.forEach((uid, i) => {
    query += `
        i_${i}: allStates(
          filter: {key: {startsWith: "${baseKey}:${uid}"}}
        ) {
          nodes {
            key
            value
          }
        }
      `;
  });

  query += `}`;

  return query;
}

export const getAuctionThingQuery = (address, offset = 0) => {
  return `
  query MyQuery {
    allStates(
      filter: {
        key: {startsWith: "${config.auctionContract}.S:", endsWith: "${address}"}
        value: {equalTo: "True"}
        }
      orderBy: VALUE_DESC
      offset: ${offset}
    ) {
      nodes {
        key
        value
      }
    }
  }
  `
}

export function constructAuctionValuesQuery(uids) {
  const baseKey = `${config.auctionContract}.S`;

  let query = `query MyQuery {`;

  uids.forEach((uid, i) => {
    query += `
        i_${i}: allStates(
          filter: {key: {startsWith: "${baseKey}:${uid}"}}
        ) {
          nodes {
            key
            value
          }
        }
      `;
  });

  query += `}`;

  return query;
}

export const getAllCreatorsQuery = (offset = 0, take = 100) => {
  return `
  query AllCreatorsQuery {
    statesConnection: allStates(
      filter: {
        key: { startsWith: "${config.infoContract}.S:", endsWith: "creator" }
      }
    ) {
      aggregates {
        distinctCount {
          value
        }
      }
      groupedAggregates(groupBy: VALUE) {
        keys
        distinctCount {
          key
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
  `;
};

// Process creators data from the new aggregates-based query
export const processCreatorsFromAggregates = (data) => {
  if (!data || !data.statesConnection || !data.statesConnection.groupedAggregates) {
    return [];
  }
  
  // The keys array from groupedAggregates contains unique creator addresses
  // The distinctCount.key value gives us the count of NFTs created by each creator
  return data.statesConnection.groupedAggregates.map(group => ({
    address: group.keys[0],
    count: group.distinctCount.key
  }));
};

export const getSearchResultsQuery = (searchTerm, offset = 0, take = 10) => {
  const sanitizedSearch = searchTerm.trim();
  
  console.log("getSearchResultsQuery called with:", { searchTerm, sanitizedSearch, offset, take });
  
  // Return empty query if search term is too short
  if (sanitizedSearch.length < 2) {
    console.log("Search term too short, returning empty query");
    return `query SearchQuery { searchResults: allStates(first: 0) { nodes { key value } } }`;
  }
  
  const query = `
  query SearchQuery {
    # Search by title or description
    titleResults: allStates(
      filter: {
        key: {startsWith: "${config.infoContract}.S:", endsWith: "name"},
        value: {contains: "${sanitizedSearch}"}
      }
      first: ${take}
      offset: ${offset}
    ) {
      nodes {
        key
        value
      }
    }
    
    descriptionResults: allStates(
      filter: {
        key: {startsWith: "${config.infoContract}.S:", like: "%description%"},
        value: {contains: "${sanitizedSearch}"}
      }
      first: ${take}
      offset: ${offset}
    ) {
      nodes {
        key
        value
      }
    }
    
    # Search by creator or owner address
    creatorResults: allStates(
      filter: {
        key: {startsWith: "${config.infoContract}.S:", endsWith: "creator"},
        value: {contains: "${sanitizedSearch}"}
      }
      first: ${take}
      offset: ${offset}
    ) {
      nodes {
        key
        value
      }
    }
    
    ownerResults: allStates(
      filter: {
        key: {startsWith: "${config.infoContract}.S:", endsWith: "owner"},
        value: {contains: "${sanitizedSearch}"}
      }
      first: ${take}
      offset: ${offset}
    ) {
      nodes {
        key
        value
      }
    }
    
    # Search by UID (in key path)
    uidResults: allStates(
      filter: {
        key: {startsWith: "${config.infoContract}.S:", likeInsensitive: "%${sanitizedSearch}%"}
      }
      first: ${take}
      offset: ${offset}
    ) {
      nodes {
        key
      }
    }
  }`;
  
  console.log("Generated GraphQL query:", query);
  return query;
};

export const processSearchResults = (data) => {
  console.log("processSearchResults called with data:", data);
  
  if (!data) {
    console.log("No data provided to processSearchResults");
    return [];
  }
  
  const results = [];
  const processedIds = new Set();
  const processedAddresses = new Set(); // Track unique addresses for creators/owners
  
  // Helper to extract UID from key (format: "contract.S:uid:field")
  const extractUid = (key) => {
    const parts = key.split(':');
    const uid = parts.length > 1 ? parts[1] : null;
    console.log("Extracted UID from key:", { key, uid });
    return uid;
  };
  
  // Process title results
  if (data.titleResults?.nodes) {
    console.log("Processing title results:", data.titleResults.nodes.length);
    data.titleResults.nodes.forEach(node => {
      const uid = extractUid(node.key);
      if (uid && !processedIds.has(uid)) {
        results.push({
          type: 'artwork',
          uid: uid,
          matchField: 'title',
          value: node.value
        });
        processedIds.add(uid);
      }
    });
  }
  
  // Process description results
  if (data.descriptionResults?.nodes) {
    console.log("Processing description results:", data.descriptionResults.nodes.length);
    data.descriptionResults.nodes.forEach(node => {
      const uid = extractUid(node.key);
      if (uid && !processedIds.has(uid)) {
        results.push({
          type: 'artwork',
          uid: uid,
          matchField: 'description',
          value: node.value
        });
        processedIds.add(uid);
      }
    });
  }
  
  // Process creator results - deduplicate by address
  if (data.creatorResults?.nodes) {
    console.log("Processing creator results:", data.creatorResults.nodes.length);
    data.creatorResults.nodes.forEach(node => {
      const uid = extractUid(node.key);
      const address = node.value;
      
      // Only add this creator if we haven't seen this address yet
      if (uid && !processedAddresses.has(address)) {
        results.push({
          type: 'wallet',
          uid: uid,
          address: address
        });
        processedAddresses.add(address);
      }
    });
  }
  
  // Process owner results - deduplicate by address
  if (data.ownerResults?.nodes) {
    console.log("Processing owner results:", data.ownerResults.nodes.length);
    data.ownerResults.nodes.forEach(node => {
      const uid = extractUid(node.key);
      const address = node.value;
      
      // Only add this owner if we haven't seen this address yet
      if (uid && !processedAddresses.has(address)) {
        results.push({
          type: 'wallet',
          uid: uid,
          address: address
        });
        processedAddresses.add(address);
      }
    });
  }
  
  // Process UID results
  if (data.uidResults?.nodes) {
    console.log("Processing UID results:", data.uidResults.nodes.length);
    data.uidResults.nodes.forEach(node => {
      const uid = extractUid(node.key);
      if (uid && !processedIds.has(uid)) {
        results.push({
          type: 'uid',
          uid: uid
        });
        processedIds.add(uid);
      }
    });
  }
  
  console.log("Final processed search results:", results);
  return results;
};