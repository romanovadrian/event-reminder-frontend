const ENVIRONMENT = process.env.ENVIRONMENT

function buildHeaders(token, customHeaders) {
  const headers = {
    ...(customHeaders || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function request(path, options = {}) {
  let url;
  if (ENVIRONMENT === 'production') {
    url = `/api${path}`;
  } else {
    url = path;
  }
  
  const response = await fetch(url, options);

  if (response.status === 204) {
    return null;
  }

  // Signal auth expiry so the app can log the user out
  if (response.status === 401) {
    window.dispatchEvent(new CustomEvent('auth:expired'));
    throw new Error('Session expired. Please sign in again.');
  }

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const body = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message = isJson && body?.detail
      ? (typeof body.detail === 'string' ? body.detail : JSON.stringify(body.detail))
      : `${response.status} ${response.statusText}`;
    throw new Error(message);
  }

  return body;
}

export async function apiGet(path, token, customHeaders) {
  return request(path, {
    method: 'GET',
    headers: buildHeaders(token, customHeaders),
  });
}

export async function apiPost(path, token, body, customHeaders) {
  return request(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...buildHeaders(token, customHeaders),
    },
    body: JSON.stringify(body),
  });
}

export async function apiPostForm(path, formValues, customHeaders) {
  const params = new URLSearchParams(formValues);
  return request(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      ...(customHeaders || {}),
    },
    body: params.toString(),
  });
}

export async function apiWithAuth(path, token, options = {}) {
  return request(path, {
    ...options,
    headers: buildHeaders(token, options.headers),
  });
}
