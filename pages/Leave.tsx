import React, { useState } from 'react';
import { Card, CardHeader, CardContent, Input, Button, Badge } from '../components/UI';
import { api } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

const Leave = () => {
    const [formData, setFormData] = useState({
        type: '1',
        startTime: '',
        endTime: '',
        reason: ''
    });

    const [loading, setLoading] = useState(false);
    const { t } = useLanguage();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.addLeave({
                leaveTypeId: parseInt(formData.type),
                startTime: formData.startTime,
                endTime: formData.endTime,
                reason: formData.reason
            });
            
            if (res.code == 1) {
                alert(t('leaveSubmitted'));
                setFormData({ type: '1', startTime: '', endTime: '', reason: '' });
            } else {
                alert(res.msg || t('leaveFailed'));
            }
        } catch (error) {
            alert(t('leaveFailed'));
        } finally {
            setLoading(false);
        }
    };

    // Mock history data
    const history = [
        { id: 101, type: 'sickLeave', start: '2023-10-01', end: '2023-10-02', status: 'approved' },
        { id: 102, type: 'annualLeave', start: '2023-11-15', end: '2023-11-20', status: 'pending' },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
                <Card>
                    <CardHeader title={t('applyForLeave')} />
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('leaveType')}</label>
                                <select 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    value={formData.type}
                                    onChange={e => setFormData({...formData, type: e.target.value})}
                                >
                                    <option value="1">{t('sickLeave')}</option>
                                    <option value="2">{t('annualLeave')}</option>
                                    <option value="3">{t('personalLeave')}</option>
                                </select>
                            </div>
                            
                            <Input 
                                type="date" 
                                label={t('startDate')}
                                value={formData.startTime}
                                onChange={e => setFormData({...formData, startTime: e.target.value})}
                                required
                            />
                             <Input 
                                type="date" 
                                label={t('endDate')}
                                value={formData.endTime}
                                onChange={e => setFormData({...formData, endTime: e.target.value})}
                                required
                            />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('reason')}</label>
                                <textarea 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    rows={4}
                                    value={formData.reason}
                                    onChange={e => setFormData({...formData, reason: e.target.value})}
                                    placeholder={t('pleaseDescribe')}
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full" isLoading={loading}>
                                {t('submitApplication')}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>

            <div className="lg:col-span-2">
                <Card className="h-full">
                    <CardHeader title={t('applicationHistory')} />
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-700 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3">{t('leaveType')}</th>
                                    <th className="px-6 py-3">{t('duration')}</th>
                                    <th className="px-6 py-3">{t('status')}</th>
                                    <th className="px-6 py-3 text-right">{t('actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {history.map(item => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 font-medium">
                                            {/* @ts-ignore dynamic key lookup */}
                                            {t(item.type)}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {item.start} <span className="mx-1">{t('to')}</span> {item.end}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge color={item.status === 'approved' ? 'green' : 'yellow'}>
                                                {/* @ts-ignore dynamic key lookup */}
                                                {t(item.status)}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button variant="ghost" size="sm">{t('details')}</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Leave;