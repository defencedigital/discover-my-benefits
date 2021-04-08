// import * as moment from 'moment';
import { formatDate } from '../../utils/date';
export const getNumOfUpdates = (updates, service) => {
  const thisDate = new Date().getTime();
  const thisMonth = new Date().getMonth();

  const lastVisited = parseInt(localStorage.getItem(`${service.serviceType}:updates`), 10) || 0;

  const firstVisit = !(lastVisited > 0);

  // set a timer of when the first visit expires

  let NewUpdates = 0;
  let latestUpdate = 0;

  // only set last visited date as the current day if it doesn't exist and there are no updates for this service
  const UpdatesforThisService = updates.filter(update => update.service === service.id).length > 0;
  // if its the users first visit and the service has updates set the cookie
  if (firstVisit && UpdatesforThisService) localStorage.setItem(`${service.serviceType}:updates`, thisDate);

  updates
    .filter(update => update.service === service.id)
    .map(update => {
      const formattedDate = formatDate(new Date(update.published));

      // if (formattedDate === formatDate(new Date())) {
      //   if (new Date(update.published).getTime() > new Date().getTime()) {
      //     // test
      //   } else {
      //     formattedDate = moment(update.published).fromNow();
      //   }
      // }
      // const formattedDateMonth = new Date(update.published).getMonth();

      const formattedDateTime = new Date(update.published).getTime();
      const formattedDateMonth = new Date(update.published).getMonth();
      const lastVisitedTime = lastVisited > 0 ? new Date(lastVisited).getTime() : 0;
      if (formattedDateTime > latestUpdate) {
        latestUpdate = formattedDateTime;
        // only set last visited date if it doesn't exist and set the latest update as the cookie
        if (!firstVisit && UpdatesforThisService)
          localStorage.setItem(`${service.serviceType}:updates`, formattedDateTime);
      }

      if (firstVisit && formattedDateMonth === thisMonth) {
        // first visit and theres been update in the same month then show those updates
        NewUpdates += 1;
      } else if (!firstVisit && formattedDateTime > lastVisitedTime) {
        // if its not the first visit and the date of the update is greater than the cookie time
        NewUpdates += 1;
      }

      return Object.assign({}, update, {
        date: formattedDate,
      });
    });

  return { NewUpdates, latestUpdate };

  // We understand all updates have been looked at when the user has visited the updates page and there's not new updates in the system since then.

  // set local storage data of month visited page

  // if the number of updates yet to see is zero, then the counter won't display (only when there's at least one update yet to be seen)

  // If a user visits the site for the first time the updates counter appears only if there has been at least an update in the current month. (e. g. i visit the site for the first time and i see a counter of 3 next to the updates icon if the MOD has added three new updates entries in the following month)
  // set local storage data of current month? or compare
  // set local storage data of latest update month? or compare
};
