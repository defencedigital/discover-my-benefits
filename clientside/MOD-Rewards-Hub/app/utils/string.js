/* eslint-disable */

/**
 * A collection of useful string utilities
 */

/**
 * Converts a string to url friendly string
 * @param string
 *
 * Replace spaces with -
 * Remove all non-word chars
 * Replace multiple - with single -
 * Trim - from start of text
 * Trim - from end of text
 *
 */

const slugify = (string) =>
  string.toString()
  .toLowerCase()
  .replace(/\s+/g, '-')
  .replace(/[^\w\-]+/g, '')
  .replace(/\-\-+/g, '-')
  .replace(/^-+/, '')
  .replace(/-+$/, '');

module.exports = {
  slugify,
};
