import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {humanizeTaskDueDate, humanizeMovieRuntime} from '../utils/movie-date.js';
import he from 'he';
import {Errors} from '../services/movies-api-service.js';

const createPopupTemplate = (state, commentsArr) => {
  const {
    filmInfo: {title, totalRating, release, runtime, genre, poster, description, director, writers, actors, alternativeTitle},
    userDetails: {watchlist, alreadyWatched, favorite},
    errors: {DELETING, ADDING, CHANGING},
    comments, tappedEmotionId, typedComment, isDeleting, deletedCommentId, isSaving} = state;
  const createEmotion = () =>  (tappedEmotionId) ? `<img src="./images/emoji/${tappedEmotionId.split('-')[1]}.png" width="55" height="55" alt="emoji"></img>` : '';
  const createDescription = () => (typedComment) ? typedComment : '';
  const createGenres = () => genre.reduce((acc, gen) => (acc += `<span class="film-details__genre">${gen}</span>`), '');
  const getChecked = (emotion) => emotion === tappedEmotionId ? 'checked' : '';
  const getControlClassName = (option) => option
    ? 'film-details__control-button--active'
    : '';
  const selectedComments = commentsArr.filter(({id}) => comments.some((item) => item === id));
  const createCommentsTemplate = () => {
    const commentsList = document.createElement('ul');
    selectedComments.forEach((item) => {
      commentsList.insertAdjacentHTML('beforeend',
        `<li class="film-details__comment">
          <span class="film-details__comment-emoji">
            <img src="./images/emoji/${item.emotion}.png" width="55" height="55" alt="emoji-smile">
          </span>
          <div>
            <p class="film-details__comment-text">${he.encode(item.comment)}</p>
            <p class="film-details__comment-info">
              <span class="film-details__comment-author">${item.author}</span>
              <span class="film-details__comment-day">${humanizeTaskDueDate(item.date, 'YYYY/MM/DD HH:mm')}</span>
              <button class="film-details__comment-delete" data-comment-id=${item.id} ${isDeleting && item.id === deletedCommentId ? 'disabled' : ''}>
              ${isDeleting && item.id === deletedCommentId ? 'Deleting...' : 'Delete'}</button>
            </p>
          </div>
        </li>`
      );
    });
    return commentsList;
  };

  return (
    `<section class="film-details" data-film-id=${state.id}>
      <form class="film-details__inner" action="" method="get">
        <div class="film-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="./${poster}" alt="">
              <p class="film-details__age">18+</p>
            </div>
            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">Original: ${alternativeTitle}</p>
                </div>
                <div class="film-details__rating">
                  <p class="film-details__total-rating">${totalRating}</p>
                </div>
              </div>
              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writers}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actors}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${humanizeTaskDueDate(release.date, 'DD MMMM YYYY')}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${humanizeMovieRuntime(runtime, runtime>60 ? 'H[h] m[m]' : 'm[m]')}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${release.releaseCountry}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">${genre.length > 1 ? 'Genres' : 'Genre'}</td>
                  <td class="film-details__cell">${createGenres()}</td>
                </tr>
              </table>
              <p class="film-details__film-description">${description}</p>
            </div>
          </div>
          <section class="film-details__controls ${CHANGING ? 'shake' : ''}">
            <button type="button" class="film-details__control-button film-details__control-button--watchlist ${getControlClassName(watchlist)}" id="watchlist" name="watchlist">Add to watchlist</button>
            <button type="button" class="film-details__control-button ${getControlClassName(alreadyWatched)} film-details__control-button--watched" id="watched" name="watched">Already watched</button>
            <button type="button" class="film-details__control-button film-details__control-button--favorite ${getControlClassName(favorite)}" id="favorite" name="favorite">Add to favorites</button>
          </section>
        </div>
        <div class="film-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
            <ul class="film-details__comments-list ${DELETING ? 'shake' : ''}">${createCommentsTemplate().innerHTML}</ul>
            <div class="film-details__new-comment ${ADDING ? 'shake' : ''}">
              <div class="film-details__add-emoji-label">${createEmotion()}</div>
              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" ${isSaving ? 'disabled' : ''}>${createDescription()}</textarea>
              </label>
              <div class="film-details__emoji-list">
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${getChecked('emoji-smile')}>
                <label class="film-details__emoji-label" for="emoji-smile">
                  <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                </label>
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${getChecked('emoji-sleeping')}>
                <label class="film-details__emoji-label" for="emoji-sleeping">
                  <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                </label>
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${getChecked('emoji-puke')}>
                <label class="film-details__emoji-label" for="emoji-puke">
                  <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                </label>
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${getChecked('emoji-angry')}>
                <label class="film-details__emoji-label" for="emoji-angry">
                  <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                </label>
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>`
  );
};

const createNewCommentTemplate = (evt, state) => ({
  'comment': evt.target.value,
  'emotion': state.tappedEmotionId.split('-')[1]
});

export default class PopupView extends AbstractStatefulView {

  constructor(movieCard, comments) {
    super();
    this.movieCard = movieCard;
    this.comments = comments;
    this._state = PopupView.parseMovieToState(movieCard);
    this._state.errors = Errors;
    this.#setInnerHandlers();
  }

  get template() {
    return createPopupTemplate(this._state, this.comments);
  }

  static parseMovieToState = (movieCard) => ({...movieCard, tappedEmotionId: null});

  setCloseClickHandler = (callback) => {
    this._callback.popupCloseButtonClick = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closeClickHandler, {once: true});
  };

  #closeClickHandler = () => {
    this._callback.popupCloseButtonClick();
  };

  setWatchlistClickHandler = (callback) => {
    this._callback.toWatchListClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchListClickHandler);
  };

  #watchListClickHandler = () => {
    this._callback.toWatchListClick();
  };

  setAlreadyWatchedClickHandler = (callback) => {
    this._callback.alreadyWatchedClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#alreadyWatchedClickHandler);
  };

  #alreadyWatchedClickHandler = () => {
    this._callback.alreadyWatchedClick();
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
  };

  #favoriteClickHandler = () => {
    this._callback.favoriteClick();
  };

  setCommentDeleteClickHandler = (callback) => {
    this._callback.commentDeleteClick = callback;
    this.element.querySelector('.film-details__comments-list').addEventListener('click', this.#commentDeleteClickHandler);
  };

  #commentDeleteClickHandler = (evt) => {
    if (evt.target.nodeName === 'BUTTON') {
      evt.preventDefault();
      this.updateElement({
        isDeleting: true,
        deletedCommentId: evt.target.dataset.commentId
      });
      this._callback.commentDeleteClick(evt.target.dataset.commentId);
    }
  };

  setformSubmitHandler = (callback) => {
    this._callback.commentFormSubmit = callback;
    this.element.querySelector('.film-details__comment-input').addEventListener('keydown', this.#formSubmitHandler);
  };

  #formSubmitHandler = (evt) => {
    if ((evt.keyCode === 10 || evt.keyCode === 13) && (evt.ctrlKey || evt.metaKey)) {
      evt.preventDefault();
      this.updateElement({
        isSaving: true,
      });
      this._callback.commentFormSubmit(createNewCommentTemplate(evt, this._state));
    }
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setWatchlistClickHandler(this._callback.toWatchListClick);
    this.setAlreadyWatchedClickHandler(this._callback.alreadyWatchedClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setCloseClickHandler(this._callback.popupCloseButtonClick);
    this.setCommentDeleteClickHandler(this._callback.commentDeleteClick);
    this.setformSubmitHandler(this._callback.commentFormSubmit);
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__emoji-list').addEventListener('click', this.#emotionClickHandler);
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#descriptionInputHandler);
  };

  #descriptionInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      typedComment: evt.target.value,
    });
  };

  #emotionClickHandler = (evt) => {
    if (evt.target.nodeName === 'INPUT') {
      evt.preventDefault();
      Object.keys(this._state.errors).forEach((key) => {this._state.errors[key] = false;});
      this.updateElement({
        tappedEmotionId: evt.target.id,
      });
    }
  };
}
