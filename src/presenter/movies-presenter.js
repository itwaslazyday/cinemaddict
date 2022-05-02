import AppNavigationView from '../view/app-navigation-view.js';
import AppSortingView from '../view/app-sorting-view.js';
import MoviesBlockView from '../view/movies-block-view.js';
import MoviesListView from '../view/movies-list-view.js';
import MoviesWrapperView from '../view/movies-wrapper-view.js';
import MovieCardView from '../view/movie-card-view.js';
import PopupView from '../view/popup-view.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';
import {render, RenderPosition} from '../render.js';

const pageBody = document.querySelector('body');
const siteFooterElement = pageBody.querySelector('footer');

export default class MoviesPresenter {
  moviesBlock = new MoviesBlockView();
  moviesList = new MoviesListView();
  moviesWrapper = new MoviesWrapperView();

  init = (moviesContainer, moviesModel) => {
    this.moviesContainer = moviesContainer;
    this.moviesModel = moviesModel;
    this.moviesCards = [...this.moviesModel.getMovies()];
    this.moviesComments = [...this.moviesModel.getComments()];

    render(new AppNavigationView(), this.moviesContainer);
    render(new AppSortingView(), this.moviesContainer);
    render(this.moviesBlock, this.moviesContainer);
    render(this.moviesList, this.moviesBlock.getElement());
    render(this.moviesWrapper, this.moviesList.getElement());

    for (let i = 0; i < this.moviesCards.length; i++) {
      render(new MovieCardView(this.moviesCards[i]), this.moviesWrapper.getElement());
    }
    render(new LoadMoreButtonView(), this.moviesList.getElement());

    const moviesPosters = document.querySelectorAll('.film-card__poster');
    moviesPosters.forEach((item) => item.addEventListener('click',
      (evt) => {
        //Позже будет иной алгоритм выбора объекта по id
        render(new PopupView(this.moviesCards[evt.target.dataset.id], this.moviesComments), siteFooterElement, RenderPosition.AFTEREND);
      }
    ));
  };
}
