"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Home, 
  Building, 
  MapPin, 
  Euro, 
  Ruler,
  MousePointer
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyHoverInfoProps {
  propertyId: string | null;
}

interface PropertyHoverData {
  id: string;
  name: string;
  type: string;
  building: string;
  floor: number;
  status: 'for-sale' | 'for-rent' | 'sold' | 'rented' | 'reserved';
  price?: number;
  area?: number;
  quickInfo?: string;
}

// Mock data - θα αντικατασταθεί με πραγματικά δεδομένα
const mockHoverData: Record<string, PropertyHoverData> = {
  "prop-1": {
    id: "prop-1",
    name: "Αποθήκη A1",
    type: "Αποθήκη",
    building: "Κτίριο Alpha",
    floor: -1,
    status: "for-sale",
    price: 25000,
    area: 15,
    quickInfo: "Ευρύχωρη αποθήκη με εύκολη πρόσβαση"
  },
  "prop-2": {
    id: "prop-2",
    name: "Στούντιο B1",
    type: "Στούντιο",
    building: "Κτίριο Beta",
    floor: 1,
    status: "sold",
    price: 85000,
    area: 35,
    quickInfo: "Μοντέρνο στούντιο με θέα"
  },
  "prop-3": {
    id: "prop-3",
    name: "Διαμέρισμα 2Δ C1",
    type: "Διαμέρισμα 2Δ",
    building: "Κτίριο Gamma",
    floor: 2,
    status: "for-rent",
    price: 750,
    area: 65,
    quickInfo: "Ηλιόλουστο διαμέρισμα σε ήσυχη περιοχή"
  },
  "prop-4": {
    id: "prop-4",
    name: "Κατάστημα D1",
    type: "Κατάστημα",
    building: "Κτίριο Delta",
    floor: 0,
    status: "rented",
    price: 1200,
    area: 45,
    quickInfo: "Κατάστημα σε εμπορικό δρόμο"
  },
  "prop-5": {
    id: "prop-5",
    name: "Μεζονέτα E1",
    type: "Μεζονέτα",
    building: "Κτίριο Epsilon",
    floor: 3,
    status: "reserved",
    price: 145000,
    area: 85,
    quickInfo: "Πολυτελής μεζονέτα με δύο επίπεδα"
  }
};

const statusConfig = {
  'for-sale': {
    label: 'Προς Πώληση',
    color: 'bg-green-100 text-green-800 border-green-200',
    priceLabel: 'Τιμή Πώλησης'
  },
  'for-rent': {
    label: 'Προς Ενοικίαση',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    priceLabel: 'Μηνιαίο Μίσθωμα'
  },
  'sold': {
    label: 'Πουλημένο',
    color: 'bg-red-100 text-red-800 border-red-200',
    priceLabel: 'Τιμή Πώλησης'
  },
  'rented': {
    label: 'Ενοικιασμένο',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    priceLabel: 'Μηνιαίο Μίσθωμα'
  },
  'reserved': {
    label: 'Δεσμευμένο',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    priceLabel: 'Τιμή Πώλησης'
  },
};

function PropertyHoverContent({ property }: { property: PropertyHoverData }) {
  const statusInfo = statusConfig[property.status];

  return (
    <div className="space-y-3 p-1">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-semibold text-sm leading-tight">{property.name}</h4>
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
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs">
          <Building className="h-3 w-3 text-muted-foreground" />
          <span>{property.building}</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <MapPin className="h-3 w-3 text-muted-foreground" />
          <span>
            {property.floor === 0 
              ? 'Ισόγειο' 
              : property.floor < 0 
                ? 'Υπόγειο'
                : `${property.floor}ος όροφος`
            }
          </span>
        </div>
      </div>

      {/* Price & Area */}
      {(property.price || property.area) && (
        <>
          <Separator />
          <div className="space-y-2">
            {property.price && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">{statusInfo.priceLabel}:</p>
                <div className="flex items-center gap-1">
                  <Euro className="h-4 w-4 text-green-600" />
                  <span className="font-semibold text-sm text-green-600">
                    {property.price.toLocaleString('el-GR')}€
                    {(property.status === 'for-rent' || property.status === 'rented') && (
                      <span className="text-xs text-muted-foreground">/μήνα</span>
                    )}
                  </span>
                </div>
              </div>
            )}
            
            {property.area && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Εμβαδόν:</p>
                <div className="flex items-center gap-1">
                  <Ruler className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm font-medium">{property.area}τμ</span>
                </div>
              </div>
            )}

            {/* Price per square meter */}
            {property.price && property.area && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Τιμή ανά τμ:</p>
                <span className="text-xs font-medium">
                  {Math.round(property.price / property.area).toLocaleString('el-GR')}€/τμ
                  {(property.status === 'for-rent' || property.status === 'rented') && '/μήνα'}
                </span>
              </div>
            )}
          </div>
        </>
      )}

      {/* Quick Info */}
      {property.quickInfo && (
        <>
          <Separator />
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Σύντομη περιγραφή:</p>
            <p className="text-xs leading-relaxed">{property.quickInfo}</p>
          </div>
        </>
      )}

      {/* Hover Instruction */}
      <Separator />
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <MousePointer className="h-3 w-3" />
        <span>Κάντε κλικ για περισσότερες πληροφορίες</span>
      </div>
    </div>
  );
}

export function PropertyHoverInfo({ propertyId }: PropertyHoverInfoProps) {
  if (!propertyId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
        <MousePointer className="h-6 w-6 mb-2" />
        <p className="text-xs text-center">Περάστε το ποντίκι</p>
        <p className="text-xs text-center">πάνω από ένα ακίνητο</p>
        <p className="text-xs text-center mt-1 text-muted-foreground/70">
          στην κάτοψη για να δείτε
        </p>
        <p className="text-xs text-center text-muted-foreground/70">
          γρήγορες πληροφορίες
        </p>
      </div>
    );
  }

  const property = mockHoverData[propertyId];
  
  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
        <Home className="h-6 w-6 mb-2" />
        <p className="text-xs text-center">Δεν βρέθηκαν στοιχεία</p>
        <p className="text-xs text-center">για αυτό το ακίνητο</p>
      </div>
    );
  }

  return <PropertyHoverContent property={property} />;
}
