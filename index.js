// input validation module Joi
const Joi = require('joi')
// the require express statement returns a function
const express = require('express')
// make an instance of the express object class
const app = express()
// enable json parsing
app.use(express.json())

// hardcoded courses array
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

app.get('/api/courses', (req, res) => {
    res.send(courses)
})

app.get('/api/courses/:id', (req, res) => {
    // wildcard variable in url is inside req.params
    /* the params object contains the value of the variable parameters
    sent by the client
    so the params object in this case is { id: *whatever id the client entered* }
    this is also how query parameters are accessed, for e.g.
    /api/courses?sortBy=id
    in this case the request object would have a property query which would be
    req.query = { sortBy: "id" }
    this is used to provide optional info from the client side
    */
    // check if courses has course with id sent by client
    // array.find goes through each element and stops at that execution of the callback which
    // returns true
    const course = courses.find(element => element.id === parseInt(req.params.id))
    if (!course) { // return 404
        res.status(404).send('No course with given ID')
    }
    // actual reponse
    res.send(course)  
})

// make post request to course
app.post('/api/courses', (req, res) => {
    // validate function result
    const result = validateCourse(req.body)
    // input validation
    if (result.error) {
        // send error message
        res.status(400).send(result.error.details[0].message)
        return
    }
    // construct course
    const course = {
        id: courses.length + 1,
        name: req.body.name
    }
    // add course to array
    courses.push(course)
    // send course object back to client as confirmation, plus client needs info like id etc.
    res.send(course)
})

// PUT route to update specific course
app.put('/api/courses/:id', (req, res) => {
    // lookup course
    // if not found, return 404
    const course = courses.find(element => element.id === parseInt(req.params.id))
    if (!course) { // return 404
        res.status(404).send('No course with given ID')
        return
    }
    // validate
    // if invalid, return 400
    const result = validateCourse(req.body)
    // input validation
    if (result.error) {
        // send error message
        res.status(400).send(result.error.details[0].message)
        return
    }
    // update course
    course.name = req.body.name
    // return the updated course
    res.send(course)
})

// helper to validate input
function validateCourse(course) {
    // define course schema using Joi
    const schema = {
        name: Joi.string().min(3).required(),
    }
    // store result of Joi validation call
    const result = Joi.validate(course, schema)
    return result
}

// start listening on a given port, with callback function
// environment usually has PORT variable, otherwise use 3000
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
})