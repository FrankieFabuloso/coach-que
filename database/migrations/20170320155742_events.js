exports.up = (knex, Promise) => {
  return knex.schema.createTable('events', table => {
    table.increments('id').primary()
    table.integer('request_id')
    table.text('description')
    table.string('event_name')
    table.timestamps(true, true)
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('events')
}
