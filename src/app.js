import express, { query } from 'express';
import cors from 'cors';

class Server {
    constructor() {
        this.app = express();
        this.app.use(cors());
        this.app.use(express.json());

        this.users = [];
        this.tweets = [];

        this.spaceOnly = (...args) => !args.every(arg => arg.trim());

        this.app.post('/sign-up', (req, res) => {
            if (!req.body?.username || !req.body?.avatar) {
                return res.status(400).send('Todos os campos são obrigatórios!');
            }

            const { username, avatar } = req.body;

            if (typeof username !== 'string' || typeof avatar !== 'string') {
                return res.sendStatus(400);
            }

            if (this.spaceOnly(username, avatar)) {
                return res.status(400).send('Todos os campos são obrigatórios!');
            }

            if (this.users.find(user => user.username === username)) {
                return res.status(400).send('O usuário já existe!');
            }

            const newUser = { username, avatar };
            this.users.push(newUser);
            return res.status(201).send('OK');
        });

        this.app.post('/tweets', (req, res) => {
            if (!req.body?.username || !req.body?.tweet) {
                return res.status(400).send('Todos os campos são obrigatórios!');
            }

            const { username, tweet } = req.body;

            if (typeof username !== 'string' || typeof tweet !== 'string') {
                return res.sendStatus(400);
            }

            if (this.spaceOnly(username, tweet)) {
                return res.status(400).send({ error: 'Todos os campos são obrigatórios!' });
            }

            if (!this.users.find(user => user.username === username)) {
                return res.status(400).send('UNAUTHORIZED');
            }

            const newTweet = { username, tweet };
            this.tweets.push(newTweet);
            return res.status(201).send('OK');
        });

        this.app.get('/tweets', (req, res) => {
            if (req.query.page !== undefined) {
                if (+req.query.page <= 0 || isNaN(+req.query.page)) {
                    return res.status(400).send('Informe uma página válida!');
                }
                const page = req.query.page;
                const tweetsPerPage = 10;
                const offset = tweetsPerPage * page;
                const lastTweets = this.tweets.slice(-offset);
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
            res.send(lastTweetsWithAvatar);
        });

        this.app.get('/tweets/:username', (req, res) => {
            const { username } = req.params;
            const userTweets = this.tweets.filter(tweet => tweet.username === username);
            const userTweetsWithAvatar = userTweets.map(tweet => {
                const user = this.users.find(user => user.username === tweet.username);
                return { ...tweet, avatar: user.avatar };
            });
            res.send(userTweetsWithAvatar);
        });

        this.app.get('/wipedata', (_req, res) => {
            this.users = [];
            this.tweets = [];
            res.sendStatus(200);
        });
    }

    listen(port, callback) {
        this.app.listen(port, callback);
    }
}

const server = new Server();
server.listen(5000, () => console.log("Listening on port 5000..."));