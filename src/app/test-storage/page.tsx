'use client';

import { useEffect, useState } from 'react';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

export default function TestStoragePage() {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testPath = 'floor_plans/ZA5TUAKeawKnGcHTKqq3/nm20_Pol_A_5os.pdf'; // Βεβαιώσου ότι υπάρχει
    const storage = getStorage();
    const fileRef = ref(storage, testPath);

    getDownloadURL(fileRef)
      .then((url) => {
        console.log('✅ Success:', url);
        setUrl(url);
      })
      .catch((err) => {
        console.error('❌ Error:', err);
        setError(err.message);
      });
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>📦 Firebase Storage Test</h2>
      {url && (
        <p>
          ✅ Το αρχείο φορτώθηκε:
          <br />
          <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: 'blue' }}>
            Άνοιξε PDF
          </a>
        </p>
      )}
      {error && <p style={{ color: 'red' }}>❌ Σφάλμα: {error}</p>}
      {!url && !error && <p>Φόρτωση...</p>}
    </div>
  );
}
