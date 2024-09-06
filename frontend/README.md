# Pixel Whale App

## Install Node.js
1. `cd ~`
2. `curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -`
3. `sudo apt-get install -y nodejs`
4. `apt-get install -y build-essential`

## Install MongoDB
Follow your OS specific install instructions [here](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu):

## Install PM2
1. `npm install pm2 -g`

## Install font config
1. `mv /etc/fonts /etc/fonts.bak`
2. `sudo apt install fontconfig --reinstall`

## Clone Repo
1. `https://github.com/Lamden/pixel_frames.git`
2. `cd pixel-frames`

## Create config file
1. `nano ./frontend/src/js/config.js`
2. paste below code and change indicated values
```javascript
export const config = {
    frameWidth: 25,
    totalPixels: 625,
    totalFrames: 8,
    infoContract: "con_pw_info_3", // CHANGE
    masterContract: "con_pw_master_3", // CHANGE
    networkType: "testnet", // CHANGE
    currencySymbol: "XIAN", // CHANGE
    domainName: "https://localhost", // CHANGE
    //blockExplorer: "http://localhost:1337", // CHANGE
    blockExplorer: "https://testnet.lamden.io", // CHANGE
    masternode: "https://testnet-master-1.lamden.io" // CHANGE
}

export const featureLocks = {
    auctions: {
        locked: false,
        whitelist: []
    }

}

export const socket_config = {
    host: "http:localhost", // DECIDE
    port: 5001 // CHANGE
}


export const stampLimits = (()=>{
    let stampValues = {}
    stampValues[config.masterContract] = {
        sell_thing: 90, // CHANGE
        like_thing: 90, // CHANGE
        transfer: 105, // CHANGE
        prove_ownership: 95 // CHANGE
    }
    stampValues['currency'] = {
        approve: 25
    }
    return stampValues
})()

```

## Create wallet approval
1. `nano ./frontend/src/js/wallet_approval.js`
2. paste below code and change indicated values
```javascript
/* /frontend/src/wallet_approval.js   */
import { config } from './config.js'

const approvalRequest = {
    appName: 'Pixel Whale Testing', // CHANGE
    version: '3.0', // CHANGE
    contractName: config.masterContract, 
    networkType: config.networkType
}

const charms = [
    {
        name: 'Owned', 
        variableName: "balances",
        key: "<wallet vk>",
        formatAs: "number",
        iconPath: "logo-192.png" 
    }
]
approvalRequest.charms = charms
approvalRequest.logo = 'wallet/logo.png'
approvalRequest.background = 'wallet/background.png'

export { approvalRequest };
```

## Environment template files
`.env.template` files have been provided in `database/` and `frontend/`. Remove the `.template` extension and change the values in the environment file or keep the `.env.template` files and copy their content to your own created `.env` files.