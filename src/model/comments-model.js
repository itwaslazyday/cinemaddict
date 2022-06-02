import Observable from '../framework/observable.js';
import {generateMovieComments} from '../fish/movie-comments.js';

export default class MoviesModel extends Observable {

  #comments = generateMovieComments();

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
    this._notify(updateType, update);
  };

  addComment = (updateType, update) => {
    this.#comments = [update.newComment, ...this.#comments];
    this._notify(updateType, update);
  };
}
