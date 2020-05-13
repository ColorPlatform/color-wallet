import Ledger from "@colorplatform/color-ledger"
import {
  signWithPrivateKey,
  getStoredWallet,
  signWithPrivateKeywallet
} from "@colorplatformjs/color-keys"
import { signWithExtension } from "src/scripts/extension-utils"

export function getSigner(config, submitType = "", { address, password }) {
  if (submitType === `local`) {
    const wallet = getStoredWallet(address, password)
    return signMessage => {
      const signature = signWithPrivateKey(
        signMessage,
        Buffer.from(wallet.privateKey, "hex")
      )

      return {
        signature,
        publicKey: Buffer.from(wallet.publicKey, "hex")
      }
    }
  } else if (submitType === `ledger`) {
    return async signMessage => {
      const ledger = new Ledger(config)
      const publicKey = await ledger.getPubKey()
      const signature = await ledger.sign(signMessage)

      return {
        signature,
        publicKey
      }
    }
  } else if (submitType === `extension`) {
    return signMessage => {
      return signWithExtension(signMessage, address)
    }
  }
}

export function getSignSigner(
  config,
  submitType = "",
  Message,
  { address, password }
) {
  if (submitType === `local`) {
    const wallet = getStoredWallet(address, password)
    const message = [
      {
        signMessage: {
          message: Message
        }
      }
    ]
    var hash = signWithPrivateKeywallet(
      message[0].signMessage,
      Buffer.from(wallet.privateKey, "hex")
    )
    hash = hash.toString("base64")
    return hash
  } else if (submitType === `ledger`) {
    const message = [
      {
        signMessage: {
          message: Message
        }
      }
    ]
    const ledger = new Ledger(config)
    const publicKey = ledger.getPubKey()
    var hash = signWithPrivateKeywallet(
      message[0].signMessage,
      Buffer.from(wallet.privateKey, "hex")
    )
    hash = hash.toString("base64")

    const Ledgerhash = ledger.sign(hash)
    // return async signMessage => {
    //   const ledger = new Ledger(config)
    //   const publicKey = await ledger.getPubKey()
    //   const hash = await ledger.sign(signMessage)

    return {
      Ledgerhash,
      publicKey
    }
    // }
  } else if (submitType === `extension`) {
    const message = [
      {
        signMessage: {
          message: Message,
          msgs: [
            {
              type: "color/MsgSignMessage"
            }
          ]
        }
      }
    ]
    return signWithExtension(JSON.stringify(message[0].signMessage), address,message[0].signMessage.msgs[0].type)
  }
}
