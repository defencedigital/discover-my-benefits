const removeDuplicates = (myArr, prop) => myArr.filter((obj, pos, arr) => arr.map((mapObj) => mapObj[prop]).indexOf(obj[prop]) === pos);

const chunk = (array, groupsize) => {
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

module.exports = {
  removeDuplicates,
  chunk,
};
