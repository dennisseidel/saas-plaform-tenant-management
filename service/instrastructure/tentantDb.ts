import { RDSDataService } from "aws-sdk";
import { Tenant } from "../domain/tenant";

const config = {
  tenant_management_db_arn: process.env.tenant_management_db_arn,
  tenant_management_rds_secret_arn: process.env.tenant_management_rds_secret_arn
};

const rdsDataService = new RDSDataService();

export class TenantDb {
  createTenant = async (tenant: Tenant) => {
    try {
      const startTransactionParams = {
        resourceArn: config.tenant_management_db_arn, /* required */
        secretArn: config.tenant_management_rds_secret_arn /* required */
      }
      const dbTransaction = await rdsDataService.beginTransaction(startTransactionParams).promise();
      const dbTransactionId = dbTransaction.transactionId
      const insertNewTenantParams = {
        includeResultMetadata: true,
        resourceArn: config.tenant_management_db_arn, /* required */
        secretArn: config.tenant_management_rds_secret_arn, /* required */
        sql: `insert into
        tenant_management.tenants (
          tenantId,
          tenantName,
          plan
        )
      values
        (
          '${tenant.id}',
          '${tenant.name}',
          '${tenant.plan}'  
        );`, /* required */
        transactionId: dbTransactionId
      };
      await rdsDataService.executeStatement(insertNewTenantParams).promise()
      const insertNewTenantMemberParams = {
        includeResultMetadata: true,
        resourceArn: config.tenant_management_db_arn, /* required */
        secretArn: config.tenant_management_rds_secret_arn, /* required */
        sql: `insert into
        tenant_management.tenant_members (
          tenantId,
          userId,
          userRole
        )
      values
        (
          '${tenant.id}',
          '${tenant.userId}',
          '${tenant.userRole}'
        );`, /* required */
        transactionId: dbTransactionId
      }
      await rdsDataService.executeStatement(insertNewTenantMemberParams).promise()
      const commitParams = {
        resourceArn: config.tenant_management_db_arn, /* required */
        secretArn: config.tenant_management_rds_secret_arn, /* required */
        transactionId: dbTransactionId /* required */
      }
      await rdsDataService.commitTransaction(commitParams).promise();
      return tenant;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  getTenantByUserId: (id: string) => Promise<Tenant[]> = async (id: string) => {
    try {
      var selectParams = {
        resourceArn: config.tenant_management_db_arn,
        secretArn: config.tenant_management_rds_secret_arn,
        sql: `select t.tenantId, t.tenantName, t.plan, tm.userId, tm.userRole from tenant_management.tenants as t join tenant_management.tenant_members as tm on t.tenantId = tenant_management.tm.tenantId where tm.userId = '${id}';`
      }
      console.log(selectParams)
      const tenants = await rdsDataService.executeStatement(selectParams).promise();
      const res: Tenant[] = tenants.records.map(tenant => this.createTenantFromRDSResult(tenant))
      return res
    } catch (error) {
      console.log(error)
      return error
    }
  }

  createTenantFromRDSResult: (tenantRDSData: any[]) => Tenant = (tenantRDSData: any[]) => {
    const tenant = new Tenant(tenantRDSData[2].stringValue, tenantRDSData[1].stringValue, tenantRDSData[0].stringValue, tenantRDSData[3].stringValue, tenantRDSData[4].stringValue)
    return tenant;
  }

  deleteTenantByTenantId = async (id: string) => {
    try {
      let transationParams = {
        resourceArn: config.tenant_management_db_arn,
        secretArn: config.tenant_management_rds_secret_arn
      }
      const dbTransaction = await rdsDataService.beginTransaction(transationParams).promise()
      const transactionId = dbTransaction.transactionId
      const deleteTenantMembersParams = {
        resourceArn: config.tenant_management_db_arn,
        secretArn: config.tenant_management_rds_secret_arn,
        transactionId: transactionId,
        sql: `delete from tenant_management.tenant_members where tenantId='${id}';`
      }
      const deleteTenantsParams = {
        resourceArn: config.tenant_management_db_arn,
        secretArn: config.tenant_management_rds_secret_arn,
        transactionId: transactionId,
        sql: `delete from tenant_management.tenants where tenantId='${id}';`
      }
      let [deleteTenantMembersResult, deleteTenantsResult] = await Promise.all([
        rdsDataService.executeStatement(deleteTenantMembersParams).promise(),
        rdsDataService.executeStatement(deleteTenantsParams).promise()
      ])
      console.log(`Members: ${deleteTenantMembersResult}, Tenants: ${deleteTenantsResult}`)
      const commitTransationParams = { ...transationParams, transactionId: transactionId }
      await rdsDataService.commitTransaction(commitTransationParams).promise();
      return true
    } catch (error) {
      return error
    }
  }
}
