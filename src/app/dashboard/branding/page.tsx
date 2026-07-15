"use client";

import { PageHeader } from "@/components/PageHeader";
import { BrandingEditor } from "@/components/BrandingEditor";
import { ThemeBuilder } from "@/components/ThemeBuilder";
import { EmailTemplatePreview } from "@/components/EmailTemplatePreview";

export default function WorkspaceBrandingPage() {
  return (
    <div className="space-y-8 flex-1">
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <PageHeader
          title="White-Label branding & Customization"
          description="Completely customize the application name, accent theme colors, and layout presets across your workspace."
        />
      </div>

      {/* Branding Configurator Form & Live Preview */}
      <BrandingEditor />

      {/* Layout Presets Selection */}
      <ThemeBuilder />

      {/* Branded newsletter templates previewer */}
      <EmailTemplatePreview />
    </div>
  );
}
export const dynamic = "force-dynamic";
