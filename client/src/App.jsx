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
  'Student',
  'Parent',
  'Homemaker',
  'Entrepreneur',
  'Business Owner',
  'Founder/CEO',
  'Service Provider',
  'Coach/Consultant',
  'Retired/Older Adult',
  'Other'
];

export default function App() {
  const [selectedCountry, setSelectedCountry] = useState('India');
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
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
      errors.consent = 'Please agree to receive workshop access details to continue.';
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

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Google Calendar Event Link
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    'Brahma Muhurta Awakening — Reset Your Mind. Realign Your Life (Day 1 & 2)'
  )}&dates=20261007T150000Z/20261007T160000Z&details=${encodeURIComponent(
    'The Narayan Presence 2-Day Live Workshop with Ranu Patel.\n\nSession 1: Wednesday, 7 October 2026 • 8:30 PM IST\nSession 2: Thursday, 8 October 2026 • 8:30 PM IST\n\nDubai: 7:00 PM • New York: 11:00 AM EDT\nZoom links sent via WhatsApp.'
  )}&location=${encodeURIComponent('Live Online Zoom')}`;

  // Download .ics file
  const downloadIcsFile = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//The Narayan Presence//Workshop//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'SUMMARY:Brahma Muhurta Awakening (Session 1)',
      'DESCRIPTION:Day 1 of 2-Day Live Workshop with Ranu Patel. Live on Zoom.',
      'DTSTART:20261007T150000Z',
      'DTEND:20261007T160000Z',
      'LOCATION:Live Online on Zoom',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'BEGIN:VEVENT',
      'SUMMARY:Brahma Muhurta Awakening (Session 2)',
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
      {/* Background Ambient Atmosphere Glow */}
      <div className="spotlight-glow" aria-hidden="true"></div>

      {/* =========================================================================
           TOP NAVIGATION (Minimalist Artemis Pill Style)
           ========================================================================= */}
      <header className="site-header">
        <div className="container header-inner">
          <a href="#hero" className="navbar-brand">
            <img src={logoImg} alt="Brahmamuhurta Logo" className="brand-logo-img" />
            <div className="brand-title-wrap">
              <span className="brand-name">BRAHMAMUHURTA</span>
              <span className="brand-subline">The Narayan Presence</span>
            </div>
          </a>

          <button onClick={() => scrollToSection('register')} className="btn-header-action">
            RESERVE FREE SEAT ↗
          </button>
        </div>
      </header>


      {/* =========================================================================
           SECTION 1: HERO (Artemis Editorial Aesthetic)
           ========================================================================= */}
      <section id="hero" className="hero-editorial-section">
        <div className="container hero-editorial-grid">
          
          {/* Left Column: Clean Editorial Typography & Showcase */}
          <div className="hero-editorial-left">
            
            {/* Tag Pill */}
            <div className="hero-tag-pill">
              <span className="pill-dot"></span>
              <span>BRAHMA MUHURTA AWAKENING</span>
            </div>

            {/* Editorial Title */}
            <h1 className="hero-editorial-title">
              <em>Wake Before The World.</em>
              <span className="strong-sans">Reset Your Mind.</span>
              <em>Realign Your Life.</em>
            </h1>

            {/* Supporting Lines */}
            <div className="hero-supporting-badge">
              A Live 2-Day Personal Growth &amp; Self-Awareness Workshop
            </div>
            <div className="hero-host-line">
              Hosted by <strong>Ranu Patel</strong> (Co-Founder | Life Transformation Coach &amp; Consultant)
            </div>

            {/* Description */}
            <p className="hero-editorial-desc">
              Start your day with greater clarity, intention and self-awareness—before the noise of the world takes over.
            </p>

            {/* Refined Schedule Showcase Card */}
            <div className="schedule-showcase-artemis">
              <div className="showcase-header-row">
                <div className="live-pill-badge">
                  <span className="pulse-dot-live"></span>
                  <span>2-DAY LIVE ONLINE COHORT</span>
                </div>
                <span className="free-pill-badge">100% FREE ACCESS</span>
              </div>

              {/* 2-Day Side-by-Side Dates */}
              <div className="showcase-dates-grid">
                {/* Session 1 */}
                <div className="session-box">
                  <div className="date-stamp">
                    <span className="stamp-day">DAY 1</span>
                    <span className="stamp-num">07</span>
                    <span className="stamp-month">OCT 2026</span>
                  </div>
                  <div className="session-meta">
                    <span className="session-day-name">Wednesday</span>
                    <div className="session-clock-time">8:30 PM <small>IST</small></div>
                    <span className="session-tag-sm">Awareness &amp; Reset</span>
                  </div>
                </div>

                <div className="session-plus-sep">+</div>

                {/* Session 2 */}
                <div className="session-box">
                  <div className="date-stamp accent">
                    <span className="stamp-day">DAY 2</span>
                    <span className="stamp-num">08</span>
                    <span className="stamp-month">OCT 2026</span>
                  </div>
                  <div className="session-meta">
                    <span className="session-day-name">Thursday</span>
                    <div className="session-clock-time">8:30 PM <small>IST</small></div>
                    <span className="session-tag-sm">Practice &amp; Realign</span>
                  </div>
                </div>
              </div>

              {/* World Timezone Strip */}
              <div className="world-clock-strip">
                <div className="clock-strip-label">🌍 Global Time Conversion:</div>
                <div className="clock-pills-row">
                  <div className="tz-pill-item highlight">
                    <span>🇮🇳</span> <span>India:</span> <strong>8:30 PM IST</strong>
                  </div>
                  <div className="tz-pill-item">
                    <span>🇦🇪</span> <span>Dubai:</span> <strong>7:00 PM</strong>
                  </div>
                  <div className="tz-pill-item">
                    <span>🇺🇸</span> <span>New York:</span> <strong>11:00 AM EDT*</strong>
                  </div>
                </div>
                <div className="tz-note-text">
                  *60 mins live per session. U.S. time varies by daylight saving.
                </div>
              </div>
            </div>

            {/* Info Chips */}
            <div className="hero-chips-wrap">
              <span className="info-chip-pill">🎥 2 Live Online Sessions (60 Mins Each)</span>
              <span className="info-chip-pill">🌐 English with Hindi support</span>
              <span className="info-chip-pill">🎁 100% Free Workshop</span>
            </div>

            {/* Primary CTA Button */}
            <div className="hero-cta-button-wrap">
              <button 
                onClick={() => scrollToSection('register')} 
                className="btn-primary-orange"
                id="hero-primary-cta"
              >
                RESERVE MY FREE SEAT ↗
              </button>

              <div className="hero-trust-subtext">
                <span>🌅 100% Free Live Online</span>
                <span>•</span>
                <span>🔒 Small Founding Batch (20 Capped Seats)</span>
              </div>
            </div>

          </div>

          {/* Right Column: Coach Spotlight Portrait */}
          <div className="hero-editorial-right">
            <div className="coach-artemis-frame">
              <div className="coach-aura-glow"></div>
              <img 
                src={coachImg} 
                alt="Ranu Patel - Co-Founder | Life Transformation Coach & Consultant" 
                className="coach-artemis-photo"
              />
              
              <div className="floating-coach-badge">
                <span className="batch-dot-live"></span>
                <span>Founding Batch · <strong>{seatsLeft} Seats Remaining</strong></span>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* =========================================================================
           SECTION 2: "THIS WORKSHOP IS FOR YOU IF..." (Stone Card Grid)
           ========================================================================= */}
      <section id="for-you" className="section-padding">
        <div className="container">
          
          <div className="section-header-artemis text-center">
            <span className="section-tag-mono">[ SELF-REFLECTION CHECKLIST ]</span>
            <h2 className="section-heading-artemis">
              This Workshop Is <em>For You If…</em>
            </h2>
            <p className="section-subtext-artemis max-w-750">
              Take a slow breath and see if any of these resonate with your daily experience:
            </p>
          </div>

          <div className="artemis-card-grid">
            <div className="artemis-stone-card">
              <div className="card-icon-artemis">💡</div>
              <div className="card-text-artemis">
                You often <span className="marker-highlight">overthink</span> and want greater clarity.
              </div>
            </div>

            <div className="artemis-stone-card">
              <div className="card-icon-artemis">🌀</div>
              <div className="card-text-artemis">
                Your mind <span className="marker-highlight">feels busy</span> even when life looks fine from the outside.
              </div>
            </div>

            <div className="artemis-stone-card">
              <div className="card-icon-artemis">🔍</div>
              <div className="card-text-artemis">
                You want to understand <span className="marker-highlight">yourself, your thoughts and your patterns</span> better.
              </div>
            </div>

            <div className="artemis-stone-card">
              <div className="card-icon-artemis">🎯</div>
              <div className="card-text-artemis">
                You want to become <span className="marker-highlight">more consistent</span> with habits and daily practices.
              </div>
            </div>

            <div className="artemis-stone-card">
              <div className="card-icon-artemis">🌅</div>
              <div className="card-text-artemis">
                You want to start your day with <span className="marker-highlight">greater intention</span> instead of reacting to everything around you.
              </div>
            </div>

            <div className="artemis-stone-card">
              <div className="card-icon-artemis">🌱</div>
              <div className="card-text-artemis">
                You are ready to <span className="marker-highlight">pause, reflect, learn and grow</span>.
              </div>
            </div>
          </div>

          {/* Epiphany Banner */}
          <div className="editorial-quote-banner">
            <p className="quote-serif-text">
              “Awareness creates the space for conscious choice. Start your day with intention before the noise of the world takes over.”
            </p>
          </div>

        </div>
      </section>


      {/* =========================================================================
           SECTION 3: THE NARAYAN METHOD — 4 SHIFTS TOWARD CONSCIOUS LIVING
           ========================================================================= */}
      <section id="framework" className="section-padding" style={{ background: '#F5F3EE' }}>
        <div className="container">
          
          <div className="section-header-artemis text-center">
            <span className="section-tag-mono">[ THE CORE FRAMEWORK ]</span>
            <h2 className="section-heading-artemis">
              The Narayan Method — <em>4 Shifts Toward Conscious Living</em>
            </h2>
            <p className="section-subtext-artemis max-w-750">
              A simple, practical framework that connects awareness with everyday action.
            </p>
          </div>

          <div className="shifts-artemis-grid">
            {/* Shift 1 */}
            <div className="shift-artemis-card">
              <div>
                <div className="shift-header-top">
                  <span className="shift-num-serif">01</span>
                  <span className="shift-tag-pill">Step 1</span>
                </div>
                <h3 className="shift-title-artemis">Pause</h3>
                <p className="shift-desc-artemis">
                  Step out of autopilot and create space to observe yourself.
                </p>
              </div>
              <div className="shift-benefit-chip">🌿 Stillness before stress finds you</div>
            </div>

            {/* Shift 2 */}
            <div className="shift-artemis-card">
              <div>
                <div className="shift-header-top">
                  <span className="shift-num-serif">02</span>
                  <span className="shift-tag-pill">Step 2</span>
                </div>
                <h3 className="shift-title-artemis">Notice</h3>
                <p className="shift-desc-artemis">
                  Understand thoughts, emotions, habits and patterns.
                </p>
              </div>
              <div className="shift-benefit-chip">🧠 Self-awareness over unconscious routines</div>
            </div>

            {/* Shift 3 */}
            <div className="shift-artemis-card">
              <div>
                <div className="shift-header-top">
                  <span className="shift-num-serif">03</span>
                  <span className="shift-tag-pill">Step 3</span>
                </div>
                <h3 className="shift-title-artemis">Realign</h3>
                <p className="shift-desc-artemis">
                  Reconnect your actions with what matters to you.
                </p>
              </div>
              <div className="shift-benefit-chip">🎯 Grounded intention and priority alignment</div>
            </div>

            {/* Shift 4 */}
            <div className="shift-artemis-card">
              <div>
                <div className="shift-header-top">
                  <span className="shift-num-serif">04</span>
                  <span className="shift-tag-pill">Step 4</span>
                </div>
                <h3 className="shift-title-artemis">Practice</h3>
                <p className="shift-desc-artemis">
                  Turn awareness into small, consistent daily actions.
                </p>
              </div>
              <div className="shift-benefit-chip">⚡ Repeatable daily practices that last</div>
            </div>
          </div>

          <div className="editorial-quote-banner text-center" style={{ background: '#FFFFFF' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent-orange)', fontWeight: 700, letterSpacing: '0.08em' }}>
              SEQUENTIAL FRAMEWORK:
            </span>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontStyle: 'italic', marginTop: '6px', color: 'var(--text-primary)' }}>
              Learn → Practice → Experience → Reflect → Improve → Share
            </div>
          </div>

        </div>
      </section>


      {/* =========================================================================
           SECTION 4: WHAT YOU’LL WALK AWAY WITH
           ========================================================================= */}
      <section id="outcomes" className="section-padding">
        <div className="container">
          
          <div className="section-header-artemis text-center">
            <span className="section-tag-mono">[ TANGIBLE OUTCOMES ]</span>
            <h2 className="section-heading-artemis">
              What You’ll <em>Walk Away With</em>
            </h2>
            <p className="section-subtext-artemis max-w-750">
              Practical, grounded takeaways and frameworks you can use immediately:
            </p>
          </div>

          <div className="outcomes-artemis-grid">
            <div className="outcome-artemis-card">
              <div className="outcome-num-badge">01</div>
              <div className="outcome-body">
                <h4>Patterns &amp; Priorities Clarity</h4>
                <p>A clearer understanding of your current patterns and priorities.</p>
              </div>
            </div>

            <div className="outcome-artemis-card">
              <div className="outcome-num-badge">02</div>
              <div className="outcome-body">
                <h4>Self-Awareness Framework</h4>
                <p>A practical self-awareness framework you can use beyond the workshop.</p>
              </div>
            </div>

            <div className="outcome-artemis-card">
              <div className="outcome-num-badge">03</div>
              <div className="outcome-body">
                <h4>Mindfulness &amp; Reflection</h4>
                <p>Simple mindfulness and reflection practices for everyday life.</p>
              </div>
            </div>

            <div className="outcome-artemis-card">
              <div className="outcome-num-badge">04</div>
              <div className="outcome-body">
                <h4>Clarity on What Matters</h4>
                <p>Greater clarity around what matters to you right now.</p>
              </div>
            </div>

            <div className="outcome-artemis-card">
              <div className="outcome-num-badge">05</div>
              <div className="outcome-body">
                <h4>Consistent Action System</h4>
                <p>A practical way to turn awareness into consistent action.</p>
              </div>
            </div>

            <div className="outcome-artemis-card">
              <div className="outcome-num-badge">06</div>
              <div className="outcome-body">
                <h4>Intentional Morning Routine</h4>
                <p>A more intentional way to begin your day.</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-40">
            <button onClick={() => scrollToSection('register')} className="btn-primary-orange">
              RESERVE MY FREE SEAT ↗
            </button>
          </div>

        </div>
      </section>


      {/* =========================================================================
           SECTION 5: FOUNDER SECTION (Dark Charcoal Artemis Container)
           ========================================================================= */}
      <section id="coach" className="section-padding" style={{ paddingTop: 0 }}>
        <div className="container">
          
          <div className="founder-dark-container">
            <div className="founder-grid-layout">
              
              {/* Photo Frame */}
              <div className="founder-photo-col">
                <div className="founder-photo-frame-dark">
                  <img src={coachImg} alt="Ranu Patel - Co-Founder" className="founder-img-dark" />
                  <div className="founder-experience-tag">
                    ✦ 15+ Years Growth &amp; Mentorship
                  </div>
                </div>
              </div>

              {/* Bio Content */}
              <div className="founder-content-col">
                <div className="founder-tag-pill">
                  [ WHY I CREATED THE NARAYAN PRESENCE ]
                </div>
                <h2 className="founder-heading-dark">Ranu Patel</h2>
                <div className="founder-role-dark">
                  Co-Founder | Life Transformation Coach &amp; Consultant
                </div>

                <p className="founder-story-para">
                  For years, I focused on helping businesses grow. But eventually I started asking myself: <em>What about the person behind the work?</em>
                </p>
                <p className="founder-story-para">
                  As a professional, parent, entrepreneur and lifelong learner, I began looking more deeply at my own thoughts, habits, reactions and patterns. I learned from experienced teachers and experts, but more importantly, I started applying what I learned to my own life.
                </p>

                <div className="philosophy-strip-dark">
                  <div className="philosophy-label-dark">Core Philosophy:</div>
                  <div className="philosophy-flow-dark">
                    LEARN → PRACTICE → EXPERIENCE → REFLECT → IMPROVE → SHARE
                  </div>
                </div>

                <p className="founder-story-para">
                  The Narayan Presence grew from that journey—not from the idea that I have all the answers, but from the belief that learning becomes more meaningful when we practice, reflect and share what we experience.
                </p>

                <div className="founder-signature-dark">
                  Awaken • Align • Transform
                </div>

                <div style={{ marginTop: '20px' }}>
                  <button onClick={() => scrollToSection('register')} className="btn-primary-orange">
                    JOIN RANU IN THE FOUNDING BATCH ↗
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>


      {/* =========================================================================
           SECTION 6: FOUNDING BATCH — SPECIAL INCLUSIONS
           ========================================================================= */}
      <section id="bonuses" className="section-padding" style={{ background: '#F5F3EE' }}>
        <div className="container">
          
          <div className="section-header-artemis text-center">
            <span className="section-tag-mono">[ FOUNDING BATCH BENEFITS ]</span>
            <h2 className="section-heading-artemis">
              Founding Batch — <em>Special Inclusions</em>
            </h2>
            <p className="section-subtext-artemis max-w-750">
              Delivered live to all registered attendees in this cohort:
            </p>
          </div>

          <div className="inclusions-grid-artemis">
            <div className="inclusion-stone-card">
              <div className="inclusion-header-row">
                <span className="inclusion-tag">INCLUSION #1</span>
                <span className="inclusion-icon">🎥</span>
              </div>
              <h3 className="inclusion-title">Live 2-Day Workshop Access</h3>
              <p className="inclusion-desc">
                Two consecutive 60-minute live interactive sessions exploring self-awareness and conscious living.
              </p>
            </div>

            <div className="inclusion-stone-card">
              <div className="inclusion-header-row">
                <span className="inclusion-tag">INCLUSION #2</span>
                <span className="inclusion-icon">📝</span>
              </div>
              <h3 className="inclusion-title">Guided Reflection &amp; Exercises</h3>
              <p className="inclusion-desc">
                Structured practical reflection exercises and prompts to help observe thoughts and clarify personal priorities.
              </p>
            </div>

            <div className="inclusion-stone-card">
              <div className="inclusion-header-row">
                <span className="inclusion-tag">INCLUSION #3</span>
                <span className="inclusion-icon">📚</span>
              </div>
              <h3 className="inclusion-title">Workshop Resources / Workbook</h3>
              <p className="inclusion-desc">
                Practical takeaway workbook and reference frameworks for sustained daily practice beyond the workshop.
              </p>
            </div>

            <div className="inclusion-stone-card">
              <div className="inclusion-header-row">
                <span className="inclusion-tag">INCLUSION #4</span>
                <span className="inclusion-icon">💬</span>
              </div>
              <h3 className="inclusion-title">Live Q&amp;A / Reflection Space</h3>
              <p className="inclusion-desc">
                Dedicated reflection space and live interactive Q&amp;A to address your questions and personal reflections.
              </p>
            </div>
          </div>

        </div>
      </section>


      {/* =========================================================================
           SECTION 7: WHO IS THIS WORKSHOP FOR? (Pill Card Grid)
           ========================================================================= */}
      <section id="who-should-join" className="section-padding">
        <div className="container">
          
          <div className="section-header-artemis text-center">
            <span className="section-tag-mono">[ TARGET AUDIENCE ]</span>
            <h2 className="section-heading-artemis">
              Who Is This <em>Workshop For?</em>
            </h2>
            <p className="section-subtext-artemis max-w-750">
              This 2-day live experience is crafted for anyone ready for meaningful internal growth:
            </p>
          </div>

          <div className="who-cloud-grid">
            <div className="who-pill-card">
              <div className="who-avatar-icon">🎓</div>
              <div className="who-text-content">
                <h4>Students</h4>
                <p>Building calm focus, self-discipline and daily mental clarity.</p>
              </div>
            </div>

            <div className="who-pill-card">
              <div className="who-avatar-icon">💼</div>
              <div className="who-text-content">
                <h4>Working Professionals</h4>
                <p>Managing daily pressure, autopilot routines, and seeking clear mental presence.</p>
              </div>
            </div>

            <div className="who-pill-card">
              <div className="who-avatar-icon">🏡</div>
              <div className="who-text-content">
                <h4>Parents</h4>
                <p>Creating intentional, reflective personal space amidst family responsibilities.</p>
              </div>
            </div>

            <div className="who-pill-card">
              <div className="who-avatar-icon">🌸</div>
              <div className="who-text-content">
                <h4>Homemakers</h4>
                <p>Prioritizing personal growth, self-awareness, balance and peace.</p>
              </div>
            </div>

            <div className="who-pill-card">
              <div className="who-avatar-icon">🚀</div>
              <div className="who-text-content">
                <h4>Entrepreneurs &amp; Business Owners</h4>
                <p>Navigating decisions with grounded presence and focused intention.</p>
              </div>
            </div>

            <div className="who-pill-card">
              <div className="who-avatar-icon">👔</div>
              <div className="who-text-content">
                <h4>Founders &amp; Leaders</h4>
                <p>Cultivating steady inner leadership and conscious choice-making.</p>
              </div>
            </div>

            <div className="who-pill-card">
              <div className="who-avatar-icon">🤝</div>
              <div className="who-text-content">
                <h4>Coaches &amp; Consultants</h4>
                <p>Recharging their own internal foundation and personal self-awareness.</p>
              </div>
            </div>

            <div className="who-pill-card">
              <div className="who-avatar-icon">🌱</div>
              <div className="who-text-content">
                <h4>Anyone Ready to Explore</h4>
                <p>Anyone ready to explore personal growth, self-awareness and conscious living.</p>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* =========================================================================
           SECTION 8: 2-DAY LIVE SCHEDULE & TIME ZONES
           ========================================================================= */}
      <section className="section-padding" style={{ background: '#F5F3EE' }}>
        <div className="container max-w-850">
          
          <div className="schedule-table-card-artemis">
            <div className="section-header-artemis text-center" style={{ marginBottom: '24px' }}>
              <span className="section-tag-mono">[ 2-DAY LIVE ONLINE SCHEDULE ]</span>
              <h3 className="section-heading-artemis" style={{ fontSize: '2rem' }}>
                Workshop <em>Dates &amp; Time Zones</em>
              </h3>
              <p className="section-subtext-artemis" style={{ fontSize: '0.95rem' }}>
                Day 1 creates awareness and the core framework. Day 2 focuses on practice, reflection, implementation and live Q&amp;A.
              </p>
            </div>

            <div className="table-responsive-wrap">
              <table className="artemis-table">
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
                    <td>U.S. daytime option*</td>
                  </tr>
                  <tr>
                    <td>🇺🇸 <strong>Los Angeles (PDT)</strong></td>
                    <td>7 Oct • 8:00 AM</td>
                    <td>8 Oct • 8:00 AM</td>
                    <td>Early morning West Coast</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-muted text-center" style={{ fontSize: '0.8rem', marginTop: '12px' }}>
              <em>*U.S. time varies by location and daylight saving time. Zoom links delivered directly via WhatsApp.</em>
            </p>

            <div className="text-center mt-40">
              <button onClick={() => scrollToSection('register')} className="btn-primary-orange">
                RESERVE MY FREE SEAT ↗
              </button>
            </div>
          </div>

        </div>
      </section>


      {/* =========================================================================
           SECTION 9: FREQUENTLY ASKED QUESTIONS
           ========================================================================= */}
      <section id="faq" className="section-padding">
        <div className="container max-w-850">
          
          <div className="section-header-artemis text-center">
            <span className="section-tag-mono">[ FAQ ]</span>
            <h2 className="section-heading-artemis">
              Frequently Asked <em>Questions</em>
            </h2>
            <p className="section-subtext-artemis">
              Everything you need to know before joining this live cohort:
            </p>
          </div>

          <div className="faq-accordion-artemis">
            {/* FAQ 1 */}
            <div className={`faq-item-artemis ${openFaqIndex === 0 ? 'active' : ''}`}>
              <button className="faq-trigger-btn" onClick={() => setOpenFaqIndex(openFaqIndex === 0 ? -1 : 0)}>
                <span className="faq-question-text">Is this workshop really free?</span>
                <span className="faq-icon-toggle">+</span>
              </button>
              {openFaqIndex === 0 && (
                <div className="faq-answer-body">
                  <p>Yes, the live workshop is 100% free to attend.</p>
                </div>
              )}
            </div>

            {/* FAQ 2 */}
            <div className={`faq-item-artemis ${openFaqIndex === 1 ? 'active' : ''}`}>
              <button className="faq-trigger-btn" onClick={() => setOpenFaqIndex(openFaqIndex === 1 ? -1 : 1)}>
                <span className="faq-question-text">Do I need prior experience with meditation or mindfulness?</span>
                <span className="faq-icon-toggle">+</span>
              </button>
              {openFaqIndex === 1 && (
                <div className="faq-answer-body">
                  <p>No. The workshop is designed for beginners as well as people who already practice.</p>
                </div>
              )}
            </div>

            {/* FAQ 3 */}
            <div className={`faq-item-artemis ${openFaqIndex === 2 ? 'active' : ''}`}>
              <button className="faq-trigger-btn" onClick={() => setOpenFaqIndex(openFaqIndex === 2 ? -1 : 2)}>
                <span className="faq-question-text">Is this therapy or medical treatment?</span>
                <span className="faq-icon-toggle">+</span>
              </button>
              {openFaqIndex === 2 && (
                <div className="faq-answer-body">
                  <p>No. This is an educational and personal-growth workshop. It is not a substitute for qualified medical or mental-health care.</p>
                </div>
              )}
            </div>

            {/* FAQ 4 */}
            <div className={`faq-item-artemis ${openFaqIndex === 3 ? 'active' : ''}`}>
              <button className="faq-trigger-btn" onClick={() => setOpenFaqIndex(openFaqIndex === 3 ? -1 : 3)}>
                <span className="faq-question-text">How will I join?</span>
                <span className="faq-icon-toggle">+</span>
              </button>
              {openFaqIndex === 3 && (
                <div className="faq-answer-body">
                  <p>Participants will receive the live access details after registration via email and WhatsApp.</p>
                </div>
              )}
            </div>

            {/* FAQ 5 */}
            <div className={`faq-item-artemis ${openFaqIndex === 4 ? 'active' : ''}`}>
              <button className="faq-trigger-btn" onClick={() => setOpenFaqIndex(openFaqIndex === 4 ? -1 : 4)}>
                <span className="faq-question-text">What should I bring?</span>
                <span className="faq-icon-toggle">+</span>
              </button>
              {openFaqIndex === 4 && (
                <div className="faq-answer-body">
                  <p>Bring a notebook, a quiet space if possible, and a willingness to pause and reflect.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>


      {/* =========================================================================
           SECTION 10: REGISTRATION FORM / THANK-YOU PAGE
           ========================================================================= */}
      <section id="register" className="section-padding" style={{ background: '#F5F3EE' }}>
        <div className="container max-w-750">
          
          <div className="register-card-artemis">
            {!isSubmitted ? (
              <>
                <div className="form-header-artemis text-center">
                  <span className="section-tag-mono">[ 100% FREE ACCESS ]</span>
                  <h2 className="section-heading-artemis" style={{ fontSize: '2.4rem' }}>
                    Reserve Your <em>Free Seat</em>
                  </h2>
                  <p className="section-subtext-artemis" style={{ fontSize: '0.95rem' }}>
                    Wednesday 7 Oct &amp; Thursday 8 Oct 2026 • 8:30 PM IST (Dubai 7 PM • NY 11 AM*)
                  </p>
                </div>

                <form onSubmit={handleFormSubmit} noValidate>
                  {/* Full Name */}
                  <div className="form-group-artemis">
                    <label htmlFor="fullName" className="form-label-artemis">
                      1. Full Name *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      className="form-input-artemis"
                      placeholder="What should we call you?"
                      value={formData.fullName}
                      onChange={handleInputChange}
                    />
                    {formErrors.fullName && <span className="error-text-artemis">{formErrors.fullName}</span>}
                  </div>

                  {/* Email */}
                  <div className="form-group-artemis">
                    <label htmlFor="email" className="form-label-artemis">
                      2. Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-input-artemis"
                      placeholder="Where should we send your workshop details?"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                    {formErrors.email && <span className="error-text-artemis">{formErrors.email}</span>}
                  </div>

                  {/* WhatsApp */}
                  <div className="form-group-artemis">
                    <label htmlFor="whatsapp" className="form-label-artemis">
                      3. WhatsApp Number *
                    </label>
                    <div className="phone-group-wrap">
                      <span className="phone-prefix-artemis">{currentCountryInfo.code}</span>
                      <input
                        type="tel"
                        id="whatsapp"
                        name="whatsapp"
                        className="form-input-artemis phone-field-artemis"
                        placeholder={currentCountryInfo.placeholder}
                        value={formData.whatsapp}
                        onChange={handleInputChange}
                      />
                    </div>
                    {formErrors.whatsapp && <span className="error-text-artemis">{formErrors.whatsapp}</span>}
                  </div>

                  {/* Country Selection */}
                  <div className="form-group-artemis">
                    <label className="form-label-artemis">
                      4. Country *
                    </label>
                    <div className="country-grid-artemis">
                      {Object.keys(COUNTRY_CONFIG).map((countryKey) => {
                        const item = COUNTRY_CONFIG[countryKey];
                        return (
                          <label
                            key={countryKey}
                            className={`country-card-label ${selectedCountry === countryKey ? 'selected' : ''}`}
                            onClick={() => handleCountryChange(countryKey)}
                          >
                            <input
                              type="radio"
                              name="country"
                              value={countryKey}
                              checked={selectedCountry === countryKey}
                              onChange={() => handleCountryChange(countryKey)}
                            />
                            <span>{item.flag} {item.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* User Role */}
                  <div className="form-group-artemis">
                    <label htmlFor="userRole" className="form-label-artemis">
                      5. What best describes you? *
                    </label>
                    <select
                      id="userRole"
                      name="userRole"
                      className="form-input-artemis"
                      value={formData.userRole}
                      onChange={handleInputChange}
                    >
                      {ROLE_OPTIONS.map((role) => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>

                  {/* Interest Reason (Optional) */}
                  <div className="form-group-artemis">
                    <label htmlFor="interestReason" className="form-label-artemis">
                      6. What made you interested in joining this workshop? <small className="text-muted">(Optional)</small>
                    </label>
                    <textarea
                      id="interestReason"
                      name="interestReason"
                      rows={3}
                      className="form-input-artemis"
                      placeholder="e.g. Personal growth, overthinking, lack of clarity, habits, mindfulness, purpose..."
                      value={formData.interestReason}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Privacy Checkbox */}
                  <div className="form-group-artemis" style={{ marginTop: '10px' }}>
                    <label className="checkbox-label-artemis">
                      <input
                        type="checkbox"
                        name="consent"
                        checked={formData.consent}
                        onChange={handleInputChange}
                      />
                      <span>
                        Your information is used to send workshop access and reminder details. We respect your privacy and won't sell your information.
                      </span>
                    </label>
                    {formErrors.consent && <span className="error-text-artemis">{formErrors.consent}</span>}
                  </div>

                  {/* Submit Button */}
                  <div style={{ marginTop: '20px' }}>
                    <button type="submit" disabled={isSubmitting} className="btn-primary-orange" style={{ width: '100%' }}>
                      {isSubmitting ? 'RESERVING YOUR SEAT...' : 'RESERVE MY FREE SEAT ↗'}
                    </button>
                    <p className="text-muted text-center" style={{ fontSize: '0.8rem', marginTop: '10px' }}>
                      🔒 Instant confirmation · Secure SSL connection · 100% Free
                    </p>
                  </div>
                </form>
              </>
            ) : (
              /* Thank You Page */
              <div className="thank-you-artemis-wrap">
                <div className="thank-you-badge-artemis">🎉 YOU’RE IN!</div>
                <h2 className="thank-you-title-artemis">Your seat is reserved.</h2>
                <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                  <strong>Your registration for Brahma Muhurta Awakening is confirmed.</strong><br />
                  Wake Before The World — Reset Your Mind. Realign Your Life.
                </p>

                <div className="thank-you-actions-artemis">
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontStyle: 'italic', marginBottom: '14px', color: 'var(--text-primary)' }}>
                    Do These 3 Things Now:
                  </h3>

                  <div style={{ marginBottom: '16px' }}>
                    <strong>1️⃣ Add to your calendar:</strong>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '8px', flexWrap: 'wrap' }}>
                      <a href={googleCalendarUrl} target="_blank" rel="noopener noreferrer" className="btn-cal-artemis">
                        📅 Google Calendar
                      </a>
                      <button type="button" onClick={downloadIcsFile} className="btn-cal-artemis">
                        📥 Outlook / Apple (.ics)
                      </button>
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <strong>2️⃣ Save the workshop time in your time zone:</strong>
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      🇮🇳 India: 8:30 PM IST • 🇦🇪 Dubai: 7:00 PM • 🇺🇸 New York: 11:00 AM EDT*
                    </div>
                  </div>

                  <div>
                    <strong>3️⃣ Join the official WhatsApp group:</strong>
                    <a href="https://chat.whatsapp.com/sample-group" target="_blank" rel="noopener noreferrer" className="btn-whatsapp-artemis">
                      JOIN WORKSHOP WHATSAPP GROUP ↗
                    </a>
                  </div>
                </div>

                <div style={{ background: '#FFFFFF', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-md)', padding: '20px', textAlign: 'left', marginTop: '20px' }}>
                  <div style={{ fontStyle: 'italic', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    "Thank you for choosing to spend this time with yourself. I created this workshop because my own journey of learning, practicing and reflecting changed the way I look at life. I'm not here to tell you that I have all the answers. I'm here to share what I've learned, what I've practiced and what I've experienced—and create a space where you can explore your own journey. See you inside."
                  </div>
                  <div style={{ marginTop: '10px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    — Ranu Patel, Co-Founder, The Narayan Presence
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>


      {/* =========================================================================
           SECTION 12: SITE FOOTER (Artemis Minimalist Aesthetic)
           ========================================================================= */}
      <footer className="site-footer-artemis">
        <div className="container">
          
          <div className="footer-inner-top">
            <div className="footer-brand-side">
              <div className="navbar-brand">
                <img src={logoImg} alt="Brahmamuhurta Logo" className="brand-logo-img" />
                <div className="brand-title-wrap">
                  <span className="brand-name">BRAHMAMUHURTA</span>
                  <span className="brand-subline">The Narayan Presence</span>
                </div>
              </div>
              <p className="footer-tagline-artemis">
                Wake Before The World. Reset Your Mind. Realign Your Life.
              </p>
            </div>

            <div>
              <span className="section-tag-mono" style={{ background: '#FFFFFF' }}>[ FOUNDING BATCH ]</span>
              <p className="footer-schedule-reminder" style={{ marginTop: '8px' }}>
                <strong>Dates:</strong> 7 &amp; 8 October 2026 • 8:30 PM IST (Dubai 7 PM • NY 11 AM*)<br />
                The Narayan Presence • Awaken • Align • Transform
              </p>
            </div>
          </div>

          <hr className="footer-divider-artemis" />

          <div className="footer-bottom-artemis">
            <div>
              © {new Date().getFullYear()} The Narayan Presence. All Rights Reserved.
            </div>
            <div className="footer-links-artemis">
              <a href="https://narayanpresence.com/privacy-policy/" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>
              <span>·</span>
              <a href="https://narayanpresence.com/terms-and-conditions/" target="_blank" rel="noopener noreferrer">
                Terms &amp; Conditions
              </a>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}
