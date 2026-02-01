import Stripe from 'stripe';
import { getStripe } from './index';

export interface SubscriptionDetails {
  currentPeriodEnd: Date | null;
  paymentMethodLast4: string | null;
  paymentMethodBrand: string | null;
  cancelAtPeriodEnd: boolean;
  interval: 'month' | 'year' | null;
}

export async function getSubscriptionDetails(
  stripeCustomerId: string
): Promise<SubscriptionDetails> {
  const stripe = getStripe();

  const subscriptions = await stripe.subscriptions.list({
    customer: stripeCustomerId,
    status: 'all',
    limit: 1,
    expand: ['data.default_payment_method'],
  });

  const subscription = subscriptions.data[0];
  if (!subscription) {
    return {
      currentPeriodEnd: null,
      paymentMethodLast4: null,
      paymentMethodBrand: null,
      cancelAtPeriodEnd: false,
      interval: null,
    };
  }

  const pm = subscription.default_payment_method as Stripe.PaymentMethod | null;
  const item = subscription.items.data[0];

  return {
    currentPeriodEnd: item?.current_period_end
      ? new Date(item.current_period_end * 1000)
      : null,
    paymentMethodLast4: pm?.card?.last4 ?? null,
    paymentMethodBrand: pm?.card?.brand ?? null,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    interval: (item?.price?.recurring?.interval as 'month' | 'year') ?? null,
  };
}
