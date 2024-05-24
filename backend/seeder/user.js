const bcrypt = require("bcryptjs")
const ObjectId = require("mongodb").ObjectId;
const users = [
      {
    name: 'admin',
    lastName: 'admin',
    email: 'admin@admin.com',
    password: bcrypt.hashSync('admin@admin.com', 10),
    isAdmin: true,
  },
  {
    _id: new ObjectId("6578ef15f6b8cb514f4632fe"),
    name: 'John',
    lastName: 'Doe',
    email: 'john@doe.com',
    password: bcrypt.hashSync('john@doe.com', 10),
    isAdmin: false,
  },
]

module.exports = users
