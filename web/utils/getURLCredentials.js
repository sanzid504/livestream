export const getURLCredentials = () => {
    if (typeof window === 'undefined') {
      return {};
    }
    
    return new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, property) => searchParams.get(property),
    });
  };
  