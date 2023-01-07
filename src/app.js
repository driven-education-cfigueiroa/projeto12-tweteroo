import express from 'express';
import cors from 'cors';
import { signUpSchema, tweetsSchema } from './schemas.js';
class Server {
    constructor() {
        this.app = express();
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use((err, _req, res, next) => {
            if (err instanceof SyntaxError) {
                return res.sendStatus(err.status);
            }
            next();
        });

        this.users = [];
        this.tweets = [];

        this.app.post('/sign-up', (req, res) => {
            const { error } = (signUpSchema.validate(req.body));
            if (error) {
                return res.status(400).send(error.details[0].message);
            }
            this.users.push(req.body);
            return res.status(201).send("OK");
        });

        this.app.post('/tweets', (req, res) => {
            const { error } = (tweetsSchema.validate(req.body));
            if (error) {
                return res.status(400).send(error.details[0].message);
            }

            if (!this.users.find(user => user.username === req.body.username)) {
                return res.status(401).send('UNAUTHORIZED');
            }
            this.tweets.push(req.body);
            return res.status(201).send("OK");
        });

        this.app.get('/tweets', (_req, res) => {
            const lastTweets = this.tweets.slice(-10);
            const lastTweetsWithAvatar = lastTweets.map(tweet => {
                const user = this.users.find(user => user.username === tweet.username);
                return { ...tweet, avatar: user.avatar };
            });
            return res.send(lastTweetsWithAvatar.reverse());
        });
    }

    listen(port, callback) {
        this.app.listen(port, callback);
    }
}

const server = new Server();
server.listen(5000, () => console.log("Listening on port 5000..."));