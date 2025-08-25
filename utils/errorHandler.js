class APIError extends Error {
    constructor(status, message){
        super(message);
        this.status = status;
        this.name = "APIError";
    }
}

module.exports = APIError;