const express = require('express')
const router = express.Router()
const rp = require('request-promise')
const config = require('../config/config').readConfig()

const {
  findAllAppointmentByMenteeHandle,
  findAllAppointmentByCoachId
} = require('../io/database/appointments')

const {
  getTeamMemberHandles,
  getTeamIdByHandle
} = require('../io/database/teams')

router.get('/coach-schedule', (request, response) => {
  const coach_handle = request.idmUser.handle

  findAllAppointmentByCoachId(coach_handle)
    .then(appointments => {
      const activeAppointments = appointments.filter(
        appointment => !appointment.is_canceled
      )

      response.json(activeAppointments)
  })
})

router.get('/mentee-schedule', (request, response) => {
  const currentUserHandle = request.idmUser.handle

  findAllAppointmentByMenteeHandle(currentUserHandle)
    .then(appointments => {
      const activeAppointments = appointments.filter(
        appointment => !appointment.is_canceled
      )

      response.json(activeAppointments)
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

router.get('/teaminfo', (request, response, next) => {
  const handle = request.user.handle

  Promise.all([
    getTeamMemberHandles(handle),
    getTeamIdByHandle(handle)
  ]).then(([ teammates, team_id ]) => {
    return {
      team_id: team_id[0].team_id,
      teammates: teammates.rows.filter( teammate => teammate.handle !== handle )
    }
  }).then( teamInfo => response.json(teamInfo) )
  .catch( error => response.json( error ))

})

module.exports = router
