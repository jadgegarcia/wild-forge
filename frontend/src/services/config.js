const apiHost = process.env.REACT_APP_API_HOST ?? '127.0.0.1';
const apiPort = process.env.REACT_APP_API_PORT ?? '8000';

const apiConfig = {
  API_URL: `http://${apiHost}:${apiPort}`,
};

export default apiConfig;
