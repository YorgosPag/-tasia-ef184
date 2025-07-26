'use client';

import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs, orderBy, DocumentData } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, Briefcase, Building, Layers, LayoutTemplate, Paperclip, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { cn } from '@/shared/lib/utils';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";

// --- Type Definitions ---
type NodeType = 'company' | 'project' | 'building' | 'floor' | 'unit' | 'attachment';

interface HierarchyNode {
  id: string;
  name: string;
  type: NodeType;
  children: HierarchyNode[];
  isLoading: boolean;
  parentId?: string;
}

// --- Utility: Get Href from Type ---
const getHref = (type: NodeType, id: string): string => {
  if (!id || !type) return '/'; // fallback
  
  const paths: Record<NodeType, string> = {
    company: `/projects?companyId=${id}`,
    project: `/projects/${id}`,
    building: `/buildings/${id}`,
    floor: `/floors/${id}`,
    unit: `/units/${id}`,
    attachment: `/attachments?id=${id}`, // special case
  };

  return paths[type] ?? '/';
};

// --- Data Fetching ---
const fetchChildren = async (parentId: string, parentType: NodeType): Promise<DocumentData[]> => {
  let q;

  switch (parentType) {
    case 'company':
      q = query(collection(db, 'projects'), where('companyId', '==', parentId), orderBy('title'));
      break;
    case 'project':
      q = query(collection(db, 'buildings'), where('projectId', '==', parentId), orderBy('address'));
      break;
    case 'building':
      q = query(collection(db, 'floors'), where('buildingId', '==', parentId), orderBy('level'));
      break;
    case 'floor':
      q = query(collection(db, 'units'), where('floorIds', 'array-contains', parentId), orderBy('identifier'));
      break;
    case 'unit':
      q = query(collection(db, 'attachments'), where('unitId', '==', parentId), orderBy('type'));
      break;
    default:
      return [];
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// --- Mapper: DocumentData to HierarchyNode ---
const mapToNode = (item: DocumentData, type: NodeType): HierarchyNode => {
  let name = 'Unknown';

  switch (type) {
    case 'company':
      name = item.name || 'Untitled Company';
      break;
    case 'project':
      name = item.title || 'Untitled Project';
      break;
    case 'building':
      name = item.address || 'Untitled Building';
      break;
    case 'floor':
      name = `Όροφος ${item.level || 'N/A'}`;
      break;
    case 'unit':
      name = `${item.identifier || 'ID?'} - ${item.name || 'Untitled Unit'}`;
      break;
    case 'attachment':
      name = `${item.type}: ${item.identifier || item.details || 'Details missing'}`;
      break;
  }

  return {
    id: item.id,
    name,
    type,
    children: [],
    isLoading: false,
    parentId: item.parentId || undefined,
  };
};

// --- Node Component ---
const HierarchyNodeComponent = ({ node }: { node: HierarchyNode }) => {
  const pathname = usePathname();
  const [children, setChildren] = useState<HierarchyNode[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loadChildren = useCallback(async () => {
    if (children.length > 0) return;

    setIsLoading(true);

    const nextTypeMap: Record<NodeType, NodeType | null> = {
      company: 'project',
      project: 'building',
      building: 'floor',
      floor: 'unit',
      unit: 'attachment',
      attachment: null,
    };

    const childType = nextTypeMap[node.type];
    if (!childType) {
      setIsLoading(false);
      return;
    }

    const fetched = await fetchChildren(node.id, node.type);
    setChildren(fetched.map(item => mapToNode(item, childType)));
    setIsLoading(false);
  }, [node.id, node.type, children.length]);

  const onToggle = async () => {
    const nextOpen = !isOpen;
    setIsOpen(nextOpen);
    if (nextOpen && children.length === 0) {
      await loadChildren();
    }
  };

  useEffect(() => {
    if (pathname.includes(node.id)) {
      setIsOpen(true);
      loadChildren();
    }
  }, [pathname, node.id, loadChildren]);

  const iconMap: Record<NodeType, React.ElementType> = {
    company: Building2,
    project: Briefcase,
    building: Building,
    floor: Layers,
    unit: LayoutTemplate,
    attachment: Paperclip,
  };

  const Icon = iconMap[node.type];
  const isActive = pathname.includes(node.id);
  const href = getHref(node.type, node.id);

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle} className="w-full">
      <div className={cn("flex items-center gap-1.5 w-full pr-2 rounded-md", isActive && "bg-accent/50")}>
        <Link href={href} className="flex-1">
          <div className="flex items-center gap-2 p-2 text-sm hover:bg-accent/80 rounded-md">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{node.name}</span>
          </div>
        </Link>
        {['company', 'project', 'building', 'floor'].includes(node.type) && (
          <CollapsibleTrigger asChild>
            <button className="p-1 rounded-md hover:bg-accent/80">
              <ChevronRight className={cn("h-4 w-4 transition-transform", isOpen && "rotate-90")} />
            </button>
          </CollapsibleTrigger>
        )}
      </div>
      <CollapsibleContent>
        <div className="pl-4 border-l-2 border-muted-foreground/20 ml-3">
          {isLoading && <div className="p-2"><Skeleton className="h-6 w-3/4" /></div>}
          {!isLoading && children.map(child => (
            <HierarchyNodeComponent key={child.id} node={child} />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

// --- Main Sidebar Component ---
export const HierarchySidebar = () => {
  const [companies, setCompanies] = useState<HierarchyNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      const q = query(collection(db, 'companies'), orderBy('name'));
      const snapshot = await getDocs(q);
      const mapped = snapshot.docs.map(doc => mapToNode({ id: doc.id, ...doc.data() }, 'company'));
      setCompanies(mapped);
      setIsLoading(false);
    };
    fetchInitialData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-2 px-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  return (
    <div className="px-2">
      {companies.map(company => (
        <HierarchyNodeComponent key={company.id} node={company} />
      ))}
    </div>
  );
};
