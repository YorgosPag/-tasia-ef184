
// This file maps specific custom list IDs to their corresponding field in the 'contacts' collection.
// It's used to check for dependencies before deleting a list item, ensuring data integrity.

export const listIdToContactFieldMap: { [key: string]: string } = {
  // Map 'Ρόλοι' list to 'job.role' field in contacts
  "Jz1pB5tZSC8d41w8uKlA": "job.role",
  // Map 'Ειδικότητες' list to 'job.specialty' field in contacts
  "k8zyKz2mC0d7j4x3R5bH": "job.specialty",
  // Map 'Εκδ. Αρχή' list to 'identity.issuingAuthority' field in contacts
  "iGOjn86fcktREwMeDFPz": "identity.issuingAuthority",
  // Map 'Τύπος Ταυτότητας' list to 'identity.type' field in contacts
  "jIt8lRiNcgatSchI90yd": "identity.type",
  // Map 'ΔΟΥ' list to 'doy' field in contacts
  "pL5fV6w8X9y7zE1bN3cO": "doy",
};
