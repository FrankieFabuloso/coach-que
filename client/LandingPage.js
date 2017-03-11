import React, {Component}  from 'react'
import ScheduleButton from './ScheduleButton'
import RaisedButton from 'material-ui/RaisedButton'
import BottomNavigationLink from './BottomNavigation'
import {Link} from 'react-router'
import fetchMethod from './fetchMethod'
import CoachList from './CoachList'
import MenteeAppointmentList from './MenteeAppointmentList'

export default class LandingPage extends Component {
  constructor() {
    super()
    this.state = {
      coachesList:[],
      menteeAppointments: [],
      menteeAppointmentsRequested: false,
      fetchExecuted: false
    }
  }

  coachList() {
    const path = '/api/v1/coaches/active'
    const callback = coaches => {
      this.setState({
        coachesList: coaches,
        fetchExecuted: true
      })
    }
    return fetchMethod('GET', path, null).then(callback)
  }

  renderCoachList() {
    const { coachesList, fetchExecuted } = this.state
    return fetchExecuted
      ? <CoachList coaches={coachesList} />
      : null
  }

  menteeAppointments() {
    return fetchMethod('GET', '/api/v1/appointments/mentee-schedule', null)
      .then( appointments =>
        this.setState({
          menteeAppointmentsRequested: true,
          menteeAppointments: appointments
        })
      )
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

  cancelAppointment(appointment_id) {
    const canceledAppointment = confirm('Cancel appointment, is this Ok?')

    if (canceledAppointment) {
      return fetchMethod(
        'POST',
        CANCELED_APPOINTMENT_PATH,
        { appointment_id },
        this.menteeAppointments.bind( this )
      )
    }
  }

  render() {
    return <center>
      <ScheduleButton />
      <Link to={"/coach_landing"} >
        <RaisedButton
          label="I'm a Coach"
          fullWidth={true}
          backgroundColor="#9af0e2" />
      </Link>
      <RaisedButton
        label="View My Feedback"
        fullWidth={true}
        onClick={this.menteeAppointments.bind(this)}
        backgroundColor="#d5f7f2" />
      <RaisedButton
        label="Who's coaching?"
        onClick={this.coachList.bind(this)}
        fullWidth={true}
      />
      <div>{this.renderCoachList()}</div>
      <div>{this.renderMenteeAppointments()}</div>
      <BottomNavigationLink  />
    </center>

  }
}
