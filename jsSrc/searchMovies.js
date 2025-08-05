import {
  createUrlByTitleSearch,
  createArrayFromResponse,
  createObjectFromResponse,
} from "./functions.js";

import { API } from "./constValues.js";
import { updateDOM } from "./updateDOM.js";

export class movieService {
  static state = {
    url: { beginValue: null, nextValues: null },
    request: null,
    totalPages: null,
    movies: null,
    searchValue: null,
    currentPage: 1,
    currentDB: null,
    movieDeatils: null,
  };

  static async getMovies({ formP, urlP }) {
    formP && this.createRequest({ formP });

    urlP && this.createRequest({ urlP });

    this.state.request.open(
      "GET",
      this.state.url.nextValues || this.state.url.beginValue
    );

    return new Promise((resolve, reject) => {
      this.state.request.onreadystatechange = () => {
        if (
          this.state.request.readyState === 4 &&
          this.state.request.status == 200
        ) {
          const { response } = this.state.request;

          console.log(response);
          switch (true) {
            case response.Response == "False":
              resolve("OMDb films not found");
              break;
            case response.total_results == 0:
              resolve("TMDb films not found");
              break;
            case response.Response == "True":
              this.state.totalPages = response.totalResults / 10;
              this.state.movies = createArrayFromResponse(response.Search);
              resolve();
              break;
            case response.results.length > 0:
              this.state.totalPages = response.total_pages;
              this.state.movies = createArrayFromResponse(
                response.results,
                API.tmdb.name
              );
              resolve();
              break;
          }
        }
      };

     this.state.request.send();
    });
  }

  static createRequest({ formP, urlP }) {
    this.createUrl({ formP, urlP });

    // console.log(requestP);
    if (window.XMLHttpRequest) {
      this.state.request = new XMLHttpRequest();
    } else {
      this.state.request = new ActiveXObject();
    }
    this.state.request.responseType = "json";
  }

  static createUrl({ formP, urlP }) {
    formP && (this.state.url.beginValue = createUrlByTitleSearch(formP));
    urlP && (this.state.url.nextValues = urlP);
  }

  static getMovieById(urlP, buttonP) {
    const { request } = this.state;

    this.createRequest(urlP);

    console.log(request);
    request.open("GET", urlP);
    return new Promise((resolve, reject) => {
      request.onloadend = (e) => {
        const { response } = request;
        console.log(response);
        createObjectFromResponse(response, movieService.state.currentDB);
        resolve();
      };

      request.onerror = () => {
        updateDOM.createError(buttonP);
        resolve();
      };

      request.send();
    });
  }
}
