import type { UseFormReturn } from "react-hook-form";
import type { ContactFormValues } from "@/lib/validation/contactSchema";
import { z } from "zod";
import { addressSchema } from "@/lib/validation/schemas/addressSchema";

export const ADDRESS_TYPES = [
  "Κύρια",
  "Κατοικίας",
  "Επαγγελματική",
  "Έδρα",
  "Υποκατάστημα",
  "Αποθήκη",
  "Εξοχικό",
  "Άλλο",
];

type AddressFieldArray = z.infer<typeof addressSchema.shape.addresses>;
type AddressField = AddressFieldArray extends (infer U)[] ? U : never;

type AddressFieldKey = keyof AddressField;

export const addressFieldsMap: {
  formKey: AddressFieldKey;
  label: string;
  algoliaKey: string;
}[] = [
  { formKey: "settlements", label: "Οικισμός", algoliaKey: "Οικισμοί" },
  {
    formKey: "municipalLocalCommunities",
    label: "Δημοτική/Τοπική Κοινότητα",
    algoliaKey: "Δημοτικές/Τοπικές Κοινότητες",
  },
  {
    formKey: "municipalUnities",
    label: "Δημοτική Ενότητα",
    algoliaKey: "Δημοτικές Ενότητες",
  },
  { formKey: "municipality", label: "Δήμος", algoliaKey: "Δήμοι" },
  {
    formKey: "regionalUnities",
    label: "Περιφερειακή Ενότητα",
    algoliaKey: "Περιφερειακές ενότητες",
  },
  { formKey: "regions", label: "Περιφέρεια", algoliaKey: "Περιφέρειες" },
  {
    formKey: "decentralizedAdministrations",
    label: "Αποκεντρωμένη Διοίκηση",
    algoliaKey: "Αποκεντρωμένες Διοικήσεις",
  },
  {
    formKey: "largeGeographicUnits",
    label: "Μεγάλη Γεωγραφική Ενότητα",
    algoliaKey: "Μεγάλες γεωγραφικές ενότητες",
  },
];

export const getFullAddress = (
  form: UseFormReturn<ContactFormValues>,
  index: number,
) => {
  const address = form.watch(`addresses.${index}`);
  if (!address) return "";
  return [
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
    .join(" ");
};

export const handleAddressSelect = (
  form: UseFormReturn<ContactFormValues>,
  idx: number,
  hit: any,
) => {
  addressFieldsMap.forEach(({ formKey, algoliaKey }) => {
    const raw = hit[algoliaKey];

    let value: string = "";

    if (Array.isArray(raw)) {
      value = raw.find((v) => typeof v === "string") || "";
    } else if (typeof raw === "string") {
      value = raw;
    }

    if (value) {
      form.setValue(`addresses.${idx}.${String(formKey)}` as any, value, {
        shouldDirty: true,
      });
    }
  });
};

export const parseGemiAddress = (rawAddress: string, poBox?: string) => {
  const addressParts = rawAddress.split(",").map((p: string) => p.trim());
  let streetPart = addressParts[0] || "";
  let cityPart = addressParts[1] || "";
  let zipPart = addressParts[2] || "";
  const streetMatch = streetPart.match(/^(.*)\s([\d\w-]+)$/);
  let street = streetMatch ? streetMatch[1] : streetPart;
  let number = streetMatch ? streetMatch[2] : "";
  const postalCodeRegex = /\b\d{5}\b/;
  let postalCode = "";
  if (zipPart && postalCodeRegex.test(zipPart)) {
    postalCode = zipPart;
  } else if (cityPart && postalCodeRegex.test(cityPart)) {
    postalCode = cityPart.match(postalCodeRegex)?.[0] || "";
    cityPart = cityPart.replace(postalCode, "").trim();
  }

  return {
    type: "Έδρα (ΓΕΜΗ)",
    fromGEMI: true,
    street: street,
    number: number,
    municipality: cityPart,
    postalCode: postalCode,
    country: "Ελλάδα",
    poBox: poBox || "",
    toponym: "",
    settlements: "",
    municipalLocalCommunities: "",
    municipalUnities: "",
    regionalUnities: "",
    regions: "",
    decentralizedAdministrations: "",
    largeGeographicUnits: "",
    isActive: true,
    customTitle: "",
    originNote: "Fetched from GEMH",
  };
};
