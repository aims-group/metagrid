import {
  esgfNodeURL,
  metagridApiURL,
  nodeStatusURL,
  proxyURL,
  wgetApiURL,
} from '../env';

type ApiRoutes = {
  keycloakAuth: string;
  userInfo: string;
  userCart: string;
  userSearches: string;
  userSearch: string;
  projects: string;
  esgfSearch: string;
  citation: string;
  wget: string;
  nodeStatus: string;
};

/**
 * Stripping the prefix proxy string is necessary if the route needs to be
 * served as a clickable link within the browser.
 */
export const clickableRoute = (route: string): string => {
  return route.replace(`${proxyURL}/`, '');
};

// Any path with parameters (e.g. '/:datasetID/') must be in camelCase
// https://mswjs.io/docs/basics/path-matching#path-with-parameters
const apiRoutes: ApiRoutes = {
  // MetaGrid APIs
  keycloakAuth: `${metagridApiURL}/dj-rest-auth/keycloak`,
  userInfo: `${metagridApiURL}/dj-rest-auth/user/`,
  userCart: `${metagridApiURL}/api/v1/carts/datasets/:pk/`,
  userSearches: `${metagridApiURL}/api/v1/carts/searches/`,
  userSearch: `${metagridApiURL}/api/v1/carts/searches/:pk/`,
  projects: `${metagridApiURL}/api/v1/projects/`,
  // ESGF Search API
  esgfSearch: `${proxyURL}/${esgfNodeURL}/esg-search/search/`,
  // ESGF Citation API (uses dummy link)
  citation: `${proxyURL}/citation_url`,
  // ESGF wget API
  wget: `${proxyURL}/${wgetApiURL}`,
  // ESGF Node Status API
  nodeStatus: `${proxyURL}/${nodeStatusURL}`,
};

export default apiRoutes;
