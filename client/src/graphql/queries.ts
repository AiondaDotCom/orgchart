import { gql } from '@apollo/client';

export const EMPLOYEE_FIELDS = gql`
  fragment EmployeeFields on Employee {
    id
    name
    initials
    title
    type
    departmentId
    managerId
    matrixUserId
    avatarColor
    skills
    status
    isCouncilMember
    councilRole
    description
    createdAt
    updatedAt
  }
`;

export const DEPARTMENT_FIELDS = gql`
  fragment DepartmentFields on Department {
    id
    name
    icon
    color
    parentDepartmentId
    headId
    createdAt
    updatedAt
  }
`;

export const GET_EMPLOYEES = gql`
  ${EMPLOYEE_FIELDS}
  query GetEmployees {
    employees {
      ...EmployeeFields
      department {
        id
        name
        color
      }
      directReports {
        id
        name
      }
    }
  }
`;

export const GET_EMPLOYEE = gql`
  ${EMPLOYEE_FIELDS}
  query GetEmployee($id: ID!) {
    employee(id: $id) {
      ...EmployeeFields
      department {
        id
        name
        color
      }
      manager {
        id
        name
      }
      directReports {
        id
        name
        initials
        title
        status
        avatarColor
      }
    }
  }
`;

export const GET_DEPARTMENTS = gql`
  ${DEPARTMENT_FIELDS}
  query GetDepartments {
    departments {
      ...DepartmentFields
      head {
        id
        name
      }
      employees {
        id
        name
        initials
        title
        type
        avatarColor
        skills
        status
        matrixUserId
        isCouncilMember
        councilRole
        description
        managerId
        departmentId
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_ORG_CHART = gql`
  ${EMPLOYEE_FIELDS}
  ${DEPARTMENT_FIELDS}
  query GetOrgChart {
    orgChart {
      ceo {
        ...EmployeeFields
        directReports {
          id
          name
          initials
          title
          type
          avatarColor
          skills
          status
        }
      }
      council {
        ...EmployeeFields
      }
      departments {
        ...DepartmentFields
        head {
          id
          name
          initials
          title
          avatarColor
          status
        }
        employees {
          ...EmployeeFields
        }
      }
      unassigned {
        ...EmployeeFields
      }
    }
  }
`;
