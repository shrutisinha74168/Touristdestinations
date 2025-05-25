class ExpressError extends Error {
    constructor (statusCode, Message){
        super();
        this.statusCode =statusCode;
        this.meassage = message;
    }
}

    module.exports = ExpressError;