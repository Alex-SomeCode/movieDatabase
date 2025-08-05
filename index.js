import { movieService } from "./jsSrc/searchMovies.js";
import { createUrlByTitleSearch } from "./jsSrc/functions.js";
import { updateDOM } from "./jsSrc/updateDOM.js";
import { focusElement } from "./jsSrc/functions.js";

const search = document.getElementById("search");
const formP = document.forms.movieSearch;
const valueLoadNextFilm = { begin: 0, end: 5 };

document.addEventListener("DOMContentLoaded", () => {
  console.log("test");
  updateDOM.createMoviesContainer();
  updateDOM.createLoadAnimatoin();
  updateDOM.getFormElement();

  updateDOM.state.windowHeight = document.documentElement.clientHeight;

  window.onresize = () => {
    updateDOM.state.windowHeight = document.documentElement.clientHeight;
    updateDOM.updateTop();
  };

  search.onclick = async function (e) {
    e.preventDefault();

    this.disabled = true;

    movieService.state.currentDB = updateDOM.state.formElement.apiValue.value;

    updateDOM.state.wrapperMoviesCards.innerHTML = "";
    updateDOM.state.moviesContainer.remove();

    if (!formP.title.value.length > 0) {
      return;
    }

    if (updateDOM.state.moviesNotFound) {
      updateDOM.state.moviesNotFound.remove();
    }

    updateDOM.addLoadAnimation({ insertBeforeP: updateDOM.state.formElement });

    const error = await movieService.getMovies({ formP });

    setTimeout(() => {
      updateDOM.removeLoadAnimation();
      this.removeAttribute("disabled");

      if (error) {
        if (!updateDOM.state.moviesNotFound) {
          const h3 = document.createElement("h3");

          h3.id = "moviesNotFound";

          h3.innerText = "Movies are not found";

          document.body.appendChild(h3);

          h3.style.margin = "50px auto";
          updateDOM.state.moviesNotFound = h3;
          return;
        }

        document.body.appendChild(updateDOM.state.moviesNotFound);
        return;
      }

      if (movieService.state.movies.length >= 5) {
        updateDOM.addMovieCards(movieService.state.movies.splice(0, 5));
        return;
      }

      updateDOM.addMovieCards(movieService.state.movies.splice(0, movieService.state.movies.length));
      updateDOM.state.moreMoviesButton.element.remove()
    }, 2500);
  };

  updateDOM.state.document = document;
  // -----------------------------------------------------------------

  updateDOM.state.moreMoviesButton.element.onclick = async function (e) {
    updateDOM.addLoadAnimation({
      insertBeforeP: updateDOM.state.wrapperMoviesCards,
    });
    updateDOM.state.serchMoviesButton.disabled = true;
    updateDOM.state.moreMoviesButton.element.disabled = true;

    focusElement(updateDOM.state.loadAnimation.idValue);
    const length = movieService.state.movies.length;

    length !== 0 &&
      setTimeout(() => {
        console.log(length);
        switch (true) {
          case length >= 5:
            movieService.state.movies.splice(0, 5).forEach((element) => {
              updateDOM.state.wrapperMoviesCards.appendChild(
                updateDOM.createMovieCard(element)
              );
            });
            break;
          case length > 0 && length < 5:
            movieService.state.movies.splice(0, length).forEach((element) => {
              updateDOM.state.wrapperMoviesCards.appendChild(
                updateDOM.createMovieCard(element)
              );
            });
            break;
        }
        updateDOM.updateHeightTitle();
        updateDOM.removeLoadAnimation();
        updateDOM.state.serchMoviesButton.removeAttribute("disabled");
        updateDOM.state.moreMoviesButton.element.removeAttribute("disabled");
        focusElement(updateDOM.state.moreMoviesButton.idValue);
      }, 2500);

    if (length == 0) {
      if (!movieService.state.url.nextValues) {
        movieService.state.url.nextValues = `${movieService.state.url.beginValue
          }&page=${++movieService.state.currentPage}`;
      } else {
        console.log("test_2");
        movieService.state.url.nextValues =
          movieService.state.url.nextValues.replace(
            /page=\d/,
            `page=${++movieService.state.currentPage}`
          );
      }

      await movieService.getMovies({ urlP: movieService.state.url.nextValues });

      setTimeout(() => {
        movieService.state.movies.splice(0, 5).forEach((element) => {
          updateDOM.state.wrapperMoviesCards.appendChild(
            updateDOM.createMovieCard(element)
          );
        });

        updateDOM.updateHeightTitle();
        updateDOM.removeLoadAnimation();
        updateDOM.state.serchMoviesButton.removeAttribute("disabled");
        updateDOM.state.moreMoviesButton.element.removeAttribute("disabled");
        focusElement(updateDOM.state.moreMoviesButton.idValue);
      }, 2500);
    }

    // await updateDOM.addMoreMovies();
  };
});
