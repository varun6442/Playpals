import React, { Component } from 'react';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import './Profile.scss';
import { getAllEvents, getEvents } from '../../actions/eventActions';
import { connect } from 'react-redux';
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import { TextField, Button } from '@mui/material';
import { Chart } from "react-google-charts";
import { updateUser } from '../../actions/authActions';
import { withRouter } from 'react-router-dom';

class ProfileAbout extends Component {
  constructor() {
    super();
    this.state = {
      currentNav: 1,
      currentTab: 1,
      password: "",
      password2: "",
      confirmPassword: "",
      filteredEvents: []
    };
    this.onChange = this.onChange.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
  }

  componentDidMount() {
    this.props.getEvents();
  }

  switchSideNav(tab) {
    this.setState({ currentNav: tab })
  }
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  updatePassword() {
    let data = {
      password: this.state.password,
      password2: this.state.password2
    }
    this.props.updateUser(data, this.props.history);
  }

  render() {
    let navContent;
    const { profile } = this.props;
    const { events } = this.props.events;
    const filteredEvents = [];
    const playerDataMap = {};
    const playerDatachart = [];
    events.forEach(data => {
      data.playerList.filter(fevent => {
        if (fevent.id == profile.profileUserName._id) {
          filteredEvents.push(data);
        }
      })
    })
    filteredEvents.forEach(data => {
      if (data.sportType in playerDataMap)
        playerDataMap[data.sportType]++;
      else
        playerDataMap[data.sportType] = 1;
    })
    for (let key in playerDataMap) {
      playerDatachart.push([key, playerDataMap[key]])
    }
    playerDatachart.unshift(["Sports", "Total Matches Played"]);
    if (this.state.currentNav == 1) {
      if (filteredEvents.length) {
        navContent = <div className='allBookings'>
          {filteredEvents.map(event =>
            <div key={event._id} className="eventList">
              <div>
                <div className='eventTitle'>{event.eventName}</div>
                <div className='eventDescription'>{event.description}</div>
                <div className='eventDate'>{new Date(event.eventDate).toDateString()}</div>
              </div>
              <img src={event.imageURL} width="300px" height="auto"></img>
            </div>
          )}
        </div>
      } else {
        navContent = <div>No Booking for the Current User</div>
      }

    } else if (this.state.currentNav == 2) {

      navContent = <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={filteredEvents.map(data => {
          return {
            title: data.eventName,
            date: data.eventDate
          }
        })}
      />
    } else if (this.state.currentNav == 3) {
      navContent =
        <div>
          <div className="editProfile">
            <TextField
              id="outlined-required"
              label="Name"
              disabled="true"
              value={profile.profileUserName.name}
            /><br></br>
            <TextField
              id="outlined-required"
              label="Email"
              disabled="true"
              value={profile.profileUserName.email}
            /><br></br>
            <TextField
              id="outlined-required"
              label="Password"
              value={this.state.password}
              name="password"
              onChange={this.onChange}
            /><br></br>
            <TextField
              id="outlined-required"
              label="Confirm Password"
              name="password2"
              value={this.state.password2}
              onChange={this.onChange}
            /><br></br>
          </div>
          <Button variant="contained" color="success" className='saveButton' onClick={this.updatePassword}>Update Password</Button>
        </div>
    } else {
      const data = playerDatachart;
      const options = {
        title: "Player Sports Statistics",
      };
      navContent = <Chart
        chartType="PieChart"
        data={data}
        options={options}
        width={"100%"}
        height={"400px"}
      />
    }
    return (
      <div>
        <div className='profileContainer'>
          <div className="leftSidebar">
            <div className='userDetails'>
              <h4><b>{profile.profileUserName.name}</b></h4>
              <h4>{profile.profileUserName.email}</h4>
            </div>
            <div className='profileDetails'>
              <div className={`listItems ${this.state.currentNav == 1 ? 'active' : ''}`} onClick={this.switchSideNav.bind(this, 1)}><BookmarkBorderIcon /><span className='listText'> All Bookings</span></div>
              <div className={`listItems ${this.state.currentNav == 2 ? 'active' : ''}`} onClick={this.switchSideNav.bind(this, 2)}><BookmarkBorderIcon /><span className='listText'>Schedule</span></div>
              <div className={`listItems ${this.state.currentNav == 3 ? 'active' : ''}`} onClick={this.switchSideNav.bind(this, 3)}><BookmarkBorderIcon /> <span className='listText'>Edit Profile</span></div>
              <div className={`listItems ${this.state.currentNav == 4 ? 'active' : ''}`} onClick={this.switchSideNav.bind(this, 4)}><BookmarkBorderIcon /> <span className='listText'>Stats</span></div>
            </div>
          </div>
          <div className='rightContent'>
            <div className='allBookings'>
              {navContent}
            </div>
          </div>
        </div>
      </div>

    );
  }
}



const mapStateToProps = (state) => ({
  events: state.events
});

export default connect(mapStateToProps, { getAllEvents, getEvents, updateUser })(withRouter(ProfileAbout));