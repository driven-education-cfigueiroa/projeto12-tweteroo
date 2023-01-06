import express from 'express';
import cors from 'cors';

class Server {
    constructor() {
        this.app = express();
        this.app.use(cors());
        this.app.use(express.json());

        this.users = [];
        this.tweets = [];
        this.errorFieldsRequired = 'Todos os campos são obrigatórios!';

        this.app.post('/sign-up', (req, res) => {
            if (!req.body?.username || !req.body?.avatar) {
                return res.status(400).send(this.errorFieldsRequired);
            }

            const { username, avatar } = req.body;

            if (typeof username !== 'string' || typeof avatar !== 'string') {
                return res.status(400).send('Todos os campos devem ser strings!');
            }

            const newUser = { username, avatar };
            this.users.push(newUser);
            return res.status(201).send('OK');
        });

        this.app.post('/tweets', (req, res) => {
            if (!req.body?.username && !req.headers.user) {
                return res.status(400).send(this.errorFieldsRequired);
            }

            if (!req.body?.tweet) {
                return res.status(400).send(this.errorFieldsRequired);
            }

            const { tweet } = req.body;

            const username = req.headers.user ? req.headers.user : req.body.username;

            if (typeof username !== 'string' || typeof tweet !== 'string') {
                return res.sendStatus(400);
            }

            if (!this.users.find(user => user.username === username)) {
                return res.status(401).send('UNAUTHORIZED');
            }

            const newTweet = { username, tweet };
            this.tweets.push(newTweet);
            return res.status(201).send('OK');
        });

        this.app.get('/tweets', (req, res) => {
            if (typeof req.query.page === 'string') {
                if (+req.query.page <= 0 || isNaN(+req.query.page)) {
                    return res.status(400).send('Informe uma página válida!');
                }
                const page = req.query.page;
                const tweetsPerPage = 10;
                const offset = tweetsPerPage * page;
                const lastTweets = this.tweets.slice(offset - tweetsPerPage, offset);
                const lastTweetsWithAvatar = lastTweets.map(tweet => {
                    const user = this.users.find(user => user.username === tweet.username);
                    return { ...tweet, avatar: user.avatar };
                });
                return res.send(lastTweetsWithAvatar);
            }
            const lastTweets = this.tweets.slice(-10);
            const lastTweetsWithAvatar = lastTweets.map(tweet => {
                const user = this.users.find(user => user.username === tweet.username);
                return { ...tweet, avatar: user.avatar };
            });
            return res.send(lastTweetsWithAvatar);
        });

        this.app.get('/tweets/:username', (req, res) => {
            const { username } = req.params;
            const userTweets = this.tweets.filter(tweet => tweet.username === username);
            const userTweetsWithAvatar = userTweets.map(tweet => {
                const user = this.users.find(user => user.username === tweet.username);
                return { ...tweet, avatar: user.avatar };
            });
            return res.send(userTweetsWithAvatar);
        });

        this.app.get('/wipedata', (_req, res) => {
            this.users = [];
            this.tweets = [];
            return res.sendStatus(200);
        });
    }

    listen(port, callback) {
        this.app.listen(port, callback);
    }
}

const server = new Server();
server.listen(5000, () => console.log("Listening on port 5000..."));