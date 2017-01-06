import React, {Component} from 'react'
import {Card, CardText} from 'material-ui/Card'
import moment from 'moment'
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

export default class MenteeApptList extends Component {
  render() {
    const menteeAppointments = this.props.menteeAppointments
    const appointmentRows = menteeAppointments.sort((apptA, apptB) => {
      return moment(apptB.appointment_end) - moment(apptA.appointment_end)})
        .map(appointment => {
          const startTime = moment(appointment.appointment_start).format('h:mm a')
          const endTime = moment(appointment.appointment_end).format('h:mm a')
          const apptDate = moment(appointment.appointment_start).format('MMMM Do YYYY')
          const mentees = appointment.mentee_handles.join(", ")

          return <TableRow>
            <TableRowColumn>{mentees}</TableRowColumn>
            <TableRowColumn>{appointment.coach_handle}</TableRowColumn>
            <TableRowColumn>{appointment.appointment_length}</TableRowColumn>
            <TableRowColumn>{apptDate}</TableRowColumn>
            <TableRowColumn>{startTime}</TableRowColumn>
            <TableRowColumn>{endTime}</TableRowColumn>
          </TableRow>
      })

    return <Table>
      <TableHeader displaySelectAll={false}
        adjustForCheckbox={false}>
        <TableRow>
          <TableHeaderColumn>Mentees</TableHeaderColumn>
          <TableHeaderColumn>Coach</TableHeaderColumn>
          <TableHeaderColumn>Length</TableHeaderColumn>
          <TableHeaderColumn>Date</TableHeaderColumn>
          <TableHeaderColumn>Start Time</TableHeaderColumn>
          <TableHeaderColumn>End Time</TableHeaderColumn>
        </TableRow>
      </TableHeader>
        <TableBody displayRowCheckbox={false}>{appointmentRows}</TableBody>
    </Table>
  }
}
