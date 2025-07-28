import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_...');

export { stripePromise };

const response = await fetch(`/.netlify/functions/create-checkout-session`, {
  try {
    console.log('🚀 Starting checkout process...');
    console.log('📋 Request data:', { priceId, userId, userEmail });
    console.log('🌐 Function URL:', `${window.location.origin}/.netlify/functions/create-checkout-session`);
    
    const response = await fetch(`${window.location.origin}/.netlify/functions/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        userId,
        userEmail,
        successUrl: `${window.location.origin}/#success`,
        cancelUrl: `${window.location.origin}/#cancel`,
      }),
    });

    console.log('📡 Response status:', response.status);
    console.log('📡 Response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Response error:', response.status, errorText);
      throw new Error(`Checkout failed: ${response.status} - ${errorText}`);
    }

    const { sessionId } = await response.json();
    console.log('✅ Session created:', sessionId);
    
    const stripe = await stripePromise;
    if (!stripe) {
      console.error('❌ Stripe failed to initialize');
      throw new Error('Stripe failed to initialize');
    }

    console.log('🔄 Redirecting to Stripe checkout...');
    const { error } = await stripe.redirectToCheckout({ sessionId });
    
    if (error) {
      console.error('❌ Stripe redirect error:', error);
      throw error;
    }
  } catch (error) {
    console.error('💥 Checkout error:', error);
    throw error;
  }
};