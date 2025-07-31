
"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function InstructionsDialog({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Οδηγίες Χρήσης</DialogTitle>
          <DialogDescription>
            Ακολουθούν οι οδηγίες για την εφαρμογή Εξοικονομώ.
          </DialogDescription>
        </DialogHeader>
        <div className="prose prose-sm dark:prose-invert">
          <p>
            Καλώς ήρθατε στην εφαρμογή διαχείρισης έργων του προγράμματος
            &quot;Εξοικονομώ&quot;.
          </p>
          <ul>
            <li>
              <strong>Πίνακας Ελέγχου:</strong> Συνολική επισκόπηση της
              κατάστασης των έργων σας.
            </li>
            <li>
              <strong>Λίστα Έργων:</strong> Διαχειριστείτε όλα τα ενεργά και
              ολοκληρωμένα έργα σας.
            </li>
            <li>
              <strong>Λίστα Επαφών:</strong> Κεντρική διαχείριση των επαφών σας,
              πελατών, συνεργατών και προμηθευτών.
            </li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  )
}
