exports.up = function(knex, Promise) {
    return Promise.all([
    knex.schema.table('users', table => {
      table.string('email');
      table.specificType('calendar_ids', 'text[]')
    })
  ])
};

exports.down = function(knex, Promise) {
    return Promise.all([
    knex.schema.table('users', table => {
      table.dropColumn('email');
      table.dropColumn('calendar_ids');
    })
  ])
};
