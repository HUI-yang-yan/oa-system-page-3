import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, Input, Button, Badge } from '../components/UI';
import { Search, Plus, Trash2, Edit2, Filter } from 'lucide-react';
import { api } from '../services/api';
import { UserDTO } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

const Employees = () => {
    const [workers, setWorkers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const { t } = useLanguage();
    
    // Initial fetch
    useEffect(() => {
        fetchWorkers();
    }, []);

    const fetchWorkers = async () => {
        setLoading(true);
        try {
            // Using default pagination params
            const res = await api.getWorkers({
                pageNum: 1,
                pageSize: 10,
                username: search || undefined
            });
            // Handle structure if data.data is array or wrapped
            if(res.data && Array.isArray(res.data)) {
                 setWorkers(res.data);
            } else if (res.data && (res.data as any).records) {
                 setWorkers((res.data as any).records);
            } else {
                // Fallback mock data if API fails or returns empty (for demo purposes)
                setWorkers([
                    { id: 1, realName: 'Alice Johnson', username: 'alice', position: 'Developer', departmentId: 101, status: 1, email: 'alice@oa.com' },
                    { id: 2, realName: 'Bob Smith', username: 'bob', position: 'Manager', departmentId: 102, status: 1, email: 'bob@oa.com' },
                    { id: 3, realName: 'Charlie Brown', username: 'charlie', position: 'Analyst', departmentId: 101, status: 0, email: 'charlie@oa.com' },
                ]);
            }
        } catch (e) {
            console.error("Failed to fetch", e);
             // Fallback mock data
             setWorkers([
                { id: 1, realName: 'Alice Johnson', username: 'alice', position: 'Developer', departmentId: 101, status: 1, email: 'alice@oa.com' },
                { id: 2, realName: 'Bob Smith', username: 'bob', position: 'Manager', departmentId: 102, status: 1, email: 'bob@oa.com' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if(confirm(t('deleteConfirm'))) {
            try {
                await api.deleteWorkers([id]);
                fetchWorkers();
            } catch (e) {
                alert('Failed to delete');
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-800">{t('employeeManagement')}</h1>
                <Button>
                    <Plus size={18} className="mr-2" />
                    {t('addEmployee')}
                </Button>
            </div>

            <Card>
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between bg-gray-50/50">
                    <div className="relative max-w-md w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder={t('searchPlaceholder')}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Button variant="secondary" onClick={fetchWorkers} isLoading={loading}>
                        <Filter size={18} className="mr-2" />
                        {t('applyFilter')}
                    </Button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4">{t('name')}</th>
                                <th className="px-6 py-4">{t('position')}</th>
                                <th className="px-6 py-4">{t('email')}</th>
                                <th className="px-6 py-4">{t('status')}</th>
                                <th className="px-6 py-4 text-right">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {workers.length > 0 ? (
                                workers.map((worker) => (
                                    <tr key={worker.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-3">
                                                    {worker.realName?.[0] || 'U'}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{worker.realName || worker.username}</p>
                                                    <p className="text-xs text-gray-500">ID: {worker.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{worker.position || 'N/A'}</td>
                                        <td className="px-6 py-4">{worker.email || 'N/A'}</td>
                                        <td className="px-6 py-4">
                                            <Badge color={worker.status === 1 ? 'green' : 'gray'}>
                                                {worker.status === 1 ? t('activeStatus') : t('inactiveStatus')}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button className="text-blue-600 hover:text-blue-800 p-1">
                                                <Edit2 size={16} />
                                            </button>
                                            <button 
                                                className="text-red-500 hover:text-red-700 p-1"
                                                onClick={() => handleDelete(worker.id)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        No employees found matching criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                 <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-sm text-gray-500">{t('showingRecords')} {workers.length}</span>
                    <div className="flex gap-2">
                         <Button variant="secondary" size="sm" disabled>Previous</Button>
                         <Button variant="secondary" size="sm" disabled>Next</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Employees;