export const config = {
    frameWidth: 25,
    totalPixels: 625,
    totalFrames: 8,
    infoContract: "con_pixel_frames_info", // CHANGE
    masterContract: "con_pixel_frames", // CHANGE
    auctionContract: "con_pixel_frames_auction_v0_1", // CHANGE
    networkType: "mainnet", // CHANGE
    currencySymbol: "XIAN", // CHANGE
    domainName: "https://localhost", // CHANGE
    //blockExplorer: "http://localhost:1337", // CHANGE
    blockExplorer: "https://explorer.xian.org", // CHANGE
    masternode: "https://node.xian.org", // CHANGE
    graphqlEndpoint: "https://node.xian.org/graphql" // CHANGE
}

export const featureLocks = {
    auctions: {
        locked: false,
        whitelist: []
    }
}

export const socket_config = {
    host: "http:localhost", // DECIDE
    port: 3001 // CHANGE
}


export const stampLimits = (()=>{
    let stampValues = {}
    stampValues[config.masterContract] = {
        buy_thing: 90, // CHANGE
        sell_thing: 90, // CHANGE
        like_thing: 90, // CHANGE
        transfer: 105, // CHANGE
        prove_ownership: 95 // CHANGE
    }
    stampValues['currency'] = {
        approve: 25
    }
    stampValues[config.auctionContract] = {
        bid: 30,
        end_auction: 90
    }
    return stampValues
})()
