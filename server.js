const express = require('express')
const app = express()
const port = 5000


app.get('/', (request, response) => {
    response.send("hello world")
})

app.listen(port, () => console.log(`Server is running on port ${port}`))