import {createElement} from '../render.js';

const createMoviesTemplate = () => '<section class="films"></section>';

export default class MoviesBlockView {
  getTemplate() {
    return createMoviesTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
