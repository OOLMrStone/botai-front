'use client';

import { ArrowUpRight, Check } from 'lucide-react';

import { BillingPeriodSwitch } from '@/components/common/BillingPeriodSwitch';
import { ScreenHeading } from '@/components/onboarding/ScreenHeading';
import { StorefrontSectionIntro } from '@/components/storefront/StorefrontSectionIntro';
import { Button } from '@/components/ui/button';
import { layout } from '@/config/layout';
import { STOREFRONT, STOREFRONT_COPY as COPY } from '@/config/storefront';
import { useStorefrontPricing } from '@/hooks/use-storefront-pricing';
import { cn } from '@/lib/utils';

export function StorefrontPricing() {
  const { period, setPeriod, plans } = useStorefrontPricing();

  return (
    <section
      id={STOREFRONT.sections.pricing}
      className={cn(layout.storefront.section, layout.storefront.warmSection)}
    >
      <div className={layout.storefront.container}>
        <StorefrontSectionIntro {...COPY.pricing} />
        <div className={layout.storefront.pricingToolbar}>
          <div className={layout.storefront.pricingBenefits}>
            <p className={layout.storefront.freePractice}>
              <Check className={layout.storefront.smallIcon} aria-hidden />
              {COPY.pricing.free}
            </p>
            <p className={layout.storefront.trialBenefit}>
              <Check className={layout.storefront.smallIcon} aria-hidden />
              {COPY.pricing.trial}
              {!STOREFRONT.features.trial ? (
                <span className={layout.storefront.trialStatus}>{COPY.pricing.trialStatus}</span>
              ) : null}
            </p>
          </div>
          <BillingPeriodSwitch
            value={period}
            onChange={setPeriod}
            className={layout.storefront.periods}
          />
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
              {plan.recommended ? (
                <span className={layout.storefront.priceBadge}>{COPY.pricing.recommendation}</span>
              ) : null}
              <div className={layout.storefront.priceHeading}>
                <ScreenHeading as="h3" variant="landingCard" title={plan.name} />
              </div>
              <div className={layout.storefront.priceAmount}>
                <p className={layout.storefront.priceValue}>{plan.price}</p>
                <p className={layout.storefront.priceUnit}>
                  {period === 'month' ? COPY.pricing.monthUnit : COPY.pricing.seasonUnit}
                </p>
              </div>
              <p className={layout.storefront.priceQuota}>
                <Check className={layout.storefront.smallIcon} aria-hidden />
                {COPY.pricing.checksIncluded(plan.quota)}
              </p>
              <p className={layout.storefront.priceDetails}>{COPY.pricing.details}</p>
              <Button
                variant="storefrontDark"
                size="default"
                className={cn(layout.storefront.action, layout.storefront.priceAction)}
                disabled
                disabledReason={COPY.pricing.checkoutUnavailable}
              >
                {COPY.pricing.action}
                <ArrowUpRight className={layout.storefront.smallIcon} aria-hidden />
              </Button>
            </article>
          ))}
        </div>
        <p className={layout.storefront.pricingNote}>
          {period === 'season' ? COPY.pricing.seasonNote : COPY.pricing.monthNote}
        </p>
      </div>
    </section>
  );
}
