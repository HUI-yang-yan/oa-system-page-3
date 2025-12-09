import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'zh';

const translations = {
  en: {
    // General
    'oaSystem': 'OA System',
    'dashboard': 'Dashboard',
    'employees': 'Employees',
    'attendance': 'Attendance',
    'leaveRequests': 'Leave Requests',
    'signOut': 'Sign Out',
    'welcomeBack': 'Welcome Back',
    'signInToAccount': 'Sign in to your OA System account',
    'username': 'Username',
    'password': 'Password',
    'enterUsername': 'Enter your username',
    'enterPassword': 'Enter your password',
    'rememberMe': 'Remember me',
    'forgotPassword': 'Forgot password?',
    'signIn': 'Sign In',
    'noAccount': "Don't have an account?",
    'contactHR': 'Contact HR',
    'totalEmployees': 'Total Employees',
    'onLeave': 'On Leave',
    'attendanceAction': 'Attendance Action',
    'recordAttendance': 'Record your daily attendance',
    'currentSession': 'Current Session',
    'active': 'Active',
    'weeklyAttendance': 'Weekly Attendance Overview',
    'deptDistribution': 'Department Distribution',
    'employeeManagement': 'Employee Management',
    'addEmployee': 'Add Employee',
    'searchPlaceholder': 'Search by name or ID...',
    'applyFilter': 'Apply Filter',
    'name': 'Name',
    'position': 'Position',
    'email': 'Email',
    'status': 'Status',
    'actions': 'Actions',
    'showingRecords': 'Showing records',
    'applyForLeave': 'Apply for Leave',
    'leaveType': 'Leave Type',
    'startDate': 'Start Date',
    'endDate': 'End Date',
    'reason': 'Reason',
    'pleaseDescribe': 'Please describe...',
    'submitApplication': 'Submit Application',
    'applicationHistory': 'Application History',
    'duration': 'Duration',
    'details': 'Details',
    'sickLeave': 'Sick Leave',
    'annualLeave': 'Annual Leave',
    'personalLeave': 'Personal Leave',
    'approved': 'Approved',
    'pending': 'Pending',
    'welcomeMessage': 'Welcome back to your workspace overview.',
    'presentVsAbsent': 'Present vs Absent trends',
    'signInSuccess': 'Signed in successfully at',
    'signInFail': 'Failed to sign in',
    'signOutSuccess': 'Signed out successfully at',
    'signOutFail': 'Failed to sign out',
    'deleteConfirm': 'Are you sure you want to delete this employee?',
    'activeStatus': 'Active',
    'inactiveStatus': 'Inactive',
    'to': 'to',
    'leaveSubmitted': 'Leave application submitted!',
    'leaveFailed': 'Failed to submit leave application',
    'signInButton': 'Sign In',
    'signOutButton': 'Sign Out'
  },
  zh: {
    // General
    'oaSystem': 'OA 系统',
    'dashboard': '仪表盘',
    'employees': '员工管理',
    'attendance': '考勤记录',
    'leaveRequests': '请假申请',
    'signOut': '退出登录',
    'welcomeBack': '欢迎回来',
    'signInToAccount': '登录您的 OA 系统账号',
    'username': '用户名',
    'password': '密码',
    'enterUsername': '请输入用户名',
    'enterPassword': '请输入密码',
    'rememberMe': '记住我',
    'forgotPassword': '忘记密码？',
    'signIn': '登录',
    'noAccount': "还没有账号？",
    'contactHR': '联系人事',
    'totalEmployees': '员工总数',
    'onLeave': '休假中',
    'attendanceAction': '考勤打卡',
    'recordAttendance': '记录您的每日考勤',
    'currentSession': '当前会话',
    'active': '活跃',
    'weeklyAttendance': '每周考勤概览',
    'deptDistribution': '部门分布',
    'employeeManagement': '员工管理',
    'addEmployee': '添加员工',
    'searchPlaceholder': '搜索姓名或工号...',
    'applyFilter': '筛选',
    'name': '姓名',
    'position': '职位',
    'email': '邮箱',
    'status': '状态',
    'actions': '操作',
    'showingRecords': '显示记录',
    'applyForLeave': '申请请假',
    'leaveType': '请假类型',
    'startDate': '开始日期',
    'endDate': '结束日期',
    'reason': '理由',
    'pleaseDescribe': '请详细描述...',
    'submitApplication': '提交申请',
    'applicationHistory': '申请历史',
    'duration': '时长',
    'details': '详情',
    'sickLeave': '病假',
    'annualLeave': '年假',
    'personalLeave': '事假',
    'approved': '已批准',
    'pending': '待审批',
    'welcomeMessage': '欢迎回到您的工作空间。',
    'presentVsAbsent': '出勤与缺勤趋势',
    'signInSuccess': '签到成功，时间：',
    'signInFail': '签到失败',
    'signOutSuccess': '签退成功，时间：',
    'signOutFail': '签退失败',
    'deleteConfirm': '确定要删除该员工吗？',
    'activeStatus': '在职',
    'inactiveStatus': '离职',
    'to': '至',
    'leaveSubmitted': '请假申请已提交！',
    'leaveFailed': '请假申请提交失败',
    'signInButton': '签到',
    'signOutButton': '签退'
  }
};

export type TranslationKey = keyof typeof translations['en'];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('language') as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: TranslationKey) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};