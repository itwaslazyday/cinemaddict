import {createElement} from '../render.js';

const createMoviesWrapperTemplate = () => '<div class="films-list__container"></div>';

export default class MoviesWrapperView {
  #element = null;

  get template() {
    return createMoviesWrapperTemplate();
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
