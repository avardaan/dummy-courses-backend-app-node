// input validation module Joi
const Joi = require('joi')
// custom middleware example
const logger = require('./logger')
// the require express statement returns a function
const express = require('express')
// make an instance of the express object class
const app = express()
// enable json parsing
app.use(express.json())
// usage of custom middleware, the argument to app.use must be a function and not the result
// of a function call
// app.use(logger)

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

// GET method to obtain all courses
app.get('/api/courses', (req, res) => {
    res.send(courses)
})

// GET particular course
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
    if (!course) return res.status(404).send('No course with given ID') // return 404
    // actual reponse
    res.send(course)  
})

// make POST request to add course
app.post('/api/courses', (req, res) => {
    // validate function result
    const result = validateCourse(req.body)
    // input validation
    if (result.error) return res.status(400).send(result.error.details[0].message)
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
    if (!course) return res.status(404).send('No course with given ID')
    // validate
    // if invalid, return 400
    const result = validateCourse(req.body)
    // input validation
    if (result.error) return res.status(400).send(result.error.details[0].message) // send error message
    // update course
    course.name = req.body.name
    // return the updated course
    res.send(course)
})

// DELETE route
app.delete('/api/courses/:id', (req, res) => {
    // lookup course
    // if not found, return 404
    const course = courses.find(element => element.id === parseInt(req.params.id))
    if (!course) return res.status(404).send('No course with given ID')
    // find index of course object
    const index = courses.indexOf(course)
    // remove course at index
    courses.splice(index, 1)
    // return course
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