import { default as Axios } from "axios";
import { load } from "cheerio";
export const get = async (url) => {
    const urlObj = new URL(url);
    const host = urlObj.hostname;
    const path = urlObj.pathname + urlObj.search;

    const header = {
        ":authority": host,
        ":method": "GET",
        ":path": path,
        ":scheme": "https",
        "Accept": "*/*",
        "Accept-Encoding": "identity;q=1, *;q=0",
        "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7,eu;q=0.6",
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Range': 'bytes=0-',
        'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'video',
        'Sec-Fetch-Mode': 'no-cors',
        'Sec-Fetch-Site': 'cross-site',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'X-Client-Data': 'CIe2yQEIpbbJAQipncoBCOaMywEIkqHLAQid/swBCIWgzQEIou7NAQiD8M0BGObTzQEYp+rNAQ=='
    }

    try {
        const response = await Axios.get(url, header);
        const $ = load(response.data);

        // Use a single regex pattern to capture the file URL
        const regex = /'file'\s*:\s*'([^']*)'|"file"\s*:\s*"(.*?)"/;
        const match = $.html().match(regex);

        if (match && (match[1] || match[2])) {
            const fileUrl = match[1] || match[2];
    
            return fileUrl;
        }

        return "-";
    } catch (error) {
        return "-";
    }
};

export const getStreamUrl = async (url) => {
    const urlObj = new URL(url);
    const host = urlObj.hostname;
    const path = urlObj.pathname + urlObj.search;

    const header = {
        ":authority": host,
        ":method": "GET",
        ":path": path,
        ":scheme": "https",
        "Accept": "*/*",
        "Accept-Encoding": "identity;q=1, *;q=0",
        "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7,eu;q=0.6",
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Range': 'bytes=0-',
        'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'video',
        'Sec-Fetch-Mode': 'no-cors',
        'Sec-Fetch-Site': 'cross-site',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'X-Client-Data': 'CIe2yQEIpbbJAQipncoBCOaMywEIkqHLAQid/swBCIWgzQEIou7NAQiD8M0BGObTzQEYp+rNAQ=='
    }

    const finalUrl = await Axios.get(url, header);

    console.log(finalUrl.data);

    return finalUrl.data;
}