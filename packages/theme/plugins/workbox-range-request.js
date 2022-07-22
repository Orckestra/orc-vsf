const TWO_HOUR = 1000 * 60 * 60 * 2;

const isValid = (response) => {
  if (!response) return false;
  const fetched = response.headers.get('sw-fetched-on');
  return fetched && (parseFloat(fetched) + TWO_HOUR) > Date.now();
};

const postRequestHandler = async ({url, request, event, params}) => {
  let appendKey = '';

  if (request.url.includes('getProducts')) {
    const body = await request.clone().text();
    appendKey = JSON.stringify(JSON.parse(body).map(x => x.categorySlug));
  }

  try {
    const response = await fetch(request);
    const cache = await caches.open('apiCache');

    const copy = response.clone();
    const headers = new Headers(copy.headers);
    headers.append('sw-fetched-on', Date.now().toString());
    const responseBody = await copy.blob();

    await cache.put(request.url + appendKey, new Response(responseBody, {
      status: copy.status,
      statusText: copy.statusText,
      headers: headers
    }));
    return response;
  } catch (e) {
    const response = await caches.match(request.url + appendKey);

    if (isValid(response)) {
      return response;
    }
  }
};

workbox.routing.registerRoute(new RegExp('/api/(.*)'), postRequestHandler, 'POST');
