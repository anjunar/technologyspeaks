import { JodaDateTimeValueAccessor } from './joda-date-time-value-accessor';

describe('JodaDateTimeValueAccessor', () => {
  it('should create an instance', () => {
    const directive = new JodaDateTimeValueAccessor();
    expect(directive).toBeTruthy();
  });
});
