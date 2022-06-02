import Observable from '../framework/observable.js';
import {generateMovieDescription} from '../fish/movie-description.js';

export default class MoviesModel extends Observable {
  #movies = generateMovieDescription();
  get movies() {
    return this.#movies;
  }

  updateMovie = (updateType, update) => {
    const index = this.#movies.findIndex((movie) => movie.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting movie');
    }

    this.#movies = [
      ...this.#movies.slice(0, index),
      update,
      ...this.#movies.slice(index + 1),
    ];
    this._notify(updateType, update);
  };
}
