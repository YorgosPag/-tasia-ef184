"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Home, 
  Building, 
  MapPin, 
  Euro, 
  Ruler, 
  Calendar,
  User,
  Phone,
  Mail,
  FileText,
  Eye,
  Edit3,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyDetailsProps {
  propertyId: string | null;
}

interface PropertyDetails {
  id: string;
  name: string;
  type: string;
  building: string;
  floor: number;
  project: string;
  status: 'for-sale' | 'for-rent' | 'sold' | 'rented' | 'reserved';
  price?: number;
  area?: number;
  rooms?: number;
  bathrooms?: number;
  description?: string;
  features: string[];
  owner?: {
    name: string;
    phone?: string;
    email?: string;
  };
  agent?: {
    name: string;
    phone?: string;
    email?: string;
  };
  dates: {
    created: string;
    updated: string;
    available?: string;
  };
  documents: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
  }>;
}

// Mock data - θα αντικατασταθεί με πραγματικά δεδομένα
const mockPropertyDetails: Record<string, PropertyDetails> = {
  "prop-1": {
    id: "prop-1",
    name: "Αποθήκη A1",
    type: "Αποθήκη",
    building: "Κτίριο Alpha",
    floor: -1,
    project: "Έργο Κέντρο",
    status: "for-sale",
    price: 25000,
    area: 15,
    description: "Ευρύχωρη αποθήκη στο υπόγειο με εύκολη πρόσβαση.",
    features: ["Κλιματισμός", "Ασφάλεια", "Εύκολη Πρόσβαση"],
    owner: {
      name: "Γιάννης Παπαδόπουλος",
      phone: "6944123456",
      email: "giannis@example.com"
    },
    agent: {
      name: "Μαρία Κωνσταντίνου",
      phone: "6955987654",
      email: "maria@realestate.com"
    },
    dates: {
      created: "2024-01-15",
      updated: "2024-02-20",
      available: "2024-03-01"
    },
    documents: [
      {
        id: "doc-1",
        name: "Ενεργειακή Κλάση",
        type: "PDF",
        url: "/documents/energy-class.pdf"
      },
      {
        id: "doc-2",
        name: "Κάτοψη",
        type: "DWG",
        url: "/documents/floor-plan.dwg"
      }
    ]
  },
  "prop-2": {
    id: "prop-2",
    name: "Στούντιο B1",
    type: "Στούντιο",
    building: "Κτίριο Beta",
    floor: 1,
    project: "Έργο Νότος",
    status: "sold",
    price: 85000,
    area: 35,
    rooms: 1,
    bathrooms: 1,
    description: "Μοντέρνο στούντιο με μεγάλο μπαλκόνι και θέα στη θάλασσα.",
    features: ["Μπαλκόνι", "Θέα Θάλασσα", "Ανακαινισμένο", "Ηλιόλουστο"],
    owner: {
      name: "Ελένη Γεωργίου",
      phone: "6933456789",
      email: "eleni@example.com"
    },
    dates: {
      created: "2024-01-10",
      updated: "2024-02-15"
    },
    documents: [
      {
        id: "doc-3",
        name: "Τίτλος Ιδιοκτησίας",
        type: "PDF",
        url: "/documents/title-deed.pdf"
      }
    ]
  }
};

const statusConfig = {
  'for-sale': {
    label: 'Προς Πώληση',
    color: 'bg-green-100 text-green-800 border-green-200',
  },
  'for-rent': {
    label: 'Προς Ενοικίαση',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  'sold': {
    label: 'Πουλημένο',
    color: 'bg-red-100 text-red-800 border-red-200',
  },
  'rented': {
    label: 'Ενοικιασμένο',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
  },
  'reserved': {
    label: 'Δεσμευμένο',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
};

function PropertyDetailsContent({ property }: { property: PropertyDetails }) {
  const statusInfo = statusConfig[property.status];

  return (
    <ScrollArea className="h-full">
      <div className="space-y-4 p-1">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm leading-tight">{property.name}</h3>
            <Badge 
              variant="outline" 
              className={cn("text-xs flex-shrink-0", statusInfo.color)}
            >
              {statusInfo.label}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">{property.type}</p>
        </div>

        <Separator />

        {/* Location */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <Building className="h-3 w-3 text-muted-foreground" />
            <span>{property.building}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <MapPin className="h-3 w-3 text-muted-foreground" />
            <span>{property.floor >= 0 ? '+' : ''}{property.floor} όροφος</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{property.project}</span>
          </div>
        </div>

        <Separator />

        {/* Price & Specs */}
        <div className="space-y-2">
          {property.price && (
            <div className="flex items-center gap-2 text-sm">
              <Euro className="h-4 w-4 text-green-600" />
              <span className="font-semibold text-green-600">
                {property.price.toLocaleString('el-GR')}€
              </span>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            {property.area && (
              <div className="flex items-center gap-1">
                <Ruler className="h-3 w-3 text-muted-foreground" />
                <span>{property.area}τμ</span>
              </div>
            )}
            {property.rooms && (
              <div className="flex items-center gap-1">
                <Home className="h-3 w-3 text-muted-foreground" />
                <span>{property.rooms} δωμ.</span>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {property.description && (
          <>
            <Separator />
            <div className="space-y-1">
              <h4 className="text-xs font-medium">Περιγραφή</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {property.description}
              </p>
            </div>
          </>
        )}

        {/* Features */}
        {property.features.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="text-xs font-medium">Χαρακτηριστικά</h4>
              <div className="flex flex-wrap gap-1">
                {property.features.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        {(property.owner || property.agent) && (
          <>
            <Separator />
            <div className="space-y-3">
              {property.owner && (
                <div className="space-y-1">
                  <h4 className="text-xs font-medium flex items-center gap-1">
                    <User className="h-3 w-3" />
                    Ιδιοκτήτης
                  </h4>
                  <div className="space-y-1 pl-4">
                    <p className="text-xs">{property.owner.name}</p>
                    {property.owner.phone && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <span>{property.owner.phone}</span>
                      </div>
                    )}
                    {property.owner.email && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        <span>{property.owner.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {property.agent && (
                <div className="space-y-1">
                  <h4 className="text-xs font-medium flex items-center gap-1">
                    <User className="h-3 w-3" />
                    Μεσίτης
                  </h4>
                  <div className="space-y-1 pl-4">
                    <p className="text-xs">{property.agent.name}</p>
                    {property.agent.phone && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <span>{property.agent.phone}</span>
                      </div>
                    )}
                    {property.agent.email && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        <span>{property.agent.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {property.documents.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="text-xs font-medium flex items-center gap-1">
                <FileText className="h-3 w-3" />
                Έγγραφα
              </h4>
              <div className="space-y-1">
                {property.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between text-xs">
                    <span className="truncate">{doc.name}</span>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Dates */}
        <Separator />
        <div className="space-y-1">
          <h4 className="text-xs font-medium flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Ημερομηνίες
          </h4>
          <div className="space-y-1 text-xs text-muted-foreground">
            <div>Δημιουργία: {new Date(property.dates.created).toLocaleDateString('el-GR')}</div>
            <div>Ενημέρωση: {new Date(property.dates.updated).toLocaleDateString('el-GR')}</div>
            {property.dates.available && (
              <div>Διαθεσιμότητα: {new Date(property.dates.available).toLocaleDateString('el-GR')}</div>
            )}
          </div>
        </div>

        {/* Actions */}
        <Separator />
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Eye className="h-3 w-3 mr-1" />
            Προβολή
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Edit3 className="h-3 w-3 mr-1" />
            Επεξ.
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
}

export function PropertyDetailsPanel({ propertyId }: PropertyDetailsProps) {
  if (!propertyId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
        <Home className="h-8 w-8 mb-2" />
        <p className="text-sm text-center">Επιλέξτε ένα ακίνητο από τη λίστα</p>
        <p className="text-xs text-center">για να δείτε τα στοιχεία του</p>
      </div>
    );
  }

  const property = mockPropertyDetails[propertyId];
  
  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
        <Home className="h-8 w-8 mb-2" />
        <p className="text-sm text-center">Δεν βρέθηκαν στοιχεία</p>
        <p className="text-xs text-center">για το επιλεγμένο ακίνητο</p>
      </div>
    );
  }

  return <PropertyDetailsContent property={property} />;
}
