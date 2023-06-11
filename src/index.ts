import express from 'express';
import { router } from './routes/routes';

// env configuration.............
import * as dotenv from 'dotenv';
const env = dotenv.config()

// jwt setup.........
import jwt from 'jsonwebtoken';

// cross origin resource sharing............
import cors from 'cors'

// morgan for logs.................
import morgan from 'morgan';

// db configured successfully......
import sequelize  from './config/db';

// test db ........................
sequelize.authenticate()
.then(() => console.log("Db connected with sequelize..."))
.catch((error) => console.log("Error", error));


const app = express();

const PORT = 4001; 


//parse json bodies...........
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('tiny'));

//cors........................
app.use(cors({
    origin: ['http://localhost:4200'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));


//make files as static........
// app.use('/files', express.static(path.join(__dirname, "./public/assets/files")));


// route ......................
app.use('/', router);


// server connection
app.listen(PORT, (): void => {
    console.log(`Server is running on ${PORT}`);
    
})

