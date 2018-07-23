// the require express statement returns a function
const express = require('express')
// make an instance of the express object class
const app = express()
// enable json parsing
app.use(express.json())

const courses = [
    { id: 1, name: 'course1' },
    { id: 2, name: 'course2' },
    { id: 3, name: 'course3' },
]

// get method takes url and callback function
app.get('/', (req, res) => {
    // make response object
    res.send('Hello World!!!')
})

// start listening on a given port, with callback function
// environment usually has PORT variable, otherwise use 3000
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
})