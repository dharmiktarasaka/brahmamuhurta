import React, { useState, useEffect } from 'react';
import coachImg from './assets/coach_ranu_patel.png';
import dawnImg from './assets/brahma_muhurat_dawn.jpg';

const COUNTRY_CONFIG = {
  India: {
    code: '+91',
    price: 'FREE',
    fullPrice: '100% Free Live Access',
    placeholder: 'Enter your 10-digit number',
    flag: '🇮🇳'
  },
  UAE: {
    code: '+971',
    price: 'FREE',
    fullPrice: '100% Free Live Access',
    placeholder: 'e.g. 50 123 4567',
    flag: '🇦🇪'
  },
  USA: {
    code: '+1',
    price: 'FREE',
    fullPrice: '100% Free Live Access',
    placeholder: 'e.g. (555) 000-0000',
    flag: '🇺🇸'
  },
  Other: {
    code: '+',
    price: 'FREE',
    fullPrice: '100% Free Live Access',
    placeholder: 'Include your country code',
    flag: '🌍'
  }
};

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
    stuckArea: '',
    liveCommit: "Yes, I'll be there live",
    goDeeper: "Yes, if it's right for me"
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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
  };

  const currentPriceInfo = COUNTRY_CONFIG[selectedCountry] || COUNTRY_CONFIG.India;

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
      errors.whatsapp = 'Please enter a valid WhatsApp / Phone number.';
    }

    if (!formData.stuckArea.trim()) {
      errors.stuckArea = 'Please share what feels most stuck right now.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Store into persistent Database via API
      const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
      await fetch(`${API_BASE}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          whatsapp: `${currentPriceInfo.code} ${formData.whatsapp.trim()}`,
          country: selectedCountry,
          fee: currentPriceInfo.price,
          stuckArea: formData.stuckArea.trim(),
          liveCommit: formData.liveCommit,
          goDeeper: formData.goDeeper
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

  return (
    <div className="landing-app">
      {/* Background Decorative Spotlight Glow */}
      <div className="spotlight-glow" aria-hidden="true"></div>


      {/* =========================================================================
           SECTION 1: HERO (Clean, Minimalist 100% VH Above-The-Fold Layout)
           ========================================================================= */}
      <section id="hero" className="hero-section hero-clean-layout">
        <div className="container hero-clean-grid">
          
          {/* Left Column: Clean Typography & CTA */}
          <div className="hero-clean-left">
            
            {/* Small handwritten eyebrow / curved note */}
            <div className="hero-handwritten-tag">
              <span className="curved-arrow">↳</span>
              <span className="handwritten-text">Founding Batch · Live 2-Day Workshop</span>
            </div>

            {/* Bold Headline */}
            <h1 className="hero-clean-title">
              Wake Before The World.<br />
              <span className="hero-highlight">Rewire Your Mind.</span><br />
              <span className="hero-title-sub">Become The Person Your Life Is Waiting For.</span>
            </h1>

            {/* Coach Subtitle */}
            <div className="hero-coach-line">
              <span className="coach-highlight-name">Ranu Patel</span>
              <span className="coach-sep">—</span>
              <span className="coach-role">Wellness Coach, Founder of Narayan Presence</span>
            </div>

            {/* Subheadline description */}
            <p className="hero-clean-desc">
              You've read the books. Tried the routines. Followed the advice. And you still wake up tired, stuck, and waiting for something to change. This isn't another routine — it's the shift underneath all of them.
            </p>

            {/* Compact Info Badges Row */}
            <div className="hero-clean-chips">
              <span className="clean-chip">
                <span className="chip-icon">📅</span> This Weekend Live (Sat &amp; Sun) · IST / GST / ET
              </span>
              <span className="clean-chip">
                <span className="chip-icon">🎥</span> Live on Zoom (Not recorded)
              </span>
              <span className="clean-chip">
                <span className="chip-icon">🌐</span> English with Hindi support
              </span>
            </div>

            {/* Big Single Bold CTA Button */}
            <div className="hero-clean-cta-wrap">
              <button 
                onClick={() => scrollToSection('register')} 
                className="btn btn-hero-highlight"
                id="hero-primary-cta"
              >
                Reserve My Free Spot →
              </button>

              <div className="hero-clean-trust">
                <span>🌅 100% Free Live Workshop</span>
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
                alt="Ranu Patel - Wellness Coach & Founder" 
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
           SECTION 3: THE FRAMEWORK (The Narayan Method — 4 Shifts)
           ========================================================================= */}
      <section id="framework" className="section-padding framework-section">
        <div className="container">
          
          <div className="section-header text-center">
            <span className="badge-pill">The Core Philosophy &amp; Architecture</span>
            <h2 className="section-title">The Narayan Method — 4 Shifts That Change Everything</h2>
            <p className="section-subtitle max-w-750">
              This is the bridge that makes <strong>Brahma Muhurat</strong> and <strong>Manifestation</strong> feel like one cohesive method instead of two unrelated topics stapled together.
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
                <div className="shift-tag">STEP 1 · THE ANCHOR</div>
                <h3 className="shift-heading">AWAKEN — The Brahma Muhurat Practice</h3>
                <p className="shift-desc">
                  Wake before the world does. Meet stillness before stress finds you. The ancient practice of rising in Brahma Muhurat, explained simply — no complicated rituals, no overwhelm. Just a shift in timing that changes how your entire day, and your nervous system, responds to it.
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
                <div className="shift-tag">STEP 2 · THE CLEANSE</div>
                <h3 className="shift-heading">REWIRE — The Subconscious Reset</h3>
                <p className="shift-desc">
                  Your thoughts today were installed years ago, by people and moments you didn't choose. Learn how to identify the limiting beliefs quietly running your life in the background — and how to begin releasing them.
                </p>
                <div className="shift-benefit-tag">🧠 Identify &amp; release unconscious programming</div>
              </div>
            </div>

            {/* Shift 3 */}
            <div className="shift-card">
              <div className="shift-number-col">
                <span className="shift-num">03</span>
                <div className="shift-line"></div>
              </div>
              <div className="shift-body">
                <div className="shift-tag">STEP 3 · THE VISION</div>
                <h3 className="shift-heading">ALIGN — The Manifestation Framework</h3>
                <p className="shift-desc">
                  Move from wishing to intentionally designing. A simple, grounded approach to visualization and intention-setting — without the vague "just think positive" advice that never actually changes anything.
                </p>
                <div className="shift-benefit-tag">🎯 Grounded intention without toxic positivity</div>
              </div>
            </div>

            {/* Shift 4 */}
            <div className="shift-card">
              <div className="shift-number-col">
                <span className="shift-num">04</span>
                <div className="shift-line"></div>
              </div>
              <div className="shift-body">
                <div className="shift-tag">STEP 4 · THE EXECUTION</div>
                <h3 className="shift-heading">ACT — The First 90 Minutes</h3>
                <p className="shift-desc">
                  Clarity without action is just a nice feeling. Learn how to turn your mornings into momentum that carries through your entire day, not just the hour you're awake for it.
                </p>
                <div className="shift-benefit-tag">⚡ Momentum that powers your entire day</div>
              </div>
            </div>
          </div>

          {/* Synthesis Callout */}
          <div className="framework-synthesis">
            <div className="synthesis-icon">✨</div>
            <p className="synthesis-text">
              <strong>No complex rituals. Just a sequence that works</strong> — because stillness (<em>Awaken</em>) creates the mental space that inner work (<em>Rewire, Align</em>) needs, and inner work is worthless without real-world follow-through (<em>Act</em>).
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
            <p className="section-subtitle">Real, grounded tools you will implement during the 2 live days and take forward:</p>
          </div>

          <div className="outcomes-grid">
            <div className="outcome-card">
              <div className="outcome-bullet-badge">01</div>
              <div className="outcome-content">
                <h4>Circadian &amp; Neural Science</h4>
                <p>Why the hour before sunrise affects your brain differently than any other hour of the day.</p>
              </div>
            </div>

            <div className="outcome-card">
              <div className="outcome-bullet-badge">02</div>
              <div className="outcome-content">
                <h4>Rapid Mental De-escalation</h4>
                <p>A simple way to quiet mental noise — without needing to meditate for an hour.</p>
              </div>
            </div>

            <div className="outcome-card">
              <div className="outcome-bullet-badge">03</div>
              <div className="outcome-content">
                <h4>Belief Uncovering Protocol</h4>
                <p>How to identify (and start releasing) one limiting belief that's been quietly running your life.</p>
              </div>
            </div>

            <div className="outcome-card">
              <div className="outcome-bullet-badge">04</div>
              <div className="outcome-content">
                <h4>Sustainable Manifestation</h4>
                <p>A visualization + intention-setting practice you can actually stick to.</p>
              </div>
            </div>

            <div className="outcome-card">
              <div className="outcome-bullet-badge">05</div>
              <div className="outcome-content">
                <h4>Ready-To-Use Morning Blueprint</h4>
                <p>A 90-minute morning structure you can start using the very next day.</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-40">
            <button onClick={() => scrollToSection('register')} className="btn btn-hero-highlight btn-md">
              Join The 2-Day Experience →
            </button>
          </div>

        </div>
      </section>


      {/* =========================================================================
           SECTION 5: MEET YOUR COACH
           ========================================================================= */}
      <section id="coach" className="section-padding coach-section">
        <div className="container">
          
          <div className="coach-container">
            <div className="coach-image-column">
              <div className="coach-photo-frame">
                <img src={coachImg} alt="Ranu Patel Wellness Coach" className="coach-main-photo" />
                <div className="coach-experience-badge">
                  <span className="exp-years">15+</span>
                  <span className="exp-label">Years Corporate &amp; Wellness Mastery</span>
                </div>
              </div>
            </div>

            <div className="coach-bio-column">
              <span className="badge-pill">Meet Your Coach</span>
              <h2 className="coach-name-heading">Ranu Patel</h2>
              <p className="coach-title-subtitle">Wellness Coach &amp; Founder, Narayan Presence</p>
              
              <div className="coach-story-card">
                <p className="coach-quote-para">
                  "I'm Ranu — and I built this workshop because I lived the exact thing you're feeling right now. For 15+ years, I built growth systems for businesses across the U.S. — the kind of high-output, always-on life that looks successful from the outside. But somewhere in the deadlines and time-zone calls, I burned out completely and lost touch with my own peace. Rebuilding that — one real morning at a time — is what led me here. This workshop is the exact system I used to come back to myself, and I'm inviting you to be one of the first to go through it with me, live."
                </p>
                
                <div className="coach-founding-note">
                  <div className="note-icon">🤝</div>
                  <p>
                    <strong>"This is the very first live batch of this workshop.</strong> I'm not promising you a program that's already helped thousands of people. I'm inviting you to be one of the first people I personally walk through this with — <em>live, with real access to me, not a pre-recorded funnel.</em>"
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>


      {/* =========================================================================
           SECTION 6: FOUNDING BATCH BONUSES
           ========================================================================= */}
      <section id="bonuses" className="section-padding bonuses-section">
        <div className="container">
          
          <div className="section-header text-center">
            <span className="badge-pill">Included At No Extra Cost</span>
            <h2 className="section-title">Founding Batch Bonuses</h2>
            <p className="section-subtitle">Because You're Part Of The Founding Batch, You'll Also Get:</p>
          </div>

          <div className="bonuses-grid">
            {/* Bonus 1 */}
            <div className="bonus-card">
              <div className="bonus-header">
                <span className="bonus-tag">BONUS #1</span>
                <span className="bonus-icon">🎁</span>
              </div>
              <div className="bonus-preview-art workbook-art">
                <div className="art-icon">📖</div>
                <span>Digital PDF Resource</span>
              </div>
              <h3 className="bonus-title">The Awakened Mornings Workbook (PDF)</h3>
              <p className="bonus-desc">
                Printable journal prompts, daily 90-minute structure templates, and belief-reframing worksheets to cement your practice.
              </p>
            </div>

            {/* Bonus 2 */}
            <div className="bonus-card">
              <div className="bonus-header">
                <span className="bonus-tag">BONUS #2</span>
                <span className="bonus-icon">🎁</span>
              </div>
              <div className="bonus-preview-art audio-art">
                <div className="art-icon">🎧</div>
                <span>High-Fidelity Audio</span>
              </div>
              <h3 className="bonus-title">A Guided Brahma Muhurat Meditation (Audio)</h3>
              <p className="bonus-desc">
                Calming, voice-guided pre-dawn audio track engineered to shift brainwaves from Beta to Theta/Alpha with zero effort.
              </p>
            </div>

            {/* Bonus 3 */}
            <div className="bonus-card">
              <div className="bonus-header">
                <span className="bonus-tag">BONUS #3</span>
                <span className="bonus-icon">🎁</span>
              </div>
              <div className="bonus-preview-art community-art">
                <div className="art-icon">👥</div>
                <span>Private Mastermind</span>
              </div>
              <h3 className="bonus-title">Private Community Access</h3>
              <p className="bonus-desc">
                Exclusive cohort community for continued accountability, direct peer interactions, and ongoing guidance after the workshop.
              </p>
            </div>
          </div>

        </div>
      </section>


      {/* =========================================================================
           SECTION 7: WHO SHOULD JOIN
           ========================================================================= */}
      <section id="who-should-join" className="section-padding who-section">
        <div className="container">
          
          <div className="section-header text-center">
            <span className="badge-pill">Target Audience</span>
            <h2 className="section-title">Who Should Join</h2>
            <p className="section-subtitle">This workshop is crafted intentionally for those ready for meaningful internal realignment:</p>
          </div>

          <div className="who-grid">
            <div className="who-card">
              <div className="who-avatar">💼</div>
              <div className="who-text">
                <h4>Working Professionals</h4>
                <p>Feeling stuck on autopilot and craving mental clarity and true energy.</p>
              </div>
            </div>

            <div className="who-card">
              <div className="who-avatar">🚀</div>
              <div className="who-text">
                <h4>Business Owners &amp; Entrepreneurs</h4>
                <p>Wanting focused clarity and sustained vitality to scale with poise.</p>
              </div>
            </div>

            <div className="who-card">
              <div className="who-avatar">🏡</div>
              <div className="who-text">
                <h4>Parents &amp; Homemakers</h4>
                <p>Craving a sacred moment in the day that is truly and unapologetically theirs.</p>
              </div>
            </div>

            <div className="who-card">
              <div className="who-avatar">🎓</div>
              <div className="who-text">
                <h4>Students &amp; Seekers</h4>
                <p>Who need razor-sharp focus, mental resilience, and quiet confidence.</p>
              </div>
            </div>

            <div className="who-card who-card-wide">
              <div className="who-avatar">🌱</div>
              <div className="who-text">
                <h4>Anyone Feeling Ready for Real Shift</h4>
                <p>Anyone who feels like they're doing "everything right" and still not moving forward.</p>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* =========================================================================
           SECTION 8: FOUNDING BATCH URGENCY (Honest Scarcity)
           ========================================================================= */}
      <section className="urgency-section">
        <div className="container">
          <div className="urgency-card">
            <div className="urgency-badge">
              <span className="lock-icon">🔒</span> HONEST SCARCITY · STRICT INTAKE
            </div>
            <h3 className="urgency-quote">
              "This is the very first live batch of this workshop — capped at 20 people so I can actually be present with everyone live. Once this batch is full, registration closes until the next one."
            </h3>
            
            <div className="urgency-stats">
              <div className="stat-box">
                <span className="stat-val">20</span>
                <span className="stat-lbl">Max Capacity</span>
              </div>
              <div className="stat-box highlight">
                <span className="stat-val">{seatsLeft}</span>
                <span className="stat-lbl">Remaining Seats</span>
              </div>
              <div className="stat-box">
                <span className="stat-val">2</span>
                <span className="stat-lbl">Live Days</span>
              </div>
            </div>

            <div className="urgency-cta">
              <button onClick={() => scrollToSection('register')} className="btn btn-hero-highlight btn-lg">
                Lock In Your Founding Seat Now
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
            <p className="section-subtitle">Everything you need to know before joining this weekend's live cohort.</p>
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
                  No. Brahma Muhurat is where we start, but the real work is what happens in your mind — releasing what's been holding you back and learning to intentionally direct your energy and focus.
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
                  This isn't about forcing yourself into a routine that doesn't fit. It's about understanding why this specific window works differently for your mind and body — then deciding for yourself if it's worth trying.
                </p>
              </div>
            </div>

            {/* FAQ 3 */}
            <div className={`faq-item ${openFaqIndex === 2 ? 'active' : ''}`}>
              <button className="faq-trigger" onClick={() => setOpenFaqIndex(openFaqIndex === 2 ? -1 : 2)}>
                <span className="faq-question">Will there be a recording?</span>
                <span className="faq-arrow">+</span>
              </button>
              <div className="faq-answer">
                <p>
                  This is a live-only experience, by design. The exercises work best when you're present and doing them in real time with the group.
                </p>
              </div>
            </div>

            {/* FAQ 4 */}
            <div className={`faq-item ${openFaqIndex === 3 ? 'active' : ''}`}>
              <button className="faq-trigger" onClick={() => setOpenFaqIndex(openFaqIndex === 3 ? -1 : 3)}>
                <span className="faq-question">I'm in the US / UAE — what time is this in my time zone?</span>
                <span className="faq-arrow">+</span>
              </button>
              <div className="faq-answer">
                <p>
                  See the time zone table below — we've converted it for you:
                </p>
                <div className="faq-table-wrap">
                  <table className="tz-table">
                    <thead>
                      <tr>
                        <th>Region</th>
                        <th>Time Zone</th>
                        <th>Schedule Window</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>🇮🇳 <strong>India</strong></td>
                        <td>IST (Indian Standard Time)</td>
                        <td>Early Morning Live Cohort</td>
                      </tr>
                      <tr>
                        <td>🇦🇪 <strong>UAE</strong></td>
                        <td>GST (Gulf Standard Time)</td>
                        <td>Early Morning Synchronized</td>
                      </tr>
                      <tr>
                        <td>🇺🇸 <strong>USA</strong></td>
                        <td>ET (Eastern Time)</td>
                        <td>Coordinated Live Session</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-15 text-muted">
                  <small><em>Exact calendar invites &amp; Zoom links are automatically sent to your WhatsApp immediately upon registration.</em></small>
                </p>
              </div>
            </div>

            {/* FAQ 5 */}
            <div className={`faq-item ${openFaqIndex === 4 ? 'active' : ''}`}>
              <button className="faq-trigger" onClick={() => setOpenFaqIndex(openFaqIndex === 4 ? -1 : 4)}>
                <span className="faq-question">What happens after the workshop?</span>
                <span className="faq-arrow">+</span>
              </button>
              <div className="faq-answer">
                <p>
                  You'll receive your bonuses, and if what you learn genuinely resonates, you'll have the option to go deeper with us afterward — no pressure either way.
                </p>
              </div>
            </div>

            {/* FAQ 6 */}
            <div className={`faq-item ${openFaqIndex === 5 ? 'active' : ''}`}>
              <button className="faq-trigger" onClick={() => setOpenFaqIndex(openFaqIndex === 5 ? -1 : 5)}>
                <span className="faq-question">Is this workshop religious?</span>
                <span className="faq-arrow">+</span>
              </button>
              <div className="faq-answer">
                <p>
                  No. Brahma Muhurat is referenced as a time-based practice rooted in tradition, but the workshop itself is practical and secular — for anyone, regardless of background or belief.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* =========================================================================
           SECTION 10: REGISTRATION FORM (with Qualifying Questions)
           ========================================================================= */}
      <section id="register" className="section-padding register-section">
        <div className="container max-w-850">
          
          <div className="form-wrapper-card">
            <div className="form-card-header text-center">
              <span className="badge-pill">Founding Batch Application</span>
              <h2 className="form-title">Reserve Your Spot</h2>
              <p className="form-subtitle">
                Single global registration with smart time-zone routing for your WhatsApp reminders.
              </p>

              {/* Pricing Pill Selector */}
              <div className="fee-display-container">
                <div className="fee-label">Founding Batch Access:</div>
                <div className="fee-pill-badges">
                  <span className="fee-badge active-badge free-tag">🎁 100% FREE Access</span>
                  <span className="fee-badge">No Credit Card Required</span>
                  <span className="fee-badge">Limited to 20 Founding Seats</span>
                </div>
              </div>
            </div>

            {!isSubmitted ? (
              <form onSubmit={handleFormSubmit} className="registration-form" noValidate>
                {/* Field 1: Full Name */}
                <div className={`form-group ${formErrors.fullName ? 'has-error' : ''}`}>
                  <label htmlFor="fullName" className="form-label">1. Full Name <span className="required">*</span></label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    className="form-input"
                    placeholder="e.g. Priya Sharma or Michael Vance"
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                  {formErrors.fullName && <span className="error-msg">{formErrors.fullName}</span>}
                </div>

                {/* Field 2: Email */}
                <div className={`form-group ${formErrors.email ? 'has-error' : ''}`}>
                  <label htmlFor="email" className="form-label">2. Email Address <span className="required">*</span></label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-input"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  {formErrors.email && <span className="error-msg">{formErrors.email}</span>}
                </div>

                {/* Field 3: WhatsApp / Phone */}
                <div className={`form-group ${formErrors.whatsapp ? 'has-error' : ''}`}>
                  <label htmlFor="whatsapp" className="form-label">3. WhatsApp / Phone Number <span className="required">*</span></label>
                  <div className="phone-input-group">
                    <span className="country-prefix">{currentPriceInfo.code}</span>
                    <input
                      type="tel"
                      id="whatsapp"
                      name="whatsapp"
                      className="form-input phone-field"
                      placeholder={currentPriceInfo.placeholder}
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                    />
                  </div>
                  <span className="field-hint">We send your private Zoom link and reminder directly on WhatsApp.</span>
                  {formErrors.whatsapp && <span className="error-msg">{formErrors.whatsapp}</span>}
                </div>

                {/* Field 4: Which country are you joining from? */}
                <div className="form-group">
                  <label className="form-label">4. Which country are you joining from? <span className="required">*</span></label>
                  <div className="radio-cards-grid four-cols">
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
                            <span className="country-name">{countryKey}</span>
                            <span className="price-hint">{item.price}</span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Field 5: What feels most "stuck" for you right now? */}
                <div className={`form-group ${formErrors.stuckArea ? 'has-error' : ''}`}>
                  <label htmlFor="stuckArea" className="form-label">
                    5. What feels most "stuck" for you right now? <span className="required">*</span>
                  </label>
                  <textarea
                    id="stuckArea"
                    name="stuckArea"
                    rows={3}
                    className="form-input form-textarea"
                    placeholder="Tell us about what's feeling heavy or blocked..."
                    value={formData.stuckArea}
                    onChange={handleInputChange}
                  />
                  <span className="field-prompt">
                    Prompt: "Your mornings, your mindset, or your goals — tell us in your own words."
                  </span>
                  {formErrors.stuckArea && <span className="error-msg">{formErrors.stuckArea}</span>}
                </div>

                {/* Field 6: Can you commit to joining live on [date]? */}
                <div className="form-group">
                  <label className="form-label">
                    6. This works best live — can you commit to joining live on This Weekend? <span className="required">*</span>
                  </label>
                  <div className="radio-options-list">
                    <label className="option-pill">
                      <input
                        type="radio"
                        name="liveCommit"
                        value="Yes, I'll be there live"
                        checked={formData.liveCommit === "Yes, I'll be there live"}
                        onChange={handleInputChange}
                      />
                      <span className="option-label"><strong>Yes</strong>, I'll be there live</span>
                    </label>
                    <label className="option-pill">
                      <input
                        type="radio"
                        name="liveCommit"
                        value="I can only catch a replay"
                        checked={formData.liveCommit === 'I can only catch a replay'}
                        onChange={handleInputChange}
                      />
                      <span className="option-label">I can only catch a replay</span>
                    </label>
                  </div>
                  {formData.liveCommit === 'I can only catch a replay' && (
                    <div className="replay-notice">
                      ⚠️ <em>Friendly reminder: This workshop is designed 100% live without replays to ensure active coaching and deep breakthrough.</em>
                    </div>
                  )}
                </div>

                {/* Field 7: Open to going deeper afterward? */}
                <div className="form-group">
                  <label className="form-label">
                    7. If this genuinely helps you, would you be open to going deeper afterward? <span className="required">*</span>
                  </label>
                  <div className="radio-options-list">
                    <label className="option-pill">
                      <input
                        type="radio"
                        name="goDeeper"
                        value="Yes, if it's right for me"
                        checked={formData.goDeeper === "Yes, if it's right for me"}
                        onChange={handleInputChange}
                      />
                      <span className="option-label">Yes, if it's right for me</span>
                    </label>
                    <label className="option-pill">
                      <input
                        type="radio"
                        name="goDeeper"
                        value="Maybe, I'd want to see it first"
                        checked={formData.goDeeper === "Maybe, I'd want to see it first"}
                        onChange={handleInputChange}
                      />
                      <span className="option-label">Maybe, I'd want to see it first</span>
                    </label>
                    <label className="option-pill">
                      <input
                        type="radio"
                        name="goDeeper"
                        value="No, I'm just here for this session"
                        checked={formData.goDeeper === "No, I'm just here for this session"}
                        onChange={handleInputChange}
                      />
                      <span className="option-label">No, I'm just here for this session</span>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="form-submit-wrap">
                  <button type="submit" disabled={isSubmitting} className="btn btn-hero-highlight btn-xl btn-block" id="formSubmitBtn">
                    <span className="btn-text">{isSubmitting ? 'Reserving...' : 'Reserve My Free Spot →'}</span>
                    <span className="btn-subtext">— 100% Free Live Access</span>
                  </button>
                  <p className="form-guarantee-note">
                    🔒 Instant confirmation · Secure SSL connection · 100% Free
                  </p>
                </div>
              </form>
            ) : (
              <div className="success-card">
                <div className="success-animation">✓</div>
                <h3 className="success-title">Registration Submitted!</h3>
                <p className="success-subtitle">
                  Thank you, <strong>{firstName}</strong>. Your spot has been reserved and stored in the database.
                </p>
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
                <span className="brand-symbol">ॐ</span>
                <span className="brand-name">NARAYAN PRESENCE</span>
              </div>
              <p className="footer-motto">
                Wake Before The World. Rewire Your Mind. Become The Person Your Life Is Waiting For.
              </p>
            </div>

            <div className="footer-meta-notes">
              <div className="badge-pill sm">Live 2-Day Founding Batch</div>
              <p className="footer-time-reminder">
                <strong>Weekend Cohort:</strong> This Weekend Live — Saturday &amp; Sunday.<br />
                Exact times confirmed on registration — reserve your spot now to get notified first.
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
              © {new Date().getFullYear()} Narayan Presence. All Rights Reserved.
            </div>
            <div className="footer-legal-links">
              <button type="button" onClick={() => alert('Privacy Policy: Narayan Presence strictly protects your personal information and will never share or sell your data.')}>
                Privacy Policy
              </button>
              <span className="legal-sep">|</span>
              <button type="button" onClick={() => alert('Refund Policy: If you attend live and do not feel a shift, contact us within 48 hours for an unconditional refund.')}>
                Refund Policy
              </button>
              <span className="legal-sep">|</span>
              <button type="button" onClick={() => alert('Terms & Conditions: All content is proprietary to Narayan Presence and intended for personal transformational use.')}>
                Terms &amp; Conditions
              </button>
              <span className="legal-sep">|</span>
              <button type="button" onClick={() => setIsAdminView(true)} style={{ color: '#F59E0B', fontWeight: 'bold' }}>
                ⚙️ Admin Login
              </button>
            </div>
          </div>

        </div>
      </footer>


      {/* Floating Bar */}
      <div className={`floating-cta-bar ${showFloatingBar ? 'visible' : ''}`}>
        <div className="container floating-inner">
          <div className="floating-info">
            <span className="pulse-dot"></span>
            <span className="floating-batch-text"><strong>Founding Batch:</strong> {seatsLeft} Seats Left</span>
          </div>
          <button onClick={() => scrollToSection('register')} className="btn btn-hero-highlight btn-sm">
            Reserve My Spot →
          </button>
        </div>
      </div>
    </div>
  );
}
