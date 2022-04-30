import UserRatingView from './view/user-rating-view.js';
import {render} from './render.js';
import MoviesModel from './model/movies-data-model.js';
import MoviesPresenter from './presenter/movies-presenter.js';

const siteHeaderElement = document.querySelector('header');
const siteMainElement = document.querySelector('.main');
const moviesModel = new MoviesModel();
const moviesPresenter = new MoviesPresenter();

render(new UserRatingView(), siteHeaderElement);

moviesPresenter.init(siteMainElement, moviesModel);
