import express from 'express';
import cors from 'cors';

class Server {
    constructor() {
        this.app = express();
        this.app.use(cors());
        this.app.use(express.json());

        this.users = [];

        this.spaceOnly = (...args) => !args.every(arg => arg.trim());

        this.app.post('/sign-up', (req, res) => {
            if (!req.body?.username || !req.body?.avatar) {
                return res.status(400).send('Todos os campos são obrigatórios!');
            }

            const { username, avatar } = req.body;

            if (this.spaceOnly(username, avatar)) {
                return res.status(400).send('Todos os campos são obrigatórios!');
            }

            if (this.users.find(user => user.username === username)) {
                return res.status(400).send('O usuário já existe!');
            }

            const newUser = { username, avatar };
            this.users.push(newUser);
            return res.send('OK');
        });

        this.app.post('/tweets', (_req, res) => {
            return res.send('OK');
        });

        this.app.get('/tweets', (_req, res) => {
            return res.send('OK');
        });
    }

    listen(port, callback) {
        this.app.listen(port, callback);
    }
}

const server = new Server();
server.listen(5000, () => console.log("Listening on port 5000..."));