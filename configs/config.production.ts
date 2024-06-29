import getConfigs from "./config.common";

const baseUrl = 'http://localhost.prod:3000';
const mode = 'production';

const configProduction = getConfigs({
  baseUrl,
  mode,
});

export default configProduction;