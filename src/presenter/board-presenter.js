import AppNavigationView from '../view/app-navigation-view.js';
import AppSortingView from '../view/app-sorting-view.js';
import MoviesBlockView from '../view/movies-block-view.js';
import MoviesListView from '../view/movies-list-view.js';
import EmptyListView from '../view/empty-movies-list-view.js';
import MoviesWrapperView from '../view/movies-wrapper-view.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';
import {render, remove} from '../framework/render.js';
import MoviePresenter from './movie-presenter.js';
import {updateItem} from '../utils/common.js';

const MOVIES_COUNT_PER_STEP = 5;

export default class BoardPresenter {
  #moviesBlockComponent = new MoviesBlockView();
  #moviesListComponent = new MoviesListView();
  #emptyMoviesListComponent = new EmptyListView();
  #moviesWrapperComponent = new MoviesWrapperView();
  #loadMoreButtonComponent = new LoadMoreButtonView();
  #renderedMoviesCount = MOVIES_COUNT_PER_STEP;
  #moviePresenter = new Map();

  #moviesContainer = null;
  #moviesModel = null;
  #moviesCards = null;
  #moviesComments = null;

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
    this.#renderNavigation();
    this.#renderSort();
    this.#renderMoviesPlace();

    if (this.#moviesCards.length === 0) {
      this.#renderEmptyList();
    } else {
      for (let i = 0; i < Math.min(this.#moviesCards.length, MOVIES_COUNT_PER_STEP); i++) {
        this.#renderMovie(this.#moviesCards[i], this.#moviesWrapperComponent.element);
      }
    }

    if (this.#moviesCards.length > MOVIES_COUNT_PER_STEP) {
      this.#renderLoadMoreButton();
      this.#loadMoreButtonComponent.setClickHandler(this.#onLoadMoreButtonClick);
    }
  };

  #renderNavigation = () => {
    render(new AppNavigationView(this.#moviesCards), this.#moviesContainer);
  };

  #renderSort = () => {
    render(new AppSortingView(), this.#moviesContainer);
  };

  #renderMoviesPlace = () => {
    render(this.#moviesBlockComponent, this.#moviesContainer);
    render(this.#moviesListComponent, this.#moviesBlockComponent.element);
    render(this.#moviesWrapperComponent, this.#moviesListComponent.element);
  };

  #renderEmptyList = () => {
    render(this.#emptyMoviesListComponent, this.#moviesBlockComponent.element);
  };

  #renderLoadMoreButton = () => {
    render(this.#loadMoreButtonComponent, this.#moviesListComponent.element);
  };

  #onLoadMoreButtonClick = () => {
    this.#moviesCards
      .slice(this.#renderedMoviesCount, this.#renderedMoviesCount + MOVIES_COUNT_PER_STEP)
      .forEach((movie) => this.#renderMovie(movie, this.#moviesWrapperComponent.element));

    this.#renderedMoviesCount += MOVIES_COUNT_PER_STEP;

    if (this.#renderedMoviesCount >= this.#moviesCards.length) {
      remove(this.#loadMoreButtonComponent);
    }
  };

  #renderMovie = (movie) => {
    const moviePresenter = new MoviePresenter(this.#moviesWrapperComponent, this.#moviesComments, this.#handleMovieChange);
    moviePresenter.init(movie);
    this.#moviePresenter.set(movie.id, moviePresenter);
  };

  #clearMoviesList = () => {
    this.#moviePresenter.forEach((presenter) => presenter.destroy());
    this.#moviePresenter.clear();
    this.#renderedMoviesCount = MOVIES_COUNT_PER_STEP;
    remove(this.#loadMoreButtonComponent);
  };

  #handleMovieChange = (updatedMovie) => {
    this.#moviesCards = updateItem(this.#moviesCards, updatedMovie);
    this.#moviePresenter.get(updatedMovie.id).init(updatedMovie);
  };
}
