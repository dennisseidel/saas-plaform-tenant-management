insert into
  tenant_management.tenants (tenantId, tenantName)
values
  ('123', 'Nova');
insert into
  tenant_management.tenant_members (tenantId, userId, userRole)
values
  ('123', 'user1', 'admin');
select
  t.tenantId,
  t.tenantName,
  t.plan,
  tm.userId,
  tm.userRole
from
  tenant_management.tenants as t
  join tenant_management.tenant_members as tm on t.tenantId = tenant_management.tm.tenantId
insert into
  tenant_management.tenants (tenantId, tenantName, plan)
values
  ('124', 'Super', 'free');
insert into
  tenant_management.tenant_members (tenantId, userId, userRole)
values
  ('124', 'user1', 'member');
sql
delete from
  tenant_management.tenant_members
where
  tenantId = '123';
select
  *
from
  tenant_management.tenant_members;
delete from
  tenant_management.tenants
where
  tenantId = '123';
select
  *
from
  tenant_management.tenants;