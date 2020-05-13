import Color from "@colorplatformjs/color-api"
import config from "src/config"
import { getSigner, getSignSigner } from "./signer"
import transaction from "./transactionTypes"
import { uatoms } from "scripts/num.js"
import verifySignature from "@colorplatformjs/color-keys"

export default class ActionManager {
  constructor() {
    this.context = null
    this.color = null
    this.message = null
  }

  setContext(context = null) {
    if (!context) {
      throw Error("Context cannot be empty")
    }
    this.context = context
    this.color = new Color(this.context.url || "", this.context.chainId || "")
  }

  readyCheck() {
    if (!this.context) {
      throw Error("This modal has no context.")
    }

    if (!this.context.connected) {
      throw Error(
        `Currently not connected to a secure node. Please try again when Color Wallet has secured a connection.`
      )
    }

    if (!this.message) {
      throw Error(`No message to send.`)
    }
  }

  messageTypeCheck(msgType) {
    if (!msgType) {
      throw Error("No message type present.")
    }

    const isKnownType = Object.values(transaction).includes(msgType)
    if (!isKnownType) {
      throw Error(`Invalid message type: ${msgType}.`)
    }
  }

  setMessage(type, transactionProperties) {
    if (!this.context) {
      throw Error("This modal has no context.")
    }

    this.messageTypeCheck(type)
    this.messageType = type
    this.message = this.color[type](
      this.context.userAddress,
      transactionProperties
    )
  }

  setSignMessage(transactionProperties) {
    if (!this.context) {
      throw Error("This modal has no context.")
    }
    function temp(a) {
      return a
    }
    this.message = temp(transactionProperties)
  }

  async simulate(memo) {
    this.readyCheck()
    const gasEstimate = await this.message.simulate({
      memo: memo
    })
    return gasEstimate
  }

  async send(memo, txMetaData) {
    this.readyCheck()

    const { gasEstimate, gasPrice, submitType, password } = txMetaData
    const signer = getSigner(config, submitType, {
      address: this.context.userAddress,
      password
    })

    if (this.messageType === transaction.WITHDRAW) {
      this.message = this.createWithdrawTransaction()
    }

    const { included, hash } = await this.message.send(
      {
        gas: String(gasEstimate),
        gasPrices: convertCurrencyData([gasPrice]),
        memo
      },
      signer
    )

    return { included, hash }
  }

  async sendSign(txMetaData) {
    const { Message, submitType, password } = txMetaData
    const hash = await getSignSigner(config, submitType, Message, {
      address: this.context.userAddress,
      password
    })
    return hash
  }

  async verify(txMetaData) {
    const { Message, PublicKey, PrivateKey } = txMetaData

    const message = [
      {
        signMessage: {
          message: Message
        }
      }
    ]

    var verify = verifySignature(
      message[0].signMessage,
      Buffer.from(PrivateKey, "base64"),
      Buffer.from(JSON.stringify(PublicKey), "base64")
    )
    return verify
  }

  createWithdrawTransaction() {
    const addresses = getTop5RewardsValidators(
      this.context.bondDenom,
      this.context.rewards
    )
    return this.createMultiMessage(
      transaction.WITHDRAW,
      this.context.userAddress,
      { validatorAddresses: addresses }
    )
  }

  // Withdrawing is a multi message for all validators you have bonds with
  createMultiMessage(type, senderAddress, { validatorAddresses }) {
    const messages = validatorAddresses.map(validatorAddress =>
      this.color[type](senderAddress, { validatorAddress })
    )
    return this.color.MultiMessage(senderAddress, messages)
  }
}

function convertCurrencyData(amounts) {
  return amounts.map(({ amount, denom }) => ({
    amount: toMicroAtomString(amount),
    denom
  }))
}

function toMicroAtomString(amount) {
  return String(uatoms(amount))
}

// // limitation of the block, so we pick the top 5 rewards and inform the user.
function getTop5RewardsValidators(bondDenom, rewardsObject) {
  // Compares the amount in a [address1, {denom: amount}] array
  const byBalanceOfDenom = denom => (a, b) => b[1][denom] - a[1][denom]
  const validatorList = Object.entries(rewardsObject)
    .sort(byBalanceOfDenom(bondDenom))
    .slice(0, 5) // Just the top 5
    .map(([address]) => address)

  return validatorList
}
