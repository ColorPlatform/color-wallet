import { parseTx, parseFee, parseValueObj } from "scripts/parsers"

const signedMessage = {
  type: "auth/StdTx",
  value: {
    msg: [
      {
        type: "color/MsgSend",
        value: {
          amount: [
            {
              amount: "10000000",
              denom: "CLR"
            }
          ],
          from_address: "color1ek9cd8ewgxg9w5xllq9um0uf4aaxaruvcw4v9e",
          to_address: "color1324vt5j3wzx0xsc32mjhkrvy5gn5ef2hrwcg29"
        }
      }
    ],
    fee: {
      amount: [
        {
          amount: "40",
          denom: "CLR"
        }
      ],
      gas: "39953"
    },
    memo: "(Sent via Color Wallet)",
    nonce: "12345"
  }
}

const signedActionMessage = {
  type: "auth/StdTx",
  value: {
    msg: [
      {
        type: "color/MsgDelegate",
        value: {
          amount: [
            {
              amount: "10000000",
              denom: "CLR"
            }
          ],
          from_address: "color1ek9cd8ewgxg9w5xllq9um0uf4aaxaruvcw4v9e",
          to_address: "color1324vt5j3wzx0xsc32mjhkrvy5gn5ef2hrwcg29"
        }
      }
    ],
    fee: {
      amount: [
        {
          amount: "40",
          denom: "CLR"
        }
      ],
      gas: "39953"
    },
    memo: "(Sent via Color Wallet)",
    nonce: "12345"
  }
}

describe(`parsers helper`, () => {
  it(`should parse a signedmessaged ParseTx`, () => {
    const shortMessage = {
      tx: {
        type: "auth/StdTx",
        value: {
          msg: "some message",
          fee: 0.01,
          memo: "Sent from Color Wallet",
          nonce: "12345"
        }
      }
    }
    expect(
      parseTx(
        `{"msgs":"some message","fee":0.01,"memo":"Sent from Color Wallet","nonce":"12345"}`
      )
    ).toMatchObject(shortMessage)
  })

  it(`should parse a signedmessaged parseFee`, () => {
    expect(parseFee(signedMessage)).toBe(40)
  })

  it(`should parse a signedmessaged parseValueObj`, () => {
    const parsedValueObj = {
      amount: "10000000",
      denom: "CLR"
    }
    expect(parseValueObj(signedMessage)).toMatchObject(parsedValueObj)
  })

  it(`should parse a signedActionMessage parseValueObj`, () => {
    const parsedValueObj = [
      {
        amount: "10000000",
        denom: "CLR"
      }
    ]
    expect(parseValueObj(signedActionMessage)).toMatchObject(parsedValueObj)
  })
})
