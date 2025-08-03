"use client";

import React, { useState } from "react";
import { 
  User, 
  Building, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Star,
  MessageCircle,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  Clock,
  DollarSign,
  FileText,
  Users,
  Search,
  Filter,
  SortAsc,
  Grid3X3,
  List
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Contact {
  id: string;
  name: string;
  entityType: "Φυσικό Πρόσωπο" | "Νομικό Πρόσωπο" | "Δημ. Υπηρεσία";
  email?: string;
  phone?: string;
  mobile?: string;
  address?: string;
  city?: string;
  role?: string;
  company?: string;
  photoUrl?: string;
  lastContact?: string;
  status: "active" | "inactive" | "potential";
  priority: "high" | "medium" | "low";
  projectsCount?: number;
  totalValue?: number;
  notes?: string;
  tags?: string[];
  createdAt: string;
  isFavorite?: boolean;
}

const mockContacts: Contact[] = [
  {
    id: "1",
    name: "Μαρία Παπαδοπούλου",
    entityType: "Φυσικό Πρόσωπο",
    email: "maria.papadopoulou@email.gr",
    phone: "2101234567",
    mobile: "6971234567",
    address: "Βασιλίσσης Σοφίας 125",
    city: "Αθήνα",
    role: "Αρχιτέκτονας",
    company: "Studio Architects",
    lastContact: "2025-08-01",
    status: "active",
    priority: "high",
    projectsCount: 3,
    totalValue: 85000,
    createdAt: "2025-01-15",
    isFavorite: true,
    tags: ["αρχιτεκτονική", "συνεργάτης", "vip"]
  },
  {
    id: "2",
    name: "DevConstruct AE",
    entityType: "Νομικό Πρόσωπο",
    email: "info@devconstruct.gr",
    phone: "2107654321",
    address: "Λεωφ. Κηφισίας 58",
    city: "Αθήνα",
    role: "Πελάτης",
    lastContact: "2025-07-28",
    status: "active",
    priority: "high",
    projectsCount: 2,
    totalValue: 450000,
    createdAt: "2024-11-20",
    isFavorite: false,
    tags: ["πελάτης", "μεγάλο έργο"]
  },
  {
    id: "3",
    name: "Γιάννης Κώστου",
    entityType: "Φυσικό Πρόσωπο",
    email: "giannis.kostou@email.gr",
    phone: "2103456789",
    mobile: "6943456789",
    address: "Αγίου Δημητρίου 45",
    city: "Θεσσαλονίκη",
    role: "Project Manager",
    company: "BuildTech Ltd",
    lastContact: "2025-07-30",
    status: "active",
    priority: "medium",
    projectsCount: 1,
    totalValue: 25000,
    createdAt: "2025-03-10",
    isFavorite: false,
    tags: ["project manager", "θεσσαλονίκη"]
  },
  {
    id: "4",
    name: "Δήμος Αθηναίων",
    entityType: "Δημ. Υπηρεσία",
    email: "projects@athens.gr",
    phone: "2132057000",
    address: "Λιοσίων 15",
    city: "Αθήνα",
    role: "Δημόσιος Φορέας",
    lastContact: "2025-07-15",
    status: "potential",
    priority: "medium",
    projectsCount: 0,
    totalValue: 0,
    createdAt: "2025-06-01",
    isFavorite: false,
    tags: ["δημόσιο", "διαγωνισμός"]
  }
];

interface ContactListProps {
  contacts: any[]; // Changed to any[] to match usage in ContactsPage
  onSelectContact: (id: string) => void;
  selectedContactId: string | null;
}

export function ContactList({ contacts, onSelectContact, selectedContactId }: ContactListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const filteredContacts = (contacts as Contact[]).filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.phone?.includes(searchTerm) ||
                         contact.company?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "all" || contact.entityType === filterType;
    const matchesStatus = filterStatus === "all" || contact.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const sortedContacts = [...filteredContacts].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "lastContact":
        return new Date(b.lastContact || 0).getTime() - new Date(a.lastContact || 0).getTime();
      case "value":
        return (b.totalValue || 0) - (a.totalValue || 0);
      case "projects":
        return (b.projectsCount || 0) - (a.projectsCount || 0);
      default:
        return 0;
    }
  });

  const toggleFavorite = (contactId: string) => {
    // This part would need a proper state management solution to update the parent
    console.log("Toggling favorite for", contactId);
  };

  const getBadgeVariant = (type: Contact["entityType"]) => {
    switch (type) {
      case "Νομικό Πρόσωπο":
        return "default";
      case "Δημ. Υπηρεσία":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-green-600 bg-green-50";
      case "inactive": return "text-gray-600 bg-gray-50";
      case "potential": return "text-blue-600 bg-blue-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600";
      case "medium": return "text-yellow-600";
      case "low": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('el-GR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('el-GR');
  };

  const getEntityIcon = (entityType: Contact["entityType"]) => {
    switch (entityType) {
      case "Φυσικό Πρόσωπο":
        return <User className="w-4 h-4" />;
      case "Νομικό Πρόσωπο":
        return <Building className="w-4 h-4" />;
      case "Δημ. Υπηρεσία":
        return <Users className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const ContactCard = ({ contact }: { contact: Contact }) => (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        selectedContactId === contact.id ? "ring-2 ring-blue-500 bg-blue-50" : ""
      }`}
      onClick={() => onSelectContact(contact.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3 flex-1">
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarImage src={contact.photoUrl} alt={contact.name} />
                <AvatarFallback className="text-sm font-medium">
                  {contact.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {contact.isFavorite && (
                <Star className="absolute -top-1 -right-1 w-4 h-4 text-yellow-500 fill-current" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-base text-gray-900 truncate">
                  {contact.name}
                </h3>
                <div className={`w-2 h-2 rounded-full ${getPriorityColor(contact.priority)}`} 
                     style={{ backgroundColor: 'currentColor' }} />
              </div>
              
              {contact.role && (
                <p className="text-sm text-gray-600 mb-1">{contact.role}</p>
              )}
              
              {contact.company && contact.entityType === "Φυσικό Πρόσωπο" && (
                <p className="text-xs text-gray-500 mb-2">{contact.company}</p>
              )}
              
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                {contact.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    <span className="truncate max-w-[120px]">{contact.email}</span>
                  </div>
                )}
                {contact.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    <span>{contact.phone}</span>
                  </div>
                )}
              </div>
              
              {contact.address && (
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{contact.address}, {contact.city}</span>
                </div>
              )}
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="w-4 h-4 mr-2" />
                Προβολή
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="w-4 h-4 mr-2" />
                Επεξεργασία
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleFavorite(contact.id)}>
                <Star className="w-4 h-4 mr-2" />
                {contact.isFavorite ? "Αφαίρεση από αγαπημένα" : "Προσθήκη στα αγαπημένα"}
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Διαγραφή
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge variant={getBadgeVariant(contact.entityType)} className="text-xs">
              <span className="mr-1">{getEntityIcon(contact.entityType)}</span>
              {contact.entityType}
            </Badge>
            <Badge className={`text-xs ${getStatusColor(contact.status)}`}>
              {contact.status === "active" && "Ενεργός"}
              {contact.status === "inactive" && "Ανενεργός"}
              {contact.status === "potential" && "Δυνητικός"}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-xs">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
              <FileText className="w-3 h-3" />
              <span>Έργα</span>
            </div>
            <div className="font-semibold text-gray-900">{contact.projectsCount || 0}</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
              <DollarSign className="w-3 h-3" />
              <span>Αξία</span>
            </div>
            <div className="font-semibold text-gray-900">
              {contact.totalValue ? formatCurrency(contact.totalValue) : "€0"}
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
              <Clock className="w-3 h-3" />
              <span>Τελ. επαφή</span>
            </div>
            <div className="font-semibold text-gray-900">
              {contact.lastContact ? formatDate(contact.lastContact) : "Ποτέ"}
            </div>
          </div>
        </div>

        {contact.tags && contact.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {contact.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs px-2 py-0">
                #{tag}
              </Badge>
            ))}
            {contact.tags.length > 3 && (
              <Badge variant="outline" className="text-xs px-2 py-0">
                +{contact.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
              <Mail className="w-3 h-3 mr-1" />
              Email
            </Button>
            <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
              <Phone className="w-3 h-3 mr-1" />
              Κλήση
            </Button>
            <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
              <MessageCircle className="w-3 h-3 mr-1" />
              SMS
            </Button>
          </div>
          <div className="text-xs text-gray-400">
            {formatDate(contact.createdAt)}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header με αναζήτηση και φίλτρα */}
      <div className="p-4 border-b border-gray-200 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Επαφές ({sortedContacts.length})
          </h2>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Αναζήτηση */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Αναζήτηση επαφών..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Φίλτρα */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger>
              <SelectValue placeholder="Τύπος επαφής" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Όλοι οι τύποι</SelectItem>
              <SelectItem value="Φυσικό Πρόσωπο">Φυσικό Πρόσωπο</SelectItem>
              <SelectItem value="Νομικό Πρόσωπο">Νομικό Πρόσωπο</SelectItem>
              <SelectItem value="Δημ. Υπηρεσία">Δημ. Υπηρεσία</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Κατάσταση" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Όλες οι καταστάσεις</SelectItem>
              <SelectItem value="active">Ενεργός</SelectItem>
              <SelectItem value="inactive">Ανενεργός</SelectItem>
              <SelectItem value="potential">Δυνητικός</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Ταξινόμηση" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Όνομα</SelectItem>
              <SelectItem value="lastContact">Τελευταία επαφή</SelectItem>
              <SelectItem value="value">Αξία έργων</SelectItem>
              <SelectItem value="projects">Αριθμός έργων</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Λίστα επαφών */}
      <div className="flex-1 overflow-auto p-4">
        {sortedContacts.length === 0 ? (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Δεν βρέθηκαν επαφές</p>
          </div>
        ) : (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" 
            : "space-y-3"
          }>
            {sortedContacts.map(contact => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}