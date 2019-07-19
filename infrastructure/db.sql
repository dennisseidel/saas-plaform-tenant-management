create database if not exists tenant_management;
create table tenant_management.tenants (
  tenantId varchar(36) primary key,
  tenantName varchar(255),
  plan varchar(255),
  createdAt timestamp not null default current_timestamp
);
create table tenant_management.tenant_members (
  tenantId varchar(36) not null references tenant_management.tenants(teanntId),
  userId varchar(255) not null,
  userRole varchar(255) not null,
  createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  primary key (tenantId, userId)
);