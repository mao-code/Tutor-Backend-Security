class Response
{
    constructor(statusCode, isSuccess, message, data) {
        this.statusCode = statusCode;
        this.isSuccess = isSuccess;
        this.message = message;
        this.data = data;
    }

    toJson() {
        return {
            code: this.statusCode,
            isSuccess: this.isSuccess,
            message: this.message,
            data: this.data,
        };
    }

    send(res) {
        res.status(this.statusCode).json(this.toJson());
    }
}

module.exports = Response;
