
'use client';

/**
 * Maps a Custom List ID to its corresponding field path in the 'contacts' collection.
 * This is used to perform dependency checks before deleting a list or list item.
 * For example, if a list item from the "Roles" list is used in the `job.role` field
 * of any contact, its deletion should be prevented.
 *
 * The key is the Firestore Document ID of the list in the `tsia-custom-lists` collection.
 * The value is the dot-notation path to the field in the `tsia-contacts` collection documents.
 */
export const listIdToContactFieldMap: Record<string, string> = {
  // ID for "Εκδούσες Αρχές" list -> field in contacts collection
  'iGOjn86fcktREwMeDFPz': 'identity.issuingAuthority',

  // ID for "Τύποι Ταυτοτήτων" list -> field in contacts collection
  'jIt8lRiNcgatSchI90yd': 'identity.type',
  
  // ID for "Ρόλοι" list -> field in contacts collection
  'your_list_id_for_roles': 'job.role', // Replace with the actual ID for the "Roles" list

  // ID for "Ειδικότητες" list -> field in contacts collection
  'your_list_id_for_specialties': 'job.specialty', // Replace with the actual ID for the "Specialties" list

  // Add other mappings here as needed.
};
