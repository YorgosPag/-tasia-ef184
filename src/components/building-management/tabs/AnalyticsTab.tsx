'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Building } from '@/types/building';

export function AnalyticsTab({ building }: { building: Building }) {
  const [timeRange, setTimeRange] = useState<'1M' | '3M' | '6M' | '1Y'>('6M');
  const [analyticsView, setAnalyticsView] = useState<'overview' | 'financial' | 'progress' | 'comparison'>('overview');

  const costBreakdown = [
    { category: 'Υλικά', amount: 450000, percentage: 45, color: 'bg-blue-500' },
    { category: 'Εργατικά', amount: 300000, percentage: 30, color: 'bg-green-500' },
    { category: 'Μηχανήματα', amount: 150000, percentage: 15, color: 'bg-yellow-500' },
    { category: 'Άλλα', amount: 100000, percentage: 10, color: 'bg-purple-500' }
  ];

  const monthlyProgress = [
    { month: 'Ιαν', planned: 10, actual: 8, cost: 85000 },
    { month: 'Φεβ', planned: 20, actual: 18, cost: 92000 },
    { month: 'Μαρ', planned: 35, actual: 32, cost: 98000 },
    { month: 'Απρ', planned: 50, actual: 48, cost: 105000 },
    { month: 'Μάι', planned: 65, actual: 62, cost: 89000 },
    { month: 'Ιουν', planned: 80, actual: 75, cost: 94000 },
    { month: 'Ιουλ', planned: 90, actual: 85, cost: 87000 }
  ];

  const kpis = {
    costEfficiency: 92.5,
    timeEfficiency: 88.7,
    qualityScore: 95.2,
    riskLevel: 'Χαμηλός',
    roi: 15.8,
    profitMargin: 12.3
  };

  const getEfficiencyColor = (value: number) => {
    if (value >= 90) return 'text-green-600 bg-green-50';
    if (value >= 75) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Advanced Analytics</h3>
          <p className="text-sm text-muted-foreground">Προχωρημένη ανάλυση δεδομένων και KPIs</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value as any)} className="text-sm border border-gray-300 rounded px-3 py-1">
            <option value="1M">Τελευταίο μήνα</option>
            <option value="3M">Τελευταίους 3 μήνες</option>
            <option value="6M">Τελευταίους 6 μήνες</option>
            <option value="1Y">Τελευταίο έτος</option>
          </select>
          <Button variant="outline" size="sm">📊 Εξαγωγή Αναφοράς</Button>
        </div>
      </div>
      <div className="flex gap-2">
        {[{ id: 'overview', label: 'Επισκόπηση', icon: '📊' }, { id: 'financial', label: 'Οικονομικά', icon: '💰' }, { id: 'progress', label: 'Πρόοδος', icon: '📈' }, { id: 'comparison', label: 'Σύγκριση', icon: '⚖️' }].map((view) => (
          <Button key={view.id} variant={analyticsView === view.id ? 'default' : 'outline'} size="sm" onClick={() => setAnalyticsView(view.id as any)}>{view.icon} {view.label}</Button>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card><CardContent className="p-4"><div className="text-center"><div className="text-2xl font-bold text-blue-600">{kpis.costEfficiency}%</div><div className="text-xs text-muted-foreground">Κοστολογική Αποδοτικότητα</div><div className={`text-xs px-2 py-1 rounded mt-1 ${getEfficiencyColor(kpis.costEfficiency)}`}>{kpis.costEfficiency >= 90 ? 'Άριστα' : kpis.costEfficiency >= 75 ? 'Καλά' : 'Χρήζει βελτίωσης'}</div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-center"><div className="text-2xl font-bold text-green-600">{kpis.timeEfficiency}%</div><div className="text-xs text-muted-foreground">Χρονική Αποδοτικότητα</div><div className={`text-xs px-2 py-1 rounded mt-1 ${getEfficiencyColor(kpis.timeEfficiency)}`}>{kpis.timeEfficiency >= 90 ? 'Άριστα' : kpis.timeEfficiency >= 75 ? 'Καλά' : 'Χρήζει βελτίωσης'}</div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-center"><div className="text-2xl font-bold text-purple-600">{kpis.qualityScore}%</div><div className="text-xs text-muted-foreground">Δείκτης Ποιότητας</div><div className={`text-xs px-2 py-1 rounded mt-1 ${getEfficiencyColor(kpis.qualityScore)}`}>Εξαιρετικό</div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-center"><div className="text-2xl font-bold text-orange-600">{kpis.roi}%</div><div className="text-xs text-muted-foreground">ROI</div><div className="text-xs px-2 py-1 rounded mt-1 bg-green-50 text-green-600">Πάνω από στόχο</div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-center"><div className="text-2xl font-bold text-red-600">{kpis.profitMargin}%</div><div className="text-xs text-muted-foreground">Περιθώριο Κέρδους</div><div className="text-xs px-2 py-1 rounded mt-1 bg-green-50 text-green-600">Εντός στόχων</div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-center"><div className="text-2xl font-bold text-gray-600">{kpis.riskLevel}</div><div className="text-xs text-muted-foreground">Επίπεδο Κινδύνου</div><div className="text-xs px-2 py-1 rounded mt-1 bg-green-50 text-green-600">Υπό έλεγχο</div></div></CardContent></Card>
      </div>
      {analyticsView === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card><CardHeader><CardTitle>Ανάλυση Κόστους</CardTitle></CardHeader><CardContent><div className="space-y-4">{costBreakdown.map((item) => (<div key={item.category}><div className="flex items-center justify-between mb-2"><span className="text-sm font-medium">{item.category}</span><span className="text-sm text-muted-foreground">{item.amount.toLocaleString('el-GR')}€ ({item.percentage}%)</span></div><div className="w-full bg-gray-200 rounded-full h-3"><div className={`h-3 rounded-full ${item.color} transition-all duration-500`} style={{ width: `${item.percentage}%` }}></div></div></div>))}</div><div className="mt-6 p-4 bg-blue-50 rounded-lg"><div className="text-sm font-medium text-blue-900 mb-2">💡 Ανάλυση</div><p className="text-sm text-blue-700">Το κόστος υλικών είναι 5% υψηλότερο από τον μέσο όρο της αγοράς. Συνιστάται επαναδιαπραγμάτευση με προμηθευτές.</p></div></CardContent></Card>
          <Card><CardHeader><CardTitle>Πρόοδος vs Προγραμματισμός</CardTitle></CardHeader><CardContent><div className="space-y-4">{monthlyProgress.map((month) => (<div key={month.month} className="space-y-2"><div className="flex items-center justify-between"><span className="text-sm font-medium">{month.month}</span><span className="text-xs text-muted-foreground">Προγρ: {month.planned}% | Πραγμ: {month.actual}%</span></div><div className="relative"><div className="w-full bg-gray-200 rounded-full h-4"><div className="h-4 bg-blue-200 rounded-full" style={{ width: `${month.planned}%` }}></div><div className="absolute top-0 h-4 bg-blue-500 rounded-full" style={{ width: `${month.actual}%` }}></div></div><div className="absolute right-2 top-0 text-xs font-medium text-white">{month.actual}%</div></div></div>))}</div></CardContent></Card>
        </div>
      )}
    </div>
  );
}
