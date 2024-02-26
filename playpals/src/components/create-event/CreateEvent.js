import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, Button } from '@material-ui/core';

import TextFieldGroup from '../common/TextFieldGroup';
import DateFieldGroup from '../common/DateFieldGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import SelectFieldGroup from '../common/SelectFieldGroup';
import { createEvent } from '../../actions/eventActions';
import './CreateEvent.scss'

const sportList = ["Badminton", "Tennis", "Volleyball", "Basketball", "Baseball", "Running", "Table tennis", "Football", "Soccer"];

class CreateEvent extends Component{
    constructor(props){
        super(props);
        this.state = {
            eventName: '',
            sportType: '',
            playerStrength: '',
            imageURL: '',
            location: '',
            eventDate: '',
            description: '',
            errors: {}
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    componentDidMount() {
        window.scrollTo(0, 0);

        if(this.props.match.params.id){
            const event = this.props.event.event;

            this.setState({
                eventName: event.eventName,
                sportType: event.sportType,
                playerStrength: event.playerStrength,
                imageURL: event.imageURL,
                location: event.location,
                eventDate: event.eventDate,
                description: event.description
            });
        }
    }
    
    componentWillReceiveProps(nextProps){
        if(nextProps.errors){
            this.setState({errors: nextProps.errors});
        }
    }
    
    onSubmit(e){
        e.preventDefault();
        
        const eventData = {
            eventName: this.state.eventName,
            sportType: this.state.sportType,
            playerStrength: this.state.playerStrength,
            imageURL: this.state.imageURL,
            location: this.state.location,
            eventDate: this.state.eventDate,
            description: this.state.description
        };
        
        this.props.createEvent(eventData, this.props.history);
    }
    
    onChange(e){
        this.setState({[e.target.name]: e.target.value});
    }
    
    render(){
        const {errors} = this.state;
        
        return(
            <body className="host">
                <Grid justify="center" className="create-event">
                <Grid item xs={12} sm={8} md={4}>
                    <Card className="cardCreateEvent">
                        <CardContent>
                            <Typography variant="h3" component="h1" align="center" gutterBottom>
                               New Event
                            </Typography>
                            <form onSubmit={this.onSubmit}>
                                <TextFieldGroup
                                    label="Event Name"
                                    placeholder=""
                                    name="eventName"
                                    type="name"
                                    value={this.state.eventName}
                                    onChange={this.onChange}
                                    error={errors.eventName}
                                />
                                <Grid container spacing={3}>
                                    <Grid item xs={6}>
                                        <SelectFieldGroup
                                            label="Sport Type"
                                            name="sportType"
                                            type="name"
                                            value={this.state.sportType}
                                            onChange={this.onChange}
                                            sportList={sportList}
                                            error={errors.sportType}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextFieldGroup
                                            label="Total Players"
                                            placeholder="2-100 Players"
                                            name="playerStrength"
                                            type="number"
                                            value={this.state.playerStrength}
                                            onChange={this.onChange}
                                            error={errors.playerStrength}
                                        />
                                    </Grid>
                                </Grid>
                                <TextFieldGroup
                                    label="Image URL"
                                    placeholder="EX: https://unsplash.com/photos/-JzHSIzNYnU"
                                    name="imageURL"
                                    type="name"
                                    value={this.state.imageURL}
                                    onChange={this.onChange}
                                    error={errors.imageURL}
                                />
                                <TextFieldGroup
                                    label="Location"
                                    placeholder="EX: West 96th Street, New York, NY 10025"
                                    name="location"
                                    type="name"
                                    value={this.state.location}
                                    onChange={this.onChange}
                                    error={errors.location}
                                />
                                <DateFieldGroup
                                    label="Event Date"
                                    name="eventDate"
                                    value={this.state.eventDate}
                                    onChange={this.onChange}
                                    error={errors.eventDate}
                                />
                                <TextAreaFieldGroup
                                    label="Description"
                                    placeholder="Details about this event"
                                    name="description"
                                    type="name"
                                    value={this.state.description}
                                    onChange={this.onChange}
                                    error={errors.description}
                                />
                                <Button className="primary-color createvent-btn marginB-2" type="submit" variant="contained" fullWidth>
                                    Done
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </body>
            
        );
    }
}

const mapStateToProps = state => ({
    event: state.events,
    errors: state.errors
});

export default connect(mapStateToProps, {createEvent})(withRouter(CreateEvent));