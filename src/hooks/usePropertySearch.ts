"use client";

import { useState, useMemo, useEffect, useTransition } from "react";

interface Property {
    id: string;
    name: string;
    type: string;
    building: string;
    floor: number;
}

export function usePropertySearch(
    properties: Property[],
    selectedProperty: string | null,
    setSelectedProperty: (id: string | null) => void
) {
    const [searchQuery, setSearchQuery] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [isPending, startTransition] = useTransition();

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        startTransition(() => {
            setSearchQuery(value);
        });
    };

    const filteredProperties = useMemo(() => {
        if (!properties) return [];
        return properties.filter((property) => {
            const query = searchQuery.toLowerCase();
            return (
                (property.name && property.name.toLowerCase().includes(query)) ||
                (property.type && property.type.toLowerCase().includes(query)) ||
                (property.building && property.building.toLowerCase().includes(query)) ||
                (property.floor && property.floor.toString().includes(query))
            );
        });
    }, [properties, searchQuery]);

    useEffect(() => {
        if (filteredProperties.length > 0 && !selectedProperty) {
            setSelectedProperty(filteredProperties[0].id);
        } else if (
            selectedProperty &&
            !filteredProperties.find((p) => p.id === selectedProperty)
        ) {
            setSelectedProperty(filteredProperties.length > 0 ? filteredProperties[0].id : null);
        } else if (filteredProperties.length === 0) {
            setSelectedProperty(null);
        }
    }, [filteredProperties, selectedProperty, setSelectedProperty]);


    return {
        inputValue,
        handleSearchChange,
        filteredProperties,
        isPending
    }
}
