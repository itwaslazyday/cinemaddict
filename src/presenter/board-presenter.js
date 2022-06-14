import AppSortingView from '../view/app-sorting-view.js';
import MoviesBlockView from '../view/movies-block-view.js';
import MoviesListView from '../view/movies-list-view.js';
import RatedMoviesListView from '../view/movies-rated-list-view.js';
import CommentedMoviesListView from '../view/movies-commented-list-view.js';
import EmptyListView from '../view/empty-movies-list-view.js';
import MoviesWrapperView from '../view/movies-wrapper-view.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';
import LoadingView from '../view/loading-view.js';
import SiteFooterView from '../view/site-footer-view.js';
import {render, remove, RenderPosition} from '../framework/render.js';
import MoviePresenter from './movie-presenter.js';
import {sortByDate, sortByRating} from '../utils/movie-date.js';
import {SortType, UpdateType} from '../const.js';
import {filter} from '../utils/filter.js';
import {Error} from '../services/movies-api-service.js';

const MOVIES_COUNT_PER_STEP = 5;
const MOVIES_COUNT_EXTRA = 2;

export default class BoardPresenter {
  #emptyMoviesListComponent = null;
  #currentSortType = SortType.DEFAULT;

  #sortComponent = new AppSortingView(this.#currentSortType);
  #moviesBlockComponent = new MoviesBlockView();
  #moviesListComponent = new MoviesListView();
  #ratedMoviesListComponent = new RatedMoviesListView();
  #commentedMoviesListComponent = new CommentedMoviesListView();
  #moviesWrapperComponent = new MoviesWrapperView();
  #ratedMoviesWrapperComponent = new MoviesWrapperView();
  #commentedMoviesWrapperComponent = new MoviesWrapperView();
  #loadMoreButtonComponent = new LoadMoreButtonView();
  #loadingComponent = new LoadingView();
  #moviePresenter = new Map();
  #ratedMoviesPresenter = new Map();
  #commentedMoviesPresenter = new Map();

  #renderedMoviesCount = MOVIES_COUNT_PER_STEP;
  #moviesContainer = null;
  #moviesModel = null;
  #filterModel = null;
  #commentsModel = null;
  #isLoading = true;

  constructor(moviesContainer, moviesModel, filterModel, commentsModel) {
    this.#moviesContainer = moviesContainer;
    this.#moviesModel = moviesModel;
    this.#moviesModel.founded = false;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;
    this.#moviesModel.addObserver(this.#handleMovieEvent);
    this.#commentsModel.addObserver(this.#handleMovieEvent);
    this.#filterModel.addObserver(this.#handleMovieEvent);
  }

  get movies() {
    const filterType = this.#filterModel.filter;
    const movies = this.#moviesModel.movies;
    const filteredMovies = filter[filterType](movies);

    switch (this.#currentSortType) {
      case SortType.DATE:
        return [...filteredMovies.slice().sort(sortByDate)];
      case SortType.RATING:
        return [...filteredMovies.slice().sort(sortByRating)];
    }
    return [...filteredMovies];
  }

  init = () => {
    this.#renderBoard();
  };

  #renderBoard = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    this.#renderSort(this.#sortComponent, this.#moviesContainer);
    this.#renderSiteFooter(new SiteFooterView(this.movies.length), this.#moviesContainer, RenderPosition.AFTEREND);
    this.#renderMoviesPlace();

    if (this.movies.length === 0) {
      remove(this.#sortComponent);
      this.#moviesBlockComponent.element.innerHTML = '';
      this.#renderEmptyList();
    } else {
      this.#renderUpSideMovies();
      this.#renderDownSideMovies();
    }
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#moviesContainer);
  };


  #renderSort = (component, container, position) => {
    render(component, container, position);
    this.isSorting = false;
    component.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#handleMovieEvent(UpdateType.MINOR, this.isSorting = true);
  };

  #renderSiteFooter = (component, container, position) => {
    render(component, container, position);
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

  #renderUpSideMovies = () => {
    for (let i = 0; i < Math.min(this.movies.length, this.#renderedMoviesCount); i++) {
      this.#renderMovie(this.movies[i], this.#moviesWrapperComponent);
    }
    if (this.movies.length > MOVIES_COUNT_PER_STEP) {
      this.#renderLoadMoreButton();
      this.#loadMoreButtonComponent.setClickHandler(this.#onLoadMoreButtonClick);
    }
  };

  #renderDownSideMovies = () => {
    const ratedMovies = this.#moviesModel.movies.slice().sort(sortByRating);
    if (ratedMovies.length) {
      if (!document.querySelector('.films-list--rated')) {
        render(this.#ratedMoviesListComponent, this.#moviesBlockComponent.element, RenderPosition.AFTERBEGIN);
        render(this.#ratedMoviesWrapperComponent, this.#ratedMoviesListComponent.element);
      }
      for (let i = 0; i < Math.min(ratedMovies.length, MOVIES_COUNT_EXTRA); i++) {
        this.#renderMovie(ratedMovies[i], this.#ratedMoviesWrapperComponent, 'rated');
      }
    } else {
      this.#ratedMoviesListComponent.element.remove();
    }
    const commentedMovies = this.#moviesModel.movies.slice().sort((a, b) =>
      b.comments.length - a.comments.length).filter((item) => item.comments.length !== 0);
    if (commentedMovies.length) {
      if (!document.querySelector('.films-list--commented')) {
        render(this.#commentedMoviesListComponent, this.#moviesBlockComponent.element);
        render(this.#commentedMoviesWrapperComponent, this.#commentedMoviesListComponent.element);
      }
      for (let i = 0; i < Math.min(commentedMovies.length, MOVIES_COUNT_EXTRA); i++) {
        this.#renderMovie(commentedMovies[i], this.#commentedMoviesWrapperComponent, 'commented');
      }
    } else {
      this.#commentedMoviesListComponent.element.remove();
    }
  };

  #renderEmptyList = (currentFilter) => {
    this.#emptyMoviesListComponent = new EmptyListView(currentFilter);
    render(this.#emptyMoviesListComponent, this.#moviesBlockComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderLoadMoreButton = () => {
    render(this.#loadMoreButtonComponent, this.#moviesListComponent.element);
  };

  #onLoadMoreButtonClick = () => {
    this.movies
      .slice(this.#renderedMoviesCount, this.#renderedMoviesCount + MOVIES_COUNT_PER_STEP)
      .forEach((movie) => this.#renderMovie(movie, this.#moviesWrapperComponent));

    this.#renderedMoviesCount += MOVIES_COUNT_PER_STEP;

    if (this.#renderedMoviesCount >= this.movies.length) {
      remove(this.#loadMoreButtonComponent);
    }
  };

  #renderMovie = (movie, container, extra) => {
    const moviePresenter = new MoviePresenter(container, this.#moviesModel, this.#handleViewAction,  this.#filterModel, this.#commentsModel);
    moviePresenter.init(movie);
    switch (extra) {
      case 'rated':
        this.#ratedMoviesPresenter.set(movie.id, moviePresenter);
        break;
      case 'commented':
        this.#commentedMoviesPresenter.set(movie.id, moviePresenter);
        break;
      default:
        this.#moviePresenter.set(movie.id, moviePresenter);
    }
  };

  #clearMoviesList = ({resetRenderedMoviesCount = false, resetSortType = true, renderDownSideMovies = false} = {}) => {
    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }

    remove(this.#sortComponent);

    if (this.movies.length === 0) {
      remove(this.#emptyMoviesListComponent);
      this.#renderEmptyList(this.#filterModel.filter);
    } else {
      remove(this.#emptyMoviesListComponent);
      this.#sortComponent = new AppSortingView(this.#currentSortType);
      this.#renderSort(this.#sortComponent, this.#moviesBlockComponent.element, RenderPosition.BEFOREBEGIN);
    }

    if (renderDownSideMovies) {
      this.#ratedMoviesPresenter.forEach((presenter) => presenter.destroy());
      this.#ratedMoviesPresenter.clear();
      this.#commentedMoviesPresenter.forEach((presenter) => presenter.destroy());
      this.#commentedMoviesPresenter.clear();
    }

    this.#moviePresenter.forEach((presenter) => presenter.destroy());
    this.#moviePresenter.clear();
    remove(this.#loadMoreButtonComponent);

    if (resetRenderedMoviesCount) {
      this.#renderedMoviesCount = MOVIES_COUNT_PER_STEP;}
  };

  #handleViewAction = async (updateType, update) => {
    this.#moviesModel.popupRerender = true;
    Object.keys(Error).forEach((key) => {Error[key] = false;});
    if (document.querySelector('.film-details')) {
      this.#moviesModel.popupScrollPosition = document.querySelector('.film-details').scrollTop;
    }
    this.#commentsModel.init(update);
    if (update.deletedCommentId) {await this.#commentsModel.deleteComment(updateType, update);}
    if (update.newComment) {await this.#commentsModel.addComment(updateType, update);}
    this.#moviesModel.updateMovie(updateType, update);
  };

  #handleMovieEvent = (updateType, update) => {
    switch (updateType) {
      case UpdateType.PATCH:
        if (this.#moviePresenter.get(update.id)) {
          this.#moviePresenter.get(update.id).init(update);
        }
        if (this.#ratedMoviesPresenter.get(update.id)) {
          this.#ratedMoviesPresenter.get(update.id).init(update);
        }
        if (this.#commentedMoviesPresenter.get(update.id)) {
          this.#commentedMoviesPresenter.get(update.id).init(update);
        }
        break;
      case UpdateType.MINOR:
        this.#clearMoviesList({resetRenderedMoviesCount: true, resetSortType: !this.isSorting});
        this.#renderUpSideMovies();
        break;
      case UpdateType.MAJOR:
        this.#clearMoviesList({resetRenderedMoviesCount: false, renderDownSideMovies: true, resetSortType: !update});
        this.#renderUpSideMovies();
        this.#renderDownSideMovies();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  };
}
