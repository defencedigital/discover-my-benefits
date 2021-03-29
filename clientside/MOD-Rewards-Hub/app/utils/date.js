export const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const formatDate = (date, lastDayOfTheMonth) => {
  const day = (lastDayOfTheMonth) ? new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate() : date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  return `${day} ${monthNames[monthIndex]} ${year}`;
};
