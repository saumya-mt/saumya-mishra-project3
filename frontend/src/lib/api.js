async function request(path, options = {}) {
  const response = await fetch(path, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

export function getJson(path) {
  return request(path);
}

export function postJson(path, body) {
  return request(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function putJson(path, body) {
  return request(path, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function deleteJson(path) {
  return request(path, {
    method: "DELETE",
  });
}
