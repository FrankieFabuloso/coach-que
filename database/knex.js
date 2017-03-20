const Knex = require('knex')
require('../configuration/environment')
const configuration = require('./knexfile')[process.env.NODE_ENV]

const knex = Knex(configuration)

module.exports = knex
