
'use client';

import React, { Fragment } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';


export interface BreadcrumbItem {
  href: string;
  label: string;
  tooltip?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * A reusable component for displaying breadcrumb navigation.
 * It takes an array of items and renders them as links with separators and tooltips.
 */
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <TooltipProvider>
      <nav aria-label="Breadcrumb" className={cn('hidden md:block', className)}>
        <ol className="flex items-center space-x-1 text-sm text-muted-foreground">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <Fragment key={`${item.href}-${item.label}`}>
                <li>
                  {isLast ? (
                    <span
                      className="font-medium text-foreground"
                      aria-current="page"
                    >
                      {item.label}
                    </span>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href={item.href}
                          className="transition-colors hover:text-foreground"
                        >
                          {item.label}
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{item.tooltip || `Μετάβαση σε ${item.label}`}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </li>
                {!isLast && (
                  <li>
                    <ChevronRight className="h-4 w-4" />
                  </li>
                )}
              </Fragment>
            );
          })}
        </ol>
      </nav>
    </TooltipProvider>
  );
}
