const handlerCb = async ({url, request, event, params}) => {
  const body = await request.clone().text();

  try {
    const response = await fetch(request);
    const cache = await caches.open('v1');
    await cache.put(request.url + body, response.clone());
    return response;
  } catch (e) {
    return caches.match(request.url + body);
  }
};

workbox.routing.registerRoute(new RegExp('/api/(.*)'), handlerCb, 'POST');
