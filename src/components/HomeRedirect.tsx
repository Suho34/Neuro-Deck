"use client";

import { useState, useEffect } from "react";
import {
  Brain,
  Sparkles,
  Upload,
  MessageSquare,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <Upload className="w-8 h-8" />,
      title: "AI-Powered Generation",
      description:
        "Upload PDFs, paste notes, or type text. Our AI instantly creates optimized flashcards.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Smart AI Quiz Mode",
      description:
        "Chat with AI to get quizzed on your cards with personalized questions and explanations.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Spaced Repetition",
      description:
        "Science-backed learning algorithm adapts to your memory to maximize retention.",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Progress Analytics",
      description:
        "Track your learning journey with detailed insights and performance metrics.",
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white overflow-hidden">
      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.svg" // 👈 stored in /public/logo.svg
              alt="NeuroDeck Logo"
              width={70} // tweak size
              height={70}
              priority // optimizes for first load (since it’s in navbar)
            />

            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              NeuroDeck
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="hover:text-cyan-400 transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="hover:text-cyan-400 transition-colors"
            >
              How it Works
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-16 md:py-24">
        <div className="max-w-7xl mx-auto text-center">
          <div
            className={`transition-all duration-1000 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-12 opacity-0"
            }`}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm">AI-Powered Learning Revolution</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Transform Any Text Into
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent block">
                Smart Flashcards
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              Upload PDFs, paste notes, or type anything. Our AI instantly
              creates personalized flashcards and quizzes you like a personal
              tutor. Learn faster, remember longer.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                href="/sign-in"
                className="group bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 rounded-2xl font-semibold text-lg hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 transform hover:scale-105  flex items-center gap-2"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 " />
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-10 w-20 h-20 bg-cyan-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-pink-500/20 rounded-full blur-xl animate-pulse delay-2000"></div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="relative px-6 py-20 bg-black/20 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Powered by{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Artificial Intelligence
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the future of learning with AI that understands how you
              learn best
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-500 hover:-translate-y-2 cursor-pointer"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform duration-300`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>

                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              From Text to Mastery in{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                3 Steps
              </span>
            </h2>
            <p className="text-xl text-gray-300">
              It&apos;s ridiculously simple
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Upload & Generate",
                description:
                  "Drop in your PDF, paste your notes, or type your content. Our AI analyzes and creates perfect flashcards instantly.",
                icon: <Upload className="w-8 h-8" />,
                color: "from-blue-500 to-cyan-500",
              },
              {
                step: "02",
                title: "AI-Powered Learning",
                description:
                  "Study with spaced repetition or chat with AI for personalized quizzes and explanations tailored to your learning style.",
                icon: <Brain className="w-8 h-8" />,
                color: "from-purple-500 to-pink-500",
              },
              {
                step: "03",
                title: "Track & Improve",
                description:
                  "Monitor your progress with detailed analytics. Watch your retention rates soar as you master any subject.",
                icon: <BarChart3 className="w-8 h-8" />,
                color: "from-emerald-500 to-teal-500",
              },
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-8">
                  <div
                    className={`w-20 h-20 bg-gradient-to-r ${item.color} rounded-full flex items-center justify-center mx-auto text-white group-hover:scale-110 transition-transform duration-300`}
                  >
                    {item.icon}
                  </div>
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-black font-bold text-lg">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              NeuroDeck
            </span>
          </div>
          <p className="text-gray-400 mb-6">
            Revolutionizing learning with AI-powered flashcards
          </p>

          <div className="flex flex-wrap justify-center gap-8 text-gray-400">
            <a href="#" className="hover:text-cyan-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-cyan-400 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-cyan-400 transition-colors">
              Contact
            </a>
            <a href="#" className="hover:text-cyan-400 transition-colors">
              Support
            </a>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10">
            <p className="text-gray-500">
              © 2025 NeuroDeck. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
