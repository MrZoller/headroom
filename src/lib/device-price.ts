import type { CatalogDevice, DevicePrice } from '@/data/catalog';

const USD = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

function checked(checkedAt: string): string {
  return `Checked ${checkedAt}.`;
}

function unavailableReason(
  reason: Extract<DevicePrice, { kind: 'unavailable' }>['reason']
): string {
  switch (reason) {
    case 'quote-only':
      return 'Price unavailable — sold by quote.';
    case 'no-public-price':
      return 'No public list price.';
    case 'not-announced':
      return 'Price not announced.';
    case 'discontinued':
      return 'No current new price — discontinued.';
    case 'incomplete-system':
      return 'No complete-system price — this row represents only part of a configurable system.';
  }
}

/** Honest purchasing copy for the selected Hardware control. */
export function devicePriceClaim(device: CatalogDevice, count = 1): string {
  const price = device.price;
  if (price.kind === 'unavailable') {
    return `${unavailableReason(price.reason)} ${checked(price.checkedAt)}`;
  }

  const historical = price.availability === 'discontinued';
  const label = historical ? 'Historical US launch list price' : 'US launch list price';
  const each = USD.format(price.usd);
  let amount: string;
  if (count > 1) {
    const total = USD.format(price.usd * count);
    amount =
      price.unit === 'card'
        ? `${count} × ${each} = ${total}, cards only; excludes the rest of the system.`
        : `${count} × ${each} = ${total} for ${count} represented machines.`;
  } else {
    amount =
      price.unit === 'card'
        ? `${each} per card; excludes the rest of the system.`
        : `${each} for the represented machine.`;
  }
  return `${label}: ${amount} Before tax.${historical ? ' Discontinued.' : ''} ${checked(price.checkedAt)}`;
}

/** Compact metadata form; the full selected-control copy remains the authoritative caveat. */
export function devicePriceSummary(device: CatalogDevice): string {
  const price = device.price;
  if (price.kind === 'unavailable') {
    return `${unavailableReason(price.reason)} Checked ${price.checkedAt}`;
  }
  return `${USD.format(price.usd)} US launch list price ${price.unit === 'card' ? 'per card' : 'for the represented machine'}, before tax, checked ${price.checkedAt}${price.availability === 'discontinued' ? ', discontinued' : ''}.`;
}
