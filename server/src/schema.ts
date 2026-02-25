export const typeDefs = `#graphql
  enum EmployeeType {
    human
    ai
  }

  enum OnlineStatus {
    online
    offline
    unavailable
  }

  type Employee {
    id: ID!
    name: String!
    initials: String!
    title: String!
    type: EmployeeType!
    department: Department
    departmentId: String
    manager: Employee
    managerId: String
    matrixUserId: String
    avatarColor: String!
    skills: [String!]!
    status: OnlineStatus!
    isCouncilMember: Boolean!
    councilRole: String
    description: String
    directReports: [Employee!]!
    createdAt: String!
    updatedAt: String!
  }

  type Department {
    id: ID!
    name: String!
    icon: String!
    color: String!
    parentDepartment: Department
    parentDepartmentId: String
    head: Employee
    headId: String
    employees: [Employee!]!
    createdAt: String!
    updatedAt: String!
  }

  type StatusChangeEvent {
    employeeId: ID!
    employee: Employee!
    status: OnlineStatus!
    timestamp: String!
  }

  type ChatMessage {
    id: ID!
    senderId: String!
    recipientId: String!
    content: String!
    timestamp: String!
  }

  input CreateEmployeeInput {
    name: String!
    initials: String
    title: String!
    type: EmployeeType!
    departmentId: String
    managerId: String
    matrixUserId: String
    avatarColor: String
    skills: [String!]
    isCouncilMember: Boolean
    councilRole: String
    description: String
  }

  input UpdateEmployeeInput {
    name: String
    initials: String
    title: String
    type: EmployeeType
    departmentId: String
    managerId: String
    matrixUserId: String
    avatarColor: String
    skills: [String!]
    isCouncilMember: Boolean
    councilRole: String
    description: String
  }

  input CreateDepartmentInput {
    name: String!
    icon: String
    color: String
    parentDepartmentId: String
    headId: String
  }

  input UpdateDepartmentInput {
    name: String
    icon: String
    color: String
    parentDepartmentId: String
    headId: String
  }

  input SendMessageInput {
    recipientId: String!
    content: String!
  }

  type Query {
    employees: [Employee!]!
    employee(id: ID!): Employee
    departments: [Department!]!
    department(id: ID!): Department
    councilMembers: [Employee!]!
    orgChart: OrgChart!
  }

  type OrgChart {
    ceo: Employee
    council: [Employee!]!
    departments: [Department!]!
    unassigned: [Employee!]!
  }

  type Mutation {
    createEmployee(input: CreateEmployeeInput!): Employee!
    updateEmployee(id: ID!, input: UpdateEmployeeInput!): Employee!
    deleteEmployee(id: ID!): Boolean!
    createDepartment(input: CreateDepartmentInput!): Department!
    updateDepartment(id: ID!, input: UpdateDepartmentInput!): Department!
    deleteDepartment(id: ID!): Boolean!
    sendMessage(input: SendMessageInput!): ChatMessage!
  }

  type Subscription {
    employeeStatusChanged: StatusChangeEvent!
    employeeCreated: Employee!
    employeeUpdated: Employee!
    employeeDeleted: ID!
    departmentCreated: Department!
    departmentUpdated: Department!
    departmentDeleted: ID!
    messageSent(recipientId: String!): ChatMessage!
  }
`;
