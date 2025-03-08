export const config = {
    frameWidth: 25,
    totalPixels: 625,
    totalFrames: 8,
    infoContract: "con_pixel_frames_info_v0_3", // CHANGE
    masterContract: "con_pixel_frames_master_v0_4", // CHANGE
    auctionContract: "con_pixel_frames_auction_v0_8_2", // CHANGE
    networkType: "testnet", // CHANGE
    currencySymbol: "XIAN", // CHANGE
    domainName: "https://pixelsnek.xian.org", // CHANGE
    //blockExplorer: "http://localhost:1337", // CHANGE
    blockExplorer: "https://testnet-explorer.xian.org", // CHANGE
    masternode: "https://testnet.xian.org", // CHANGE
    graphqlEndpoint: "https://testnet.xian.org/graphql" // CHANGE
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