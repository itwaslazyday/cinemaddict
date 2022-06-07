import MovieCardView from '../view/movie-card-view.js';
import PopupView from '../view/popup-view.js';
import {render, RenderPosition, remove, replace} from '../framework/render.js';
import {isEscapeKey} from '../utils/common.js';
import {UpdateType} from '../const.js';

const pageBody = document.querySelector('body');

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

    this.#popupCard = movie;

    if (document.querySelector('.film-details') && this.#moviesModel.popupRerender) {
      this.#popupCard = this.#moviesModel.movies.find((item) => item.id === this.#moviesModel.popupId);
      this.#onMovieCardClick(this.#popupCard);
      this.#moviesModel.popupRerender = false;
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
    this.#changeData(this.#filterModel.filter === 'all' ? UpdateType.PATCH : UpdateType.MAJOR,
      {...this.#popupCard, userDetails: {...this.#popupCard.userDetails, watchlist: !this.#popupCard.userDetails.watchlist}});
  };

  #onAlreadyWatchedClick = () => {
    this.#changeData(this.#filterModel.filter === 'all' ? UpdateType.PATCH : UpdateType.MAJOR,
      {...this.#popupCard, userDetails: {...this.#popupCard.userDetails, alreadyWatched: !this.#popupCard.userDetails.alreadyWatched}});
  };

  #onFavoriteClick = () => {
    this.#changeData(this.#filterModel.filter === 'all' ? UpdateType.PATCH : UpdateType.MAJOR,
      {...this.#popupCard, userDetails: {...this.#popupCard.userDetails, favorite: !this.#popupCard.userDetails.favorite}});
  };

  #onCommentDeleteClick = (deletedCommentId) => {
    this.#changeData(UpdateType.MAJOR,
      {...this.#popupCard, comments: [...this.#popupCard.comments.filter((item) => item !== deletedCommentId)], deletedCommentId: deletedCommentId});
  };

  #onCommentFormSubmit = (newComment) => {
    this.#changeData(UpdateType.MAJOR,
      {...this.#popupCard, comments: [...this.#popupCard.comments, newComment.id], newComment: newComment});
  };

  #renderPopup = async (card = this.#movieCard.card) => {
    await this.#commentsModel.init(card);
    this.#moviePopup = new PopupView(card, this.#commentsModel.comments);
    this.#moviesModel.popupId = this.#moviePopup.element.dataset.filmId;
    this.#moviePopup.setCloseClickHandler(this.#onPopupCloseClick);
    this.#moviePopup.setWatchlistClickHandler(this.#onWatchListClick);
    this.#moviePopup.setAlreadyWatchedClickHandler(this.#onAlreadyWatchedClick);
    this.#moviePopup.setFavoriteClickHandler(this.#onFavoriteClick);
    this.#moviePopup.setCommentDeleteClickHandler(this.#onCommentDeleteClick);
    this.#moviePopup.setformSubmitHandler(this.#onCommentFormSubmit);
    document.addEventListener('keydown', this.#onPopupEscPress);
    pageBody.classList.toggle('hide-overflow');
    render(this.#moviePopup, pageBody.querySelector('footer'), RenderPosition.AFTEREND);
    this.#moviePopup.element.scrollTop = this.#moviesModel.popupScrollPosition;
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
