import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Grid, IconButton, Avatar, Typography, Card, CardHeader, CardMedia, CardContent, CardActions, Container, Button, GridList } from '@material-ui/core';

import styles from './Home.scss';
import LandingImg from '../../img/landing.jpeg';
import Logo from '../../img/logo-no-background.png';

class Home extends Component {
  onLogoutClick(e) {
    e.preventDefault();
    this.props.logoutUser();
  }

  render() {
    const { isAuthenticated } = this.props.auth;

    const guestLinks = (
      <div className="header__buttons">
        <Button className="primary-color marginR-1" component={Link} to="/register" variant="contained" size="large">
          Get Started
        </Button>
        <Button className="secondary-color" component={Link} to="/events" variant="contained" size="large">
          See Events
        </Button>
      </div>
    );

    const userLinks = (
      <div className="header__buttons">
        <Button className="primary-color marginR-1" component={Link} to="/profile" variant="contained" size="large">
          Your Profile
        </Button>
        <Button className="secondary-color" component={Link} to="/events" variant="contained" size="large">
          See Events
        </Button>
      </div>
    );

    return (
      <div maxWidth="lg">
        <div className='landing-one'>
          <img src={LandingImg} alt="Landing" className="header__img" />
          <div className='imgContent'>
            <h1>Playing With Your Pals Is More Convinient Now</h1>
            <img src={Logo} width="150px" className='imgLogo'></img>
          </div>
        </div>
        <div className="container">
          <Card sx={{ maxWidth: 345 }} className="cards">
            <CardHeader
              title="Let's Play"
            />
            <CardMedia component="img" height="194" className="images_1" />
            <CardContent>
              <Typography variant="body2" color="text.secondary">

                Create your profile  Host an event

                Manage your sport activites and teams Connect with your team
              </Typography>
            </CardContent>

          </Card>
          <Card sx={{ maxWidth: 345 }} className="cards">
            <CardHeader
              title="Look for Event"
            />
            <CardMedia component="img" height="194" className="images_2" />
            <CardContent>
              <Typography variant="body2" color="text.secondary">

                Create your profile  Host an event

                Manage your sport activites and teams Connect with your team
              </Typography>
            </CardContent>

          </Card>
          <Card sx={{ maxWidth: 345 }} className="cards">
            <CardHeader
              title="Host an Event"
            />
            <CardMedia component="img" height="194" className="images_3" />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Create your profile  Host an event
                Manage your sport activites and teams Connect with your team
              </Typography>
            </CardContent>

          </Card>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Home);