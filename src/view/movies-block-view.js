import AbstractView from '../framework/view/abstract-view.js';

const createMoviesTemplate = () => '<section class="films"></section>';

export default class MoviesBlockView extends AbstractView {

  get template() {
    return createMoviesTemplate();
  }
}
