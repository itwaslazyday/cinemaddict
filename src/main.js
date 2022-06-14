import MoviesModel from './model/movies-model.js';
import CommentsModel from './model/comments-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import BoardPresenter from './presenter/board-presenter.js';
import MoviesApiService from './services/movies-api-service.js';

const AUTHORIZATION = 'Basic ar892054jdcaodw';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict';

const siteMainElement = document.querySelector('.main');
const moviesApiService = new MoviesApiService(END_POINT, AUTHORIZATION);
const moviesModel = new MoviesModel(moviesApiService);
const commentsModel = new CommentsModel(moviesApiService);
const filterModel = new FilterModel();
const boardPresenter = new BoardPresenter(siteMainElement, moviesModel, filterModel, commentsModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, moviesModel);

filterPresenter.init();
boardPresenter.init();
moviesModel.init();
