const passwordHash = require('password-hash');

const encrypt = (password) => {
    if(password) return null;
    return passwordHash.generate(password);
};

const verify = (password,hashedPassword) => {
    if(password) return null;
    if(hashedPassword) return null;
    return passwordHash.verify(password, hashedPassword);
};