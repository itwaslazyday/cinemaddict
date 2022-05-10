import AbstractView from '../framework/view/abstract-view.js';

const createMoviesTemplate = () => '<section class="films"></section>';

export default class MoviesBlockView extends AbstractView {

  get template() {
    return createMoviesTemplate();
  }

  setClickHandler = (callback) => {
    this._callback.movieCardClick = callback;
    this.element.addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    this._callback.movieCardClick(evt);
  };
}
