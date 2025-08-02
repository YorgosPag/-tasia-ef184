'use client';

import React from 'react';
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HelpCircle, Minus, Plus, Save, FileText } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

function ToolbarButton({ tooltip, children, onClick, className }: { tooltip: string, children: React.ReactNode, onClick?: () => void, className?: string }) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className={cn("h-7 w-7", className)} onClick={onClick}>
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    )
}

const ProjectsToolbar = () => {
    return (
        <TooltipProvider>
            <div className="p-1.5 border-b flex items-center gap-1">
                <ToolbarButton tooltip="Νέα Εγγραφή" className="text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400">
                    <Plus className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton tooltip="Διαγραφή" className="text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400">
                    <Minus className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton tooltip="Αποθήκευση">
                    <Save className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton tooltip="Βοήθεια">
                    <HelpCircle className="w-4 h-4" />
                </ToolbarButton>
            </div>
        </TooltipProvider>
    );
}


type Project = {
    id: number;
    name: string;
};

interface ProjectsListProps {
    projects: Project[];
    selectedProject: Project;
    onSelectProject?: (project: Project) => void;
}

export function ProjectsList({ projects, selectedProject, onSelectProject }: ProjectsListProps) {
    return (
        <div className="w-[350px] bg-card border rounded-lg flex flex-col shrink-0">
            <div className="p-2 border-b space-y-2">
                <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    <h3 className="text-sm font-semibold">Έργα</h3>
                </div>
                <div className="space-y-1">
                    <Label htmlFor="company-filter" className="text-xs">Εταιρεία</Label>
                    <Select defaultValue="pagonis-nest">
                        <SelectTrigger id="company-filter" className="h-8 text-xs">
                            <SelectValue placeholder="Επιλογή Εταιρείας" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pagonis-nest">ΠΑΓΩΝΗΣ ΝΕΣΤ. ΓΕΩΡΓΙΟΣ</SelectItem>
                            {/* Add other companies here */}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <ProjectsToolbar />
            <ScrollArea className="flex-1">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="px-2">Τίτλος</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {projects.map((project) => (
                            <TableRow 
                                key={project.id} 
                                className={cn("cursor-pointer", selectedProject.id === project.id ? "bg-primary text-primary-foreground hover:bg-primary/90" : "hover:bg-accent")}
                                onClick={() => onSelectProject?.(project)}
                            >
                                <TableCell className="font-medium py-1.5 px-2 text-xs">{project.name}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </ScrollArea>
        </div>
    );
}