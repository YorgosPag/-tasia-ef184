/**
 * Maps the unique, immutable Firestore list ID to the corresponding field in the 'contacts' collection.
 * This is used to check for dependencies before deleting a list or list item.
 */
export const listIdToContactFieldMap: Record<string, string> = {
  // Roles list
  'hOKgJ1K2k8g7e9Y3d1t5': 'job.role',
  // Specialties list
  'fLpWc4e8gH2jK1n7m0p3': 'job.specialty',
  // DOY (Tax Office) list
  'bC9eF1g3h5i7k9l0m2n4': 'doy',
  // Identity Document Types list
  'jIt8lRiNcgatSchI90yd': 'identity.type',
  // Issuing Authorities list
  'iGOjn86fcktREwMeDFPz': 'identity.issuingAuthority',
};
