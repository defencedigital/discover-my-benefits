/**
 * Test injectors
 */

import arrayUtils from '../array';

describe('Remove Duplicates', () => {
  it('is defined', () => {
    expect(arrayUtils.removeDuplicates).not.toBeUndefined();
  });

  it('should return expected result for a empty array', () => {
    const result = arrayUtils.removeDuplicates([], 'id');

    expect(result).toEqual([]);
  });

  it('should throw error if passed object not array', () => {
    expect(() => arrayUtils.removeDuplicates({}, 'id')).toThrow();
  });

  it('should return expected value given duplicate values', () => {
    const result = arrayUtils.removeDuplicates([{
      id: 1,
    }, {
      id: 2,
    }, {
      id: 1,
    }, {
      id: 2,
    }], 'id');

    expect(result).toEqual([{
      id: 1,
    }, {
      id: 2,
    }]);
  });
});

describe('chunk', () => {
  it('is defined', () => {
    expect(arrayUtils.chunk).not.toBeUndefined();
  });

  it('should throw error if passed object not array', () => {
    expect(() => arrayUtils.chunk({})).toThrow();
  });

  it('should return expected value given array and chunk value', () => {
    const result = arrayUtils.chunk([{
      id: 1,
    }, {
      id: 2,
    }, {
      id: 3,
    }, {
      id: 4,
    }], 2);

    expect(result).toEqual([[{
      id: 1,
    }, {
      id: 2,
    }], [{
      id: 3,
    }, {
      id: 4,
    }]]);
  });
});
