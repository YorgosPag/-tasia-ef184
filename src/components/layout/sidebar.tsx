'use client';

import { useState } from 'react';
import {
  Building2, Briefcase, Layers, LayoutTemplate, Paperclip, ChevronRight, ChevronDown, Home
} from 'lucide-react';
import Link from 'next/link';

type Entity = {
  id: string;
  name: string;
  children?: Entity[];
};

// Mock hierarchical data – replace with real Firestore fetches!
const companies: Entity[] = [
  {
    id: 'c1', name: 'DevConstruct',
    children: [
      {
        id: 'p1', name: 'Athens Revival',
        children: [
          {
            id: 'b1', name: 'Πατησίων 100',
            children: [
              {
                id: 'f1', name: '1ος Όροφος',
                children: [
                  {
                    id: 'u1', name: 'Διαμέρισμα Α1',
                    children: [
                      { id: 'att1', name: 'Parking Υπόγειο #1' },
                      { id: 'att2', name: 'Αποθήκη #2' },
                    ]
                  },
                  {
                    id: 'u2', name: 'Μεζονέτα Β1'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];

const LEVEL_ICONS = [
  Building2,        // Εταιρεία
  Briefcase,        // Έργο
  LayoutTemplate,   // Κτίριο
  Layers,           // Όροφος
  Home,             // Ακίνητο
  Paperclip,        // Παρακολούθημα
];

type Breadcrumb = { id: string; name: string; level: number };

export default function HierarchySidebar() {
  const [expanded, setExpanded] = useState<{[key: string]: boolean}>({});
  const [breadcrumb, setBreadcrumb] = useState<Breadcrumb[]>([]);

  // Helper: renders recursively each level
  function renderEntities(entities: Entity[], level = 0, parentTrail: Breadcrumb[] = []) {
    return (
      <ul className={`pl-${level * 2}`}>
        {entities.map(entity => {
          const Icon = LEVEL_ICONS[level] ?? Home;
          const hasChildren = entity.children && entity.children.length > 0;
          const isOpen = expanded[entity.id] || false;

          return (
            <li key={entity.id} className="mb-1">
              <div className="flex items-center gap-1">
                {hasChildren ? (
                  <button
                    className="focus:outline-none"
                    onClick={() => setExpanded(e => ({...e, [entity.id]: !isOpen}))}
                  >
                    {isOpen ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}
                  </button>
                ) : <span className="w-4" />}
                <Icon className="w-4 h-4 text-muted-foreground mr-1" />
                <button
                  className="text-left text-sm hover:text-primary transition"
                  onClick={() => setBreadcrumb([...parentTrail, { id: entity.id, name: entity.name, level }])}
                >
                  {entity.name}
                </button>
              </div>
              {hasChildren && isOpen && (
                renderEntities(entity.children!, level + 1, [...parentTrail, { id: entity.id, name: entity.name, level }])
              )}
            </li>
          );
        })}
      </ul>
    );
  }

  // Breadcrumb UI
  function Breadcrumbs() {
    if (breadcrumb.length === 0) return null;
    return (
      <nav className="mb-2 flex items-center text-xs text-muted-foreground">
        {breadcrumb.map((b, i) => (
          <span key={b.id} className="flex items-center">
            <span
              className="hover:underline cursor-pointer"
              onClick={() => setBreadcrumb(breadcrumb.slice(0, i+1))}
            >{b.name}</span>
            {i < breadcrumb.length - 1 && <ChevronRight size={12} className="mx-1" />}
          </span>
        ))}
      </nav>
    );
  }

  return (
    <aside className="w-72 bg-background border-r min-h-screen p-4">
      <h2 className="text-lg font-bold mb-4">Ιεραρχία</h2>
      <Breadcrumbs />
      {renderEntities(companies)}
      {/* Place other sections (Κατασκευή, Leads, Admin...) BELOW this, NOT inside! */}
      <div className="mt-8">
        {/* Add your general menu here */}
        {/* Example:
        <Link href="/leads" className="block mt-4">Leads</Link>
        */}
      </div>
    </aside>
  );
}
