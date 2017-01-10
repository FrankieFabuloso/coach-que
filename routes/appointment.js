const express = require('express')
const router = express.Router()
const rp = require('request-promise')
const config = require('../config/config').readConfig()

const {
  findAllAppointmentByMenteeHandle,
  findAllAppointmentByCoachId
} = require('../io/database/appointments')

router.get('/coach-schedule', (request, response) => {
  const coach_handle = request.idmUser.handle

  findAllAppointmentByCoachId(coach_handle)
    .then(appointments => {
      console.log('Coach Appointments', appointments);
      response.json(appointments)
  })
})

router.post('/mentee-schedule', (request, response) => {
  const currentUserHandle = request.idmUser.handle

  findAllAppointmentByMenteeHandle(currentUserHandle)
    .then(appointments => {
      console.log('Mentee appointment!!', appointments)
      response.json(appointments)
    })
})

router.get('/feedback', (request, response, next) =>{
  const options = {
    uri: 'https://api.typeform.com/v1/form/kDvUzF',
    qs: {
      key: process.env.TYPEFORM_API_KEY || config.typeform.API_KEY
    },
    headers: {'User-Agent': 'Request-Promise'},
    json: true
  }

  rp(options)
    .then(responses =>
      console.log('Did I get anything?', responses.responses[0].answers)
    )
    .catch(error => console.log(error))
})

module.exports = router
