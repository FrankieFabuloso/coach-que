
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('feedback_questions', table => {
      table.increments('id').primary()
      table.string('question')
      table.string('user_type')
    }),

    knex.schema.createTable('feedback_answers', table => {
      table.increments('id').primary()
      table.integer('user_id').notNull()
      table.integer('question_id').notNull()
      table.integer('appointment_id').notNull()
      table.text('answer')
    })
  ])
  .then( _ => {
    const questions = [
      {question:'The mentees struggled enough before asking for help.', user_type: 'coach'},
      {question:'I felt useful in this coaching session.', user_type:'coach'},
      {question:'This coaching session useful.', user_type: 'mentee'},
      {question:'You felt heard and respected.', user_type: 'all'},
      {question:'Time was used efficiently.', user_type: 'all'},
      {question:'Open ended feedback.', user_type: 'all'},
    ]

    return knex
      .table('feedback_questions')
      .insert(questions)
  })
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('feedback_questions'),
    knex.schema.dropTable('feedback_answers')
  ])
};
