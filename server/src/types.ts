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
}

export interface CreateEmployeeInput {
  name: string;
  initials?: string;
  title: string;
  type: EmployeeType;
  departmentId?: string;
  managerId?: string;
  matrixUserId?: string;
  avatarColor?: string;
  skills?: string[];
  isCouncilMember?: boolean;
  councilRole?: string;
  description?: string;
}

export interface UpdateEmployeeInput {
  name?: string;
  initials?: string;
  title?: string;
  type?: EmployeeType;
  departmentId?: string | null;
  managerId?: string | null;
  matrixUserId?: string | null;
  avatarColor?: string;
  skills?: string[];
  isCouncilMember?: boolean;
  councilRole?: string | null;
  description?: string | null;
}

export interface CreateDepartmentInput {
  name: string;
  icon?: string;
  color?: string;
  parentDepartmentId?: string;
  headId?: string;
}

export interface UpdateDepartmentInput {
  name?: string;
  icon?: string;
  color?: string;
  parentDepartmentId?: string | null;
  headId?: string | null;
}

export interface StatusChangeEvent {
  employeeId: string;
  status: OnlineStatus;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: string;
}
