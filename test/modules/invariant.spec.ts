import { invariant } from '~/modules/invariant';

describe('invariant', () => {
  afterAll(() => {
    process.env.NODE_ENV = 'test';
  });

  it('should throw', () => {
    expect(() => invariant(false, 'Fails')).toThrow('Fails');
    // @ts-expect-error - invalid parameters
    expect(() => invariant(false)).toThrow('invariant requires an error message argument');
  });

  it('should throw with NODE_ENV production', () => {
    process.env.NODE_ENV = 'production';

    // @ts-expect-error - invalid parameters
    expect(() => invariant(false)).toThrow(
      'Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.',
    );
  });

  it('should not throw', () => {
    expect(() => invariant(true, 'Fails')).not.toThrow('Fails');
  });
});
