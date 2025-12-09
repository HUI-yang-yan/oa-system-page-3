// Data Transfer Objects matching OpenAPI schema

export interface Result<T = any> {
  code: number;
  msg: string;
  data: T;
}

export interface UserDTO {
  id?: number;
  username: string;
  employeeId?: string;
  departmentId?: number;
  status?: number; // 1: Active, 0: Disabled usually
  position?: string;
  realName?: string;
  email?: string;
  phone?: string;
}

export interface Role {
  id: number;
  roleName: string;
  roleCode: string;
}

export interface User {
  id?: number;
  employeeId?: string;
  username: string;
  password?: string; // Only for creation usually
  realName?: string;
  email?: string;
  phone?: string;
  departmentId?: number;
  status?: number;
  position?: string;
  roles?: Role[];
}

export interface LoginDTO {
  username: string;
  password?: string;
}

export interface LeaveApplicationDTO {
  leaveTypeId: number;
  startTime: string; // Date string
  endTime: string; // Date string
  reason: string;
}

export interface PageSelectWorkerDTO {
  pageNum: number;
  pageSize: number;
  username?: string;
  employeeId?: string;
  departmentId?: number;
  status?: number;
  position?: string;
  startTime?: string;
}

// Additional UI Helper types
export interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}