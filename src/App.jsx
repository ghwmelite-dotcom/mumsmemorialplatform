import { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import translations from './translations';

// ============================================
// CONFIGURATION - Update these values
// ============================================

// Formspree endpoints
const FORMSPREE_GUESTBOOK = 'https://formspree.io/f/movgoyle';
const FORMSPREE_RSVP = 'https://formspree.io/f/xgvgjrzk';
const FORMSPREE_CONTACT = 'https://formspree.io/f/xkgdlkzz';

// Cloudinary configuration (create free account at cloudinary.com)
const CLOUDINARY_CLOUD_NAME = 'YOUR_CLOUD_NAME';
const CLOUDINARY_UPLOAD_PRESET = 'YOUR_UPLOAD_PRESET';

// Live stream configuration
const STREAM_CONFIG = {
  youtubeVideoId: '', // Add YouTube video ID when ready (e.g., 'dQw4w9WgXcQ')
  eventDateTime: new Date('2025-01-15T10:00:00'), // Update with actual funeral date/time
  isLive: false, // Set to true during live stream
  hasEnded: false // Set to true after stream ends
};

// Mobile Money configuration
const MOBILE_MONEY = {
  mtn: { number: '0XX XXX XXXX', name: 'Account Name Here' },
  vodafone: { number: '0XX XXX XXXX', name: 'Account Name Here' },
  airtelTigo: { number: '0XX XXX XXXX', name: 'Account Name Here' }
};

// Music playlist (add URLs to hymns/songs)
const MUSIC_PLAYLIST = [
  { title: 'Amazing Grace', artist: 'Traditional Hymn', url: '' },
  { title: 'How Great Thou Art', artist: 'Traditional Hymn', url: '' },
  { title: 'Blessed Assurance', artist: 'Traditional Hymn', url: '' }
];

// Family tree data (placeholder - update with real family info)
const FAMILY_DATA = {
  matriarch: {
    name: 'Josephine Worla Ameovi',
    title: 'Grandma',
    years: '1948 - 2025'
  },
  children: [
    { id: 1, name: 'Child 1', relation: 'Son/Daughter' },
    { id: 2, name: 'Child 2', relation: 'Son/Daughter' },
    { id: 3, name: 'Child 3', relation: 'Son/Daughter' }
  ],
  grandchildren: [
    { id: 1, name: 'Grandchild 1', parentId: 1 },
    { id: 2, name: 'Grandchild 2', parentId: 1 },
    { id: 3, name: 'Grandchild 3', parentId: 2 },
    { id: 4, name: 'Grandchild 4', parentId: 2 },
    { id: 5, name: 'Grandchild 5', parentId: 3 }
  ]
};

// ============================================
// LANGUAGE CONTEXT
// ============================================

const LanguageContext = createContext();

const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('memorial-language') || 'en';
  });

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ewe' : 'en';
    setLanguage(newLang);
    localStorage.setItem('memorial-language', newLang);
  };

  const t = (path) => {
    const keys = path.split('.');
    let value = translations[language];
    for (const key of keys) {
      value = value?.[key];
    }
    return value || path;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

const useLanguage = () => useContext(LanguageContext);

// ============================================
// PAGE LOADER COMPONENT
// ============================================

const PageLoader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('loading');

  useEffect(() => {
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
    <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-cream transition-opacity duration-500 ${phase === 'revealing' ? 'opacity-0' : 'opacity-100'}`}>
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-gold rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 border border-gold rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>
      <div className="text-center relative z-10">
        <div className="mb-8 relative">
          <div className="w-24 h-24 mx-auto relative">
            <div className="absolute inset-0 rounded-full border-4 border-gold/30 animate-spin-slow" />
            <div className="absolute inset-2 rounded-full border-2 border-burgundy/40 animate-spin-slow" style={{ animationDirection: 'reverse' }} />
            <div className="absolute inset-4 rounded-full border-2 border-forest/40 animate-spin-slow" />
            <div className="absolute inset-6 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
              <span className="text-white text-2xl">✦</span>
            </div>
          </div>
        </div>
        <h2 className="font-display text-2xl text-charcoal mb-2 animate-pulse">In Loving Memory</h2>
        <p className="text-warm-gray text-sm mb-8">Josephine Worla Ameovi</p>
        <div className="w-48 mx-auto">
          <div className="h-1 bg-gold/20 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-gold to-gold-dark rounded-full transition-all duration-300 ease-out" style={{ width: `${Math.min(progress, 100)}%` }} />
          </div>
          <p className="text-xs text-warm-gray mt-2">{Math.min(Math.round(progress), 100)}%</p>
        </div>
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
        <div key={petal.id} className="absolute animate-petal-fall opacity-40" style={{ left: `${petal.x}%`, top: '-5%', animationDelay: `${petal.delay}s`, animationDuration: `${petal.duration}s` }}>
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
      <div className="absolute w-[800px] h-[800px] rounded-full blur-[150px] animate-float-slow" style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 60%)', top: '-20%', right: '-20%', transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }} />
      <div className="absolute w-[600px] h-[600px] rounded-full blur-[120px] animate-float-slow-reverse" style={{ background: 'radial-gradient(circle, rgba(139,21,56,0.08) 0%, transparent 60%)', bottom: '-10%', left: '-10%', transform: `translate(${-mousePos.x}px, ${-mousePos.y}px)` }} />
      <div className="absolute w-[500px] h-[500px] rounded-full blur-[100px] animate-pulse-soft" style={{ background: 'radial-gradient(circle, rgba(26,93,26,0.08) 0%, transparent 60%)', top: '40%', left: '30%' }} />
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
    <div ref={ref} className={`transition-all duration-1000 ease-out ${className}`} style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(40px)', transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

const SectionHeading = ({ eyebrow, title, subtitle, light = false }) => {
  const [ref, isVisible] = useScrollReveal();
  return (
    <div ref={ref} className="text-center mb-16 md:mb-20">
      {eyebrow && (
        <span className={`inline-block px-4 py-1.5 rounded-full text-xs tracking-[0.2em] uppercase mb-4 transition-all duration-700 ${light ? 'bg-white/20 text-white' : 'bg-gold/10 text-gold-dark'}`} style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(20px)' }}>
          {eyebrow}
        </span>
      )}
      <h2 className={`font-display text-4xl md:text-5xl lg:text-6xl mb-4 transition-all duration-700 delay-100 ${light ? 'text-white' : 'text-charcoal'}`} style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(20px)', transitionDelay: '100ms' }}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-lg max-w-2xl mx-auto transition-all duration-700 delay-200 ${light ? 'text-white/80' : 'text-warm-gray'}`} style={{ opacity: isVisible ? 1 : 0, transitionDelay: '200ms' }}>
          {subtitle}
        </p>
      )}
      <div className="flex items-center justify-center gap-2 mt-6 transition-all duration-1000 delay-300" style={{ opacity: isVisible ? 1 : 0, transitionDelay: '300ms' }}>
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
    <div ref={ref} className={`bg-white rounded-2xl shadow-soft transition-all duration-500 ${hover ? 'hover:shadow-elevated hover:-translate-y-1' : ''} ${className}`} style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(30px)', transitionDelay: `${delay}ms` }}>
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
    <button type={type} onClick={onClick} disabled={disabled} className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      {children}
    </button>
  );
};

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
// MUSIC PLAYER
// ============================================

const MusicPlayer = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(() => localStorage.getItem('music-muted') === 'true');
  const [currentTrack, setCurrentTrack] = useState(0);
  const audioRef = useRef(null);

  const hasMusic = MUSIC_PLAYLIST.some(track => track.url);

  useEffect(() => {
    localStorage.setItem('music-muted', isMuted);
  }, [isMuted]);

  const togglePlay = () => {
    if (!audioRef.current || !hasMusic) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % MUSIC_PLAYLIST.length);
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + MUSIC_PLAYLIST.length) % MUSIC_PLAYLIST.length);
  };

  if (!hasMusic) return null;

  return (
    <div className={`fixed bottom-6 left-6 z-40 transition-all duration-300 ${isExpanded ? 'w-72' : 'w-14'}`}>
      {MUSIC_PLAYLIST[currentTrack]?.url && (
        <audio ref={audioRef} src={MUSIC_PLAYLIST[currentTrack].url} muted={isMuted} onEnded={nextTrack} />
      )}

      <div className="bg-charcoal/95 backdrop-blur-lg rounded-2xl shadow-elevated overflow-hidden">
        {isExpanded && (
          <div className="p-4 border-b border-white/10">
            <p className="text-white font-medium truncate">{MUSIC_PLAYLIST[currentTrack]?.title}</p>
            <p className="text-white/60 text-sm truncate">{MUSIC_PLAYLIST[currentTrack]?.artist}</p>
          </div>
        )}

        <div className="flex items-center gap-2 p-3">
          <button onClick={() => setIsExpanded(!isExpanded)} className="w-8 h-8 flex items-center justify-center text-gold hover:text-gold-light transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
          </button>

          {isExpanded && (
            <>
              <button onClick={prevTrack} className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
              </button>
              <button onClick={togglePlay} className="w-10 h-10 flex items-center justify-center bg-gold rounded-full text-white hover:bg-gold-light transition-colors">
                {isPlaying ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                ) : (
                  <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                )}
              </button>
              <button onClick={nextTrack} className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
              </button>
              <button onClick={() => setIsMuted(!isMuted)} className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors">
                {isMuted ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================
// NAVIGATION
// ============================================

const Navigation = ({ activeSection, setActiveSection }) => {
  const { language, toggleLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: t('nav.home') },
    { id: 'life', label: t('nav.life') },
    { id: 'family', label: t('nav.family') },
    { id: 'timeline', label: t('nav.memories') },
    { id: 'candles', label: t('nav.candles') },
    { id: 'stream', label: t('nav.stream') },
    { id: 'tributes', label: t('nav.tributes') },
    { id: 'donate', label: t('nav.donate') },
    { id: 'contact', label: t('nav.contact') },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-lg shadow-soft' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <button onClick={() => setActiveSection('home')} className="group">
            <span className={`font-display text-xl transition-colors duration-300 ${isScrolled ? 'text-charcoal' : 'text-white'} group-hover:text-gold`}>
              {t('hero.inLovingMemory')}
            </span>
          </button>

          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button key={item.id} onClick={() => setActiveSection(item.id)} className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeSection === item.id ? 'bg-gold text-white' : isScrolled ? 'text-charcoal hover:text-gold hover:bg-gold/10' : 'text-white/90 hover:text-white hover:bg-white/10'}`}>
                {item.label}
              </button>
            ))}
            <button onClick={toggleLanguage} className={`ml-2 px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${isScrolled ? 'border-gold text-gold hover:bg-gold hover:text-white' : 'border-white/50 text-white hover:bg-white hover:text-charcoal'}`}>
              {language === 'en' ? 'EWE' : 'EN'}
            </button>
          </div>

          <div className="lg:hidden flex items-center gap-2">
            <button onClick={toggleLanguage} className={`px-2 py-1 rounded text-xs font-bold ${isScrolled ? 'text-gold' : 'text-white'}`}>
              {language === 'en' ? 'EWE' : 'EN'}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`p-2 rounded-lg transition-colors ${isScrolled ? 'text-charcoal' : 'text-white'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        <div className={`lg:hidden transition-all duration-300 overflow-hidden ${mobileMenuOpen ? 'max-h-[500px] pb-4' : 'max-h-0'}`}>
          <div className="bg-white rounded-2xl shadow-elevated p-2 space-y-1">
            {navItems.map((item) => (
              <button key={item.id} onClick={() => { setActiveSection(item.id); setMobileMenuOpen(false); }} className={`block w-full px-4 py-3 rounded-xl text-left font-medium transition-colors ${activeSection === item.id ? 'bg-gold text-white' : 'text-charcoal hover:bg-cream'}`}>
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
  const { t } = useLanguage();
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
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
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
          <p className="text-gold font-medium tracking-[0.3em] uppercase text-sm mb-2">July 15, 1948 — December 14, 2025</p>
          <p className="text-white/60 text-sm mb-8">{calculateAge()} {t('hero.yearsOfGrace')}</p>
        </div>

        <h1 className={`font-display text-5xl md:text-7xl lg:text-8xl text-white mb-6 transition-all duration-1000 delay-300 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          Josephine <span className="text-gold">Worla</span> Ameovi
        </h1>

        <p className={`text-2xl md:text-3xl text-gold-light font-display italic mb-8 transition-all duration-1000 delay-400 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          "{t('hero.grandma')}"
        </p>

        <p className={`text-white/80 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12 transition-all duration-1000 delay-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {t('hero.subtitle')}
        </p>

        <div className={`transition-all duration-1000 delay-600 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Button variant="outline" onClick={() => document.getElementById('life').scrollIntoView({ behavior: 'smooth' })}>
            {t('hero.celebrateLife')}
          </Button>
        </div>

        <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-1000 delay-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
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
  const { t } = useLanguage();

  const milestones = [
    { year: t('life.milestones.born.year'), title: t('life.milestones.born.title'), description: t('life.milestones.born.description'), icon: '🌟' },
    { year: t('life.milestones.growing.year'), title: t('life.milestones.growing.title'), description: t('life.milestones.growing.description'), icon: '🌱' },
    { year: t('life.milestones.marriage.year'), title: t('life.milestones.marriage.title'), description: t('life.milestones.marriage.description'), icon: '💑' },
    { year: t('life.milestones.legacy.year'), title: t('life.milestones.legacy.title'), description: t('life.milestones.legacy.description'), icon: '👑' }
  ];

  return (
    <section id="life" className="py-24 md:py-32 bg-cream relative overflow-hidden">
      <CornerOrnament position="top-left" />
      <CornerOrnament position="top-right" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SectionHeading eyebrow={t('life.eyebrow')} title={t('life.title')} subtitle={t('life.subtitle')} />

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
              <p className="text-2xl md:text-3xl font-display text-charcoal italic px-8">{t('life.quote')}</p>
              <span className="absolute -bottom-8 -right-4 text-6xl text-gold/20 font-serif rotate-180">"</span>
            </div>
            <p className="text-warm-gray mt-8">— {t('life.quoteAuthor')}</p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

// ============================================
// FAMILY TREE SECTION
// ============================================

const FamilyTreeSection = () => {
  const { t } = useLanguage();
  const [selectedMember, setSelectedMember] = useState(null);

  return (
    <section id="family" className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={t('family.eyebrow')} title={t('family.title')} subtitle={t('family.subtitle')} />

        <div className="flex flex-col items-center">
          {/* Matriarch */}
          <AnimatedSection>
            <div className="text-center mb-8">
              <button onClick={() => setSelectedMember(FAMILY_DATA.matriarch)} className="group">
                <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-gold to-gold-dark p-1 shadow-gold-glow group-hover:scale-105 transition-transform">
                  <div className="w-full h-full rounded-full bg-cream flex items-center justify-center">
                    <span className="text-4xl">👑</span>
                  </div>
                </div>
                <p className="mt-3 font-display text-xl text-charcoal">{FAMILY_DATA.matriarch.name}</p>
                <p className="text-gold text-sm">{t('family.matriarch')}</p>
              </button>
            </div>
          </AnimatedSection>

          {/* Connector Line */}
          <div className="w-px h-12 bg-gradient-to-b from-gold to-gold/30" />

          {/* Children Row */}
          <AnimatedSection delay={200}>
            <div className="text-center mb-4">
              <span className="inline-block px-4 py-1 bg-burgundy/10 text-burgundy rounded-full text-sm font-medium">{t('family.children')}</span>
            </div>
            <div className="flex flex-wrap justify-center gap-8 mb-8">
              {FAMILY_DATA.children.map((child, index) => (
                <button key={child.id} onClick={() => setSelectedMember(child)} className="group text-center">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-burgundy to-burgundy-dark p-0.5 group-hover:scale-105 transition-transform">
                    <div className="w-full h-full rounded-full bg-cream flex items-center justify-center">
                      <span className="text-2xl">👤</span>
                    </div>
                  </div>
                  <p className="mt-2 text-sm font-medium text-charcoal">{child.name}</p>
                </button>
              ))}
            </div>
          </AnimatedSection>

          {/* Connector Line */}
          <div className="w-px h-8 bg-gradient-to-b from-burgundy/30 to-forest/30" />

          {/* Grandchildren Row */}
          <AnimatedSection delay={400}>
            <div className="text-center mb-4">
              <span className="inline-block px-4 py-1 bg-forest/10 text-forest rounded-full text-sm font-medium">{t('family.grandchildren')}</span>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {FAMILY_DATA.grandchildren.map((grandchild) => (
                <button key={grandchild.id} onClick={() => setSelectedMember(grandchild)} className="group text-center">
                  <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-forest to-forest p-0.5 group-hover:scale-105 transition-transform">
                    <div className="w-full h-full rounded-full bg-cream flex items-center justify-center">
                      <span className="text-lg">👤</span>
                    </div>
                  </div>
                  <p className="mt-1 text-xs font-medium text-charcoal">{grandchild.name}</p>
                </button>
              ))}
            </div>
          </AnimatedSection>
        </div>

        {/* Member Modal */}
        {selectedMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/80 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedMember(null)}>
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-scale-in text-center" onClick={e => e.stopPropagation()}>
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-gold to-gold-dark p-1 mb-4">
                <div className="w-full h-full rounded-full bg-cream flex items-center justify-center">
                  <span className="text-4xl">👤</span>
                </div>
              </div>
              <h3 className="font-display text-2xl text-charcoal mb-2">{selectedMember.name}</h3>
              {selectedMember.title && <p className="text-gold">{selectedMember.title}</p>}
              {selectedMember.relation && <p className="text-warm-gray">{selectedMember.relation}</p>}
              {selectedMember.years && <p className="text-warm-gray text-sm mt-2">{selectedMember.years}</p>}
              <button onClick={() => setSelectedMember(null)} className="mt-6 px-6 py-2 bg-gold text-white rounded-full hover:bg-gold-dark transition-colors">
                {t('common.close')}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

// ============================================
// PHOTO TIMELINE SECTION
// ============================================

const PhotoTimelineSection = () => {
  const { t } = useLanguage();
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const decades = [
    { period: '1940s-50s', photos: [{ id: 1, label: 'Childhood' }] },
    { period: '1960s-70s', photos: [{ id: 2, label: 'Young Adult' }, { id: 3, label: 'Wedding' }] },
    { period: '1980s-90s', photos: [{ id: 4, label: 'Family Life' }, { id: 5, label: 'Celebrations' }] },
    { period: '2000s-2020s', photos: [{ id: 6, label: 'Grandchildren' }, { id: 7, label: 'Golden Years' }] }
  ];

  return (
    <section id="timeline" className="py-24 md:py-32 bg-cream relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={t('gallery.eyebrow')} title={t('gallery.title')} subtitle={t('gallery.subtitle')} />

        {/* Horizontal Timeline */}
        <div className="relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-gold/20 via-gold to-gold/20 hidden md:block" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {decades.map((decade, index) => (
              <AnimatedSection key={decade.period} delay={index * 150}>
                <div className="text-center mb-4">
                  <span className="inline-block px-4 py-2 bg-gold text-white rounded-full text-sm font-bold relative z-10">
                    {decade.period}
                  </span>
                </div>
                <div className="space-y-4">
                  {decade.photos.map((photo) => (
                    <div key={photo.id} onClick={() => setSelectedPhoto(photo)} className="relative aspect-square bg-gradient-to-br from-white to-warm-white rounded-2xl overflow-hidden cursor-pointer group shadow-soft hover:shadow-elevated transition-all duration-500">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-charcoal/30 group-hover:text-gold/50 transition-colors">
                          <svg className="w-10 h-10 mx-auto mb-2 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                          </svg>
                          <span className="text-sm font-medium">{photo.label}</span>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>

        <AnimatedSection delay={700}>
          <p className="text-center text-warm-gray mt-12">{t('gallery.addNote')}</p>
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
                <p className="text-lg">{selectedPhoto.label}</p>
                <p className="text-sm mt-2">Photo coming soon</p>
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
// CANDLE LIGHTING SECTION
// ============================================

const CandleLightingSection = ({ showToast }) => {
  const { t } = useLanguage();
  const [candles, setCandles] = useState(() => {
    const saved = localStorage.getItem('memorial-candles');
    return saved ? JSON.parse(saved) : [];
  });
  const [name, setName] = useState('');

  useEffect(() => {
    localStorage.setItem('memorial-candles', JSON.stringify(candles));
  }, [candles]);

  const lightCandle = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCandle = { id: Date.now(), name: name.trim(), litAt: new Date().toISOString() };
    setCandles(prev => [newCandle, ...prev]);
    setName('');
    showToast(t('candles.thankYou'), 'success');
  };

  return (
    <section id="candles" className="py-24 md:py-32 bg-gradient-to-b from-charcoal to-charcoal-light text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        {candles.slice(0, 50).map((candle, i) => (
          <div key={candle.id} className="absolute w-1 h-1 bg-gold rounded-full animate-pulse" style={{ left: `${(i * 7) % 100}%`, top: `${(i * 11) % 100}%`, animationDelay: `${i * 0.1}s` }} />
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SectionHeading eyebrow={t('candles.eyebrow')} title={t('candles.title')} subtitle={t('candles.subtitle')} light />

        {/* Light a Candle Form */}
        <AnimatedSection>
          <div className="max-w-md mx-auto mb-16">
            <form onSubmit={lightCandle} className="flex gap-3">
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={t('candles.yourName')} className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-gold focus:outline-none transition-colors" />
              <Button type="submit" className="whitespace-nowrap">{t('candles.lightCandle')}</Button>
            </form>
          </div>
        </AnimatedSection>

        {/* Candle Count */}
        <AnimatedSection delay={200}>
          <div className="text-center mb-12">
            <span className="text-6xl font-display text-gold">{candles.length}</span>
            <p className="text-white/70 mt-2">{t('candles.candlesLit')}</p>
          </div>
        </AnimatedSection>

        {/* Candles Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
          {candles.slice(0, 50).map((candle, index) => (
            <AnimatedSection key={candle.id} delay={index * 30} className="text-center">
              <div className="relative mx-auto w-8">
                {/* Candle flame */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-3 h-5 bg-gradient-to-t from-gold via-yellow-400 to-white rounded-full animate-candle-flicker opacity-90" />
                {/* Candle body */}
                <div className="w-4 h-8 mx-auto bg-gradient-to-b from-cream to-warm-white rounded-sm" />
              </div>
              <p className="text-xs text-white/60 mt-2 truncate">{candle.name}</p>
            </AnimatedSection>
          ))}
        </div>

        {candles.length > 50 && (
          <p className="text-center text-white/50 mt-8">+{candles.length - 50} more candles lit</p>
        )}
      </div>
    </section>
  );
};

// ============================================
// LIVE STREAM SECTION
// ============================================

const LiveStreamSection = () => {
  const { t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = STREAM_CONFIG.eventDateTime - new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const hasStream = STREAM_CONFIG.youtubeVideoId;

  return (
    <section id="stream" className="py-24 md:py-32 bg-burgundy-dark text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 border border-white rounded-full" />
        <div className="absolute bottom-20 right-20 w-96 h-96 border border-white rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SectionHeading eyebrow={t('stream.eyebrow')} title={t('stream.title')} subtitle={t('stream.subtitle')} light />

        {!hasStream ? (
          // Countdown Mode
          <AnimatedSection>
            <div className="text-center">
              <p className="text-white/70 mb-8">{t('stream.countdown')}</p>
              <div className="flex justify-center gap-4 md:gap-8">
                {[
                  { value: timeLeft.days, label: t('stream.days') },
                  { value: timeLeft.hours, label: t('stream.hours') },
                  { value: timeLeft.minutes, label: t('stream.minutes') },
                  { value: timeLeft.seconds, label: t('stream.seconds') }
                ].map((item, i) => (
                  <div key={i} className="text-center">
                    <div className="w-16 h-16 md:w-24 md:h-24 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-2">
                      <span className="text-3xl md:text-5xl font-display text-gold">{item.value.toString().padStart(2, '0')}</span>
                    </div>
                    <span className="text-xs md:text-sm text-white/60 uppercase tracking-wider">{item.label}</span>
                  </div>
                ))}
              </div>
              <p className="mt-12 text-white/50">Stream link will be available when the service begins</p>
            </div>
          </AnimatedSection>
        ) : (
          // Stream Player
          <AnimatedSection>
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
              <iframe
                src={`https://www.youtube.com/embed/${STREAM_CONFIG.youtubeVideoId}?autoplay=0`}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            {STREAM_CONFIG.hasEnded && (
              <p className="text-center text-white/70 mt-6">{t('stream.streamEnded')}</p>
            )}
          </AnimatedSection>
        )}
      </div>
    </section>
  );
};

// ============================================
// TRIBUTES SECTION (Guestbook + Media)
// ============================================

const TributesSection = ({ showToast }) => {
  const { t } = useLanguage();
  const [entries, setEntries] = useState([
    { id: 'welcome', name: 'The Family', location: 'Accra, Ghana', message: 'We welcome all who knew and loved Grandma to share their memories here. Your words mean everything to us.', date: 'December 2025' }
  ]);
  const [formData, setFormData] = useState({ name: '', location: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaTributes, setMediaTributes] = useState(() => {
    const saved = localStorage.getItem('memorial-media-tributes');
    return saved ? JSON.parse(saved) : [];
  });

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
        setEntries(prev => [prev[0], { id: Date.now(), name: formData.name, location: formData.location || 'Not specified', message: formData.message, date: 'Just now' }, ...prev.slice(1)]);
        setFormData({ name: '', location: '', message: '' });
        showToast(t('tributes.successMessage'), 'success');
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      showToast(t('common.error'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openCloudinaryWidget = () => {
    if (typeof window.cloudinary === 'undefined') {
      showToast('Video upload not configured yet', 'error');
      return;
    }

    window.cloudinary.openUploadWidget({
      cloudName: CLOUDINARY_CLOUD_NAME,
      uploadPreset: CLOUDINARY_UPLOAD_PRESET,
      sources: ['local', 'camera'],
      resourceType: 'video',
      maxFileSize: 50000000,
      maxDuration: 120,
      clientAllowedFormats: ['mp4', 'webm', 'mov', 'mp3', 'wav'],
      styles: { palette: { window: '#FBF8F3', windowBorder: '#D4AF37', tabIcon: '#D4AF37', menuIcons: '#2C2825', textDark: '#2C2825', textLight: '#FFFFFF', link: '#D4AF37', action: '#D4AF37', inactiveTabIcon: '#7D7670', error: '#8B1538', inProgress: '#D4AF37', complete: '#1A5D1A', sourceBg: '#FEFCF9' } }
    }, (error, result) => {
      if (!error && result && result.event === 'success') {
        const newTribute = {
          id: Date.now(),
          url: result.info.secure_url,
          type: result.info.resource_type,
          name: 'Anonymous',
          createdAt: new Date().toISOString()
        };
        const updated = [newTribute, ...mediaTributes];
        setMediaTributes(updated);
        localStorage.setItem('memorial-media-tributes', JSON.stringify(updated));
        showToast('Your tribute has been uploaded!', 'success');
      }
    });
  };

  return (
    <section id="tributes" className="py-24 md:py-32 bg-cream relative">
      <CornerOrnament position="bottom-left" />
      <CornerOrnament position="bottom-right" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={t('tributes.eyebrow')} title={t('tributes.title')} subtitle={t('tributes.subtitle')} />

        {/* Video/Audio Tributes */}
        <AnimatedSection>
          <Card className="p-6 md:p-8 mb-12">
            <h3 className="font-display text-xl text-charcoal mb-4 flex items-center gap-2">
              <span className="text-2xl">🎥</span> {t('tributes.videoTributes')}
            </h3>
            <p className="text-warm-gray mb-6">{t('tributes.recordVideo')}</p>
            <Button onClick={openCloudinaryWidget} variant="secondary">{t('tributes.uploadTribute')}</Button>

            {mediaTributes.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                {mediaTributes.map((tribute) => (
                  <div key={tribute.id} className="aspect-video bg-charcoal rounded-xl overflow-hidden">
                    {tribute.type === 'video' ? (
                      <video src={tribute.url} controls className="w-full h-full object-cover" />
                    ) : (
                      <audio src={tribute.url} controls className="w-full mt-8" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </AnimatedSection>

        {/* Written Tributes Form */}
        <AnimatedSection delay={100}>
          <Card className="p-6 md:p-8 mb-12">
            <h3 className="font-display text-xl text-charcoal mb-6 flex items-center gap-2">
              <span className="text-2xl">✍️</span> {t('tributes.signGuestbook')}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">{t('tributes.yourName')} *</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-warm-gray/20 focus:border-gold focus:ring-0 outline-none transition-colors bg-cream/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">{t('tributes.location')}</label>
                  <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-warm-gray/20 focus:border-gold focus:ring-0 outline-none transition-colors bg-cream/50" placeholder="City, Country" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">{t('tributes.yourMessage')} *</label>
                <textarea required rows={4} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-warm-gray/20 focus:border-gold focus:ring-0 outline-none transition-colors resize-none bg-cream/50" />
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t('tributes.sending') : t('tributes.submitTribute')}
              </Button>
            </form>
          </Card>
        </AnimatedSection>

        {/* Entries List */}
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
// DONATION SECTION
// ============================================

const DonationSection = ({ showToast }) => {
  const { t } = useLanguage();
  const [copiedId, setCopiedId] = useState(null);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text.replace(/\s/g, ''));
    setCopiedId(id);
    showToast(t('donate.copied'), 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const providers = [
    { id: 'mtn', name: 'MTN Mobile Money', color: 'from-yellow-400 to-yellow-500', ...MOBILE_MONEY.mtn },
    { id: 'vodafone', name: 'Vodafone Cash', color: 'from-red-500 to-red-600', ...MOBILE_MONEY.vodafone },
    { id: 'airtel', name: 'AirtelTigo Money', color: 'from-blue-500 to-blue-600', ...MOBILE_MONEY.airtelTigo }
  ];

  return (
    <section id="donate" className="py-24 md:py-32 bg-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={t('donate.eyebrow')} title={t('donate.title')} subtitle={t('donate.subtitle')} />

        <AnimatedSection>
          <div className="text-center mb-12">
            <span className="inline-block px-6 py-2 bg-gold/10 text-gold-dark rounded-full text-lg font-medium">
              {t('donate.mobileMoneyTitle')}
            </span>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6">
          {providers.map((provider, index) => (
            <AnimatedSection key={provider.id} delay={index * 100}>
              <Card className="p-6 text-center">
                <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${provider.color} flex items-center justify-center text-white text-2xl font-bold mb-4`}>
                  {provider.name.charAt(0)}
                </div>
                <h4 className="font-medium text-charcoal mb-2">{provider.name}</h4>
                <p className="text-2xl font-mono text-charcoal mb-1">{provider.number}</p>
                <p className="text-sm text-warm-gray mb-4">{t('donate.accountName')}: {provider.name}</p>
                <button
                  onClick={() => copyToClipboard(provider.number, provider.id)}
                  className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${copiedId === provider.id ? 'bg-forest text-white' : 'bg-gold/10 text-gold-dark hover:bg-gold hover:text-white'}`}
                >
                  {copiedId === provider.id ? t('donate.copied') : t('donate.copyNumber')}
                </button>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// CONTACT SECTION
// ============================================

const ContactSection = ({ showToast }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: '', phone: '', message: '', attending: '', guests: '1' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formType, setFormType] = useState('message');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const endpoint = formType === 'rsvp' ? FORMSPREE_RSVP : FORMSPREE_CONTACT;
      const data = formType === 'rsvp'
        ? { name: formData.name, phone: formData.phone, attending: formData.attending, guests: formData.guests, message: formData.message, _subject: `RSVP from ${formData.name} - ${formData.attending === 'yes' ? 'Attending' : 'Not Attending'}` }
        : { name: formData.name, phone: formData.phone, message: formData.message, _subject: `Contact Message from ${formData.name}` };

      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });

      if (response.ok) {
        showToast(formType === 'rsvp' ? 'RSVP submitted successfully!' : 'Message sent successfully!', 'success');
        setFormData({ name: '', phone: '', message: '', attending: '', guests: '1' });
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      showToast(t('common.error'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-cream relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={t('contact.eyebrow')} title={t('contact.title')} subtitle={t('contact.subtitle')} />

        <div className="grid md:grid-cols-2 gap-8">
          <AnimatedSection>
            <Card className="p-6 md:p-8 h-full">
              <div className="flex gap-2 mb-6">
                <button type="button" onClick={() => setFormType('message')} className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${formType === 'message' ? 'bg-gold text-white' : 'bg-cream text-charcoal hover:bg-gold/10'}`}>
                  {t('contact.sendMessage')}
                </button>
                <button type="button" onClick={() => setFormType('rsvp')} className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${formType === 'rsvp' ? 'bg-gold text-white' : 'bg-cream text-charcoal hover:bg-gold/10'}`}>
                  {t('contact.rsvp')}
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" required placeholder={`${t('contact.yourName')} *`} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-warm-gray/20 focus:border-gold focus:ring-0 outline-none transition-colors" />
                <input type="tel" placeholder={t('contact.phone')} value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-warm-gray/20 focus:border-gold focus:ring-0 outline-none transition-colors" />

                {formType === 'rsvp' && (
                  <>
                    <select value={formData.attending} onChange={(e) => setFormData({ ...formData, attending: e.target.value })} required className="w-full px-4 py-3 rounded-xl border-2 border-warm-gray/20 focus:border-gold focus:ring-0 outline-none transition-colors bg-white">
                      <option value="">{t('contact.willAttend')} *</option>
                      <option value="yes">{t('contact.yesAttend')}</option>
                      <option value="no">{t('contact.noAttend')}</option>
                      <option value="maybe">{t('contact.maybeAttend')}</option>
                    </select>
                    <input type="number" min="1" max="10" placeholder={t('contact.numberOfGuests')} value={formData.guests} onChange={(e) => setFormData({ ...formData, guests: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-warm-gray/20 focus:border-gold focus:ring-0 outline-none transition-colors" />
                  </>
                )}

                <textarea rows={3} placeholder={formType === 'rsvp' ? t('contact.specialRequirements') : t('contact.yourMessagePlaceholder')} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-warm-gray/20 focus:border-gold focus:ring-0 outline-none transition-colors resize-none" />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? t('tributes.sending') : formType === 'rsvp' ? t('contact.submitRsvp') : t('contact.sendMessage')}
                </Button>
              </form>
            </Card>
          </AnimatedSection>

          <div className="space-y-6">
            <AnimatedSection delay={100}>
              <Card className="p-6">
                <h4 className="font-medium text-charcoal mb-4 flex items-center gap-2">
                  <span className="text-gold">📞</span> {t('contact.familyContacts')}
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
                <p className="text-charcoal text-lg italic font-display text-center">{t('proverbs.meetAgain')}</p>
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
  const { t } = useLanguage();

  return (
    <footer className="bg-charcoal text-white py-16 relative overflow-hidden">
      <KenteBorder className="absolute top-0 left-0 right-0 h-2" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-6"><span className="text-gold text-3xl">✦</span></div>
        <h2 className="font-display text-3xl md:text-4xl text-white mb-2">Josephine Worla Ameovi</h2>
        <p className="text-gold text-lg mb-2">"{t('hero.grandma')}"</p>
        <p className="text-white/60 mb-8">July 15, 1948 — December 14, 2025</p>

        <div className="flex items-center justify-center gap-4 mb-8">
          <span className="h-px w-16 bg-gold/40" />
          <span className="text-gold">{t('footer.foreverInHearts')}</span>
          <span className="h-px w-16 bg-gold/40" />
        </div>

        <p className="text-white/40 text-sm">{t('footer.builtWithLove')}</p>
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
      const sections = ['home', 'life', 'family', 'timeline', 'candles', 'stream', 'tributes', 'donate', 'contact'];
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
    <LanguageProvider>
      {isLoading && <PageLoader onComplete={() => setIsLoading(false)} />}

      <div className={`min-h-screen bg-cream text-charcoal antialiased transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <Navigation activeSection={activeSection} setActiveSection={scrollToSection} />
        <HeroSection />
        <LifeSection />
        <FamilyTreeSection />
        <PhotoTimelineSection />
        <CandleLightingSection showToast={showToast} />
        <LiveStreamSection />
        <TributesSection showToast={showToast} />
        <DonationSection showToast={showToast} />
        <ContactSection showToast={showToast} />
        <Footer />
        <MusicPlayer />
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </LanguageProvider>
  );
}
