// const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';
const AWS = require('aws-sdk');
const uuid = require('uuid');
const jwtDecode = require('jwt-decode');

const config = {
    tenant_management_db_name: process.env.tenant_management_db_name
}

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const getSub = (event) => {
    let sub = '';
    const AuthorizationHeader = event.headers.Authorization;
    if (AuthorizationHeader) {
        bearerToken = AuthorizationHeader.substring(AuthorizationHeader.indexOf(' ') + 1);
        var decodedAccessToken = jwtDecode(bearerToken);
        if (decodedAccessToken)
            sub = decodedAccessToken['sub'];
    }
    return sub;
} 

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
exports.lambdaHandler = (event, context, callback) => {
    // Request body is passed in as a JSON encoded string in 'event.body'
    const data = JSON.parse(event.body);
    // get the tenant ids and permissions of the caller from his access token through introspection
    const requestorSub = getSub(event)
    // insert data to the db
    const params = {
        TableName: config.tenant_management_db_name,
        Item: {
            tenantId: uuid.v1(),
            tenantName: data.tenantName,
            plan: data.plan,
            userId: requestorSub, 
            role: 'tenant-admin',
            createdAt: Date.now()
        }
    };
    
    dynamoDb.put(params, (error, data) => {
        console.log(error);
        // Set response headers to enable CORS (Cross-Origin Resource Sharing)
        const headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true
        };

        // Return status code 500 on error
        if (error) {
            const response = {
                statusCode: 500,
                headers: headers,
                body: JSON.stringify({ status: false })
            };
            callback(null, response)
            return;
        }

        // Return status code 200 and the newly created item
        const response = {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify(params.Item)
        };
        callback(null, response);
        return;
    });
};