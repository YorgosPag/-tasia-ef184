"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Edit,
  User,
  Info,
  Phone,
  Link as LinkIcon,
  Map as MapIcon,
  Briefcase,
} from "lucide-react";
import Link from "next/link";
import type { Contact } from "@/hooks/use-contacts";
import { DetailSection } from "./detail-view/DetailSection";
import { DetailRow } from "./detail-view/DetailRow";
import { formatDate } from "./utils/contactFormatters";
import { ContactPlaceholder } from "./detail-view/ContactPlaceholder";
import { SocialsDetail } from "./detail-view/SocialsDetail";
import { AddressesDetail } from "./detail-view/AddressesDetail";
import { Send } from "lucide-react";

export function ContactDetailView({ contact }: { contact: Contact | null }) {
  if (!contact) {
    return <ContactPlaceholder />;
  }

  const entityTypeTab =
    contact.entityType === "Φυσικό Πρόσωπο"
      ? "individual"
      : contact.entityType === "Νομικό Πρόσωπο"
        ? "legal"
        : "public";
  const editUrl = `/contacts/${contact.id}/edit/${entityTypeTab}`;
  const photoUrl = contact.photoUrls?.[entityTypeTab] || undefined;

  return (
    <Card className="h-full sticky top-20">
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={photoUrl} alt={contact.name} />
            <AvatarFallback>
              {contact.name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{contact.name}</CardTitle>
            <CardDescription className="flex flex-col mt-1">
              <span>{contact.entityType || "-"}</span>
              <span className="text-xs">{contact.job?.role || "-"}</span>
            </CardDescription>
          </div>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href={editUrl}>
            <Edit className="mr-2 h-4 w-4" />
            Επεξεργασία
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto">
        {contact.entityType === "Φυσικό Πρόσωπο" && (
          <DetailSection title="Προσωπικά Στοιχεία" icon={User} alwaysShow>
            <DetailRow label="Όνομα" value={contact.firstName} />
            <DetailRow label="Επώνυμο" value={contact.lastName} />
            <DetailRow label="Πατρώνυμο" value={contact.fatherName} />
            <DetailRow label="Μητρώνυμο" value={contact.motherName} />
            <DetailRow
              label="Ημ/νία Γέννησης"
              value={formatDate(contact.birthDate)}
            />
            <DetailRow label="Τόπος Γέννησης" value={contact.birthPlace} />
          </DetailSection>
        )}

        <DetailSection title="Ταυτότητα &amp; ΑΦΜ" icon={Info} alwaysShow>
          {contact.entityType === "Φυσικό Πρόσωπο" ? (
            <>
              <DetailRow label="Τύπος" value={contact.identity?.type} />
              <DetailRow label="Αριθμός" value={contact.identity?.number} />
              <DetailRow
                label="Ημ/νία Έκδοσης"
                value={formatDate(contact.identity?.issueDate)}
              />
              <DetailRow
                label="Εκδ. Αρχή"
                value={contact.identity?.issuingAuthority}
              />
            </>
          ) : null}
          <DetailRow label="ΑΦΜ" value={contact.afm} />
          <DetailRow label="ΔΟΥ" value={contact.doy} />
        </DetailSection>

        <DetailSection title="Στοιχεία Επικοινωνίας" icon={Phone} alwaysShow>
          {contact.emails?.map((email, i) => (
            <DetailRow key={i} label="Email" type={email.type}>
              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${email.value}`}
                  className="text-primary hover:underline"
                >
                  {email.value}
                </a>
                <a
                  href={`mailto:${email.value}`}
                  title={`Αποστολή σε ${email.value}`}
                >
                  <Send className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                </a>
              </div>
            </DetailRow>
          ))}
          {contact.phones?.map((phone, i) => (
            <DetailRow
              key={i}
              label="Τηλέφωνο"
              value={`${phone.countryCode || ""} ${phone.value}`}
              href={`tel:${phone.countryCode}${phone.value}`}
              type={`${phone.type} ${phone.indicators?.join(", ")}`.trim()}
            />
          ))}
        </DetailSection>

        <DetailSection
          title="Κοινωνικά Δίκτυα &amp; Websites"
          icon={LinkIcon}
          alwaysShow
        >
          <SocialsDetail socials={contact.socials} />
        </DetailSection>

        <DetailSection title="Διευθύνσεις" icon={MapIcon} alwaysShow>
          <AddressesDetail addresses={contact.addresses} />
        </DetailSection>

        {contact.entityType !== "Δημ. Υπηρεσία" && (
          <DetailSection
            title="Επαγγελματικά Στοιχεία"
            icon={Briefcase}
            alwaysShow
          >
            <DetailRow label="Ρόλος" value={contact.job?.role} />
            <DetailRow label="Ειδικότητα" value={contact.job?.specialty} />
          </DetailSection>
        )}

        <DetailSection title="Σημειώσεις" icon={Info} alwaysShow>
          {contact.notes ? (
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {contact.notes}
            </p>
          ) : null}
        </DetailSection>
      </CardContent>
    </Card>
  );
}
