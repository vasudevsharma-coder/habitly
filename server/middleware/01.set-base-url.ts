export default eventHandler((event) => {
  // Set the correct origin for OAuth callbacks in production
  const originalHost = getHeader(event, 'host');
  const forwardedHost = getHeader(event, 'x-forwarded-host');
  const forwardedProto = getHeader(event, 'x-forwarded-proto');

  // If we're on Vercel, ensure the correct host and protocol are set
  if (process.env.VERCEL_ENV) {
    const vercelUrl = process.env.VERCEL_URL;
    if (vercelUrl && !originalHost?.includes('localhost')) {
      // Set headers to ensure OAuth uses the correct base URL
      if (!forwardedHost) {
        setHeader(event, 'x-forwarded-host', vercelUrl);
      }
      if (!forwardedProto) {
        setHeader(event, 'x-forwarded-proto', 'https');
      }
    }
  }
});