import { gql } from '@apollo/client';
import { EMPLOYEE_FIELDS } from './queries';

export const EMPLOYEE_STATUS_CHANGED = gql`
  ${EMPLOYEE_FIELDS}
  subscription OnEmployeeStatusChanged {
    employeeStatusChanged {
      employeeId
      status
      timestamp
      employee {
        ...EmployeeFields
      }
    }
  }
`;

export const EMPLOYEE_CREATED = gql`
  ${EMPLOYEE_FIELDS}
  subscription OnEmployeeCreated {
    employeeCreated {
      ...EmployeeFields
      department {
        id
        name
        color
      }
    }
  }
`;

export const EMPLOYEE_UPDATED = gql`
  ${EMPLOYEE_FIELDS}
  subscription OnEmployeeUpdated {
    employeeUpdated {
      ...EmployeeFields
      department {
        id
        name
        color
      }
    }
  }
`;

export const EMPLOYEE_DELETED = gql`
  subscription OnEmployeeDeleted {
    employeeDeleted
  }
`;

export const MESSAGE_SENT = gql`
  subscription OnMessageSent($recipientId: String!) {
    messageSent(recipientId: $recipientId) {
      id
      senderId
      recipientId
      content
      timestamp
    }
  }
`;
