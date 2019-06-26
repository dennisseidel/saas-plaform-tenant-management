import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { DynamoDB } from 'aws-sdk';


const uuid = require('uuid');
// const jwtDecode = require('jwt-decode');

const config = {
  tenant_management_db_name: process.env.tenant_management_db_name
}

const dynamoDb = new DynamoDB.DocumentClient();

// const getSub = (event) => {
//   let sub = '';
//   const AuthorizationHeader = event.headers.Authorization;
//   if (AuthorizationHeader) {
//     bearerToken = AuthorizationHeader.substring(AuthorizationHeader.indexOf(' ') + 1);
//     var decodedAccessToken = jwtDecode(bearerToken);
//     if (decodedAccessToken)
//       sub = decodedAccessToken['sub'];
//   }
//   return sub;
// }


export const createTenant: APIGatewayProxyHandler = async (event, _context) => {
  const { plan, tenantName }: { plan: string, tenantName: string } = JSON.parse(event.body)
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true
  }
  const params = {
    TableName: config.tenant_management_db_name,
    Item: {
      tenantId: uuid.v1(),
      tenantName: tenantName,
      plan: plan,
      userId: 'requestorSub',
      role: 'tenant-admin',
      createdAt: Date.now()
    }
  }
  try {
    await dynamoDb.put(params).promise();
    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(params.Item)
    }
  }
  catch (error) {
    console.log(error)
    return {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({ "status": false })
    };
  }
}
