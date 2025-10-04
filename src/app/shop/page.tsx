"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export default function ShopPage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [statusMessage, setStatusMessage] = useState("Click to start conversation");
  const [conversationActive, setConversationActive] = useState(false);
  const recognitionRef = useRef<any>(null);
  const conversationActiveRef = useRef(false);
  const conversationHistoryRef = useRef<any[]>([]);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  const speakText = async (text: string, onComplete?: () => void) => {
    setIsPlaying(true);
    console.log("🎤 Speaking:", text);
    
    try {
      const response = await fetch("/api/voice/say", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      console.log("📡 API Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        console.error("❌ API Error:", errorData);
        throw new Error(`API returned ${response.status}: ${JSON.stringify(errorData)}`);
      }

      const blob = await response.blob();
      console.log("🎵 Audio blob size:", blob.size, "bytes");
      
      const url = URL.createObjectURL(blob);

      const audio = new Audio(url);
      audio.onended = () => {
        console.log("✅ Audio finished playing");
        setIsPlaying(false);
        if (onComplete) onComplete();
      };
      
      audio.onerror = (e) => {
        console.error("❌ Audio playback error:", e);
        setIsPlaying(false);
      };
      
      console.log("▶️ Starting audio playback...");
      await audio.play();
    } catch (error) {
      console.error("❌ speakText error:", error);
      setIsPlaying(false);
      setStatusMessage("Error: Check console for details");
      alert(`Speech failed: ${error instanceof Error ? error.message : String(error)}\n\nCheck:\n1. ELEVENLABS_API_KEY in .env.local\n2. Browser console for details`);
    }
  };

  const startListening = async () => {
    console.log("🎤 Starting live speech recognition...");
    setIsListening(true);
    setStatusMessage("🎙️ Speak now - I'm listening!");
    await processAudio();
  };

  const stopListening = () => {
    console.log("⏹️ Stopping listening...");
    setIsListening(false);
    setStatusMessage("Processing your request...");
  };

  const processAudio = async () => {
    try {
      console.log("🔄 Processing audio...");
      setStatusMessage("Listening for your voice...");
      
      // Use Web Speech API for STT - LIVE recognition
      console.log("🎯 Initializing speech recognition...");
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false; // Stop after first result for faster response
      recognition.interimResults = true; // Show results as you speak
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      let finalTranscript = '';
      let interimTranscript = '';

      recognition.onstart = () => {
        console.log("👂 Speech recognition started - speak now!");
      };

      recognition.onresult = async (event: any) => {
        interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
            console.log("✅ Final text:", transcript);
          } else {
            interimTranscript += transcript;
            console.log("⏳ Interim text:", transcript);
          }
        }
        
        // Show live transcript
        setTranscript(finalTranscript + interimTranscript);
        
        // If we have final text, stop and respond
        if (finalTranscript.trim()) {
          recognition.stop();
          console.log("🛑 Got final transcript, stopping recognition");
          
          setStatusMessage("Thinking...");
          
          // Get AI response from OpenAI
          try {
            const chatResponse = await fetch("/api/chat", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                message: finalTranscript.trim(),
                conversationHistory: conversationHistoryRef.current
              }),
            });

            if (!chatResponse.ok) {
              throw new Error("Failed to get AI response");
            }

            const { response: aiResponse, conversationHistory } = await chatResponse.json();
            conversationHistoryRef.current = conversationHistory;
            
            console.log("🤖 AI Response:", aiResponse);
            
            await speakText(aiResponse, () => {
              // After speaking, automatically listen again if conversation is active
              console.log("✅ Response finished. conversationActive:", conversationActiveRef.current);
              if (conversationActiveRef.current) {
                setTranscript("");
                setStatusMessage("🎙️ I'm listening...");
                setTimeout(() => {
                  console.log("🔄 Restarting listening after response...");
                  if (conversationActiveRef.current) {
                    startListening();
                  }
                }, 300);
              } else {
                setTimeout(() => {
                  setStatusMessage("Click to start conversation");
                  setTranscript("");
                }, 1000);
              }
            });
          } catch (error) {
            console.error("❌ Error getting AI response:", error);
            setStatusMessage("Sorry, I had trouble understanding. Let's try again.");
            setTimeout(() => {
              if (conversationActiveRef.current) {
                startListening();
              }
            }, 2000);
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.error("❌ Speech recognition error:", event.error);
        
        if (event.error === 'no-speech') {
          setStatusMessage("I didn't hear anything. Click to try again.");
        } else if (event.error === 'audio-capture') {
          setStatusMessage("Microphone error. Check your settings.");
        } else {
          setStatusMessage("Sorry, I didn't catch that. Click to try again.");
        }
        
        setTimeout(() => {
          setStatusMessage("Click to start conversation");
        }, 3000);
      };

      recognition.onend = () => {
        console.log("🏁 Speech recognition ended");
        setIsListening(false);
        
        // If conversation is still active and we haven't gotten a final transcript, restart
        if (conversationActiveRef.current && !finalTranscript.trim()) {
          console.log("🔄 No speech detected, restarting listening...");
          setTimeout(() => {
            if (conversationActiveRef.current) {
              startListening();
            }
          }, 500);
        }
      };

      recognitionRef.current = recognition;
      
      console.log("▶️ Starting live speech recognition...");
      recognition.start();
      
      // Auto-stop after 10 seconds if nothing detected
      setTimeout(() => {
        if (recognition && conversationActiveRef.current) {
          console.log("⏱️ Auto-stopping recognition after 10s");
          recognition.stop();
        }
      }, 10000);
      
    } catch (error) {
      console.error("❌ Error processing audio:", error);
      setStatusMessage("Error processing speech. Click to try again.");
      setTimeout(() => {
        setStatusMessage("Click to start conversation");
      }, 3000);
    }
  };

  const handleButtonClick = async () => {
    console.log("🖱️ Button clicked. State - isListening:", isListening, "isPlaying:", isPlaying, "conversationActive:", conversationActive);
    
    if (conversationActive) {
      // Stop the conversation
      console.log("🛑 Stopping conversation");
      setConversationActive(false);
      conversationActiveRef.current = false;
      conversationHistoryRef.current = []; // Reset conversation history
      setIsListening(false);
      setIsPlaying(false);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setStatusMessage("Conversation ended. Click to start again.");
      setTimeout(() => {
        setStatusMessage("Click to start conversation");
        setTranscript("");
      }, 2000);
    } else {
      // Start the conversation flow
      console.log("🚀 Starting conversation flow");
      setConversationActive(true);
      conversationActiveRef.current = true;
      setStatusMessage("Hi! I'm Sonora...");
      
      // Speak introduction (shorter for speed)
      const intro = "Hi! I'm Sonora, your shopping assistant. How can I help?";
      await speakText(intro, () => {
        console.log("✅ Intro finished, starting to listen...");
        // After intro finishes, automatically start listening
        startListening();
      });
    }
  };

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="animate-pulse text-xl text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-8 relative overflow-hidden">
      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 text-center">
        {/* Title */}
        <h1 className="text-6xl font-bold text-gray-900 mb-4 tracking-tight">
          SONORA
        </h1>
        <p className="text-xl text-gray-600 mb-16 max-w-md mx-auto">
          Your voice-native shopping assistant
        </p>

        {/* Animated Voice Button */}
        <div className="flex flex-col items-center gap-12">
          <button
            onClick={handleButtonClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative group"
          >
            {/* Animated Wave Rings */}
            {(conversationActive || isHovered) && (
              <>
                <div className="absolute inset-0 rounded-full border-2 border-black/20 animate-wave-1" />
                <div className="absolute inset-0 rounded-full border-2 border-black/15 animate-wave-2" />
                <div className="absolute inset-0 rounded-full border-2 border-black/10 animate-wave-3" />
              </>
            )}

            {/* Main Black Dot */}
            <div
              className={`relative w-32 h-32 rounded-full bg-black shadow-2xl flex items-center justify-center transition-all duration-500 ${
                conversationActive
                  ? "scale-110 shadow-black/60"
                  : isHovered
                  ? "scale-105 shadow-black/40"
                  : "scale-100 shadow-black/30"
              }`}
            >
              {/* Inner Subtle Glow */}
              <div className="absolute inset-3 rounded-full bg-gradient-to-br from-white/5 to-transparent" />

              {/* Dynamic State Indicator */}
              {isPlaying ? (
                <div className="relative flex gap-1.5">
                  <div className="w-1.5 h-8 bg-white rounded-full animate-pulse" style={{ animationDelay: "0ms" }} />
                  <div className="w-1.5 h-12 bg-white rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
                  <div className="w-1.5 h-6 bg-white rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
                  <div className="w-1.5 h-10 bg-white rounded-full animate-pulse" style={{ animationDelay: "450ms" }} />
                </div>
              ) : isListening ? (
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border-2 border-white/80 border-t-transparent animate-spin" />
                </div>
              ) : conversationActive ? (
                <div className="text-white text-xs font-bold">STOP</div>
              ) : (
                <div className="w-6 h-6 rounded-full bg-white/90" />
              )}
            </div>
          </button>

          {/* Status Text */}
          <div className="text-center min-h-[80px]">
            <p className="text-lg font-medium text-gray-800">
              {conversationActive && !isPlaying && !isListening 
                ? "Click the dot to end conversation" 
                : statusMessage}
            </p>
            {transcript && (
              <p className="text-sm text-gray-600 mt-2 italic max-w-md">
                &quot;{transcript}&quot;
              </p>
            )}
            <div className="flex items-center justify-center gap-2 mt-2">
              {conversationActive ? (
                <p className="text-sm text-gray-500">🟢 Conversation Active</p>
              ) : (
                <>
                  <p className="text-sm text-gray-500">Powered by</p>
                  <img 
                    src="https://11labs-nonprd-15f22c1d.s3.eu-west-3.amazonaws.com/0b9cd3e1-9fad-4a5b-b3a0-c96b0a1f1d2b/elevenlabs-logo-black.svg" 
                    alt="ElevenLabs" 
                    className="h-4"
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Feature Pills */}
        <div className="mt-16 flex flex-wrap gap-3 justify-center max-w-lg mx-auto">
          <span className="px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 shadow-sm">
            🎯 Voice-Native
          </span>
          <span className="px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 shadow-sm">
            ♿ Accessible
          </span>
          <span className="px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 shadow-sm">
            🤖 AI-Powered
          </span>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        
        @keyframes wave {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animate-wave-1 {
          animation: wave 2s ease-out infinite;
        }
        .animate-wave-2 {
          animation: wave 2s ease-out infinite;
          animation-delay: 0.4s;
        }
        .animate-wave-3 {
          animation: wave 2s ease-out infinite;
          animation-delay: 0.8s;
        }
      `}</style>
    </div>
  );
}
