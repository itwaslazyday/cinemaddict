import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);

const humanizeTaskDueDate = (date, format) => dayjs(date).format(format);

const humanizeMovieRuntime = (runTime, format) => dayjs.duration(runTime, 'minutes').format(format);

const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

const sortByDate = (movieB, movieA) => {
  const weight = getWeightForNullDate(movieA.filmInfo.release.date, movieB.filmInfo.release.date);

  return weight ?? dayjs(movieA.filmInfo.release.date).diff(dayjs(movieB.filmInfo.release.date));
};

const sortByRating = (movieB, movieA) => {
  const weight = getWeightForNullDate(movieA.filmInfo.totalRating, movieB.filmInfo.totalRating);

  return weight ?? (movieA.filmInfo.totalRating - movieB.filmInfo.totalRating);
};

export {humanizeTaskDueDate, humanizeMovieRuntime, sortByDate, sortByRating};
