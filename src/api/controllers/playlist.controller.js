const { getWeatherByCity } = require('../../services/weather.service');
const { getPlaylistsByGenre } = require('../../services/spotify.service');
const { getGenreFromAI } = require('../../services/gemini.service');

const getPlaylistSuggestions = async(req,res) => {
    const {city , mood } = req.query;
    let genre;
    let responseMessage;

    console.log('Request received:', { city, mood });
    if(mood){
        genre = mood;
        responseMessage = `Here are some playlists for the mood : ${mood}`;
    } else if(city){
        try {
            console.log('Fetching weather for city:', city);
            const weatherCondition = await getWeatherByCity(city);
            console.log('Weather condition:', weatherCondition);
            genre = await getGenreFromAI(weatherCondition,city);
            console.log('Generated genre:', genre);
            responseMessage = `For a ${weatherCondition} day in ${city}, here's a '${genre}' vibe:`;
        } catch(err){
            console.error('Error in city flow:', err.message);
            return res.status(501).json({ message : "Error fetching data!"});
        }
    }
    else {
        return res.status(400).json({ 
            error: 'A `city` or `mood` query parameter is required.' 
        });
    }

    try {
        console.log('Searching playlists for genre:', genre);
        const playlists = await getPlaylistsByGenre(genre);
        console.log('Found playlists:', playlists.length);

        res.json({
            message : responseMessage,
            playlists : playlists.map(p => ({
                name : p.name,
                url : p.external_urls.spotify,
                owner : p.owner.display_name,
                imageUrl : p.images[0]?.url,
            })),
        });
    } catch(err){
        console.error('Error fetching playlists:', err.message);
        res.status(501).json({ message : "Could not fetch playlists!"});
    }
};

module.exports = { getPlaylistSuggestions };