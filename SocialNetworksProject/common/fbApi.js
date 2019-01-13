import axios from 'axios';

export default class FBApi {
    constructor(token) {
        this.token = token;
    }

    getUserInfo() {
        console.log('Getting user info from facebook.');
        return [];
    }
}