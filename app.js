const dotenv = require('dotenv');

const express = require('express');

const cookiesParser = require('cookie-parser');
const cors = require('cors');
const connectToDB = require('./db/db');
const userRoutes = require('./routes/user.routes');

dotenv.config();
connectToDB();

const app = express();

app.use(cors({origin: true, credentials: true}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookiesParser());



app.get('/', (req, res) =>{
    res.send('Hellow')
});
app.use('/users', userRoutes);


module.exports = app;