class Response{
    constructor(data, message, state = 0) {
        this.state = state;
        this.data = data;
        this.message = message;
    }
}

module.exports = Response;