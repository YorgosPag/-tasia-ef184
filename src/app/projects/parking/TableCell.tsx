
'use client';

import React from 'react';

interface TableCellProps {
  children: React.ReactNode;
}

export const TableCell = ({ children }: TableCellProps) => (
  <div
    className="p-1 h-full flex items-center overflow-hidden text-ellipsis whitespace-nowrap"
  >
    {children}
  </div>
);
