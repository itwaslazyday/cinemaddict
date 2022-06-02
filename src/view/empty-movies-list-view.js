import AbstractView from '../framework/view/abstract-view.js';
import {FilterType} from '../const.js';

const createEmptyListTemplate = (currentFilter) => {
  const NoMoviesText = {
    [FilterType.ALL]: 'There are no movies in our database',
    [FilterType.WATCHLIST]: 'There are no movies to watch now',
    [FilterType.HISTORY]: 'There are no watched movies now',
    [FilterType.FAVORITES]: 'There are no favorite movies now',
  };

  return (`
  <section class="films-list">
    <h2 class="films-list__title">${NoMoviesText[currentFilter]}</h2>
  </section>`);
};

export default class EmptyListView extends AbstractView {
  #currentFilter = null;

  constructor(currentFilterType = 'all') {
    super();
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return createEmptyListTemplate(this.#currentFilter);
  }
}
