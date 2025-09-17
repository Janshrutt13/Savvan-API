const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
// Make sure this path matches your routes file name exactly
const playlistRoutes = require("./api/routes/playlist.route"); 

dotenv.config(); // It's good practice to call this at the top
const app = express();
const PORT = process.env.PORT || 3000;

//Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public'));


// Use app.use to mount the router at the /api prefix
app.use('/api', playlistRoutes);


console.log('✅ Playlist routes have been loaded under the /api prefix.');

app.listen(PORT, () => console.log(`Server has started on PORT : ${PORT}`));