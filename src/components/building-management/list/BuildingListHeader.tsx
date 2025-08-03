'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { Building2, DollarSign, TrendingUp } from 'lucide-react';
import type { Building } from '@/types/building';

interface BuildingListHeaderProps {
  buildings: Building[];
  sortBy: 'name' | 'progress' | 'value' | 'area';
  setSortBy: React.Dispatch<React.SetStateAction<'name' | 'progress' | 'value' | 'area'>>;
  sortOrder: 'asc' | 'desc';
  setSortOrder: React.Dispatch<React.SetStateAction<'asc' | 'desc'>>;
}

export function BuildingListHeader({
    buildings,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder
}: BuildingListHeaderProps) {
    const stats = {
        totalBuildings: buildings.length,
        activeProjects: buildings.filter(b => b.status === 'active' || b.status === 'construction').length,
        totalValue: buildings.reduce((sum, b) => sum + b.totalValue, 0),
    };

    return (
        <div className="p-4 border-b">
            <div className="flex items-center gap-3 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
                    <Building2 className="w-4 h-4" />
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-foreground">Κτίρια</h3>
                    <p className="text-xs text-muted-foreground">
                        {buildings.length} κτίρια συνολικά
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-muted/50 rounded-lg p-3 border">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <div>
                            <p className="text-xs text-muted-foreground">Ενεργά</p>
                            <p className="text-sm font-semibold">
                                {stats.activeProjects}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 border">
                    <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-blue-500" />
                        <div>
                            <p className="text-xs text-muted-foreground">Αξία</p>
                            <p className="text-sm font-semibold">
                                €{(stats.totalValue / 1000000).toFixed(1)}M
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="text-xs px-2 py-1 rounded border bg-background h-7"
                >
                    <option value="name">Όνομα</option>
                    <option value="progress">Πρόοδος</option>
                    <option value="value">Αξία</option>
                    <option value="area">Επιφάνεια</option>
                </select>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="text-xs h-7"
                >
                    {sortOrder === 'asc' ? '↑' : '↓'}
                </Button>
            </div>
        </div>
    );
}
