/**
 * Test injectors
 */

import stringUtils from '../string';

describe('Slugify string', () => {
  it('replaces spaces with -', () => {
    const result = stringUtils.slugify('a b');
    expect(result).toEqual('a-b');
  });

  it('removes all non-word chars', () => {
    const result = stringUtils.slugify('a!b');
    expect(result).toEqual('ab');
  });

  it('replaces multiple - with single -', () => {
    const result = stringUtils.slugify('a--b');
    expect(result).toEqual('a-b');
  });

  it('trims spaces from the start', () => {
    const result = stringUtils.slugify(' ab');
    expect(result).toEqual('ab');
  });

  it('trims spaces from the end', () => {
    const result = stringUtils.slugify('ab ');
    expect(result).toEqual('ab');
  });
});
