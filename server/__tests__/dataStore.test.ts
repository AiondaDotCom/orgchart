import { dataStore } from '../src/services/dataStore';
import type { CreateEmployeeInput, CreateDepartmentInput } from '../src/types';

// The dataStore is a singleton that seeds data on construction.
// We'll work with the existing seeded data and also test CRUD operations.

describe('DataStore', () => {
  // ─── Seed Data Verification ──────────────────────────────────────

  describe('seed data', () => {
    it('should have seeded departments', () => {
      const departments = dataStore.getAllDepartments();
      expect(departments.length).toBeGreaterThanOrEqual(6);

      const names = departments.map((d) => d.name);
      expect(names).toContain('Research');
      expect(names).toContain('Development');
      expect(names).toContain('Content');
      expect(names).toContain('Creative');
      expect(names).toContain('Product');
      expect(names).toContain('Sales');
    });

    it('should have seeded employees', () => {
      const employees = dataStore.getAllEmployees();
      expect(employees.length).toBeGreaterThanOrEqual(16);
    });

    it('should have a CEO (John Doe)', () => {
      const ceo = dataStore.getCeo();
      expect(ceo).toBeDefined();
      expect(ceo!.name).toBe('John Doe');
      expect(ceo!.title).toBe('CEO');
      expect(ceo!.type).toBe('human');
      expect(ceo!.initials).toBe('JD');
    });

    it('should have AI council members', () => {
      const council = dataStore.getCouncilMembers();
      expect(council.length).toBeGreaterThanOrEqual(3);
      const names = council.map((c) => c.name);
      expect(names).toContain('GROWTH');
      expect(names).toContain('RETENTION');
      expect(names).toContain('SKEPTIC');
    });

    it('should have council members with correct roles', () => {
      const council = dataStore.getCouncilMembers();
      for (const member of council) {
        expect(member.isCouncilMember).toBe(true);
        expect(member.councilRole).toBeTruthy();
        expect(member.type).toBe('ai');
      }
    });

    it('should have department heads set', () => {
      const research = dataStore.getDepartment('dept-research');
      expect(research).toBeDefined();
      expect(research!.headId).toBe('emp-atlas');

      const development = dataStore.getDepartment('dept-development');
      expect(development).toBeDefined();
      expect(development!.headId).toBe('emp-clawd');

      const content = dataStore.getDepartment('dept-content');
      expect(content).toBeDefined();
      expect(content!.headId).toBe('emp-scribe');

      const creative = dataStore.getDepartment('dept-creative');
      expect(creative).toBeDefined();
      expect(creative!.headId).toBe('emp-pixel');

      const product = dataStore.getDepartment('dept-product');
      expect(product).toBeDefined();
      expect(product!.headId).toBe('emp-clip');

      const sales = dataStore.getDepartment('dept-sales');
      expect(sales).toBeDefined();
      expect(sales!.headId).toBe('emp-sage');
    });

    it('should have AI agents in departments', () => {
      const researchEmployees = dataStore.getEmployeesByDepartment('dept-research');
      expect(researchEmployees.length).toBeGreaterThanOrEqual(2);
      const researchNames = researchEmployees.map((e) => e.name);
      expect(researchNames).toContain('ATLAS');
      expect(researchNames).toContain('TRENDY');

      const devEmployees = dataStore.getEmployeesByDepartment('dept-development');
      expect(devEmployees.length).toBeGreaterThanOrEqual(2);
      const devNames = devEmployees.map((e) => e.name);
      expect(devNames).toContain('CLAWD');
      expect(devNames).toContain('SENTINEL');
    });

    it('should have JARVIS as Chief Strategy Officer', () => {
      const jarvis = dataStore.getEmployee('emp-jarvis');
      expect(jarvis).toBeDefined();
      expect(jarvis!.name).toBe('JARVIS');
      expect(jarvis!.title).toBe('Chief Strategy Officer');
      expect(jarvis!.type).toBe('ai');
      expect(jarvis!.managerId).toBe('emp-vadim');
    });

    it('should have correct department colors and icons', () => {
      const research = dataStore.getDepartment('dept-research');
      expect(research!.icon).toBe('🔬');
      expect(research!.color).toBe('#8b5cf6');

      const development = dataStore.getDepartment('dept-development');
      expect(development!.icon).toBe('💻');
      expect(development!.color).toBe('#3b82f6');
    });

    it('should have employees with default status of unavailable', () => {
      const employees = dataStore.getAllEmployees();
      for (const emp of employees) {
        expect(emp.status).toBe('unavailable');
      }
    });
  });

  // ─── Employee CRUD ───────────────────────────────────────────────

  describe('Employee CRUD', () => {
    describe('getAllEmployees', () => {
      it('should return all employees as an array', () => {
        const employees = dataStore.getAllEmployees();
        expect(Array.isArray(employees)).toBe(true);
        expect(employees.length).toBeGreaterThan(0);
      });
    });

    describe('getEmployee', () => {
      it('should return an employee by id', () => {
        const employee = dataStore.getEmployee('emp-vadim');
        expect(employee).toBeDefined();
        expect(employee!.id).toBe('emp-vadim');
        expect(employee!.name).toBe('John Doe');
      });

      it('should return undefined for non-existent id', () => {
        const employee = dataStore.getEmployee('non-existent-id');
        expect(employee).toBeUndefined();
      });
    });

    describe('getEmployeesByDepartment', () => {
      it('should return employees for a given department', () => {
        const employees = dataStore.getEmployeesByDepartment('dept-research');
        expect(employees.length).toBeGreaterThanOrEqual(2);
        for (const emp of employees) {
          expect(emp.departmentId).toBe('dept-research');
        }
      });

      it('should return empty array for non-existent department', () => {
        const employees = dataStore.getEmployeesByDepartment('non-existent');
        expect(employees).toEqual([]);
      });
    });

    describe('getDirectReports', () => {
      it('should return direct reports for a manager', () => {
        const reports = dataStore.getDirectReports('emp-vadim');
        expect(reports.length).toBeGreaterThan(0);
        for (const emp of reports) {
          expect(emp.managerId).toBe('emp-vadim');
        }
      });

      it('should return direct reports for JARVIS', () => {
        const reports = dataStore.getDirectReports('emp-jarvis');
        expect(reports.length).toBeGreaterThan(0);
        for (const emp of reports) {
          expect(emp.managerId).toBe('emp-jarvis');
        }
      });

      it('should return empty array for employee with no reports', () => {
        const reports = dataStore.getDirectReports('emp-trendy');
        expect(reports).toEqual([]);
      });
    });

    describe('getCouncilMembers', () => {
      it('should return only council members', () => {
        const council = dataStore.getCouncilMembers();
        expect(council.length).toBeGreaterThanOrEqual(3);
        for (const member of council) {
          expect(member.isCouncilMember).toBe(true);
        }
      });
    });

    describe('getCeo', () => {
      it('should return the CEO', () => {
        const ceo = dataStore.getCeo();
        expect(ceo).toBeDefined();
        expect(ceo!.title).toBe('CEO');
        expect(ceo!.type).toBe('human');
      });
    });

    describe('getUnassignedEmployees', () => {
      it('should return employees without a department, not council members, not CEO', () => {
        const unassigned = dataStore.getUnassignedEmployees();
        for (const emp of unassigned) {
          expect(emp.departmentId).toBeNull();
          expect(emp.isCouncilMember).toBe(false);
          expect(emp.title).not.toBe('CEO');
        }
      });
    });

    describe('createEmployee', () => {
      it('should create an employee with all fields', () => {
        const input: CreateEmployeeInput = {
          name: 'Test Agent',
          title: 'Test Lead',
          type: 'ai',
          departmentId: 'dept-research',
          skills: ['Testing', 'Debugging'],
          avatarColor: '#ff0000',
          isCouncilMember: false,
          description: 'A test agent',
          matrixUserId: '@test:matrix.org',
        };

        const employee = dataStore.createEmployee(input);
        expect(employee.id).toBeTruthy();
        expect(employee.name).toBe('Test Agent');
        expect(employee.title).toBe('Test Lead');
        expect(employee.type).toBe('ai');
        expect(employee.departmentId).toBe('dept-research');
        expect(employee.skills).toEqual(['Testing', 'Debugging']);
        expect(employee.avatarColor).toBe('#ff0000');
        expect(employee.status).toBe('unavailable');
        expect(employee.isCouncilMember).toBe(false);
        expect(employee.description).toBe('A test agent');
        expect(employee.matrixUserId).toBe('@test:matrix.org');
        expect(employee.createdAt).toBeTruthy();
        expect(employee.updatedAt).toBeTruthy();

        // Verify it's retrievable
        const retrieved = dataStore.getEmployee(employee.id);
        expect(retrieved).toEqual(employee);

        // Clean up
        dataStore.deleteEmployee(employee.id);
      });

      it('should auto-generate initials from name', () => {
        const input: CreateEmployeeInput = {
          name: 'John Doe',
          title: 'Engineer',
          type: 'human',
        };

        const employee = dataStore.createEmployee(input);
        expect(employee.initials).toBe('JD');

        // Clean up
        dataStore.deleteEmployee(employee.id);
      });

      it('should auto-generate initials for single name', () => {
        const input: CreateEmployeeInput = {
          name: 'NEXUS',
          title: 'Analyst',
          type: 'ai',
        };

        const employee = dataStore.createEmployee(input);
        expect(employee.initials).toBe('N');

        // Clean up
        dataStore.deleteEmployee(employee.id);
      });

      it('should use provided initials instead of auto-generating', () => {
        const input: CreateEmployeeInput = {
          name: 'John Doe',
          initials: 'XX',
          title: 'Engineer',
          type: 'human',
        };

        const employee = dataStore.createEmployee(input);
        expect(employee.initials).toBe('XX');

        // Clean up
        dataStore.deleteEmployee(employee.id);
      });

      it('should use default values for optional fields', () => {
        const input: CreateEmployeeInput = {
          name: 'Minimal Employee',
          title: 'Worker',
          type: 'ai',
        };

        const employee = dataStore.createEmployee(input);
        expect(employee.departmentId).toBeNull();
        expect(employee.managerId).toBeNull();
        expect(employee.matrixUserId).toBeNull();
        expect(employee.avatarColor).toBe('#6366f1');
        expect(employee.skills).toEqual([]);
        expect(employee.status).toBe('unavailable');
        expect(employee.isCouncilMember).toBe(false);
        expect(employee.councilRole).toBeNull();
        expect(employee.description).toBeNull();

        // Clean up
        dataStore.deleteEmployee(employee.id);
      });

      it('should truncate initials to 2 characters for long names', () => {
        const input: CreateEmployeeInput = {
          name: 'Alice Bob Charlie',
          title: 'Manager',
          type: 'human',
        };

        const employee = dataStore.createEmployee(input);
        expect(employee.initials).toBe('AB');

        // Clean up
        dataStore.deleteEmployee(employee.id);
      });
    });

    describe('updateEmployee', () => {
      it('should update an existing employee', () => {
        const created = dataStore.createEmployee({
          name: 'Update Test',
          title: 'Tester',
          type: 'ai',
        });

        const updated = dataStore.updateEmployee(created.id, {
          name: 'Updated Name',
          title: 'Updated Title',
          skills: ['New Skill'],
        });

        expect(updated).toBeDefined();
        expect(updated!.name).toBe('Updated Name');
        expect(updated!.title).toBe('Updated Title');
        expect(updated!.skills).toEqual(['New Skill']);
        expect(updated!.type).toBe('ai'); // Unchanged fields preserved
        expect(new Date(updated!.updatedAt).getTime()).toBeGreaterThanOrEqual(
          new Date(created.updatedAt).getTime()
        );

        // Clean up
        dataStore.deleteEmployee(created.id);
      });

      it('should return undefined for non-existent employee', () => {
        const result = dataStore.updateEmployee('non-existent-id', {
          name: 'Test',
        });
        expect(result).toBeUndefined();
      });

      it('should update employee department', () => {
        const created = dataStore.createEmployee({
          name: 'Dept Test',
          title: 'Tester',
          type: 'ai',
          departmentId: 'dept-research',
        });

        expect(created.departmentId).toBe('dept-research');

        const updated = dataStore.updateEmployee(created.id, {
          departmentId: 'dept-development',
        });

        expect(updated).toBeDefined();
        expect(updated!.departmentId).toBe('dept-development');

        // Verify the employee is now in the development department
        const devEmployees = dataStore.getEmployeesByDepartment('dept-development');
        expect(devEmployees.some((e) => e.id === created.id)).toBe(true);

        // And no longer in research
        const researchEmployees = dataStore.getEmployeesByDepartment('dept-research');
        expect(researchEmployees.some((e) => e.id === created.id)).toBe(false);

        // Clean up
        dataStore.deleteEmployee(created.id);
      });

      it('should only update provided fields (not undefined ones)', () => {
        const created = dataStore.createEmployee({
          name: 'Partial Update',
          title: 'Original Title',
          type: 'human',
          skills: ['Original Skill'],
        });

        const updated = dataStore.updateEmployee(created.id, {
          title: 'New Title',
        });

        expect(updated!.name).toBe('Partial Update'); // Unchanged
        expect(updated!.title).toBe('New Title'); // Changed
        expect(updated!.skills).toEqual(['Original Skill']); // Unchanged
        expect(updated!.type).toBe('human'); // Unchanged

        // Clean up
        dataStore.deleteEmployee(created.id);
      });
    });

    describe('updateEmployeeStatus', () => {
      it('should update employee status', () => {
        const created = dataStore.createEmployee({
          name: 'Status Test',
          title: 'Tester',
          type: 'ai',
        });

        expect(created.status).toBe('unavailable');

        const updated = dataStore.updateEmployeeStatus(created.id, 'online');
        expect(updated).toBeDefined();
        expect(updated!.status).toBe('online');

        const updatedAgain = dataStore.updateEmployeeStatus(created.id, 'offline');
        expect(updatedAgain!.status).toBe('offline');

        // Clean up
        dataStore.deleteEmployee(created.id);
      });

      it('should return undefined for non-existent employee', () => {
        const result = dataStore.updateEmployeeStatus('non-existent', 'online');
        expect(result).toBeUndefined();
      });
    });

    describe('deleteEmployee', () => {
      it('should delete an existing employee', () => {
        const created = dataStore.createEmployee({
          name: 'To Delete',
          title: 'Temp',
          type: 'ai',
        });

        const result = dataStore.deleteEmployee(created.id);
        expect(result).toBe(true);

        const retrieved = dataStore.getEmployee(created.id);
        expect(retrieved).toBeUndefined();
      });

      it('should return false for non-existent employee', () => {
        const result = dataStore.deleteEmployee('non-existent-id');
        expect(result).toBe(false);
      });

      it('should remove employee from department listing', () => {
        const created = dataStore.createEmployee({
          name: 'Dept Delete Test',
          title: 'Tester',
          type: 'ai',
          departmentId: 'dept-research',
        });

        const beforeDelete = dataStore.getEmployeesByDepartment('dept-research');
        expect(beforeDelete.some((e) => e.id === created.id)).toBe(true);

        dataStore.deleteEmployee(created.id);

        const afterDelete = dataStore.getEmployeesByDepartment('dept-research');
        expect(afterDelete.some((e) => e.id === created.id)).toBe(false);
      });
    });
  });

  // ─── Department CRUD ─────────────────────────────────────────────

  describe('Department CRUD', () => {
    describe('getAllDepartments', () => {
      it('should return all departments as an array', () => {
        const departments = dataStore.getAllDepartments();
        expect(Array.isArray(departments)).toBe(true);
        expect(departments.length).toBeGreaterThanOrEqual(6);
      });
    });

    describe('getDepartment', () => {
      it('should return a department by id', () => {
        const dept = dataStore.getDepartment('dept-research');
        expect(dept).toBeDefined();
        expect(dept!.name).toBe('Research');
      });

      it('should return undefined for non-existent id', () => {
        const dept = dataStore.getDepartment('non-existent');
        expect(dept).toBeUndefined();
      });
    });

    describe('createDepartment', () => {
      it('should create a department with all fields', () => {
        const input: CreateDepartmentInput = {
          name: 'Marketing',
          icon: '📣',
          color: '#ff6600',
          headId: 'emp-vadim',
        };

        const dept = dataStore.createDepartment(input);
        expect(dept.id).toBeTruthy();
        expect(dept.name).toBe('Marketing');
        expect(dept.icon).toBe('📣');
        expect(dept.color).toBe('#ff6600');
        expect(dept.headId).toBe('emp-vadim');
        expect(dept.parentDepartmentId).toBeNull();
        expect(dept.createdAt).toBeTruthy();
        expect(dept.updatedAt).toBeTruthy();

        // Verify it's retrievable
        const retrieved = dataStore.getDepartment(dept.id);
        expect(retrieved).toEqual(dept);

        // Clean up
        dataStore.deleteDepartment(dept.id);
      });

      it('should use default values for optional fields', () => {
        const dept = dataStore.createDepartment({ name: 'Minimal Dept' });
        expect(dept.icon).toBe('📁');
        expect(dept.color).toBe('#6366f1');
        expect(dept.parentDepartmentId).toBeNull();
        expect(dept.headId).toBeNull();

        // Clean up
        dataStore.deleteDepartment(dept.id);
      });

      it('should create department with parent department', () => {
        const dept = dataStore.createDepartment({
          name: 'Sub Department',
          parentDepartmentId: 'dept-research',
        });

        expect(dept.parentDepartmentId).toBe('dept-research');

        // Clean up
        dataStore.deleteDepartment(dept.id);
      });
    });

    describe('updateDepartment', () => {
      it('should update an existing department', () => {
        const created = dataStore.createDepartment({
          name: 'Update Test Dept',
        });

        const updated = dataStore.updateDepartment(created.id, {
          name: 'Updated Department',
          icon: '🚀',
          color: '#00ff00',
        });

        expect(updated).toBeDefined();
        expect(updated!.name).toBe('Updated Department');
        expect(updated!.icon).toBe('🚀');
        expect(updated!.color).toBe('#00ff00');
        expect(new Date(updated!.updatedAt).getTime()).toBeGreaterThanOrEqual(
          new Date(created.updatedAt).getTime()
        );

        // Clean up
        dataStore.deleteDepartment(created.id);
      });

      it('should return undefined for non-existent department', () => {
        const result = dataStore.updateDepartment('non-existent', {
          name: 'Test',
        });
        expect(result).toBeUndefined();
      });

      it('should only update provided fields', () => {
        const created = dataStore.createDepartment({
          name: 'Partial Dept Update',
          icon: '📋',
          color: '#123456',
        });

        const updated = dataStore.updateDepartment(created.id, {
          name: 'New Name',
        });

        expect(updated!.name).toBe('New Name');
        expect(updated!.icon).toBe('📋'); // Unchanged
        expect(updated!.color).toBe('#123456'); // Unchanged

        // Clean up
        dataStore.deleteDepartment(created.id);
      });
    });

    describe('deleteDepartment', () => {
      it('should delete an existing department', () => {
        const created = dataStore.createDepartment({ name: 'To Delete' });

        const result = dataStore.deleteDepartment(created.id);
        expect(result).toBe(true);

        const retrieved = dataStore.getDepartment(created.id);
        expect(retrieved).toBeUndefined();
      });

      it('should return false for non-existent department', () => {
        const result = dataStore.deleteDepartment('non-existent');
        expect(result).toBe(false);
      });
    });
  });
});
