import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import UpgradeModal from './UpgradeModal';
import { Message } from '../types';
import { Send, Bot, User, Sparkles, Lock, ArrowRight, Shield, FileText } from 'lucide-react';
import FreeTierOnboarding from './FreeTierOnboarding';

interface ControlledQuestion {
  question: string;
  placeholder: string;
  followUp: string;
}

const Chatbot: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(user?.tier === 'free' && user?.questionsAnswered === 0);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [currentControlledQuestionIndex, setCurrentControlledQuestionIndex] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [userResponses, setUserResponses] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Autosave functionality
  useEffect(() => {
    const savedInput = localStorage.getItem(`chatbot-input-${user?.id}`);
    if (savedInput) {
      setInputValue(savedInput);
    }
  }, [user?.id]);

  useEffect(() => {
    if (inputValue.trim()) {
      localStorage.setItem(`chatbot-input-${user?.id}`, inputValue);
    } else {
      localStorage.removeItem(`chatbot-input-${user?.id}`);
    }
  }, [inputValue, user?.id]);
  // Controlled questions for free tier users
  const controlledQuestions: ControlledQuestion[] = [
    {
      question: "Let's start with the foundation of your startup. I need to understand three key things:\n\n1) What specific problem does your startup solve, and who exactly experiences this problem?\n2) What 'job' are your customers currently 'hiring' other solutions to do? (Think about what they're trying to accomplish, not just the problem)\n3) What triggers someone to look for a solution like yours?\n\nBe as detailed as possible about your target audience and the underlying job they need done.",
      placeholder: "Describe the problem, target customers, the 'job to be done', and what triggers the need...",
      followUp: "Great! Understanding your problem and audience is crucial. Now let's explore the competitive landscape..."
    },
    {
      question: "Now I'd like to understand your competitive advantage. How are people currently solving this problem without your solution, and what makes your approach better or different?",
      placeholder: "Explain current solutions and why yours is better...",
      followUp: "Excellent insight into your differentiation. Now let's talk about the business model..."
    },
    {
      question: "Finally, let's discuss sustainability and validation. How will you make money from this solution, and what evidence do you have (or plan to gather) that people will actually pay for it?",
      placeholder: "Describe your revenue model and any validation evidence...",
      followUp: "Perfect! You've covered the three foundational elements every successful startup needs to address."
    }
  ];

  const questionsAsked = messages.filter(m => m.sender === 'user').length;
  const questionsLimit = user?.tier === 'free' ? 3 : user?.tier === 'pro' ? 50 : Infinity;
  const canAskQuestions = questionsAsked < questionsLimit;
  const questionsRemaining = questionsLimit - questionsAsked;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with first controlled question for free users after onboarding
  useEffect(() => {
    // If user has a summary, show it first
    if (user?.summary && messages.length === 0) {
      const summaryMessage: Message = {
        id: 'saved-summary',
        content: user.summary,
        sender: 'bot',
        timestamp: user.summaryDate || new Date().toISOString(),
        type: 'summary'
      };
      setMessages([summaryMessage]);
      setShowSummary(true);
      return;
    }
    
    if (!showOnboarding && user?.tier === 'free' && messages.length === 0) {
      const initialMessage: Message = {
        id: '1',
        content: `Hi ${user.name?.split(' ')[0]}! I'm your AI startup coach. I'm here to help you validate your ideas and overcome challenges. Let's start by exploring the three foundational questions that every successful startup must answer, including the critical "Jobs To Be Done" framework that most founders overlook.\n\n${controlledQuestions[0].question}`,
        sender: 'bot',
        timestamp: new Date().toISOString(),
        type: 'question'
      };
      setMessages([initialMessage]);
    } else if (user?.tier !== 'free' && messages.length === 0) {
      const initialMessage: Message = {
        id: '1',
        content: `Hi ${user?.name?.split(' ')[0]}! I'm your AI startup coach. I'm here to help you validate your ideas, overcome challenges, and grow your business. What's the biggest challenge you're facing with your startup right now?`,
        sender: 'bot',
        timestamp: new Date().toISOString(),
        type: 'question'
      };
      setMessages([initialMessage]);
    }
  }, [showOnboarding, user, messages.length]);

  const generateBotResponse = (userMessage: string, questionIndex: number): string => {
    if (user?.tier === 'free' && questionIndex < controlledQuestions.length - 1) {
      // For free users, provide the follow-up and next question
      const currentQ = controlledQuestions[questionIndex];
      const nextQ = controlledQuestions[questionIndex + 1];
      return `${currentQ.followUp}\n\n${nextQ.question}`;
    } else if (user?.tier === 'free' && questionIndex === controlledQuestions.length - 1) {
      // Last controlled question response
      return controlledQuestions[questionIndex].followUp + "\n\nYou've now answered the three most critical questions for any startup. Let me provide you with a comprehensive analysis and next steps based on your responses.";
    } else {
      // Pro/Premium users get dynamic responses
      const responses = [
        "That's a common challenge many founders face. Here's what I'd recommend: Focus on validating your core value proposition first. Can you tell me more about how you're currently measuring customer interest?",
        "Interesting perspective! Based on what you've shared, I see potential in three key areas: market validation, product-market fit, and customer acquisition strategy. Which area feels most urgent to you right now?",
        "Great insight! This reminds me of similar patterns I've seen with other successful startups. Have you considered running a small experiment to test this hypothesis? I can help you design one.",
        "That's a solid foundation to build on. Let me suggest a framework that might help: Start with your riskiest assumptions and work backwards. What's the one thing that, if proven wrong, would fundamentally change your approach?"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
  };

  const generateSummary = (responses?: string[]): string => {
    // Use passed responses array
    const currentResponses = responses || [];
    const firstName = user?.name?.split(' ')[0] || 'there';
    
    console.log('🔍 Summary generation - responses received:', currentResponses);
    
    // Extract key insights from user responses
    const problemResponse = currentResponses[0] || '';
    const competitionResponse = currentResponses[1] || '';
    const businessModelResponse = currentResponses[2] || '';
    
    console.log('📝 Problem Response (index 0):', problemResponse);
    console.log('🏆 Competition Response (index 1):', competitionResponse);
    console.log('💰 Business Model Response (index 2):', businessModelResponse);
    
    // Detect low-effort responses
    const detectLowEffortResponse = (response: string): boolean => {
      const lowEffortIndicators = [
        response.trim().length < 20, // Very short responses
        /^(test|testing|idk|i don't know|nothing|none|no|yes|maybe)$/i.test(response.trim()),
        /^(crap|garbage|trash|whatever|dunno|stuff|things)$/i.test(response.trim()),
        response.split(' ').length < 5, // Less than 5 words
        /^(.)\1{3,}/.test(response), // Repeated characters like "aaaa" or "1111"
        response.toLowerCase().includes('just testing'),
        response.toLowerCase().includes('random text'),
      ];
      return lowEffortIndicators.some(indicator => indicator);
    };

    const hasLowEffortResponses = [problemResponse, competitionResponse, businessModelResponse]
      .some(response => detectLowEffortResponse(response));

    // If low-effort responses detected, provide gentle feedback instead of analysis
    if (hasLowEffortResponses) {
      return `Hi ${firstName}! Thanks for completing the three foundational questions. I'd love to provide you with more detailed, personalized insights about your startup.

🎯 **Your Current Responses:**

**Problem & Jobs-To-Be-Done Analysis:**
${problemResponse || 'No response provided'}

**Competitive Landscape & Differentiation:**
${competitionResponse || 'No response provided'}

**Business Model & Revenue Strategy:**
${businessModelResponse || 'No response provided'}

💡 **Getting More Value:**

I'd love to give you more specific and actionable advice! When I understand more details about your unique situation, I can provide much better insights.

📋 **For Even Better Insights, Consider Sharing:**

**For Problem Discovery, I need to know:**
• Who specifically has this problem? (demographics, job titles, company size)
• What exact words do they use to describe the problem?
• What triggers them to look for a solution?
• What's the cost of NOT solving this problem?
• What "job" are they trying to get done?

**For Competitive Analysis, tell me:**
• What are people using RIGHT NOW to solve this?
• Why do current solutions fail them?
• What would make someone switch to your solution?
• What's your unfair advantage?

**For Business Model, be specific about:**
• Exactly how you'll make money (pricing model)
• What evidence suggests people will pay?
• What's your target price point and why?
• How will you acquire customers?

🚀 **Next Steps:**

1. **Book a Strategy Call** to discuss your startup in depth with a human coach
2. **Upgrade to Pro** for unlimited questions and deeper analysis
3. **Use the Templates** to structure your customer research

📞 **Let's Dive Deeper:**
I'd love to chat more about your startup! Book a free 15-minute strategy call:

**📞 [Schedule Your Free 15-Min Strategy Call →](https://calendly.com/tashmoney/moneyenginebot)**

💪 **Ready for More?**
Consider upgrading to Pro for unlimited coaching questions. We can work together to build a validation plan that fits your specific startup.

Your startup journey is exciting - I'm here to help you succeed! 🎯`;
    }

     // Generate specific, actionable insights based on responses
     const generateSpecificInsights = () => {
       let insights = [];
       
       // Deep analysis of problem/JTBD response
       const problemLower = problemResponse.toLowerCase();
       
       if (problemLower.includes('b2b') || problemLower.includes('business') || problemLower.includes('enterprise')) {
         insights.push("🎯 **B2B Opportunity**: Your enterprise focus is strategic. B2B customers have 5-10x higher lifetime values than consumers. Focus on identifying the economic buyer (who controls budget) vs. the end user (who experiences the problem).");
       } else if (problemLower.includes('consumer') || problemLower.includes('b2c') || problemLower.includes('personal')) {
         insights.push("🎯 **Consumer Market**: You're targeting a large market with viral potential. Your biggest challenge will be customer acquisition cost. Plan for organic growth mechanisms from day one.");
       }
       
       if (problemLower.includes('time') || problemLower.includes('efficiency') || problemLower.includes('faster') || problemLower.includes('save')) {
         insights.push("⏰ **Time-Saving Value**: Time is the ultimate currency. Quantify exactly how many hours/minutes you save users. If you save someone 2 hours/week, that's 104 hours/year - worth $2,000+ to most professionals.");
       }
       
       if (problemLower.includes('manual') || problemLower.includes('spreadsheet') || problemLower.includes('email') || problemLower.includes('paper')) {
         insights.push("🔄 **Process Automation**: You're replacing manual workflows - excellent! These users are already paying the 'cost' in time/frustration. Your job is to make the switch obvious and easy.");
       }
       
       // Competition analysis
       const competitionLower = competitionResponse.toLowerCase();
       
       if (competitionLower.includes('no competition') || competitionLower.includes('no competitors') || competitionLower.includes('nothing like this')) {
         insights.push("🚨 **Red Flag Alert**: 'No competition' usually means no market. People are solving this problem somehow - find those workarounds. They're your real competition and your validation goldmine.");
       } else if (competitionLower.includes('expensive') || competitionLower.includes('costly') || competitionLower.includes('price')) {
         insights.push("💰 **Pricing Strategy**: Competing on price alone is dangerous. Instead, find a specific niche where you can charge premium prices. Better to own 100% of a small market than 1% of a big one.");
       } else if (competitionLower.includes('complex') || competitionLower.includes('complicated') || competitionLower.includes('difficult')) {
         insights.push("⚡ **Simplicity Advantage**: Complexity is your opportunity. Focus on the 20% of features that solve 80% of the problem. Your competitive advantage is what you DON'T build.");
       }
       
       // Business model insights
       const businessLower = businessModelResponse.toLowerCase();
       
       if (businessLower.includes('subscription') || businessLower.includes('saas') || businessLower.includes('monthly')) {
         insights.push("📈 **SaaS Model**: Recurring revenue is the holy grail. Your key metrics: Monthly churn <5%, Customer Lifetime Value >3x Customer Acquisition Cost. Focus on onboarding - 90% of churn happens in the first 30 days.");
       } else if (businessLower.includes('marketplace') || businessLower.includes('commission') || businessLower.includes('platform')) {
         insights.push("🏪 **Marketplace Dynamics**: You have a chicken-and-egg problem. Start with one side first - usually the supply side (easier to recruit). Get 10 great suppliers before focusing on demand.");
       } else if (businessLower.includes('one-time') || businessLower.includes('purchase') || businessLower.includes('buy once')) {
         insights.push("💵 **One-Time Revenue**: Higher upfront prices but no recurring revenue. Focus on referrals and upsells. Consider: Can you add a service/support layer for recurring income?");
       } else if (businessLower.includes('freemium') || businessLower.includes('free tier')) {
         insights.push("🎁 **Freemium Strategy**: Only 2-5% of free users typically convert. Make sure your free tier creates a 'drug-like' dependency. The upgrade should feel inevitable, not optional.");
       }
       
       return insights.length > 0 ? insights : [
         "🎯 **Foundation Analysis**: Your responses show strategic thinking about the core startup elements. Focus on customer validation as your next critical step."
       ];
     };
     
     // Generate specific next steps based on their responses
     const generateSpecificNextSteps = () => {
       let steps = [];
       
       // Customer interview questions based on their problem
       const problemLower = problemResponse.toLowerCase();
       let interviewHint = "Tell me about the last time you experienced [their problem]";
       
       if (problemLower.includes('time') || problemLower.includes('efficiency')) {
         interviewHint = "Walk me through your current process for [their workflow]. How long does it typically take?";
       } else if (problemLower.includes('decision') || problemLower.includes('choose') || problemLower.includes('compare')) {
         interviewHint = "Tell me about the last time you had to [make this decision]. What information did you wish you had?";
       } else if (problemLower.includes('track') || problemLower.includes('manage') || problemLower.includes('organize')) {
         interviewHint = "Show me how you currently [track/manage] this. What's frustrating about your current system?";
       }
       
       steps.push(`**Customer Interview Script**: Start with: "${interviewHint}" - This gets them telling stories, not giving opinions.`);
       
       // Validation experiments based on business model
       const businessLower = businessModelResponse.toLowerCase();
       if (businessLower.includes('subscription') || businessLower.includes('saas')) {
         steps.push("**SaaS Validation**: Create a simple landing page with pricing. Track email signups vs. 'Request Demo' clicks. Aim for 15%+ conversion to demo requests.");
       } else if (businessLower.includes('marketplace')) {
         steps.push("**Marketplace Validation**: Start with a simple directory/list. Can you get 50 suppliers to list themselves? Then test if people actually search/contact them.");
       } else {
         steps.push("**Product Validation**: Create a detailed mockup or demo. Show it to 20 potential customers. Ask: 'Would you pay $X for this?' Get specific commitments.");
       }
       
       steps.push("**Competitive Deep Dive**: List every way people currently solve this problem (including doing nothing). Interview users of each alternative - why do they stick with it?");
       steps.push("**Value Proposition Testing**: Write 3 different one-sentence descriptions of your solution. Test them with potential customers. Which one makes them ask 'How does it work?'");
       steps.push("**Early Customer Pipeline**: Identify exactly where your ideal customers hang out (online communities, events, publications). Start building relationships before you need them.");
       
       return steps;
     };
     
     const specificInsights = generateSpecificInsights();
     const specificNextSteps = generateSpecificNextSteps();
    
    return `Hi ${firstName}! Based on our conversation, here's your personalized startup analysis:

🎯 **Your Startup Foundation Recap:**

**Problem & Jobs-To-Be-Done Analysis:**
${problemResponse || 'No response provided'}

**Competitive Landscape & Differentiation:**
${competitionResponse || 'No response provided'}

**Business Model & Revenue Strategy:**
${businessModelResponse || 'No response provided'}

💡 **Personalized Insights for Your Startup:**
${specificInsights.join('\n\n')}

📋 **Your Specific Next Steps:**
${specificNextSteps.map((step, index) => `${index + 1}. ${step}`).join('\n')}

📊 **Key Funnel Metrics to Track:**
• **Discovery Interviews**: Target 20 interviews → 14+ confirm the problem exists (70% validation rate)
• **Solution Interviews**: Target 15 solution demos → 10+ say "I'd use this" (67% interest rate)  
• **Pricing Validation**: Target 10 pricing conversations → 6+ give specific budget ranges (60% buying intent)
• **Early Adopter Pipeline**: Target 100 prospects → 20 email signups → 5 pilot customers (5% conversion)
• **Pilot to Paid**: Target 5 pilot users → 3 convert to paid (60% pilot conversion)

📧 **Get Your Summary & Next Steps:**
I'm sending a copy of this analysis to your email for easy reference. You'll also receive:
• Detailed customer interview templates
• Experiment tracking spreadsheets  
• Weekly validation tips

📅 **Want to Discuss Your Strategy?**
Book a free 15-minute strategy call with Tash Jefferies (MoneyEngineBot founder) to discuss your specific situation and get personalized advice.

**📞 [Schedule Your Free 15-Min Strategy Call →](https://calendly.com/tashmoney/moneyenginebot)**

🚀 **Ready for Unlimited Coaching?**
Upgrade to Pro to get:
• Unlimited personalized coaching questions
• Custom experiment templates for your business model
• Real-time validation tracking dashboard
• Direct access to Tash for strategic guidance

${firstName}, are you ready to take the next step in validating your startup?`;
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() || !canAskQuestions) return;

    // Get the current question index BEFORE adding the new message
    const currentQuestionIndex = messages.filter(m => m.sender === 'user').length;
    const currentResponse = inputValue.trim();
    
    console.log('💾 Capturing response for question', currentQuestionIndex + 1, ':', currentResponse);
    
    // Update responses array immediately
    const updatedResponses = [...userResponses];
    updatedResponses[currentQuestionIndex] = currentResponse;
    setUserResponses(updatedResponses);
    
    console.log('📋 Updated responses array:', updatedResponses);

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      sender: 'user',
      timestamp: new Date().toISOString(),
      type: 'question'
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Clear autosaved input after successful send
    localStorage.removeItem(`chatbot-input-${user?.id}`);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateBotResponse(inputValue, currentControlledQuestionIndex),
        sender: 'bot',
        timestamp: new Date().toISOString(),
        type: 'response'
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);

      // Update controlled question index for free users
      if (user?.tier === 'free') {
        setCurrentControlledQuestionIndex(prev => prev + 1);
      }

      // Show summary after 3 questions for free users
      if (questionsAsked + 1 >= 3 && user?.tier === 'free') {
        setTimeout(() => {
          console.log('📊 Generating summary with final responses:', updatedResponses);
          const summaryContent = generateSummary(updatedResponses);
          const summaryMessage: Message = {
            id: (Date.now() + 2).toString(),
            content: summaryContent,
            sender: 'bot',
            timestamp: new Date().toISOString(),
            type: 'summary'
          };
          setShowSummary(true);
          setMessages(prev => [...prev, summaryMessage]);
          
          // Save summary to user profile
          updateUser({ 
            summary: summaryContent, 
            summaryDate: new Date().toISOString(),
            questionsAnswered: 3
          });
          
          // Send email copy to user and admin
          sendSummaryEmails(summaryContent);
        }, 1000);
      }
      
      // Update questions answered count
      updateUser({ questionsAnswered: (user?.questionsAnswered || 0) + 1 });
    }, 1500 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getCurrentPlaceholder = (): string => {
    if (!canAskQuestions) {
      return "Upgrade to continue asking questions";
    }
    
    if (user?.tier === 'free' && currentControlledQuestionIndex < controlledQuestions.length) {
      return controlledQuestions[currentControlledQuestionIndex].placeholder;
    }
    
    return "Ask me anything about your startup...";
  };
  
  const sendSummaryEmails = (summary: string) => {
    // Show immediate feedback to user
    alert('📧 Analysis sent to your email! Check your inbox for the complete summary and next steps.');
    
    // Email to user
    const userEmailData = {
      to: user?.email,
      subject: `Your MoneyEngineBot Startup Analysis - ${user?.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #3B82F6, #8B5CF6); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">MoneyEngineBot</h1>
            <p style="color: white; margin: 10px 0 0 0;">Your Personalized Startup Analysis</p>
          </div>
          <div style="padding: 20px; background: #f9f9f9;">
            <pre style="white-space: pre-wrap; font-family: Arial, sans-serif; line-height: 1.6;">${summary}</pre>
          </div>
          <div style="padding: 20px; text-align: center; background: #f3f4f6;">
            <p style="margin: 0; color: #6b7280;">Ready to take the next step?</p>
            <a href="https://calendly.com/tashmoney/moneyenginebot" style="display: inline-block; margin-top: 10px; padding: 12px 24px; background: linear-gradient(135deg, #3B82F6, #8B5CF6); color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">📞 Schedule Your Free 15-Min Strategy Call</a>
          </div>
        </div>
      `
    };
    
    // Email to admin
    const adminEmailData = {
      to: 'tash@moneyengine.co',
      subject: `New MoneyEngineBot Analysis - ${user?.name} (${user?.email})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #8B5CF6, #EC4899); padding: 20px;">
            <h1 style="color: white; margin: 0;">New User Analysis</h1>
            <p style="color: white; margin: 10px 0 0 0;">User: ${user?.name} (${user?.email})</p>
          </div>
          <div style="padding: 20px; background: #f9f9f9;">
            <h3>User Details:</h3>
            <ul>
              <li><strong>Name:</strong> ${user?.name}</li>
              <li><strong>Email:</strong> ${user?.email}</li>
              <li><strong>Tier:</strong> ${user?.tier}</li>
              <li><strong>Joined:</strong> ${new Date(user?.joinedAt || '').toLocaleDateString()}</li>
            </ul>
            <h3>Analysis Summary:</h3>
            <pre style="white-space: pre-wrap; font-family: Arial, sans-serif; line-height: 1.6; background: white; padding: 15px; border-radius: 8px;">${summary}</pre>
          </div>
        </div>
      `
    };
    
    // For testing - log the email data (you can see these in browser console)
    console.log('📧 USER EMAIL:', userEmailData);
    console.log('📧 ADMIN EMAIL:', adminEmailData);
    
    // In production, you would send these via your email service:
    // await emailService.send(userEmailData);
    // await emailService.send(adminEmailData);
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      {showOnboarding && (
        <FreeTierOnboarding onComplete={() => setShowOnboarding(false)} />
      )}
      
      {/* Header */}
      <div className="bg-white rounded-t-xl shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">AI Startup Coach</h2>
              <p className="text-sm text-gray-500">Always here to help you succeed</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-700">
              {user?.tier === 'free' ? (
                <span className={questionsRemaining <= 1 ? 'text-orange-600' : 'text-gray-700'}>
                  {questionsRemaining} questions remaining
                </span>
              ) : (
                <span>Questions: {questionsAsked}/{questionsLimit === Infinity ? '∞' : questionsLimit}</span>
              )}
            </div>
            <div className="text-xs text-gray-500 capitalize">{user?.tier} Plan</div>
          </div>
        </div>
        
        {/* Privacy Notice */}
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center text-sm text-blue-800">
            <Shield className="h-4 w-4 mr-2 text-blue-600" />
            <span>
              <strong>Privacy Guarantee:</strong> Only you and your MoneyEngineBot coach can see your responses. 
              All information is confidential and never shared outside our coaching team.
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
        <div className="space-y-6">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-3xl ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                <div className={`flex items-start space-x-3 ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === 'user' 
                      ? 'bg-blue-600' 
                      : message.type === 'summary' 
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600'
                  }`}>
                    {message.sender === 'user' ? (
                      <User className="h-5 w-5 text-white" />
                    ) : message.type === 'summary' ? (
                      <Sparkles className="h-5 w-5 text-white" />
                    ) : (
                      <Bot className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <div className={`rounded-xl px-4 py-3 ${
                    message.sender === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : message.type === 'summary'
                        ? 'bg-gradient-to-r from-yellow-50 to-orange-50 text-gray-800 border border-yellow-200'
                        : 'bg-white text-gray-800 shadow-sm'
                  }`}>
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    <div className={`text-xs mt-2 ${
                      message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div className="bg-white rounded-xl px-4 py-3 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!canAskQuestions && user?.tier === 'free' && showSummary && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready for More Insights?</h3>
                  <p className="text-gray-600 mb-4">
                    Access your downloadable templates and resources, or upgrade to Pro for unlimited coaching.
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <FileText className="h-4 w-4 mr-2" />
                    <span>Templates available • Strategy call recommended</span>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <button 
                    onClick={() => window.location.hash = 'resources'}
                    className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg flex items-center"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Get Templates
                  </button>
                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg flex items-center"
                  >
                    Upgrade to Pro
                  </button>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
        
        <UpgradeModal 
          isOpen={showUpgradeModal} 
          onClose={() => setShowUpgradeModal(false)} 
        />
      </div>

      {/* Input */}
      <div className="bg-white rounded-b-xl shadow-sm border-t px-6 py-4">
        {user?.tier === 'free' && questionsRemaining <= 1 && questionsRemaining > 0 && (
          <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center">
              <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-xs font-bold">{questionsRemaining}</span>
              </div>
              <p className="text-sm text-orange-800">
                You have {questionsRemaining} question{questionsRemaining === 1 ? '' : 's'} remaining. 
                Make it count to get the best insights!
              </p>
            </div>
          </div>
        )}
        
        <div className="flex items-end space-x-4">
          <div className="flex-1">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={getCurrentPlaceholder()}
              disabled={!canAskQuestions}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              rows={2}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || !canAskQuestions}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        
        {!canAskQuestions && user?.tier !== 'free' && (
          <div className="mt-3 text-center text-sm text-gray-500">
            You've reached your question limit for this session. Questions reset daily.
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatbot;