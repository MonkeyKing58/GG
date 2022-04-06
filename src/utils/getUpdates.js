export default async function getUpdates() {

  let
    chatKostya = '',
    chatMisha = '',
    chatDate = ''

  await fetch(`https://api.telegram.org/bot${process.env.VUE_APP_BOT_TOKEN}/getUpdates`)
    .then(response => {
      return response.json()
    })
    .then(ALL_MESSAGES => {
      // console.log(ALL_MESSAGES)
      let 
        i = ALL_MESSAGES.result.length,
        message = '',
        slashPos = 0,
        tempPos = 0
      while(i) {
        i--
        message = ALL_MESSAGES.result[i].message.text
        chatDate = ALL_MESSAGES.result[i].message.date
        slashPos = message.indexOf('/',0)
        
        if (slashPos >= 0) {

          tempPos = slashPos
          while(tempPos > 0) {
            tempPos--
            if(!(message[tempPos] >= '0') && (message[tempPos] <= '9'))
              break
          }
          chatMisha = message.slice(tempPos,slashPos)

          tempPos = slashPos
          while(tempPos < message.length) {
            tempPos++
            if(!(message[tempPos] >= '0') && (message[tempPos] <= '9'))
              break
          }
          chatKostya = message.slice(slashPos+1,tempPos)

          break
        }
      }
    })
    .catch(e => {
      return e
    })
console.log(chatKostya)
    return {
      chatMisha: chatMisha,
      chatKostya: chatKostya,
      chatDate: chatDate
    }
}