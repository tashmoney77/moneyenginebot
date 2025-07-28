import React from 'react';
import { Download, MessageSquare, Target, Users } from 'lucide-react';

const CustomerInterviewTemplate: React.FC = () => {
  const downloadTemplate = () => {
    const templateContent = `
CUSTOMER INTERVIEW TEMPLATE
===========================

PREPARATION:
□ Research the interviewee's background
□ Prepare 5-7 open-ended questions
□ Set up recording (with permission)
□ Block 30-45 minutes

OPENING (5 minutes):
"Hi [Name], thanks for taking the time. I'm working on [brief description] and would love to learn about your experience with [problem area]. This isn't a sales call - I'm just trying to understand the problem better. Mind if I record this for my notes?"

PROBLEM DISCOVERY (15-20 minutes):
1. "Tell me about the last time you experienced [problem]."
   - Follow up: "Walk me through that process step by step."
   - Follow up: "What was most frustrating about that?"

2. "How do you currently handle [situation]?"
   - Follow up: "What tools/methods do you use?"
   - Follow up: "What do you like/dislike about that approach?"

3. "What triggers you to look for a solution to this?"
   - Follow up: "How often does this happen?"
   - Follow up: "What's the cost of not solving it?"

SOLUTION VALIDATION (10-15 minutes):
4. "I'm thinking about building [brief solution description]. What's your initial reaction?"
   - Follow up: "What concerns would you have?"
   - Follow up: "What would make you definitely want to try it?"

CLOSING (5 minutes):
5. "Who else do you know who has this problem?"
   - Ask for 2-3 referrals
   - "Would you be interested in seeing an early version?"

6. "Any questions for me?"

TIPS FOR SUCCESS:
□ If doing a Zoom interview, use Fathom to take notes and send summary to customer
□ Less is more - Don't feel the need to get through the complete survey. If more time is spent on the problem discovery, it's great
□ Take time during the opening to build rapport and make sure the customer is comfortable. Take note of anything in their background that resonates with you to help show you're being observant and that you care

POST-INTERVIEW:
□ Send thank you email within 24 hours
□ Document key insights immediately
□ Follow up on referrals within 48 hours
□ Add to your validation tracking sheet

KEY INSIGHTS TO CAPTURE:
- Exact words they use to describe the problem
- Current solutions and their limitations  
- Emotional reactions and pain points
- Willingness to pay indicators
- Referral potential

REMEMBER:
- Listen 80%, talk 20%
- Ask "why" and "tell me more" frequently
- Don't pitch your solution too early
- Focus on understanding their world
- Take detailed notes on their exact words
`;

    const blob = new Blob([templateContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customer-interview-template.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <MessageSquare className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Customer Interview Template</h3>
            <p className="text-gray-600">Structured guide for conducting effective customer interviews</p>
          </div>
        </div>
        <button
          onClick={downloadTemplate}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg flex items-center"
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-green-600" />
            <h4 className="font-semibold text-gray-900">Problem Discovery</h4>
          </div>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• "Tell me about the last time you..."</li>
            <li>• "Walk me through that process..."</li>
            <li>• "What was most frustrating..."</li>
            <li>• "How do you currently handle..."</li>
          </ul>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-purple-600" />
            <h4 className="font-semibold text-gray-900">Solution Validation</h4>
          </div>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• "If you had a magic wand..."</li>
            <li>• "What would that be worth..."</li>
            <li>• "What's your initial reaction..."</li>
            <li>• "What concerns would you have..."</li>
          </ul>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-orange-600" />
            <h4 className="font-semibold text-gray-900">Key Insights</h4>
          </div>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Exact problem descriptions</li>
            <li>• Current solution limitations</li>
            <li>• Emotional pain points</li>
            <li>• Willingness to pay signals</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CustomerInterviewTemplate;