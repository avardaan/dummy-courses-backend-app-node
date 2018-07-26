// example of a custom middleware function
// takes in request, response, and the next function in the request processing pipeline
// next has to be called or the pipeline is halted
const log = (req, res, next) => {
    console.log('Logging...')
    next()
}

module.exports = log