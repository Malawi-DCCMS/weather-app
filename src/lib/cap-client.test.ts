import {parsePolygon} from './cap-client';

describe('CAPClient', () => {
  describe('parsePolygon', () => {
    it('should be able to parse a valid polygon', () => {
      const input =
        '-12.2541,34.0137 -13.3255,34.1675 -14.307,34.4641 -15.9191,35.9473 -13.8167,35.7495 -12.8546,35.0903 -11.8458,35.1782 -11.1568,34.9805 -10.4662,34.8706 -9.6007,34.6948 -9.2539,34.3652 -9.5357,33.75 -12.2541,34.0137';
      const expected = [
        [-12.2541, 34.0137],
        [-13.3255, 34.1675],
        [-14.307, 34.4641],
        [-15.9191, 35.9473],
        [-13.8167, 35.7495],
        [-12.8546, 35.0903],
        [-11.8458, 35.1782],
        [-11.1568, 34.9805],
        [-10.4662, 34.8706],
        [-9.6007, 34.6948],
        [-9.2539, 34.3652],
        [-9.5357, 33.75],
        [-12.2541, 34.0137],
      ];

      expect(parsePolygon(input)).toEqual(expected);
    });

    it('should throw if there is more than one space in between pairs', () => {
      const input =
        '-12.2541,34.0137  -13.3255,34.1675 -14.307,34.4641 -15.9191,35.9473';
      expect(() => parsePolygon(input)).toThrow();
      expect(() => parsePolygon('hello')).toThrow();
    });

    it('should throw if there is at least one unbalanced pair', () => {
      const input =
        '-12.2541,34.0137  -13.3255,34.1675 -14.307,34.4641 -15.9191';
      expect(() => parsePolygon(input)).toThrow();
      expect(() => parsePolygon('hello')).toThrow();
    });

    it('should throw if there are not enough points in the polygon', () => {
      const input = '-12.2541,34.0137  -13.3255,34.1675';
      expect(() => parsePolygon(input)).toThrow();
    });
  });
});
