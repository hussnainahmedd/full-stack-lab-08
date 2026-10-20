// Unit test: the two fee policies are plain classes, so test them directly.
import { MeritFeePolicy, StandardFeePolicy } from './fee-policy';

describe('StandardFeePolicy', () => {
  const policy = new StandardFeePolicy();

  it('is named standard', () => {
    expect(policy.name).toBe('standard');
  });

  it('charges creditHours x rate', () => {
    expect(policy.calculate(12, 3.8, 5000)).toBe(60000);
  });

  it('ignores the CGPA completely', () => {
    expect(policy.calculate(12, 1.5, 5000)).toBe(60000);
    expect(policy.calculate(12, 4.0, 5000)).toBe(60000);
  });
});

describe('MeritFeePolicy', () => {
  const policy = new MeritFeePolicy();

  it('is named merit', () => {
    expect(policy.name).toBe('merit');
  });

  it('gives 50% off for a CGPA of 3.8', () => {
    expect(policy.calculate(12, 3.8, 5000)).toBe(30000);
  });

  it('gives 50% off at the 3.5 boundary', () => {
    expect(policy.calculate(12, 3.5, 5000)).toBe(30000);
  });

  it('gives 25% off for a CGPA of 3.2', () => {
    expect(policy.calculate(12, 3.2, 5000)).toBe(45000);
  });

  it('gives 25% off at the 3.0 boundary', () => {
    expect(policy.calculate(12, 3.0, 5000)).toBe(45000);
  });

  it('gives no discount below 3.0', () => {
    expect(policy.calculate(12, 2.9, 5000)).toBe(60000);
  });
});
