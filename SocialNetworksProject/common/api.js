import axios from 'axios';

function delay(ms) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

export default class Api {
    constructor(host_string) {
        this.host_string = host_string;

        this.currentQueueNumber = 0
        this.trailingQueueNumber = 0
    }

    getQueueNumber() {
        return this.trailingQueueNumber++;
    }

    async queueTurn() {
        const q = this.getQueueNumber();

        while (q !== this.currentQueueNumber) {
            await delay(250);
        }

        return;
    }

    async doInQueue(act) {
        await this.queueTurn();

        const result = await act();

        this.currentQueueNumber += 1;

        return result;
    }

    async get(path) {
        // const act = async () => await axios.get(`${this.host_string}/${path}`);
        // const result = await this.doInQueue(act);
        console.log(`Query string: ${this.host_string}/${path}`)
        const result = await axios.get(`http://${this.host_string}/${path}`);
        // axios.get(`http://${this.host_string}/${path}`)
        //   .then((result) => {
        //     console.log("Results:", result.data);
        //     return result.data;
        //   })
        //   .catch((error) => {
        //     console.log(error);
        //   })
        return result.data;
    }

    async post(path, data) {
        const act = async () => axios.post(`${this.host_string}/${path}`, data);
        const result = await this.doInQueue(act);
        return result;
    }

    async getUser(id) {
        return this.get(`GetUser/${id}`);
    }

    async getRecommendations(userId, start, n) {
        return this.get(`MovieRecommendation/${userId}/${start}/${start + n}`);
    }

    async addUser(userData) {
        return this.post('AddUser', userData);
    }

    async addMovie(userId, movieData) {
        return this.post(`AddMovie/${userId}`, movieData);
    }
}

export class MockApi extends Api {
    constructor(host_string) {
        super(host_string);
    }
    async getRecommendations(userId, start, n) {
        return new Promise((resolve, reject) => {
            const movies = [
                    {
                        "title": "Dilwale Dulhania Le Jayenge",
                        "description": "Raj is a rich, carefree, happy-go-lucky second generation NRI. Simran is the daughter of Chaudhary Baldev Singh, who in spite of being an NRI is very strict about adherence to Indian values. Simran has left for India to be married to her childhood fianc\u00e9. Raj leaves for India with a mission at his hands, to claim his lady love under the noses of her whole family. Thus begins a saga.",
                        "release_year": "(1995)",
                        "facts": {
                            "Status": "Released",
                            "Original Language": "Hindi",
                            "Runtime": "3h 10m",
                            "Budget": "$13,200,000.00",
                            "Revenue": "$100,000,000.00"
                        },
                        "cast": [
                            {"role": "Actor", "person": "Shah Rukh Khan"},
                            {"role": "Actor", "person": "Kajol"},
                            {"role": "Actor", "person": "Amrish Puri"},
                            {"role": "Actor", "person": "Anupam Kher"},
                            {"role": "Actor", "person": "Satish Shah"},
                            {"role": "Director, Screenplay, Story", "person": "Aditya Chopra"}
                        ],
                        "link": "https://www.themoviedb.org/movie/19404",
                        "fb_link": "https://www.facebook.com/DilwaleDulhaniaLeJayenge",
                        "image_url": "https://image.tmdb.org/t/p/w600_and_h900_bestv2/uC6TTUhPpQCmgldGyYveKRAu8JN.jpg"
                    },
                    {
                        "title": "Babe",
                        "description": "Babe is a little pig who doesn't quite know his place in the world. With a bunch of odd friends, like Ferdinand the duck who thinks he is a rooster and Fly the dog he calls mom, Babe realizes that he has the makings to become the greatest sheep pig of all time, and Farmer Hogget knows it. With the help of the sheep dogs Babe learns that a pig can be anything that he wants to be.",
                        "release_year": "(1995)",
                        "facts": {
                            "Status": "Released",
                            "Original Language": "English",
                            "Runtime": "1h 29m",
                            "Budget": "$30,000,000.00",
                            "Revenue": "$254,134,910.00"
                        },
                        "cast": [
                            {"role": "Actor", "person": "Christine Cavanaugh"},
                            {"role": "Actor", "person": "Miriam Margolyes"},
                            {"role": "Actor", "person": "Danny Mann"},
                            {"role": "Actor", "person": "Hugo Weaving"},
                            {"role": "Actor", "person": "Miriam Flynn"},
                            {"role": "Director, Screenplay", "person": "Chris Noonan"},
                            {"role": "Novel", "person": "Dick King-Smith"},
                            {"role": "Screenplay", "person": "George Miller"}
                        ],
                        "link": "https://www.themoviedb.org/movie/9598",
                        "fb_link": "https://www.facebook.com/BabeMovie",
                        "image_url": "https://image.tmdb.org/t/p/w600_and_h900_bestv2/k42J5jYjvw1DEGBQP63VYYvteY7.jpg"
                    }
            ];

            resolve(movies);
        });
    }
}
