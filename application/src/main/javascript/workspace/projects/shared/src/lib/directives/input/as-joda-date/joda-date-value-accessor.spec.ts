import { JodaDateValueAccessor } from './joda-date-value-accessor';

describe('JodaDateValueAccessor', () => {
  it('should create an instance', () => {
    const directive = new JodaDateValueAccessor();
    expect(directive).toBeTruthy();
  });
});
