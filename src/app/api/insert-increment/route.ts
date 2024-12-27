import { deleteSupa, updateSupa } from "@/lib/data"
import { CountsSchema } from "@/types"
import {
  StacksPayload,
  StacksTransactionContractCallKind,
  StacksTransactionSmartContractEvent
} from "@hirosystems/chainhook-client"
import util from "util"

export async function POST(request: Request) {
  // handle payload
  let payload: StacksPayload = await request.json()
  console.log(util.inspect(payload, { showHidden: false, depth: null, colors: true }))

  let { apply, chainhook, rollback } = payload

  // check is event is applied
  if (apply.length > 0) {
    let { timestamp, transactions, metadata: applyMetadata } = apply[0]

    for (let transaction of transactions) {
      let { transaction_identifier, metadata } = transaction
      let { success, sender, kind, receipt } = metadata

      let { events } = receipt

      let filteredEvent = events.find(event => {
        return event.type === "SmartContractEvent"
      })

      let {
        action,
        sender: txSender,
        time
      } = (
        filteredEvent!.data as {
          contract_identifier: string
          raw_value: string
          topic: string
          value: { action: string; sender: string; time: number }
        }
      ).value

      // extract data
      let extracted: CountsSchema = {
        transaction: transaction_identifier.hash,
        event: action,
        status: success === true ? "success" : "failed",
        time: time,
        sender: txSender
      }

      // insert/update supabase
      const response = await updateSupa(extracted)

      return Response.json(response)
    }
  }

  // check if event is rolled back
  if (rollback.length > 0) {
    let { timestamp, transactions, metadata } = rollback[0]

    for (let transaction of transactions) {
      let { transaction_identifier, metadata } = transaction

      let response = await deleteSupa(transaction_identifier.hash)

      return Response.json(response)
    }
  }
}
