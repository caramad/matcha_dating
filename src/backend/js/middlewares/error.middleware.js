const io = require("socket.io-client");

const handleHttpError = (err, req, res, next) => {
//    console.error(err);

    const statusCode = err.status || 500;
    
    res.status(statusCode).json({
        errors: [{ msg: err.message }]
    });
};

const handleWsError = (error, socket, next) => {
	const message = error.message || "An unknown error occurred";
	console.error("❌ WebSocket Error:", message);

	if (socket) {
		socket.emit("error", { errors: [{ msg: message }] });
	}
};


module.exports = { handleWsError, handleHttpError };

