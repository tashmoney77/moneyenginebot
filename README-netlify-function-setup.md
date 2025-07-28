# Netlify Function Setup Instructions

Since the automatic deployment isn't working, here's how to create the function directly in Netlify:

## Method 1: Connect Repository (Easiest)
1. Click "Connect to repository" button in Netlify Functions page
2. This will enable continuous deployment and functions

## Method 2: Manual Function Creation
If connecting repository doesn't work, you can create the function directly:

1. In Netlify Functions page, look for "Create function" or similar button
2. Create a new function named: `create-checkout-session`
3. Copy this code:

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  console.log('Function called with method:', event.httpMethod);
  console.log('Environment check - STRIPE_SECRET_KEY exists:', !!process.env.STRIPE_SECRET_KEY);
  
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { priceId, userId, userEmail, successUrl, cancelUrl } = JSON.parse(event.body);
    
    console.log('Creating session with:', { priceId, userId, userEmail });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      customer_email: userEmail,
      metadata: {
        userId: userId,
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ sessionId: session.id }),
    };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to create checkout session', details: error.message }),
    };
  }
};
```

## Method 3: Environment Variables
Don't forget to add your Stripe keys in:
- Site Settings → Environment Variables
- Add: STRIPE_SECRET_KEY = your_stripe_secret_key
- Add: STRIPE_WEBHOOK_SECRET = your_webhook_secret