import AbstractView from '../framework/view/abstract-view.js';
import {generateFilter} from '../fish/movie-filter.js';

const getFilterCount = (movies, name) => generateFilter(movies).find((filter) => filter.name === name).count;

const createAppNavigationTemplate = (movies) => `<nav class="main-navigation">
<a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
<a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${getFilterCount(movies, 'watchlist')}</span></a>
<a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${getFilterCount(movies, 'history')}</span></a>
<a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${getFilterCount(movies, 'favorites')}</span></a>
</nav>`;

export default class AppNavigationView extends AbstractView {

  constructor(moviesCards) {
    super();
    this.movies = moviesCards;
  }

  get template() {
    return createAppNavigationTemplate(this.movies);
  }
}
