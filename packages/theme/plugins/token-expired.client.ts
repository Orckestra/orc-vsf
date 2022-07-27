import type { Plugin } from '@nuxt/types';

const plugin: Plugin = ({ app }) => {
  app.$vsf.$occ.client.interceptors.response.use((response) => {
    if (response.headers) {
      const tokenExpired = response.headers['token-expired'];
      if (tokenExpired === 'true') {
        app.$vsf.$occ.api.initializeGuestToken().then(() =>{
          window.location.reload(true);
        })
        return false;
      }
    }
    return response;
  });
};

export default plugin;
