const errorHandler = (err, req, res, next) => {
    const error = {
        error: err,
        message: err.message || err.details[0].message || "Something went wrong!",
        ok: false
    }

    res.status(err.statusCode || 500).send(error)
}

module.exports = errorHandler