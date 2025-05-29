class ExpressError extends Error {
    constructor(statusCode, message) {
        super(message); // parent class (Error) ko message dena zaroori hai
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError;
