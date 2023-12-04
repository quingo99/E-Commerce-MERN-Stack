const bcrypt = require("bcryptjs");

const salt = bcrypt.genSaltSync(10); // Use 'genSaltSync' instead of 'getSaltSync'

const hashPassword = password => bcrypt.hashSync(password, salt);
const comparePasswords = (inputPassword, hashedPassword) => bcrypt.compareSync(inputPassword, hashedPassword)

module.exports = { hashPassword, comparePasswords };
