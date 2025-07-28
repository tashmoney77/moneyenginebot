# Manual Deployment Instructions

Since automatic deployment isn't working, here are the key changes to make:

## 1. Fix Stripe URL (src/lib/stripe.ts)
Replace line 8 with:
```typescript
const response = await fetch(`/.netlify/functions/create-checkout-session`, {
```

## 2. Fix Aggressive Messaging (src/components/Chatbot.tsx)
Around line 150, change the summary generation to be more supportive:

```typescript
// If low-effort responses detected, provide gentle feedback instead of analysis
if (hasLowEffortResponses) {
  return `Hi ${firstName}! Thanks for trying out MoneyEngineBot. 

I'd love to provide you with more detailed, personalized insights about your startup when you're ready to dive deeper.

🎯 **Your Responses So Far:**
${problemResponse || 'No response provided'}
${competitionResponse || 'No response provided'}  
${businessModelResponse || 'No response provided'}

💡 **When you're ready for detailed analysis:**
I can provide much more specific and actionable advice when I understand more about your unique situation.

📞 **Let's Chat:**
Book a free 15-minute strategy call to discuss your startup:
[Schedule Your Free Call →](https://calendly.com/tashmoney/moneyenginebot)

Thanks for checking out MoneyEngineBot! 🚀`;
}
```

## 3. To Deploy These Changes:
1. Download the files from this project
2. Update the code as shown above
3. Upload to your Netlify site via drag-and-drop
4. Or connect to GitHub for automatic deployments

## 4. Connect to GitHub (Best Solution):
1. Netlify Dashboard → Your Site → Site Settings
2. Build & Deploy → Link to repository
3. Connect to: https://github.com/tashmoney77/moneyenginebot
4. Future changes will auto-deploy