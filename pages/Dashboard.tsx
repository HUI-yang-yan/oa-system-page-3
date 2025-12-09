import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, Button } from '../components/UI';
import { api } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Clock, CheckCircle, XCircle, Users, Briefcase } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState<{type: 'success'|'error', text: string} | null>(null);
    const { t } = useLanguage();

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Mock data for visualization since backend might not return stats data yet
    const attendanceData = [
        { name: 'Mon', present: 40, absent: 2 },
        { name: 'Tue', present: 38, absent: 4 },
        { name: 'Wed', present: 42, absent: 0 },
        { name: 'Thu', present: 41, absent: 1 },
        { name: 'Fri', present: 39, absent: 3 },
    ];

    const departmentData = [
        { name: 'Engineering', value: 12 },
        { name: 'HR', value: 4 },
        { name: 'Sales', value: 8 },
        { name: 'Marketing', value: 6 },
    ];

    const handleSignIn = async () => {
        setLoading(true);
        try {
            const res = await api.signIn();
            if (res.code === 1) {
                setMsg({ type: 'success', text: `${t('signInSuccess')} ${new Date().toLocaleTimeString()}` });
            } else {
                setMsg({ type: 'error', text: res.msg || t('signInFail') });
            }
        } catch (error) {
            setMsg({ type: 'error', text: t('signInFail') });
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        setLoading(true);
        try {
            const res = await api.signOut();
            if (res.code === 1) {
                setMsg({ type: 'success', text: `${t('signOutSuccess')} ${new Date().toLocaleTimeString()}` });
            } else {
                 setMsg({ type: 'error', text: res.msg || t('signOutFail') });
            }
        } catch (error) {
             setMsg({ type: 'error', text: t('signOutFail') });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{t('dashboard')}</h1>
                    <p className="text-gray-500">{t('welcomeMessage')}</p>
                </div>
                <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                    <Clock size={18} className="text-blue-500" />
                    <span className="font-mono font-medium text-gray-700">
                        {currentTime.toLocaleTimeString()}
                    </span>
                    <span className="text-gray-400 text-sm ml-2">
                        {currentTime.toLocaleDateString()}
                    </span>
                </div>
            </div>

            {msg && (
                <div className={`p-4 rounded-lg flex items-center ${msg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {msg.type === 'success' ? <CheckCircle size={20} className="mr-2"/> : <XCircle size={20} className="mr-2"/>}
                    {msg.text}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {/* Quick Stats Cards */}
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none">
                    <CardContent className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm">{t('totalEmployees')}</p>
                            <h3 className="text-3xl font-bold mt-1">42</h3>
                        </div>
                        <div className="bg-white/20 p-3 rounded-lg">
                            <Users size={24} className="text-white" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">{t('onLeave')}</p>
                            <h3 className="text-3xl font-bold mt-1 text-gray-800">3</h3>
                        </div>
                         <div className="bg-orange-100 p-3 rounded-lg">
                            <Briefcase size={24} className="text-orange-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                     <CardContent className="flex items-center justify-between h-full">
                        <div>
                             <h3 className="font-semibold text-gray-800">{t('attendanceAction')}</h3>
                             <p className="text-sm text-gray-500 mb-4">{t('recordAttendance')}</p>
                             <div className="flex gap-4">
                                <Button onClick={handleSignIn} disabled={loading} className="bg-green-600 hover:bg-green-700">
                                    {t('signInButton')}
                                </Button>
                                <Button onClick={handleSignOut} disabled={loading} variant="danger">
                                    {t('signOutButton')}
                                </Button>
                             </div>
                        </div>
                        <div className="hidden lg:block text-right">
                             <p className="text-xs text-gray-400">{t('currentSession')}</p>
                             <p className="font-mono text-xl text-green-600">{t('active')}</p>
                        </div>
                     </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader title={t('weeklyAttendance')} subtitle={t('presentVsAbsent')} />
                    <CardContent className="h-80">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={attendanceData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Bar dataKey="present" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="absent" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader title={t('deptDistribution')} />
                    <CardContent className="h-80">
                         <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={departmentData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {departmentData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex justify-center flex-wrap gap-2 mt-4">
                            {departmentData.map((entry, index) => (
                                <div key={entry.name} className="flex items-center text-xs text-gray-600">
                                    <span className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                                    {entry.name}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;