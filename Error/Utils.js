class ErrorResponse extends Error{
    constructor(message,statusCode){
        super (message)
        this.statusCode = statusCode
    }
}

const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
        next(err)
    });
};

module.exports = {ErrorResponse,catchAsync}