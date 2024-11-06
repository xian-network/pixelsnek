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
      filter: {key: {startsWith: "${config.infoContract}", endsWith:"owner"}}
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
      filter: {key: {startsWith: "${config.infoContract}", endsWith: "price:amount"}, value: {greaterThan: 0}}
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

export const getNamesUid = (uid) => {
  return `
  query MyQuery {
    allStates(
      filter: {
        key: { startsWith: "${config.infoContract}", includes: "names", endsWith: "${uid}" }
      }
    ) {
      nodes {
        key
      }
    }
  }
  `
}