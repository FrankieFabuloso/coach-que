exports.up = (knex, Promise) => {
  return knex.schema.createTable('requests', table => {
    table.increments('id').primary()
    table.integer('team_id')
    table.timestamps(true, true)
    table.timestamp('resolved_at')
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('requests')
}
