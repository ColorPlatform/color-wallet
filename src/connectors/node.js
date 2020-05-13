"use strict"

import Color from "@colorplatformjs/color-api"
import RpcWrapper from "./rpcWrapper.js"

export default function Connector(stargateUrl) {
  const client = new Color(stargateUrl, "no_address")
  const newRpcClient = RpcWrapper(client)

  Object.assign(client, newRpcClient)

  return client
}
