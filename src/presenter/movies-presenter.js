import AppNavigationView from '../view/app-navigation-view.js';
import AppSortingView from '../view/app-sorting-view.js';
import MoviesBlockView from '../view/movies-block-view.js';
import MoviesListView from '../view/movies-list-view.js';
import EmptyListView from '../view/empty-movies-list-view.js';
import MoviesWrapperView from '../view/movies-wrapper-view.js';
import MovieCardView from '../view/movie-card-view.js';
import PopupView from '../view/popup-view.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';
import {render, RenderPosition, remove} from '../framework/render.js';
import {isEscapeKey} from '../utils/common.js';

const pageBody = document.querySelector('body');
const siteFooterElement = pageBody.querySelector('footer');
const MOVIES_COUNT_PER_STEP = 5;

export default class MoviesPresenter {
  #moviesBlock = new MoviesBlockView();
  #moviesList = new MoviesListView();
  #emptyMoviesList = new EmptyListView();
  #moviesWrapper = new MoviesWrapperView();
  #loadMoreButtonComponent = new LoadMoreButtonView();
  #renderedMoviesCount = MOVIES_COUNT_PER_STEP;

  #moviesContainer = null;
  #moviesModel = null;
  #moviesCards = null;
  #moviesComments = null;
  #moviePopup = null;

  constructor(moviesContainer, moviesModel) {
    this.#moviesContainer = moviesContainer;
    this.#moviesModel = moviesModel;
    this.#moviesCards = [...this.#moviesModel.movies];
    this.#moviesComments = [...this.#moviesModel.comments];
  }

  init = () => {
    this.#renderBoard();
  };

  #renderBoard = () => {
    render(new AppNavigationView(this.#moviesCards), this.#moviesContainer);
    render(new AppSortingView(), this.#moviesContainer);
    render(this.#moviesBlock, this.#moviesContainer);
    render(this.#moviesList, this.#moviesBlock.element);
    render(this.#moviesWrapper, this.#moviesList.element);

    if (this.#moviesCards.length === 0) {
      render(this.#emptyMoviesList, this.#moviesBlock.element);
    } else {
      for (let i = 0; i < Math.min(this.#moviesCards.length, MOVIES_COUNT_PER_STEP); i++) {
        this.#renderMovie(this.#moviesCards[i], this.#moviesWrapper.element);
      }

      this.#moviesBlock.setClickHandler(
        (evt) => {
          if (evt.target.classList.contains('film-card__poster')) {
            if (document.querySelector('.film-details')) {
              this.#onPopupCloseClick();
            }
            const movieId = evt.target.dataset.id;
            this.#renderPopup(movieId);
          }
        }
      );
    }

    if (this.#moviesCards.length > MOVIES_COUNT_PER_STEP) {
      render(this.#loadMoreButtonComponent, this.#moviesList.element);
      this.#loadMoreButtonComponent.setClickHandler(this.#onLoadMoreButtonClick);
    }
  };

  #onLoadMoreButtonClick = () => {
    this.#moviesCards
      .slice(this.#renderedMoviesCount, this.#renderedMoviesCount + MOVIES_COUNT_PER_STEP)
      .forEach((movie) => this.#renderMovie(movie, this.#moviesWrapper.element));

    this.#renderedMoviesCount += MOVIES_COUNT_PER_STEP;

    if (this.#renderedMoviesCount >= this.#moviesCards.length) {
      remove(this.#loadMoreButtonComponent);
    }
  };

  #renderMovie = (movie, container) => {
    const movieCard  = new MovieCardView(movie);
    render(movieCard, container);
  };

  #renderPopup = (id) => {
    this.#moviePopup = new PopupView(this.#moviesCards[id], this.#moviesComments);
    render(this.#moviePopup, siteFooterElement, RenderPosition.AFTEREND);
    pageBody.classList.toggle('hide-overflow');
    this.#moviePopup.setClickHandler(this.#onPopupCloseClick);
    document.addEventListener('keydown', this.#onPopupEscPress);
  };

  #onPopupCloseClick = () => {
    document.querySelector('.film-details').remove();
    pageBody.classList.toggle('hide-overflow');
    document.removeEventListener('keydown', this.#onPopupEscPress);
  };

  #onPopupEscPress = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.#onPopupCloseClick();
    }
  };
}
