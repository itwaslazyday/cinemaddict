import AbstractView from '../framework/view/abstract-view.js';

const createMoviesWrapperTemplate = () => '<div class="films-list__container"></div>';

export default class MoviesWrapperView extends AbstractView {

  get template() {
    return createMoviesWrapperTemplate();
  }
}
