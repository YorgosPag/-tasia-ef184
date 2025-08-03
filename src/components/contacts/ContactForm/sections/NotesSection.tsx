"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Bell, 
  Calendar, 
  User, 
  Building, 
  FileText, 
  Send, 
  CheckCircle,
  AlertCircle,
  Clock,
  Trash2,
  Edit,
  MessageCircle,
  Users,
  Mail,
  Phone
} from "lucide-react";
import { ContactFormProps } from "../types";

interface Note {
  id: string;
  title: string;
  content: string;
  type: 'note' | 'reminder' | 'task' | 'meeting' | 'communication';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'active' | 'completed' | 'cancelled';
  assignedTo: string[];
  dueDate?: string;
  projectId?: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

interface Project {
  id: string;
  name: string;
  status: 'planning' | 'active' | 'completed' | 'paused';
}

interface Contact {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
}

export function NotesSection({ form }: Pick<ContactFormProps, "form">) {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Συνάντηση με αρχιτέκτονα για σχέδια',
      content: 'Συζήτηση για τις τελικές αλλαγές στα σχέδια του κτιρίου. Χρειάζεται έγκριση για την αλλαγή του υλικού στην πρόσοψη.',
      type: 'meeting',
      priority: 'high',
      status: 'active',
      assignedTo: ['arch-001', 'pm-001'],
      dueDate: '2025-08-10',
      projectId: 'proj-001',
      createdAt: '2025-08-01',
      updatedAt: '2025-08-01',
      tags: ['αρχιτεκτονική', 'σχέδια', 'έγκριση']
    },
    {
      id: '2',
      title: 'Παραγγελία υλικών - Τσιμέντο',
      content: 'Παραγγελία 500 σάκων τσιμέντο για το θεμέλιο. Προμηθευτής: Lafarge Hellas. Εκτιμώμενη παράδοση: 15/08/2025',
      type: 'task',
      priority: 'urgent',
      status: 'active',
      assignedTo: ['procurement-001'],
      dueDate: '2025-08-08',
      projectId: 'proj-001',
      createdAt: '2025-08-02',
      updatedAt: '2025-08-02',
      tags: ['υλικά', 'τσιμέντο', 'προμήθειες']
    }
  ]);

  const [projects] = useState<Project[]>([
    { id: 'proj-001', name: 'Οικοδομή Κολωνάκι', status: 'active' },
    { id: 'proj-002', name: 'Ανακαίνιση Γραφείων', status: 'planning' },
    { id: 'proj-003', name: 'Εργοστάσιο Θεσσαλονίκης', status: 'active' }
  ]);

  const [contacts] = useState<Contact[]>([
    { id: 'arch-001', name: 'Μαρία Παπαδοπούλου', role: 'Αρχιτέκτονας', email: 'maria@arch.gr', phone: '2101234567' },
    { id: 'pm-001', name: 'Γιάννης Κώστου', role: 'Project Manager', email: 'giannis@company.gr', phone: '2107654321' },
    { id: 'procurement-001', name: 'Άννα Σπύρου', role: 'Προμήθειες', email: 'anna@company.gr', phone: '2103456789' }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    type: 'note' as Note['type'],
    priority: 'medium' as Note['priority'],
    assignedTo: [] as string[],
    dueDate: '',
    projectId: '',
    tags: [] as string[],
    tagInput: ''
  });

  const handleAddNote = () => {
    if (!newNote.title.trim()) return;
    
    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      type: newNote.type,
      priority: newNote.priority,
      status: 'active',
      assignedTo: newNote.assignedTo,
      dueDate: newNote.dueDate || undefined,
      projectId: newNote.projectId || undefined,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      tags: newNote.tags
    };

    setNotes([note, ...notes]);
    setNewNote({
      title: '',
      content: '',
      type: 'note',
      priority: 'medium',
      assignedTo: [],
      dueDate: '',
      projectId: '',
      tags: [],
      tagInput: ''
    });
    setShowForm(false);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    setNotes(notes.map(note => 
      note.id === id 
        ? { ...note, status: note.status === 'completed' ? 'active' : 'completed' as Note['status'] }
        : note
    ));
  };

  const addTag = () => {
    if (newNote.tagInput.trim() && !newNote.tags.includes(newNote.tagInput.trim())) {
      setNewNote({
        ...newNote,
        tags: [...newNote.tags, newNote.tagInput.trim()],
        tagInput: ''
      });
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewNote({
      ...newNote,
      tags: newNote.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const filteredNotes = notes.filter(note => {
    if (filterType !== 'all' && note.type !== filterType) return false;
    if (filterPriority !== 'all' && note.priority !== filterPriority) return false;
    if (filterStatus !== 'all' && note.status !== filterStatus) return false;
    return true;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'reminder': return <Bell className="w-4 h-4" />;
      case 'task': return <CheckCircle className="w-4 h-4" />;
      case 'meeting': return <Calendar className="w-4 h-4" />;
      case 'communication': return <MessageCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getContactName = (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId);
    return contact ? contact.name : contactId;
  };

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : projectId;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">CRM Σημειώσεων - Εργολαβική Εταιρεία</h1>
          <p className="text-gray-600 mt-2">Διαχείριση σημειώσεων, tasks, υπενθυμίσεων και επικοινωνίας για έργα</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Νέα Σημείωση
        </Button>
      </div>

      {/* Φίλτρα */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Τύπος</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Όλα</SelectItem>
                  <SelectItem value="note">Σημείωση</SelectItem>
                  <SelectItem value="task">Εργασία</SelectItem>
                  <SelectItem value="reminder">Υπενθύμιση</SelectItem>
                  <SelectItem value="meeting">Συνάντηση</SelectItem>
                  <SelectItem value="communication">Επικοινωνία</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Προτεραιότητα</label>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Όλες</SelectItem>
                  <SelectItem value="urgent">Επείγον</SelectItem>
                  <SelectItem value="high">Υψηλή</SelectItem>
                  <SelectItem value="medium">Μεσαία</SelectItem>
                  <SelectItem value="low">Χαμηλή</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Κατάσταση</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Όλες</SelectItem>
                  <SelectItem value="active">Ενεργό</SelectItem>
                  <SelectItem value="completed">Ολοκληρωμένο</SelectItem>
                  <SelectItem value="cancelled">Ακυρωμένο</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Φόρμα νέας σημείωσης */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Νέα Σημείωση</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Τίτλος</label>
                <Input
                  value={newNote.title}
                  onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                  placeholder="Εισάγετε τίτλο σημείωσης..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Τύπος</label>
                <Select value={newNote.type} onValueChange={(value) => setNewNote({...newNote, type: value as Note['type']})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="note">Σημείωση</SelectItem>
                    <SelectItem value="task">Εργασία</SelectItem>
                    <SelectItem value="reminder">Υπενθύμιση</SelectItem>
                    <SelectItem value="meeting">Συνάντηση</SelectItem>
                    <SelectItem value="communication">Επικοινωνία</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Περιεχόμενο</label>
              <Textarea
                value={newNote.content}
                onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                placeholder="Περιγραφή της σημείωσης..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Προτεραιότητα</label>
                <Select value={newNote.priority} onValueChange={(value) => setNewNote({...newNote, priority: value as Note['priority']})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Χαμηλή</SelectItem>
                    <SelectItem value="medium">Μεσαία</SelectItem>
                    <SelectItem value="high">Υψηλή</SelectItem>
                    <SelectItem value="urgent">Επείγον</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Έργο</label>
                <Select value={newNote.projectId} onValueChange={(value) => setNewNote({...newNote, projectId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Επιλέξτε έργο" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map(project => (
                      <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Ημερομηνία λήξης</label>
                <Input
                  type="date"
                  value={newNote.dueDate}
                  onChange={(e) => setNewNote({...newNote, dueDate: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Ανάθεση σε</label>
              <Select value="" onValueChange={(value) => {
                if (!newNote.assignedTo.includes(value)) {
                  setNewNote({...newNote, assignedTo: [...newNote.assignedTo, value]});
                }
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Επιλέξτε άτομο" />
                </SelectTrigger>
                <SelectContent>
                  {contacts.map(contact => (
                    <SelectItem key={contact.id} value={contact.id}>{contact.name} - {contact.role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {newNote.assignedTo.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {newNote.assignedTo.map(contactId => (
                    <Badge key={contactId} variant="secondary" className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {getContactName(contactId)}
                      <button
                        onClick={() => setNewNote({
                          ...newNote,
                          assignedTo: newNote.assignedTo.filter(id => id !== contactId)
                        })}
                        className="ml-1 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newNote.tagInput}
                  onChange={(e) => setNewNote({...newNote, tagInput: e.target.value})}
                  placeholder="Προσθήκη tag..."
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                />
                <Button type="button" onClick={addTag} variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {newNote.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {newNote.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="flex items-center gap-1">
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddNote} className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Αποθήκευση
              </Button>
              <Button onClick={() => setShowForm(false)} variant="outline">
                Ακύρωση
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Λίστα σημειώσεων */}
      <div className="space-y-4">
        {filteredNotes.map(note => (
          <Card key={note.id} className={`${note.status === 'completed' ? 'opacity-60' : ''}`}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  {getTypeIcon(note.type)}
                  <h3 className={`text-lg font-semibold ${note.status === 'completed' ? 'line-through' : ''}`}>
                    {note.title}
                  </h3>
                  <div className={`w-3 h-3 rounded-full ${getPriorityColor(note.priority)}`}></div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleStatus(note.id)}
                  >
                    {note.status === 'completed' ? (
                      <Clock className="w-4 h-4" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteNote(note.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{note.content}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                {note.projectId && (
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-gray-500" />
                    <span>{getProjectName(note.projectId)}</span>
                  </div>
                )}
                
                {note.dueDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>{new Date(note.dueDate).toLocaleDateString('el-GR')}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {note.type === 'note' && 'Σημείωση'}
                    {note.type === 'task' && 'Εργασία'}
                    {note.type === 'reminder' && 'Υπενθύμιση'}
                    {note.type === 'meeting' && 'Συνάντηση'}
                    {note.type === 'communication' && 'Επικοινωνία'}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className={`text-xs ${getPriorityColor(note.priority)} text-white`}>
                    {note.priority === 'urgent' && 'Επείγον'}
                    {note.priority === 'high' && 'Υψηλή'}
                    {note.priority === 'medium' && 'Μεσαία'}
                    {note.priority === 'low' && 'Χαμηλή'}
                  </Badge>
                </div>
              </div>

              {note.assignedTo.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">Ανατέθηκε σε:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {note.assignedTo.map(contactId => {
                      const contact = contacts.find(c => c.id === contactId);
                      return (
                        <div key={contactId} className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1">
                          <User className="w-3 h-3" />
                          <span className="text-sm">{contact?.name}</span>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                              <Mail className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                              <Phone className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {note.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {note.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
                <span>Δημιουργήθηκε: {new Date(note.createdAt).toLocaleDateString('el-GR')}</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" className="text-blue-600 hover:text-blue-800">
                    <Send className="w-3 h-3 mr-1" />
                    Αποστολή
                  </Button>
                  <Button size="sm" variant="ghost" className="text-orange-600 hover:text-orange-800">
                    <Bell className="w-3 h-3 mr-1" />
                    Υπενθύμιση
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
