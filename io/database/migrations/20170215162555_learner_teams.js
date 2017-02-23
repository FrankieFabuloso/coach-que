exports.up = knex =>
  knex.schema.createTable('learner-teams', table => {
    table.integer('learner_id')
    table.integer('team_id')
  })

exports.down = knex =>
  knex.schema.dropTable('learner-teams')
