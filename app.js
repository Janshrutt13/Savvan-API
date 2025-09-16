const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const playlistRoutes = require('./api/routes/playlist.route');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


//Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

//Routes
app.get('/' , playlistRoutes);

app.listen(PORT , () => console.log('Server has started on PORT'));