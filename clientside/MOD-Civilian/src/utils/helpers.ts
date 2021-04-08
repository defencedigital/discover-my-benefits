export const chunk = (array: ConcatArray<any>, groupsize: number) => {
  if (!(array instanceof Array)) {
    throw new Error('Parameter is not a array!');
  }

  const a = [].concat(array);

  const sets = [];
  let i = 0;

  const chunks = a.length / groupsize;

  while (i < chunks) {
    sets[i] = a.splice(0, groupsize);
    i += 1;
  }

  return sets;
};

export const isBrowser = typeof window !== 'undefined';

export const removeDuplicates = (items: any[]) => {
  return items.reduce((acc: any[], current: { id: any }) => {
    const x = acc.find((item: { id: any }) => item.id === current.id);
    if (!x) {
      return acc.concat([current]);
    }
    return acc;
  }, []);
};

export const getAllUsedBenefits = (
  data: { flatData: { uncategorisedBenefits: any; subcategorisedBenefits: any; name: any; popularBenefits: any } }[],
) => {
  const allCategoryBenefits = data.map(
    (category: { flatData: { uncategorisedBenefits: any; subcategorisedBenefits: any; name: any; popularBenefits: any } }) => {
      const { uncategorisedBenefits, subcategorisedBenefits, popularBenefits } = category.flatData;
      if (subcategorisedBenefits === null && uncategorisedBenefits === null && popularBenefits === null) {
        return false;
      }
      const benefits = [];
      if (uncategorisedBenefits) {
        benefits.push(uncategorisedBenefits);
      }
      if (subcategorisedBenefits && subcategorisedBenefits.length > 0) {
        subcategorisedBenefits.forEach((cat: { benefits: string | any[] }) => {
          if (cat.benefits.length > 0) {
            benefits.push(cat.benefits);
          }
        });
      }
      if (popularBenefits) {
        benefits.push(popularBenefits);
      }
      const flatBs = benefits.reduce((acc, val) => acc.concat(val), []);
      const categoryBenefits = removeDuplicates(flatBs);
      return categoryBenefits;
    },
  );

  const flattenedCatBens = allCategoryBenefits.reduce((acc, val) => acc.concat(val), []);
  const CategoryBenefits = removeDuplicates(flattenedCatBens);
  return CategoryBenefits;
};

export const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const formatDate = (date: Date, lastDayOfTheMonth: undefined) => {
  const day = lastDayOfTheMonth ? new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate() : date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  return `${day} ${monthNames[monthIndex]} ${year}`;
};

export const getNumOfUpdates = (updates: any[]) => {
  const thisDate = new Date().getTime();
  const thisMonth = new Date().getMonth();

  const lastVisited = isBrowser ? parseInt(window.localStorage.getItem(`civilian:updates`), 10) || 0 : 0;

  const firstVisit = !(lastVisited > 0);
  // set a timer of when the first visit expires

  let NewUpdates = 0;
  let latestUpdate = 0;

  // only set last visited date as the current day if it doesn't exist and there are no updates for this service
  const noUpdates = updates.length > 0;
  // if its the users first visit and the service has no updates then set the date to today
  if (firstVisit && noUpdates) {
    if (isBrowser) {
      window.localStorage.setItem(`civilian:updates`, thisDate.toString());
    }
  }

  updates.map(update => {
    const formattedDate = formatDate(new Date(update.date), null);

    const formattedDateTime = new Date(update.date).getTime();
    const formattedDateMonth = new Date(update.date).getMonth();
    const lastVisitedTime = lastVisited > 0 ? new Date(lastVisited).getTime() : 0;
    if (formattedDateTime > latestUpdate) {
      latestUpdate = formattedDateTime;
      // only set last visited date if it doesn't exist and set the latest update as the cookie
      if (!firstVisit && noUpdates) {
        if (isBrowser) {
          window.localStorage.setItem(`civilian:updates`, formattedDateTime.toString());
        }
      }
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
};
