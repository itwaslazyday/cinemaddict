import AbstractView from '../framework/view/abstract-view.js';

const createMoreButtonTemplate = () => '<button class="films-list__show-more">Show more</button>';

export default class LoadMoreButtonView extends AbstractView {

  get template() {
    return createMoreButtonTemplate();
  }

  setClickHandler = (callback) => {
    this._callback.loadButtonClick = callback;
    this.element.addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.loadButtonClick();
  };
}
