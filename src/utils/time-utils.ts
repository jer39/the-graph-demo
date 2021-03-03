import moment from 'moment';

export const getDayStart = (date: Date) => {
  return moment(date).startOf('day').toDate();
};

export const getDayEnd = (date: Date) => {
  return moment(date).endOf('day').toDate();
};