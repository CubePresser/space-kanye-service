import express from 'express';
import { ContentRouter } from './routes';
import { PORT } from './config/credentials';

const service = express();

// Register endpoints
service.use('/content', ContentRouter);

service.listen(PORT, () => {
    console.log(`Service has started at port ${PORT}`);
});