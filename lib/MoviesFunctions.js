const TMDB_KEY = process.env.TMDB_API_KEY;
const USE_MOCKS = process.env.USE_MOCKS === '1' || !TMDB_KEY;

/* Warn once if missing */
if (!TMDB_KEY) {
  console.warn('TMDB_API_KEY is not set; TMDB requests will use mocks.');
}

import { trendingMock, popularMock, topRatedMock, infoMock, recommendationMock } from './tmdbMock';

// Trending Movies
export const getTrendingMovies = async (type = "all", page = 1) => {
  if (USE_MOCKS) return trendingMock;
  const url = `https://api.themoviedb.org/3/trending/${(type === "movies" ? "movie" : type) || "all"}/day?language=en-US&page=${page}&api_key=${TMDB_KEY}`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 * 24 } });

    if (!res.ok) {
      const errorBody = await res.text().catch(()=>'');
      throw new Error(`Error: ${res.status} - ${errorBody}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Popular Movies
export const getPopularMovies = async (page) => {
  if (USE_MOCKS) return popularMock;
  const url = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}&api_key=${TMDB_KEY}`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 * 24 } });

    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(`Error: ${res.status} - ${errorBody}`);
    }


    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

// Top Rated Movies
export const getTopRatedMovies = async () => {
  if (USE_MOCKS) return topRatedMock;
  const url = `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1&api_key=${TMDB_KEY}`;

  try {
    const res = await fetch(url,
      { next: { revalidate: 864000 } }
    );

    if (!res.ok) {
      throw new Error(`Error: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};


// Top TV / MOVIES INFO
export const getInfoTMDB = async (TMDBID, media_type) => {
  // Validate media_type
  const validMediaTypes = ["movie", "tv"];
  if (!validMediaTypes.includes(media_type)) {
    return "media_type_error";
  }

  if (USE_MOCKS) return infoMock(TMDBID, media_type);
  const baseUrl = `https://api.themoviedb.org/3`;
  const url = media_type === "movie"
    ? `${baseUrl}/movie/${TMDBID}?language=en-US&api_key=${TMDB_KEY}`
    : `${baseUrl}/tv/${TMDBID}?language=en-US&api_key=${TMDB_KEY}`;

  const maxRetries = 5; // Maximum number of retries
  let attempts = 0; // Counter for the number of attempts

  while (attempts < maxRetries) {
    try {
      // Fetch the data based on the media type
      const res = await fetch(url, { cache: "no-cache" });

      if (res.status === 404) {
        // Return media_type_error if no media is found (404 response)
        return "media_type_error";
      }

      if (res.ok) {
        const data = await res.json();
        data.type = media_type; // Add type based on the media_type argument
        return data; // Return modified data
      }

      throw new Error(`Unexpected error for ${media_type} with TMDB ID ${TMDBID}.`);

    } catch (error) {
      attempts++; // Increment the attempts counter
      console.error(`Attempt ${attempts} - Error fetching TMDB data: ${error.message}`);

      if (attempts >= maxRetries) {
        return null; // Return null or handle the error accordingly after max retries
      }

      // Optional: wait before the next attempt
      await new Promise(res => setTimeout(res, 10)); // Wait for 1 second before retrying
    }
  }

  return null; // Return null if all attempts fail
};







// GET TV / MOVIES RECOMMENDATION
export const getRecommendation = async (TMDBID, Type) => {
  if (USE_MOCKS) return recommendationMock(TMDBID);
  const url = `https://api.themoviedb.org/3/${Type || "movie"}/${TMDBID}/recommendations?&api_key=${TMDB_KEY}`;

  try {
    const res = await fetch(url,
      { next: { revalidate: 21600 } }
    );

    if (!res.ok) {
      throw new Error(`Error: ${res.status}`);
    }

    const data = await res.json();

    if (data?.results?.length <= 5) {
      const data = getTrendingMovies()

      return data;
    }

    return data;
  } catch (error) {
    console.error(error);
  }
};