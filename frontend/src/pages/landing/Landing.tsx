"use client";

import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Inter } from "next/font";
import { Activity, Check, Dumbbell, Flame, HeartPulse, Play, TrendingUp, X, AlertCircle, Users, Clipboard, Calendar, Eye, MessageCircle } from "lucide-react";

const interFont = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export function LandingPage() {
  const [showFeatures, setShowFeatures] = useState(false);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Attractive Navbar Component */}
      <nav className="navbar-fixed top-0 z-50 border-b border-secondary/5 bg-white/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Left side - Logo & Nav */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <NavLink to="/" className="font-bold text-2xl tracking-tight text-navy">
              Physio<span className="text-teal">Track</span>
            </NavLink>
          </div>

          {/* Right side - Nav Links & Actions */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="#features" className="text-muted hover:text-teal transition-colors text-sm">Features</NavLink>
            <NavLink to="#how" className="text-muted hover:text-teal transition-colors text-sm">How it works</NavLink>
            <NavLink to="/login" className="text-muted hover:text-teal transition-colors text-sm">Login</NavLink>
            <NavLink to="/register" className="btn-primary btn-sm py-2 px-4 rounded-lg font-medium hover:bg-teal/10">
              Get started
            </NavLink>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-secondary/5"
            onClick={() => setShowFeatures(!showFeatures)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {showFeatures && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur z-40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 max-w-md w-full text-center animate-in fade-in-0">
            <NavLink to="/" className="font-bold text-2xl mb-4 block">PhysioTrack</NavLink>
            <NavLink to="#features" className="mb-4 block hover:text-teal transition-colors">Features</NavLink>
            <NavLink to="#how" className="mb-4 block hover:text-teal transition-colors">How it works</NavLink>
            <NavLink to="/login" className="mb-4 block hover:text-teal transition-colors">Login</NavLink>
            <NavLink to="/register" className="mb-4 block hover:text-teal transition-colors">Get started</NavLink>
            <button
              onClick={() => setShowFeatures(false)}
              className="mt-6 w-full btn-secondary py-3 rounded-lg text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Hero Section with Attractive Design */}
      <section className="pt-32 md:pt-48 pb-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-teal/10 text-teal text-xs font-medium">
                YOUR RECOVERY, YOUR RHYTHM
              </span>
              <h1 className="font-extrabold text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.1] text-navy">
                Your Recovery.&nbsp;Your&nbsp;Routine.&nbsp;Your&nbsp;Progress.
              </h1>
              <p className="mt-6 text-lg md:text-xl text-muted leading-relaxed max-w-xl">
                PhysioTrack makes it simple to follow your home exercise plan, track
                your progress, and stay connected to your recovery goals. Join
                thousands of patients regaining mobility and confidence.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <NavLink to="/register" className="btn-primary px-6 py-3 rounded-lg font-medium hover:bg-teal/90 transition-colors">
                  Create your account
                </NavLink>
                <NavLink to="/login" className="btn-outline px-6 py-3 rounded-lg font-medium hover:bg-teal/5 transition-colors">
                  I already have an account
                </NavLink>
              </div>
            </div>

            {/* Hero Illustration - Enhanced */}
            <div className="relative opacity-90">
              <div className="relative">
                {/* Decorative floating elements */}
                <div className="absolute -top-6 -left-6 w-20 h-20 rounded-full bg-primary/5 opacity-50 animate-pulse-slow"></div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-secondary/5 opacity-50 animate-pulse-slow" style="animation-delay: 2s;"></div>
                
                {/* Main hero icon */}
                <div className="relative">
                  <div className="relative">
                    <Activity className="w-40 h-40 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                      <Activity className="w-20 h-20 text-primary" />
                    </Activity>
                    <p className="text-center text-sm text-muted">Trusted by leading clinics</p>
                  </div>
                  
                  {/* Floating patient illustration container */}
                  <div className="relative pt-20">
                    <svg className="absolute -inset-0 w-full h-full rounded-3xl overflow-hidden" aria-hidden="true">
                      <rect width="100%" height="100%" fill="url(#grad1)" />
                      <defs>
                        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style="stop-color:#{tealHex}" />
                          <stop offset="100%" style="stop-color:#{mintHex}" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="relative z-10">
                      <img
                        src="https://images.unsplash.com/photo-1576091260104-31e7e566d82d?w=600&h=400&fit=crop"
                        alt="Patient doing physiotherapy exercises"
                        className="w-full h-64 object-cover rounded-3xl shadow-2xl shadow-primary/10"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Attractive Features Section */}
      <section className="py-24 md:py-32 bg-muted/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-teal/10 text-teal text-xs font-medium mb-4">
              DESIGNED FOR YOUR HOME ROUTINE
            </span>
            <h2 className="font-extrabol text-4xl md:text-5xl text-navy tracking-tight">
              Recovery support that fits into real life.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-md gap-6 md:grid-cols-3">
            {/* Exercise Card 1 */}
            <article className="group bg-white rounded-2xl p-6 border-l-4 group-hover:border-teal transition-all duration-300 hover-shadow-xl">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors mb-4">
                <Dumbbell className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-xl text-navy group-hover:text-teal transition-colors mb-2">
                Clear guided exercises
              </h3>
              <p className="text-muted leading-relaxed">
                Simple instructions and session controls help you move with confidence.
              </p>
            </article>

            {/* Exercise Card 2 */}
            <article className="group bg-white rounded-2xl p-6 border-l-4 group-hover:border-teal transition-all duration-300 hover-shadow-xl">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors mb-4">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-xl text-navy group-hover:text-teal transition-colors mb-2">
                Meaningful progress
              </h3>
              <p className="text-muted leading-relaxed">
                See adherence, exercise time, and recovery patterns in one calm view.
              </p>
            </article>

            {/* Exercise Card 3 */}
            <article className="group bg-white rounded-2xl p-6 border-l-4 group-hover:border-teal transition-all duration-300 hover-shadow-xl">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors mb-4">
                <HeartPulse className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-xl text-navy group-hover:text-teal transition-colors mb-2">
                Symptom journal
              </h3>
              <p className="text-muted leading-relaxed">
                Log how you feel and bring a clear history to care conversations.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* How It Works - Attractive Cards */}
      <section className="py-24 md:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-extrabol text-4xl md:text-5xl text-navy tracking-tight">
              How It Works
            </h2>
            <p className="text-muted mt-4 max-w-lg mx-auto">
              Three simple steps to start your recovery journey today.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-8 border-l-4 border-teal transform hover:-translate-y-1 transition-all duration-300 hover-shadow-2xl">
              <div className="w-14 h-14 rounded-2xl bg-teal/10 flex items-center justify-center mx-auto mb-6">
                <Play className="w-7 h-7 text-teal" />
              </div>
              <h3 className="font-bold text-2xl text-navy mb-3">1. Prescribe</h3>
              <p className="text-muted">
                Therapists assign personalized exercise plans tailored to your
                specific needs and recovery stage.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-8 border-l-4 border-teal transform hover:-translate-y-1 transition-all duration-300 hover-shadow-2xl">
              <div className="w-14 h-14 rounded-2xl bg-teal/10 flex items-center justify-center mx-auto mb-6">
                <Check className="w-7 h-7 text-teal" />
              </div>
              <h3 className="font-bold text-2xl text-navy mb-3">2. Perform</h3>
              <p className="text-muted">
                Follow guided video routines at home with clear instructions and
                progress tracking.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-8 border-l-4 border-teal transform hover:-translate-y-1 transition-all duration-300 hover-shadow-2xl">
              <div className="w-14 h-14 rounded-2xl bg-teal/10 flex items-center justify-center mx-auto mb-6">
                <HeartPulse className="w-7 h-7 text-teal" />
              </div>
              <h3 className="font-bold text-2xl text-navy mb-3">3. Track</h3>
              <p className="text-muted">
                Monitor your progress, pain levels, and adherence analytics in
                real-time. Share insights with your therapist.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Patient Section */}
      <section className="py-24 md:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-extrabol text-4xl md:text-5xl text-navy tracking-tight">
                For Patients
              </h2>
              <p className="mt-4 text-lg md:text-xl text-muted leading-relaxed max-w-xl">
                Take control of your rehabilitation journey. PhysioTrack provides
                the tools you need to stay on track, monitor your progress, and
                communicate with your healthcare provider from the comfort of
                your home.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <NavLink to="/register" className="btn-primary px-5 py-2.5 rounded-lg font-medium">
                  Get Started Free
                </NavLink>
              </div>
            </div>

            {/* Patient Features Grid */}
            <div>
              <div className="grid grid-cols-2 gap-4">
                {/* Patient Card 1 */}
                <article className="bg-white rounded-xl p-5 border-r-4 border-teal hover:border-teal/80 transition-colors hover-shadow-lg">
                  <div className="w-6 h-6 rounded bg-teal/10 flex items-center justify-center mb-3">
                    <Dumbbell className="w-3 h-3 text-teal" />
                  </div>
                  <h3 className="font-medium text-base text-navy mb-1">Guided Workouts</h3>
                  <p className="text-xs text-muted">
                    Follow video demonstrations of your prescribed exercises.
                  </p>
                </article>

                {/* Patient Card 2 */}
                <article className="bg-white rounded-xl p-5 border-r-4 border-teal hover:border-teal/80 transition-colors hover-shadow-lg">
                  <div className="w-6 h-6 rounded bg-teal/10 flex items-center justify-center mb-3">
                    <TrendingUp className="w-3 h-3 text-teal" />
                  </div>
                  <h3 className="font-medium text-base text-navy mb-1">Progress Analytics</h3>
                  <p className="text-xs text-muted">
                    Interactive charts showing your recovery milestones.
                  </p>
                </article>

                {/* Patient Card 3 */}
                <article className="bg-white rounded-xl p-5 border-r-4 border-teal hover:border-teal/80 transition-colors hover-shadow-lg">
                  <div className="w-6 h-6 rounded bg-teal/10 flex items-center justify-center mb-3">
                    <HeartPulse className="w-3 h-3 text-teal" />
                  </div>
                  <h3 className="font-medium text-base text-navy mb-1">Pain Tracking</h3>
                  <p className="text-xs text-muted">
                    Log pain levels from 0-10 and track trends over time.
                  </p>
                </article>

                {/* Patient Card 4 */}
                <article className="bg-white rounded-xl p-5 border-r-4 border-teal hover:border-teal/80 transition-colors hover-shadow-lg">
                  <div className="w-6 h-6 rounded bg-teal/10 flex items-center justify-center mb-3">
                    <Flame className="w-3 h-3 text-teal" />
                  </div>
                  <h3 className="font-medium text-base text-navy mb-1">Streak Motivation</h3>
                  <p className="text-xs text-muted">
                    Maintain your exercise streak and stay motivated.
                  </p>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Therapist Section */}
      <section className="py-24 md:py-32 bg-muted/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-extrabol text-4xl md:text-5xl text-navy tracking-tight">
                For Physiotherapists
              </h2>
              <p className="mt-4 text-lg md:text-xl text-muted leading-relaxed max-w-xl">
                Enhance your clinic's efficiency with comprehensive patient
                monitoring, exercise plan management, and adherence analytics.
                Focus on patient care while PhysioTrack handles the data.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <NavLink to="/physio-settings" className="btn-outline px-5 py-2.5 rounded-lg font-medium">
                  Learn More
                </NavLink>
              </div>
            </div>

            {/* Therapist Features Grid */}
            <div>
              <div className="grid grid-cols-2 gap-4">
                {/* Therapist Card 1 */}
                <article className="bg-white rounded-xl p-5 border-l-4 border-teal hover:border-teal/80 transition-colors hover-shadow-lg">
                  <div className="w-6 h-6 rounded bg-teal/10 flex items-center justify-center mb-3">
                    <Users className="w-3 h-3 text-teal" />
                  </div>
                  <h3 className="font-medium text-base text-navy mb-1">Patient Monitoring</h3>
                  <p className="text-xs text-muted">
                    Track assigned patients' adherence, pain trends, and activity.
                  </p>
                </article>

                {/* Therapist Card 2 */}
                <article className="bg-white rounded-xl p-5 border-l-4 border-teal hover:border-teal/80 transition-colors hover-shadow-lg">
                  <div className="w-6 h-6 rounded bg-teal/10 flex items-center justify-center mb-3">
                    <Dumbbell className="w-3 h-3 text-teal" />
                  </div>
                  <h3 className="font-medium text-base text-navy mb-1">Exercise Builder</h3>
                  <p className="text-xs text-muted">
                    Create and personalize home exercise plans with video URLs.
                  </p>
                </article>

                {/* Therapist Card 3 */}
                <article className="bg-white rounded-xl p-5 border-l-4 border-teal hover:border-teal/80 transition-colors hover-shadow-lg">
                  <div className="w-6 h-6 rounded bg-teal/10 flex items-center justify-center mb-3">
                    <AlertCircle className="w-3 h-3 text-teal" />
                  </div>
                  <h3 className="font-medium text-base text-navy mb-1">Alerts & Follow-ups</h3>
                  <p className="text-xs text-muted">
                    Flag missed sessions and worsening pain. Initiate communication.
                  </p>
                </article>

                {/* Therapist Card 4 */}
                <article className="bg-white rounded-xl p-5 border-l-4 border-teal hover:border-teal/80 transition-colors hover-shadow-lg">
                  <div className="w-6 h-6 rounded bg-teal/10 flex items-center justify-center mb-3">
                    <Clipboard className="w-3 h-3 text-teal" />
                  </div>
                  <h3 className="font-medium text-base text-navy mb-1">Team Management</h3>
                  <p className="text-xs text-muted">
                    Manage administrator accounts and platform configuration.
                  </p>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 md:py-32 bg-navy">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative">
            {/* Decorative element */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-teal/10 opacity-30"></div>
            
            <div className="relative">
              <h2 className="font-extrabol text-4xl md:text-5xl center text-white mb-12">
                Patient Testimonials
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Testimonial 1 */}
                <article className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 hover:bg-white/30 transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-teal/20 flex items-center justify-center mb-4">
                    <Dumbbell className="w-4 h-4 text-teal" />
                  </div>
                  <p className="text-lg text-white/90 leading-relaxed line-clamp-3 mb-4">
                    "PhysioTrack has transformed my recovery journey. I can now follow my exercises at home without confusion, and the progress tracking keeps me motivated."
                  </p>
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
                      alt="Alex"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-white">Alex, Patient</p>
                      <p className="text-xs text-teal/60">Recovery champion</p>
                    </div>
                  </div>
                </article>

                {/* Testimonial 2 */}
                <article className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 hover:bg-white/30 transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-teal/20 flex items-center justify-center mb-4">
                    <HeartPulse className="w-4 h-4 text-teal" />
                  </div>
                  <p className="text-lg text-white/90 leading-relaxed line-clamp-3 mb-4">
                    "Being able to track my pain levels and share them with my physiotherapist has been invaluable. Better-informed sessions."
                  </p>
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
                      alt="Sarah"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-white">Sarah, Patient</p>
                      <p className="text-xs text-teal/60">Recovery warrior</p>
                    </div>
                  </div>
                </article>

                {/* Testimonial 3 */}
                <article className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 hover:bg-white/30 transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-teal/20 flex items-center justify-center mb-4">
                    <Flame className="w-4 h-4 text-teal" />
                  </div>
                  <p className="text-lg text-white/90 leading-relaxed line-clamp-3 mb-4">
                    "The exercise library is intuitive, and the session player makes it easy to stay on track even on busy days."
                  </p>
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
                      alt="Michael"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-white">Michael, Patient</p>
                      <p className="text-xs text-teal/60">Consistent performer</p>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-navy/80 via-teal/50 to-navy/80">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-extrabol text-4xl md:text-5xl lg:text-6xl text-navy mb-6">
            Start your recovery today.
          </h2>
          <p className="text-lg text-muted mb-8 max-w-2xl mx-auto">
            Join thousands of patients who are regaining mobility and confidence
            with PhysioTrack. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <NavLink to="/register" className="btn-primary px-8 py-4 rounded-lg font-medium hover:bg-teal/90 transition-colors">
              Create Free Account
            </NavLink>
            <NavLink to="/login" className="btn-outline px-8 py-4 rounded-lg font-medium hover:bg-teal/5 transition-colors">
              Already have an account?
            </NavLink>
          </div>
        </div>
      </section>

      {/* Footer */
      <footer className="py-20 bg-navy">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* PhysioTrack AI */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-white">
                PhysioTrack AI
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Smart physical therapy home exercise compliance platform.
              </p>
            </div>

            {/* Product */}
            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="text-white/60 text-sm space-y-2">
                <li><a href="#features" className="hover:text-teal transition-colors">Features</a></li>
                <li><a href="#how" className="hover:text-teal transition-colors">How it works</a></li>
                <li><a href="#pricing" className="hover:text-teal transition-colors">Pricing</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="text-white/60 text-sm space-y-2">
                <li><a href="#about" className="hover:text-teal transition-colors">About</a></li>
                <li><a href="#contact" className="hover:text-teal transition-colors">Contact</a></li>
                <li><a href="#terms" className="hover:text-teal transition-colors">Terms of Service</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold text-white mb-4">Legal</h3>
              <ul className="text-white/60 text-sm space-y-2">
                <li><a href="#privacy" className="hover:text-teal transition-colors">Privacy Policy</a></li>
                <li><a href="#disclaimer" className="hover:text-teal transition-colors">Medical Disclaimer</a></li>
                <li><a href="#accessibility" className="hover:text-teal transition-colors">Accessibility</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom footer */
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between align-items-center">
            <p className="text-white/60 text-sm">2026 PhysioTrack AI. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <NavLink to="/about" className="text-white/60 hover:text-teal transition-colors text-sm">About</NavLink>
              <NavLink to="/contact" className="text-white/60 hover:text-teal transition-colors text-sm">Contact</NavLink>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* Animations */
@keyframes fade-in-0 {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse-slow {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .animate-pulse-slow {
    animation: none;
  }
}