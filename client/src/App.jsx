import React, { useState, useEffect } from 'react';
import coachImg from './assets/coach_ranu_patel.png';
import dawnImg from './assets/brahma_muhurat_dawn.jpg';
import logoImg from './assets/logo_brahmamuhurta.jpg';

const COUNTRY_CONFIG = {
  India: {
    code: '+91',
    name: 'India',
    flag: '🇮🇳',
    placeholder: 'Enter 10-digit WhatsApp number'
  },
  'United States': {
    code: '+1',
    name: 'United States',
    flag: '🇺🇸',
    placeholder: 'e.g. (555) 000-0000'
  },
  UAE: {
    code: '+971',
    name: 'UAE',
    flag: '🇦🇪',
    placeholder: 'e.g. 50 123 4567'
  },
  UK: {
    code: '+44',
    name: 'UK',
    flag: '🇬🇧',
    placeholder: 'e.g. 7911 123456'
  },
  Canada: {
    code: '+1',
    name: 'Canada',
    flag: '🇨🇦',
    placeholder: 'e.g. (555) 000-0000'
  },
  Australia: {
    code: '+61',
    name: 'Australia',
    flag: '🇦🇺',
    placeholder: 'e.g. 412 345 678'
  },
  Other: {
    code: '+',
    name: 'Other',
    flag: '🌍',
    placeholder: 'Include country code with number'
  }
};

const ROLE_OPTIONS = [
  'Working Professional',
  'Entrepreneur / Business Owner',
  'Founder-CEO',
  'Student / Seeker',
  'Parent',
  'Homemaker',
  'Service Provider',
  'Coach-Consultant',
  'Retired-Older Adult',
  'Other'
];

export default function App() {
  const [selectedCountry, setSelectedCountry] = useState('India');
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [showFloatingBar, setShowFloatingBar] = useState(false);
  const [seatsLeft, setSeatsLeft] = useState(6);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    whatsapp: '',
    userRole: 'Working Professional',
    interestReason: '',
    consent: true
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Handle Scroll for Floating Bar
  useEffect(() => {
    const handleScroll = () => {
      const hero = document.getElementById('hero');
      if (hero) {
        const bottom = hero.getBoundingClientRect().bottom;
        setShowFloatingBar(bottom < 0);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleCountryChange = (countryKey) => {
    setSelectedCountry(countryKey);
  };

  const currentCountryInfo = COUNTRY_CONFIG[selectedCountry] || COUNTRY_CONFIG.India;

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = 'Please enter your full name.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!formData.whatsapp.trim() || formData.whatsapp.trim().length < 6) {
      errors.whatsapp = 'Please enter a valid WhatsApp number.';
    }

    if (!formData.consent) {
      errors.consent = 'Please agree to receive workshop access updates to continue.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
      await fetch(`${API_BASE}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          whatsapp: `${currentCountryInfo.code} ${formData.whatsapp.trim()}`,
          country: selectedCountry,
          userRole: formData.userRole,
          interestReason: formData.interestReason.trim(),
          consent: formData.consent,
          fee: 'FREE',
          stuckArea: formData.interestReason.trim() || formData.userRole
        })
      });
    } catch (err) {
      console.warn('API submission notice:', err);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setSeatsLeft(5);
    }
  };

  const firstName = formData.fullName.trim().split(' ')[0] || 'Friend';

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Google Calendar Event Link (7 Oct 2026, 8:30 PM IST = 15:00 UTC)
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    'Wake Before The World — Reset Your Mind. Realign Your Life (Day 1 & 2)'
  )}&dates=20261007T150000Z/20261007T160000Z&details=${encodeURIComponent(
    'The Narayan Presence 2-Day Live Workshop with Ranu Patel.\n\nSession 1: Wednesday, 7 October 2026 • 8:30 PM IST\nSession 2: Thursday, 8 October 2026 • 8:30 PM IST\n\nDubai: 7:00 PM • New York: 11:00 AM EDT\nZoom links sent via WhatsApp.'
  )}&location=${encodeURIComponent('Live Online Zoom')}`;

  // Download .ics file for Outlook / Apple Calendar
  const downloadIcsFile = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//The Narayan Presence//Workshop//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'SUMMARY:Wake Before The World — Reset Your Mind. Realign Your Life (Session 1)',
      'DESCRIPTION:Day 1 of 2-Day Live Workshop with Ranu Patel. Live on Zoom.',
      'DTSTART:20261007T150000Z',
      'DTEND:20261007T160000Z',
      'LOCATION:Live Online on Zoom',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'BEGIN:VEVENT',
      'SUMMARY:Wake Before The World — Reset Your Mind. Realign Your Life (Session 2)',
      'DESCRIPTION:Day 2 of 2-Day Live Workshop with Ranu Patel. Live on Zoom.',
      'DTSTART:20261008T150000Z',
      'DTEND:20261008T160000Z',
      'LOCATION:Live Online on Zoom',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'narayan_workshop_oct7_8.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="landing-app">
      {/* Background Decorative Spotlight Glow */}
      <div className="spotlight-glow" aria-hidden="true"></div>

      {/* Top Header */}
      <header className="site-header">
        <div className="container header-inner">
          <a href="#hero" className="navbar-brand">
            <img src={logoImg} alt="Brahmamuhurta Logo" className="brand-logo-img" />
          </a>

          <button onClick={() => scrollToSection('register')} className="btn btn-sm btn-hero-highlight">
            RESERVE MY FREE SEAT →
          </button>
        </div>
      </header>


      {/* =========================================================================
           SECTION 1: HERO
           ========================================================================= */}
      <section id="hero" className="hero-section hero-clean-layout">
        <div className="container hero-clean-grid">
          
          {/* Left Column: Clean Typography & CTA */}
          <div className="hero-clean-left">
            
            {/* Eyebrow Label */}
            <div className="hero-eyebrow-tag">
              FREE LIVE ONLINE WORKSHOP FOR PERSONAL GROWTH &amp; SELF-AWARENESS
            </div>

            {/* Bold Headline */}
            <h1 className="hero-clean-title">
              Wake Before The World.<br />
              <span className="hero-highlight">Reset Your Mind. Realign Your Life.</span>
            </h1>

            {/* Coach Subtitle */}
            <div className="hero-coach-line">
              <span className="coach-highlight-name">Ranu Patel</span>
              <span className="coach-sep">—</span>
              <span className="coach-role">Co-Founder | Life Transformation Coach &amp; Consultant</span>
            </div>

            {/* Subheadline description */}
            <p className="hero-clean-desc">
              Start your day with greater clarity, intention and self-awareness—before the noise of the world takes over.
            </p>

            {/* Date / Time Block */}
            <div className="hero-datetime-card">
              <div className="datetime-row">
                <span className="dt-icon">📅</span>
                <div>
                  <strong>WEDNESDAY, 7 OCTOBER 2026 • 8:30 PM IST</strong><br />
                  <strong>THURSDAY, 8 OCTOBER 2026 • 8:30 PM IST</strong>
                </div>
              </div>
              <div className="datetime-sub">
                Dubai 7:00 PM • New York 11:00 AM*
                <small className="dt-note">*U.S. time varies by location and daylight saving time.</small>
              </div>
            </div>

            {/* Compact Info Badges Row */}
            <div className="hero-clean-chips">
              <span className="clean-chip">
                <span className="chip-icon">🎥</span> 2 Live Online Sessions (60 Mins Each)
              </span>
              <span className="clean-chip">
                <span className="chip-icon">🌐</span> English with Hindi support
              </span>
              <span className="clean-chip">
                <span className="chip-icon">🎁</span> 100% Free Workshop
              </span>
            </div>

            {/* Big Single Bold CTA Button */}
            <div className="hero-clean-cta-wrap">
              <button 
                onClick={() => scrollToSection('register')} 
                className="btn btn-hero-highlight"
                id="hero-primary-cta"
              >
                RESERVE MY FREE SEAT →
              </button>

              <div className="hero-clean-trust">
                <span>🌅 100% Free Live Online</span>
                <span className="trust-dot">•</span>
                <span>🔒 Small Founding Batch (20 Capped Seats)</span>
              </div>
            </div>

          </div>

          {/* Right Column: Spotlight Portrait of Coach */}
          <div className="hero-clean-right">
            <div className="coach-spotlight-wrapper">
              <div className="coach-halo-glow"></div>
              <img 
                src={coachImg} 
                alt="Ranu Patel - Co-Founder | Life Transformation Coach & Consultant" 
                className="coach-spotlight-img"
              />
              
              {/* Floating Batch Pill */}
              <div className="floating-batch-pill">
                <span className="live-status-dot"></span>
                <span className="batch-pill-text">Founding Batch · <strong>{seatsLeft} Seats Remaining</strong></span>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* =========================================================================
           SECTION 2: "THIS IS FOR YOU IF..."
           ========================================================================= */}
      <section id="for-you" className="section-padding for-you-section">
        <div className="container">
          
          <div className="section-header text-center">
            <span className="badge-pill">Self-Reflection Checklist</span>
            <h2 className="section-title">This Is For You If...</h2>
            <p className="section-subtitle">Take a slow breath and see if any of these resonate with your daily experience:</p>
          </div>

          <div className="checklist-grid">
            <div className="check-card">
              <div className="check-icon-wrap">😴</div>
              <div className="check-content">
                <p>You wake up tired — <strong>even after a full night's sleep</strong></p>
              </div>
            </div>

            <div className="check-card">
              <div className="check-icon-wrap">🌀</div>
              <div className="check-content">
                <p>Your mind is loud <strong>before your feet even hit the floor</strong></p>
              </div>
            </div>

            <div className="check-card">
              <div className="check-icon-wrap">💭</div>
              <div className="check-content">
                <p>You've tried routines, journals, and manifestation videos — <strong>and still feel stuck</strong></p>
              </div>
            </div>

            <div className="check-card">
              <div className="check-icon-wrap">💔</div>
              <div className="check-content">
                <p>You feel disconnected from the version of yourself <strong>you know you're capable of being</strong></p>
              </div>
            </div>

            <div className="check-card">
              <div className="check-icon-wrap">⏳</div>
              <div className="check-content">
                <p>You keep waiting for <strong>"the right time"</strong> to start changing your life</p>
              </div>
            </div>
          </div>

          {/* Core Epiphany Quote / Punchline */}
          <div className="punchline-banner">
            <div className="punchline-inner">
              <div className="quote-mark">“</div>
              <p className="punchline-text">
                You don't need a new life. You need a new morning — and a new way of thinking about what's possible for you.
              </p>
            </div>
          </div>

        </div>
      </section>


      {/* =========================================================================
           SECTION 3: THE NARAYAN METHOD — 4 SHIFTS TOWARD CONSCIOUS LIVING
           ========================================================================= */}
      <section id="framework" className="section-padding framework-section">
        <div className="container">
          
          <div className="section-header text-center">
            <span className="badge-pill">The Core Framework</span>
            <h2 className="section-title">The Narayan Method — 4 Shifts Toward Conscious Living</h2>
            <p className="section-subtitle max-w-750">
              A simple, teachable framework that connects awareness with everyday action.
            </p>
          </div>

          <div className="shifts-container">
            {/* Shift 1 */}
            <div className="shift-card">
              <div className="shift-number-col">
                <span className="shift-num">01</span>
                <div className="shift-line"></div>
              </div>
              <div className="shift-body">
                <div className="shift-tag">STEP 1 · PAUSE</div>
                <h3 className="shift-heading">Pause — Create Space to Observe Yourself</h3>
                <p className="shift-desc">
                  Learn to step out of autopilot before stress finds you. Meet morning stillness and build a calm nervous system buffer before the demands of the day begin.
                </p>
                <div className="shift-benefit-tag">🌿 Stillness before stress finds you</div>
              </div>
            </div>

            {/* Shift 2 */}
            <div className="shift-card">
              <div className="shift-number-col">
                <span className="shift-num">02</span>
                <div className="shift-line"></div>
              </div>
              <div className="shift-body">
                <div className="shift-tag">STEP 2 · NOTICE</div>
                <h3 className="shift-heading">Notice — Understand Thoughts, Emotions &amp; Patterns</h3>
                <p className="shift-desc">
                  Identify unconscious mental loops and limiting beliefs quietly running your decisions. Gain the clarity to observe your thoughts without getting trapped by them.
                </p>
                <div className="shift-benefit-tag">🧠 Self-awareness over unconscious programming</div>
              </div>
            </div>

            {/* Shift 3 */}
            <div className="shift-card">
              <div className="shift-number-col">
                <span className="shift-num">03</span>
                <div className="shift-line"></div>
              </div>
              <div className="shift-body">
                <div className="shift-tag">STEP 3 · REALIGN</div>
                <h3 className="shift-heading">Realign — Reconnect Actions With What Matters</h3>
                <p className="shift-desc">
                  Move from scattered wishing to grounded intention. Realign your daily focus with your true values and clear priorities — without toxic positivity or vague advice.
                </p>
                <div className="shift-benefit-tag">🎯 Grounded intention and genuine priority alignment</div>
              </div>
            </div>

            {/* Shift 4 */}
            <div className="shift-card">
              <div className="shift-number-col">
                <span className="shift-num">04</span>
                <div className="shift-line"></div>
              </div>
              <div className="shift-body">
                <div className="shift-tag">STEP 4 · PRACTICE</div>
                <h3 className="shift-heading">Practice — Turn Awareness Into Small Daily Actions</h3>
                <p className="shift-desc">
                  Awareness without action fades fast. Learn how to transform morning reflections into small, repeatable daily habits that carry momentum throughout your entire day.
                </p>
                <div className="shift-benefit-tag">⚡ Small, repeatable daily actions that last</div>
              </div>
            </div>
          </div>

          {/* Synthesis Callout */}
          <div className="framework-synthesis">
            <div className="synthesis-icon">✨</div>
            <p className="synthesis-text">
              <strong>LEARN → PRACTICE → EXPERIENCE → REFLECT → IMPROVE → SHARE</strong><br />
              A sequential method to quiet mental noise, understand your patterns, and build intentional daily habits.
            </p>
          </div>

        </div>
      </section>


      {/* =========================================================================
           SECTION 4: WHAT YOU'LL WALK AWAY WITH
           ========================================================================= */}
      <section id="outcomes" className="section-padding outcomes-section">
        <div className="container">
          
          <div className="section-header text-center">
            <span className="badge-pill">Tangible Outcomes</span>
            <h2 className="section-title">What You'll Walk Away With</h2>
            <p className="section-subtitle">Practical, grounded takeaways and frameworks you can use immediately:</p>
          </div>

          <div className="outcomes-grid">
            <div className="outcome-card">
              <div className="outcome-bullet-badge">01</div>
              <div className="outcome-content">
                <h4>Thought &amp; Habit Clarity</h4>
                <p>A clearer understanding of your thoughts, habits and unconscious daily patterns.</p>
              </div>
            </div>

            <div className="outcome-card">
              <div className="outcome-bullet-badge">02</div>
              <div className="outcome-content">
                <h4>Self-Awareness Framework</h4>
                <p>A practical self-awareness framework you can easily use on your own after the workshop.</p>
              </div>
            </div>

            <div className="outcome-card">
              <div className="outcome-bullet-badge">03</div>
              <div className="outcome-content">
                <h4>Mindfulness &amp; Reflection</h4>
                <p>Simple mindfulness and reflection practices to explore without complex rules or strain.</p>
              </div>
            </div>

            <div className="outcome-card">
              <div className="outcome-bullet-badge">04</div>
              <div className="outcome-content">
                <h4>Priority &amp; Intention Clarity</h4>
                <p>Greater clarity around your true priorities and how to live with daily intention.</p>
              </div>
            </div>

            <div className="outcome-card">
              <div className="outcome-bullet-badge">05</div>
              <div className="outcome-content">
                <h4>Repeatable Action System</h4>
                <p>A framework for turning insights and learning into small, repeatable everyday actions.</p>
              </div>
            </div>

            <div className="outcome-card">
              <div className="outcome-bullet-badge">06</div>
              <div className="outcome-content">
                <h4>Conscious Morning Approach</h4>
                <p>A more conscious, peaceful approach to beginning your day before world distractions start.</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-40">
            <button onClick={() => scrollToSection('register')} className="btn btn-hero-highlight btn-md">
              RESERVE MY FREE SEAT →
            </button>
          </div>

        </div>
      </section>


      {/* =========================================================================
           SECTION 5: FOUNDER STORY — WHY I CREATED THE NARAYAN PRESENCE
           ========================================================================= */}
      <section id="coach" className="section-padding coach-section">
        <div className="container">
          
          <div className="coach-container">
            <div className="coach-image-column">
              <div className="coach-photo-frame">
                <img src={coachImg} alt="Ranu Patel - Co-Founder" className="coach-main-photo" />
                <div className="coach-experience-badge">
                  <span className="exp-years">15+</span>
                  <span className="exp-label">Years Corporate &amp; Growth Experience</span>
                </div>
              </div>
            </div>

            <div className="coach-bio-column">
              <span className="badge-pill">Why I Created The Narayan Presence</span>
              <h2 className="coach-name-heading">Ranu Patel</h2>
              <p className="coach-title-subtitle">Co-Founder | Life Transformation Coach &amp; Consultant</p>
              
              <div className="coach-story-card">
                <p className="coach-quote-para">
                  For years, I focused on helping businesses grow—websites, digital strategy, SEO, branding, lead generation and technology.
                </p>
                <p className="coach-quote-para">
                  But eventually I started asking myself: <em>What about the person behind the work?</em>
                </p>
                <p className="coach-quote-para">
                  The professional dealing with pressure. The parent balancing responsibilities. The entrepreneur carrying endless decisions. The person who spends so much time caring for others that they forget to pause for themselves.
                </p>
                <p className="coach-quote-para">
                  I began learning from experienced teachers and experts across personal growth, mindfulness, mindset, self-awareness and reflective practices.
                </p>
                
                <div className="coach-principle-box" style={{ background: '#FFFDF9', border: '1px solid #FDE68A', padding: '14px 18px', borderRadius: '10px', margin: '16px 0' }}>
                  <strong style={{ color: '#B45309', fontSize: '0.88rem', letterSpacing: '0.04em' }}>MY GUIDING PRINCIPLE:</strong>
                  <div style={{ color: '#0F172A', fontWeight: 800, fontSize: '1rem', marginTop: '4px' }}>
                    LEARN → PRACTICE → EXPERIENCE → REFLECT → IMPROVE → SHARE
                  </div>
                </div>

                <p className="coach-quote-para">
                  I started applying what I learned to my own life first. That personal journey became the foundation of <strong>The Narayan Presence</strong>.
                </p>
                <p className="coach-quote-para" style={{ color: '#D97706', fontWeight: 700 }}>
                  This workshop is an invitation to begin that journey for yourself.
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>


      {/* =========================================================================
           SECTION 6: FOUNDING BATCH — SPECIAL INCLUSIONS
           ========================================================================= */}
      <section id="bonuses" className="section-padding bonuses-section">
        <div className="container">
          
          <div className="section-header text-center">
            <span className="badge-pill">Founding Batch Benefits</span>
            <h2 className="section-title">FOUNDING BATCH — SPECIAL INCLUSIONS</h2>
            <p className="section-subtitle">Exclusive materials and frameworks provided to live attendees in this cohort:</p>
          </div>

          <div className="bonuses-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
            {/* Inclusion 1 */}
            <div className="bonus-card">
              <div className="bonus-header">
                <span className="bonus-tag">INCLUSION #1</span>
                <span className="bonus-icon">📝</span>
              </div>
              <h3 className="bonus-title">Guided Reflection Worksheet</h3>
              <p className="bonus-desc">
                Structured reflection exercises and prompts to help you identify current habits, clarify personal priorities, and track your daily mindset shifts.
              </p>
            </div>

            {/* Inclusion 2 */}
            <div className="bonus-card">
              <div className="bonus-header">
                <span className="bonus-tag">INCLUSION #2</span>
                <span className="bonus-icon">🌅</span>
              </div>
              <h3 className="bonus-title">Morning Practice Guide</h3>
              <p className="bonus-desc">
                A simple, actionable guide to building a quiet morning reflection window without complicated rituals, rigid rules, or overwhelm.
              </p>
            </div>

            {/* Inclusion 3 */}
            <div className="bonus-card">
              <div className="bonus-header">
                <span className="bonus-tag">INCLUSION #3</span>
                <span className="bonus-icon">📚</span>
              </div>
              <h3 className="bonus-title">Workshop Notes &amp; Resources</h3>
              <p className="bonus-desc">
                Comprehensive summary notes, key frameworks, and recommended reference readings covered during the 2 live interactive sessions.
              </p>
            </div>

            {/* Inclusion 4 */}
            <div className="bonus-card">
              <div className="bonus-header">
                <span className="bonus-tag">INCLUSION #4</span>
                <span className="bonus-icon">🧭</span>
              </div>
              <h3 className="bonus-title">Personal Growth Framework</h3>
              <p className="bonus-desc">
                A visual roadmap connecting self-awareness, intentional choices, and daily practice for sustained long-term clarity.
              </p>
            </div>
          </div>

        </div>
      </section>


      {/* =========================================================================
           SECTION 7: WHO IS THIS WORKSHOP FOR?
           ========================================================================= */}
      <section id="who-should-join" className="section-padding who-section">
        <div className="container">
          
          <div className="section-header text-center">
            <span className="badge-pill">Target Audience</span>
            <h2 className="section-title">WHO IS THIS WORKSHOP FOR?</h2>
            <p className="section-subtitle">This 2-day live experience is crafted for anyone ready for meaningful internal growth:</p>
          </div>

          <div className="who-grid">
            <div className="who-card">
              <div className="who-avatar">🎓</div>
              <div className="who-text">
                <h4>Students &amp; Seekers</h4>
                <p>Who need calm focus, reduced mental noise, and daily discipline.</p>
              </div>
            </div>

            <div className="who-card">
              <div className="who-avatar">💼</div>
              <div className="who-text">
                <h4>Working Professionals</h4>
                <p>Dealing with pressure, autopilot routines, and looking for renewed mental clarity.</p>
              </div>
            </div>

            <div className="who-card">
              <div className="who-avatar">🏡</div>
              <div className="who-text">
                <h4>Parents &amp; Homemakers</h4>
                <p>Balancing family responsibilities who crave intentional time for themselves.</p>
              </div>
            </div>

            <div className="who-card">
              <div className="who-avatar">🚀</div>
              <div className="who-text">
                <h4>Entrepreneurs &amp; Founders</h4>
                <p>Carrying high-stakes decisions and seeking steady presence and grounded focus.</p>
              </div>
            </div>

            <div className="who-card">
              <div className="who-avatar">🤝</div>
              <div className="who-text">
                <h4>Service Providers &amp; Coaches</h4>
                <p>Pouring energy into others and needing to recharge their own internal foundation.</p>
              </div>
            </div>

            <div className="who-card">
              <div className="who-avatar">🌱</div>
              <div className="who-text">
                <h4>Anyone Ready to Grow</h4>
                <p>Anyone who wants to break old autopilot patterns and begin living consciously.</p>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* =========================================================================
           SECTION 8: 2-DAY LIVE SCHEDULE & TIME ZONES
           ========================================================================= */}
      <section className="urgency-section">
        <div className="container">
          <div className="urgency-card">
            <div className="urgency-badge">
              <span className="lock-icon">🔒</span> FOUNDING BATCH · 2-DAY LIVE SCHEDULE
            </div>
            <h3 className="urgency-quote">
              "Day 1 creates awareness and the core framework. Day 2 focuses on practice, reflection, implementation and live Q&amp;A."
            </h3>
            
            <div className="faq-table-wrap" style={{ margin: '24px 0' }}>
              <table className="tz-table">
                <thead>
                  <tr>
                    <th>Audience / Region</th>
                    <th>Session 1 (Day 1)</th>
                    <th>Session 2 (Day 2)</th>
                    <th>Schedule Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>🇮🇳 <strong>India (IST)</strong></td>
                    <td>7 Oct • 8:30 PM IST</td>
                    <td>8 Oct • 8:30 PM IST</td>
                    <td>Primary evening session (60 mins)</td>
                  </tr>
                  <tr>
                    <td>🇦🇪 <strong>Dubai / UAE (GST)</strong></td>
                    <td>7 Oct • 7:00 PM</td>
                    <td>8 Oct • 7:00 PM</td>
                    <td>Convenient evening live window</td>
                  </tr>
                  <tr>
                    <td>🇺🇸 <strong>New York (EDT)</strong></td>
                    <td>7 Oct • 11:00 AM</td>
                    <td>8 Oct • 11:00 AM</td>
                    <td>U.S. daylight time daytime option*</td>
                  </tr>
                  <tr>
                    <td>🇺🇸 <strong>Los Angeles (PDT)</strong></td>
                    <td>7 Oct • 8:00 AM</td>
                    <td>8 Oct • 8:00 AM</td>
                    <td>Early morning West Coast</td>
                  </tr>
                </tbody>
              </table>
              <p className="mt-15 text-muted" style={{ textAlign: 'center' }}>
                <small><em>*U.S. time varies by location and daylight saving time. Zoom links delivered directly via WhatsApp.</em></small>
              </p>
            </div>

            <div className="urgency-cta">
              <button onClick={() => scrollToSection('register')} className="btn btn-hero-highlight btn-lg">
                RESERVE MY FREE SEAT →
              </button>
            </div>
          </div>
        </div>
      </section>


      {/* =========================================================================
           SECTION 9: FREQUENTLY ASKED QUESTIONS
           ========================================================================= */}
      <section id="faq" className="section-padding faq-section">
        <div className="container max-w-900">
          
          <div className="section-header text-center">
            <span className="badge-pill">Got Questions?</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">Everything you need to know before joining this live cohort.</p>
          </div>

          <div className="faq-accordion">
            {/* FAQ 1 */}
            <div className={`faq-item ${openFaqIndex === 0 ? 'active' : ''}`}>
              <button className="faq-trigger" onClick={() => setOpenFaqIndex(openFaqIndex === 0 ? -1 : 0)}>
                <span className="faq-question">Is this workshop only about waking up early?</span>
                <span className="faq-arrow">+</span>
              </button>
              <div className="faq-answer">
                <p>
                  No. Rising early is a supportive practice, but the real focus is on self-awareness, understanding your mental patterns, and learning how to intentionally direct your focus and daily actions.
                </p>
              </div>
            </div>

            {/* FAQ 2 */}
            <div className={`faq-item ${openFaqIndex === 1 ? 'active' : ''}`}>
              <button className="faq-trigger" onClick={() => setOpenFaqIndex(openFaqIndex === 1 ? -1 : 1)}>
                <span className="faq-question">I'm not really a "morning person." Will this still work for me?</span>
                <span className="faq-arrow">+</span>
              </button>
              <div className="faq-answer">
                <p>
                  Yes. This is not about forcing yourself into a rigid routine. It's about understanding how to create intentional mental space and calmness during the day, regardless of your current schedule.
                </p>
              </div>
            </div>

            {/* FAQ 3 */}
            <div className={`faq-item ${openFaqIndex === 2 ? 'active' : ''}`}>
              <button className="faq-trigger" onClick={() => setOpenFaqIndex(openFaqIndex === 2 ? -1 : 2)}>
                <span className="faq-question">Why is the workshop split across 2 days?</span>
                <span className="faq-arrow">+</span>
              </button>
              <div className="faq-answer">
                <p>
                  Day 1 is designed to build awareness and share the core 4-step framework. Day 2 focuses on practice, personal reflection, habit implementation, and live interactive Q&amp;A.
                </p>
              </div>
            </div>

            {/* FAQ 4 */}
            <div className={`faq-item ${openFaqIndex === 3 ? 'active' : ''}`}>
              <button className="faq-trigger" onClick={() => setOpenFaqIndex(openFaqIndex === 3 ? -1 : 3)}>
                <span className="faq-question">What time is this in my time zone?</span>
                <span className="faq-arrow">+</span>
              </button>
              <div className="faq-answer">
                <p>
                  Both sessions take place on <strong>Wednesday, 7 October &amp; Thursday, 8 October 2026</strong> at:
                </p>
                <ul style={{ paddingLeft: '20px', marginTop: '10px', color: 'var(--text-secondary)' }}>
                  <li><strong>India (IST):</strong> 8:30 PM – 9:30 PM</li>
                  <li><strong>Dubai (GST):</strong> 7:00 PM – 8:00 PM</li>
                  <li><strong>New York (EDT):</strong> 11:00 AM – 12:00 PM*</li>
                  <li><strong>London (BST):</strong> 4:00 PM – 5:00 PM</li>
                </ul>
              </div>
            </div>

            {/* FAQ 5 */}
            <div className={`faq-item ${openFaqIndex === 4 ? 'active' : ''}`}>
              <button className="faq-trigger" onClick={() => setOpenFaqIndex(openFaqIndex === 4 ? -1 : 4)}>
                <span className="faq-question">Is this workshop religious or sectarian?</span>
                <span className="faq-arrow">+</span>
              </button>
              <div className="faq-answer">
                <p>
                  No. The workshop is entirely practical, secular, and focused on personal growth, mindset, self-reflection, and intentional living for people of all backgrounds.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* =========================================================================
           SECTION 10: REGISTRATION FORM / THANK-YOU PAGE
           ========================================================================= */}
      <section id="register" className="section-padding register-section">
        <div className="container max-w-850">
          
          <div className="form-wrapper-card">
            
            {!isSubmitted ? (
              <>
                <div className="form-card-header text-center">
                  <span className="badge-pill">Free Registration</span>
                  <h2 className="form-title">Reserve Your Seat</h2>
                  <p className="form-subtitle">
                    Wednesday 7 Oct &amp; Thursday 8 Oct 2026 • 8:30 PM IST (Dubai 7 PM • NY 11 AM*)
                  </p>

                  <div className="fee-display-container">
                    <div className="fee-pill-badges">
                      <span className="fee-badge active-badge free-tag">🎁 100% Free Live Online Workshop</span>
                      <span className="fee-badge">No Credit Card Required</span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleFormSubmit} className="registration-form" noValidate>
                  {/* Field 1: Full Name */}
                  <div className={`form-group ${formErrors.fullName ? 'has-error' : ''}`}>
                    <label htmlFor="fullName" className="form-label">
                      1. Full Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      className="form-input"
                      placeholder="What should we call you?"
                      value={formData.fullName}
                      onChange={handleInputChange}
                    />
                    {formErrors.fullName && <span className="error-msg">{formErrors.fullName}</span>}
                  </div>

                  {/* Field 2: Email Address */}
                  <div className={`form-group ${formErrors.email ? 'has-error' : ''}`}>
                    <label htmlFor="email" className="form-label">
                      2. Email Address <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-input"
                      placeholder="Where should we send your workshop details?"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                    {formErrors.email && <span className="error-msg">{formErrors.email}</span>}
                  </div>

                  {/* Field 3: WhatsApp Number */}
                  <div className={`form-group ${formErrors.whatsapp ? 'has-error' : ''}`}>
                    <label htmlFor="whatsapp" className="form-label">
                      3. WhatsApp Number <span className="required">*</span>
                    </label>
                    <div className="phone-input-group">
                      <span className="country-prefix">{currentCountryInfo.code}</span>
                      <input
                        type="tel"
                        id="whatsapp"
                        name="whatsapp"
                        className="form-input phone-field"
                        placeholder={currentCountryInfo.placeholder}
                        value={formData.whatsapp}
                        onChange={handleInputChange}
                      />
                    </div>
                    <span className="field-hint">For workshop reminders, Zoom links, and important session updates.</span>
                    {formErrors.whatsapp && <span className="error-msg">{formErrors.whatsapp}</span>}
                  </div>

                  {/* Field 4: Country */}
                  <div className="form-group">
                    <label className="form-label">
                      4. Country <span className="required">*</span>
                    </label>
                    <div className="radio-cards-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))' }}>
                      {Object.keys(COUNTRY_CONFIG).map((countryKey) => {
                        const item = COUNTRY_CONFIG[countryKey];
                        return (
                          <label
                            key={countryKey}
                            className={`radio-card ${selectedCountry === countryKey ? 'selected' : ''}`}
                            onClick={() => handleCountryChange(countryKey)}
                          >
                            <input
                              type="radio"
                              name="country"
                              value={countryKey}
                              checked={selectedCountry === countryKey}
                              onChange={() => handleCountryChange(countryKey)}
                            />
                            <span className="radio-card-content">
                              <span className="flag-icon">{item.flag}</span>
                              <span className="country-name">{item.name}</span>
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Field 5: What best describes you? */}
                  <div className="form-group">
                    <label htmlFor="userRole" className="form-label">
                      5. What best describes you? <span className="required">*</span>
                    </label>
                    <select
                      id="userRole"
                      name="userRole"
                      className="form-input"
                      value={formData.userRole}
                      onChange={handleInputChange}
                      style={{ padding: '12px 14px', borderRadius: 'var(--radius-sm)' }}
                    >
                      {ROLE_OPTIONS.map((role) => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>

                  {/* Field 6: What made you interested in joining this workshop? (Optional) */}
                  <div className="form-group">
                    <label htmlFor="interestReason" className="form-label">
                      6. What made you interested in joining this workshop? <small className="text-muted">(Optional)</small>
                    </label>
                    <textarea
                      id="interestReason"
                      name="interestReason"
                      rows={3}
                      className="form-input form-textarea"
                      placeholder="e.g. Personal growth, overthinking, lack of clarity, stress, habits, mindfulness, purpose, simply wanting to learn..."
                      value={formData.interestReason}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Field 7: Form Consent / Privacy Checkbox */}
                  <div className={`form-group ${formErrors.consent ? 'has-error' : ''}`} style={{ marginTop: '14px' }}>
                    <label className="form-checkbox-label">
                      <input
                        type="checkbox"
                        name="consent"
                        checked={formData.consent}
                        onChange={handleInputChange}
                      />
                      <span>
                        I agree to receive workshop access details, reminders and related updates by email and/or WhatsApp. I understand I can opt out of non-essential communications.
                      </span>
                    </label>
                    {formErrors.consent && <span className="error-msg">{formErrors.consent}</span>}
                  </div>

                  {/* Submit Button */}
                  <div className="form-submit-wrap">
                    <button type="submit" disabled={isSubmitting} className="btn btn-hero-highlight btn-xl btn-block" id="formSubmitBtn">
                      <span className="btn-text">{isSubmitting ? 'Reserving...' : 'RESERVE MY FREE SEAT →'}</span>
                      <span className="btn-subtext">— 100% Free Live Online Workshop</span>
                    </button>
                    <p className="form-guarantee-note">
                      🔒 Instant confirmation · Secure SSL connection · 100% Free
                    </p>
                  </div>
                </form>
              </>
            ) : (
              /* =========================================================================
                   SECTION 11: THANK-YOU PAGE / CONFIRMATION
                   ========================================================================= */
              <div className="thank-you-container">
                <div className="thank-you-badge">🎉 YOU’RE IN!</div>
                <h2 className="thank-you-title">Your seat for the workshop is reserved.</h2>
                <p className="thank-you-subtitle">
                  <strong>Wake Before The World — Reset Your Mind. Realign Your Life.</strong>
                </p>

                {/* Event Schedule Box */}
                <div className="thank-you-schedule-card">
                  <div className="schedule-item">
                    <span className="sched-icon">📅</span>
                    <div>
                      <strong>Session 1:</strong> Wednesday, 7 October 2026 • 8:30 PM IST
                    </div>
                  </div>
                  <div className="schedule-item">
                    <span className="sched-icon">📅</span>
                    <div>
                      <strong>Session 2:</strong> Thursday, 8 October 2026 • 8:30 PM IST
                    </div>
                  </div>
                  <div className="schedule-subtext">
                    🌍 <strong>Dubai:</strong> 7:00 PM • <strong>New York:</strong> 11:00 AM*<br />
                    🎥 <em>Live Online • 60 Minutes Each • Free</em><br />
                    <small>*U.S. time varies by location and daylight saving time.</small>
                  </div>
                </div>

                {/* 3 Action Steps Box */}
                <div className="thank-you-actions-card">
                  <h3 className="actions-card-title">Do These 3 Things Now</h3>
                  
                  {/* Step 1 */}
                  <div className="action-step-item">
                    <div className="step-num">1️⃣</div>
                    <div className="step-body">
                      <h4>Add the event to your calendar</h4>
                      <p>Lock both Session 1 and Session 2 into your schedule so you don't miss the live stream:</p>
                      <div className="calendar-buttons-row">
                        <a
                          href={googleCalendarUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-cal"
                        >
                          📅 Add to Google Calendar
                        </a>
                        <button
                          type="button"
                          onClick={downloadIcsFile}
                          className="btn btn-outline-cal"
                        >
                          📥 Add to Outlook / Apple (.ics)
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="action-step-item">
                    <div className="step-num">2️⃣</div>
                    <div className="step-body">
                      <h4>Save the workshop time in your time zone</h4>
                      <div className="tz-chips">
                        <span className="tz-chip">🇮🇳 India: <strong>8:30 PM IST</strong></span>
                        <span className="tz-chip">🇦🇪 Dubai: <strong>7:00 PM</strong></span>
                        <span className="tz-chip">🇺🇸 New York: <strong>11:00 AM*</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="action-step-item highlight-step">
                    <div className="step-num">3️⃣</div>
                    <div className="step-body">
                      <h4>Join the official WhatsApp workshop group</h4>
                      <p>This is where we send live Zoom room access, reflection worksheets, and session updates.</p>
                      <a
                        href="https://chat.whatsapp.com/sample-group"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-whatsapp-join btn-block"
                      >
                        JOIN THE WORKSHOP WHATSAPP GROUP →
                      </a>
                    </div>
                  </div>
                </div>

                {/* Reflection Callout */}
                <div className="thank-you-reflection-card">
                  <div className="reflection-icon">💭</div>
                  <div className="reflection-text">
                    <strong>Before Day 1, take 5 minutes and reflect:</strong><br />
                    <em>"What is one area of my life where I want greater clarity right now?"</em> Don’t solve it. Just notice it—and bring that question with you.
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>


      {/* =========================================================================
           SECTION 12: FOOTER
           ========================================================================= */}
      <footer className="site-footer">
        <div className="container">
          
          <div className="footer-top">
            <div className="footer-brand">
              <div className="navbar-brand">
                <img src={logoImg} alt="Brahmamuhurta Logo" className="brand-logo-img" />
                <span className="brand-name">BRAHMAMUHURTA</span>
              </div>
              <p className="footer-motto">
                Wake Before The World. Reset Your Mind. Realign Your Life.
              </p>
            </div>

            <div className="footer-meta-notes">
              <div className="badge-pill sm">Live 2-Day Founding Batch</div>
              <p className="footer-time-reminder">
                <strong>Workshop Dates:</strong> 7 &amp; 8 October 2026 • 8:30 PM IST (Dubai 7:00 PM • New York 11:00 AM*).<br />
                The Narayan Presence • Awaken • Align • Transform
              </p>
            </div>
          </div>

          <hr className="footer-divider" />

          <div className="footer-disclaimer">
            <p>
              This page is not affiliated with, endorsed by, or connected to Meta, Facebook, Instagram, or Google in any way.
            </p>
          </div>

          <div className="footer-bottom">
            <div className="copyright">
              © {new Date().getFullYear()} The Narayan Presence. All Rights Reserved.
            </div>
            <div className="footer-legal-links">
              <button type="button" onClick={() => alert('Privacy Policy: The Narayan Presence strictly protects your personal information and will never share or sell your data.')}>
                Privacy Policy
              </button>
              <span className="legal-sep">|</span>
              <button type="button" onClick={() => alert('Terms & Conditions: All content is proprietary to The Narayan Presence and intended for personal transformational use.')}>
                Terms &amp; Conditions
              </button>
              <span className="legal-sep">|</span>
              <a
                href="/admin"
                style={{ color: '#F59E0B', fontWeight: 'bold', textDecoration: 'none' }}
                target="_blank"
                rel="noopener noreferrer"
              >
                ⚙️ Admin Portal
              </a>
            </div>
          </div>

        </div>
      </footer>


      {/* Floating Bar */}
      <div className={`floating-cta-bar ${showFloatingBar ? 'visible' : ''}`}>
        <div className="container floating-inner">
          <div className="floating-info">
            <span className="pulse-dot"></span>
            <span className="floating-batch-text"><strong>Founding Batch:</strong> 7 &amp; 8 Oct 2026 • {seatsLeft} Seats Left</span>
          </div>
          <button onClick={() => scrollToSection('register')} className="btn btn-hero-highlight btn-sm">
            RESERVE MY FREE SEAT →
          </button>
        </div>
      </div>
    </div>
  );
}
