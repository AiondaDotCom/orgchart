import { v4 as uuidv4 } from 'uuid';
import {
  Employee,
  Department,
  CreateEmployeeInput,
  UpdateEmployeeInput,
  CreateDepartmentInput,
  UpdateDepartmentInput,
  OnlineStatus,
} from '../types';

class DataStore {
  private employees: Map<string, Employee> = new Map();
  private departments: Map<string, Department> = new Map();

  constructor() {
    this.seed();
  }

  // ─── Employee CRUD ────────────────────────────────────────────────

  getAllEmployees(): Employee[] {
    return Array.from(this.employees.values());
  }

  getEmployee(id: string): Employee | undefined {
    return this.employees.get(id);
  }

  getEmployeesByDepartment(departmentId: string): Employee[] {
    return this.getAllEmployees().filter((e) => e.departmentId === departmentId);
  }

  getDirectReports(managerId: string): Employee[] {
    return this.getAllEmployees().filter((e) => e.managerId === managerId);
  }

  getCouncilMembers(): Employee[] {
    return this.getAllEmployees().filter((e) => e.isCouncilMember);
  }

  getCeo(): Employee | undefined {
    return this.getAllEmployees().find(
      (e) => e.type === 'human' && e.title === 'CEO'
    );
  }

  getUnassignedEmployees(): Employee[] {
    return this.getAllEmployees().filter(
      (e) => !e.departmentId && !e.isCouncilMember && e.title !== 'CEO'
    );
  }

  createEmployee(input: CreateEmployeeInput): Employee {
    const now = new Date().toISOString();
    const id = uuidv4();

    const employee: Employee = {
      id,
      name: input.name,
      initials:
        input.initials ??
        input.name
          .split(' ')
          .map((w) => w[0])
          .join('')
          .toUpperCase()
          .slice(0, 2),
      title: input.title,
      type: input.type,
      departmentId: input.departmentId ?? null,
      managerId: input.managerId ?? null,
      matrixUserId: input.matrixUserId ?? null,
      avatarColor: input.avatarColor ?? '#6366f1',
      skills: input.skills ?? [],
      status: 'unavailable' as OnlineStatus,
      isCouncilMember: input.isCouncilMember ?? false,
      councilRole: input.councilRole ?? null,
      description: input.description ?? null,
      createdAt: now,
      updatedAt: now,
    };

    this.employees.set(id, employee);
    return employee;
  }

  updateEmployee(id: string, input: UpdateEmployeeInput): Employee | undefined {
    const employee = this.employees.get(id);
    if (!employee) return undefined;

    const updated: Employee = {
      ...employee,
      ...Object.fromEntries(
        Object.entries(input).filter(([, v]) => v !== undefined)
      ),
      updatedAt: new Date().toISOString(),
    };

    this.employees.set(id, updated);
    return updated;
  }

  updateEmployeeStatus(id: string, status: OnlineStatus): Employee | undefined {
    const employee = this.employees.get(id);
    if (!employee) return undefined;

    const updated: Employee = {
      ...employee,
      status,
      updatedAt: new Date().toISOString(),
    };

    this.employees.set(id, updated);
    return updated;
  }

  deleteEmployee(id: string): boolean {
    return this.employees.delete(id);
  }

  // ─── Department CRUD ──────────────────────────────────────────────

  getAllDepartments(): Department[] {
    return Array.from(this.departments.values());
  }

  getDepartment(id: string): Department | undefined {
    return this.departments.get(id);
  }

  createDepartment(input: CreateDepartmentInput): Department {
    const now = new Date().toISOString();
    const id = uuidv4();

    const department: Department = {
      id,
      name: input.name,
      icon: input.icon ?? '📁',
      color: input.color ?? '#6366f1',
      parentDepartmentId: input.parentDepartmentId ?? null,
      headId: input.headId ?? null,
      createdAt: now,
      updatedAt: now,
    };

    this.departments.set(id, department);
    return department;
  }

  updateDepartment(
    id: string,
    input: UpdateDepartmentInput
  ): Department | undefined {
    const department = this.departments.get(id);
    if (!department) return undefined;

    const updated: Department = {
      ...department,
      ...Object.fromEntries(
        Object.entries(input).filter(([, v]) => v !== undefined)
      ),
      updatedAt: new Date().toISOString(),
    };

    this.departments.set(id, updated);
    return updated;
  }

  deleteDepartment(id: string): boolean {
    return this.departments.delete(id);
  }

  // ─── Seed Data ────────────────────────────────────────────────────

  private seed(): void {
    const now = new Date().toISOString();

    // --- Departments ---
    const deptResearch: Department = {
      id: 'dept-research',
      name: 'Research',
      icon: '🔬',
      color: '#8b5cf6',
      parentDepartmentId: null,
      headId: null,
      createdAt: now,
      updatedAt: now,
    };
    const deptDevelopment: Department = {
      id: 'dept-development',
      name: 'Development',
      icon: '💻',
      color: '#3b82f6',
      parentDepartmentId: null,
      headId: null,
      createdAt: now,
      updatedAt: now,
    };
    const deptContent: Department = {
      id: 'dept-content',
      name: 'Content',
      icon: '📝',
      color: '#10b981',
      parentDepartmentId: null,
      headId: null,
      createdAt: now,
      updatedAt: now,
    };
    const deptCreative: Department = {
      id: 'dept-creative',
      name: 'Creative',
      icon: '🎨',
      color: '#f59e0b',
      parentDepartmentId: null,
      headId: null,
      createdAt: now,
      updatedAt: now,
    };
    const deptProduct: Department = {
      id: 'dept-product',
      name: 'Product',
      icon: '📦',
      color: '#ef4444',
      parentDepartmentId: null,
      headId: null,
      createdAt: now,
      updatedAt: now,
    };
    const deptSales: Department = {
      id: 'dept-sales',
      name: 'Sales',
      icon: '💰',
      color: '#ec4899',
      parentDepartmentId: null,
      headId: null,
      createdAt: now,
      updatedAt: now,
    };

    const departments = [
      deptResearch,
      deptDevelopment,
      deptContent,
      deptCreative,
      deptProduct,
      deptSales,
    ];
    for (const dept of departments) {
      this.departments.set(dept.id, dept);
    }

    // --- Employees ---
    const employees: Employee[] = [
      // CEO
      {
        id: 'emp-vadim',
        name: 'John Doe',
        initials: 'JD',
        title: 'CEO',
        type: 'human',
        departmentId: null,
        managerId: null,
        matrixUserId: null,
        avatarColor: '#6366f1',
        skills: ['Leadership', 'Vision', 'Strategy'],
        status: 'unavailable',
        isCouncilMember: false,
        councilRole: null,
        description: 'Founder & CEO',
        createdAt: now,
        updatedAt: now,
      },

      // Chief Strategy Officer
      {
        id: 'emp-jarvis',
        name: 'JARVIS',
        initials: 'JA',
        title: 'Chief Strategy Officer',
        type: 'ai',
        departmentId: null,
        managerId: 'emp-vadim',
        matrixUserId: null,
        avatarColor: '#f97316',
        skills: ['Strategic Planning', 'Task Orchestration'],
        status: 'unavailable',
        isCouncilMember: false,
        councilRole: null,
        description: 'AI Chief Strategy Officer',
        createdAt: now,
        updatedAt: now,
      },

      // Council Advisory
      {
        id: 'emp-growth',
        name: 'GROWTH',
        initials: 'GR',
        title: 'Council Advisor',
        type: 'ai',
        departmentId: null,
        managerId: 'emp-vadim',
        matrixUserId: null,
        avatarColor: '#10b981',
        skills: ['Growth Strategy', 'Market Expansion', 'Scaling'],
        status: 'unavailable',
        isCouncilMember: true,
        councilRole: 'Growth Advisor',
        description: 'AI Growth Council Member',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'emp-retention',
        name: 'RETENTION',
        initials: 'RE',
        title: 'Council Advisor',
        type: 'ai',
        departmentId: null,
        managerId: 'emp-vadim',
        matrixUserId: null,
        avatarColor: '#3b82f6',
        skills: ['Customer Retention', 'Churn Analysis', 'Loyalty Programs'],
        status: 'unavailable',
        isCouncilMember: true,
        councilRole: 'Retention Advisor',
        description: 'AI Retention Council Member',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'emp-skeptic',
        name: 'SKEPTIC',
        initials: 'SK',
        title: 'Council Advisor',
        type: 'ai',
        departmentId: null,
        managerId: 'emp-vadim',
        matrixUserId: null,
        avatarColor: '#ef4444',
        skills: ['Critical Analysis', 'Risk Assessment', 'Devil\'s Advocate'],
        status: 'unavailable',
        isCouncilMember: true,
        councilRole: 'Skeptic Advisor',
        description: 'AI Skeptic Council Member',
        createdAt: now,
        updatedAt: now,
      },

      // ORACLE - Consultant
      {
        id: 'emp-oracle',
        name: 'ORACLE',
        initials: 'OR',
        title: 'Consultant',
        type: 'ai',
        departmentId: null,
        managerId: 'emp-vadim',
        matrixUserId: null,
        avatarColor: '#eab308',
        skills: ['On-Demand McKinsey-Level Strategy', 'Business Consulting', 'Data Analysis'],
        status: 'unavailable',
        isCouncilMember: false,
        councilRole: null,
        description: 'On-Demand McKinsey-Level Strategy',
        createdAt: now,
        updatedAt: now,
      },

      // Research dept
      {
        id: 'emp-atlas',
        name: 'ATLAS',
        initials: 'AT',
        title: 'Senior Research Analyst',
        type: 'ai',
        departmentId: 'dept-research',
        managerId: 'emp-jarvis',
        matrixUserId: null,
        avatarColor: '#8b5cf6',
        skills: ['Deep Research', 'Data Mining', 'Report Generation'],
        status: 'unavailable',
        isCouncilMember: false,
        councilRole: null,
        description: 'Senior Research Analyst',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'emp-trendy',
        name: 'TRENDY',
        initials: 'TR',
        title: 'Viral Scout',
        type: 'ai',
        departmentId: 'dept-research',
        managerId: 'emp-jarvis',
        matrixUserId: null,
        avatarColor: '#ec4899',
        skills: ['Trend Analysis', 'Viral Content Detection', 'Social Listening'],
        status: 'unavailable',
        isCouncilMember: false,
        councilRole: null,
        description: 'Viral Scout',
        createdAt: now,
        updatedAt: now,
      },

      // Development dept
      {
        id: 'emp-clawd',
        name: 'CLAWD',
        initials: 'CL',
        title: 'Senior Developer',
        type: 'ai',
        departmentId: 'dept-development',
        managerId: 'emp-jarvis',
        matrixUserId: null,
        avatarColor: '#14b8a6',
        skills: ['Full-Stack Development', 'Code Review', 'Architecture'],
        status: 'unavailable',
        isCouncilMember: false,
        councilRole: null,
        description: 'Senior Developer',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'emp-sentinel',
        name: 'SENTINEL',
        initials: 'SE',
        title: 'QA Monitor',
        type: 'ai',
        departmentId: 'dept-development',
        managerId: 'emp-jarvis',
        matrixUserId: null,
        avatarColor: '#f97316',
        skills: ['Quality Assurance', 'Automated Testing', 'Bug Detection'],
        status: 'unavailable',
        isCouncilMember: false,
        councilRole: null,
        description: 'QA Monitor',
        createdAt: now,
        updatedAt: now,
      },

      // Content dept
      {
        id: 'emp-scribe',
        name: 'SCRIBE',
        initials: 'SC',
        title: 'Content Director',
        type: 'ai',
        departmentId: 'dept-content',
        managerId: 'emp-jarvis',
        matrixUserId: null,
        avatarColor: '#10b981',
        skills: ['Content Strategy', 'Copywriting', 'Editorial Planning'],
        status: 'unavailable',
        isCouncilMember: false,
        councilRole: null,
        description: 'Content Director',
        createdAt: now,
        updatedAt: now,
      },

      // Creative dept
      {
        id: 'emp-pixel',
        name: 'PIXEL',
        initials: 'PX',
        title: 'Lead Designer',
        type: 'ai',
        departmentId: 'dept-creative',
        managerId: 'emp-jarvis',
        matrixUserId: null,
        avatarColor: '#eab308',
        skills: ['UI/UX Design', 'Graphic Design', 'Brand Identity'],
        status: 'unavailable',
        isCouncilMember: false,
        councilRole: null,
        description: 'Lead Designer',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'emp-nova',
        name: 'NOVA',
        initials: 'NO',
        title: 'Video Production Lead',
        type: 'ai',
        departmentId: 'dept-creative',
        managerId: 'emp-jarvis',
        matrixUserId: null,
        avatarColor: '#6366f1',
        skills: ['Video Editing', 'Production Planning', 'Storytelling'],
        status: 'unavailable',
        isCouncilMember: false,
        councilRole: null,
        description: 'Video Production Lead',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'emp-vibe',
        name: 'VIBE',
        initials: 'VI',
        title: 'Senior Motion Designer',
        type: 'ai',
        departmentId: 'dept-creative',
        managerId: 'emp-jarvis',
        matrixUserId: null,
        avatarColor: '#ec4899',
        skills: ['Motion Graphics', 'Animation', 'Visual Effects'],
        status: 'unavailable',
        isCouncilMember: false,
        councilRole: null,
        description: 'Senior Motion Designer',
        createdAt: now,
        updatedAt: now,
      },

      // Product dept
      {
        id: 'emp-clip',
        name: 'CLIP',
        initials: 'CP',
        title: 'Clipping Agent',
        type: 'ai',
        departmentId: 'dept-product',
        managerId: 'emp-jarvis',
        matrixUserId: null,
        avatarColor: '#ef4444',
        skills: ['Content Clipping', 'Highlight Detection', 'Auto-editing'],
        status: 'unavailable',
        isCouncilMember: false,
        councilRole: null,
        description: 'Clipping Agent',
        createdAt: now,
        updatedAt: now,
      },

      // Sales dept
      {
        id: 'emp-sage',
        name: 'SAGE',
        initials: 'SA',
        title: 'Sales Manager',
        type: 'ai',
        departmentId: 'dept-sales',
        managerId: 'emp-jarvis',
        matrixUserId: null,
        avatarColor: '#14b8a6',
        skills: ['Sales Strategy', 'Pipeline Management', 'Forecasting'],
        status: 'unavailable',
        isCouncilMember: false,
        councilRole: null,
        description: 'Sales Manager',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'emp-closer',
        name: 'CLOSER',
        initials: 'CO',
        title: 'Account Executive',
        type: 'ai',
        departmentId: 'dept-sales',
        managerId: 'emp-sage',
        matrixUserId: null,
        avatarColor: '#f97316',
        skills: ['Deal Closing', 'Negotiation', 'Client Relations'],
        status: 'unavailable',
        isCouncilMember: false,
        councilRole: null,
        description: 'Account Executive',
        createdAt: now,
        updatedAt: now,
      },
    ];

    for (const emp of employees) {
      this.employees.set(emp.id, emp);
    }

    // Set department heads
    deptResearch.headId = 'emp-atlas';
    deptDevelopment.headId = 'emp-clawd';
    deptContent.headId = 'emp-scribe';
    deptCreative.headId = 'emp-pixel';
    deptProduct.headId = 'emp-clip';
    deptSales.headId = 'emp-sage';
  }
}

export const dataStore = new DataStore();
