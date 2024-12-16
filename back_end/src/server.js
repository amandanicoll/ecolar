import express from 'express';
import app from './routes/router.js';
import cors from 'cors';

const server = express();
const PORT = 2000;

// Middleware
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use(cors());

// Rota de teste
server.get('/ping', (req, res) => {
    res.send('PONG');
});

server.use('/', app);

// Inicializa o servidor
server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
