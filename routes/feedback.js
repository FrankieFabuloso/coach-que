const express = require('express')
const router = express.Router()
const db = require('../io/database/feedback')

const { findLearnerByHandle} = require('../io/database/teams')

router.post('/:appointment_id', (request, response) =>{
  const feedbackAnswers = request.body
  const { appointment_id } = request.params
  const user_handle = request.idmUser.handle
  findLearnerByHandle( user_handle)
    .then( user => {
      return db.insertFeedback( constructAnswersArray( feedbackAnswers, appointment_id, user.id ) )
    })
    .then( insertedFeedback => response.json(insertedFeedback))
})

router.get('/questions/mentee', (request, response) => {
  db.findAllFeedbackQuestionsByType('mentee')
    .then( questions => { response.json(questions) } )
})

router.get('/questions/coach', (request, response) => {
  db.findAllFeedbackQuestionsByType('coach')
    .then( questions => { response.json(questions) } )
})

const constructAnswersArray = ( answers, appointment_id, user_id ) =>
  Object.keys(answers).map( key => {
    return { user_id, appointment_id, question_id: key, answer: answers[key] }
  })


module.exports = router
