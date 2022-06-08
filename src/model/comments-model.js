import Observable from '../framework/observable.js';
import {UpdateType} from '../const.js';

export default class MoviesModel extends Observable {
  #moviesApiService = null;
  #comments = [];

  constructor(moviesApiService) {
    super();
    this.#moviesApiService = moviesApiService;
  }

  init = async (movie) => {
    try {
      this.#comments = await this.#moviesApiService.getComments(movie);
    } catch(err) {
      this.#comments = [];
    }
    this._notify(UpdateType.INIT);
  };

  get comments() {
    return this.#comments;
  }

  deleteComment = (updateType, update) => {
    const index = this.#comments.findIndex((comment) => comment.id === update.deletedCommentId);
    if (index === -1) {
      throw new Error('Can\'t update unexisting comment');
    }

    this.#comments = [
      ...this.#comments.slice(0, index),
      ...this.#comments.slice(index + 1),
    ];
    update.deletedCommentId = '';
    this._notify(updateType, update);
  };

  addComment = (updateType, update) => {
    this.#comments = [update.newComment, ...this.#comments];
    update.newComment = '';
    this._notify(updateType, update);
  };
}
