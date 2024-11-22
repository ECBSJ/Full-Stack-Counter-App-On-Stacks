import { updateSupa } from "@/lib/data"
import { CountsSchema } from "@/types"
import { StacksPayload } from "@hirosystems/chainhook-client"

export async function POST(request: Request) {
  // handle payload
  let payload: StacksPayload = await request.json()
  console.log(payload)

  let { apply, chainhook, rollback } = payload
  let { timestamp, transactions } = apply[0]
  let { transaction_identifier, metadata } = transactions[0]
  let { success, sender, kind } = metadata

  // extract data
  let extracted: CountsSchema = {
    transaction: transaction_identifier.hash,
    event: kind.type === "ContractCall" ? kind.data.method : "",
    status: success === true ? "success" : "failed",
    time: timestamp,
    sender: sender
  }

  // insert/update supabase
  const response = updateSupa(extracted)

  return Response.json(response)
}
