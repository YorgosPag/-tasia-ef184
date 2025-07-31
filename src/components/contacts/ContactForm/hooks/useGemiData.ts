"use client";

import { useState, useEffect } from "react";
import { useWatch, type UseFormReturn } from "react-hook-form";
import { useDebounce } from "use-debounce";
import { parseGemiAddress } from "../utils/addressHelpers";
import type { ContactFormValues } from "@/lib/validation/contactSchema";

const GEMI_API_URL =
  "https://opendata-api.businessportal.gr/api/opendata/v1/companies/";
const GEMI_API_KEY = "b98MlVJ7vDF8gQIWN6d79cgStU8QJp9o";

/**
 * Custom hook to handle fetching and processing data from the GEMH API.
 * It watches the AFM and GEMH number fields, debounces the input,
 * and updates the form with the fetched data.
 */
export function useGemiData(form: UseFormReturn<ContactFormValues>) {
  const arGemiValue = useWatch({ control: form.control, name: "job.arGemi" });
  const afmValue = useWatch({ control: form.control, name: "afm" });

  const [debouncedArGemi] = useDebounce(arGemiValue, 1000);
  const [debouncedAfm] = useDebounce(afmValue, 1000);

  const [isLoadingGemi, setIsLoadingGemi] = useState(false);

  const clearGemiFields = () => {
    form.setValue("job.companyName", "");
    form.setValue("job.companyTitle", "");
    form.setValue("job.commercialTitle", "");
    form.setValue("job.gemhStatus", "");
    form.setValue("job.gemhDate", "");
    form.setValue("job.gemhActivity", "");
    form.setValue("job.gemhDOY", "");
    form.setValue("job.gemhGemiOffice", "");
    form.setValue("job.isBranch", undefined);
    form.setValue("job.autoRegistered", undefined);
    form.setValue("job.legalType", "");
    form.setValue("job.prefecture", "");

    const currentAddresses = form.getValues("addresses") || [];
    const nonGemiAddresses = currentAddresses.filter((addr) => !addr.fromGEMI);
    form.setValue("addresses", nonGemiAddresses, { shouldDirty: true });
  };

  useEffect(() => {
    const fetchGemiData = async () => {
      const searchKey = debouncedArGemi?.trim() || debouncedAfm?.trim();
      if (!searchKey) {
        clearGemiFields();
        return;
      }
      setIsLoadingGemi(true);
      try {
        const response = await fetch(`${GEMI_API_URL}${searchKey}`, {
          headers: { "x-api-key": GEMI_API_KEY },
        });

        if (response.ok) {
          const dataArray = await response.json();
          if (dataArray && dataArray.length > 0) {
            const companyData = dataArray[0];
            form.setValue("job.companyName", companyData.brandName || "", {
              shouldDirty: true,
            });
            form.setValue("job.companyTitle", companyData.title || "", {
              shouldDirty: true,
            });
            form.setValue(
              "job.commercialTitle",
              companyData.distinctiveTitle || "",
              { shouldDirty: true },
            );
            form.setValue("job.gemhStatus", companyData.status || "", {
              shouldDirty: true,
            });
            form.setValue("job.gemhDate", companyData.statusDate || "", {
              shouldDirty: true,
            });
            form.setValue("job.gemhActivity", companyData.activity || "", {
              shouldDirty: true,
            });
            form.setValue("job.gemhDOY", companyData.doy || "", {
              shouldDirty: true,
            });
            form.setValue(
              "job.gemhGemiOffice",
              companyData.gemiOffice?.descr || "",
              { shouldDirty: true },
            );
            form.setValue("job.isBranch", companyData.isBranch || false, {
              shouldDirty: true,
            });
            form.setValue(
              "job.autoRegistered",
              companyData.autoRegistered || false,
              { shouldDirty: true },
            );
            form.setValue("job.legalType", companyData.legalType?.descr || "", {
              shouldDirty: true,
            });
            form.setValue(
              "job.prefecture",
              companyData.prefecture?.descr || "",
              { shouldDirty: true },
            );
            form.setValue("afm", companyData.afm || afmValue, {
              shouldDirty: true,
            });
            form.setValue("job.arGemi", companyData.gemiNo || arGemiValue, {
              shouldDirty: true,
            });

            const rawAddress = companyData.address || "";
            if (rawAddress) {
              const newAddress = parseGemiAddress(
                rawAddress,
                companyData.poBox,
              );
              const currentAddresses = form.getValues("addresses") || [];
              const gemiAddressIndex = currentAddresses.findIndex(
                (addr) => addr.fromGEMI,
              );

              if (gemiAddressIndex > -1) {
                form.setValue(`addresses.${gemiAddressIndex}`, newAddress, {
                  shouldDirty: true,
                });
              } else {
                form.setValue("addresses", [...currentAddresses, newAddress], {
                  shouldDirty: true,
                });
              }
            }
          } else {
            console.warn("GEMH: No company found.");
            clearGemiFields();
          }
        } else if (response.status === 404) {
          console.warn("GEMH: No company found.");
          clearGemiFields();
        } else {
          console.error("Error fetching from GEMI API:", response.statusText);
          clearGemiFields();
        }
      } catch (error) {
        console.error("Network error while fetching from GEMI API:", error);
        clearGemiFields();
      } finally {
        setIsLoadingGemi(false);
      }
    };

    fetchGemiData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedArGemi, debouncedAfm]);

  return { isLoadingGemi };
}
