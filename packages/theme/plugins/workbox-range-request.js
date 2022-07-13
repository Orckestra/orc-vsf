// const savePostResponsePlugin = {
//   cacheKeyWillBeUsed: async ({request, mode}) => {
//     console.log(`request.url`);
//     console.log(request.url);
//     if (mode === 'write') {
//       // Use the same URL as `POST` request as the cache key.
//       // Alternatively, use a different URL.
//       return request.url;
//     }
//   },
// };

// console.log('Custom workbox');

workbox.routing.registerRoute(
  new RegExp('/api/(.*)'),
  new workbox.strategies.CacheFirst({
    cacheName: 'apiCache',
    plugins: [
      // Add the custom plugin to your strategy.
      savePostResponsePlugin,
      //new workbox.expiration.Plugin({...}),
    ],
  }),
  'POST'
);


registerRoute(new RegExp('/api/.*'), handlerCb, 'POST');


const handlerCb = async ({url, request, event, params}) => {
  const response = await fetch(request);
  const responseBody = await response.text();
  console.log(`1244`);
  return new Response(`${responseBody} <!-- Look Ma. Added Content. -->`, {
    headers: response.headers,
  });
};