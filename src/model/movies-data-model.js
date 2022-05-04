import {generateMovieDescription} from '../fish/movie-description.js';
import {generateMovieComments} from '../fish/movie-comments.js';

export default class MoviesModel {
  #movies = generateMovieDescription();
  get movies() {return this.#movies;}
  #comments = generateMovieComments();
  get comments() {return this.#comments;}
}
