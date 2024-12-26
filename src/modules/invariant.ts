export function invariant(condition: boolean, message: string): asserts condition {
  if (condition) {
    return;
  }

  if (process.env.NODE_ENV !== 'production') {
    if (message === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  const error = !message
    ? new Error(
        'Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.',
      )
    : new Error(message);

  error.name = 'colorizr';

  throw error;
}
