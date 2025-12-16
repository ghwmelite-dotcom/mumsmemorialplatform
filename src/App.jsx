import { useState, useEffect, useRef, useCallback } from 'react';

// Formspree endpoints
const FORMSPREE_GUESTBOOK = 'https://formspree.io/f/movgoyle';
const FORMSPREE_RSVP = 'https://formspree.io/f/xgvgjrzk';
const FORMSPREE_CONTACT = 'https://formspree.io/f/xkgdlkzz';

// ============================================
// PAGE LOADER COMPONENT
// ============================================

const PageLoader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('loading'); // loading, revealing, complete

  useEffect(() => {
    // Simulate loading progress
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setPhase('revealing');
          setTimeout(() => {
            setPhase('complete');
            setTimeout(onComplete, 500);
          }, 800);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [onComplete]);

  if (phase === 'complete') return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-cream transition-opacity duration-500 ${
      phase === 'revealing' ? 'opacity-0' : 'opacity-100'
    }`}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-gold rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 border border-gold rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="text-center relative z-10">
        {/* Animated Kente-inspired logo */}
        <div className="mb-8 relative">
          <div className="w-24 h-24 mx-auto relative">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-4 border-gold/30 animate-spin-slow" />
            {/* Middle ring */}
            <div className="absolute inset-2 rounded-full border-2 border-burgundy/40 animate-spin-slow" style={{ animationDirection: 'reverse' }} />
            {/* Inner ring */}
            <div className="absolute inset-4 rounded-full border-2 border-forest/40 animate-spin-slow" />
            {/* Center */}
            <div className="absolute inset-6 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
              <span className="text-white text-2xl">✦</span>
            </div>
          </div>
        </div>

        {/* Text */}
        <h2 className="font-display text-2xl text-charcoal mb-2 animate-pulse">
          In Loving Memory
        </h2>
        <p className="text-warm-gray text-sm mb-8">
          Josephine Worla Ameovi
        </p>

        {/* Progress bar */}
        <div className="w-48 mx-auto">
          <div className="h-1 bg-gold/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold to-gold-dark rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <p className="text-xs text-warm-gray mt-2">{Math.min(Math.round(progress), 100)}%</p>
        </div>

        {/* Decorative elements */}
        <div className="flex items-center justify-center gap-2 mt-8">
          <span className="h-px w-8 bg-gold/40" />
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce" style={{ animationDelay: '0s' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-burgundy animate-bounce" style={{ animationDelay: '0.1s' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-forest animate-bounce" style={{ animationDelay: '0.2s' }} />
          <span className="h-px w-8 bg-gold/40" />
        </div>
      </div>
    </div>
  );
};

// ============================================
// ANIMATION HOOKS & UTILITIES
// ============================================

const useScrollReveal = (options = {}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (options.once !== false) observer.unobserve(entry.target);
        }
      },
      { threshold: options.threshold || 0.1, rootMargin: options.rootMargin || '0px 0px -50px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
};

const useMouseParallax = (intensity = 0.02) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX - window.innerWidth / 2) * intensity;
      const y = (e.clientY - window.innerHeight / 2) * intensity;
      setPosition({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [intensity]);
  return position;
};

// ============================================
// DECORATIVE ELEMENTS
// ============================================

const FloatingPetals = () => {
  const petals = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 20 + 10,
    x: Math.random() * 100,
    delay: Math.random() * 15,
    duration: Math.random() * 20 + 20,
    rotation: Math.random() * 360
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute animate-petal-fall opacity-40"
          style={{
            left: `${petal.x}%`,
            top: '-5%',
            animationDelay: `${petal.delay}s`,
            animationDuration: `${petal.duration}s`,
          }}
        >
          <svg width={petal.size} height={petal.size} viewBox="0 0 24 24" style={{ transform: `rotate(${petal.rotation}deg)` }}>
            <ellipse cx="12" cy="12" rx="4" ry="10" fill="rgba(212,175,55,0.3)" />
          </svg>
        </div>
      ))}
    </div>
  );
};

const SoftGradientOrbs = () => {
  const mousePos = useMouseParallax(0.015);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute w-[800px] h-[800px] rounded-full blur-[150px] animate-float-slow"
        style={{
          background: 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 60%)',
          top: '-20%',
          right: '-20%',
          transform: `translate(${mousePos.x}px, ${mousePos.y}px)`
        }}
      />
      <div
        className="absolute w-[600px] h-[600px] rounded-full blur-[120px] animate-float-slow-reverse"
        style={{
          background: 'radial-gradient(circle, rgba(139,21,56,0.08) 0%, transparent 60%)',
          bottom: '-10%',
          left: '-10%',
          transform: `translate(${-mousePos.x}px, ${-mousePos.y}px)`
        }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full blur-[100px] animate-pulse-soft"
        style={{
          background: 'radial-gradient(circle, rgba(26,93,26,0.08) 0%, transparent 60%)',
          top: '40%',
          left: '30%',
        }}
      />
    </div>
  );
};

const KenteBorder = ({ className = '' }) => (
  <div className={`flex items-center justify-center gap-1 ${className}`}>
    {Array.from({ length: 30 }).map((_, i) => (
      <div key={i} className="flex gap-0.5">
        <div className="w-3 h-2 bg-gradient-to-b from-gold to-gold-dark rounded-sm" />
        <div className="w-1.5 h-2 bg-forest rounded-sm" />
        <div className="w-1.5 h-2 bg-burgundy rounded-sm" />
      </div>
    ))}
  </div>
);

const CornerOrnament = ({ position = 'top-left' }) => {
  const positions = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0 rotate-90',
    'bottom-left': 'bottom-0 left-0 -rotate-90',
    'bottom-right': 'bottom-0 right-0 rotate-180'
  };

  return (
    <svg className={`absolute w-24 h-24 text-gold/20 ${positions[position]}`} viewBox="0 0 100 100">
      <path d="M0,0 Q50,0 50,50 Q50,0 100,0" fill="none" stroke="currentColor" strokeWidth="1" />
      <path d="M0,20 Q30,20 30,50" fill="none" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="25" cy="25" r="3" fill="currentColor" />
    </svg>
  );
};

// ============================================
// REUSABLE COMPONENTS
// ============================================

const AnimatedSection = ({ children, className = '', delay = 0 }) => {
  const [ref, isVisible] = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
};

const SectionHeading = ({ eyebrow, title, subtitle, light = false }) => {
  const [ref, isVisible] = useScrollReveal();
  return (
    <div ref={ref} className="text-center mb-16 md:mb-20">
      {eyebrow && (
        <span
          className={`inline-block px-4 py-1.5 rounded-full text-xs tracking-[0.2em] uppercase mb-4 transition-all duration-700 ${
            light ? 'bg-white/20 text-white' : 'bg-gold/10 text-gold-dark'
          }`}
          style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(20px)' }}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={`font-display text-4xl md:text-5xl lg:text-6xl mb-4 transition-all duration-700 delay-100 ${
          light ? 'text-white' : 'text-charcoal'
        }`}
        style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(20px)', transitionDelay: '100ms' }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`text-lg max-w-2xl mx-auto transition-all duration-700 delay-200 ${
            light ? 'text-white/80' : 'text-warm-gray'
          }`}
          style={{ opacity: isVisible ? 1 : 0, transitionDelay: '200ms' }}
        >
          {subtitle}
        </p>
      )}
      <div
        className="flex items-center justify-center gap-2 mt-6 transition-all duration-1000 delay-300"
        style={{ opacity: isVisible ? 1 : 0, transitionDelay: '300ms' }}
      >
        <span className={`h-px w-12 ${light ? 'bg-white/40' : 'bg-gold/40'}`} />
        <span className={`w-2 h-2 rounded-full ${light ? 'bg-white/60' : 'bg-gold'}`} />
        <span className={`h-px w-12 ${light ? 'bg-white/40' : 'bg-gold/40'}`} />
      </div>
    </div>
  );
};

const Card = ({ children, className = '', hover = true, delay = 0 }) => {
  const [ref, isVisible] = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`bg-white rounded-2xl shadow-soft transition-all duration-500 ${
        hover ? 'hover:shadow-elevated hover:-translate-y-1' : ''
      } ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
};

const Button = ({ children, variant = 'primary', className = '', onClick, disabled = false, type = 'button' }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-gold to-gold-dark text-white hover:shadow-gold-glow',
    secondary: 'bg-white text-gold-dark border-2 border-gold hover:bg-gold hover:text-white',
    outline: 'bg-transparent border-2 border-white text-white hover:bg-white hover:text-charcoal'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${variants[variant]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      {children}
    </button>
  );
};

// Toast notification component
const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-forest' : type === 'error' ? 'bg-burgundy' : 'bg-gold-dark';

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${bgColor} text-white px-6 py-4 rounded-xl shadow-elevated animate-slide-up flex items-center gap-3`}>
      {type === 'success' && <span>✓</span>}
      {type === 'error' && <span>✕</span>}
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">✕</button>
    </div>
  );
};

// ============================================
// NAVIGATION
// ============================================

const Navigation = ({ activeSection, setActiveSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'life', label: 'Her Story' },
    { id: 'gallery', label: 'Memories' },
    { id: 'funeral', label: 'Service' },
    { id: 'guestbook', label: 'Tributes' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled ? 'bg-white/95 backdrop-blur-lg shadow-soft' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <button onClick={() => setActiveSection('home')} className="group">
            <span className={`font-display text-xl transition-colors duration-300 ${
              isScrolled ? 'text-charcoal' : 'text-white'
            } group-hover:text-gold`}>
              In Loving Memory
            </span>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeSection === item.id
                    ? 'bg-gold text-white'
                    : isScrolled
                      ? 'text-charcoal hover:text-gold hover:bg-gold/10'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isScrolled ? 'text-charcoal' : 'text-white'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          mobileMenuOpen ? 'max-h-96 pb-4' : 'max-h-0'
        }`}>
          <div className="bg-white rounded-2xl shadow-elevated p-2 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveSection(item.id); setMobileMenuOpen(false); }}
                className={`block w-full px-4 py-3 rounded-xl text-left font-medium transition-colors ${
                  activeSection === item.id
                    ? 'bg-gold text-white'
                    : 'text-charcoal hover:bg-cream'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

// ============================================
// HERO SECTION
// ============================================

const HeroSection = () => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => setLoaded(true), []);

  const calculateAge = () => {
    const birth = new Date(1948, 6, 15);
    const death = new Date(2025, 11, 14);
    return Math.floor((death - birth) / (365.25 * 24 * 60 * 60 * 1000));
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-charcoal-light to-burgundy-dark" />
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      <FloatingPetals />
      <SoftGradientOrbs />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className={`mb-8 transition-all duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-3 text-gold">
            <span className="h-px w-8 bg-current" />
            <span className="text-2xl">✦</span>
            <span className="h-px w-8 bg-current" />
          </div>
        </div>

        <div className={`mb-10 transition-all duration-1000 delay-100 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative inline-block">
            <div className="absolute -inset-4 rounded-full border-2 border-gold/30 animate-spin-slow" />
            <div className="absolute -inset-8 rounded-full border border-gold/20" />
            <div className="relative w-40 h-40 md:w-52 md:h-52 rounded-full overflow-hidden border-4 border-gold shadow-2xl bg-gradient-to-br from-charcoal-light to-charcoal">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-white/40">
                  <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                  <span className="text-xs">Photo</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`transition-all duration-1000 delay-200 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-gold font-medium tracking-[0.3em] uppercase text-sm mb-2">
            July 15, 1948 — December 14, 2025
          </p>
          <p className="text-white/60 text-sm mb-8">{calculateAge()} Years of Grace & Love</p>
        </div>

        <h1 className={`font-display text-5xl md:text-7xl lg:text-8xl text-white mb-6 transition-all duration-1000 delay-300 ${
          loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          Josephine <span className="text-gold">Worla</span> Ameovi
        </h1>

        <p className={`text-2xl md:text-3xl text-gold-light font-display italic mb-8 transition-all duration-1000 delay-400 ${
          loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          "Grandma"
        </p>

        <p className={`text-white/80 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12 transition-all duration-1000 delay-500 ${
          loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          A beloved mother, grandmother, and pillar of her community.
          Daughter of the Volta Region, whose wisdom and love knew no bounds.
        </p>

        <div className={`transition-all duration-1000 delay-600 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Button variant="outline" onClick={() => document.getElementById('life').scrollIntoView({ behavior: 'smooth' })}>
            Celebrate Her Life
          </Button>
        </div>

        <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-1000 delay-700 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex flex-col items-center text-white/50 animate-bounce-gentle">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <KenteBorder className="h-3 bg-gradient-to-r from-transparent via-black/20 to-transparent py-1" />
      </div>
    </section>
  );
};

// ============================================
// LIFE STORY SECTION
// ============================================

const LifeSection = () => {
  const milestones = [
    { year: '1948', title: 'A Star is Born', description: 'Josephine was born in the beautiful Volta Region of Ghana, surrounded by the rich traditions of the Ewe people.', icon: '🌟' },
    { year: 'Early Years', title: 'Growing in Grace', description: 'She grew up embracing her culture, learning the values of community, faith, and family that would guide her entire life.', icon: '🌱' },
    { year: 'Marriage', title: 'Building a Family', description: 'She became the cornerstone of her family, creating a home filled with love, warmth, and the aroma of delicious cooking.', icon: '💑' },
    { year: 'Legacy', title: 'A Life of Service', description: 'Known as "Grandma" to all who knew her, she touched countless lives through her kindness, wisdom, and generous spirit.', icon: '👑' }
  ];

  return (
    <section id="life" className="py-24 md:py-32 bg-cream relative overflow-hidden">
      <CornerOrnament position="top-left" />
      <CornerOrnament position="top-right" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SectionHeading eyebrow="Her Journey" title="A Life Beautifully Lived" subtitle="From the hills of Volta to the hearts of many, her story is one of love, strength, and enduring grace." />

        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-gold/0 via-gold/50 to-gold/0 hidden md:block" />

          <div className="space-y-12 md:space-y-0">
            {milestones.map((milestone, index) => (
              <AnimatedSection key={index} delay={index * 150}>
                <div className={`md:flex items-center gap-8 ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                  <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:pl-12'}`}>
                    <Card className="p-6 md:p-8 inline-block">
                      <span className="text-4xl mb-4 block">{milestone.icon}</span>
                      <span className="inline-block px-3 py-1 bg-gold/10 text-gold-dark rounded-full text-sm font-medium mb-3">{milestone.year}</span>
                      <h3 className="font-display text-2xl text-charcoal mb-3">{milestone.title}</h3>
                      <p className="text-warm-gray leading-relaxed">{milestone.description}</p>
                    </Card>
                  </div>
                  <div className="hidden md:flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-gold border-4 border-cream shadow-lg" />
                  </div>
                  <div className="md:w-1/2" />
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>

        <AnimatedSection delay={600}>
          <div className="mt-20 text-center">
            <div className="inline-block relative">
              <span className="absolute -top-6 -left-4 text-6xl text-gold/20 font-serif">"</span>
              <p className="text-2xl md:text-3xl font-display text-charcoal italic px-8">She lived not for herself, but for all those she loved.</p>
              <span className="absolute -bottom-8 -right-4 text-6xl text-gold/20 font-serif rotate-180">"</span>
            </div>
            <p className="text-warm-gray mt-8">— The Family</p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

// ============================================
// GALLERY SECTION
// ============================================

const GallerySection = () => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const photos = [
    { id: 1, span: 'col-span-2 row-span-2', label: 'Featured Memory' },
    { id: 2, span: '', label: 'Memory' },
    { id: 3, span: '', label: 'Memory' },
    { id: 4, span: '', label: 'Memory' },
    { id: 5, span: '', label: 'Memory' },
    { id: 6, span: 'col-span-2', label: 'Memory' },
  ];

  return (
    <section id="gallery" className="py-24 md:py-32 bg-white relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Photo Gallery" title="Cherished Memories" subtitle="A collection of moments that capture the joy, love, and warmth she brought to our lives." />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {photos.map((photo, index) => (
            <AnimatedSection key={photo.id} delay={index * 100} className={photo.span}>
              <div onClick={() => setSelectedPhoto(photo)} className="relative aspect-square bg-gradient-to-br from-cream to-warm-white rounded-2xl overflow-hidden cursor-pointer group shadow-soft hover:shadow-elevated transition-all duration-500">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-charcoal/30 group-hover:text-gold/50 transition-colors">
                    <svg className="w-12 h-12 mx-auto mb-2 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                    </svg>
                    <span className="text-sm font-medium">{photo.label}</span>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-gold/0 group-hover:border-gold rounded-tl-lg transition-all duration-500" />
                <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-gold/0 group-hover:border-gold rounded-br-lg transition-all duration-500" />
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={700}>
          <p className="text-center text-warm-gray mt-12">More photos will be added. Family members can submit cherished memories.</p>
        </AnimatedSection>
      </div>

      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/90 backdrop-blur-lg animate-fade-in" onClick={() => setSelectedPhoto(null)}>
          <div className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl animate-scale-in">
            <div className="aspect-video bg-gradient-to-br from-cream to-warm-white flex items-center justify-center">
              <div className="text-center text-charcoal/40">
                <svg className="w-20 h-20 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                </svg>
                <p className="text-lg">Photo coming soon</p>
              </div>
            </div>
            <button onClick={() => setSelectedPhoto(null)} className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-charcoal text-white hover:bg-gold transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

// ============================================
// FUNERAL SERVICE SECTION
// ============================================

const FuneralSection = () => {
  const events = [
    { title: 'Laying in State', time: 'To be announced', location: 'Venue TBA', dress: 'Traditional Kente or Black/Red', icon: '🕯️', color: 'from-gold/20 to-gold/5' },
    { title: 'Funeral Service', time: 'To be announced', location: 'Venue TBA', dress: 'Traditional attire', icon: '⛪', color: 'from-burgundy/20 to-burgundy/5' },
    { title: 'Burial Ceremony', time: 'After service', location: 'Cemetery TBA', dress: 'Traditional attire', icon: '🌹', color: 'from-forest/20 to-forest/5' },
    { title: 'Reception', time: 'After burial', location: 'Venue TBA', dress: 'Smart casual', icon: '🎉', color: 'from-gold/20 to-gold/5' }
  ];

  return (
    <section id="funeral" className="py-24 md:py-32 bg-gradient-to-br from-charcoal via-charcoal to-charcoal-light text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-64 h-64 border border-white rounded-full" />
        <div className="absolute bottom-20 right-20 w-96 h-96 border border-white rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SectionHeading eyebrow="Celebration of Life" title="Funeral Service" subtitle="Join us as we honor and celebrate the beautiful life of Grandma Josephine." light />

        <div className="grid md:grid-cols-2 gap-6">
          {events.map((event, index) => (
            <AnimatedSection key={index} delay={index * 150}>
              <div className={`relative p-6 md:p-8 rounded-2xl bg-gradient-to-br ${event.color} backdrop-blur-sm border border-white/10 hover:border-gold/30 transition-all duration-500 group`}>
                <span className="text-4xl mb-4 block group-hover:scale-110 transition-transform duration-300">{event.icon}</span>
                <h3 className="font-display text-2xl text-white mb-4">{event.title}</h3>
                <div className="space-y-2 text-white/80">
                  <p className="flex items-center gap-2"><span className="text-gold">⏰</span> {event.time}</p>
                  <p className="flex items-center gap-2"><span className="text-gold">📍</span> {event.location}</p>
                  <p className="flex items-center gap-2"><span className="text-gold">👔</span> {event.dress}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={600}>
          <div className="mt-16 text-center">
            <div className="inline-block bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-12">
              <h4 className="font-display text-2xl text-white mb-4">Please Confirm Your Attendance</h4>
              <p className="text-white/70 mb-8 max-w-md mx-auto">Help us prepare adequately by letting us know if you'll be joining us.</p>
              <Button variant="outline" onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>RSVP Now</Button>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

// ============================================
// GUESTBOOK SECTION (with Formspree)
// ============================================

const GuestbookSection = ({ showToast }) => {
  const [entries, setEntries] = useState([
    { id: 'welcome', name: 'The Family', location: 'Accra, Ghana', message: 'We welcome all who knew and loved Grandma to share their memories here. Your words mean everything to us.', date: 'December 2025' }
  ]);
  const [formData, setFormData] = useState({ name: '', location: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(FORMSPREE_GUESTBOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          location: formData.location || 'Not specified',
          message: formData.message,
          _subject: `New Guestbook Entry from ${formData.name}`
        })
      });

      if (response.ok) {
        // Add to local display
        setEntries(prev => [
          prev[0],
          { id: Date.now(), name: formData.name, location: formData.location || 'Not specified', message: formData.message, date: 'Just now' },
          ...prev.slice(1)
        ]);
        setFormData({ name: '', location: '', message: '' });
        showToast('Your tribute has been added. Thank you for sharing!', 'success');
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      showToast('Failed to submit. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="guestbook" className="py-24 md:py-32 bg-cream relative">
      <CornerOrnament position="bottom-left" />
      <CornerOrnament position="bottom-right" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Share Your Memories" title="Tributes & Messages" subtitle="Leave a message of love, share a memory, or offer your condolences." />

        <AnimatedSection>
          <Card className="p-6 md:p-8 mb-12">
            <h3 className="font-display text-xl text-charcoal mb-6 flex items-center gap-2">
              <span className="text-2xl">✍️</span> Sign the Guestbook
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Your Name *</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-warm-gray/20 focus:border-gold focus:ring-0 outline-none transition-colors bg-cream/50" placeholder="Enter your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Location</label>
                  <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-warm-gray/20 focus:border-gold focus:ring-0 outline-none transition-colors bg-cream/50" placeholder="City, Country" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Your Message *</label>
                <textarea required rows={4} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-warm-gray/20 focus:border-gold focus:ring-0 outline-none transition-colors resize-none bg-cream/50" placeholder="Share a memory or leave a message..." />
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Submit Tribute'}
              </Button>
            </form>
          </Card>
        </AnimatedSection>

        <div className="space-y-6">
          {entries.map((entry, index) => (
            <AnimatedSection key={entry.id} delay={index * 100}>
              <Card className="p-6 border-l-4 border-gold" hover={false}>
                <p className="text-charcoal text-lg italic mb-4">"{entry.message}"</p>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-white font-medium">{entry.name.charAt(0)}</div>
                    <div>
                      <p className="font-medium text-charcoal">{entry.name}</p>
                      {entry.location && <p className="text-sm text-warm-gray">{entry.location}</p>}
                    </div>
                  </div>
                  <span className="text-sm text-warm-gray">{entry.date}</span>
                </div>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// CONTACT SECTION (with Formspree)
// ============================================

const ContactSection = ({ showToast }) => {
  const [formData, setFormData] = useState({ name: '', phone: '', message: '', attending: '', guests: '1' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formType, setFormType] = useState('message'); // 'message' or 'rsvp'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const endpoint = formType === 'rsvp' ? FORMSPREE_RSVP : FORMSPREE_CONTACT;
      const data = formType === 'rsvp'
        ? {
            name: formData.name,
            phone: formData.phone,
            attending: formData.attending,
            guests: formData.guests,
            message: formData.message,
            _subject: `RSVP from ${formData.name} - ${formData.attending === 'yes' ? 'Attending' : 'Not Attending'}`
          }
        : {
            name: formData.name,
            phone: formData.phone,
            message: formData.message,
            _subject: `Contact Message from ${formData.name}`
          };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        showToast(formType === 'rsvp' ? 'RSVP submitted successfully. Thank you!' : 'Message sent successfully!', 'success');
        setFormData({ name: '', phone: '', message: '', attending: '', guests: '1' });
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      showToast('Failed to submit. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Get in Touch" title="Contact & RSVP" subtitle="For inquiries, RSVP, or to share your condolences." />

        <div className="grid md:grid-cols-2 gap-8">
          <AnimatedSection>
            <Card className="p-6 md:p-8 h-full">
              {/* Form type toggle */}
              <div className="flex gap-2 mb-6">
                <button type="button" onClick={() => setFormType('message')} className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${formType === 'message' ? 'bg-gold text-white' : 'bg-cream text-charcoal hover:bg-gold/10'}`}>
                  Send Message
                </button>
                <button type="button" onClick={() => setFormType('rsvp')} className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${formType === 'rsvp' ? 'bg-gold text-white' : 'bg-cream text-charcoal hover:bg-gold/10'}`}>
                  RSVP
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" required placeholder="Your Name *" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-warm-gray/20 focus:border-gold focus:ring-0 outline-none transition-colors" />
                <input type="tel" placeholder="Phone / WhatsApp" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-warm-gray/20 focus:border-gold focus:ring-0 outline-none transition-colors" />

                {formType === 'rsvp' && (
                  <>
                    <select value={formData.attending} onChange={(e) => setFormData({ ...formData, attending: e.target.value })} required className="w-full px-4 py-3 rounded-xl border-2 border-warm-gray/20 focus:border-gold focus:ring-0 outline-none transition-colors bg-white">
                      <option value="">Will you attend? *</option>
                      <option value="yes">Yes, I will attend</option>
                      <option value="no">Sorry, I cannot attend</option>
                      <option value="maybe">Not sure yet</option>
                    </select>
                    <input type="number" min="1" max="10" placeholder="Number of guests" value={formData.guests} onChange={(e) => setFormData({ ...formData, guests: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-warm-gray/20 focus:border-gold focus:ring-0 outline-none transition-colors" />
                  </>
                )}

                <textarea rows={3} placeholder={formType === 'rsvp' ? 'Any special requirements or message' : 'Your Message'} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-warm-gray/20 focus:border-gold focus:ring-0 outline-none transition-colors resize-none" />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : formType === 'rsvp' ? 'Submit RSVP' : 'Send Message'}
                </Button>
              </form>
            </Card>
          </AnimatedSection>

          <div className="space-y-6">
            <AnimatedSection delay={100}>
              <Card className="p-6">
                <h4 className="font-medium text-charcoal mb-4 flex items-center gap-2">
                  <span className="text-gold">📞</span> Family Contacts
                </h4>
                <div className="space-y-2 text-warm-gray">
                  <p>[Primary Contact Number]</p>
                  <p>[Secondary Contact Number]</p>
                  <p>[Family Email]</p>
                </div>
              </Card>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <Card className="p-6 bg-gradient-to-br from-gold/10 to-gold/5 border border-gold/20" hover={false}>
                <p className="text-charcoal text-lg italic font-display text-center">"Mía wò kpɔ́ fú o"</p>
                <p className="text-warm-gray text-sm text-center mt-2">(We will meet again) — Ewe proverb</p>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// FOOTER
// ============================================

const Footer = () => {
  return (
    <footer className="bg-charcoal text-white py-16 relative overflow-hidden">
      <KenteBorder className="absolute top-0 left-0 right-0 h-2" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-6"><span className="text-gold text-3xl">✦</span></div>
        <h2 className="font-display text-3xl md:text-4xl text-white mb-2">Josephine Worla Ameovi</h2>
        <p className="text-gold text-lg mb-2">"Grandma"</p>
        <p className="text-white/60 mb-8">July 15, 1948 — December 14, 2025</p>

        <div className="flex items-center justify-center gap-4 mb-8">
          <span className="h-px w-16 bg-gold/40" />
          <span className="text-gold">Forever in our hearts</span>
          <span className="h-px w-16 bg-gold/40" />
        </div>

        <p className="text-white/40 text-sm">Built with love by the family</p>
      </div>
    </footer>
  );
};

// ============================================
// MAIN APP
// ============================================

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'life', 'gallery', 'funeral', 'guestbook', 'contact'];
      const scrollPosition = window.scrollY + 150;
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = useCallback((sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(sectionId);
  }, []);

  return (
    <>
      {isLoading && <PageLoader onComplete={() => setIsLoading(false)} />}

      <div className={`min-h-screen bg-cream text-charcoal antialiased transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <Navigation activeSection={activeSection} setActiveSection={scrollToSection} />
        <HeroSection />
        <LifeSection />
        <GallerySection />
        <FuneralSection />
        <GuestbookSection showToast={showToast} />
        <ContactSection showToast={showToast} />
        <Footer />
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </>
  );
}
