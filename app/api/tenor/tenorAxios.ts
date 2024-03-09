import axios from "axios";

const tenorAxios = axios.create({
    baseURL: "https://tenor.googleapis.com/v2",
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json', // Set the default content type for request headers
    },
});

export interface TenorResponse {
    results: { media_formats: { gif: { url: string }, tinygif: { url: string }, mp4: { url: string } } }[];
}

export default tenorAxios;