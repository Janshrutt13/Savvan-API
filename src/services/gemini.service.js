const {GoogleGenerativeAI} = require('@google/generative-ai');

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * @param {string} weatherCondition - The current weather (e.g., "Rain").
 * @param {string} city - The city name for context.
 * @returns {Promise<string>} A creative, searchable music genre.
 */

async function getGenreFromAi(weatherCondition , city){
    try{
        //gemini model
        const model = genAi.getGenerativeModel({ model : "gemini-1.5-flash"});

        //this is the prompt provided to gemini
        const prompt = `You are a creative music curator. The current weather in ${city} is '${weatherCondition}'. 
        Suggest a specific and creative music genre or vibe that would be perfect for this moment. 
        Your response must be a short, searchable term for a music playlist, like 'Monsoon Lofi' or 'Synthwave Sunset Drive'. 
        Do not explain your choice, just return the term.`;

        const result = await model.generateContent(prompt);
        const response = result.response;
    }catch(err){
        console.error("Error generating content!");
    
        //fallback incase of ai failure
        return "pop";
    }
};

module.exports = { getGenreFromAi };