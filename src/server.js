const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connect = require('./config/connect');
const authRoute = require('./routers/auth.router');
const cookieParser = require('cookie-parser');
dotenv.config()

const port = process.env.PORT;
const hostName = process.env.HOST_NAME;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
connect();

app.use('/api/auth', authRoute);



app.listen(port, hostName, () => {
    console.log(`Server is running on http://${hostName}:${port}`);
})