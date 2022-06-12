import AbstractView from '../framework/view/abstract-view.js';
import {SortType} from '../const.js';

const createAppSortingTemplate = (currentSortType) => `<ul class="sort">
<li><a href="#" class="sort__button ${currentSortType === 'default' ? 'sort__button--active' : ''}" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
<li><a href="#" class="sort__button ${currentSortType === 'date' ? 'sort__button--active' : ''}" data-sort-type="${SortType.DATE}">Sort by date</a></li>
<li><a href="#" class="sort__button ${currentSortType === 'rating' ? 'sort__button--active' : ''}" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
</ul>`;

export default class AppSortingView extends AbstractView {
  constructor(currentSortType) {
    super();
    this.currentSortType = currentSortType;
  }

  get template() {
    return createAppSortingTemplate(this.currentSortType);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  };

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  };
}
