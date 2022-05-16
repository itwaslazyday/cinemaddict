import {FilterType} from '../const.js';

const filter = {
  [FilterType.WATCHLIST]: (movies) => movies.filter(({userDetails}) => userDetails.watchlist === true),
  [FilterType.HISTORY]: (movies) => movies.filter(({userDetails}) => userDetails.alreadyWatched === true),
  [FilterType.FAVORITES]: (movies) => movies.filter(({userDetails}) => userDetails.favorite === true),
};

export {filter};
