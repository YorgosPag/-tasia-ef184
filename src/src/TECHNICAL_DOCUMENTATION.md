

# Τεχνική Τεκμηρίωση Εφαρμογής TASIA

## 1. Επισκόπηση Εφαρμογής

Η TASIA είναι μια web εφαρμογή τύπου Real Estate Index, σχεδιασμένη για την ιεραρχική διαχείριση και οπτικοποίηση κατασκευαστικών έργων. Επιτρέπει στους χρήστες να καταχωρούν και να παρακολουθούν εταιρείες, τα έργα που αναλαμβάνουν, τα κτίρια που περιλαμβάνουν, τους ορόφους κάθε κτιρίου, και τα επιμέρους ακίνητα (units) με τα παρακολουθήματά τους (π.χ. parking, αποθήκες).

Το κεντρικό χαρακτηριστικό της εφαρμογής είναι ο **Floor Plan Viewer**, ένα διαδραστικό εργαλείο που επιτρέπει την οπτικοποίηση αρχιτεκτονικών κατόψεων σε μορφή PDF, πάνω στις οποίες οι χρήστες μπορούν να σχεδιάσουν "ζωντανά" πολύγωνα που αντιστοιχούν στα ακίνητα, να τα χρωματίσουν ανάλογα με την κατάστασή τους (status) και να τα διαχειριστούν.

---

## 2. Τεχνολογικό Stack (Tech Stack)

Η εφαρμογή είναι χτισμένη με ένα σύγχρονο, component-based stack που δίνει έμφαση στην ταχύτητα ανάπτυξης, την απόδοση και τη συντηρησιμότητα.

- **Frontend Framework**: **Next.js (App Router)** - Χρησιμοποιούμε το App Router για βελτιωμένη δρομολόγηση, server-side rendering (SSR) και React Server Components (RSC) by default.
- **Γλώσσα Προγραμματισμού**: **TypeScript** - Για type-safety και καλύτερο developer experience.
- **UI Components**: **ShadCN/UI** - Μια βιβλιοθήκη από όμορφα και προσβάσιμα components, χτισμένα πάνω σε **Radix UI** (για τη λογική) και **Tailwind CSS** (για το styling).
- **Styling**: **Tailwind CSS** - Για γρήγορο και συνεπές utility-first CSS styling.
- **Backend & Database**: **Firebase (Firestore & Authentication)** - Χρησιμοποιούμε τη σουίτα της Firebase για:
    - **Firestore**: Ως NoSQL, document-based βάση δεδομένων για την αποθήκευση όλων των δεδομένων της εφαρμογής.
    - **Firebase Authentication**: Για τη διαχείριση χρηστών (login/register με email/password και Google Sign-In).
    - **Firebase Storage**: Για την αποθήκευση αρχείων, όπως οι κατόψεις σε PDF.
- **State Management**:
    - **React Hooks (`useState`, `useEffect`, `useContext`)**: Για τη βασική διαχείριση κατάστασης.
    - **TanStack Query (React Query)**: Για το data fetching, caching, και τον συγχρονισμό του server state (π.χ. φόρτωση όλων των units).
    - **Zustand (μέσω του `useDataStore`)**: Για τη δημιουργία ενός κεντρικού, client-side store που κρατάει δεδομένα που αλλάζουν συχνά (π.χ. projects, companies) και τα μοιράζεται σε όλη την εφαρμογή χωρίς prop drilling.
- **Forms**: **React Hook Form** με **Zod** για τη διαχείριση φορμών και την επικύρωση των δεδομένων (validation).
- **PDF Rendering**: **react-pdf** - Μια ισχυρή βιβλιοθήκη για την απόδοση PDF αρχείων μέσα σε React components.

---

## 3. Δομή Δεδομένων & Ιεραρχία (Data Architecture)

Η καρδιά της εφαρμογής είναι η ιεραρχική σχέση μεταξύ των οντοτήτων της. Η αποθήκευση γίνεται στο Firestore ακολουθώντας ένα υβριδικό μοντέλο για ευελιξία και απόδοση.

### Η Ιεραρχία:

**Company** -> **Project** -> **Building** -> **Floor** -> **Unit** -> **Attachment**

Και παράλληλα: **Project** -> **WorkStage** -> **WorkSubstage**

### Το "Πάντρεμα" των Δεδομένων στο Firestore:

Για να επιτύχουμε γρήγορες αναγνώσεις τόσο σε επίπεδο έργου (π.χ. "δείξε μου όλα τα κτίρια αυτού του έργου") όσο και σε συνολικό επίπεδο (π.χ. "δείξε μου όλα τα κτίρια ανεξαρτήτως έργου"), χρησιμοποιούμε μια **dual-write strategy**:

1.  **Nested Subcollections**: Τα δεδομένα αποθηκεύονται στην κανονική τους ιεραρχία. Για παράδειγμα, ένα `building` αποθηκεύεται ως έγγραφο μέσα στη subcollection `buildings` ενός συγκεκριμένου `project`.
    - `projects/{projectId}/buildings/{buildingId}/floors/{floorId}/units/{unitId}`
    - `projects/{projectId}/workStages/{workStageId}/workSubstages/{workSubstageId}`

2.  **Top-Level Collections (Denormalization)**: Ταυτόχρονα, κάθε οντότητα (π.χ. `building`, `floor`, `unit`) αποθηκεύεται και σε μια "επίπεδη" (flat) top-level collection.
    - `/companies/{companyId}`
    - `/projects/{projectId}`
    - `/buildings/{buildingId}`
    - `/floors/{floorId}`
    - `/units/{unitId}`
    - `/attachments/{attachmentId}`

### Πώς γίνεται η Σύνδεση:

Κάθε έγγραφο στις top-level collections περιέχει αναφορές (IDs) στους "γονείς" του, ενώ τα έγγραφα στις subcollections περιέχουν μια αναφορά (`topLevelId`) στο αντίστοιχο έγγραφο της top-level collection.

**Παράδειγμα για ένα `Building`:**
- Το έγγραφο στο `/projects/{projectId}/buildings/{originalBuildingId}` περιέχει ένα πεδίο `topLevelId` που δείχνει στο `/buildings/{topLevelBuildingId}`.
- Το έγγραφο στο `/buildings/{topLevelBuildingId}` περιέχει πεδία `projectId` και `originalId` που δείχνουν πίσω στο έγγραφο της subcollection.

Αυτή η στρατηγική μας επιτρέπει:
- **Να φορτώνουμε γρήγορα όλα τα κτίρια ενός έργου** διαβάζοντας απλώς τη subcollection του.
- **Να φορτώνουμε γρήγορα όλα τα κτίρια της εφαρμογής** διαβάζοντας την top-level collection `buildings`.

---

## 4. Schemas Οντοτήτων στο Firestore

### Collection: `companies`
- **name**: `string` - Επωνυμία εταιρείας.
- **contactInfo**: `map` - Object με `email`, `phone`, `address`, `afm`.
- **logoUrl**: `string` (optional) - URL του λογότυπου.
- **website**: `string` (optional) - URL της ιστοσελίδας.
- **createdAt**: `timestamp` - Ημερομηνία δημιουργίας.

### Collection: `projects`
- **title**: `string` - Τίτλος έργου.
- **companyId**: `string` - Αναφορά στην `companies` collection.
- **location**: `string` - Τοποθεσία του έργου.
- **description**: `string` (optional) - Περιγραφή του έργου.
- **deadline**: `timestamp` - Προθεσμία ολοκλήρωσης.
- **status**: `string` - (`Ενεργό`, `Σε εξέλιξη`, `Ολοκληρωμένο`).
- **photoUrl**: `string` (optional) - URL της κύριας φωτογραφίας/μακέτας.
- **tags**: `array` of `string` (optional) - Κατηγοριοποίηση (π.χ. "residential", "commercial").
- **createdAt**: `timestamp` - Ημερομηνία δημιουργίας.

#### Subcollection: `projects/{projectId}/workStages`
- **name**: `string` - (π.χ. “Εκσκαφές”, “Τοιχοποιία”).
- **description**: `string` (optional) - Περιγραφή του σταδίου.
- **status**: `string` - (`Εκκρεμεί`, `Σε εξέλιξη`, `Ολοκληρώθηκε`, `Καθυστερεί`).
- **startDate**: `timestamp` (optional) - Ημερομηνία έναρξης.
- **endDate**: `timestamp` (optional) - Ημερομηνία λήξης.
- **deadline**: `timestamp` (optional) - Προθεσμία.
- **assignedTo**: `array` of `string` (optional) - Λίστα με IDs επαφών/συνεργείων/εταιρειών.
- **documents**: `array` of `string` (optional) - Λίστα με **ονόματα** απαιτούμενων εγγράφων.
- **photos**: `array` of `map` (optional) - Λίστα με `{ url: string, uploadedAt: timestamp, uploadedBy: string }`.
- **notes**: `string` (optional) - Σημειώσεις.
- **relatedEntityIds**: `array` of `string` (optional) - Λίστα με IDs από κτίρια, ορόφους, ακίνητα.
- **dependsOn**: `array` of `string` (optional) - Λίστα με IDs από άλλα workStages.
- **checklist**: `array` of `map` (optional) - Λίστα αντικειμένων επιθεώρησης:
  - `task`: `string` - Το όνομα της εργασίας.
  - `completed`: `boolean` - Η κατάσταση.
  - `inspectionNotes`: `string` (optional) - Παρατηρήσεις ελέγχου.
  - `completionDate`: `timestamp` (optional) - Πότε ολοκληρώθηκε.
  - `completedBy`: `string` (optional) - Email του χρήστη που το ολοκλήρωσε.
- **budgetedCost**: `number` (optional) - Προϋπολογισμένο κόστος.
- **actualCost**: `number` (optional) - Πραγματικό κόστος.
- **createdAt**: `timestamp` - Ημερομηνία δημιουργίας.

##### Subcollection: `projects/{projectId}/workStages/{workStageId}/workSubstages`
- **Schema**: Το ίδιο με τη `workStages` collection.

### Collection: `buildings`
- **address**: `string` - Διεύθυνση.
- **type**: `string` - Τύπος κτιρίου.
- **description**: `string` (optional) - Περιγραφή / Σημειώσεις.
- **photoUrl**: `string` (optional) - URL φωτογραφίας.
- **floorsCount**: `number` (optional) - Συνολικό πλήθος ορόφων.
- **constructionYear**: `number` (optional) - Έτος κατασκευής.
- **tags**: `array` of `string` (optional) - Ειδικά χαρακτηριστικά (π.χ. "νεόδμητο", "πρόσοψη").
- **projectId**: `string` - Αναφορά στην `projects` collection.
- **originalId**: `string` - Το ID του εγγράφου στη subcollection.
- **createdAt**: `timestamp` - Ημερομηνία δημιουργίας.

### Collection: `floors`
- **level**: `string` - Επίπεδο ορόφου (π.χ. "1", "Ισόγειο").
- **description**: `string` (optional) - Περιγραφή.
- **floorPlanUrl**: `string` (optional) - URL του PDF της κάτοψης.
- **buildingId**: `string` - Αναφορά στην `buildings` collection.
- **originalId**: `string` - Το ID του εγγράφου στη subcollection.
- **createdAt**: `timestamp` - Ημερομηνία δημιουργίας.

### Collection: `units`
- **identifier**: `string` - Κωδικός ακινήτου (π.χ. "Α1").
- **name**: `string` - Όνομα/Περιγραφή ακινήτου.
- **type**: `string` (optional) - Τύπος (π.χ. "Δυάρι").
- **status**: `string` - (`Διαθέσιμο`, `Κρατημένο`, `Πωλημένο`, `Οικοπεδούχος`).
- **area**: `number` (optional) - Εμβαδόν σε τ.μ.
- **price**: `number` (optional) - Τιμή πώλησης/ενοικίασης.
- **bedrooms**: `number` (optional) - Αριθμός υπνοδωματίων.
- **bathrooms**: `number` (optional) - Αριθμός λουτρών/WC.
- **orientation**: `string` (optional) - Προσανατολισμός.
- **amenities**: `array` of `string` (optional) - Λίστα με παροχές.
- **polygonPoints**: `array` of `map` - Οι συντεταγμένες `{x, y}` του πολυγώνου.
- **levelSpan**: `string` (optional) - Περιγραφικό string για μονάδες πολλαπλών ορόφων (π.χ. "Ισόγειο-1ος").
- **originalId**: `string` - Το ID του εγγράφου στη subcollection.
- **createdAt**: `timestamp` - Ημερομηνία δημιουργίας.
- **Σημείωση για Denormalization**: Για λόγους απόδοσης, κάθε `unit` περιέχει και τα IDs των γονικών του οντοτήτων:
  - **floorIds**: `array` of `string` - Αναφορά στην `floors` collection. Υποστηρίζει πολλαπλούς ορόφους (π.χ. για μεζονέτες).
  - **buildingId**: `string` - Αναφορά στην `buildings` collection.
  - **projectId**: `string` (optional) - Αναφορά στην `projects` collection.
  - **companyId**: `string` (optional) - Αναφορά στην `companies` collection.
  - Αυτή η τεχνική αποτρέπει τα πολλαπλά, διαδοχικά queries (deep lookups) κατά την κατασκευή των breadcrumbs ή σε άλλες λειτουργίες που απαιτούν την πλήρη ιεραρχία, βελτιώνοντας σημαντικά την ταχύτητα της εφαρμογής.

### Collection: `attachments`
- **type**: `string` - (`parking` ή `storage`).
- **details**: `string` (optional) - Λεπτομέρειες (π.χ. "P-1").
- **area**: `number` (optional) - Εμβαδόν σε τ.μ.
- **price**: `number` (optional) - Τιμή.
- **photoUrl**: `string` (optional) - URL φωτογραφίας.
- **unitId**: `string` - Αναφορά στην `units` collection.
- **sharePercentage**: `number` (optional) - Το ποσοστό συνιδιοκτησίας (π.χ. 2.5 για 2.5%).
- **isBundle**: `boolean` (optional) - True αν το παρακολούθημα "ανήκει πακέτο" στο unit.
- **bundleUnitId**: `string` (optional) - Το ID του unit με το οποίο είναι "δεμένο".
- **isStandalone**: `boolean` (optional) - True αν μπορεί να πωληθεί/μεταβιβαστεί ξεχωριστά.
- **createdAt**: `timestamp` - Ημερομηνία δημιουργίας.

---

## 5. Λειτουργικότητα του Floor Plan Viewer

Ο viewer είναι το πιο σύνθετο κομμάτι της εφαρμογής.

- **PDF Canvas**: Χρησιμοποιεί το `react-pdf` για να αποδώσει την κάτοψη. Πάνω από το PDF, τοποθετείται ένα SVG overlay.
- **SVG Overlay**: Όλες οι διαδραστικές λειτουργίες (σχεδίαση, σημεία, πολύγωνα) συμβαίνουν σε αυτό το SVG layer. Αυτό διασφαλίζει ότι δεν επεμβαίνουμε στο ίδιο το PDF.
- **Σχεδίαση & Πολύγωνα (`polygonPoints`)**:
    1.  Ο χρήστης μπαίνει σε "Edit Mode".
    2.  Κάθε κλικ καταγράφεται και οι συντεταγμένες `{x, y}` αποθηκεύονται σε ένα state array (`drawingPolygon`).
    3.  Το SVG σχεδιάζει δυναμικά το περίγραμμα με βάση αυτό το array.
    4.  Με την ολοκλήρωση, το array μετατρέπεται σε JSON string και αποθηκεύεται στο πεδίο `polygonPoints` του αντίστοιχου `unit` στο Firestore.
- **Διαχείριση State με Custom Hooks**: Η πολυπλοκότητα του viewer είναι απομονωμένη σε μια σειρά από εξειδικευμένα custom hooks για να κρατάμε τον κώδικα καθαρό:
    - `useFloorPlanState`: Ο κεντρικός "ενορχηστρωτής" που συνδυάζει όλα τα άλλα hooks.
    - `useZoom`: Διαχειρίζεται τη λογική για το zoom και την περιστροφή.
    - `usePolygonDraw`: Διαχειρίζεται τη σχεδίαση νέων πολυγώνων.
    - `usePrecisionZoom`: Υλοποιεί τη μεγέθυνση ακριβείας με το πλήκτρο Shift.
    - `usePdfHandlers`: Περιέχει τους event handlers (onClick, onMouseMove) του SVG καμβά.
- **Layers & Filtering**: Οι χρήστες μπορούν να φιλτράρουν τα ακίνητα (layers) βάσει του status τους. Το UI επιτρέπει την αλλαγή του χρώματος κάθε layer, και η αλλαγή αυτή αντικατοπτρίζεται δυναμικά σε όλη την εφαρμογή (πολύγωνα, checkboxes, badges).

Αυτή η τεκμηρίωση παρέχει μια σφαιρική εικόνα της εφαρμογής και θα πρέπει να είναι αρκετή για να βοηθήσει οποιονδήποτε νέο developer να κατανοήσει τη δομή και τη ροή της.

    
