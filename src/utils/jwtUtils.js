function decodeJwtToken(token) {
  if (!token) {
    return null;
  }
  try {
    let binaryToken = token.split('.')[1]
    const decoded = atob(binaryToken)
    return JSON.parse(decoded);
  }
  catch (err) {
    console.error('Failed to decode JWT token', err);
    return null;
  }
}

export { decodeJwtToken };
