'use client';

import { FormTextField } from "@/eco/components/form/FormTextField";
import { Control } from "react-hook-form";

interface SocialsSectionProps {
  control: Control<any>;
}

export function SocialsSection({ control }: SocialsSectionProps) {
  return (
      <div className="space-y-4 pt-4">
        <div className="grid md:grid-cols-2 gap-4">
            <FormTextField control={control} name="socials.website" label="Website" type="url" placeholder="https://example.com" />
            <FormTextField control={control} name="socials.facebook" label="Facebook" type="url" placeholder="https://facebook.com/user" />
            <FormTextField control={control} name="socials.instagram" label="Instagram" type="url" placeholder="https://instagram.com/user" />
            <FormTextField control={control} name="socials.tiktok" label="TikTok" type="url" placeholder="https://tiktok.com/@user" />
        </div>
      </div>
  );
}
