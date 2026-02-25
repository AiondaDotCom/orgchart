import { PubSub, withFilter } from 'graphql-subscriptions';
import { v4 as uuidv4 } from 'uuid';
import { dataStore } from './services/dataStore';
import { ChatMessage } from './types';

export const pubsub = new PubSub();

// ─── Subscription event names ───────────────────────────────────────
const EMPLOYEE_STATUS_CHANGED = 'EMPLOYEE_STATUS_CHANGED';
const EMPLOYEE_CREATED = 'EMPLOYEE_CREATED';
const EMPLOYEE_UPDATED = 'EMPLOYEE_UPDATED';
const EMPLOYEE_DELETED = 'EMPLOYEE_DELETED';
const DEPARTMENT_CREATED = 'DEPARTMENT_CREATED';
const DEPARTMENT_UPDATED = 'DEPARTMENT_UPDATED';
const DEPARTMENT_DELETED = 'DEPARTMENT_DELETED';
const MESSAGE_SENT = 'MESSAGE_SENT';

export const resolvers = {
  // ─── Field resolvers ────────────────────────────────────────────────

  Employee: {
    department: (parent: any) => {
      return parent.departmentId
        ? dataStore.getDepartment(parent.departmentId)
        : null;
    },
    manager: (parent: any) => {
      return parent.managerId
        ? dataStore.getEmployee(parent.managerId)
        : null;
    },
    directReports: (parent: any) => {
      return dataStore.getDirectReports(parent.id);
    },
  },

  Department: {
    employees: (parent: any) => {
      return dataStore.getEmployeesByDepartment(parent.id);
    },
    head: (parent: any) => {
      return parent.headId ? dataStore.getEmployee(parent.headId) : null;
    },
    parentDepartment: (parent: any) => {
      return parent.parentDepartmentId
        ? dataStore.getDepartment(parent.parentDepartmentId)
        : null;
    },
  },

  StatusChangeEvent: {
    employee: (parent: any) => {
      return dataStore.getEmployee(parent.employeeId);
    },
  },

  // ─── Queries ────────────────────────────────────────────────────────

  Query: {
    employees: () => {
      return dataStore.getAllEmployees();
    },

    employee: (_: any, { id }: { id: string }) => {
      return dataStore.getEmployee(id) ?? null;
    },

    departments: () => {
      return dataStore.getAllDepartments();
    },

    department: (_: any, { id }: { id: string }) => {
      return dataStore.getDepartment(id) ?? null;
    },

    councilMembers: () => {
      return dataStore.getCouncilMembers();
    },

    orgChart: () => {
      return {
        ceo: dataStore.getCeo() ?? null,
        council: dataStore.getCouncilMembers(),
        departments: dataStore.getAllDepartments(),
        unassigned: dataStore.getUnassignedEmployees(),
      };
    },
  },

  // ─── Mutations ──────────────────────────────────────────────────────

  Mutation: {
    createEmployee: (_: any, { input }: { input: any }) => {
      const employee = dataStore.createEmployee(input);
      pubsub.publish(EMPLOYEE_CREATED, { employeeCreated: employee });
      return employee;
    },

    updateEmployee: (_: any, { id, input }: { id: string; input: any }) => {
      const employee = dataStore.updateEmployee(id, input);
      if (!employee) {
        throw new Error(`Employee with id "${id}" not found`);
      }
      pubsub.publish(EMPLOYEE_UPDATED, { employeeUpdated: employee });
      return employee;
    },

    deleteEmployee: (_: any, { id }: { id: string }) => {
      const success = dataStore.deleteEmployee(id);
      if (!success) {
        throw new Error(`Employee with id "${id}" not found`);
      }
      pubsub.publish(EMPLOYEE_DELETED, { employeeDeleted: id });
      return true;
    },

    createDepartment: (_: any, { input }: { input: any }) => {
      const department = dataStore.createDepartment(input);
      pubsub.publish(DEPARTMENT_CREATED, { departmentCreated: department });
      return department;
    },

    updateDepartment: (_: any, { id, input }: { id: string; input: any }) => {
      const department = dataStore.updateDepartment(id, input);
      if (!department) {
        throw new Error(`Department with id "${id}" not found`);
      }
      pubsub.publish(DEPARTMENT_UPDATED, { departmentUpdated: department });
      return department;
    },

    deleteDepartment: (_: any, { id }: { id: string }) => {
      const success = dataStore.deleteDepartment(id);
      if (!success) {
        throw new Error(`Department with id "${id}" not found`);
      }
      pubsub.publish(DEPARTMENT_DELETED, { departmentDeleted: id });
      return true;
    },

    sendMessage: (
      _: any,
      { input }: { input: { recipientId: string; content: string } },
      context: any
    ) => {
      const message: ChatMessage = {
        id: uuidv4(),
        senderId: context?.userId ?? 'anonymous',
        recipientId: input.recipientId,
        content: input.content,
        timestamp: new Date().toISOString(),
      };
      pubsub.publish(MESSAGE_SENT, { messageSent: message });
      return message;
    },
  },

  // ─── Subscriptions ──────────────────────────────────────────────────

  Subscription: {
    employeeStatusChanged: {
      subscribe: () => pubsub.asyncIterator([EMPLOYEE_STATUS_CHANGED]),
    },

    employeeCreated: {
      subscribe: () => pubsub.asyncIterator([EMPLOYEE_CREATED]),
    },

    employeeUpdated: {
      subscribe: () => pubsub.asyncIterator([EMPLOYEE_UPDATED]),
    },

    employeeDeleted: {
      subscribe: () => pubsub.asyncIterator([EMPLOYEE_DELETED]),
    },

    departmentCreated: {
      subscribe: () => pubsub.asyncIterator([DEPARTMENT_CREATED]),
    },

    departmentUpdated: {
      subscribe: () => pubsub.asyncIterator([DEPARTMENT_UPDATED]),
    },

    departmentDeleted: {
      subscribe: () => pubsub.asyncIterator([DEPARTMENT_DELETED]),
    },

    messageSent: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([MESSAGE_SENT]),
        (payload, variables) => {
          return payload.messageSent.recipientId === variables.recipientId;
        }
      ),
    },
  },
};

// ─── Presence change listener ─────────────────────────────────────────
// This function is called from index.ts after the matrixService is
// initialized, so that presence changes are published as subscriptions.
export function setupPresencePublishing(): void {
  const { matrixService } = require('./services/matrixService');

  matrixService.on(
    'presenceChange',
    ({ userId, status }: { userId: string; status: string }) => {
      // Find the employee by matrixUserId
      const employees = dataStore.getAllEmployees();
      const employee = employees.find((e) => e.matrixUserId === userId);
      if (!employee) return;

      dataStore.updateEmployeeStatus(employee.id, status as any);

      pubsub.publish(EMPLOYEE_STATUS_CHANGED, {
        employeeStatusChanged: {
          employeeId: employee.id,
          status,
          timestamp: new Date().toISOString(),
        },
      });
    }
  );
}
