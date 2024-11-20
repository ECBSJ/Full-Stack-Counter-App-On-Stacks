"use client"

import { AppConfig, showConnect, UserSession } from "@stacks/connect"
import Image from "next/image"
import { useEffect, useState } from "react"

const appConfig = new AppConfig(["store_write", "publish_data"])
const userSession = new UserSession({ appConfig })

export default function Home() {
  const [connected, setConnected] = useState(false)
  const [globalCount, setGlobalCount] = useState(0)
  const [userCount, setUserCount] = useState(0)

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
    } else {
      setConnected(false)
    }
  }, [])

  return (
    <div className="relative grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {connected ? (
        <div className="absolute top-10 right-10 flex gap-4 items-center flex-col sm:flex-row">
          <span>1 STX | 1 COUNT</span>
          <span>
            {userSession.loadUserData().profile.stxAddress.testnet.slice(0, 7) +
              "..." +
              userSession.loadUserData().profile.stxAddress.testnet.slice(-7)}
          </span>

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
              <button className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5">
                Decrement
              </button>
              <button className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5">
                Increment
              </button>
            </>
          ) : null}
        </div>
      </main>
    </div>
  )
}
