import AppNavigationView from '../view/app-navigation-view.js';
import AppSortingView from '../view/app-sorting-view.js';
import MoviesBlockView from '../view/movies-block-view.js';
import MoviesListView from '../view/movies-list-view.js';
import MoviesWrapperView from '../view/movies-wrapper-view.js';
import MovieCardView from '../view/movie-card-view.js';
import PopupView from '../view/popup-view.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';
import {render, RenderPosition} from '../render.js';
import {isEscapeKey} from '../utils.js';

const pageBody = document.querySelector('body');
const siteFooterElement = pageBody.querySelector('footer');

const onPopupCloseClick = () => {
  document.querySelector('.film-details').remove();
  pageBody.classList.toggle('hide-overflow');
};

const onPopupEscPress = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    onPopupCloseClick();
  }
};
const setPopupWindow = (element) => {
  pageBody.classList.toggle('hide-overflow');
  const popupCloseButton = element.querySelector('.film-details__close-btn');
  popupCloseButton.addEventListener('click', onPopupCloseClick, {once: true});
  document.addEventListener('keydown', onPopupEscPress, {once: true});
};

export default class MoviesPresenter {
  #moviesBlock = new MoviesBlockView();
  #moviesList = new MoviesListView();
  #moviesWrapper = new MoviesWrapperView();

  #moviesContainer = null;
  #moviesModel = null;
  #moviesCards = null;
  #moviesComments = null;
  #moviePopup = null;

  init = (moviesContainer, moviesModel) => {
    this.#moviesContainer = moviesContainer;
    this.#moviesModel = moviesModel;
    this.#moviesCards = [...this.#moviesModel.movies];
    this.#moviesComments = [...this.#moviesModel.comments];

    render(new AppNavigationView(), this.#moviesContainer);
    render(new AppSortingView(), this.#moviesContainer);
    render(this.#moviesBlock, this.#moviesContainer);
    render(this.#moviesList, this.#moviesBlock.element);
    render(this.#moviesWrapper, this.#moviesList.element);

    for (let i = 0; i < this.#moviesCards.length; i++) {
      this.#renderFilm(this.#moviesCards[i],this.#moviesWrapper.element);
    }
    render(new LoadMoreButtonView(), this.#moviesList.element);

    this.#moviesBlock.element.addEventListener('click',
      (evt) => {
        if (evt.target.classList.contains('film-card__poster')) {
          if (document.querySelector('.film-details')) {
            onPopupCloseClick();
          }
          const movieId = evt.target.dataset.id;
          this.#renderPopup(movieId);
        }
      }
    );
  };

  #renderFilm = (movie, container) => {
    const movieCard  = new MovieCardView(movie);
    render(movieCard, container);
  };

  #renderPopup = (id) => {
    this.#moviePopup = new PopupView(this.#moviesCards[id], this.#moviesComments);
    render(this.#moviePopup, siteFooterElement, RenderPosition.AFTEREND);
    setPopupWindow(this.#moviePopup.element);
  };
}
