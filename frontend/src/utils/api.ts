
export async function apiFetch<T>(
  url: string,
  { json, method }: { json?: Record<string, unknown>; method?: string } = {}
): Promise<T> {

  method ??= json ? "POST" : "GET";
  const body = json ? JSON.stringify(json) : undefined;

  const r = await fetch("/api" + url, {
    method,
    credentials: "include",
    body,
    headers: {
      accept: "application/json",
      "content-type": "application/json"
    }
  })
  
  if (r.ok) return await r.json() as Promise<T>

  throw new ApiError(r.status, await r.text())
}

class ApiError extends Error {
  constructor(public status: number, public data: Record<string, unknown> | string) {
    super()
  }
}