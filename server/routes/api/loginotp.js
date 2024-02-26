const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');

const accountSid = "AC187ffaceb5a60f004a2af9dc1dfea8be";
const authToken = "d04135a9cd032b764b7adce0f9cd43a3";
const client = require('twilio')(accountSid, authToken);

const crypto = require('crypto');
const smsKey = "55eefe54cc89cd960d9d546ffd3c514ae2d6297f9c24a62cfb684e4a149e127de2ba20f3fdecba591286394598afe1465ead2301f47ff9a4743429f224410efc";
const twilioNum =  +12057073373;
const jwt = require('jsonwebtoken');

const JWT_AUTH_TOKEN = "0f298f98d4d8fa96dbc1f533ab5f1b00822bee8adbebb9b35b53c19467dce8585e2275fa6ab41919cf708648cd6436d8fecf36d5b6c49860eba972f4f7c307ea"
const JWT_REFRESH_TOKEN ="55eefe54cc89cd960d9d546ffd3c514ae2d6297f9c24a62cfb684e4a149e127de2ba20f3fdecba591286394598afe1465ead2301f47ff9a4743429f224410efc"
let refreshTokens = [];

const app = express();
app.use(express.json());
const router = express.Router();

const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));
app.use(cookieParser());

router.post('/sendOTP', (req, res) => {
	const phone = req.body.phone;
	const otp = Math.floor(100000 + Math.random() * 900000);
	const ttl = 2 * 60 * 1000;
	const expires = Date.now() + ttl;
	const data = `${phone}.${otp}.${expires}`;
	const hash = crypto.createHmac('sha256', smsKey).update(data).digest('hex');
	const fullHash = `${hash}.${expires}`;

	client.messages
		.create({
			body: `Your One Time Login Password For CFM is ${otp}`,
			from: twilioNum,
			to: phone
		})
		.then((messages) => console.log(messages))
		.catch((err) => console.error(err));

	// res.status(200).send({ phone, hash: fullHash, otp });  // this bypass otp via api only for development instead hitting twilio api all the time
	res.status(200).send({ phone, hash: fullHash });          // Use this way in Production
});

router.post('/verifyOTP', (req, res) => {
	const phone = req.body.phone;
	const hash = req.body.hash;
	const otp = req.body.otp;
	let [ hashValue, expires ] = hash.split('.');

	let now = Date.now();
	if (now > parseInt(expires)) {
		return res.status(504).send({ msg: 'Timeout. Please try again' });
	}
	let data = `${phone}.${otp}.${expires}`;
	let newCalculatedHash = crypto.createHmac('sha256', smsKey).update(data).digest('hex');
	if (newCalculatedHash === hashValue) {
		console.log('user confirmed');
		const accessToken = jwt.sign({ data: phone }, JWT_AUTH_TOKEN, { expiresIn: '30s' });
		const refreshToken = jwt.sign({ data: phone }, JWT_REFRESH_TOKEN, { expiresIn: '1y' });
		refreshTokens.push(refreshToken);
		res
			.status(202)
			.cookie('accessToken', accessToken, {
				expires: new Date(new Date().getTime() + 30 * 1000),
				sameSite: 'strict',
				httpOnly: true
			})
			.cookie('refreshToken', refreshToken, {
				expires: new Date(new Date().getTime() + 31557600000),
				sameSite: 'strict',
				httpOnly: true
			})
			.cookie('authSession', true, { expires: new Date(new Date().getTime() + 30 * 1000), sameSite: 'strict' })
			.cookie('refreshTokenID', true, {
				expires: new Date(new Date().getTime() + 31557600000),
				sameSite: 'strict'
			})
			.send({ msg: 'Device verified' });
	} else {
		console.log('not authenticated');
		return res.status(400).send({ verification: false, msg: 'Incorrect OTP' });
	}
});

router.post('/events',(req, res,next) => {
	const accessToken = req.cookies.accessToken;

	jwt.verify(accessToken, JWT_AUTH_TOKEN, async (err, phone) => {
		if (phone) {
			req.phone = phone;
			next();
		} else if (err.message === 'TokenExpiredError') {
			return res.status(403).send({
				success: false,
				msg: 'Access token expired'
			});
		} else {
			console.log(err);
			return res.status(403).send({ err, msg: 'User not authenticated' });
		}
	});
	console.log('Events');
	res.status(202).send('Private Protected Route - Events');
});

// async function authenticateUser(req, res, next) {
	
// }

router.post('/refresh',(req, res) => {
	const refreshToken = req.cookies.refreshToken;
	if (!refreshToken) return res.status(403).send({ message: 'Refresh token not found, login again' });
	if (!refreshTokens.includes(refreshToken))
		return res.status(403).send({ message: 'Refresh token blocked, login again' });

	jwt.verify(refreshToken, JWT_REFRESH_TOKEN, (err, phone) => {
		if (!err) {
			const accessToken = jwt.sign({ data: phone }, JWT_AUTH_TOKEN, {
				expiresIn: '30s'
			});
			return res
				.status(200)
				.cookie('accessToken', accessToken, {
					expires: new Date(new Date().getTime() + 30 * 1000),
					sameSite: 'strict',
					httpOnly: true
				})
				.cookie('authSession', true, {
					expires: new Date(new Date().getTime() + 30 * 1000),
					sameSite: 'strict'
				})
				.send({ previousSessionExpired: true, success: true });
		} else {
			return res.status(403).send({
				success: false,
				msg: 'Invalid refresh token'
			});
		}
	});
});

router.get('/logout', (req, res) => {
	res
		.clearCookie('refreshToken')
		.clearCookie('accessToken')
		.clearCookie('authSession')
		.clearCookie('refreshTokenID')
		.send('logout');
});


module.exports = router;