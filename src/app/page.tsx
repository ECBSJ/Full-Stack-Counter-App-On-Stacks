"use client"

import { createClient } from "@stacks/blockchain-api-client"
import { AppConfig, openContractCall, showConnect, UserSession } from "@stacks/connect"
import {
  Cl,
  cvToValue,
  fetchCallReadOnlyFunction,
  FungiblePostCondition,
  Pc,
  PostConditionMode,
  StxPostCondition
} from "@stacks/transactions"
import { useEffect, useState } from "react"

const appConfig = new AppConfig(["store_write", "publish_data"])
const userSession = new UserSession({ appConfig })

export default function Home() {
  const [connected, setConnected] = useState(false)
  const [globalCount, setGlobalCount] = useState(0)
  const [userCount, setUserCount] = useState(0)
  const [countBalance, setCountBalance] = useState(0)
  const [stxBalance, setStxBalance] = useState(0)

  let userAddress = ""

  if (userSession.isUserSignedIn()) {
    userAddress = userSession.loadUserData().profile.stxAddress.testnet
  }

  const contractAddress = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"

  function callIncrement() {
    openContractCall({
      contractAddress,
      contractName: "counter",
      functionName: "increment",
      functionArgs: [],
      postConditionMode: PostConditionMode.Deny,
      network: "devnet"
    })
  }

  let postCondition: FungiblePostCondition | StxPostCondition

  if (connected) {
    postCondition =
      countBalance >= 1
        ? Pc.principal(userAddress)
            .willSendEq(1)
            .ft("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.count-token", "count-token")
        : Pc.principal(userAddress).willSendEq(1000000).ustx()
  }

  function callDecrement() {
    openContractCall({
      contractAddress,
      contractName: "counter",
      functionName: "decrement",
      functionArgs: [],
      postConditions: [postCondition],
      postConditionMode: PostConditionMode.Deny,
      network: "devnet"
    })
  }

  async function getTotalCount() {
    let result = await fetchCallReadOnlyFunction({
      contractAddress,
      contractName: "counter",
      functionName: "get-global-count",
      functionArgs: [],
      network: "devnet",
      senderAddress: userAddress
    })

    setGlobalCount(Number(cvToValue(result)))
  }

  async function getUserCount() {
    let result = await fetchCallReadOnlyFunction({
      contractAddress,
      contractName: "counter",
      functionName: "get-user-count",
      functionArgs: [Cl.standardPrincipal(userAddress)],
      network: "devnet",
      senderAddress: userAddress
    })

    setUserCount(Number(cvToValue(result)))
  }

  async function getUserCountTokenBalance() {
    let result = await fetchCallReadOnlyFunction({
      contractAddress,
      contractName: "count-token",
      functionName: "get-balance",
      functionArgs: [Cl.standardPrincipal(userAddress)],
      network: "devnet",
      senderAddress: userAddress
    })

    setCountBalance(parseFloat(cvToValue(result).value!))
  }

  const client = createClient({
    baseUrl: "http://localhost:3999"
  })

  async function getStxBalance() {
    const { data } = await client.GET("/extended/v1/address/{principal}/stx", {
      params: {
        path: { principal: userAddress }
      }
    })

    setStxBalance(Number(data?.balance!) / 1000000)
  }

  function connectWallet() {
    showConnect({
      userSession,
      appDetails: {
        name: "Stacks-Counter",
        icon: "/vercel.svg"
      },
      onFinish(payload) {
        console.log(payload.userSession.loadUserData())
        setConnected(true)
      }
    })
  }

  function disconnectWallet() {
    userSession.signUserOut()
    setConnected(false)
  }

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      setConnected(true)
      setInterval(() => {
        getUserCount()
        getUserCountTokenBalance()
        getStxBalance()
      }, 3000)
    } else {
      setConnected(false)
    }

    setInterval(() => {
      getTotalCount()
    }, 3000)
  }, [connected])

  return (
    <div className="relative grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {connected ? (
        <div className="absolute top-10 right-10 flex gap-4 items-center flex-col sm:flex-row">
          <span>
            {stxBalance} STX | {countBalance} COUNT
          </span>
          <span>{userAddress.slice(0, 7) + "..." + userAddress.slice(-7)}</span>

          <button
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            onClick={disconnectWallet}
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          className="absolute top-10 right-10 rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      )}
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-xl font-bold">Stacks Counter</h1>
        <h3>The mother of all counters.</h3>
        <div className="text-2xl font-extrabold">🌐 Global Count: {globalCount}</div>
        <div className="flex gap-4 items-center">
          <span>Total Increments: 0</span>
          <span>Total Decrements: 0</span>
          <span>Counts in Mempool: 0</span>
        </div>
        {connected ? <div>🧑‍💻 Your Personal Count: {userCount}</div> : null}
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li>Connect with Bitcoin Web3 wallet.</li>
          <li>Increment global count and mint 1 COUNT.</li>
          <li>Decrement global count by burning 1 COUNT or 1 STX.</li>
        </ol>
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          {connected ? (
            <>
              <button
                onClick={callDecrement}
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
              >
                Decrement
              </button>
              <button
                onClick={callIncrement}
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
              >
                Increment
              </button>
            </>
          ) : null}
        </div>
      </main>
    </div>
  )
}
