import axios from 'axios';

let serverURL = 'http://localhost:8081';

let token = localStorage.getItem('jwtToken');
const instance = axios.create({
    baseURL: serverURL,
});

export default instance;