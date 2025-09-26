const isProd = import.meta.env.PROD;

export const envConfig = {
  disablePullToRefresh: isProd,
  disablePinchZoom: isProd,
  disableDevNav: isProd,
};
