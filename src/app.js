import express from 'express';
import cors from 'cors';

class Server {
    constructor() {
        this.app = express();
        this.app.use(cors());

        this.app.post('/sign-up', (_req, res) => {
            res.send('OK');
        });

        this.app.post('/tweets', (_req, res) => {
            res.send('OK');
        });

        this.app.get('/tweets', (_req, res) => {
            res.send('OK');
        });
    }

    listen(port, callback) {
        this.app.listen(port, callback);
    }
}

const server = new Server();
server.listen(5000, () => console.log("Listening on port 5000..."));