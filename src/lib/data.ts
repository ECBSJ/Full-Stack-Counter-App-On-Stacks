import { CountsSchema } from "@/types"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function getSupa() {
  const { data: incrementTotal } = await supabase
    .from("counter")
    .select()
    .eq("event", "increment")
    .eq("status", "success")

  const { data: decrementTotal } = await supabase
    .from("counter")
    .select()
    .eq("event", "decrement")
    .eq("status", "success")

  const { data: mempoolTotal } = await supabase
    .from("counter")
    .select()
    .eq("status", "pending")

  let currentTotals = {
    incrementTotal,
    decrementTotal,
    mempoolTotal
  }

  return currentTotals
}

export async function insertSupa(insertData: CountsSchema) {
  const { data, error } = await supabase.from("counter").insert([insertData]).select()

  console.log("Inserted!", data)

  return data
}

export async function updateSupa(updateData: CountsSchema) {
  const { data, error } = await supabase
    .from("counter")
    .update({
      status: "success",
      time: updateData.time
    })
    .eq("transaction", updateData.transaction)
    .select()

  console.log("Updated!", data)

  return data
}
