import { resolvers, pubsub } from '../src/resolvers';
import { dataStore } from '../src/services/dataStore';

// Mock pubsub.publish so mutations don't actually publish
jest.spyOn(pubsub, 'publish').mockResolvedValue(undefined as any);

describe('Resolvers', () => {
  // ─── Field Resolvers ──────────────────────────────────────────────

  describe('Employee field resolvers', () => {
    it('should resolve department from departmentId', () => {
      const parent = { departmentId: 'dept-research' };
      const result = resolvers.Employee.department(parent);
      expect(result).toBeDefined();
      expect(result!.name).toBe('Research');
    });

    it('should return null when departmentId is null', () => {
      const parent = { departmentId: null };
      const result = resolvers.Employee.department(parent);
      expect(result).toBeNull();
    });

    it('should resolve manager from managerId', () => {
      const parent = { managerId: 'emp-vadim' };
      const result = resolvers.Employee.manager(parent);
      expect(result).toBeDefined();
      expect(result!.name).toBe('John Doe');
    });

    it('should return null when managerId is null', () => {
      const parent = { managerId: null };
      const result = resolvers.Employee.manager(parent);
      expect(result).toBeNull();
    });

    it('should resolve directReports', () => {
      const parent = { id: 'emp-vadim' };
      const result = resolvers.Employee.directReports(parent);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      for (const report of result) {
        expect(report.managerId).toBe('emp-vadim');
      }
    });

    it('should return empty array for directReports when no reports exist', () => {
      const parent = { id: 'emp-trendy' };
      const result = resolvers.Employee.directReports(parent);
      expect(result).toEqual([]);
    });
  });

  describe('Department field resolvers', () => {
    it('should resolve employees for a department', () => {
      const parent = { id: 'dept-research' };
      const result = resolvers.Department.employees(parent);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThanOrEqual(2);
      for (const emp of result) {
        expect(emp.departmentId).toBe('dept-research');
      }
    });

    it('should resolve head from headId', () => {
      const parent = { headId: 'emp-atlas' };
      const result = resolvers.Department.head(parent);
      expect(result).toBeDefined();
      expect(result!.name).toBe('ATLAS');
    });

    it('should return null when headId is null', () => {
      const parent = { headId: null };
      const result = resolvers.Department.head(parent);
      expect(result).toBeNull();
    });

    it('should resolve parentDepartment from parentDepartmentId', () => {
      // Create a child department for testing
      const child = dataStore.createDepartment({
        name: 'Sub-dept',
        parentDepartmentId: 'dept-research',
      });

      const parent = { parentDepartmentId: 'dept-research' };
      const result = resolvers.Department.parentDepartment(parent);
      expect(result).toBeDefined();
      expect(result!.name).toBe('Research');

      // Clean up
      dataStore.deleteDepartment(child.id);
    });

    it('should return null when parentDepartmentId is null', () => {
      const parent = { parentDepartmentId: null };
      const result = resolvers.Department.parentDepartment(parent);
      expect(result).toBeNull();
    });
  });

  describe('StatusChangeEvent field resolvers', () => {
    it('should resolve employee from employeeId', () => {
      const parent = { employeeId: 'emp-vadim' };
      const result = resolvers.StatusChangeEvent.employee(parent);
      expect(result).toBeDefined();
      expect(result!.name).toBe('John Doe');
    });
  });

  // ─── Query Resolvers ──────────────────────────────────────────────

  describe('Query resolvers', () => {
    describe('employees', () => {
      it('should return all employees', () => {
        const result = resolvers.Query.employees();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThanOrEqual(16);
      });
    });

    describe('employee', () => {
      it('should return an employee by id', () => {
        const result = resolvers.Query.employee(null, { id: 'emp-vadim' });
        expect(result).toBeDefined();
        expect(result!.name).toBe('John Doe');
      });

      it('should return null for non-existent id', () => {
        const result = resolvers.Query.employee(null, { id: 'non-existent' });
        expect(result).toBeNull();
      });
    });

    describe('departments', () => {
      it('should return all departments', () => {
        const result = resolvers.Query.departments();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThanOrEqual(6);
      });
    });

    describe('department', () => {
      it('should return a department by id', () => {
        const result = resolvers.Query.department(null, { id: 'dept-research' });
        expect(result).toBeDefined();
        expect(result!.name).toBe('Research');
      });

      it('should return null for non-existent id', () => {
        const result = resolvers.Query.department(null, { id: 'non-existent' });
        expect(result).toBeNull();
      });
    });

    describe('councilMembers', () => {
      it('should return council members', () => {
        const result = resolvers.Query.councilMembers();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThanOrEqual(3);
        for (const member of result) {
          expect(member.isCouncilMember).toBe(true);
        }
      });
    });

    describe('orgChart', () => {
      it('should return proper org chart structure', () => {
        const result = resolvers.Query.orgChart();

        expect(result).toHaveProperty('ceo');
        expect(result).toHaveProperty('council');
        expect(result).toHaveProperty('departments');
        expect(result).toHaveProperty('unassigned');
      });

      it('should have CEO as John Doe', () => {
        const result = resolvers.Query.orgChart();
        expect(result.ceo).toBeDefined();
        expect(result.ceo!.name).toBe('John Doe');
        expect(result.ceo!.title).toBe('CEO');
      });

      it('should have council members in the council array', () => {
        const result = resolvers.Query.orgChart();
        expect(result.council.length).toBeGreaterThanOrEqual(3);
        for (const member of result.council) {
          expect(member.isCouncilMember).toBe(true);
        }
      });

      it('should have all departments', () => {
        const result = resolvers.Query.orgChart();
        expect(result.departments.length).toBeGreaterThanOrEqual(6);
        const names = result.departments.map((d) => d.name);
        expect(names).toContain('Research');
        expect(names).toContain('Development');
      });

      it('should have unassigned employees (not CEO, not council, no department)', () => {
        const result = resolvers.Query.orgChart();
        for (const emp of result.unassigned) {
          expect(emp.departmentId).toBeNull();
          expect(emp.isCouncilMember).toBe(false);
          expect(emp.title).not.toBe('CEO');
        }
      });
    });
  });

  // ─── Mutation Resolvers ───────────────────────────────────────────

  describe('Mutation resolvers', () => {
    describe('createEmployee', () => {
      it('should create a new employee', () => {
        const input = {
          name: 'New Agent',
          title: 'Test Worker',
          type: 'ai' as const,
          skills: ['Testing'],
        };

        const result = resolvers.Mutation.createEmployee(null, { input });
        expect(result.id).toBeTruthy();
        expect(result.name).toBe('New Agent');
        expect(result.title).toBe('Test Worker');
        expect(result.type).toBe('ai');
        expect(result.skills).toEqual(['Testing']);

        // Should publish event
        expect(pubsub.publish).toHaveBeenCalledWith(
          'EMPLOYEE_CREATED',
          expect.objectContaining({
            employeeCreated: expect.objectContaining({ name: 'New Agent' }),
          })
        );

        // Clean up
        dataStore.deleteEmployee(result.id);
      });
    });

    describe('updateEmployee', () => {
      it('should update an existing employee', () => {
        const created = dataStore.createEmployee({
          name: 'Resolver Update Test',
          title: 'Original',
          type: 'ai',
        });

        const result = resolvers.Mutation.updateEmployee(null, {
          id: created.id,
          input: { title: 'Updated Title' },
        });

        expect(result.title).toBe('Updated Title');
        expect(result.name).toBe('Resolver Update Test');

        // Should publish event
        expect(pubsub.publish).toHaveBeenCalledWith(
          'EMPLOYEE_UPDATED',
          expect.objectContaining({
            employeeUpdated: expect.objectContaining({ title: 'Updated Title' }),
          })
        );

        // Clean up
        dataStore.deleteEmployee(created.id);
      });

      it('should throw error for non-existent employee', () => {
        expect(() =>
          resolvers.Mutation.updateEmployee(null, {
            id: 'non-existent',
            input: { name: 'Test' },
          })
        ).toThrow('Employee with id "non-existent" not found');
      });
    });

    describe('deleteEmployee', () => {
      it('should delete an existing employee', () => {
        const created = dataStore.createEmployee({
          name: 'Resolver Delete Test',
          title: 'Temp',
          type: 'ai',
        });

        const result = resolvers.Mutation.deleteEmployee(null, { id: created.id });
        expect(result).toBe(true);

        // Should publish event
        expect(pubsub.publish).toHaveBeenCalledWith(
          'EMPLOYEE_DELETED',
          expect.objectContaining({
            employeeDeleted: created.id,
          })
        );

        // Verify it's gone
        expect(dataStore.getEmployee(created.id)).toBeUndefined();
      });

      it('should throw error for non-existent employee', () => {
        expect(() =>
          resolvers.Mutation.deleteEmployee(null, { id: 'non-existent' })
        ).toThrow('Employee with id "non-existent" not found');
      });
    });

    describe('createDepartment', () => {
      it('should create a new department', () => {
        const input = {
          name: 'New Department',
          icon: '🆕',
          color: '#abcdef',
        };

        const result = resolvers.Mutation.createDepartment(null, { input });
        expect(result.id).toBeTruthy();
        expect(result.name).toBe('New Department');
        expect(result.icon).toBe('🆕');
        expect(result.color).toBe('#abcdef');

        // Should publish event
        expect(pubsub.publish).toHaveBeenCalledWith(
          'DEPARTMENT_CREATED',
          expect.objectContaining({
            departmentCreated: expect.objectContaining({ name: 'New Department' }),
          })
        );

        // Clean up
        dataStore.deleteDepartment(result.id);
      });
    });

    describe('updateDepartment', () => {
      it('should update an existing department', () => {
        const created = dataStore.createDepartment({
          name: 'Resolver Update Dept',
        });

        const result = resolvers.Mutation.updateDepartment(null, {
          id: created.id,
          input: { name: 'Updated Dept Name' },
        });

        expect(result.name).toBe('Updated Dept Name');

        // Should publish event
        expect(pubsub.publish).toHaveBeenCalledWith(
          'DEPARTMENT_UPDATED',
          expect.objectContaining({
            departmentUpdated: expect.objectContaining({ name: 'Updated Dept Name' }),
          })
        );

        // Clean up
        dataStore.deleteDepartment(created.id);
      });

      it('should throw error for non-existent department', () => {
        expect(() =>
          resolvers.Mutation.updateDepartment(null, {
            id: 'non-existent',
            input: { name: 'Test' },
          })
        ).toThrow('Department with id "non-existent" not found');
      });
    });

    describe('deleteDepartment', () => {
      it('should delete an existing department', () => {
        const created = dataStore.createDepartment({
          name: 'Resolver Delete Dept',
        });

        const result = resolvers.Mutation.deleteDepartment(null, {
          id: created.id,
        });
        expect(result).toBe(true);

        // Should publish event
        expect(pubsub.publish).toHaveBeenCalledWith(
          'DEPARTMENT_DELETED',
          expect.objectContaining({
            departmentDeleted: created.id,
          })
        );

        // Verify it's gone
        expect(dataStore.getDepartment(created.id)).toBeUndefined();
      });

      it('should throw error for non-existent department', () => {
        expect(() =>
          resolvers.Mutation.deleteDepartment(null, { id: 'non-existent' })
        ).toThrow('Department with id "non-existent" not found');
      });
    });

    describe('sendMessage', () => {
      it('should create and return a chat message', () => {
        const input = {
          recipientId: 'emp-jarvis',
          content: 'Hello JARVIS!',
        };

        const result = resolvers.Mutation.sendMessage(null, { input }, {
          userId: 'emp-vadim',
        });

        expect(result.id).toBeTruthy();
        expect(result.senderId).toBe('emp-vadim');
        expect(result.recipientId).toBe('emp-jarvis');
        expect(result.content).toBe('Hello JARVIS!');
        expect(result.timestamp).toBeTruthy();

        // Should publish event
        expect(pubsub.publish).toHaveBeenCalledWith(
          'MESSAGE_SENT',
          expect.objectContaining({
            messageSent: expect.objectContaining({
              content: 'Hello JARVIS!',
            }),
          })
        );
      });

      it('should use "anonymous" when no userId in context', () => {
        const input = {
          recipientId: 'emp-jarvis',
          content: 'Hello!',
        };

        const result = resolvers.Mutation.sendMessage(null, { input }, {});
        expect(result.senderId).toBe('anonymous');
      });

      it('should use "anonymous" when context is undefined', () => {
        const input = {
          recipientId: 'emp-jarvis',
          content: 'Hello!',
        };

        const result = resolvers.Mutation.sendMessage(null, { input }, undefined);
        expect(result.senderId).toBe('anonymous');
      });
    });
  });

  // ─── Subscription Resolvers ───────────────────────────────────────

  describe('Subscription resolvers', () => {
    it('should have employeeStatusChanged subscription', () => {
      expect(resolvers.Subscription.employeeStatusChanged).toBeDefined();
      expect(resolvers.Subscription.employeeStatusChanged.subscribe).toBeInstanceOf(
        Function
      );
    });

    it('should have employeeCreated subscription', () => {
      expect(resolvers.Subscription.employeeCreated).toBeDefined();
      expect(resolvers.Subscription.employeeCreated.subscribe).toBeInstanceOf(
        Function
      );
    });

    it('should have employeeUpdated subscription', () => {
      expect(resolvers.Subscription.employeeUpdated).toBeDefined();
      expect(resolvers.Subscription.employeeUpdated.subscribe).toBeInstanceOf(
        Function
      );
    });

    it('should have employeeDeleted subscription', () => {
      expect(resolvers.Subscription.employeeDeleted).toBeDefined();
      expect(resolvers.Subscription.employeeDeleted.subscribe).toBeInstanceOf(
        Function
      );
    });

    it('should have departmentCreated subscription', () => {
      expect(resolvers.Subscription.departmentCreated).toBeDefined();
      expect(resolvers.Subscription.departmentCreated.subscribe).toBeInstanceOf(
        Function
      );
    });

    it('should have departmentUpdated subscription', () => {
      expect(resolvers.Subscription.departmentUpdated).toBeDefined();
      expect(resolvers.Subscription.departmentUpdated.subscribe).toBeInstanceOf(
        Function
      );
    });

    it('should have departmentDeleted subscription', () => {
      expect(resolvers.Subscription.departmentDeleted).toBeDefined();
      expect(resolvers.Subscription.departmentDeleted.subscribe).toBeInstanceOf(
        Function
      );
    });

    it('should have messageSent subscription with filter', () => {
      expect(resolvers.Subscription.messageSent).toBeDefined();
      expect(resolvers.Subscription.messageSent.subscribe).toBeInstanceOf(
        Function
      );
    });
  });
});
