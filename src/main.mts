import express from "express"
import {getUsers} from "./lib.mjs";

const app = express()
app.use(express.json())
app.listen(5000, () => {
  console.log("server started at localhost:3000")
})

let cache = ""

app.get("*", async (req, res) => {
  res.header('Content-Type', 'text/plain;charset=utf-8')
  return res.send(cache)
})

const updateData = async () => {
  const data = await getUsers()
  cache = makeGaugeText(data)
}

const makeGaugeText = (data: any) => {
  return `# HELP user_notes ユーザのノート数
# TYPE user_notes counter
${data.map(userMetrics).join("\n")}
`
}

const userMetrics = (user: {id: string, username: string, notesCount: string}) => {
  return `user_notes{user_id="${user.id}" username="${user.username}"} ${user.notesCount}`
}

// 初回取得
await updateData()

// 1分に1回更新
setInterval(async () => await updateData() , 60 * 1000)
