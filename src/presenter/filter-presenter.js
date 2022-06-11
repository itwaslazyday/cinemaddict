import UserRatingView from '../view/user-rating-view.js';
import AppNavigationView from '../view/app-navigation-view.js';
import {render, replace, remove} from '../framework/render.js';
import {filter} from '../utils/filter.js';
import {FilterType, UpdateType} from '../const.js';

const siteHeaderElement = document.querySelector('header');

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #moviesModel = null;
  #filterComponent = null;
  #userRatingComponent = null;

  constructor(filterContainer, filterModel, moviesModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#moviesModel = moviesModel;

    this.#moviesModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const movies = this.#moviesModel.movies;

    return [
      {
        type: FilterType.ALL,
        name: 'All',
        count: filter[FilterType.ALL](movies).length,
      },
      {
        type: FilterType.WATCHLIST,
        name: 'Watchlist',
        count: filter[FilterType.WATCHLIST](movies).length,
      },
      {
        type: FilterType.HISTORY,
        name: 'History',
        count: filter[FilterType.HISTORY](movies).length,
      },
      {
        type: FilterType.FAVORITES,
        name: 'Favorites',
        count: filter[FilterType.FAVORITES](movies).length,
      },
    ];
  }

  init = () => {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;
    const prevUserRatingComponent = this.#userRatingComponent;

    this.#filterComponent = new AppNavigationView(filters, this.#filterModel.filter);
    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);
    this.#userRatingComponent = new UserRatingView(filters.find((item) => item.name === 'Watchlist').count);

    if (prevUserRatingComponent === null) {
      render(this.#userRatingComponent, siteHeaderElement);
    }

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#userRatingComponent, prevUserRatingComponent);
    remove(prevUserRatingComponent);
    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  };

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MINOR, filterType);
  };
}
