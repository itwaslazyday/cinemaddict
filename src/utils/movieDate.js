import dayjs from 'dayjs';

const humanizeTaskDueDate = (dueDate, format) => dayjs(dueDate).format(format);
const humanizeMovieRuntime = (runTime) => {
  const runTimeInHours = Math.trunc(runTime / 60);
  const runTimeInMinutes = runTime - runTimeInHours * 60;
  return runTime >= 60 ? `${runTimeInHours}h ${runTimeInMinutes}m` : `${runTimeInMinutes}m`;
};

export {humanizeTaskDueDate, humanizeMovieRuntime};
