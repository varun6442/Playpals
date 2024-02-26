import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Grid, Card, CardContent, CircularProgress, Typography, Button } from '@material-ui/core';
import styles from './Login.scss';
import TextFieldGroup from '../common/TextFieldGroup';
import { loginUser, sendOtp, verifyOTP } from '../../actions/authActions';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      errors: {},
      showOtpLogin: false,
      phone: '',
      otp: '',
      showOtpTextField: false

    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.switchOtpMode = this.switchOtpMode.bind(this);
    this.sendOtp = this.sendOtp.bind(this);
    this.verifyOtp = this.verifyOtp.bind(this);

  }
  componentDidMount() {
    if (this.props.isAuthenticated) {
      this.props.history.push('/events');
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push('/events');
    }
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  switchOtpMode() {
    this.setState({ showOtpLogin: true })
  }
  sendOtp() {
    let data = {
      phone: this.state.phone
    }
    this.props.sendOtp(data);
    this.setState({ showOtpTextField: true })
  }
  verifyOtp() {

    let data = {
      otp: this.state.otp
    }
    this.props.verifyOTP(data);

  }

  onSubmit(e) {
    e.preventDefault();
    const userData = {
      email: this.state.email,
      password: this.state.password
    };

    this.props.loginUser(userData);
  }
  render() {
    const { errors } = this.state;
    const { auth } = this.props;
    let formOption;
    const {
      login_info,
      btn_progress } = styles;
    let otpContent;
    if (!this.state.showOtpTextField) {
      otpContent = <Button
        className={auth.loading ? "relative" : "relative submit-btn primary-color marginT-1"}
        onClick={this.sendOtp}
        disabled={auth.loading}>
        Send Otp
        {auth.loading && <CircularProgress variant="determinate" size={24} className={btn_progress} />}
      </Button>
    } else {
      otpContent = <div>
        <TextFieldGroup
          label="Enter the Otp"
          placeholder="Otp"
          name="otp"
          type="text"
          value={this.state.otp}
          onChange={this.onChange}
          error={errors.otp}
        />
        <Button
          className={auth.loading ? "relative" : "relative submit-btn primary-color marginT-1"}
          onClick={this.verifyOtp}
          disabled={auth.loading}>
          Verify Otp
          {auth.loading && <CircularProgress variant="determinate" size={24} className={btn_progress} />}
        </Button>

      </div>
    }
    if (!this.state.showOtpLogin) {
      formOption = <div><form onSubmit={this.onSubmit} className="mb-2">
        <TextFieldGroup
          label="Email"
          placeholder="Email"
          name="email"
          type="email"
          value={this.state.email}
          onChange={this.onChange}
          error={errors.email}
        />
        <TextFieldGroup
          label="Password"
          placeholder="Password"
          name="password"
          type="password"
          value={this.state.password}
          onChange={this.onChange}
          error={errors.password}
        />
        <Button
          className={auth.loading ? "relative" : "relative submit-btn primary-color marginT-1"}
          type="submit"
          variant="contained"
          disabled={auth.loading}>
          Submit
          {auth.loading && <CircularProgress variant="determinate" size={24} className={btn_progress} />}
        </Button>
      </form>
        <Button
          className={auth.loading ? "relative" : "relative submit-btn primary-color marginT-1"}
          onClick={this.switchOtpMode}
          disabled={auth.loading}>
          Login With OTP
          {auth.loading && <CircularProgress variant="determinate" size={24} className={btn_progress} />}
        </Button> </div>
    } else {
      formOption = <div>
        <TextFieldGroup
          label="Enter Phone Number"
          placeholder="Phone Number"
          name="phone"
          type="number"
          value={this.state.phone}
          onChange={this.onChange}
          error={errors.phone}
        />
        {otpContent}
      </div>

    }
    return (
      <div className="background">
        <Grid className="login" container justifyContent="center">
          <Grid item xs={12} sm={8} md={6} >
            <Card className="login_card" variant="outlined"><h2>LOGIN</h2>
              <CardContent>
                <Typography variant="body2" color="secondary">
                  {errors.servererror}
                </Typography>
                {formOption}
                <Typography variant="subtitle2" className="login_info">
                  Dont have an account? <Link to="/register">Sign Up</Link>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>

    );


  }

}
const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, { loginUser, sendOtp, verifyOTP })(Login);