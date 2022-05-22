import MovieCardView from '../view/movie-card-view.js';
import PopupView from '../view/popup-view.js';
import {render, RenderPosition, remove, replace} from '../framework/render.js';
import {isEscapeKey} from '../utils/common.js';

const pageBody = document.querySelector('body');
const siteFooterElement = pageBody.querySelector('footer');

export default class MoviePresenter {
  #moviesComments = null;
  #moviePopup = null;
  #moviesContainer = null;
  #movieCard = null;
  #userDetails = null;
  #changeData = null;

  constructor(container, comments, changeData) {
    this.#moviesContainer = container.element;
    this.#moviesComments = comments;
    this.#changeData = changeData;
  }

  init = (movie) => {
    const prevMovieCard = this.#movieCard;
    this.#movieCard  = new MovieCardView(movie);
    this.#userDetails = this.#movieCard.card.userDetails;
    this.#movieCard.setClickHandler(this.#onMovieCardClick);
    this.#movieCard.setWatchlistClickHandler(this.#onWatchListClick);
    this.#movieCard.setAlreadyWatchedClickHandler(this.#onAlreadyWatchedClick);
    this.#movieCard.setFavoriteClickHandler(this.#onFavoriteClick);

    if (prevMovieCard === null) {
      render(this.#movieCard, this.#moviesContainer);
      return;
    }

    if (this.#moviesContainer.contains(prevMovieCard.element)) {
      replace(this.#movieCard, prevMovieCard);
      if (document.querySelector('.film-details')) {
        this.scrollPosition = document.querySelector('.film-details').scrollTop;
        this.#onMovieCardClick();
      }
    }

    remove(prevMovieCard);
  };

  destroy = () => {
    remove(this.#movieCard);
  };


  #onMovieCardClick = () => {
    if (document.querySelector('.film-details')) {
      this.#onPopupCloseClick();
    }
    this.#renderPopup();
  };

  #onWatchListClick = () => {
    this.#changeData({...this.#movieCard.card, userDetails: {...this.#userDetails, watchlist: !this.#userDetails.watchlist}});
  };

  #onAlreadyWatchedClick = () => {
    this.#changeData({...this.#movieCard.card, userDetails: {...this.#userDetails, alreadyWatched: !this.#userDetails.alreadyWatched}});
  };

  #onFavoriteClick = () => {
    this.#changeData({...this.#movieCard.card, userDetails: {...this.#userDetails, favorite: !this.#userDetails.favorite}});
  };

  #renderPopup = () => {
    this.#moviePopup = new PopupView(this.#movieCard.card, this.#moviesComments);
    this.#moviePopup.setCloseClickHandler(this.#onPopupCloseClick);
    this.#moviePopup.setWatchlistClickHandler(this.#onWatchListClick);
    this.#moviePopup.setAlreadyWatchedClickHandler(this.#onAlreadyWatchedClick);
    this.#moviePopup.setFavoriteClickHandler(this.#onFavoriteClick);
    document.addEventListener('keydown', this.#onPopupEscPress);
    pageBody.classList.toggle('hide-overflow');
    render(this.#moviePopup, siteFooterElement, RenderPosition.AFTEREND);
    document.querySelector('.film-details').scrollTop = this.scrollPosition;
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
