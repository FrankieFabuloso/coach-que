const express = require('express')
const router = express.Router()

const {findFirstAppointment} = require('../models/appointment')
const {
  createAppointment, 
  findActiveCoaches
} = require('../io/database/appointments')

router.get('/', (req, res, next)  => {
  //getting these from chat
  let { 
    appointment_length, 
    description, 
    attendees
  } = req.params
  

  let date = findFirstAppointment(activeCoaches, appointment_length)

  let appointmentData = {
    coach_handle: coach_handle,
    date_time: date,
    appointment_length: appointment_length,
    description: description,
    attendees: attendees
  }

  createAppointment(appointmentData)
    .then( apptDetails => res.json({apptDetails}))
})

module.exports = router
