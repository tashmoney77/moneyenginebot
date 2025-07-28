const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  const sig = event.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`,
    };
  }

  // Handle the event
  switch (stripeEvent.type) {
    case 'checkout.session.completed':
      const session = stripeEvent.data.object;
      console.log('Payment successful for session:', session.id);
      
      // Here you would update your database to upgrade the user
      // For now, we'll just log it
      console.log('User ID:', session.metadata.userId);
      console.log('Customer Email:', session.customer_email);
      
      // In a real app, you'd:
      // 1. Find the user by ID
      // 2. Update their tier to 'pro' or 'premium'
      // 3. Send confirmation email
      // 4. Log the transaction
      
      break;
      
    case 'customer.subscription.deleted':
      const subscription = stripeEvent.data.object;
      console.log('Subscription cancelled:', subscription.id);
      
      // Handle subscription cancellation
      // Downgrade user back to free tier
      
      break;
      
    default:
      console.log(`Unhandled event type ${stripeEvent.type}`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ received: true }),
  };
};