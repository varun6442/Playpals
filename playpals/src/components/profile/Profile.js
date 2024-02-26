import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Typography, Button } from '@material-ui/core';

import Spinner from '../common/Spinner';
import ProfileAbout from './ProfileAbout';
import { getCurrentProfile } from '../../actions/profileActions';
import styles from './Profile.scss';

class Profile extends Component {
  componentDidMount() {
    this.props.getCurrentProfile(this.props.match.params.id);
  }

  render() {
    const { user } = this.props.auth;
    const { profile, loading } = this.props.profile;

    let profileContent;

    if (profile === null || loading) {
      profileContent = <Spinner />;
    }
    else {
      if (Object.keys(profile).length > 0) {
        profileContent = (
          <ProfileAbout profile={profile} user={user} />
        );
      }
      else {
        profileContent = (
          <div className="profile">
            <Typography variant="overline" component="p" gutterBottom>
              <h1>Hey {user.name}</h1>
            </Typography>
            <Typography  gutterBottom>
              <h2><b>YOU HAVE NOT YET SETUP A PROFILE, PLEASE CREATE YOUR PROFILE NOW</b></h2>
            </Typography>
            <p></p>
            <Button className="primary-color profile-create marginB-2" component={Link} variant="contained" to="/create-profile">
              Create Profile
            </Button>
          </div>
        );
      }
    }

    return (
      <div >
        {profileContent}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
});

export default connect(mapStateToProps, { getCurrentProfile })(Profile); 