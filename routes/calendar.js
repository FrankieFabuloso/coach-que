const express = require('express')
const router = express.Router()
const _ = require('lodash')
const moment = require('moment-timezone')
const gcal = require('google-calendar')

const {
  createAppointment,
  findAppointmentById,
  checkActiveMenteeAppointmentByMenteeHandle
} = require('../io/database/appointments')

const {getActiveCoaches,
       updateUserByHandle,
       findUserByHandle} = require('../io/database/users')
const {
  getAllCoachesNextAppts,
  requester,
  findCoach,
  cancelAppointmentHelper
} = require('../models/appointment')
const {extractCalendarIds,
       makeCalendarEvent} = require('../models/calendar')
const {ensureGoogleAuth} = require('../middleware')

const filterUnavailableCoaches = (coachesAppointmentData) => {
  return coachesAppointmentData.filter(
      (coachAppointmentData) => coachAppointmentData.earliestAppointment);
}

router.post('/find_next', (request, response) => {
  const requestingMenteeHandle = requester(request)
  const pairsGithubHandle = request.body.pairs_github_handle

  const currentTime = moment().tz('America/Los_Angeles')

  checkActiveMenteeAppointmentByMenteeHandle(requestingMenteeHandle)
    .then( results => { results.rows[0].count > 0
      ? response.json({
                error: 'Could not schedule appointment!',
                reason: 'you already have one!'
              })
      :  getActiveCoaches()
          .then(coachesArray => {
            console.log("big LOG")
            if (_.isEmpty(coachesArray)) {
              response.json({
                error: 'Could not book appointment.',
                reason: 'There are no active coaches.'
              })
            }
            return getAllCoachesNextAppts(coachesArray, currentTime)
          }).catch( error => console.log(error))
          .then(allCoachesNextAppointments => {
            const coachesWithAvailableAppointments = filterUnavailableCoaches(allCoachesNextAppointments);
            const sortedAppointments = coachesWithAvailableAppointments.sort((a, b) =>
              a.earliestAppointment.start > b.earliestAppointment.start
            )
            if(sortedAppointments[0]) {
              let earliestApptData = sortedAppointments[0]
              let {calendarId, earliestAppointment, google_token} = earliestApptData
              let event = makeCalendarEvent(earliestAppointment.start, earliestAppointment.end, requestingMenteeHandle, pairsGithubHandle)
              gcal(google_token).events.insert(calendarId, event, (error, data) =>
                error
                  ? response.status(500).json({error: error,
                                               google_token: google_token,
                                               calendarId: calendarId})
                  : createAppointment({
                    appointment_start: data.start.dateTime,
                    appointment_end: data.end.dateTime,
                    coach_handle: earliestApptData.github_handle,
                    appointment_length: 30,
                    description: `Coaching Appointment with ${requestingMenteeHandle} & ${pairsGithubHandle}.`,
                    mentee_handles: [requestingMenteeHandle, pairsGithubHandle],
                    event_id: data.id
                  })
                   .then(apptRecord => response.status(200).json(apptRecord)).catch( error => console.log(error))
              )
            } else {
              response.json({
                error: 'Could not schedule appointment!',
                reason: 'All coaches are booked.'
              })
            }
          }).catch( error => console.log(error))
      })
    })



router.all('/', ensureGoogleAuth, (request, response) => {
  response.json({message: `on page /calendar. Authenticated with google with accessToken:${request.session.access_token}`});
})

router.get('/test/:github_handle', (request, response) => {
    console.log('request.params.github_handle', request.params.github_handle)
  findUserByHandle(request.params.github_handle)
    .then(user => {
      console.log('user::', user);
      gcal(user.google_token).calendarList.list((error, calendarListResp) => {
        if (error) {
          response.send(500, error)
        } else {
          response.json(calendarListResp)
        }
    })
  })
})

router.post('/cancel_appointment', (request, response) => {
  const {appointment_id} = request.body

  findAppointmentById(request.body.appointment_id)
    .then(findCoach(request))
    .then(cancelAppointmentHelper(response, request, appointment_id))
})


module.exports = router
