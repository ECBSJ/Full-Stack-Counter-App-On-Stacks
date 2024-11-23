"use server"

import { createClient } from "@stacks/blockchain-api-client"
import { createApiKeyMiddleware, createFetchFn } from "@stacks/common"
import { Cl, fetchCallReadOnlyFunction } from "@stacks/transactions"

const contractAddress = "SP355B7SVQQCJMZJN73V05Z97MF3YFZH274Q3AZG6"
const apiMiddleware = createApiKeyMiddleware({
  apiKey: process.env.NEXT_PUBLIC_HIRO_API_KEY!
})
const customFetchFn = createFetchFn(apiMiddleware)

export async function getTotalCount() {
  let result = await fetchCallReadOnlyFunction({
    contractAddress,
    contractName: "counter",
    functionName: "get-global-count",
    functionArgs: [],
    network: "mainnet",
    client: {
      fetch: customFetchFn
    },
    senderAddress: "SP355B7SVQQCJMZJN73V05Z97MF3YFZH274Q3AZG6"
  })

  return result
}

export async function getUserCount(userAddress: string) {
  let result = await fetchCallReadOnlyFunction({
    contractAddress,
    contractName: "counter",
    functionName: "get-user-count",
    functionArgs: [Cl.standardPrincipal(userAddress)],
    network: "mainnet",
    client: {
      fetch: customFetchFn
    },
    senderAddress: userAddress
  })

  return result
}

export async function getUserCountTokenBalance(userAddress: string) {
  let result = await fetchCallReadOnlyFunction({
    contractAddress,
    contractName: "count-token",
    functionName: "get-balance",
    functionArgs: [Cl.standardPrincipal(userAddress)],
    network: "mainnet",
    client: {
      fetch: customFetchFn
    },
    senderAddress: userAddress
  })

  return result
}

const client = createClient({
  baseUrl: "https://api.mainnet.hiro.so"
})

export async function getStxBalance(userAddress: string) {
  const { data } = await client.GET("/extended/v1/address/{principal}/stx", {
    params: {
      path: { principal: userAddress }
    },
    headers: {
      "x-api-key": process.env.NEXT_PUBLIC_HIRO_API_KEY!
    }
  })

  return data
}
