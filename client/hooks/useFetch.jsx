import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API_KEY = import.meta.env.VITE_GIPHY_API_KEY;
const DEFAULT_GIF =
  "https://media4.popsugar-assets.com/files/2013/11/07/832/n/1922398/eb7a69a76543358d_28.gif";
const API_BASE_URL = "https://api.giphy.com/v1/gifs/search";

// Cache to store previously fetched GIFs
const gifCache = new Map();

/**
 * Custom hook to fetch a GIF based on a keyword with caching.
 * If no keyword is provided or the API call fails, returns DEFAULT_GIF.
 *
 * @param {Object} params - Hook parameters.
 * @param {string} params.keyword - Keyword to search for.
 * @returns {string} URL of the fetched GIF.
 */
const useFetch = ({ keyword }) => {
  const [gifUrl, setGifUrl] = useState(DEFAULT_GIF);

  const fetchGif = useCallback(async (searchTerm) => {
    if (!searchTerm || !API_KEY) {
      setGifUrl(DEFAULT_GIF);
      return;
    }

    // Format and trim the search term (remove spaces)
    const formattedKeyword = searchTerm.trim().split(" ").join("");

    // Use cached result if available
    if (gifCache.has(formattedKeyword)) {
      setGifUrl(gifCache.get(formattedKeyword));
      return;
    }

    try {
      const { data } = await axios.get(API_BASE_URL, {
        params: {
          api_key: API_KEY,
          q: formattedKeyword,
          limit: 1,
          rating: "g",
        },
        timeout: 5000,
      });

      // Extract GIF URL or fallback to default if none found
      const resultUrl =
        data.data && data.data.length > 0 && data.data[0]?.images?.downsized_medium?.url
          ? data.data[0].images.downsized_medium.url
          : DEFAULT_GIF;
      
      // Store result in cache
      gifCache.set(formattedKeyword, resultUrl);
      setGifUrl(resultUrl);
    } catch (error) {
      console.error("Failed to fetch GIF:", error.message);
      setGifUrl(DEFAULT_GIF);
    }
  }, []);

  useEffect(() => {
    if (!keyword) {
      setGifUrl(DEFAULT_GIF);
    } else {
      fetchGif(keyword);
    }
  }, [keyword, fetchGif]);

  return gifUrl;
};

export default useFetch;