import React, { useState } from 'react';
import { Message } from '../../types';
import { MessageSquare, Send, User, Bot, Calendar, Search } from 'lucide-react';

const AdminMessages: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<string>('user-1');
  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const users = [
    { id: 'user-1', name: 'Sarah Chen', email: 'sarah@startup.com', lastActive: '2024-01-20T10:30:00Z' },
    { id: 'user-2', name: 'Mike Rodriguez', email: 'mike@techco.com', lastActive: '2024-01-19T15:45:00Z' },
    { id: 'user-3', name: 'Emma Johnson', email: 'emma@newventure.io', lastActive: '2024-01-18T09:15:00Z' },
    { id: 'user-4', name: 'Alex Kim', email: 'alex@innovate.co', lastActive: '2024-01-17T14:20:00Z' }
  ];

  const messages: Record<string, Message[]> = {
    'user-1': [
      {
        id: '1',
        content: 'Hi! I wanted to follow up on your recent experiment results. The 24% open rate is impressive!',
        sender: 'admin',
        timestamp: '2024-01-20T10:30:00Z'
      },
      {
        id: '2',
        content: 'Thank you for the feedback! I was wondering if you have any suggestions for improving the click-through rate?',
        sender: 'user',
        timestamp: '2024-01-20T10:45:00Z'
      },
      {
        id: '3',
        content: 'Absolutely! Try A/B testing your call-to-action buttons. Make them more specific and action-oriented. Instead of "Learn More", try "Get My Free Guide" or "Start My Trial".',
        sender: 'admin',
        timestamp: '2024-01-20T11:00:00Z'
      }
    ],
    'user-2': [
      {
        id: '4',
        content: 'Your customer retention metrics are looking great this month!',
        sender: 'admin',
        timestamp: '2024-01-19T15:45:00Z'
      }
    ],
    'user-3': [
      {
        id: '5',
        content: 'Welcome to StartupCoach! I see you just signed up. Any specific challenges you\'d like to discuss?',
        sender: 'admin',
        timestamp: '2024-01-18T09:15:00Z'
      }
    ],
    'user-4': []
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentMessages = messages[selectedUser] || [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    // Here you would send the message
    setMessageInput('');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  return (
    <div className="max-w-6xl mx-auto h-full">
      <div className="bg-white rounded-xl shadow-sm h-[calc(100vh-12rem)] flex">
        {/* Users Sidebar */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Direct Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => setSelectedUser(user.id)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  selectedUser === user.id ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {getInitials(user.name)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">{user.name}</div>
                    <div className="text-sm text-gray-500 truncate">{user.email}</div>
                    <div className="text-xs text-gray-400">
                      Last active: {new Date(user.lastActive).toLocaleDateString()}
                    </div>
                  </div>
                  {messages[user.id] && messages[user.id].length > 0 && (
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {getInitials(users.find(u => u.id === selectedUser)?.name || '')}
                </span>
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  {users.find(u => u.id === selectedUser)?.name}
                </div>
                <div className="text-sm text-gray-500">
                  {users.find(u => u.id === selectedUser)?.email}
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {currentMessages.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No messages yet. Start the conversation!</p>
              </div>
            ) : (
              currentMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md ${message.sender === 'admin' ? 'order-2' : 'order-1'}`}>
                    <div className={`flex items-start space-x-2 ${message.sender === 'admin' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.sender === 'admin' 
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
                          : 'bg-gradient-to-r from-blue-600 to-purple-600'
                      }`}>
                        {message.sender === 'admin' ? (
                          <User className="h-4 w-4 text-white" />
                        ) : (
                          <Bot className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <div className={`rounded-lg px-3 py-2 ${
                        message.sender === 'admin' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'admin' ? 'text-blue-200' : 'text-gray-500'
                        }`}>
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200">
            <form onSubmit={handleSendMessage} className="flex items-end space-x-4">
              <div className="flex-1">
                <textarea
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                />
              </div>
              <button
                type="submit"
                disabled={!messageInput.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;