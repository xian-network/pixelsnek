export const getStateChangesQuery = (contractType, offset = 0) => {
  const infoQuery = `
  query MyQuery {
    allStateChanges(
      filter: { key: { startsWith: "con_pixel_frames_info_v0_1" } }
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
      filter: { key: { startsWith: "con_pixel_frames_auction_v0_1" } }
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

// export const getThing = (uid)=>{
//   return `
//   query MyQuery {
//     allStates(
//       filter: {key: {startsWith: "con_pixel_frames_info_v0_1", includes: "${uid}"}}
//     ) {
//       nodes {
//         key
//         value
//         updated
//       }
//     }
//   }
//   `
// }

export const getThingForSale = ()=>{
  return `
  query MyQuery {
    allStates(
      filter: {key: {startsWith: "con_pixel_frames_info_v0_1", endsWith: "price:amount"}, value: {greaterThan: 0}}
    ) {
      nodes {
        key
        value
      }
    }
  }
  `
}

export const getThingByUid = (uid)=>{
  return `
  query MyQuery {
    name: allStates(
      filter: {key: {equalTo: "con_pixel_frames_info_v0_1.S:${uid}:name"}}
    ) {
      nodes {
        value
      }
    }
    S_names: allStates(
      filter: {key: {equalTo: "con_pixel_frames_info_v0_1.S:names:${uid}"}}
    ) {
      nodes {
        value
      }
    }
    owner: allStates(
      filter: {key: {equalTo: "con_pixel_frames_info_v0_1.S:${uid}:owner"}}
    ) {
      nodes {
        value
      }
    }
    creator: allStates(
      filter: {key: {equalTo: "con_pixel_frames_info_v0_1.S:${uid}:creator"}}
    ) {
      nodes {
        value
      }
    }
    description: allStates(
      filter: {key: {equalTo: "con_pixel_frames_info_v0_1.S:${uid}:description"}}
    ) {
      nodes {
        value
      }
    }
    thing: allStates(
      filter: {key: {equalTo: "con_pixel_frames_info_v0_1.S:${uid}:thing"}}
    ) {
      nodes {
        value
        updated
      }
    }
    type: allStates(
      filter: {key: {equalTo: "con_pixel_frames_info_v0_1.S:${uid}:type"}}
    ) {
      nodes {
        value
      }
    }
    price_hold: allStates(
      filter: {key: {equalTo: "con_pixel_frames_info_v0_1.S:${uid}:price:hold"}}
    ) {
      nodes {
        value
      }
    }
    price_amount: allStates(
      filter: {key: {equalTo: "con_pixel_frames_info_v0_1.S:${uid}:price:amount"}}
    ) {
      nodes {
        value
      }
    }
    royalty: allStates(
      filter: {key: {equalTo: "con_pixel_frames_info_v0_1.S:${uid}:meta:royalty_percent"}}
    ) {
      nodes {
        value
      }
    }
    frames: allStates(
      filter: {key: {equalTo: "con_pixel_frames_info_v0_1.S:${uid}:meta:num_of_frames"}}
    ) {
      nodes {
        value
      }
    }
    speed: allStates(
      filter: {key: {equalTo: "con_pixel_frames_info_v0_1.S:${uid}:meta:speed"}}
    ) {
      nodes {
        value
      }
    }
    likes: allStates(
      filter: {key: {equalTo: "con_pixel_frames_info_v0_1.S:${uid}:meta:likes"}}
    ) {
      nodes {
        value
      }
    }
    proof: allStates(
      filter: {key: {equalTo: "con_pixel_frames_info_v0_1.S:${uid}:meta:proof"}}
    ) {
      nodes {
        value
      }
    }
  }
  `
}

export const getOwnedUids = (owner, offset=0)=>{
  return`
  query MyQuery {
    allStates(
      filter: {
        key: { startsWith: "con_pixel_frames_info_v0_1", endsWith: "owner" }
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
  return`
  query MyQuery {
    allStateChanges(
      filter: { key: { startsWith: "con_pixel_frames_info_v0_1" } }
      offset: ${offset}
    ) {
      nodes {
        key
      }
    }
  }
  `  
}