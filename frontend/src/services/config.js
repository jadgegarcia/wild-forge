const apiHost = process.env.REACT_APP_API_HOST ?? 'wild-forge-production.up.railway.app';
const apiPort = process.env.REACT_APP_API_PORT;  // This will be undefined in production

const apiConfig = {
  API_URL: 'https://wild-forge-production.up.railway.app',
};

export default apiConfig;
