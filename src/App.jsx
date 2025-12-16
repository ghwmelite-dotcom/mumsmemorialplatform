import { useState, useEffect, useRef, useCallback } from 'react';

// ============================================
// ANIMATION HOOKS & UTILITIES
// ============================================

// Custom hook for scroll-triggered animations
const useScrollReveal = (options = {}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (options.once !== false) {
            observer.unobserve(entry.target);
          }
        } else if (options.once === false) {
          setIsVisible(false);
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px 0px -50px 0px'
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [options.threshold, options.rootMargin, options.once]);

  return [ref, isVisible];
};

// Custom hook for parallax effect
const useParallax = (speed = 0.5) => {
  const [offset, setOffset] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const scrolled = window.scrollY;
        setOffset(scrolled * speed);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return [ref, offset];
};

// Custom hook for mouse parallax
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
// ANIMATED BACKGROUND COMPONENTS
// ============================================

// Floating particles for hero section
const FloatingParticles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 10,
    opacity: Math.random() * 0.3 + 0.1
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-gold animate-float"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: particle.opacity,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

// Animated gradient orbs
const GradientOrbs = () => {
  const mousePos = useMouseParallax(0.03);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-20 animate-orb-float"
        style={{
          background: 'radial-gradient(circle, rgba(212,175,55,0.4) 0%, transparent 70%)',
          top: '-10%',
          left: '-10%',
          transform: `translate(${mousePos.x}px, ${mousePos.y}px)`
        }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full blur-[100px] opacity-15 animate-orb-float-reverse"
        style={{
          background: 'radial-gradient(circle, rgba(139,21,56,0.3) 0%, transparent 70%)',
          bottom: '-5%',
          right: '-5%',
          transform: `translate(${-mousePos.x}px, ${-mousePos.y}px)`
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full blur-[80px] opacity-10 animate-orb-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(26,93,26,0.3) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)`
        }}
      />
    </div>
  );
};

// ============================================
// ANIMATED KENTE PATTERN
// ============================================

const AnimatedKentePattern = ({ className, animated = true }) => (
  <svg className={className} viewBox="0 0 200 20" preserveAspectRatio="none">
    <defs>
      <pattern id="kente-animated" x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
        <rect width="40" height="20" fill="#1a1a1a"/>
        <rect x="0" y="0" width="8" height="20" fill="#D4AF37" className={animated ? 'animate-kente-shimmer' : ''} />
        <rect x="8" y="0" width="4" height="20" fill="#1A5D1A" />
        <rect x="20" y="0" width="8" height="20" fill="#D4AF37" className={animated ? 'animate-kente-shimmer-delay' : ''} />
        <rect x="28" y="0" width="4" height="20" fill="#8B1538" />
        <rect x="0" y="6" width="40" height="3" fill="#8B1538" opacity="0.8" />
        <rect x="0" y="11" width="40" height="3" fill="#1A5D1A" opacity="0.8" />
        <rect x="0" y="16" width="40" height="4" fill="#D4AF37" className={animated ? 'animate-kente-shimmer' : ''} />
      </pattern>
      <linearGradient id="kente-shine" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="rgba(255,255,255,0)" />
        <stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        {animated && <animate attributeName="x1" from="-100%" to="100%" dur="3s" repeatCount="indefinite" />}
        {animated && <animate attributeName="x2" from="0%" to="200%" dur="3s" repeatCount="indefinite" />}
      </linearGradient>
    </defs>
    <rect width="200" height="20" fill="url(#kente-animated)" />
    <rect width="200" height="20" fill="url(#kente-shine)" />
  </svg>
);

// ============================================
// REUSABLE ANIMATED COMPONENTS
// ============================================

// Animated section wrapper
const AnimatedSection = ({ children, className = '', delay = 0 }) => {
  const [ref, isVisible] = useScrollReveal({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(60px)',
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
};

// Animated heading with line reveal
const AnimatedHeading = ({ subtitle, title, className = '' }) => {
  const [ref, isVisible] = useScrollReveal();

  return (
    <div ref={ref} className={`text-center mb-16 ${className}`}>
      <p
        className="text-gold tracking-[0.3em] uppercase text-sm mb-4 transition-all duration-700"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
        }}
      >
        {subtitle}
      </p>
      <h2
        className="font-display text-3xl md:text-5xl text-cream mb-6 transition-all duration-700 delay-150"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          transitionDelay: '150ms'
        }}
      >
        {title}
      </h2>
      <div
        className="h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto transition-all duration-1000 delay-300"
        style={{
          width: isVisible ? '6rem' : '0',
          transitionDelay: '300ms'
        }}
      />
    </div>
  );
};

// Animated card with hover effects
const AnimatedCard = ({ children, className = '', delay = 0, hoverEffect = true }) => {
  const [ref, isVisible] = useScrollReveal();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden transition-all duration-500 ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? isHovered && hoverEffect
            ? 'translateY(-8px) scale(1.02)'
            : 'translateY(0) scale(1)'
          : 'translateY(40px) scale(0.95)',
        transitionDelay: `${delay}ms`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Shine effect on hover */}
      {hoverEffect && (
        <div
          className="absolute inset-0 transition-opacity duration-500 pointer-events-none"
          style={{
            background: 'linear-gradient(105deg, transparent 40%, rgba(212,175,55,0.1) 45%, transparent 50%)',
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)',
            transition: 'transform 0.6s ease-out, opacity 0.3s ease-out'
          }}
        />
      )}
      {children}
    </div>
  );
};

// Magnetic button component
const MagneticButton = ({ children, className = '', onClick, disabled = false, variant = 'primary' }) => {
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (disabled || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.15;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.15;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const baseStyles = "relative overflow-hidden font-medium transition-all duration-300 ease-out";
  const variants = {
    primary: "bg-gold text-stone-900 hover:bg-gold-light hover:shadow-lg hover:shadow-gold/25",
    secondary: "bg-transparent border-2 border-gold text-gold hover:bg-gold hover:text-stone-900",
    ghost: "bg-transparent text-gold hover:bg-gold/10"
  };

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-300" />
    </button>
  );
};

// ============================================
// NAVIGATION COMPONENT
// ============================================

const Navigation = ({ activeSection, setActiveSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'life', label: 'Her Life' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'funeral', label: 'Funeral' },
    { id: 'guestbook', label: 'Guestbook' },
    { id: 'tribute', label: 'Tributes' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        isScrolled
          ? 'bg-stone-950/90 backdrop-blur-xl shadow-2xl shadow-black/20'
          : 'bg-gradient-to-b from-stone-950/80 to-transparent'
      }`}
    >
      {/* Animated border */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px transition-opacity duration-500"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)',
          opacity: isScrolled ? 1 : 0
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex-shrink-0 group cursor-pointer" onClick={() => setActiveSection('home')}>
            <span className="font-display text-gold text-lg md:text-xl tracking-wide transition-all duration-300 group-hover:text-gold-light">
              In Loving Memory
            </span>
            <div className="h-0.5 w-0 group-hover:w-full bg-gold transition-all duration-300" />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className="relative px-4 py-2 text-sm tracking-wide transition-all duration-300"
                style={{
                  animationDelay: `${index * 50}ms`
                }}
              >
                {/* Background highlight */}
                <span
                  className="absolute inset-0 rounded-lg transition-all duration-300"
                  style={{
                    background: activeSection === item.id
                      ? 'rgba(212,175,55,0.15)'
                      : hoveredItem === item.id
                        ? 'rgba(212,175,55,0.08)'
                        : 'transparent'
                  }}
                />
                {/* Text */}
                <span
                  className={`relative z-10 transition-colors duration-300 ${
                    activeSection === item.id ? 'text-gold' : 'text-stone-300 hover:text-gold'
                  }`}
                >
                  {item.label}
                </span>
                {/* Active indicator */}
                <span
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gold rounded-full transition-all duration-300"
                  style={{
                    width: activeSection === item.id ? '20px' : '0'
                  }}
                />
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden relative w-10 h-10 flex items-center justify-center text-gold"
          >
            <span className="sr-only">Menu</span>
            <span
              className={`absolute w-6 h-0.5 bg-current transition-all duration-300 ${
                mobileMenuOpen ? 'rotate-45' : '-translate-y-2'
              }`}
            />
            <span
              className={`absolute w-6 h-0.5 bg-current transition-all duration-300 ${
                mobileMenuOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`absolute w-6 h-0.5 bg-current transition-all duration-300 ${
                mobileMenuOpen ? '-rotate-45' : 'translate-y-2'
              }`}
            />
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-out ${
            mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-4 space-y-1 border-t border-gold/20">
            {navItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-3 text-sm tracking-wide transition-all duration-300 rounded-lg ${
                  activeSection === item.id
                    ? 'text-gold bg-gold/10'
                    : 'text-stone-300 hover:text-gold hover:bg-gold/5'
                }`}
                style={{
                  transitionDelay: mobileMenuOpen ? `${index * 50}ms` : '0ms',
                  transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-20px)',
                  opacity: mobileMenuOpen ? 1 : 0
                }}
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
  const [parallaxRef, parallaxOffset] = useParallax(0.3);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const calculateAge = () => {
    const birth = new Date(1948, 6, 15);
    const death = new Date(2025, 11, 14);
    return Math.floor((death - birth) / (365.25 * 24 * 60 * 60 * 1000));
  };

  return (
    <section id="home" ref={parallaxRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950" />

      {/* Animated gradient orbs */}
      <GradientOrbs />

      {/* Floating particles */}
      <FloatingParticles />

      {/* Kente border accents with animation */}
      <div className="absolute top-0 left-0 right-0 h-3 opacity-90">
        <AnimatedKentePattern className="w-full h-full" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-3 opacity-90">
        <AnimatedKentePattern className="w-full h-full" />
      </div>

      {/* Parallax decorative lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{ transform: `translateY(${parallaxOffset * 0.5}px)` }}
      >
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
        <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Photo with animated ring */}
        <div
          className={`mb-10 inline-block transition-all duration-1000 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="relative">
            {/* Animated rings */}
            <div className="absolute inset-0 w-52 h-52 md:w-72 md:h-72 mx-auto rounded-full border border-gold/30 animate-ring-pulse" />
            <div className="absolute inset-0 w-52 h-52 md:w-72 md:h-72 mx-auto rounded-full border border-gold/20 animate-ring-pulse-delay" />

            {/* Photo container */}
            <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto rounded-full border-4 border-gold/60 overflow-hidden bg-stone-800 shadow-2xl shadow-gold/20 group">
              <div className="w-full h-full flex items-center justify-center text-stone-600 group-hover:text-stone-500 transition-colors duration-500">
                <svg className="w-20 h-20 transition-transform duration-500 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              {/* Hover shine */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>
          <p className="text-stone-500 text-sm mt-4 italic animate-pulse-subtle">Photo coming soon</p>
        </div>

        {/* Dates */}
        <p
          className={`text-gold/80 tracking-[0.3em] uppercase text-sm md:text-base mb-6 font-light transition-all duration-1000 delay-200 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <span className="inline-block animate-text-shimmer">Sunrise</span> · July 15, 1948 — <span className="inline-block animate-text-shimmer">Sunset</span> · December 14, 2025
        </p>

        {/* Name with stagger animation */}
        <h1
          className={`font-display text-4xl md:text-6xl lg:text-7xl text-cream mb-4 leading-tight transition-all duration-1000 delay-300 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <span className="inline-block hover:text-gold transition-colors duration-300">Josephine</span>{' '}
          <span className="inline-block hover:text-gold transition-colors duration-300">Worla</span>{' '}
          <span className="inline-block hover:text-gold transition-colors duration-300">Ameovi</span>
        </h1>

        <p
          className={`text-2xl md:text-3xl text-gold font-light mb-8 italic transition-all duration-1000 delay-400 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          "Grandma"
        </p>

        {/* Years of Grace */}
        <div
          className={`flex items-center justify-center gap-4 text-stone-400 mb-10 transition-all duration-1000 delay-500 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold/60 animate-line-expand" />
          <span className="text-lg font-light">{calculateAge()} Years of Grace</span>
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold/60 animate-line-expand" />
        </div>

        {/* Description */}
        <p
          className={`text-stone-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10 transition-all duration-1000 delay-600 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          A beloved mother, grandmother, and pillar of her community.
          Daughter of the Volta Region, speaker of Ewe, Ga, and English —
          her wisdom transcended language.
        </p>

        {/* Peace symbol */}
        <div
          className={`transition-all duration-1000 delay-700 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <p className="text-sm tracking-widest uppercase mb-3 text-gold/60">Rest in Perfect Peace</p>
          <div className="text-5xl animate-gentle-float">🕊️</div>
        </div>

        {/* Scroll indicator */}
        <div
          className={`absolute bottom-10 left-1/2 -translate-x-1/2 transition-all duration-1000 delay-1000 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex flex-col items-center text-gold/50 animate-bounce-slow">
            <span className="text-xs tracking-widest uppercase mb-2">Scroll</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// LIFE STORY SECTION
// ============================================

const LifeSection = () => {
  const lifeStories = [
    {
      title: 'Early Life',
      content: 'Josephine Worla Ameovi was born on July 15, 1948, in the Volta Region of Ghana. From her earliest days, she embodied the rich cultural heritage of the Ewe people, growing up surrounded by the traditions, values, and warmth that would define her entire life.',
      placeholder: '[More details about her childhood and upbringing can be added here]',
      borderColor: 'border-gold/60',
      icon: '🌅'
    },
    {
      title: 'Family & Motherhood',
      content: 'As a mother, Grandma Josephine was the cornerstone of her family. Her home was always open, her kitchen always full, and her wisdom always available to those who sought it. She raised her children with love, discipline, and an unwavering faith.',
      placeholder: '[Details about her marriage, children, and family life can be added here]',
      borderColor: 'border-forest/60',
      icon: '👨‍👩‍👧‍👦'
    },
    {
      title: 'Legacy & Community',
      content: 'Known affectionately as "Grandma" by most who knew her, Josephine touched countless lives through her kindness, generosity, and the unique ability to make everyone feel at home. She was fluent in Ewe, Ga, and English — a testament to her connection with people from all walks of life.',
      placeholder: '[Details about her community involvement, church, and impact can be added here]',
      borderColor: 'border-burgundy/60',
      icon: '🌟'
    }
  ];

  return (
    <section id="life" className="py-24 md:py-36 bg-stone-950 relative overflow-hidden">
      {/* Decorative side line */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-gold/0 via-gold/40 to-gold/0" />

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-20 w-96 h-96 border border-gold/20 rounded-full" />
        <div className="absolute bottom-20 left-20 w-64 h-64 border border-gold/20 rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <AnimatedHeading subtitle="Her Journey" title="A Life Well Lived" />

        <div className="space-y-8">
          {lifeStories.map((story, index) => (
            <AnimatedCard
              key={index}
              delay={index * 150}
              className={`bg-stone-900/50 p-8 rounded-xl border-l-4 ${story.borderColor} backdrop-blur-sm`}
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">{story.icon}</span>
                <div className="flex-1">
                  <h3 className="font-display text-xl text-gold mb-4">{story.title}</h3>
                  <p className="text-lg text-stone-300 leading-relaxed">{story.content}</p>
                  <p className="text-stone-500 italic mt-4 text-sm">{story.placeholder}</p>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>

        {/* Quote section */}
        <AnimatedSection delay={600}>
          <div className="mt-16 p-8 bg-gradient-to-r from-gold/5 via-gold/10 to-gold/5 rounded-xl border border-gold/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 text-6xl text-gold/10 font-serif">"</div>
            <p className="text-gold italic text-xl font-display text-center relative z-10">
              She lived not for herself, but for all those she loved.
            </p>
            <p className="text-stone-500 text-sm mt-4 text-center">[Family quote or her favorite saying can go here]</p>
            <div className="absolute bottom-0 right-0 text-6xl text-gold/10 font-serif rotate-180">"</div>
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
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const photos = Array(8).fill(null).map((_, i) => ({
    id: i + 1,
    placeholder: true,
    caption: 'Memory ' + (i + 1)
  }));

  return (
    <section id="gallery" className="py-24 md:py-36 bg-stone-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-burgundy/5 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <AnimatedHeading subtitle="Memories" title="Photo Gallery" />

        <AnimatedSection>
          <p className="text-stone-400 text-center max-w-xl mx-auto mb-12">
            A collection of cherished moments from Grandma's life
          </p>
        </AnimatedSection>

        {/* Photo grid with staggered animations */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {photos.map((photo, index) => (
            <AnimatedCard
              key={photo.id}
              delay={index * 100}
              hoverEffect={false}
              className="aspect-square"
            >
              <div
                className={`relative w-full h-full bg-stone-800 rounded-xl overflow-hidden cursor-pointer group transition-all duration-500 ${
                  hoveredIndex === index ? 'ring-2 ring-gold shadow-xl shadow-gold/20' : 'ring-1 ring-stone-700'
                }`}
                onClick={() => setSelectedPhoto(photo)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Placeholder content */}
                <div className="w-full h-full flex items-center justify-center text-stone-600 group-hover:text-gold/60 transition-all duration-500">
                  <div className="text-center p-4">
                    <svg
                      className="w-12 h-12 mx-auto mb-2 transition-transform duration-500 group-hover:scale-110"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                    </svg>
                    <p className="text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">{photo.caption}</p>
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Corner decoration */}
                <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-gold/0 group-hover:border-gold/60 transition-all duration-500 rounded-tr-lg" />
                <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-gold/0 group-hover:border-gold/60 transition-all duration-500 rounded-bl-lg" />
              </div>
            </AnimatedCard>
          ))}
        </div>

        <AnimatedSection delay={800}>
          <p className="text-stone-500 text-sm text-center mt-12">
            Family members can submit photos to be added to this gallery
          </p>
        </AnimatedSection>
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/95 backdrop-blur-lg animate-fadeIn"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full aspect-video bg-stone-800 rounded-2xl overflow-hidden shadow-2xl animate-modal-enter"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full h-full flex items-center justify-center text-stone-600">
              <div className="text-center">
                <svg className="w-24 h-24 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                </svg>
                <p className="text-lg">Photo coming soon</p>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-stone-900/80 text-gold hover:bg-gold hover:text-stone-900 transition-all duration-300"
            >
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
// FUNERAL SECTION WITH ANIMATED TIMELINE
// ============================================

const FuneralSection = () => {
  const events = [
    {
      title: "Filing Past / Laying in State",
      date: "Date to be announced",
      time: "Time TBA",
      venue: "Venue to be announced",
      address: "Address TBA",
      dress: "Traditional attire (Kente or black/red)",
      icon: "🕯️",
      color: 'gold'
    },
    {
      title: "Funeral Service",
      date: "Date to be announced",
      time: "Time TBA",
      venue: "Venue to be announced",
      address: "Address TBA",
      dress: "Traditional attire (Kente or black/red)",
      icon: "⛪",
      color: 'burgundy'
    },
    {
      title: "Burial",
      date: "Date to be announced",
      time: "Immediately after service",
      venue: "Cemetery to be announced",
      address: "Address TBA",
      dress: "Traditional attire",
      icon: "🌹",
      color: 'forest'
    },
    {
      title: "Reception / Thanksgiving",
      date: "Date to be announced",
      time: "After burial",
      venue: "Venue to be announced",
      address: "Address TBA",
      dress: "Smart casual / Traditional",
      icon: "🎉",
      color: 'gold'
    }
  ];

  return (
    <section id="funeral" className="py-24 md:py-36 bg-stone-950 relative overflow-hidden">
      {/* Kente accent */}
      <div className="absolute right-0 top-20 w-6 h-96 opacity-40">
        <AnimatedKentePattern className="w-full h-full" />
      </div>
      <div className="absolute left-0 bottom-20 w-6 h-96 opacity-40">
        <AnimatedKentePattern className="w-full h-full" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <AnimatedHeading subtitle="Celebration of Life" title="Funeral Programme" />

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-gold/0 via-gold/40 to-gold/0 hidden md:block" />

          <div className="space-y-8 md:space-y-0">
            {events.map((event, index) => (
              <AnimatedCard
                key={index}
                delay={index * 150}
                className={`md:w-[calc(50%-2rem)] ${index % 2 === 0 ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'}`}
              >
                {/* Timeline dot */}
                <div className="hidden md:block absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gold border-4 border-stone-950 z-10"
                  style={{ [index % 2 === 0 ? 'right' : 'left']: '-2rem' }}
                />

                <div className="bg-gradient-to-br from-stone-900 to-stone-900/50 p-6 md:p-8 rounded-xl border border-stone-800 hover:border-gold/30 transition-all duration-500 group">
                  <div className="flex items-start gap-4">
                    <span className="text-4xl transition-transform duration-300 group-hover:scale-110">{event.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-display text-xl text-gold mb-4">{event.title}</h3>
                      <div className="space-y-3 text-stone-300">
                        <EventDetail icon="calendar" text={event.date} />
                        <EventDetail icon="clock" text={event.time} />
                        <EventDetail icon="location" text={event.venue} />
                        <EventDetail icon="building" text={event.address} className="text-stone-400 text-sm" />
                      </div>
                      <div className="mt-4 pt-4 border-t border-stone-800">
                        <p className="text-sm text-gold/80">
                          <span className="text-stone-500">Dress Code:</span> {event.dress}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-16 grid md:grid-cols-2 gap-6">
          <AnimatedCard delay={600}>
            <div className="bg-stone-900/50 p-6 rounded-xl border border-stone-800 h-full">
              <h4 className="font-display text-lg text-gold mb-4 flex items-center gap-2">
                <span>🏨</span> Accommodation
              </h4>
              <p className="text-stone-400 text-sm leading-relaxed">
                For out-of-town guests, accommodation recommendations will be provided soon.
                Please contact the family for assistance.
              </p>
            </div>
          </AnimatedCard>
          <AnimatedCard delay={700}>
            <div className="bg-stone-900/50 p-6 rounded-xl border border-stone-800 h-full">
              <h4 className="font-display text-lg text-gold mb-4 flex items-center gap-2">
                <span>🚗</span> Transportation
              </h4>
              <p className="text-stone-400 text-sm leading-relaxed">
                Transportation arrangements from Accra to the funeral venue will be coordinated.
                Details coming soon.
              </p>
            </div>
          </AnimatedCard>
        </div>

        {/* RSVP CTA */}
        <AnimatedSection delay={800}>
          <div className="mt-16 text-center">
            <div className="inline-block bg-gradient-to-r from-gold/10 via-gold/20 to-gold/10 p-8 md:p-12 rounded-2xl border border-gold/20 relative overflow-hidden group">
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

              <h4 className="font-display text-2xl text-gold mb-4 relative">Please RSVP</h4>
              <p className="text-stone-300 mb-8 relative">
                Help us prepare by letting us know if you'll be attending
              </p>
              <MagneticButton
                variant="primary"
                className="px-10 py-4 rounded-xl text-lg"
                onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
              >
                Confirm Attendance
              </MagneticButton>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

// Event detail component
const EventDetail = ({ icon, text, className = '' }) => {
  const icons = {
    calendar: (
      <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>
    ),
    clock: (
      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
    ),
    location: (
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    ),
    building: (
      <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
    )
  };

  return (
    <p className={`flex items-center gap-2 ${className}`}>
      <svg className="w-4 h-4 text-gold/60 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
        {icons[icon]}
      </svg>
      <span>{text}</span>
    </p>
  );
};

// ============================================
// GUESTBOOK SECTION
// ============================================

const GuestbookSection = () => {
  const [entries, setEntries] = useState([
    {
      id: 1,
      name: "The Family",
      location: "Accra, Ghana",
      message: "We welcome all who knew and loved Grandma to share their memories here. Your words mean everything to us during this time.",
      date: "December 2025"
    }
  ]);
  const [formData, setFormData] = useState({ name: '', location: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newEntry = {
        id: entries.length + 1,
        ...formData,
        date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      };
      setEntries([newEntry, ...entries]);
      setFormData({ name: '', location: '', message: '' });
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }, 1000);
  };

  return (
    <section id="guestbook" className="py-24 md:py-36 bg-stone-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <AnimatedHeading subtitle="Share Your Memories" title="Guestbook" />

        {/* Submission Form */}
        <AnimatedCard delay={100}>
          <div className="bg-stone-950 p-6 md:p-8 rounded-2xl border border-stone-800 mb-12 relative overflow-hidden">
            {/* Form glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />

            <h3 className="font-display text-xl text-gold mb-6 flex items-center gap-2">
              <span className="text-2xl">✍️</span> Leave a Message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6 relative">
              <div className="grid md:grid-cols-2 gap-6">
                <AnimatedInput
                  label="Your Name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter your name"
                  focused={focusedField === 'name'}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                />
                <AnimatedInput
                  label="Location"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="City, Country"
                  focused={focusedField === 'location'}
                  onFocus={() => setFocusedField('location')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
              <AnimatedInput
                label="Your Message"
                required
                multiline
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                placeholder="Share a memory or condolence..."
                focused={focusedField === 'message'}
                onFocus={() => setFocusedField('message')}
                onBlur={() => setFocusedField(null)}
              />
              <MagneticButton
                variant="primary"
                className="px-8 py-3 rounded-xl"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Sending...
                  </span>
                ) : submitted ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Message Sent
                  </span>
                ) : (
                  'Sign Guestbook'
                )}
              </MagneticButton>
            </form>
          </div>
        </AnimatedCard>

        {/* Entries */}
        <div className="space-y-6">
          {entries.map((entry, index) => (
            <AnimatedCard key={entry.id} delay={200 + index * 100}>
              <div className="bg-stone-950/50 p-6 md:p-8 rounded-xl border-l-4 border-gold/40 relative overflow-hidden group hover:border-gold/60 transition-colors duration-300">
                {/* Quote marks */}
                <span className="absolute top-4 left-4 text-4xl text-gold/10 font-serif">"</span>

                <p className="text-stone-300 text-lg mb-4 italic relative z-10 pl-6">{entry.message}</p>
                <div className="flex items-center justify-between text-sm relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold font-medium">
                      {entry.name.charAt(0)}
                    </div>
                    <div>
                      <span className="text-gold font-medium">{entry.name}</span>
                      {entry.location && (
                        <span className="text-stone-500 block text-xs">{entry.location}</span>
                      )}
                    </div>
                  </div>
                  <span className="text-stone-600">{entry.date}</span>
                </div>

                {/* Hover accent */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-gold/0 via-gold/40 to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </section>
  );
};

// Animated input component
const AnimatedInput = ({ label, required, multiline, rows, value, onChange, placeholder, focused, onFocus, onBlur }) => {
  const InputComponent = multiline ? 'textarea' : 'input';

  return (
    <div className="relative">
      <label className="block text-stone-400 text-sm mb-2 transition-colors duration-300" style={{ color: focused ? '#D4AF37' : undefined }}>
        {label} {required && <span className="text-gold">*</span>}
      </label>
      <div className="relative">
        <InputComponent
          required={required}
          rows={rows}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          className={`w-full bg-stone-900 border-2 rounded-xl px-4 py-3 text-cream transition-all duration-300 outline-none resize-none ${
            focused ? 'border-gold shadow-lg shadow-gold/10' : 'border-stone-700 hover:border-stone-600'
          }`}
          placeholder={placeholder}
        />
        {/* Focus ring animation */}
        <div
          className="absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-300"
          style={{
            boxShadow: focused ? '0 0 0 4px rgba(212,175,55,0.1)' : 'none',
            opacity: focused ? 1 : 0
          }}
        />
      </div>
    </div>
  );
};

// ============================================
// TRIBUTE SECTION
// ============================================

const TributeSection = () => {
  return (
    <section id="tribute" className="py-24 md:py-36 bg-stone-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-gold/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-gold/5" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <AnimatedHeading subtitle="Honor Her Memory" title="Tributes & Contributions" />

        <div className="grid md:grid-cols-2 gap-8">
          {/* Funeral Contributions */}
          <AnimatedCard delay={100}>
            <div className="bg-gradient-to-br from-stone-900 to-stone-900/50 p-8 rounded-2xl border border-stone-800 h-full group hover:border-gold/30 transition-all duration-500">
              <div className="text-5xl mb-6 transition-transform duration-300 group-hover:scale-110">💝</div>
              <h3 className="font-display text-xl text-gold mb-4">Funeral Contributions</h3>
              <p className="text-stone-400 mb-6 leading-relaxed">
                Your generous contributions help the family give Grandma Josephine the
                dignified send-off she deserves.
              </p>
              <div className="bg-stone-950 p-4 rounded-xl mb-4 border border-stone-800">
                <p className="text-stone-500 text-sm mb-2">Bank Details</p>
                <p className="text-stone-300">Account details will be provided</p>
                <p className="text-stone-500 text-sm mt-4">Mobile Money</p>
                <p className="text-stone-300">Number to be provided</p>
              </div>
              <p className="text-stone-500 text-xs italic">
                All contributions, no matter the size, are deeply appreciated
              </p>
            </div>
          </AnimatedCard>

          {/* Memorial Donation */}
          <AnimatedCard delay={200}>
            <div className="bg-gradient-to-br from-stone-900 to-stone-900/50 p-8 rounded-2xl border border-stone-800 h-full group hover:border-gold/30 transition-all duration-500">
              <div className="text-5xl mb-6 transition-transform duration-300 group-hover:scale-110">🌱</div>
              <h3 className="font-display text-xl text-gold mb-4">In Lieu of Flowers</h3>
              <p className="text-stone-400 mb-6 leading-relaxed">
                Those wishing to honor Grandma's memory in a special way may contribute to:
              </p>
              <div className="bg-stone-950 p-4 rounded-xl mb-4 border border-stone-800">
                <p className="text-stone-300 mb-2">[Cause or charity she cared about]</p>
                <p className="text-stone-500 text-sm">
                  Details to be provided by the family
                </p>
              </div>
              <p className="text-stone-500 text-xs italic">
                Grandma believed in [her values/causes]
              </p>
            </div>
          </AnimatedCard>
        </div>

        {/* Order of Service Download */}
        <AnimatedSection delay={400}>
          <div className="mt-16 text-center">
            <div className="inline-block bg-stone-900 p-8 md:p-12 rounded-2xl border border-stone-800 relative overflow-hidden group">
              {/* Animated border */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 rounded-2xl border-2 border-gold/30" />
              </div>

              <div className="text-5xl mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">📜</div>
              <h4 className="font-display text-xl text-gold mb-4">Order of Service</h4>
              <p className="text-stone-400 mb-8">
                Download the funeral programme
              </p>
              <MagneticButton variant="secondary" className="px-8 py-3 rounded-xl" disabled>
                Coming Soon
              </MagneticButton>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

// ============================================
// CONTACT SECTION
// ============================================

const ContactSection = () => {
  const [focusedField, setFocusedField] = useState(null);

  return (
    <section id="contact" className="py-24 md:py-36 bg-stone-900 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <AnimatedHeading subtitle="Get in Touch" title="Contact Family" />

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <AnimatedCard delay={100}>
            <div className="bg-stone-950 p-6 md:p-8 rounded-2xl border border-stone-800 h-full">
              <h3 className="font-display text-xl text-gold mb-6 flex items-center gap-2">
                <span>💬</span> Send a Message
              </h3>
              <form className="space-y-5">
                <AnimatedInput
                  label="Your Name"
                  placeholder="Enter your name"
                  focused={focusedField === 'contact-name'}
                  onFocus={() => setFocusedField('contact-name')}
                  onBlur={() => setFocusedField(null)}
                />
                <AnimatedInput
                  label="Phone / WhatsApp"
                  placeholder="Your phone number"
                  focused={focusedField === 'contact-phone'}
                  onFocus={() => setFocusedField('contact-phone')}
                  onBlur={() => setFocusedField(null)}
                />
                <AnimatedInput
                  label="Message"
                  multiline
                  rows={3}
                  placeholder="How can we help?"
                  focused={focusedField === 'contact-message'}
                  onFocus={() => setFocusedField('contact-message')}
                  onBlur={() => setFocusedField(null)}
                />
                <MagneticButton variant="primary" className="w-full py-3 rounded-xl">
                  Send Message
                </MagneticButton>
              </form>
            </div>
          </AnimatedCard>

          {/* Contact Details */}
          <div className="space-y-6">
            <AnimatedCard delay={200}>
              <div className="bg-stone-950 p-6 rounded-xl border border-stone-800 group hover:border-gold/30 transition-all duration-300">
                <h4 className="text-gold font-medium mb-4 flex items-center gap-2">
                  <span>👨‍👩‍👧‍👦</span> Family Contacts
                </h4>
                <div className="space-y-3 text-stone-300">
                  <ContactItem icon="📞" text="[Primary Contact Number]" />
                  <ContactItem icon="📞" text="[Secondary Contact Number]" />
                  <ContactItem icon="✉️" text="[Family Email]" />
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={300}>
              <div className="bg-stone-950 p-6 rounded-xl border border-stone-800 group hover:border-gold/30 transition-all duration-300">
                <h4 className="text-gold font-medium mb-4 flex items-center gap-2">
                  <span>💬</span> WhatsApp Groups
                </h4>
                <p className="text-stone-400 text-sm mb-4">
                  Join our coordination groups for updates
                </p>
                <MagneticButton
                  variant="primary"
                  className="w-full py-3 rounded-xl"
                  disabled
                  style={{ backgroundColor: '#25D366' }}
                >
                  <span className="flex items-center justify-center gap-2">
                    <span>📱</span> Join WhatsApp Group (Link coming)
                  </span>
                </MagneticButton>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={400}>
              <div className="bg-gradient-to-r from-gold/10 via-gold/15 to-gold/10 p-6 rounded-xl border border-gold/20 text-center">
                <p className="text-cream text-lg italic font-display">
                  "Mía wò kpɔ́ fú o"
                </p>
                <p className="text-stone-400 text-sm mt-2">
                  (We will meet again) — Ewe proverb
                </p>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </div>
    </section>
  );
};

// Contact item component
const ContactItem = ({ icon, text }) => (
  <p className="flex items-center gap-3 transition-colors duration-300 hover:text-gold cursor-pointer">
    <span className="text-gold">{icon}</span>
    <span>{text}</span>
  </p>
);

// ============================================
// FOOTER
// ============================================

const Footer = () => {
  const [ref, isVisible] = useScrollReveal();

  return (
    <footer ref={ref} className="bg-stone-950 py-16 relative overflow-hidden">
      {/* Kente border */}
      <div className="absolute top-0 left-0 right-0 h-2 opacity-80">
        <AnimatedKentePattern className="w-full h-full" />
      </div>

      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <div
          className="mb-8 transition-all duration-1000"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)'
          }}
        >
          <p className="font-display text-3xl text-gold mb-3">Josephine Worla Ameovi</p>
          <p className="text-stone-400 text-lg">"Grandma"</p>
          <p className="text-stone-500 mt-3">July 15, 1948 — December 14, 2025</p>
        </div>

        <div
          className="w-20 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto my-8 transition-all duration-1000 delay-200"
          style={{
            opacity: isVisible ? 1 : 0,
            width: isVisible ? '5rem' : '0'
          }}
        />

        <p
          className="text-stone-500 mb-2 transition-all duration-1000 delay-300"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
          }}
        >
          Forever in our hearts 💛
        </p>

        <p
          className="text-stone-600 text-xs mt-10 transition-all duration-1000 delay-400"
          style={{
            opacity: isVisible ? 1 : 0
          }}
        >
          Built with love by the family
        </p>
      </div>
    </footer>
  );
};

// ============================================
// MAIN APP
// ============================================

export default function App() {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'life', 'gallery', 'funeral', 'guestbook', 'tribute', 'contact'];
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
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setActiveSection(sectionId);
  }, []);

  return (
    <div className="min-h-screen bg-stone-950 text-cream antialiased">
      <Navigation activeSection={activeSection} setActiveSection={scrollToSection} />
      <HeroSection />
      <LifeSection />
      <GallerySection />
      <FuneralSection />
      <GuestbookSection />
      <TributeSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
