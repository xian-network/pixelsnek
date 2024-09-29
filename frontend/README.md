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
1. `https://github.com/xian-network/pixelwhale.git`
2. `cd pixelwhale`

## Use config file
Remove the `.template` extension from `./frontend/src/js/config.js.template` and change values according to your own preference.

## Use wallet_approval
Remove the `.template` extension from `./frontend/src/js/wallet_approval.js.template` and change values according to your own preference.


## Environment template files
`.env.template` files have been provided in `database/` and `frontend/`. Remove the `.template` extension and change the values in the environment file or keep the `.env.template` files and copy their content to your own created `.env` files.