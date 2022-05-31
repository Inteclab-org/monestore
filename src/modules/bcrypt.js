const { genSalt, hash, compare } = require("bcrypt")

module.exports.createCrypt = (password) => {
    let salt = genSalt(10)
    return hash(password, salt)
}

module.exports.compareCrypt = (password, data) => {
    return compare(password, data)
}