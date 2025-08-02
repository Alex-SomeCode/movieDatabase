const key_1 = "N2ZlZTRiYTA1Y2JiMTczNmY5ZWE0YzE3MjNiYjJiYzc=";
const key_2 = " NGNiZmFjYjg=";

export const tmdbKey = atob(key_1);
const omdKey = atob(key_2);

const omdbName = "omdbapi";
const tmdbName = "tmdb";

export const keysOrderTmdb = [
  "title",
  "release_date",
  "genres",
  "production_countries",
  "owerview",
  "tagline",
];
export const MovieType = {
  movie: "movie",
  series: "series",
};

export const API = {
  omdb: { name: omdbName, url: `http://www.omdbapi.com/?apikey=${omdKey}` },
  tmdb: {
    name: tmdbName,

    urlMoviesSearch: `https://api.themoviedb.org/3/search/movie?api_key=${tmdbKey}`,

    urlTVSearch: `https://api.themoviedb.org/3/search/tv?api_key=${tmdbKey}`,

    urlTVGetDetails: `https://api.themoviedb.org/3/tv/`,

    urlMovieGetDetails: `https://api.themoviedb.org/3/movie/`,

    imgUrl: "https://image.tmdb.org/t/p/w200",
  },
};



