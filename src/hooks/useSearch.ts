"use client";

import { useState, useMemo } from 'react';
import { Prompt } from '@/types/prompt';
import { CommandCode } from '@/types/commandCode';

export function useSearch<T extends Prompt | CommandCode>(items: T[], searchableFields: (keyof T)[]) {
    const [query, setQuery] = useState("");

    const filteredResults = useMemo(() => {
        if (!query.trim()) return items;

        const lowerQuery = query.toLowerCase();
        return items.filter(item => {
            return searchableFields.some(field => {
                const value = item[field];
                if (typeof value === 'string') {
                    return value.toLowerCase().includes(lowerQuery);
                }
                if (Array.isArray(value)) {
                    return value.some(v => typeof v === 'string' && v.toLowerCase().includes(lowerQuery));
                }
                return false;
            });
        });
    }, [items, query, searchableFields]);

    return {
        query,
        setQuery,
        filteredResults
    };
}
