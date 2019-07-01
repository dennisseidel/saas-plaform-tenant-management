import { DynamoDB } from "aws-sdk";
import { Tenant } from "../domain/tenant";

const config = {
  tenant_management_db_name: process.env.tenant_management_db_name
};

const dynamoDb = new DynamoDB.DocumentClient();

export class TenantDb {
  createTenant = async (tenant: Tenant) => {
    try {
      const params = {
        TableName: config.tenant_management_db_name,
        Item: {
          tenantId: tenant.id,
          tenantName: tenant.name,
          plan: tenant.plan,
          userId: tenant.userId,
          role: tenant.userRole, //"tenant-admin",
          createdAt: Date.now()
        }
      };
      await dynamoDb.put(params).promise();
      return params.Item;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  getTenantByUserId = async (id: string) => {
    try {
      var params = {
        TableName: config.tenant_management_db_name,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": id
        }
      }
      const tenants = await dynamoDb.query(params).promise()
      return tenants.Items
    } catch (error) {
      console.log(error)
      return error
    }
  }

  deleteTenantByTenantId = async (id: string, userId: string) => {
    try {
      var params = {
        TableName: config.tenant_management_db_name,
        Key: {
          "userId": userId,
          "tenantId": id
        },
        ConditionExpression: "role = tenant-admin",
      }
      const res = await dynamoDb.delete(params);
      return res
    } catch (error) {
      return error
    }
  }
}
