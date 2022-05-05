import {createElement} from '../render.js';

const createMoviesTemplate = () => '<section class="films"></section>';

export default class MoviesBlockView {
  #element = null;

  get template() {
    return createMoviesTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
