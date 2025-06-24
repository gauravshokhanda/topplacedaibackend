const axios = require('axios');
const fs = require('fs');

async function generateSpeech(text, filename = "output.mp3") {
    const response = await axios.post(
        'https://api.elevenlabs.io/v1/text-to-speech/VOICE_ID',
        {
            text,
            voice_settings: { stability: 0.5, similarity_boost: 0.75 }
        },
        {
            headers: {
                'xi-api-key': process.env.ELEVENLABS_API_KEY,
                'Content-Type': 'application/json'
            },
            responseType: 'stream'
        }
    );

    response.data.pipe(fs.createWriteStream(`public/${filename}`));
}

module.exports = generateSpeech;
