"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Loader2, Edit, Save, ShieldX } from "lucide-react";
import { ContactForm } from "@/components/contacts/ContactForm";
import {
  contactSchema,
  ContactFormValues,
  ALL_ACCORDION_SECTIONS,
} from "@/lib/validation/contactSchema";
import { logActivity } from "@/lib/logger";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

function deepClean(obj: any) {
  for (const key in obj) {
    if (obj[key] === undefined) {
      delete obj[key];
    } else if (
      typeof obj[key] === "object" &&
      obj[key] !== null &&
      !(obj[key] instanceof Date) &&
      !(obj[key] instanceof Timestamp)
    ) {
      deepClean(obj[key]);
      if (Object.keys(obj[key]).length === 0) {
        delete obj[key];
      }
    }
  }
  return obj;
}

export function ContactEditViewWrapper({ contactId }: { contactId: string }) {
  const { toast } = useToast();
  const { user, isEditor } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [openSections, setOpenSections] = useState<string[]>(
    ALL_ACCORDION_SECTIONS,
  );
  const [contactName, setContactName] = useState("");
  const hasReset = useRef(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {},
    disabled: !isEditing, // Start as disabled
  });

  const entityType = form.watch("entityType");

  const mapEntityTypeToTab = (type: ContactFormValues["entityType"]) => {
    switch (type) {
      case "Φυσικό Πρόσωπο":
        return "individual";
      case "Νομικό Πρόσωπο":
        return "legal";
      case "Δημ. Υπηρεσία":
        return "public";
      default:
        return "individual";
    }
  };

  useEffect(() => {
    if (!contactId) return;

    hasReset.current = false;
    const fetchContact = async () => {
      setIsLoading(true);
      try {
        const docRef = doc(db, "contacts", contactId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && !hasReset.current) {
          const data = docSnap.data();
          setContactName(data.name || "");

          const formData: ContactFormValues = {
            ...data,
            name: data.name ?? "",
            entityType: data.entityType || "Φυσικό Πρόσωπο",
            id: docSnap.id,
            birthDate:
              data.birthDate instanceof Timestamp
                ? data.birthDate.toDate()
                : null,
            identity: {
              ...data.identity,
              issueDate:
                data.identity?.issueDate instanceof Timestamp
                  ? data.identity.issueDate.toDate()
                  : null,
            },
            addresses: data.addresses || [],
          };
          form.reset(formData, { keepDirty: false });
          hasReset.current = true;
        } else if (!docSnap.exists()) {
          toast({
            variant: "destructive",
            title: "Σφάλμα",
            description: "Η επαφή δεν βρέθηκε.",
          });
        }
      } catch (error) {
        console.error("Error fetching contact:", error);
        toast({
          variant: "destructive",
          title: "Σφάλμα",
          description: "Αποτυχία φόρτωσης δεδομένων.",
        });
      } finally {
        setIsLoading(false);
        setIsEditing(false); // Reset editing state on new contact select
        form.reset({}, { keepValues: true, keepDirty: false }); // Reset dirty state
      }
    };

    fetchContact();
  }, [contactId, form, toast]);

  useEffect(() => {
    form.reset({}, { keepValues: true, keepDirty: false }); // Reset dirty state when contact changes
    setIsEditing(false);
  }, [contactId, form]);

  useEffect(() => {
    if (isEditing) {
      form.enable();
    } else {
      form.disable();
    }
  }, [isEditing, form]);

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);

    let photoUrls = data.photoUrls || {};
    const viewParamForPhoto = mapEntityTypeToTab(data.entityType);

    try {
      if (fileToUpload) {
        toast({
          title: "Ενημέρωση επαφής",
          description: "Ανέβασμα νέας φωτογραφίας...",
        });
        const filePath = `contact-images/${viewParamForPhoto}/${contactId}/${fileToUpload.name}`;
        const storageRef = ref(storage, filePath);
        await uploadBytes(storageRef, fileToUpload);
        const newPhotoUrl = await getDownloadURL(storageRef);
        photoUrls[viewParamForPhoto] = newPhotoUrl;
      }

      const dataToUpdate: { [key: string]: any } = { ...data, photoUrls };

      dataToUpdate.birthDate = data.birthDate
        ? Timestamp.fromDate(new Date(data.birthDate))
        : null;

      if (dataToUpdate.identity) {
        dataToUpdate.identity.issueDate = data.identity?.issueDate
          ? Timestamp.fromDate(new Date(data.identity.issueDate))
          : null;
      }

      if (data.addresses) {
        dataToUpdate.addresses = data.addresses;
      }

      const cleanedData = deepClean(dataToUpdate);
      delete cleanedData.id;

      const docRef = doc(db, "contacts", contactId);
      await updateDoc(docRef, cleanedData);

      setContactName(data.name || ""); // Update displayed name
      form.reset({ ...data, photoUrls }, { keepDirty: false });
      setFileToUpload(null);
      setIsEditing(false);

      await logActivity("UPDATE_CONTACT", {
        entityId: contactId,
        entityType: "contact",
        name: data.name,
        changes: data,
      });
      toast({
        title: "Επιτυχία",
        description: `Οι αλλαγές στην επαφή "${data.name}" αποθηκεύτηκαν.`,
      });
    } catch (error: any) {
      console.error("Error updating contact: ", error);
      toast({
        variant: "destructive",
        title: "Σφάλμα",
        description: `Δεν ήταν δυνατή η ενημέρωση της επαφής: ${error.message}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form id="contact-form" onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="h-full">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{contactName}</CardTitle>
                <CardDescription>{entityType}</CardDescription>
              </div>
              {isEditor &&
                (isEditing ? (
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        form.reset(); // Revert changes
                      }}
                      disabled={isSubmitting}
                    >
                      <ShieldX className="mr-2 h-4 w-4" />
                      Ακύρωση
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting || !form.formState.isDirty}
                    >
                      {isSubmitting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}
                      Αποθήκευση
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Επεξεργασία
                  </Button>
                ))}
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <ContactForm
              form={form}
              onFileSelect={setFileToUpload}
              openSections={openSections}
              onOpenChange={setOpenSections}
            />
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}