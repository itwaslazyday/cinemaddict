import AbstractView from '../framework/view/abstract-view.js';
import {SortType} from '../const.js';

const createAppSortingTemplate = () => `<ul class="sort">
<li><a href="#" class="sort__button sort__button--active" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
<li><a href="#" class="sort__button" data-sort-type="${SortType.DATE}">Sort by date</a></li>
<li><a href="#" class="sort__button" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
</ul>`;

export default class AppSortingView extends AbstractView {

  get template() {
    return createAppSortingTemplate();
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
    document.querySelectorAll('.sort__button').forEach((item) => (item.className = 'sort__button'));
    evt.target.classList.toggle('sort__button--active');
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  };
}
