import {createElement} from '../render.js';

const createMoviesWrapperTemplate = () => '<div class="films-list__container"></div>';

export default class MoviesWrapperView {
  getTemplate() {
    return createMoviesWrapperTemplate();
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
