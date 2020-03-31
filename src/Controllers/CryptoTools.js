const passwordHash = require('password-hash');
const crypto = require('crypto');

const cryptotools = {
    encrypt : (password) => {
        return passwordHash.generate(password);
    },
    verify : (password,hashedPassword) => {
        return passwordHash.verify(password, hashedPassword);
    },
    generateToken : () => {
        return crypto.randomBytes(64).toString('base64');
    }
};

module.exports = cryptotools;