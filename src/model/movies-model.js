import Observable from '../framework/observable.js';
import {UpdateType} from '../const.js';

export default class MoviesModel extends Observable {
  #moviesApiService = null;
  #movies = [];

  constructor(moviesApiService) {
    super();
    this.#moviesApiService = moviesApiService;
  }

  init = async () => {
    try {
      const movies = await this.#moviesApiService.movies;
      this.#movies = movies.map(this.#adaptToClient);
    } catch(err) {
      this.#movies = [];
    }
    this._notify(UpdateType.INIT);
  };

  #adaptToClient = (movie) => {
    const adaptedMovie = {...movie,
      userDetails: {...movie['user_details'],
        alreadyWatched: movie['user_details']['already_watched'],
        watchingDate: movie['user_details']['watching_date'],
      },
      filmInfo: {...movie['film_info'],
        ageRating: movie['film_info']['age_rating'],
        alternativeTitle: movie['film_info']['alternative_title'],
        totalRating: movie['film_info']['total_rating'],
        release: {
          date: movie['film_info']['release']['date'],
          releaseCountry: movie['film_info']['release']['release_country']
        }
      }
    };

    delete adaptedMovie['film_info'];
    delete adaptedMovie.userDetails['watching_date'];
    delete adaptedMovie.userDetails['already_watched'];
    delete adaptedMovie['user_details'];
    delete adaptedMovie.filmInfo['age_rating'];
    delete adaptedMovie.filmInfo['alternative_title'];
    delete adaptedMovie.filmInfo['total_rating'];

    return adaptedMovie;
  };

  popupScrollPosition;

  get movies() {
    return this.#movies;
  }

  updateMovie = async (updateType, update) => {
    const index = this.#movies.findIndex((movie) => movie.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting movie');
    }

    try {
      const response = await this.#moviesApiService.updateMovie(update);
      const updatedMovie = this.#adaptToClient(response);
      this.#movies = [
        ...this.#movies.slice(0, index),
        updatedMovie,
        ...this.#movies.slice(index + 1),
      ];
      this._notify(updateType, update);
    } catch(err) {
      throw new Error('Can\'t update task');
    }
  };
}
