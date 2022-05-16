import UserRatingView from './view/user-rating-view.js';
import {render} from './framework/render.js';
import MoviesModel from './model/movies-data-model.js';
import BoardPresenter from './presenter/board-presenter.js';

const siteHeaderElement = document.querySelector('header');
const siteMainElement = document.querySelector('.main');
const moviesModel = new MoviesModel();
const boardPresenter = new BoardPresenter(siteMainElement, moviesModel);

render(new UserRatingView(), siteHeaderElement);

boardPresenter.init();
