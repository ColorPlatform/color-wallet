#!/bin/sh
# This is a comment!

if [ "$1" = "staging" ]
then
  echo Building wallet with staging Enviorment

 QRCODE=https://wallet.testnet.color-platform.rnssol.com FAUCET=https://proxy.testnet.color-platform.rnssol.com:8000/claim/wallet SHORTURL=https://s.testnet.color-platform.rnssol.com/encode/ CHAIN=local-testnet STARGATE=https://proxy.testnet.color-platform.rnssol.com:9071 RPC=https://rpc.testnet.color-platform.rnssol.com yarn build

elif [ "$1" = "production" ]
then
  echo Building wallet with production Enviorment

 QRCODE=https://wallet.mainbeta-3.color-platform.org FAUCET=https://getcoins.mainbeta-3.color-platform.org/claim/wallet SHORTURL=https://s.mainbeta-3.color-platform.org/encode/ CHAIN=color-mainbeta-3.1 STARGATE=https://wallet.mainbeta-3.color-platform.org/lcd/ RPC=https://rpc.mainbeta-3.color-platform.org yarn build
else 
  echo Environment not provided, e.g staging
fi

#npm install
#STARGATE=https://proxy.mainbeta-2.color-platform.rnssol.com:9071 RPC=https://rpc.mainbeta-2.color-platform.rnssol.com yarn build
#yarn serve:dist


