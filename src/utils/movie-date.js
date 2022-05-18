import dayjs from 'dayjs';
/**
 *
 * @param {*} date Дата и время в машинописном формате
 * @param {*} format Необходимый формат вывода даты 'YYYY, MM, DD'
 * @returns Возвращает дату/время в заданных форматах
 */

const humanizeTaskDueDate = (date, format) => dayjs(date).format(format);
/**
 *
 * @param {*} runTime Длительность фильма в минутах
 * @returns Длительность фильма в формате 'ЧЧ ММ'
 */
const humanizeMovieRuntime = (runTime) => {
  const runTimeInHours = Math.trunc(runTime / 60);
  const runTimeInMinutes = runTime - runTimeInHours * 60;
  return runTime >= 60 ? `${runTimeInHours}h ${runTimeInMinutes}m` : `${runTimeInMinutes}m`;
};

// Функция помещает задачи без даты в конце списка,
// возвращая нужный вес для колбэка sort
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
