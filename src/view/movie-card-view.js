import AbstractView from '../framework/view/abstract-view.js';
import {humanizeMovieDate, humanizeMovieRuntime} from '../utils/movie-date.js';

const MAX_DESCRIPTION_LENGTH = 139;

const createMovieCardTemplate = (card) => {
  const {
    filmInfo: {title, totalRating, release, runtime, genre, poster, description},
    userDetails: {watchlist, alreadyWatched, favorite},
    comments} = card;
  const createCardDescription = () => description.length > MAX_DESCRIPTION_LENGTH ? `${description.slice(0, MAX_DESCRIPTION_LENGTH + 1)}...` : description;
  const getControlClassName = (option) => option
    ? 'film-card__controls-item--active'
    : '';
  return (
    `<article class="film-card">
      <a class="film-card__link">
        <h3 class="film-card__title">${title}</h3>
        <p class="film-card__rating">${totalRating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${humanizeMovieDate(release.date, 'YYYY')}</span>
          <span class="film-card__duration">${humanizeMovieRuntime(runtime, runtime>60 ? 'H[h] m[m]' : 'm[m]')}</span>
          <span class="film-card__genre">${genre.length > 1 ? genre.join(', ') : genre}</span>
        </p>
        <img src="./${poster}" alt="" class="film-card__poster">
        <p class="film-card__description">${createCardDescription()}</p>
        <span class="film-card__comments">${comments.length} comments</span>
      </a>
      <div class="film-card__controls">
        <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${getControlClassName(watchlist)}" type="button">Add to watchlist</button>
        <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${getControlClassName(alreadyWatched)}" type="button">Mark as watched</button>
        <button class="film-card__controls-item film-card__controls-item--favorite ${getControlClassName(favorite)}" type="button">Mark as favorite</button>
      </div>
    </article>`
  );
};

export default class MovieCardView extends AbstractView {

  constructor(movieCard) {
    super();
    this.card = movieCard;
  }

  get template() {
    return createMovieCardTemplate(this.card);
  }

  setMovieClickHandler = (callback) => {
    this._callback.movieCardClick = callback;
    this.element.querySelector('.film-card__link').addEventListener('click', this.#clickHandler);
  };

  setWatchlistClickHandler = (callback) => {
    this._callback.toWatchListClick = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#watchListClickHandler);
  };

  setAlreadyWatchedClickHandler = (callback) => {
    this._callback.alreadyWatchedClick = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#alreadyWatchedClickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#favoriteClickHandler);
  };

  #clickHandler = () => {
    this._callback.movieCardClick();
  };

  #watchListClickHandler = () => {
    this._callback.toWatchListClick();
  };

  #alreadyWatchedClickHandler = () => {
    this._callback.alreadyWatchedClick();
  };

  #favoriteClickHandler = () => {
    this._callback.favoriteClick();
  };
}
