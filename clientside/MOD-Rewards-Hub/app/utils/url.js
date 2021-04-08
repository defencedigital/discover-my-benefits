const checkDomain = url => {
  if (url.indexOf('//') === 0) {
    // eslint-disable-next-line no-param-reassign
    url = window.location.protocol + url;
  }
  return url
    .toLowerCase()
    .replace(/([a-z])?:\/\//, '$1')
    .split('/')[0];
};

const isExternal = url =>
  ((url.length > 1 && url.indexOf(':') > -1) || url.indexOf('//') > -1) &&
  checkDomain(window.location.href) !== checkDomain(url);

export { isExternal };
