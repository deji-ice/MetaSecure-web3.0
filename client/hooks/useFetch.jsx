import { useEffect, useState } from "react";
import axios from "axios";

const apiKey = import.meta.env.VITE_GIPHY_API_KEY;
const useFetch = ({ keyword }) => {
  const [gifUrl, setGifUrl] = useState("");

  const getGifs = async () => {
    try {
      const response = await axios.get(
        `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${keyword
          .split(" ")
          .join("")}&limit=1`
      );
      setGifUrl(response.data.data[0]?.images?.downsized_medium.url);
    } catch (error) {
      console.error("Error fetching gif:", error);
      setGifUrl(
        "https://media4.popsugar-assets.com/files/2013/11/07/832/n/1922398/eb7a69a76543358d_28.gif"
      );
    }
  };

  useEffect(() => {
    if (keyword) getGifs();
  }, [keyword]);
  return gifUrl;
};

export default useFetch;
