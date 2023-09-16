
export const getUsers = async (offset = 0):Promise<any> => {
  const res = await fetch("https://misskey.neos.love/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      limit: 100,
      offset: offset,
    })
  })
  const json = await res.json()
  if (json.length > 1) {
    return json.concat(await getUsers(offset + 100))
  } else {
    return json
  }
}
