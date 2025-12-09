import { LoginDTO, PageSelectWorkerDTO, User, LeaveApplicationDTO, Result } from '../types';

const BASE_URL = 'http://localhost:8000';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': token } : {}),
  };
};

const handleResponse = async <T>(response: Response): Promise<Result<T>> => {
  if (!response.ok) {
    if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.hash = '#/login';
        throw new Error('Unauthorized');
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const api = {
  // Auth
  login: async (data: LoginDTO) => {
    const res = await fetch(`${BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Workspace
  signIn: async () => {
    const now = new Date().toISOString();
    const res = await fetch(`${BASE_URL}/api/workspace/sign/in?signInTime=${now}`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  signOut: async () => {
    const now = new Date().toISOString();
    const res = await fetch(`${BASE_URL}/api/workspace/sign/out?signOutTime=${now}`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getAttendanceRecords: async () => {
    const res = await fetch(`${BASE_URL}/api/workspace/records`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getMeetingRoomStatus: async () => {
    const res = await fetch(`${BASE_URL}/api/workspace/meetingRoom`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Worker Management
  getWorkers: async (filter: PageSelectWorkerDTO) => {
    const res = await fetch(`${BASE_URL}/api/wim/page/get/workers`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(filter),
    });
    return handleResponse(res);
  },

  updateWorker: async (user: User) => {
    const res = await fetch(`${BASE_URL}/api/wim/update/worker`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(user),
    });
    return handleResponse(res);
  },
  
  deleteWorkers: async (ids: number[]) => {
    const res = await fetch(`${BASE_URL}/api/wim/delete/workers/${JSON.stringify(ids)}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Leave
  addLeave: async (data: LeaveApplicationDTO) => {
    const res = await fetch(`${BASE_URL}/api/leave/add/leave`, {
      method: 'PUT', // Per OpenAPI spec
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  
  getLeaveTypes: async () => {
    const res = await fetch(`${BASE_URL}/api/leave/type`, {
        method: 'GET',
        headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getLeaveApprovals: async () => {
     const res = await fetch(`${BASE_URL}/api/leave/get/approval`, {
        method: 'GET',
        headers: getHeaders(),
    });
    return handleResponse(res);
  }
};