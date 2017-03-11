import knex from './knex'
import {createRecord, findRecord, findAll} from './utilities'

const insertFeedback = feedbackResponses =>
  createRecord( 'feedback_answers', feedbackResponses )

const findFeedbackByLearnerID = ( appointment_id, user_id ) =>
  knex
    .table('feedback_answers')
    .where({appointment_id, user_id})
    .returning('*')


const findAllFeedbackQuestionsByType = user_type =>
  knex
    .table('feedback_questions')
    .where({user_type})
    .orWhere('user_type', 'all')
    .returning('*')

module.exports = {
  insertFeedback,
  findFeedbackByLearnerID,
  findAllFeedbackQuestionsByType
}
