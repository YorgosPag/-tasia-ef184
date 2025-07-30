'use client';

import React, { useEffect, useState } from 'react';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

export function TestDownloadUrl() {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testPath = 'floor_plans/ZA5TUAKeawKnGcHTKqq3/nm20_Pol_A_5os.pdf'; // ✅ Hardcoded path for testing
    const storage = getStorage();
    const fileRef = ref(storage, testPath);

    getDownloadURL(fileRef)
      .then((url) => {
        setUrl(url);
        console.log('✅ Success:', url);
      })
      .catch((err) => {
        setError(`${err.code}: ${err.message}`);
        console.error('❌ Error:', err);
      });
  }, []);

  return (
    <div className="p-4 border rounded-md">
      <h2 className="text-lg font-bold mb-2">Test Download URL</h2>
      {url && (
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
          Δες το PDF εδώ
        </a>
      )}
      {error && <p className="text-red-500">Σφάλμα: {error}</p>}
      {!url && !error && <p>Φόρτωση...</p>}
    </div>
  );
}
