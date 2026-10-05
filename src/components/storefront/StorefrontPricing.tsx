'use client';

import { Check } from 'lucide-react';

import { ScreenHeading } from '@/components/onboarding/ScreenHeading';
import { StorefrontAction } from '@/components/storefront/StorefrontAction';
import { StorefrontSectionIntro } from '@/components/storefront/StorefrontSectionIntro';
import { Button } from '@/components/ui/button';
import { layout } from '@/config/layout';
import { STOREFRONT, STOREFRONT_COPY as COPY } from '@/config/storefront';
import { STOREFRONT_PERIODS } from '@/config/storefront-pricing';
import { useStorefrontPricing } from '@/hooks/use-storefront-pricing';
import { cn } from '@/lib/utils';

export function StorefrontPricing({ entryHref }: { entryHref: string }) {
  const { period, setPeriod, plans } = useStorefrontPricing();

  return (
    <section
      id={STOREFRONT.sections.pricing}
      className={cn(layout.storefront.section, layout.storefront.warmSection)}
    >
      <div className={layout.storefront.container}>
        <StorefrontSectionIntro {...COPY.pricing} />
        <div className={layout.storefront.trialBanner}>
          <p className={layout.storefront.trialTitle}>{COPY.trial}</p>
          <p className={layout.storefront.helper}>{COPY.trialDetails}</p>
        </div>
        <div className={layout.storefront.pricingToolbar}>
          <p className={layout.storefront.freePractice}>
            <Check className={layout.storefront.icon} aria-hidden />
            {COPY.pricing.free}
          </p>
          <div
            className={layout.storefront.periods}
            role="group"
            aria-label={COPY.pricing.periodLabel}
          >
            {STOREFRONT_PERIODS.map((option) => (
              <Button
                key={option.id}
                variant="ghost"
                size="default"
                aria-pressed={period === option.id}
                onClick={() => setPeriod(option.id)}
                className={cn(
                  layout.storefront.periodButton,
                  period === option.id && layout.storefront.periodSelected,
                )}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
        <div className={layout.storefront.pricingGrid}>
          {plans.map((plan) => (
            <article
              key={plan.id}
              className={cn(
                layout.storefront.priceCard,
                plan.recommended && layout.storefront.priceRecommended,
              )}
            >
              <div className={layout.storefront.priceHeading}>
                <ScreenHeading as="h3" variant="landingCard" title={plan.name} />
                {plan.recommended ? (
                  <p className={layout.storefront.priceRecommendation}>
                    {COPY.pricing.recommendation}
                  </p>
                ) : null}
              </div>
              <div className={layout.storefront.priceAmount}>
                <p className={layout.storefront.priceValue}>{plan.price}</p>
                <p className={layout.storefront.helper}>
                  {period === 'month' ? COPY.pricing.monthUnit : COPY.pricing.seasonUnit}
                </p>
              </div>
              <p className={layout.storefront.priceQuota}>
                <span className={layout.storefront.quotaValue}>{plan.quota}</span>
                {COPY.pricing.quota}
              </p>
              <StorefrontAction
                href={entryHref}
                tone="dark"
                className={layout.storefront.priceAction}
              >
                {COPY.pricing.action}
              </StorefrontAction>
            </article>
          ))}
        </div>
        {period === 'season' ? (
          <p className={layout.storefront.pricingNote}>{COPY.pricing.seasonNote}</p>
        ) : null}
      </div>
    </section>
  );
}
