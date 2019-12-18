import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify, decode } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import Axios from 'axios'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

const cert = `-----BEGIN CERTIFICATE-----
MIIDBzCCAe+gAwIBAgIJbaSSr+UYF1QlMA0GCSqGSIb3DQEBCwUAMCExHzAdBgNV
BAMTFmRldi1zNXQxd2UxeS5hdXRoMC5jb20wHhcNMTkxMjE3MTE0NTM0WhcNMzMw
ODI1MTE0NTM0WjAhMR8wHQYDVQQDExZkZXYtczV0MXdlMXkuYXV0aDAuY29tMIIB
IjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqXSnXypSAL0RBhF4M4fOx+Lb
+CLS0oHuvW2fFx6swCi5noQJAIFM1deIXCaABIixpLclPQqnE0en4hu7ut8VXKma
cAqsi1by5P8ZQlJdvKkvwMprJpHYc+iwm+SnnI+Hd8aXtejaDLCixOqpOv32RgHC
HszvkImib7pMqNMeeNcERkhrrbNZWS278MtDEEnoGH9vb+t4RYFdTGOuSEerYMk6
0Buz2v6GoYZlAlOPdbZNy+l2uhNsIyN/mDJmdYbbhZJEVRo+3vtXyqGMIg9ouHiK
BOvw+77JFn1ZO3nWJgfho+GZfbOM96GBd/YbHUR8hgyVZDYdDrVAescprGjlZwID
AQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBSolcvN8uuUUF62bZzy
KpRGbwqzLTAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEBAAHf2V5+
Y/DFKcDwZeItzgIJz22bsrkw/JJSmp116ZZdgA+zCcF/Rgd22GnTFnD/T5MFh4wn
Xlahlz04xTtlAb22n0/kAJnu+JMBH8Y8v8UP8B4IJdMoayIx7iEVKj56/lItVKBo
oPqY3ZtaO8C0WMEc6IzcWsYJQg91kMTZDzzAAwhuDv02DkvdbQxSmjzI7Xt3OqzX
j7CdFhr3sikNIjwM9OBW5OM2T+gvX636GtLOgjXpuHGGaEJLMM5I2ruuApmy5Xxl
Sggi9I7QgVzZ/WKz28lH6PnFsgRnsxKYtqKV+hEHr+o7MIXgZJHj2T5Qb68EgSWK
rKzm3omvpeMhuUU=
-----END CERTIFICATE-----
`

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  const jwt: Jwt = decode(token, { complete: true }) as Jwt

  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  console.log(jwt, Axios, verify, jwt)

  return verify(token, cert,  { algorithms: ['RS256'] }) as JwtPayload
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
