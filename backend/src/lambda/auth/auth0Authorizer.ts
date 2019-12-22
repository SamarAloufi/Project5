import { CustomAuthorizerEvent, CustomAuthorizerResult } from "aws-lambda";
import "source-map-support/register";

import { verify} from "jsonwebtoken";
import { createLogger } from "../../utils/logger";

import { JwtPayload } from "../../auth/JwtPayload";

const logger = createLogger("auth");

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
const cert = `-----BEGIN CERTIFICATE-----
MIIDBzCCAe+gAwIBAgIJQfZyxQxPX/3OMA0GCSqGSIb3DQEBCwUAMCExHzAdBgNV
BAMTFmRldi1rajJieDZoaC5hdXRoMC5jb20wHhcNMTkxMjIyMTgwOTI4WhcNMzMw
ODMwMTgwOTI4WjAhMR8wHQYDVQQDExZkZXYta2oyYng2aGguYXV0aDAuY29tMIIB
IjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA6Z/VjrnoYslWwQPNx6BgSlAb
bjUi4gu9FR/n7V6NDJYZgIbSO+D5kQbAK+ynq3kxbN7Q6CR5j4XPiCs5r9BR5/Dh
MR4e3L1F5tv8tv23iOIdeHyDYWaqaUKbG5RuQ8kW3KEdF4HA7MCpiixCHZgR4zw6
IOWLiZ5iL8x2Au5tATG+HlTem/heU/KhnfE97jZ39anl3okf/JmlXKV+OQiqAOlp
djXSlgEZrs/dKT3KGhsOR+l4sM0pAQCg2si55Zlyud80Bk8tANOPWG51tZHkNGPA
H37R5Pu/QutbMikICpun/lFyO88TcLhQyIRu3D4+yBTxv1ghg3rc+GvwLaMwwQID
AQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBTgMqKMjLsXPm/AfEmQ
+5fsVzmTBTAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEBANKgT55y
9U2M8c0reZNy/+ryaz3RB0jGl88LzXcujzF44qfmgtZdbmUINHhesjNrQOhsADoY
88shLN0sKUME99zjDDvPRYIME1lj2jc5mnPkRaPmk1Fo8nH6qTunBDtz05kQaAZt
UKi1n279DCXcCuZNdTaxzhqxGgyO28grmmaTLwaFIgzFJNcqPjIZKYkgHb0KT79W
e9eDcY1YnDcBu+ysYN3sUU4ybcIRNWLLgoaxm5rekkahZ2tOZ7+mABZ17qcqiuVY
f5+vmszxCGSFj/Lt87N3R1YoXDo+aye7dR0QvC19/ncyNOS1rWMwZubIWYDcuzJd
/9LlAtvx1Px9yqg=
-----END CERTIFICATE-----
`;
export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info("Authorizing a user", event.authorizationToken);
  try {
    const jwtToken = await verifyToken(event.authorizationToken);
    logger.info("User was authorized", jwtToken);

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Allow",
            Resource: "*"
          }
        ]
      }
    };
  } catch (e) {
    logger.error("User not authorized", { error: e.message });

    return {
      principalId: "user",
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Deny",
            Resource: "*"
          }
        ]
      }
    };
  }
};

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader);
  // const jwt: Jwt = decode(token, { complete: true }) as Jwt;

  // console.log(jwt);

  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  return verify(token, cert, { algorithms: ["RS256"] }) as JwtPayload;
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error("No authentication header");

  if (!authHeader.toLowerCase().startsWith("bearer "))
    throw new Error("Invalid authentication header");

  const split = authHeader.split(" ");
  const token = split[1];

  return token;
}
