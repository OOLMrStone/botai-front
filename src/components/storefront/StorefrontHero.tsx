import Image from 'next/image';

import { ScreenHeading } from '@/components/onboarding/ScreenHeading';
import { StorefrontAction } from '@/components/storefront/StorefrontAction';
import { layout } from '@/config/layout';
import { STOREFRONT, STOREFRONT_COPY as COPY } from '@/config/storefront';
import { cn } from '@/lib/utils';

export function StorefrontHero({
  entryHref,
  entryLabel,
  showTrial,
}: {
  entryHref: string;
  entryLabel: string;
  showTrial: boolean;
}) {
  return (
    <section className={cn(layout.storefront.container, layout.storefront.hero)}>
      <div className={layout.storefront.heroContent}>
        <p className={layout.storefront.eyebrow}>{COPY.hero.eyebrow}</p>
        <ScreenHeading variant="landingHero" title={COPY.hero.title} />
        <p className={layout.storefront.heroDescription}>{COPY.hero.description}</p>
        <div className={layout.storefront.heroActions}>
          <StorefrontAction href={entryHref} tone="dark">
            {entryLabel}
          </StorefrontAction>
          {showTrial ? (
            <p className={layout.storefront.trial}>
              <strong>{COPY.trial}</strong>
              <span>{COPY.trialDetails}</span>
            </p>
          ) : null}
        </div>
      </div>
      <div className={layout.storefront.heroArt} aria-label={COPY.hero.artLabel}>
        <p className={layout.storefront.artTitle}>{COPY.hero.artTitle}</p>
        <Image
          {...STOREFRONT.mascot}
          alt={COPY.hero.mascotAlt}
          preload
          className={layout.storefront.heroImage}
        />
      </div>
    </section>
  );
}
