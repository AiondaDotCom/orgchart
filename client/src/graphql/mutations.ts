import { gql } from '@apollo/client';
import { EMPLOYEE_FIELDS, DEPARTMENT_FIELDS } from './queries';

export const CREATE_EMPLOYEE = gql`
  ${EMPLOYEE_FIELDS}
  mutation CreateEmployee($input: CreateEmployeeInput!) {
    createEmployee(input: $input) {
      ...EmployeeFields
      department {
        id
        name
        color
      }
    }
  }
`;

export const UPDATE_EMPLOYEE = gql`
  ${EMPLOYEE_FIELDS}
  mutation UpdateEmployee($id: ID!, $input: UpdateEmployeeInput!) {
    updateEmployee(id: $id, input: $input) {
      ...EmployeeFields
      department {
        id
        name
        color
      }
    }
  }
`;

export const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: ID!) {
    deleteEmployee(id: $id)
  }
`;

export const CREATE_DEPARTMENT = gql`
  ${DEPARTMENT_FIELDS}
  mutation CreateDepartment($input: CreateDepartmentInput!) {
    createDepartment(input: $input) {
      ...DepartmentFields
    }
  }
`;

export const UPDATE_DEPARTMENT = gql`
  ${DEPARTMENT_FIELDS}
  mutation UpdateDepartment($id: ID!, $input: UpdateDepartmentInput!) {
    updateDepartment(id: $id, input: $input) {
      ...DepartmentFields
    }
  }
`;

export const DELETE_DEPARTMENT = gql`
  mutation DeleteDepartment($id: ID!) {
    deleteDepartment(id: $id)
  }
`;

export const SEND_MESSAGE = gql`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      id
      senderId
      recipientId
      content
      timestamp
    }
  }
`;
