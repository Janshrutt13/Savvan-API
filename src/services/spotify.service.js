import axios from "axios";


//Get an access token from Spotify.
//Search playlists by a given genre.
//Return the first 5 playlists.

CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

const getAccessToken = async () => {
    const response = await axios.post("https://accounts.spotify.com/api/token" , "grant_type=client_credentials" , {
       headers : {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'),
       },
    });
    return response.data.access_token;
};

export const getPlaylistByGenre = async(genre) => {
    try{
        const accessToken = await getAccessToken();
        const response = await axios.get("https://api.spotify.com/v1/search" , {
           headers : {  'Authorization' : `Bearer ${accessToken}` },
           params : { q : "genre", type : "playlist" , limit : 5}
        });

        return response.data.playlists.items;

    }catch(err){
        console.error("Error fetching playlists from spotify" , err.message);
        throw new Error("Could not fetch playlists from Spotify");
    }
};