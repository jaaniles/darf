type RequestBody = Record<string, unknown>;
type RequestHeaders = Record<string, string>;

export async function jsonPostRequest(
  url: string,
  body: RequestBody,
  headers?: RequestHeaders
): Promise<Response> {
  // @ts-expect-error unable to type this
  return await fetch(`${window.ENV.API_BASE_URL}${url}`, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}
