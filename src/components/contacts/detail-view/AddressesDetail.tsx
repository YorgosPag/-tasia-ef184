"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Map as MapIcon } from "lucide-react";
import { DetailRow } from "./DetailRow";
import { ContactFormValues } from "@/lib/validation/contactSchema";

interface AddressesDetailProps {
  addresses: ContactFormValues["addresses"];
}

export function AddressesDetail({ addresses }: AddressesDetailProps) {
  if (!addresses || addresses.length === 0) {
    return null;
  }

  return (
    <>
      {addresses.map((address, i) => {
        const fullAddress = [
          address.street,
          address.number,
          address.toponym,
          address.settlements,
          address.municipalLocalCommunities,
          address.municipalUnities,
          address.municipality,
          address.regionalUnities,
          address.regions,
          address.decentralizedAdministrations,
          address.largeGeographicUnits,
          address.postalCode,
          address.country,
        ]
          .filter(Boolean)
          .join(", ");

        const googleMapsUrl = fullAddress
          ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`
          : null;

        return (
          <div key={i} className="p-3 rounded-md bg-muted/30 space-y-2">
            <div className="flex justify-between items-center w-full">
              <div>
                <p className="font-semibold text-sm">
                  {address.type || "Διεύθυνση"}
                </p>
              </div>
              {googleMapsUrl && (
                <Button asChild variant="outline" size="sm">
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MapIcon className="mr-2 h-4 w-4" />
                    Χάρτης
                  </a>
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 text-sm gap-x-4 gap-y-1">
              <DetailRow
                label="Οδός"
                value={`${address.street || ""} ${address.number || ""}`.trim()}
              />
              <DetailRow label="Τοπωνύμιο" value={address.toponym} />
              <DetailRow label="Τ.Κ." value={address.postalCode} />
              <DetailRow label="Οικισμός" value={address.settlements} />
              <DetailRow
                label="Δημοτική/Τοπική Κοινότητα"
                value={address.municipalLocalCommunities}
              />
              <DetailRow
                label="Δημοτική Ενότητα"
                value={address.municipalUnities}
              />
              <DetailRow label="Δήμος" value={address.municipality} />
              <DetailRow
                label="Περιφερειακή Ενότητα"
                value={address.regionalUnities}
              />
              <DetailRow label="Περιφέρεια" value={address.regions} />
              <DetailRow
                label="Αποκεντρωμένη Διοίκηση"
                value={address.decentralizedAdministrations}
              />
              <DetailRow
                label="Μεγάλη Γεωγραφική Ενότητα"
                value={address.largeGeographicUnits}
              />
              <DetailRow label="Χώρα" value={address.country} />
            </div>
          </div>
        );
      })}
    </>
  );
}
