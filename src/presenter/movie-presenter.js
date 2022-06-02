import MovieCardView from '../view/movie-card-view.js';
import PopupView from '../view/popup-view.js';
import {render, RenderPosition, remove, replace} from '../framework/render.js';
import {isEscapeKey} from '../utils/common.js';
import {UpdateType} from '../const.js';

const pageBody = document.querySelector('body');
const siteFooterElement = pageBody.querySelector('footer');

export default class MoviePresenter {
  #moviePopup = null;
  #moviesContainer = null;
  #movieCard = null;
  #changeData = null;
  #moviesModel = null;
  #commentsModel = null;
  #filterModel = null;
  #popupCard = null;

  constructor(container, moviesModel, changeData, filterModel, commentsModel) {
    this.#moviesContainer = container.element;
    this.#moviesModel = moviesModel;
    this.#commentsModel = commentsModel;
    this.#changeData = changeData;
    this.#filterModel = filterModel;
  }

  init = (movie) => {
    const prevMovieCard = this.#movieCard;
    this.#movieCard  = new MovieCardView(movie);
    this.#movieCard.setClickHandler(this.#onMovieCardClick);
    this.#movieCard.setWatchlistClickHandler(this.#onWatchListClick);
    this.#movieCard.setAlreadyWatchedClickHandler(this.#onAlreadyWatchedClick);
    this.#movieCard.setFavoriteClickHandler(this.#onFavoriteClick);

    if (prevMovieCard === null) {
      render(this.#movieCard, this.#moviesContainer);
    } else {
      if (this.#moviesContainer.contains(prevMovieCard.element)) {
        replace(this.#movieCard, prevMovieCard);
        remove(prevMovieCard);
      }
    }

    if (document.querySelector('.film-details')) {
      this.#popupCard = this.#moviesModel.movies.find((item) => item.id === document.querySelector('.film-details').dataset.filmId);
    } else {
      this.#popupCard = this.#moviesModel.movies.find((item) => item.id === movie.id);
    }

    if (document.querySelector('.film-details') && this.#moviesModel.founded) {
      this.#onMovieCardClick(this.#popupCard);
      this.#moviesModel.founded = false;
    }
  };

  destroy = () => {
    remove(this.#movieCard);
  };


  #onMovieCardClick = (card) => {
    if (document.querySelector('.film-details')) {
      this.#onPopupCloseClick();
    }
    this.#renderPopup(card);
  };

  #onWatchListClick = () => {
    this.#moviesModel.founded = true;
    this.#changeData(this.#filterModel.filter === 'all' ? UpdateType.PATCH : UpdateType.MAJOR, {...this.#popupCard, userDetails: {...this.#popupCard.userDetails, watchlist: !this.#popupCard.userDetails.watchlist}});
  };

  #onAlreadyWatchedClick = () => {
    this.#moviesModel.founded = true;
    this.#changeData(this.#filterModel.filter === 'all' ? UpdateType.PATCH : UpdateType.MAJOR, {...this.#popupCard, userDetails: {...this.#popupCard.userDetails, alreadyWatched: !this.#popupCard.userDetails.alreadyWatched}});
  };

  #onFavoriteClick = () => {
    this.#moviesModel.founded = true;
    this.#changeData(this.#filterModel.filter === 'all' ? UpdateType.PATCH : UpdateType.MAJOR, {...this.#popupCard, userDetails: {...this.#popupCard.userDetails, favorite: !this.#popupCard.userDetails.favorite}});
  };

  #onCommentDeleteClick = (deletedCommentId) => {
    this.#moviesModel.founded = true;
    this.#changeData(UpdateType.MAJOR, {...this.#popupCard, comments: [...this.#popupCard.comments.filter((item) => item !== deletedCommentId)], deletedCommentId: deletedCommentId, newComment: ''});
  };

  #onCommentFormSubmit = (newComment) => {
    this.#moviesModel.founded = true;
    this.#changeData(UpdateType.MAJOR, {...this.#popupCard, comments: [...this.#popupCard.comments, newComment.id], newComment: newComment, deletedCommentId: ''});
  };

  #renderPopup = (card = this.#movieCard.card) => {
    this.#moviePopup = new PopupView(card, this.#commentsModel.comments);
    this.#moviePopup.setCloseClickHandler(this.#onPopupCloseClick);
    this.#moviePopup.setWatchlistClickHandler(this.#onWatchListClick);
    this.#moviePopup.setAlreadyWatchedClickHandler(this.#onAlreadyWatchedClick);
    this.#moviePopup.setFavoriteClickHandler(this.#onFavoriteClick);
    this.#moviePopup.setCommentDeleteClickHandler(this.#onCommentDeleteClick);
    this.#moviePopup.setformSubmitHandler(this.#onCommentFormSubmit);
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
