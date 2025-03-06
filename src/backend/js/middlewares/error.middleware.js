module.exports = (err, req, res, next) => {
//    console.error(err); // Log for debugging

    const statusCode = err.status || 500;
    
    res.status(statusCode).json({
        errors: [{ msg: err.message }]
    });
};