import dayjs from 'dayjs';
/**
 *
 * @param {*} dueDate Дата и время в машинописном формате
 * @param {*} format Необходимый формат вывода даты 'YYYY, MM, DD'
 * @returns Возвращает дату/время в заданных форматах
 */

const humanizeTaskDueDate = (dueDate, format) => dayjs(dueDate).format(format);
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

export {humanizeTaskDueDate, humanizeMovieRuntime};
