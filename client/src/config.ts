// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'rz972nmt7g'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-2.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-kj2bx6hh.auth0.com', // Auth0 domain
  clientId: 'HuqlK2ZBpK08p4FiebEtRMAMc240q5GR', // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}