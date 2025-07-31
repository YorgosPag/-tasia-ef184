"use client";

import React, { useEffect, useMemo } from "react";
import algoliasearch from "algoliasearch/lite";
import {
  InstantSearch,
  useSearchBox,
  useInfiniteHits,
  Configure,
} from "react-instantsearch-hooks-web";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { DataTable } from "./DataTable"; // Re-use your DataTable for display
import { ColumnDef } from "@tanstack/react-table";
import { ComplexEntity } from "@/hooks/useComplexEntities";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const PREFERRED_COLUMN_ORDER = [
  "Οικισμοί",
  "Δημοτικές/Τοπικές Κοινότητες",
  "Δημοτικές Ενότητες",
  "Δήμοι",
  "Περιφερειακές ενότητες",
  "Περιφέρειες",
  "Αποκεντρωμένες Διοικήσεις",
  "Μεγάλες γεωγραφικές ενότητες",
];

function SearchBox(props: any) {
  const { query, refine } = useSearchBox(props);

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Αναζήτηση σε όλα τα πεδία..."
        className="pl-10 w-full"
        value={query}
        onChange={(e) => refine(e.target.value)}
        autoFocus
      />
    </div>
  );
}

function Hits({ onHitsChange }: { onHitsChange: (hits: any[]) => void }) {
  const { hits, showMore, isLastPage, results } = useInfiniteHits();

  useEffect(() => {
    onHitsChange(hits);
  }, [hits, onHitsChange]);

  // Dynamically generate columns from the first hit
  const columns = React.useMemo((): ColumnDef<ComplexEntity>[] => {
    if (!hits || hits.length === 0) {
      // Fallback or predefined columns if no hits
      return PREFERRED_COLUMN_ORDER.map((key) => ({
        accessorKey: key,
        header: key,
      }));
    }
    const firstHit = hits[0];
    const keys = Object.keys(firstHit).filter(
      (key) =>
        ![
          "objectID",
          "_highlightResult",
          "type",
          "createdAt",
          "id",
          "uniqueKey",
        ].includes(key),
    );

    keys.sort((a, b) => {
      const indexA = PREFERRED_COLUMN_ORDER.indexOf(a);
      const indexB = PREFERRED_COLUMN_ORDER.indexOf(b);
      if (indexA === -1 && indexB === -1) return a.localeCompare(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });

    return keys.map((key) => ({
      accessorKey: key,
      header: key,
      cell: ({ row }) => {
        const value =
          (row.original as any)._highlightResult?.[key]?.value ||
          (row.original as any)[key];
        return <span dangerouslySetInnerHTML={{ __html: value || "" }} />;
      },
    }));
  }, [hits]);

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={hits as any}
        isLoading={false} // Loading is handled by InstantSearch state
        totalCount={results?.nbHits ?? 0}
        pageSize={results?.hitsPerPage ?? 20}
        page={results?.page ? results.page + 1 : 1}
        canGoNext={!isLastPage}
        canGoPrev={results?.page ? results.page > 0 : false}
        nextPage={showMore}
        prevPage={() => {
          /* Prev page not directly supported in useInfiniteHits */
        }}
        activeFilters={{}} // Filters are handled by Algolia
        initialDataLoaded={true}
      />
      {!isLastPage && (
        <div className="flex justify-center">
          <Button onClick={showMore} variant="outline">
            Φόρτωση Περισσότερων
          </Button>
        </div>
      )}
    </div>
  );
}

export function AlgoliaSearchBox({
  indexName,
  listType,
  onHitsChange,
}: {
  indexName: string;
  listType: string;
  onHitsChange: (hits: any[]) => void;
}) {
  const searchClient = useMemo(
    () =>
      algoliasearch(
        process***REMOVED***.NEXT_PUBLIC_ALGOLIA_APP_ID!,
        process***REMOVED***.NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_API_KEY!,
      ),
    [],
  );

  if (
    !indexName ||
    !process***REMOVED***.NEXT_PUBLIC_ALGOLIA_APP_ID ||
    !process***REMOVED***.NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_API_KEY
  ) {
    return (
      <div className="text-destructive-foreground bg-destructive border border-destructive p-4 rounded-md">
        <strong>Σφάλμα Ρύθμισης Algolia:</strong> Οι μεταβλητές περιβάλλοντος
        για το Algolia δεν έχουν ρυθμιστεί σωστά. Παρακαλώ, ελέγξτε τα
        `NEXT_PUBLIC_ALGOLIA_APP_ID` και
        `NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_API_KEY` στο `***REMOVED***.local` αρχείο σας.
      </div>
    );
  }

  return (
    <div className="w-full">
      <InstantSearch searchClient={searchClient} indexName={indexName}>
        <Configure searchParameters={{ filters: `type:'${listType}'` }} />
        <div className="grid grid-cols-1 gap-4">
          <SearchBox />
          <Hits onHitsChange={onHitsChange} />
        </div>
      </InstantSearch>
    </div>
  );
}
