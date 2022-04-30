import {generateMovieDescription} from '../fish/movie-description.js';
import {generateMovieComments} from '../fish/movie-comments.js';

const MOVIE_CARD_QTY = 5;

export default class MoviesModel {
  movies = Array.from({length: MOVIE_CARD_QTY}, generateMovieDescription);
  getMovies = () => this.movies;
  comments = generateMovieComments();
  getComments = () => this.comments;
}
