import {generateMovieDescription} from '../fish/movie-description.js';
import {generateMovieComments} from '../fish/movie-comments.js';

export default class MoviesModel {
  movies = generateMovieDescription();
  getMovies = () => this.movies;
  comments = generateMovieComments();
  getComments = () => this.comments;
}
