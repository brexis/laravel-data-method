const express = require('express')
const app = express()
const port = 3333

app.use(express.static('.'));

app.post('/', (request, response) => {
  response.send('Submit!')
})

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})
