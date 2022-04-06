export default async function sendToChat(message) {

  const HTTP = `https://api.telegram.org/bot${process.env.VUE_APP_BOT_TOKEN}/sendMessage?chat_id=${process.env.VUE_APP_CHAT_ID}&parse_mode=html&text=${message}`
 console.log(HTTP)
  await fetch(HTTP)
    .then((response) => {
      console.log(response.json())
    })
    .catch((e) => {
      console.log(e)
      throw e
    })
}