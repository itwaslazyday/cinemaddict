import AppNavigationView from '../view/app-navigation-view.js';
import AppSortingView from '../view/app-sorting-view.js';
import MoviesBlockView from '../view/movies-block-view.js';
import MoviesListView from '../view/movies-list-view.js';
import RatedMoviesListView from '../view/movies-rated-list-view.js';
import CommentedMoviesListView from '../view/movies-commented-list-view.js';
import EmptyListView from '../view/empty-movies-list-view.js';
import MoviesWrapperView from '../view/movies-wrapper-view.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';
import {render, remove, RenderPosition} from '../framework/render.js';
import MoviePresenter from './movie-presenter.js';
import {updateItem} from '../utils/common.js';
import {sortByDate, sortByRating} from '../utils/movie-date.js';
import {SortType} from '../const.js';

const MOVIES_COUNT_PER_STEP = 5;
const MOVIES_COUNT_EXTRA = 2;

export default class BoardPresenter {
  #sortComponent = new AppSortingView();
  #moviesBlockComponent = new MoviesBlockView();
  #moviesListComponent = new MoviesListView();
  #ratedMoviesListComponent = new RatedMoviesListView();
  #commentedMoviesListComponent = new CommentedMoviesListView();
  #emptyMoviesListComponent = new EmptyListView();
  #moviesWrapperComponent = new MoviesWrapperView();
  #ratedMoviesWrapperComponent = new MoviesWrapperView();
  #commentedMoviesWrapperComponent = new MoviesWrapperView();
  #loadMoreButtonComponent = new LoadMoreButtonView();
  #moviePresenter = new Map();

  #renderedMoviesCount = MOVIES_COUNT_PER_STEP;
  #moviesContainer = null;
  #moviesModel = null;
  #moviesCards = [];
  #sourcedMoviesCards = [];
  #ratedMoviesCards = [];
  #commentedMoviesCards = [];
  #moviesComments = null;
  #currentSortType = SortType.DEFAULT;

  constructor(moviesContainer, moviesModel) {
    this.#moviesContainer = moviesContainer;
    this.#moviesModel = moviesModel;
    this.#sourcedMoviesCards = [...this.#moviesModel.movies];
    this.#moviesCards = [...this.#moviesModel.movies];
    this.#ratedMoviesCards = this.#moviesCards.slice().sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating);
    this.#commentedMoviesCards = this.#moviesCards.slice().sort((a, b) => b.comments.length - a.comments.length);
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
      remove(this.#sortComponent);
      this.#moviesBlockComponent.element.innerHTML = '';
      this.#renderEmptyList();
    } else {
      this.#renderMovies();
    }
  };

  #renderNavigation = () => {
    render(new AppNavigationView(this.#moviesCards), this.#moviesContainer);
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#moviesContainer);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    switch (sortType) {
      case SortType.DATE:
        this.#moviesCards.sort(sortByDate);
        break;
      case SortType.RATING:
        this.#moviesCards.sort(sortByRating);
        break;
      default:
        this.#moviesCards = [...this.#sourcedMoviesCards];
    }

    this.#currentSortType = sortType;
    this.#clearMoviesList();
    this.#renderMovies();
  };

  #renderMoviesPlace = () => {
    render(this.#moviesBlockComponent, this.#moviesContainer);
    render(this.#moviesListComponent, this.#moviesBlockComponent.element);
    render(this.#ratedMoviesListComponent, this.#moviesBlockComponent.element);
    render(this.#commentedMoviesListComponent, this.#moviesBlockComponent.element);
    render(this.#moviesWrapperComponent, this.#moviesListComponent.element);
    render(this.#ratedMoviesWrapperComponent, this.#ratedMoviesListComponent.element);
    render(this.#commentedMoviesWrapperComponent, this.#commentedMoviesListComponent.element);
  };

  #renderMovies = () => {
    for (let i = 0; i < Math.min(this.#moviesCards.length, MOVIES_COUNT_PER_STEP); i++) {
      this.#renderMovie(this.#moviesCards[i], this.#moviesWrapperComponent);
    }
    for (let i = 0; i < Math.min(this.#ratedMoviesCards.length, MOVIES_COUNT_EXTRA); i++) {
      this.#renderMovie(this.#ratedMoviesCards[i], this.#ratedMoviesWrapperComponent, 'rated');
    }
    for (let i = 0; i < Math.min(this.#commentedMoviesCards.length, MOVIES_COUNT_EXTRA); i++) {
      this.#renderMovie(this.#commentedMoviesCards[i], this.#commentedMoviesWrapperComponent, 'commented');
    }

    if (this.#moviesCards.length > MOVIES_COUNT_PER_STEP) {
      this.#renderLoadMoreButton();
      this.#loadMoreButtonComponent.setClickHandler(this.#onLoadMoreButtonClick);
    }
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
      .forEach((movie) => this.#renderMovie(movie, this.#moviesWrapperComponent));

    this.#renderedMoviesCount += MOVIES_COUNT_PER_STEP;

    if (this.#renderedMoviesCount >= this.#moviesCards.length) {
      remove(this.#loadMoreButtonComponent);
    }
  };

  #renderMovie = (movie, container, extra) => {
    const moviePresenter = new MoviePresenter(container, this.#moviesComments, this.#handleMovieChange);
    moviePresenter.init(movie);
    switch (extra) {
      case 'rated':
        this.#moviePresenter.set(`${`${movie.id}R`}`, moviePresenter);
        break;
      case 'commented':
        this.#moviePresenter.set(`${`${movie.id}C`}`, moviePresenter);
        break;
      default:
        this.#moviePresenter.set(movie.id, moviePresenter);
    }
  };

  #clearMoviesList = () => {
    this.#moviePresenter.forEach((presenter) => presenter.destroy());
    this.#moviePresenter.clear();
    this.#renderedMoviesCount = MOVIES_COUNT_PER_STEP;
    remove(this.#loadMoreButtonComponent);
  };

  #handleMovieChange = (updatedMovie) => {
    this.#moviesCards = updateItem(this.#moviesCards, updatedMovie);
    this.#sourcedMoviesCards = updateItem(this.#sourcedMoviesCards, updatedMovie);
    this.#ratedMoviesCards = updateItem(this.#moviesCards, updatedMovie);
    this.#commentedMoviesCards = updateItem(this.#moviesCards, updatedMovie);
    document.querySelector('.main-navigation').remove();
    render(new AppNavigationView(this.#moviesCards), this.#moviesContainer, RenderPosition.AFTERBEGIN);
    if (this.#moviePresenter.get(updatedMovie.id)) {
      this.#moviePresenter.get(updatedMovie.id).init(updatedMovie);
    }
    const ratedPresenter = this.#moviePresenter.get(`${`${updatedMovie.id}R`}`);
    const commentedPresenter = this.#moviePresenter.get(`${`${updatedMovie.id}C`}`);
    if (ratedPresenter) {
      ratedPresenter.init(updatedMovie);
    }
    if (commentedPresenter) {
      commentedPresenter.init(updatedMovie);
    }
  };
}
