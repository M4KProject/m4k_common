const decode = (str) => {
  if (!str) return true;
  const decode = decodeURIComponent(str);
  try { return JSON.parse(decode); } catch(e) {}
  return str;
}

export const getUrlQuery = (): { path: string[], [key: string]: any } => {
  if (typeof location === 'undefined') return { path: [] };
  const search = location.search;
  const path = location.pathname.split('/').filter(p => p) 
  const query = { path };
  if (search) {
    const queryString = search.substring(1);
    if (queryString) {
      const pairs = queryString.split('&');
      pairs.forEach(pair => {
        const [key, valueString] = pair.split('=');
        query[key] = decode(valueString);
      });
    }
  }
  query.path = path;
  return query;
}
