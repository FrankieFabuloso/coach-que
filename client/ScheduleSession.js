import React, {Component} from 'react'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import Appointment from './Appointment'
import fetchMethod from './fetchMethod'
import MenteeAppointmentList from './MenteeAppointmentList'
import BottomNavigationLink from './BottomNavigation'
import {Link} from 'react-router'
import {CANCELED_APPOINTMENT_PATH} from '../config/constants'
import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()

export default class ScheduleSession extends Component {
  constructor() {
    super()
    this.state = {
      currentAppointments: [],
      menteeAppointments: [],
      menteeAppointmentsRequested: false,
      requestedSchedule: false,
      createdAppointment: null
    }
  }

  componentDidMount() {
    this.createAppointment()
  }

  cancelAppointment(appointment_id) {
    const canceledAppointment = confirm('Cancel appointment, is this Ok?')

    if (canceledAppointment) {
      return fetchMethod(
        'POST',
        CANCELED_APPOINTMENT_PATH,
        {appointment_id},
        this.menteeAppointments.bind( this )
      )
    }
  }

  createAppointment() {
    return fetchMethod('GET', '/api/v1/appointments/teaminfo', null, teamInfo => {
      const pairs_github_handle = teamInfo.teammates.reduce( (accumulator, currentTeammate) => {
        return accumulator.concat(currentTeammate.handle)
      }, '')

      const path = '/calendar/find_next'
      const bodyContent = {
        pairs_github_handle,
        team_id: teamInfo.team_id
      }
      const callback = appointment => this.setState({
        requestedSchedule: true,
        createdAppointment: appointment
      })
      return fetchMethod('POST', path, bodyContent, callback)
    })
  }

  menteeAppointments() {
    return fetchMethod('GET', '/api/v1/appointments/mentee-schedule', null)
      .then(appointments => this.setState({
        menteeAppointmentsRequested: true,
        menteeAppointments: appointments
          ? appointments
          : null
        })
      )
  }

  renderAppointmentCard() {
    const createdAppointment = this.state.createdAppointment
    return this.state.requestedSchedule
      ? <Appointment createdAppointment={createdAppointment} />
      : null
  }

  renderMenteeAppointments() {
    const menteeAppointments = this.state.menteeAppointments
    if( this.state.menteeAppointmentsRequested ) {
      return (
        <MenteeAppointmentList
          menteeAppointments={menteeAppointments}
          cancelAppointment={this.cancelAppointment.bind(this)} />
      )
    } else {
      return null
    }
  }

  render() {
    return <center>
      <RaisedButton
        onClick={this.menteeAppointments.bind(this)}
        label="My Scheduled Appointments"
        primary={true}
        fullWidth={true}
      />
      <Link to="/">
        <RaisedButton
          label="Back"
          fullWidth={true}
        />
      </Link>
      <div>{this.renderAppointmentCard()}</div>
      <div>{this.renderMenteeAppointments()}</div>
      <BottomNavigationLink  />
    </center>
  }
}
