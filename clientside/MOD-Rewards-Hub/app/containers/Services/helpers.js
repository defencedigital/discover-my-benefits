export const getServiceFromMatch = match => {
  const { params } = match;
  const { service } = params;

  if (service) {
    return service;
  }

  return false;
};

export const getServiceSlugFromService = service => {
  const { slug } = service;
  return slug;
};

export const getNumOfServiceFavourites = service => {
  const favourites = JSON.parse(localStorage.getItem(`${service.serviceType}:favourites`)) ? JSON.parse(localStorage.getItem(`${service.serviceType}:favourites`)).length : 0;
  return favourites;
};

export const getServiceFavourites = service => {
  const favourites = JSON.parse(localStorage.getItem(`${service.serviceType}:favourites`));
  return favourites;
};
