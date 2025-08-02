import { movieService } from "./searchMovies.js";
import { createTable } from "./functions.js";
import { API, MovieType, tmdbKey } from "./constValues.js";

export class updateDOM {
  static state = {
    moviesContainer: null,
    wrapperMoviesCards: null,
    moreMoviesButton: { idValue: "buttonMoreMovies", element: null },
    serchMoviesButton: null,
    loadAnimation: { idValue: "loadAnimation", element: null },
    formElement: null,
    document: null,
    windowHeight: null,
    detailsCard: null,
    moviesNotFound: null,
  };

  static addMovieCards(arrP) {
    arrP.forEach((dataP) => {
      this.state.wrapperMoviesCards.appendChild(this.createMovieCard(dataP));
    });

    document.body.insertBefore(
      this.state.moviesContainer,
      this.state.formElement.nextSibling
    );
    this.updateHeightTitle();
    // let currentHeight;
  }

  static getFormElement() {
    this.state.formElement = document.getElementById("movieSearch");
  }

  static createMovieCard(elementResponseP) {
    const wrapperP = document.createElement("div");

    wrapperP.id = "loadData";

    const container = document.createElement("div");
    container.classList.add("filmCard");

    wrapperP.appendChild(container);

    const img = document.createElement("img");
    img.src = elementResponseP.imgSrc;

    const h4 = document.createElement("h4");
    h4.innerText = elementResponseP.title;

    const span = document.createElement("span");
    span.innerText = elementResponseP.year;

    const button = document.createElement("button");
    button.innerText = "Details";

    button.onclick = async (e) => {
      const url = { value: null };

      this.createContainerAndWrapperDetailsCard();

      this.addLoadAnimation({ addTo: this.state.detailsCard });
      this.updateTop();

      switch (true) {
        case API.omdb.name == movieService.state.currentDB:
          url.value = `${API.omdb.url}&i=${elementResponseP.id}`;
          await movieService.getMovieById(url.value, button);

          setTimeout(() => {
            this.removeLoadAnimation();
            this.addContentDetailsCard(movieService.state.movieDeatils);
            this.updateTop();
          }, 2500);

          break;

        case API.tmdb.name == movieService.state.currentDB:
          const { value } = updateDOM.state.formElement.typeMovie;
          switch (true) {
            case value == MovieType.movie:
              url.value = `${API.tmdb.urlMovieGetDetails}${elementResponseP.id}?api_key=${tmdbKey}`;
              console.log(url.value);
              await movieService.getMovieById(url.value, button);

              setTimeout(() => {
                this.removeLoadAnimation();
                this.addContentDetailsCard(movieService.state.movieDeatils);
                this.updateTop();
              }, 2500);

              break;
            case value == MovieType.series:
              url.value = `${API.tmdb.urlTVGetDetails}${elementResponseP.id}?api_key=${tmdbKey}`;
              await movieService.getMovieById(url.value, button);
              setTimeout(() => {
                this.removeLoadAnimation();
                this.addContentDetailsCard(movieService.state.movieDeatils);
                this.updateTop();
              }, 2500);

              break;
          }

          break;
      }
    };

    const arr = [img, h4, span, button];

    arr.forEach((elemnt) => container.appendChild(elemnt));

    return wrapperP;
  }

  static createMoreFilmsButton() {
    const moreFilmsButton = document.createElement("button");
    // moreFilmsButton.id = 
    moreFilmsButton.id = this.state.moreMoviesButton.idValue;

    moreFilmsButton.innerText = "More";

    this.state.moreMoviesButton.element = moreFilmsButton;
    // window.location.hash = "buttonMoreMovies";
  }

  static createMoviesContainer() {
    const moviesContainer = document.createElement("div");
    moviesContainer.id = "filmsContainer";

    let h3 = document.createElement("h3");
    h3.innerText = "Movies";

    moviesContainer.appendChild(h3);

    const wrapperFilmCards = document.createElement("div");
    wrapperFilmCards.id = "wrapperFilmCards";

    this.createMoreFilmsButton();

    moviesContainer.appendChild(wrapperFilmCards);
    moviesContainer.appendChild(this.state.moreMoviesButton.element);

    this.state.moviesContainer = moviesContainer;
    this.state.wrapperMoviesCards = wrapperFilmCards;

    this.state.serchMoviesButton = document.getElementById("search");
  }

  static getCSSProperty(elementP, propertyP) {
    return window.getComputedStyle(elementP)[propertyP].slice(0, -2);
  }

  static updateHeightTitle() {
    const h4Elements = this.state.wrapperMoviesCards.querySelectorAll("h4");

    const defaultHeight = window
      .getComputedStyle(h4Elements[0])
      .height.slice(0, -2);

    const h4Update = {
      defaultHeight,
      height: null,
    };

    h4Elements.forEach((element, key, list) => {
      let currentHeight = this.getCSSProperty(element, "height");

      if (h4Update.defaultHeight < currentHeight) {
        h4Update.height = currentHeight;
      }

      if (key == list.length - 1) {
        h4Elements.forEach((element) => {
          currentHeight = this.getCSSProperty(element, "height");
          if (
            currentHeight < h4Update.height ||
            currentHeight < h4Update.defaultHeight
          ) {
            element.style.lineHeight = `${h4Update.height || h4Update.defaultHeight
              }px`;
          }
        });
      }
    });
  }

  static createLoadAnimatoin() {
    // console.log("test");
    const wrapperAnimation = document.createElement("div");
    wrapperAnimation.classList.add("wrapperLoadAnimation");
    for (let i = 0; i < 12; i++) {
      let div = document.createElement("div");
      div.classList.add("lines");
      wrapperAnimation.appendChild(div);
    }

    const form = document.getElementById("filmsSearch");

    // document.body.insertBefore(wrapperAnimation, insertBeforeP);
    this.state.loadAnimation.element = wrapperAnimation;
    wrapperAnimation.id = this.state.loadAnimation.idValue;
  }

  static addLoadAnimation({ insertBeforeP = null, addTo }) {
    insertBeforeP &&
      insertBeforeP.parentNode.insertBefore(
        this.state.loadAnimation.element,
        insertBeforeP.nextSibling
      );

    console.log(addTo);
    addTo && addTo.appendChild(this.state.loadAnimation.element);
  }

  static removeLoadAnimation() {
    this.state.loadAnimation.element.remove();
  }

  static createContainerAndWrapperDetailsCard() {
    const container = document.createElement("div");
    container.classList.add("movieDetailsCardContainer");
    const wrapper = document.createElement("div");
    wrapper.classList.add("movieDetailsCardLoad");

    container.appendChild(wrapper);

    this.state.detailsCard = wrapper;

    this.state.document.body.appendChild(container);
  }

  static addContentDetailsCard(valueP) {
    if (valueP) {
      this.state.detailsCard.classList.add("movieDetailsCard");

      const img = document.createElement("img");
      img.src = `${valueP.imgSrc}`;

      if (valueP.imgSrc == "icons/no-image.svg") {
        img.classList.add("noImage");
      }

      const table = document.createElement("table");

      delete valueP.imgSrc;

      this.state.detailsCard.appendChild(img);
      this.state.detailsCard.appendChild(table);

      this.closeElement(this.state.detailsCard);

      createTable(valueP, table);

      this.updateTop();
    }
  }

  static updateTop() {
    if (this.state.detailsCard) {
      const top =
        (this.state.windowHeight - this.state.detailsCard.clientHeight) / 2;
      console.log(top);
      this.state.detailsCard.style.top = `${top}px`;
    }
  }

  static closeElement(containerP) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("closeElement");
    const line_1 = document.createElement("div");
    const line_2 = document.createElement("div");

    wrapper.appendChild(line_1);
    wrapper.appendChild(line_2);

    containerP.appendChild(wrapper);
    wrapper.onclick = () => {
      this.state.detailsCard.parentNode.remove();
    };
  }

  static createError(e, buttonP) {
    buttonP.disabled = true;
    alert("something is wrong, this movie is not available");
  }
}
