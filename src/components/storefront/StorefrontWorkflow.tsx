import { ArrowRight, FileText, ScanLine } from 'lucide-react';

import { StorefrontSectionIntro } from '@/components/storefront/StorefrontSectionIntro';
import { layout } from '@/config/layout';
import { STOREFRONT, STOREFRONT_COPY as COPY } from '@/config/storefront';
import { cn } from '@/lib/utils';

export function StorefrontWorkflow() {
  return (
    <section
      id={STOREFRONT.sections.workflow}
      className={cn(layout.storefront.section, layout.storefront.warmSection)}
    >
      <div className={cn(layout.storefront.container, layout.storefront.workflow)}>
        <StorefrontSectionIntro {...COPY.workflow} />
        <div className={layout.storefront.workflowCanvas}>
          <div className={layout.storefront.workflowPath}>
            <div className={layout.storefront.workflowEndpoint}>
              <FileText className={layout.storefront.workflowIcon} aria-hidden />
              <span>{COPY.workflow.before}</span>
            </div>
            <ArrowRight className={layout.storefront.pathArrow} aria-hidden />
            <div className={layout.storefront.workflowEndpoint}>
              <ScanLine className={layout.storefront.workflowIcon} aria-hidden />
              <span>{COPY.workflow.after}</span>
            </div>
          </div>
          <p className={layout.storefront.placeholderTitle}>{COPY.workflow.placeholder}</p>
          <p className={layout.storefront.helper}>{COPY.workflow.note}</p>
        </div>
      </div>
    </section>
  );
}
