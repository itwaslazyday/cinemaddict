import UserRatingView from './view/user-rating-view.js';
import {render} from './framework/render.js';
import MoviesModel from './model/movies-model.js';
import CommentsModel from './model/comments-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import BoardPresenter from './presenter/board-presenter.js';

const siteHeaderElement = document.querySelector('header');
const siteMainElement = document.querySelector('.main');
const moviesModel = new MoviesModel();
const commentsModel = new CommentsModel();
const filterModel = new FilterModel();
const boardPresenter = new BoardPresenter(siteMainElement, moviesModel, filterModel, commentsModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, moviesModel);

render(new UserRatingView(), siteHeaderElement);

filterPresenter.init();
boardPresenter.init();
