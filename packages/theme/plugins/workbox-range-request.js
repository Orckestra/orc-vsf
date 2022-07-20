const TWO_HOUR = 1000 * 60 * 60 * 2;

const isValid = (response) => {
  if (!response) return false;
  const fetched = response.headers.get('sw-fetched-on');
  return fetched && (parseFloat(fetched) + TWO_HOUR) > Date.now();
};

const handlerCb = async ({url, request, event, params}) => {
  const body = await request.clone().text();

  try {
    const response = await fetch(request);
    const cache = await caches.open('v1');

    const copy = response.clone();
    const headers = new Headers(copy.headers);
    headers.append('sw-fetched-on', Date.now().toString());
    const responseBody = await copy.blob();

    await cache.put(request.url + body, new Response(responseBody, {
      status: copy.status,
      statusText: copy.statusText,
      headers: headers
    }));
    return response;
  } catch (e) {
    const response = await caches.match(request.url + body);

    if (isValid(response)) {
      return response;
    }
  }
};

// Cache first strategy
/* async function() {
  var cache = await caches.open(cacheName);
  var cachedFiles = await cache.match(event.request);
  if(cachedFiles) {
    return cachedFiles;
  } else {
    try {
      var response = await fetch(event.request);
      await cache.put(event.request, response.clone());
      return response;
    } catch(e) { /!* ... *!/ }
  }
} */

workbox.routing.registerRoute(new RegExp('/api/(.*)'), handlerCb, 'POST');
