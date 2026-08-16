import { describe, expect, it } from 'vitest';
import { getDevice, type CatalogDevice, type DevicePrice } from '@/data/catalog';
import { devicePriceClaim, devicePriceSummary } from './device-price';

function withPrice(price: DevicePrice): CatalogDevice {
  return { ...getDevice('rtx-5090'), price };
}

describe('device pricing copy', () => {
  it('labels one card as a dated US launch price before tax, not a rig price', () => {
    expect(devicePriceClaim(getDevice('rtx-5090'))).toBe(
      'US launch list price: $1,999 per card; excludes the rest of the system. Before tax. Checked 2026-08-16.'
    );
  });

  it('multiplies cards without implying that the total buys a complete system', () => {
    const claim = devicePriceClaim(getDevice('rtx-5090'), 4);
    expect(claim).toContain('4 × $1,999 = $7,996, cards only');
    expect(claim).toContain('excludes the rest of the system');
  });

  it('prices the represented machine rather than multiplying a hidden component', () => {
    expect(devicePriceClaim(getDevice('dgx-spark'), 2)).toContain(
      '2 × $3,999 = $7,998 for 2 represented machines'
    );
  });

  it('marks a discontinued launch price as historical', () => {
    const claim = devicePriceClaim(getDevice('rtx-4090'));
    expect(claim).toContain('Historical US launch list price');
    expect(claim).toContain('Discontinued');
  });

  it.each([
    ['quote-only', 'Price unavailable — sold by quote.'],
    ['no-public-price', 'No public list price.'],
    ['not-announced', 'Price not announced.'],
    ['discontinued', 'No current new price — discontinued.'],
    [
      'incomplete-system',
      'No complete-system price — this row represents only part of a configurable system.',
    ],
  ] as const)('states the %s fallback explicitly', (reason, expected) => {
    const claim = devicePriceClaim(
      withPrice({
        kind: 'unavailable',
        reason,
        checkedAt: '2024-01-02',
        source: 'https://example.com/price',
      })
    );
    expect(claim).toContain(expected);
    // An old check remains visibly old; presentation never silently turns it into a current quote.
    expect(claim).toContain('Checked 2024-01-02');
  });

  it('keeps the same caveats in compact prerender metadata', () => {
    expect(devicePriceSummary(getDevice('rtx-4090'))).toMatch(
      /\$1,599 US launch list price per card, before tax, checked 2026-08-16, discontinued/
    );
    expect(devicePriceSummary(getDevice('mi355x'))).toMatch(
      /sold by quote\. Checked 2026-08-16\.$/
    );
  });
});
