// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'enakdp34b7'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-s5t1we1y.auth0.com',            // Auth0 domain
  clientId: 'x60F1jNX91UX8wynxiehDqE5D6MLVggL',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
