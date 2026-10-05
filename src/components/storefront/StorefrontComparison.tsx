import { BrandText } from '@/components/onboarding/BrandText';
import { StorefrontSectionIntro } from '@/components/storefront/StorefrontSectionIntro';
import { layout } from '@/config/layout';
import { STOREFRONT_COPY as COPY } from '@/config/storefront';
import { cn } from '@/lib/utils';

export function StorefrontComparison() {
  return (
    <section className={cn(layout.storefront.container, layout.storefront.section)}>
      <StorefrontSectionIntro {...COPY.comparison} />
      <p className={layout.storefront.comparisonHint}>{COPY.comparison.scrollHint}</p>
      <div
        className={layout.storefront.comparison}
        tabIndex={0}
        role="region"
        aria-label={COPY.comparison.scrollLabel}
      >
        <table className={layout.storefront.table}>
          <thead>
            <tr>
              {COPY.comparison.headers.map((title) => (
                <th
                  key={title}
                  scope="col"
                  className={cn(layout.storefront.tableCell, layout.storefront.tableHeading)}
                >
                  <BrandText text={title} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COPY.comparison.rows.map((row) => (
              <tr key={row.label}>
                <th
                  scope="row"
                  className={cn(layout.storefront.tableCell, layout.storefront.tableRowLabel)}
                >
                  {row.label}
                </th>
                {row.values.map((value) => (
                  <td key={value} className={layout.storefront.tableCell}>
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
