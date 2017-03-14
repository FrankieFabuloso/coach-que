import React, { Component } from 'react'
import { Link } from 'react-router'
import RaisedButton from 'material-ui/RaisedButton'
import ActivateCoach from './ActivateCoach'
import CoachAppointmentList from './CoachAppointmentList'
import fetchMethod from './fetchMethod'
import BottomNavigationLink from './BottomNavigation'
import {CANCELED_APPOINTMENT_PATH} from '../config/constants'

export default class CoachLanding extends Component {
  constructor() {
    super()
    this.state = {
      coachAppointments:[],
      fetchExecuted: false,
      clickedOnGoogle: false
    }
  }

  appointmentList() {
    fetchMethod('GET', '/api/v1/appointments/coach-schedule', null)
      .then( appointments =>
        this.setState({
          fetchExecuted: true,
          coachAppointments: appointments
        })
      )
  }

  cancelAppointment(appointment_id) {
    const canceledAppointment = confirm('Cancel appointment, is this Ok?')

    if (canceledAppointment) {
      return fetchMethod(
        'POST',
        CANCELED_APPOINTMENT_PATH,
        {appointment_id},
        this.appointmentList.bind( this )
      )
    }
  }

  renderAppointmentList() {
    const { coachAppointments, fetchExecuted } = this.state
    if( fetchExecuted ) {
      return (
        <CoachAppointmentList
          coachAppointments={coachAppointments}
          cancelAppointment={this.cancelAppointment.bind(this)} />
      )
    } else {
      return null
    }
  }

  loggedIntoGoogle() {
    this.setState({
      clickedOnGoogle: true
    })
  }

  render(){
    const { clickedOnGoogle } = this.state
    const { coach, updateCoachCallback } = this.props

    let coachOptions

    if (coach === null) {
      if (!clickedOnGoogle) {
        coachOptions = <center>
          <Link to="/google/auth" target="_blank">
            <RaisedButton
              label="Login to Google Calendar"
              fullWidth={true}
              primary={true}
              onClick={this.loggedIntoGoogle.bind(this)}
            />
          </Link>
          <Link to="/">
            <RaisedButton
              label="Back"
              fullWidth={true}
            />
          </Link>
          <BottomNavigationLink />
        </center>
      }
      else if (clickedOnGoogle) {
        coachOptions = <center>
          <ActivateCoach
            createCoach={true}
            updateCoachCallback={updateCoachCallback}
          />
          <Link to="/">
            <RaisedButton
              label="Back"
              fullWidth={true}
            />
          </Link>
          <BottomNavigationLink />
        </center>
      }
    } else {
      coachOptions = <center>
        <ActivateCoach
          activeCoach={coach.active_coach}
          updateCoachCallback={updateCoachCallback}
        />
        <RaisedButton
          label="See Your Appointments"
          onClick={this.appointmentList.bind(this)}
          fullWidth={true}
          backgroundColor="#c6fff3"
        />
        <Link to="/">
          <RaisedButton
            label="Back"
            fullWidth={true}
          />
        </Link>
        <div>{this.renderAppointmentList()}</div>
        <BottomNavigationLink />
      </center>
    }
    return coachOptions
  }
}
