import React, { Component } from 'react';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Paper, Grid, Box, Chip, Avatar, Snackbar, IconButton, ButtonGroup, Button, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import GroupIcon from '@material-ui/icons/Group';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import ReportIcon from '@material-ui/icons/Report';

import MapView from './map/MapView';
import DeleteDialog from '../common/DeleteDialog';
import styles from './Event.scss';
import sportImage from '../../img/noImage.svg';
import { deleteEvent, joinEvent, flagEvent } from '../../actions/eventActions';

class EventItem extends Component {
    constructor() {
        super();
        this.state = {
            openDeleteDialog: false,
            openSnackbar: false
        };
    }
    handleClickOpen() {
        this.setState({ openDeleteDialog: true });
    };

    handleClose() {
        this.setState({ openDeleteDialog: false });
    };

    handleCloseSnackbar() {
        this.setState({ openSnackbar: false });
    };

    onDeleteClick(id) {
        this.props.deleteEvent(id);
        this.props.history.push('/events');
    }

    onJoinClick(id) {
        if (!this.props.auth.isAuthenticated) {
            this.props.history.push('/login');
        }
        this.setState({ openSnackbar: true });

        this.props.joinEvent(id);
    }

    render() {
        const { event, snackbarMessage, auth } = this.props;

        return (
            <Paper className="pad-2">
                <Grid container>
                    <Grid item xs={12} md={6} className="event-item">
                        <Grid  spacing={6}>
                            <Grid item xs={6}>
                                <span className={styles.labelInfo}>Type of Sport</span>
                                <Typography variant="h6" paragraph>{event.sportType}</Typography>
                            </Grid>

                            <Grid item xs={6}>
                                <span className={styles.labelInfo}>Number of Player</span>
                                <br></br>
                                <Box display="flex">
                                    <Typography variant="h6" paragraph>{event.playerStrength}</Typography>
                                </Box>
                            </Grid>
                        </Grid>

                        <span className={styles.labelInfo}>Location</span>
                        <Typography variant="h6" paragraph>{event.location ? event.location : "To Be Announced"}</Typography>

                        <span className={styles.labelInfo}>Start Date</span>
                        <Typography variant="h6" paragraph>
                            {event.eventDate ? <Moment format="MMMM Do, YYYY">{event.eventDate}</Moment> : "To Be Announced"}
                        </Typography>

                        <span className={styles.labelInfo}>Description</span>
                        <Typography variant="h6" paragraph>
                            {event.description ? event.description : "None"}
                        </Typography>

                        <Typography paragraph>
                            Host By <Link to={`/profile/${event.userName._id}`}>
                                {event.userName.name}
                            </Link>
                        </Typography>
                        <ButtonGroup className="floatRight">
                            {event.userName._id === auth.user.id ? (
                                <div>
                                    <IconButton
                                        onClick={this.handleClickOpen.bind(this)}
                                        variant="contained"
                                        color="secondary" >
                                        <DeleteForeverIcon style={{ fontSize: 30 }} />
                                    </IconButton>
                                </div>
                            ) : null}
                        </ButtonGroup>
                    </Grid>
                    <Grid container item xs={12} md={6}>
                        <img style={{ width: '100%' }} src={event.imageURL ? event.imageURL : sportImage} alt="Sport" />
                    </Grid>
                </Grid>
                <hr />
                {event.address ? <MapView coordinates={event.address.coordinates} location={event.location} /> : null}
                <hr />
                <Box display="flex">
                    <Button
                        className="createvent-btn"
                        onClick={this.onJoinClick.bind(this, event._id)}
                        variant="contained"
                        color="primary" >
                        {auth.isAuthenticated ? "Join This Event" : "Login to Join"}
                    </Button>
                    <p className="marginL-1">{event.playerStrength - event.playerList.length} spots left</p>
                </Box>
                <div className="marginT-1">
                    {event.playerList.map((player, index) => {
                        return <Chip
                            key={player._id}
                            className="marginR-1 marginX-1"
                            avatar={<Avatar>{index + 1}</Avatar>}
                            label={player.name}
                            variant="outlined" />
                    })}
                </div>
                <DeleteDialog
                    onDeleteClick={this.onDeleteClick.bind(this, event._id)}
                    openDeleteDialog={this.state.openDeleteDialog}
                    handleClose={this.handleClose.bind(this)} />

                <Snackbar
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={this.state.openSnackbar}
                    autoHideDuration={5000}
                    onClose={this.handleCloseSnackbar.bind(this)}
                    message={snackbarMessage}
                    action={
                        <React.Fragment>
                            <IconButton size="small" aria-label="close" color="inherit" onClick={this.handleCloseSnackbar.bind(this)}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </React.Fragment>
                    }
                />
            </Paper>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, { deleteEvent, joinEvent, flagEvent })(withRouter(EventItem));