const ALLOWED_CONFIGS = ['prod', 'stage', 'dev'];

/**
 * This function calculates the environment in which the site is running based on the URL.
 * It defaults to 'prod'. In non 'prod' environments, the value can be overwritten using
 * the 'environment' key in sessionStorage.
 *
 * @returns {string} - environment identifier (dev, stage or prod'.
 */
export const calcEnvironment = () => {
  const { href } = window.location;
  let environment = 'prod';
  if (href.includes('.hlx.page')) {
    environment = 'stage';
  }
  if (href.includes('localhost')) {
    environment = 'dev';
  }

  const environmentFromConfig = window.sessionStorage.getItem('environment');
  if (environmentFromConfig && ALLOWED_CONFIGS.includes(environmentFromConfig) && environment !== 'prod') {
    return environmentFromConfig;
  }

  return environment;
};

function buildConfigURL(environment) {
  const env = environment || calcEnvironment();
  let fileName = 'configs.json?sheet=prod';
  if (env !== 'prod') {
    fileName = `configs-${env}.json`;
  }
  const configURL = new URL(`${window.location.origin}/${fileName}`);
  return configURL;
}

const getConfigForEnvironment = async (environment) => {
  return `
{
"total": 19,
"offset": 0,
"limit": 19,
"data": [
{
"key": "commerce-endpoint",
"value": "https://catalog-service.adobe.io/graphql"
},
{
"key": "commerce-environment-id",
"value": "f38a0de0-764b-41fa-bd2c-5bc2f3c7b39a"
},
{
"key": "commerce-website-code",
"value": "base"
},
{
"key": "commerce-store-view-code",
"value": "default"
},
{
"key": "commerce-store-code",
"value": "main_website_store"
},
{
"key": "commerce-customer-group",
"value": "b6589fc6ab0dc82cf12099d1c2d40ab994e8410c"
},
{
"key": "commerce-x-api-key",
"value": "4dfa19c9fe6f4cccade55cc5b3da94f7"
},
{
"key": "commerce-core-endpoint",
"value": "https://mcprod.aemshop.net/graphql"
},
{
"key": "commerce-root-category-id",
"value": "2"
},
{
"key": "commerce-environment",
"value": "Production"
},
{
"key": "commerce-store-id",
"value": "1"
},
{
"key": "commerce-store-name",
"value": "Main Website Store"
},
{
"key": "commerce-store-url",
"value": "https://mcprod.aemshop.net/"
},
{
"key": "commerce-store-view-id",
"value": "1"
},
{
"key": "commerce-store-view-name",
"value": "Default Store View"
},
{
"key": "commerce-website-id",
"value": "1"
},
{
"key": "commerce-website-name",
"value": "Main Website"
},
{
"key": "commerce-base-currency-code",
"value": "USD"
},
{
"key": "adyen-client-key",
"value": "test_TBG272DDJZH4ZAAXSBAKQZ44ZQC6LWOU"
}
],
":type": "sheet"
}`
}

/**
 * This function retrieves a configuration value for a given environment.
 *
 * @param {string} configParam - The configuration parameter to retrieve.
 * @param {string} [environment] - Optional, overwrite the current environment.
 * @returns {Promise<string|undefined>} - The value of the configuration parameter, or undefined.
 */
export const getConfigValue = async (configParam, environment) => {
  const env = environment || calcEnvironment();
  const configJSON = await getConfigForEnvironment(env);
  const configElements = JSON.parse(configJSON).data;
  return configElements.find((c) => c.key === configParam)?.value;
};


