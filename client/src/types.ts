export type EmployeeType = 'human' | 'ai';

export type OnlineStatus = 'online' | 'offline' | 'unavailable';

export interface Employee {
  id: string;
  name: string;
  initials: string;
  title: string;
  type: EmployeeType;
  departmentId: string | null;
  managerId: string | null;
  matrixUserId: string | null;
  avatarColor: string;
  skills: string[];
  status: OnlineStatus;
  isCouncilMember: boolean;
  councilRole: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  department?: {
    id: string;
    name: string;
    color: string;
  } | null;
  manager?: {
    id: string;
    name: string;
  } | null;
  directReports?: {
    id: string;
    name: string;
    initials?: string;
    title?: string;
    status?: OnlineStatus;
    avatarColor?: string;
  }[];
}

export interface Department {
  id: string;
  name: string;
  icon: string;
  color: string;
  parentDepartmentId: string | null;
  headId: string | null;
  createdAt: string;
  updatedAt: string;
  head?: {
    id: string;
    name: string;
    initials?: string;
    title?: string;
    avatarColor?: string;
    status?: OnlineStatus;
  } | null;
  employees: Employee[];
}

export interface OrgChart {
  ceo: Employee | null;
  council: Employee[];
  departments: Department[];
  unassigned: Employee[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: string;
}

export interface StatusChangeEvent {
  employeeId: string;
  status: OnlineStatus;
  timestamp: string;
  employee: Employee;
}
