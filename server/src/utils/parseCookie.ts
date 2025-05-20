const parseCookies = (cookieHeader: string | undefined): Record<string, string> => {
  const cookies: Record<string, string> = {};

  if (!cookieHeader) return cookies;

  cookieHeader.split(';').forEach(cookie => {
    const [key, value] = cookie.trim().split('=');
    if (key && value) {
      cookies[key] = decodeURIComponent(value);
    }
  });

  return cookies;
};

export default parseCookies