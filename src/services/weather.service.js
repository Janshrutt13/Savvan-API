import axios from "axios";

const BASE_URL = "http://api.openweathermap.org/data/2.5/weather";
const API_KEY = process.env.OPENWEATHER_API_KEY;

export const getWeatherByCity = async(city) => {
    try{
       const response = await axios.get(BASE_URL, {
          params : { q : city, appid : API_KEY , units : metrics},
       });
         return response.data.weather[0].main;
    }catch(err){
        console.error("Error fetching services", err.message);
        throw new Error('Could not fetch weather for this city');
    }
};