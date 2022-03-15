import axios from 'axios';

const GIF_API_KEY = 'GoYCtqdbIg9MsdnPMSWlv8UAB5XacXmw';

export const getGifs = (searchInput, offset) => {
    return  axios.get(`https://api.giphy.com/v1/gifs/search?q=${searchInput}&offset=${offset}&api_key=${GIF_API_KEY}`)
}