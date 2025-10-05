"use client";

import { useState, useRef, useEffect } from "react";
import { Volume2, Mic, X, Minimize2, Maximize2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Message {
  id: string;
  type: 'user' | 'sonora';
  text: string;
  audioUrl?: string;
  timestamp: Date;
}

interface SonoraAgentProps {
  initialOpen?: boolean;
}

export default function SonoraAgent({ initialOpen = false }: SonoraAgentProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sessionContext, setSessionContext] = useState<any>({
    cart: [],
    currentStore: null,
    userIntent: null,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasSpokenWelcome = useRef(false);

  useEffect(() => {
    // Only speak welcome on very first load
    if (!hasSpokenWelcome.current && messages.length === 0) {
      hasSpokenWelcome.current = true;
      
      const welcomeMessage: Message = {
        id: 'welcome',
        type: 'sonora',
        text: "Hi! I'm Sonora, your voice shopping assistant. Press and hold the blue button or Space/Enter to talk to me.",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
      
      // Play welcome audio only once after delay
      setTimeout(() => {
        speakMessage(welcomeMessage.text);
      }, 1000);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const speakMessage = async (text: string) => {
    try {
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      const response = await fetch('/api/voice/say', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.audioUrl) {
          const audio = new Audio(data.audioUrl);
          audioRef.current = audio;
          audio.play().catch(err => console.error('Audio playback error:', err));
        }
      }
    } catch (error) {
      console.error('TTS error:', error);
    }
  };

  const startRecording = async () => {
    // Stop any playing audio first
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        await processVoiceInput(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      console.log('🎤 Recording started');
    } catch (error: any) {
      console.error('Microphone error:', error);
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        alert('🎤 Microphone access denied.\n\nPlease:\n1. Click the camera/mic icon in your browser address bar\n2. Allow microphone access for this site\n3. Refresh the page and try again');
      } else if (error.name === 'NotFoundError') {
        alert('🎤 No microphone found.\n\nPlease connect a microphone and try again.');
      } else {
        alert('🎤 Microphone error: ' + error.message);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processVoiceInput = async (audioBlob: Blob) => {
    setIsProcessing(true);
    console.log('🎤 Processing audio blob, size:', audioBlob.size);

    try {
      // Step 1: Transcribe with ElevenLabs
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      console.log('📤 Sending to transcribe API...');
      const transcribeResponse = await fetch('/api/voice/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!transcribeResponse.ok) {
        const error = await transcribeResponse.text();
        console.error('❌ Transcription failed:', error);
        throw new Error('Transcription failed: ' + error);
      }

      const { text: userText } = await transcribeResponse.json();
      console.log('✅ Transcribed:', userText);

      // Add user message
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        type: 'user',
        text: userText,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);

      // Step 2: Process with Sonora Agent
      console.log('🤖 Sending to Sonora agent...');
      const agentResponse = await fetch('/api/sonora/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: userText,
          context: sessionContext,
        }),
      });

      if (!agentResponse.ok) {
        const error = await agentResponse.text();
        console.error('❌ Agent failed:', error);
        throw new Error('Agent processing failed');
      }

      const agentData = await agentResponse.json();
      console.log('✅ Agent response:', agentData.response);
      console.log('🎬 Action:', agentData.action);
      
      // Update context with search results BEFORE executing action
      if (agentData.action?.type === 'search_products' && agentData.action?.results) {
        setSessionContext(prev => ({
          ...prev,
          lastSearchResults: agentData.action.results,
          lastQuery: agentData.action.query,
        }));
        console.log('📦 Updated context with search results:', agentData.action.results.length);
      }

      // Add Sonora's response
      const sonoraMessage: Message = {
        id: `sonora-${Date.now()}`,
        type: 'sonora',
        text: agentData.response,
        audioUrl: agentData.audioUrl,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, sonoraMessage]);

      // Speak response (stop any previous audio first)
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      if (agentData.audioUrl) {
        const audio = new Audio(agentData.audioUrl);
        audioRef.current = audio;
        audio.play().catch(err => console.error('Audio playback error:', err));
      }

      // Execute actions
      if (agentData.action) {
        await executeAction(agentData.action);
      }

      // Update context
      if (agentData.updatedContext) {
        setSessionContext(agentData.updatedContext);
      }

    } catch (error) {
      console.error('Voice processing error:', error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        type: 'sonora',
        text: "I'm sorry, I had trouble understanding that. Could you please try again?",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      speakMessage(errorMessage.text);
    } finally {
      setIsProcessing(false);
    }
  };

  const executeAction = async (action: any) => {
    console.log('🎬 Executing action:', action.type);
    
    switch (action.type) {
      case 'navigate':
        // Navigate to page after a delay
        console.log('📍 Navigating to:', action.url);
        setTimeout(() => {
          router.push(action.url);
        }, 2000);
        break;

      case 'search_products':
        // Show results in conversation - don't navigate
        console.log('🔍 Search results:', action.results?.length || 0);
        // Results are already in the response, no navigation needed
        setSessionContext(prev => ({
          ...prev,
          lastSearchResults: action.results || [],
          lastQuery: action.query,
        }));
        break;

      case 'add_to_cart':
        // Add product to cart in localStorage
        console.log('🛒 Adding to cart:', action.product?.name);
        
        if (action.product) {
          const currentCart = JSON.parse(localStorage.getItem('sonora_cart') || '[]');
          
          // Check if item already exists
          const existingIndex = currentCart.findIndex((item: any) => item.id === action.product.id);
          
          if (existingIndex >= 0) {
            // Increase quantity
            currentCart[existingIndex].quantity += 1;
          } else {
            // Add new item
            currentCart.push({
              id: action.product.id,
              name: action.product.name,
              price: action.product.price,
              quantity: 1,
            });
          }
          
          localStorage.setItem('sonora_cart', JSON.stringify(currentCart));
          console.log('✅ Cart updated:', currentCart);
        }
        
        setSessionContext(prev => ({
          ...prev,
          cart: [...(prev.cart || []), action.product],
        }));
        break;

      case 'checkout':
        // Navigate to checkout
        console.log('💳 Going to checkout');
        setTimeout(() => {
          router.push('/cart');
        }, 1500);
        break;

      case 'view_cart':
        // Navigate to cart page
        console.log('🛒 Going to cart');
        setTimeout(() => {
          router.push('/cart');
        }, 1500);
        break;

      default:
        console.log('❓ Unknown action:', action);
    }
  };

  if (!isOpen) {
    // Floating button
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center z-50 group"
        aria-label="Talk to Sonora"
      >
        <Volume2 className="w-8 h-8 group-hover:animate-pulse" />
        <span className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-pulse"></span>
      </button>
    );
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 bg-white rounded-full shadow-2xl p-4 z-50 flex items-center gap-3 border-2 border-blue-600">
        <Volume2 className="w-6 h-6 text-blue-600" />
        <span className="font-bold text-gray-900">Sonora</span>
        <button
          onClick={() => setIsMinimized(false)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border-2 border-blue-600 flex flex-col z-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Volume2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Sonora</h3>
            <p className="text-xs text-blue-100">Your Voice Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            aria-label="Minimize"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-900 border border-gray-200'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.text}</p>
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span className="text-sm text-gray-600">Sonora is thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Voice Input */}
      <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
        <button
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
          onKeyDown={(e) => {
            if ((e.key === ' ' || e.key === 'Enter') && !isRecording && !isProcessing) {
              e.preventDefault();
              startRecording();
            }
          }}
          onKeyUp={(e) => {
            if ((e.key === ' ' || e.key === 'Enter') && isRecording) {
              e.preventDefault();
              stopRecording();
            }
          }}
          disabled={isProcessing}
          className={`w-full py-6 rounded-xl font-bold text-white transition-all disabled:opacity-50 flex items-center justify-center gap-3 text-lg ${
            isRecording
              ? 'bg-red-600 hover:bg-red-700 animate-pulse shadow-lg shadow-red-500/50'
              : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:scale-105 shadow-xl'
          }`}
          aria-label={isRecording ? 'Listening - Release to send' : 'Press and hold Space or Enter to talk to Sonora'}
          tabIndex={0}
        >
          <Mic className="w-8 h-8" />
          {isRecording ? '🎤 Listening... Release to Send' : '🎤 Press & Hold to Talk'}
        </button>
        <p className="text-xs text-gray-600 text-center mt-3 font-medium">
          Press button / Space / Enter → Speak → Release when done
        </p>
      </div>
    </div>
  );
}
