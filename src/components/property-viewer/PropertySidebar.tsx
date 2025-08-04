"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { PropertyList } from "./PropertyList";

interface Property {
    id: string;
    name: string;
    type: string;
    building: string;
    floor: number;
    status: 'for-sale' | 'for-rent' | 'sold' | 'rented' | 'reserved';
    price?: number;
    area?: number;
    project: string;
    description?: string;
}

interface PropertySidebarProps {
    inputValue: string;
    handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    properties: Property[];
    selectedProperty: string | null;
    onSelectProperty: (propertyId: string) => void;
    isLoading: boolean;
}

export function PropertySidebar({
    inputValue,
    handleSearchChange,
    properties,
    selectedProperty,
    onSelectProperty,
    isLoading,
}: PropertySidebarProps) {
    return (
        <div className="col-span-2">
            <Card className="h-full flex flex-col">
                <CardHeader className="pb-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Αναζήτηση..."
                            className="pl-9 h-9"
                            value={inputValue}
                            onChange={handleSearchChange}
                        />
                    </div>
                </CardHeader>
                <CardContent className="flex-1 p-0 overflow-hidden">
                    <PropertyList
                        properties={properties}
                        selectedPropertyId={selectedProperty}
                        onSelectProperty={onSelectProperty}
                        isLoading={isLoading}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
