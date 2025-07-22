
'use client';

import React, { Fragment } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  href: string;
  label: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * A reusable component for displaying breadcrumb navigation.
 * It takes an array of items and renders them as links with separators.
 */
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('hidden md:block', className)}>
      <ol className="flex items-center space-x-1 text-sm text-muted-foreground">
        {items.map((item, index) => (
          <Fragment key={item.href}>
            <li>
              <Link
                href={item.href}
                className={cn(
                  'transition-colors hover:text-foreground',
                  index === items.length - 1 ? 'font-medium text-foreground pointer-events-none' : ''
                )}
                aria-current={index === items.length - 1 ? 'page' : undefined}
              >
                {item.label}
              </Link>
            </li>
            {index < items.length - 1 && (
              <li>
                <ChevronRight className="h-4 w-4" />
              </li>
            )}
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
