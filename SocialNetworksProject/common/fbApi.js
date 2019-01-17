import axios from 'axios';

export default class FBApi {
    constructor(token) {
        this.token = token;
    }

    async getUserInfo() {
        const result = await axios.get(`https://graph.facebook.com/me?fields=email&access_token=${this.token}`);

        return result.data;
    }

    async getUserLikedMovies() {
        const result = await axios.get(`https://graph.facebook.com/me?fields=movies&access_token=${this.token}`);

        return result.data;
    }
}