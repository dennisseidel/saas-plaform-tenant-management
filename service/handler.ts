import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { DynamoDB } from 'aws-sdk';
import { v1 } from 'uuid';
import * as jwtDecode from 'jwt-decode';

const config = {
  tenant_management_db_name: process.env.tenant_management_db_name
}

const dynamoDb = new DynamoDB.DocumentClient();

const getSub = (authorizationHeader) => {
  let sub = '';
  if (authorizationHeader) {
    const bearerToken = authorizationHeader.substring(authorizationHeader.indexOf(' ') + 1);
    const decodedAccessToken = jwtDecode(bearerToken);
    if (decodedAccessToken)
      sub = decodedAccessToken['sub'];
  }
  return sub;
}


export const createTenant: APIGatewayProxyHandler = async (event, _context) => {
  const { plan, tenantName }: { plan: string, tenantName: string } = JSON.parse(event.body)
  const authorizationHeader = event.headers.Authorization;

  const responseHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true
  }
  const sub = getSub(authorizationHeader)
  const params = {
    TableName: config.tenant_management_db_name,
    Item: {
      tenantId: v1(),
      tenantName: tenantName,
      plan: plan,
      userId: sub,
      role: 'tenant-admin',
      createdAt: Date.now()
    }
  }
  try {
    await dynamoDb.put(params).promise();
    return {
      statusCode: 200,
      headers: responseHeaders,
      body: JSON.stringify(params.Item)
    }
  }
  catch (error) {
    console.log(error)
    return {
      statusCode: 500,
      headers: responseHeaders,
      body: JSON.stringify({ "status": false })
    };
  }
}
