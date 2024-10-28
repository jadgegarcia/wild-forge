const apiHost = process.env.REACT_APP_API_HOST;
const apiPort = process.env.REACT_APP_API_PORT;

const apiConfig = {
  API_URL: `http://${apiHost}:${apiPort}`,
};

export default apiConfig;
