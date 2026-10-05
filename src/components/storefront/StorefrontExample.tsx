import { FileSearch } from 'lucide-react';

import { StorefrontSectionIntro } from '@/components/storefront/StorefrontSectionIntro';
import { layout } from '@/config/layout';
import { STOREFRONT, STOREFRONT_COPY as COPY } from '@/config/storefront';
import { cn } from '@/lib/utils';

export function StorefrontExample() {
  return (
    <section
      id={STOREFRONT.sections.example}
      className={cn(layout.storefront.container, layout.storefront.section)}
    >
      <StorefrontSectionIntro {...COPY.example} />
      <div className={layout.storefront.example}>
        <span className={layout.storefront.exampleLabel}>{COPY.example.label}</span>
        <FileSearch className={layout.storefront.exampleIcon} aria-hidden />
        <p className={layout.storefront.placeholderTitle}>{COPY.example.placeholder}</p>
        <p className={layout.storefront.exampleNote}>{COPY.example.note}</p>
      </div>
    </section>
  );
}
