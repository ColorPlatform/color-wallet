const dev = process.env.NODE_ENV === `development`
const stargate =
  process.env.STARGATE ||
  (dev
    ? `https://proxy.testnet.color-platform.rnssol.com:9071`
    : `https://proxy.mainbeta-3.color-platform.org:9061`)

const faucet =
  process.env.FAUCET ||
  (dev
    ? `https://proxy.testnet.color-platform.rnssol.com:8000/claim/wallet`
    : `https://getcoins.mainbeta-3.color-platform.org/claim/wallet`)

const shorturl =
  process.env.SHORTURL ||
  (dev
    ? `https://s.testnet.color-platform.rnssol.com/encode/`
    : `https://s.mainbeta-3.color-platform.org/encode/`)

const qrcode =
  process.env.QRCODE ||
  (dev
    ? `https://wallet.testnet.color-platform.rnssol.com`
    : `https://wallet.mainbeta-3.color-platform.org`)

const rpc =
  process.env.RPC ||
  (dev
    ? `https://rpc.testnet.color-platform.rnssol.com`
    : `https://rpc.mainbeta-3.color-platform.org`)

const chain = process.env.CHAIN || (dev ? `local-testnet` : `color-mainbeta-3`)

export default {
  name: `colorwallet`,
  development: dev,
  network: process.env.NETWORK || `local-testnet`,
  stargate,
  rpc,
  qrcode,
  faucet,
  shorturl,
  chain: chain,
  google_analytics_uid: process.env.GOOGLE_ANALYTICS_UID || "",
  sentry_dsn: process.env.SENTRY_DSN || "",
  node_halted_timeout: 120000,
  block_timeout: 10000,
  default_gas_price: dev ? 1e-9 : 2.5e-8, // recommended from Color Platform Docs
  version: process.env.RELEASE,

  // Ledger
  CosmosAppTestModeAllowed: false
}
