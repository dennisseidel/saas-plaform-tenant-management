import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { v1 } from 'uuid';
import { getSub, authorize } from './domain/lib'
import { Tenant } from './domain/tenant';
import { TenantDb } from './instrastructure/tentantDb'
import { httpResponse } from './domain/lib'

export const createTenant: APIGatewayProxyHandler = async (event, _context) => {
  try {
    const { plan, tenantName }: { plan: string, tenantName: string } = JSON.parse(event.body)
    const authorizationHeader = event.headers.Authorization;
    const authorized = await authorize(event);
    if (!authorized) {
      return httpResponse(401)
    }
    const sub = getSub(authorizationHeader)
    const tenantId = v1()
    const tenant = new Tenant(plan, tenantName, tenantId, sub, 'admin')
    const tenantDb = new TenantDb();
    const res = await tenantDb.createTenant(tenant);
    return httpResponse(200, res);
  }
  catch (error) {
    console.log(error)
    return httpResponse(500)
  }
}

export const getTenant: APIGatewayProxyHandler = async (event, _context) => {
  const authorizationHeader = event.headers.Authorization;
  const authorized = await authorize(event);
  if (!authorized) {
    return httpResponse(401)
  }
  try {
    const sub = getSub(authorizationHeader)
    const tenantDb = new TenantDb()
    const tenants: Tenant[] = await tenantDb.getTenantByUserId(sub)
    return httpResponse(200, { tenants: tenants })
  }
  catch (error) {
    console.log(error)
    return httpResponse(500)
  };
}

export const deleteTenant: APIGatewayProxyHandler = async (event, _context) => {
  const authorized = await authorize(event);
  if (!authorized) {
    return httpResponse(401)
  }
  try {
    const tenantId = event.pathParameters.id
    const tenantDb = new TenantDb()
    await tenantDb.deleteTenantByTenantId(tenantId)
    return httpResponse(200)
  } catch (error) {
    console.log(error)
    return httpResponse(500)

  }

}
