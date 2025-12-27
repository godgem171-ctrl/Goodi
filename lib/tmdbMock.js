// Minimal TMDB-shaped mock data for offline/demo mode
export const trendingMock = {
  page: 1,
  results: [
    {
      id: 12345,
      title: "Mock Movie One",
      name: "Mock Movie One",
      overview: "This is mock movie one used when TMDB is not available.",
      poster_path: "/mock-poster-1.jpg",
      backdrop_path: "/mock-backdrop-1.jpg",
      vote_average: 7.8,
      media_type: "movie",
      release_date: "2024-01-01",
      original_language: "en"
    },
    {
      id: 67890,
      title: "Mock Movie Two",
      name: "Mock Movie Two",
      overview: "This is mock movie two used when TMDB is not available.",
      poster_path: "/mock-poster-2.jpg",
      backdrop_path: "/mock-backdrop-2.jpg",
      vote_average: 6.5,
      media_type: "movie",
      release_date: "2023-06-15",
      original_language: "en"
    }
  ],
  total_pages: 1,
  total_results: 2
};

export const popularMock = Object.assign({}, trendingMock, { results: trendingMock.results.map(r => ({...r, id: r.id + 10})) });
export const topRatedMock = Object.assign({}, trendingMock, { results: trendingMock.results.map(r => ({...r, id: r.id + 20})) });

export const infoMock = (id, type = 'movie') => ({
  id: Number(id) || 12345,
  title: "Mock Movie One",
  name: "Mock Movie One",
  overview: "Detailed mock movie info used when TMDB is not available.",
  poster_path: "/mock-poster-1.jpg",
  backdrop_path: "/mock-backdrop-1.jpg",
  vote_average: 7.8,
  media_type: type,
  release_date: "2024-01-01",
  original_language: "en",
  type: type
});

export const recommendationMock = (id) => ({
  page: 1,
  results: [
    { id: Number(id) + 1000, title: "Recommended Mock", poster_path: "/mock-rec.jpg", media_type: "movie" }
  ],
  total_pages: 1,
  total_results: 1
});