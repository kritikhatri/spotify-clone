import axios from "axios";

const BASE_URL =
  "https://deezerdevs-deezer.p.rapidapi.com";

export const searchSongs = async (
  query
) => {
  const response =
    await axios.get(
      `${BASE_URL}/search?q=${query}`,
      {
        headers: {
          "X-RapidAPI-Key":
            import.meta.env.VITE_API_KEY,
        },
      }
    );

  return response.data.data;
};