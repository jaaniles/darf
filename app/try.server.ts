export type Try<TSuccess, TFailure extends Error = Error> =
  | Success<TSuccess>
  | Failure<TFailure>;

type Success<T> = {
  success: true;
  value: T;
};

type Failure<T extends Error> = {
  success: false;
  error: T;
};

function success<T>(value: T): Success<T> {
  return {
    success: true as const,
    value,
  };
}

function failure<T extends Error>(error: T): Failure<T> {
  return {
    success: false as const,
    error,
  };
}

export function unwrap<T>(try_: Try<T>): T {
  if (!try_.success) {
    throw try_.error;
  }

  return try_.value;
}

export async function withTry<TSuccess>(
  fn: () => Promise<TSuccess>
): Promise<Try<TSuccess>> {
  try {
    return success(await fn());
  } catch (error) {
    if (error instanceof Error) {
      return failure(error);
    }

    if (typeof error === "string") {
      return failure(new Error(error));
    }

    return failure(new Error("Unknown error"));
  }
}
