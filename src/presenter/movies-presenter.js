import AppNavigationView from '../view/app-navigation-view.js';
import AppSortingView from '../view/app-sorting-view.js';
import MoviesBlockView from '../view/movies-block-view.js';
import MoviesListView from '../view/movies-list-view.js';
import MoviesWrapperView from '../view/movies-wrapper-view.js';
import MovieCardView from '../view/movie-card-view.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';
import {render} from '../render.js';

export default class MoviesPresenter {
  moviesBlock = new MoviesBlockView();
  moviesList = new MoviesListView();
  moviesWrapper = new MoviesWrapperView();

  init = (moviesContainer) => {
    this.moviesContainer = moviesContainer;

    render(new AppNavigationView(), this.moviesContainer);
    render(new AppSortingView(), this.moviesContainer);
    render(this.moviesBlock, this.moviesContainer);
    render(this.moviesList, this.moviesBlock.getElement());
    render(this.moviesWrapper, this.moviesList.getElement());

    for (let i = 0; i < 5; i++) {
      render(new MovieCardView(), this.moviesWrapper.getElement());
    }
    render(new LoadMoreButtonView(), this.moviesList.getElement());
  };
}
