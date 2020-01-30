#!/bin/sh
# This is a comment!

if [ "$1" = "staging" ]
then
  echo Building wallet with staging Enviorment

 QRCODE=https://wallet.mainbeta-2.color-platform.rnssol.com FAUCET=https://proxy.mainbeta-2.color-platform.rnssol.com:8000/claim/wallet SHORTURL=https://s.mainbeta-2.color-platform.rnssol.com/encode/ CHAIN=colors-test-01 STARGATE=https://proxy.mainbeta-2.color-platform.rnssol.com:9071 RPC=https://rpc.mainbeta-2.color-platform.rnssol.com yarn build

elif [ "$1" = "production" ]
then
  echo Building wallet with production Enviorment

 QRCODE=https://wallet.mainbeta-2.color-platform.org FAUCET=https://getcoins.mainbeta-2.color-platform.org/claim/wallet SHORTURL=https://s.mainbeta-2.color-platform.org/encode/ CHAIN=color-testnet-02 STARGATE=https://proxy.mainbeta-2.color-platform.org:9061 RPC=https://rpc.mainbeta-2.color-platform.org yarn build
else 
  echo Environment not provided, e.g staging
fi

#npm install
#STARGATE=https://proxy.mainbeta-2.color-platform.rnssol.com:9071 RPC=https://rpc.mainbeta-2.color-platform.rnssol.com yarn build
#yarn serve:dist


