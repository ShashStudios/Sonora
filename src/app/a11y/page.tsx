"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Volume2, Accessibility, Eye, Type, Zap } from "lucide-react";

export default function AccessibilitySettings() {
  const [settings, setSettings] = useState({
    captions: true,
    highContrast: false,
    fontSize: 'medium' as 'small' | 'medium' | 'large',
    reducedMotion: false,
    screenReaderOptimized: true,
    voiceSpeed: 1.0,
  });

  const updateSetting = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('sonora_a11y_settings', JSON.stringify(newSettings));
      
      // Apply settings to document
      applySettings(newSettings);
    }
  };

  const applySettings = (settings: typeof settings) => {
    const root = document.documentElement;
    
    // Font size
    const fontSizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px',
    };
    root.style.fontSize = fontSizeMap[settings.fontSize];
    
    // High contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Reduced motion
    if (settings.reducedMotion) {
      root.style.setProperty('--motion', '0');
    } else {
      root.style.setProperty('--motion', '1');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div className="flex items-center gap-2">
                <Accessibility className="w-6 h-6 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">Accessibility Settings</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <p className="text-gray-600 mb-8">
          Customize your experience to match your needs. All settings are saved automatically.
        </p>

        {/* Voice Settings */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Volume2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Voice & Audio</h2>
              <p className="text-sm text-gray-600">Control voice output settings</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Captions */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">Live Captions</h3>
                <p className="text-sm text-gray-600">Display text captions for all voice output</p>
              </div>
              <button
                onClick={() => updateSetting('captions', !settings.captions)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.captions ? 'bg-blue-600' : 'bg-gray-200'
                }`}
                role="switch"
                aria-checked={settings.captions}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.captions ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Voice Speed */}
            <div className="py-3 border-b border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-medium text-gray-900">Voice Speed</h3>
                  <p className="text-sm text-gray-600">Adjust speaking rate</p>
                </div>
                <span className="text-sm font-medium text-gray-700">{settings.voiceSpeed}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={settings.voiceSpeed}
                onChange={(e) => updateSetting('voiceSpeed', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Slower</span>
                <span>Faster</span>
              </div>
            </div>
          </div>
        </section>

        {/* Visual Settings */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Eye className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Visual</h2>
              <p className="text-sm text-gray-600">Adjust display preferences</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* High Contrast */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">High Contrast Mode</h3>
                <p className="text-sm text-gray-600">Increase color contrast for better visibility</p>
              </div>
              <button
                onClick={() => updateSetting('highContrast', !settings.highContrast)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.highContrast ? 'bg-blue-600' : 'bg-gray-200'
                }`}
                role="switch"
                aria-checked={settings.highContrast}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.highContrast ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Font Size */}
            <div className="py-3 border-b border-gray-100">
              <div className="mb-3">
                <h3 className="font-medium text-gray-900">Font Size</h3>
                <p className="text-sm text-gray-600">Adjust text size across the app</p>
              </div>
              <div className="flex gap-2">
                {(['small', 'medium', 'large'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => updateSetting('fontSize', size)}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      settings.fontSize === size
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Interaction Settings */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Zap className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Interaction</h2>
              <p className="text-sm text-gray-600">Control motion and animations</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Reduced Motion */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">Reduce Motion</h3>
                <p className="text-sm text-gray-600">Minimize animations and transitions</p>
              </div>
              <button
                onClick={() => updateSetting('reducedMotion', !settings.reducedMotion)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.reducedMotion ? 'bg-blue-600' : 'bg-gray-200'
                }`}
                role="switch"
                aria-checked={settings.reducedMotion}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.reducedMotion ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Screen Reader Optimized */}
            <div className="flex items-center justify-between py-3">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">Screen Reader Optimization</h3>
                <p className="text-sm text-gray-600">Enhanced ARIA labels and landmarks</p>
              </div>
              <button
                onClick={() => updateSetting('screenReaderOptimized', !settings.screenReaderOptimized)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.screenReaderOptimized ? 'bg-blue-600' : 'bg-gray-200'
                }`}
                role="switch"
                aria-checked={settings.screenReaderOptimized}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.screenReaderOptimized ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-blue-900 mb-2">♿ Built for Accessibility</h3>
          <p className="text-blue-800 text-sm">
            Sonora is designed from the ground up to be accessible. These settings help you 
            personalize your experience. All changes are saved automatically and persist across sessions.
          </p>
        </div>
      </main>
    </div>
  );
}
