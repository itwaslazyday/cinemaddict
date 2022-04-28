import UserRatingView from './view/user-rating-view.js';
import PopupView from './view/popup-view.js';
import {render} from './render.js';
import MoviesPresenter from './presenter/movies-presenter.js';

const pageBody = document.querySelector('body');
const siteHeaderElement = document.querySelector('header');
const siteMainElement = document.querySelector('.main');
const moviesPresenter = new MoviesPresenter();

render(new UserRatingView(), siteHeaderElement);
render(new PopupView(), pageBody);

moviesPresenter.init(siteMainElement);
