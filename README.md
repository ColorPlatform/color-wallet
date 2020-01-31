![Color-Wallet logo — spaceship blasting off](/src/assets/images/Colorblackplatform.png)

# Welcome to Color Wallet!

![CircleCI](https://circleci.com/gh/luniehq/lunie/tree/develop.svg?style=svg)

👋 Welcome to Color Wallet, the official wallet and UI for the Color Platform.

⚠️ This is beta software. **DO NOT** enter your Color fundraiser seed into Color Wallet. We will not ask for it and this is considered highly unsafe.

## Development Dependencies

Install the following dependencies if you wish to run Color Wallet on developer mode or contribute.

### Node

Color Wallet requires Node.js `>=10.13.0`. If you have a different version of Node.js installed, you can use `n` to install the correct version. The following command will use `n` to install it alongside your current version of Node.js.

```bash
npm i -g n && n 10.13.0
```

### Yarn

Yarn is a JS package manager we use to manage Color Wallet's dependencies. Download it [here](https://yarnpkg.com/lang/en/docs/install).

### Docker

To run a local tesnet for Color Wallet you will need [Docker](https://www.docker.com/) installed. You can download it [here](https://www.docker.com/get-docker).

### Ledger Color App

> **IMPORTANT:** Only use Ledger devices that you **bought factory new** or **trust fully**.

Color Wallet supports sending transactions through the `Color` app for [Ledger Nano](https://www.ledger.com/products/ledger-nano-s) hardware wallet. To install the `Cølor` app on your device you'll have to:

1. Download the Ledger Live app [here](https://www.ledger.com/pages/ledger-live)
2. Connect your Ledger via USB and update to the latest firmware
3. Go to the Ledger Live App Store, and download the `Cølor` application (this can take a while). **Note:** You may have to enable `Dev Mode` in the Ledger Live Settings to be able to download the `Cølor` application
4. Navigate to the `Cølor` app on your Ledger device

### Check out Color Wallet

With Node, Yarn and Docker installed, you're ready to check out the source code:

```bash
git clone https://github.com/ColorPlatform/color-wallet.git
cd color-wallet
yarn install
```

---

## Color Wallet Development

### Generate SSL certificates

First generate some SSL certificates and add them to your trusted certificates.

```bash
yarn certificates
```

### Run local testnet

You can simply start a docker based testnet and the frontend.

```bash
yarn startlocal
```

This will create a rich account. You need to import that account into Color Wallet:
- Sign In
- Use an existing address
- Recover with backup code
- Write Account Name & Password on your own wish 
- Use mnemonic (Seed Phrase): `release endorse scale across absurd trouble climb unaware actor elite fantasy chair license word rare length business kiss smoke tackle report february bid ginger`

You should now have a bunch of color to play with.

### Deploy

Create the bundle to deploy Color Wallet you can run:

```bash
yarn build:ui
```

If you want to set a particular `Stargate` (Color SDK REST API) or Tendermint's `RPC` endpoints:

```bash
STARGATE=<https://StargateAddress:port> RPC=<https://RPCAddress:port> yarn build:ui
```

## Release

Color Wallet has a automated release process. Every night the CI creates a new release PR. To release manually, run

```bash
yarn release
```

## Testing

If you would like to run all the tests you can run:

```bash
yarn test
```

### Unit tests

Color Wallet uses Jest to run unit tests. You can run _all_ the unit tests with the following command:

```bash
yarn test:unit
```

For a single test file (e.g. `PageValidator.spec.js`) run the unit tests like this to watch the tests whenever there are changes:

```bash
yarn watch PageValidator
```

### End to end tests

If you want to run them locally first start a testnet:

```bash
MAX_NODES=4 yarn testnet:start
```

Then run the tests:

```bash
yarn test:e2e
```

To run only some tests, provide a filter:

```bash
yarn test:e2e:serve
yarn test:e2e:local --filter send.spec.js
```

To run the e2e tests on multiple browsers use [Browserstack](https://www.browserstack.com/). You must set the environment variables `BROWSERSTACK_USERNAME` and `BROWSERSTACK_ACCESS_KEY` aquired from Browserstack first.

```bash
yarn test:e2e:serve
yarn test:e2e:browserstack
```

Finally stop the testnet when you are done:

```bash
yarn testnet:stop
```

### Code coverage

To check test coverage locally run following. It will spin up a webserver and provide you with a link to the coverage report web page.

```bash
yarn test:coverage
```

## Flags

A list of all environment variables and their purpose:

| Variable        | Values                      | default | Purpose                                                                                                                                                           |
|-----------------|-----------------------------|---------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `NODE_ENV`      | `production`, `development` |         |                                                                                                                                                                   |
| `CI`            | `true`, `false`             | `false` | Adds better structured output, makes a screenshot and adds logs to files (used on CircleCI).                                                                      |
| `ALLOW_CONSOLE` | `true`, `false`             | `false` | Unit tests fail if they use `console.error` or `console.warn`. To see the initial use/occurences of those callings, you can escape this behavior using this flag. |

## Thanks
