class ErrorResponse extends Error{
    constructor(message,statusCode){
        super (message)
        this.statusCode = statusCode
        console.log(`${statusCode} ${message} utils.js`)
    }
}

const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
        next(err)
    });
};

module.exports = {ErrorResponse,catchAsync}