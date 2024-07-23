import { ZodType } from "zod";
import { Try, withTry } from "~/try.server";

type RequestBody = Record<string, unknown>;
type RequestHeaders = Record<string, string>;

export async function jsonGetRequest(
  url: string,
  headers?: RequestHeaders
): Promise<Response> {
  return await fetch(url, {
    method: "GET",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
  });
}

export async function jsonPostRequest(
  url: string,
  body: RequestBody,
  headers?: RequestHeaders
): Promise<Response> {
  return await fetch(`${process.env.API_BASE_URL}${url}`, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

export async function validateResponse<T>(
  response: Response,
  type: ZodType<T>
): Promise<Try<T>> {
  return withTry(async () => {
    if (response.status >= 200 && response.status < 300) {
      const json = await response.json();
      const parsed = type.safeParse(json);

      if (!parsed.success) {
        throw new Error("Response validation failed");
      }

      return parsed.data;
    }

    throw new Error("Request failed");
  });
}
