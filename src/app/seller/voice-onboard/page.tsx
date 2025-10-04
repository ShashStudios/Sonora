"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mic, Volume2, CheckCircle, Package } from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'assistant';
  text: string;
  audioUrl?: string;
}

export default function VoiceOnboardPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      type: 'assistant',
      text: "Welcome to Sonora! I'm here to help you create your store using only your voice. Let's start! What would you like to name your store?",
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [context, setContext] = useState<any>({ step: 'store_name' });
  const [storeData, setStoreData] = useState<any>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isProcessing) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      text: inputText,
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsProcessing(true);

    try {
      // Call seller voice onboarding API
      const response = await fetch('/api/seller/voice-onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText,
          context: {
            ...context,
            storeData,
          },
        }),
      });

      if (!response.ok) throw new Error('Failed to process');

      const data = await response.json();

      // Add assistant response
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        type: 'assistant',
        text: data.message,
        audioUrl: data.audioUrl,
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Play audio
      if (data.audioUrl) {
        const audio = new Audio(data.audioUrl);
        audio.play().catch(err => console.error('Audio playback error:', err));
      }

      // Update context
      if (data.action) {
        handleAction(data.action, inputText);
      }
      if (data.nextStep) {
        setContext(prev => ({ ...prev, step: data.nextStep }));
      }

    } catch (error) {
      console.error('Voice onboarding error:', error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        type: 'assistant',
        text: "I'm sorry, I had trouble processing that. Could you please try again?",
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAction = (action: any, userInput: string) => {
    // Update store data based on action
    if (action.type === 'create_product_start') {
      setContext(prev => ({ ...prev, creatingProduct: true }));
    }
    
    // Store field data
    if (context.step === 'store_name') {
      setStoreData(prev => ({ ...prev, name: userInput }));
      setContext(prev => ({ ...prev, step: 'store_description' }));
    } else if (context.step === 'store_description') {
      setStoreData(prev => ({ ...prev, description: userInput }));
      setContext(prev => ({ ...prev, step: 'first_product' }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/seller" className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
              <ArrowLeft className="w-5 h-5" />
              Back
            </Link>
            <div className="flex items-center gap-2">
              <Volume2 className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Voice Onboarding</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="font-bold text-lg mb-4 text-gray-900">Setup Progress</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                storeData.name ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
              }`}>
                {storeData.name ? <CheckCircle className="w-5 h-5" /> : <span>1</span>}
              </div>
              <span className={storeData.name ? 'text-gray-900 font-medium' : 'text-gray-600'}>
                Store Name {storeData.name && `- ${storeData.name}`}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                storeData.description ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
              }`}>
                {storeData.description ? <CheckCircle className="w-5 h-5" /> : <span>2</span>}
              </div>
              <span className={storeData.description ? 'text-gray-900 font-medium' : 'text-gray-600'}>
                Store Description
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">
                <Package className="w-5 h-5" />
              </div>
              <span className="text-gray-600">
                Add Your First Product
              </span>
            </div>
          </div>
        </div>

        {/* Conversation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col" style={{ height: '500px' }}>
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-gray-900">Voice Assistant</h3>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your response..."
                disabled={isProcessing}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-50"
                aria-label="Voice command input"
              />
              <button
                type="submit"
                disabled={isProcessing || !inputText.trim()}
                className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
              >
                <Mic className="w-5 h-5" />
                {isProcessing ? 'Processing...' : 'Send'}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              All responses include voice audio guidance
            </p>
          </form>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-blue-900 mb-2">💡 Tips for Voice Onboarding</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Speak naturally - the AI understands conversational language</li>
            <li>• Be descriptive when adding products - help buyers understand what you're selling</li>
            <li>• You can edit everything later in your dashboard</li>
            <li>• The assistant will guide you through each step</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
