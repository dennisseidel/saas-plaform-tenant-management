import * as jwtDecode from 'jwt-decode';
import { APIGatewayProxyResult } from 'aws-lambda';



export const getSub = (authorizationHeader: string): string => {
  let sub = '';
  if (authorizationHeader) {
    const bearerToken = authorizationHeader.substring(authorizationHeader.indexOf(' ') + 1);
    const decodedAccessToken = jwtDecode(bearerToken);
    if (decodedAccessToken)
      sub = decodedAccessToken['sub'];
  }
  return sub;
}

export const httpResponse = (statusCode: number, body: any = '', cors: boolean = true): APIGatewayProxyResult => {
  const responseHeaders = cors ? {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true
  } : null;
  return {
    statusCode: statusCode,
    headers: responseHeaders,
    body: JSON.stringify(body)
  }
}


export function authorize(event) {
  // it is the first entry point into the system validate online against cognito that token is valid / non expired and sub is correct
  try {
    // const res = await axios.get('https://cognito-idp.eu-central-1.amazonaws.com/eu-central-1_TtI4cGag5/userInfo', {
    //   headers: {
    //     Authorization: `Bearer ${event.headers.Authorization}`
    //   }
    // })
    event.headers
    return true
  } catch {
    return false
  }
}