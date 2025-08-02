import { API, MovieType } from "./constValues.js";
import { movieService } from "./searchMovies.js";
import { keysOrderTmdb } from "./constValues.js";

export function createUrlByTitleSearch(formP) {
  console.log(formP);
  if (!formP.title.value.length > 0) {
    return;
  }

  let url = "";

  switch (formP.apiValue.value) {
    //
    case API.omdb.name:
      // movieService.state.api = API.omdb.name;
      url = `${API.omdb.url}&s=${formP.title.value}`;
      switch (formP.typeMovie.value) {
        case MovieType.movie:
          url += `&type=${formP.typeMovie.value}`;
          console.log(url);
          return url;
        case MovieType.series:
          url += `&type=${formP.typeMovie.value}`;
          return url;
      }

    case API.tmdb.name:
      // movieService.state.api = API.tmdb.name;
      switch (formP.typeMovie.value) {
        case MovieType.movie:
          url = `${API.tmdb.urlMoviesSearch}&query=${formP.title.value}`;
          return url;
        case MovieType.series:
          url = `${API.tmdb.urlTVSearch}&query=${formP.title.value}`;
          return url;
      }
  }
}

export function createArrayFromResponse(responseP, dbNameP) {
  const arrP = [];

  responseP.forEach((element) => {
    const obj = {};

    for (let key in element) {
      switch (true) {
        case /^poster_path$|^poster$/i.test(key):
          if (!element[key]) {
            obj["imgSrc"] = "icons/no-image.svg";
            continue;
          }

          if (dbNameP == API.tmdb.name) {
            obj["imgSrc"] = `${API.tmdb.imgUrl}${element[key]}`;
            continue;
          }

          obj["imgSrc"] = element[key];

          break;

        case /^title$|^name$/i.test(key):
          obj["title"] = element[key];

          break;

        case /(^release_date$|^year$|^first_air_date$)/i.test(key):
          obj["year"] = element[key] == "" ? "no info" : element[key];

          break;

        case /^id$|^imdbid$/i.test(key):
          obj["id"] = element[key];

          break;
      }
    }

    arrP.push(obj);
  });
  return arrP;
}

export function focusElement(idValueP) {
  window.location.hash = "";
  window.location.hash = idValueP;
}
//           omdb    tmdb
// title       +      +    title
// title       +      +    title
// released    +      +    release_date
// genre       +      +    genres: [{id: 35, name: 'Comedy'}]
// country     +      +    production_countries: [{iso_3166_1: 'JP', name: 'Japan'}]
// director    +      -
// writter     +      -
// actors      +      -
// awards      +      -

export function createTable(valueP, tableP) {
  if (movieService.state.currentDB == API.tmdb.name) {
    keysOrderTmdb.forEach((element) => {
      for (const key in valueP) {
        if (key == element) {
          createTrTd(valueP, key, tableP);
        }
      }
    });
    return;
  }

  for (const key in valueP) {
    createTrTd(valueP, key, tableP);
  }
}

function createTrTd(valueP, keyP, tableP) {
  const tr = document.createElement("tr");
  const td_1 = document.createElement("td");
  const td_2 = document.createElement("td");

  td_1.innerText = `${keyP[0].toUpperCase()}${keyP
    .slice(1)
    .toLowerCase()}`.replace("_", " ");

  td_1.style.fontWeight = "bold";
  td_2.innerText = valueP[keyP];

  tr.appendChild(td_1);
  tr.appendChild(td_2);

  tableP.appendChild(tr);
}

export function createObjectFromResponse(responseP, dbName) {
  const obj = {};
  let value;
  for (let key in responseP) {
    switch (true) {
      case /title/i.test(key):
        obj["title"] = responseP[key];
        break;

      case /released|release_date/i.test(key):
        obj["release_date"] = responseP[key];
        break;

      case /genre|genres/i.test(key):
        value = "genres";

        if (dbName == API.tmdb.name) {
          obj[value] = "";

          responseP[key].forEach((element, index, arr) => {
            if (arr.length - 1 == index) {
              obj[value] += `${element.name}`;
              console.log(obj[value]);
              return;
            }

            obj[value] += `${element.name}, `;
          });
          break;
        }

        obj[value] = responseP[key];
        break;

      case /country|production_countries/i.test(key):
        value = "production_countries";
        if (dbName == API.tmdb.name) {
          obj[value] = "";

          responseP[key].forEach((element, index, arr) => {
            console.log(element.name);
            if (index == arr.length - 1) {
              obj[value] += `${element.name}`;
              console.log(obj[value]);
              return;
            }
            obj[value] += `${element.name}, `;
          });
          continue;
        }
        obj[value] = responseP[key];
        break;

      case /director/i.test(key):
        obj["director"] = responseP[key];
        break;

      case /writer/i.test(key):
        obj["writter"] = responseP[key];
        break;

      case /actor/i.test(key):
        obj["actor"] = responseP[key];
        break;

      case /awards/i.test(key):
        obj["awards"] = responseP[key];
        break;

      case /poster|poster_path/i.test(key):
        if (dbName == API.tmdb.name) {
          responseP[key] &&
            (obj["imgSrc"] = `${API.tmdb.imgUrl}${responseP[key]}`);

          obj["imgSrc"] || (obj["imgSrc"] = `icons/no-image.svg`);

          continue;
        }
        obj["imgSrc"] = responseP[key];
        break;

      case /overview/i.test(key):
        obj["overview"] = responseP[key];
        break;

      case /tagline/i.test(key):
        obj["tagline"] = responseP[key];
        break;
    }
  }

  movieService.state.movieDeatils = obj;
}
