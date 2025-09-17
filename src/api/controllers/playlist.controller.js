const { getWeatherByCity } = require('../../services/weather.service');
const { getPlaylistsByGenre } = require('../../services/spotify.service'); // Corrected function name
const { getGenreFromAI } = require('../../services/gemini.service'); // Corrected function name

const getPlaylistSuggestions = async(req,res) => {
    const {city , mood } = req.query;
    let genre;
    let responseMessage;

    if(mood){
        genre = mood;
        responseMessage = `Here are some playlists for the mood : ${mood}`;
    } else if(city){
        try {
            const weatherCondition = await getWeatherByCity(city);
            genre = await getGenreFromAI(weatherCondition,city);
            // --- THIS LINE WAS MISSING ---
            responseMessage = `For a ${weatherCondition} day in ${city}, here's a '${genre}' vibe:`;
        } catch(err){
            return res.status(501).json({ message : "Error fetching data!"});
        }
    }
    else {
        return res.status(400).json({ 
            error: 'A `city` or `mood` query parameter is required.' 
        });
    }

    try {
        const playlists = await getPlaylistsByGenre(genre); // Corrected function name

        res.json({
            message : responseMessage,
            playlists : playlists.map(p => ({
                name : p.name,
                url : p.external_urls.spotify,
                owner : p.owner.display_name, // Corrected property name from "Owner" to "owner"
                imageUrl : p.images[0]?.url, // Added optional chaining for safety
            })),
        });
    } catch(err){
        res.status(501).json({ message : "Could not fetch playlists!"});
    }
};

module.exports = { getPlaylistSuggestions };