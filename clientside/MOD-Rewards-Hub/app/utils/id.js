let dependencyID = -999999999999;

export const getId = () => {
  dependencyID += 1;
  return dependencyID;
};
