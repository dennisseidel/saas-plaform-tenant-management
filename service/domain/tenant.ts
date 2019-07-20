export class Tenant {
  plan: string;
  name: string;
  id: string;
  userId: string;
  userRole: string;

  constructor(
    plan: string,
    name: string,
    id: string,
    userId: string,
    userRole: string
  ) {
    this.plan = plan;
    this.name = name;
    this.id = id;
    this.userId = userId;
    this.userRole = userRole;
  }

}
