import { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import translations from './translations';

// ============================================
// CONFIGURATION - Update these values
// ============================================

// Formspree endpoints
const FORMSPREE_GUESTBOOK = 'https://formspree.io/f/movgoyle';
const FORMSPREE_RSVP = 'https://formspree.io/f/xgvgjrzk';
const FORMSPREE_CONTACT = 'https://formspree.io/f/xkgdlkzz';


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

// Paystack configuration (LIVE MODE)
const PAYSTACK_PUBLIC_KEY = 'pk_live_073a86e6624fea1b49c77d020e0beb0b5d23d12a';

// AI Tribute Writer API (Cloudflare Worker with Claude)
const TRIBUTE_AI_URL = 'https://memorial-tribute-ai.ghwmelite.workers.dev';

// Guestbook API (Cloudflare Worker with KV storage)
const GUESTBOOK_API_URL = 'https://memorial-guestbook-api.ghwmelite.workers.dev';

// Music configuration - YouTube video IDs for hymns
const MUSIC_PLAYLIST = [
  { id: 'H23l-y-jdac', title: 'Memorial Hymns', artist: 'Sacred Collection' },
  { id: 'm9I-nBB9M70', title: 'Gospel Hymns', artist: 'Sacred Collection' },
  { id: 'oHDPuPxIIW0', title: 'Traditional Hymns', artist: 'Sacred Collection' }
];
const MUSIC_CONFIG = {
  playlistId: 'RDH23l-y-jdac', // YouTube mix playlist
  title: 'Memorial Hymns',
  artist: 'Sacred Music Collection'
};

// Family tree data
const FAMILY_DATA = {
  matriarch: {
    name: 'Josephine Worla Ameovi',
    title: 'Our Beloved Matriarch',
    subtitle: 'The Root of Our Family Tree',
    years: '1948 - 2025',
    quote: 'Her love flows through every branch of our family',
    color: 'gold'
  },
  children: [
    { id: 1, name: 'John Marion K. Hodges', relation: 'First Son', title: 'Eldest Child', color: 'burgundy' },
    { id: 2, name: 'Osborn M.D.K. Hodges', relation: 'Second Son', title: 'Beloved Child', color: 'burgundy' }
  ],
  grandchildren: [
    { id: 1, name: 'Ria Hodges', parentId: 1, relation: 'Granddaughter', color: 'rose' },
    { id: 2, name: 'Gayle Hodges', parentId: 1, relation: 'Granddaughter', color: 'rose' }
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

// Staggered children animation hook
const useStaggeredReveal = (itemCount, baseDelay = 100) => {
  const [ref, isVisible] = useScrollReveal();
  const getDelay = (index) => isVisible ? index * baseDelay : 0;
  return { ref, isVisible, getDelay };
};

// Counter animation hook for numbers
const useCountUp = (end, duration = 2000, start = 0) => {
  const [count, setCount] = useState(start);
  const [ref, isVisible] = useScrollReveal();

  useEffect(() => {
    if (!isVisible) return;
    let startTime = null;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * (end - start) + start));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isVisible, end, duration, start]);

  return { ref, count, isVisible };
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

const KenteBorder = ({ className = '', animated = true }) => (
  <div className={`flex items-center justify-center gap-1 overflow-hidden ${className}`}>
    <div className={`flex gap-1 ${animated ? 'animate-kente-shimmer' : ''}`}>
      {Array.from({ length: 40 }).map((_, i) => (
        <div key={i} className="flex gap-0.5 flex-shrink-0">
          <div className="w-3 h-2 bg-gradient-to-b from-gold to-gold-dark rounded-sm transition-transform hover:scale-110" />
          <div className="w-1.5 h-2 bg-forest rounded-sm" />
          <div className="w-1.5 h-2 bg-burgundy rounded-sm" />
        </div>
      ))}
    </div>
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
// FEATURE 1: FLOATING PHOTO MEMORIES
// ============================================

const FloatingPhotoMemories = () => {
  const photos = [
    { src: '/photos/barclays-1971.jpeg', rotation: -8, x: 5, y: 15, delay: 0, duration: 7 },
    { src: '/photos/portrait-1976.jpeg', rotation: 5, x: 85, y: 20, delay: 1, duration: 8 },
    { src: '/photos/with-baby-oz-1985.jpeg', rotation: -5, x: 10, y: 70, delay: 2, duration: 6 },
    { src: '/photos/cultural-day-barclays.jpeg', rotation: 8, x: 80, y: 65, delay: 1.5, duration: 9 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
      {photos.map((photo, i) => (
        <div
          key={i}
          className="absolute animate-float-photo opacity-20 hover:opacity-40 transition-opacity duration-500"
          style={{
            left: `${photo.x}%`,
            top: `${photo.y}%`,
            '--rotation': `${photo.rotation}deg`,
            '--delay': `${photo.delay}s`,
            '--duration': `${photo.duration}s`,
          }}
        >
          <div className="relative w-20 h-24 bg-white p-1 shadow-xl rounded-sm transform hover:scale-110 transition-transform duration-500">
            <img
              src={photo.src}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gold/10 to-transparent" />
          </div>
        </div>
      ))}
    </div>
  );
};

// ============================================
// FEATURE 4: GOLDEN RAIN PARTICLES
// ============================================

const GoldenRainParticles = ({ intensity = 'medium' }) => {
  const counts = { light: 15, medium: 25, heavy: 40 };
  const count = counts[intensity] || 25;

  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 10,
    duration: Math.random() * 15 + 10,
    opacity: Math.random() * 0.4 + 0.1,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-golden-rain"
          style={{
            left: `${p.x}%`,
            top: '-20px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: `radial-gradient(circle, rgba(212,175,55,${p.opacity}) 0%, transparent 70%)`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            filter: 'blur(0.5px)',
          }}
        />
      ))}
    </div>
  );
};

// ============================================
// FEATURE 5: AMBIENT MUSIC PLAYER (YouTube-based)
// ============================================

const AmbientMusicPlayer = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showUnmutePrompt, setShowUnmutePrompt] = useState(true);
  // Start with a random track
  const [currentTrackIndex, setCurrentTrackIndex] = useState(() =>
    Math.floor(Math.random() * MUSIC_PLAYLIST.length)
  );

  if (!MUSIC_PLAYLIST || MUSIC_PLAYLIST.length === 0) return null;

  const currentTrack = MUSIC_PLAYLIST[currentTrackIndex];
  const youtubeUrl = `https://www.youtube.com/embed/${currentTrack.id}?autoplay=1&loop=1&playlist=${currentTrack.id}&mute=${isMuted ? 1 : 0}&enablejsapi=1`;

  // Shuffle to a random different track
  const shuffleTrack = () => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * MUSIC_PLAYLIST.length);
    } while (newIndex === currentTrackIndex && MUSIC_PLAYLIST.length > 1);
    setCurrentTrackIndex(newIndex);
  };

  const nextTrack = () => {
    shuffleTrack();
  };

  const prevTrack = () => {
    shuffleTrack();
  };

  return (
    <>
      {/* Unmute prompt overlay - shows once on page load */}
      {showUnmutePrompt && isMuted && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => {
            setIsMuted(false);
            setShowUnmutePrompt(false);
          }}
        >
          <div className="bg-gradient-to-br from-burgundy-dark to-burgundy p-6 sm:p-8 rounded-2xl shadow-2xl border border-gold/30 text-center max-w-xs sm:max-w-sm mx-4 animate-fade-in">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-full bg-gold/20 flex items-center justify-center">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gold" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-serif text-gold mb-2">Memorial Hymns</h3>
            <p className="text-white/70 text-sm mb-4 sm:mb-6">Tap to listen to beautiful hymns in memory of Grandma</p>
            <button
              className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gold text-white rounded-full font-medium hover:bg-gold-dark transition-colors text-sm sm:text-base"
              onClick={(e) => {
                e.stopPropagation();
                setIsMuted(false);
                setShowUnmutePrompt(false);
              }}
            >
              Enable Sound
            </button>
            <p className="text-white/40 text-xs mt-3 sm:mt-4">Or tap anywhere to skip</p>
          </div>
        </div>
      )}

      {/* Compact Music Player Widget */}
      <div className={`fixed bottom-4 left-4 z-40 transition-all duration-300 ease-out ${isExpanded ? 'w-64 sm:w-72' : 'w-auto'}`}>
        <div className="music-player-mini rounded-xl shadow-lg border border-gold/20 overflow-hidden backdrop-blur-md">
          {/* Collapsed Mini View - Always visible */}
          <div className="flex items-center p-2 gap-2">
            {/* Sound Toggle Button */}
            <button
              onClick={() => {
                if (isMuted) {
                  setIsMuted(false);
                  setShowUnmutePrompt(false);
                } else {
                  setIsMuted(true);
                }
              }}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gold text-white hover:bg-gold-dark transition-colors flex-shrink-0"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
              )}
            </button>

            {/* Animated Equalizer / Status */}
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              {!isMuted ? (
                <div className="flex items-end gap-0.5 h-4">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-0.5 bg-gold rounded-full animate-equalizer"
                      style={{
                        animationDelay: `${i * 0.15}s`,
                        height: '3px'
                      }}
                    />
                  ))}
                </div>
              ) : null}
              <p className="text-white/70 text-xs truncate">
                {isMuted ? 'Sound off' : currentTrack.title}
              </p>
            </div>

            {/* Expand/Collapse Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-6 h-6 flex items-center justify-center text-white/50 hover:text-white transition-colors flex-shrink-0"
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              <svg className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
          </div>

          {/* Expanded View - Video Player */}
          <div className={`overflow-hidden transition-all duration-300 ease-out ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="px-2 pb-2 border-t border-white/10">
              {/* Track List */}
              <div className="py-2 space-y-1">
                <p className="text-white/50 text-[10px] uppercase tracking-wide mb-1">Select Track</p>
                {MUSIC_PLAYLIST.map((track, index) => (
                  <button
                    key={track.id}
                    onClick={() => setCurrentTrackIndex(index)}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-all ${
                      currentTrackIndex === index
                        ? 'bg-gold/20 text-gold'
                        : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {currentTrackIndex === index && !isMuted ? (
                      <div className="flex items-end gap-0.5 h-3 w-4">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="w-0.5 bg-gold rounded-full animate-equalizer"
                            style={{ animationDelay: `${i * 0.15}s`, height: '3px' }}
                          />
                        ))}
                      </div>
                    ) : (
                      <span className="text-[10px] w-4 text-center">{index + 1}</span>
                    )}
                    <span className="text-xs truncate flex-1">{track.title}</span>
                  </button>
                ))}
              </div>

              {/* Now Playing Video */}
              <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black/50 mt-2">
                <iframe
                  key={`${currentTrack.id}-${isMuted ? 'muted' : 'unmuted'}`}
                  width="100%"
                  height="100%"
                  src={youtubeUrl}
                  title="Memorial Hymns"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0"
                />
              </div>

              {/* Shuffle Control */}
              <div className="flex items-center justify-center mt-2">
                <button
                  onClick={shuffleTrack}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-colors"
                  title="Shuffle to random track"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/></svg>
                  <span className="text-[10px]">Shuffle</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden iframe for audio-only playback when collapsed */}
      {!isExpanded && (
        <iframe
          key={`hidden-${currentTrack.id}-${isMuted ? 'muted' : 'unmuted'}`}
          src={youtubeUrl}
          title="Memorial Hymns Audio"
          className="hidden"
          allow="autoplay"
        />
      )}
    </>
  );
};

// ============================================
// FEATURE 7: VIRTUAL MEMORIAL GARDEN
// ============================================

// Cloudflare Worker API - GLOBAL flower storage (visible to ALL visitors)
const GARDEN_API_URL = 'https://memorial-garden-api.ghwmelite.workers.dev';

// Default flowers - fallback if API fails
const DEFAULT_FLOWERS = [
  { id: 1, name: 'The Family', type: 'rose', plantedAt: '2025-01-01T00:00:00Z' },
  { id: 2, name: 'John Marion K. Hodges', type: 'lily', plantedAt: '2025-01-02T00:00:00Z' },
  { id: 3, name: 'Osborn M.D.K. Hodges', type: 'tulip', plantedAt: '2025-01-02T00:00:00Z' },
  { id: 4, name: 'Ria Hodges', type: 'sunflower', plantedAt: '2025-01-03T00:00:00Z' },
  { id: 5, name: 'Gayle Hodges', type: 'orchid', plantedAt: '2025-01-03T00:00:00Z' },
  { id: 6, name: 'With Love', type: 'rose', plantedAt: '2025-01-04T00:00:00Z' },
];

const MemorialGarden = ({ showToast }) => {
  const { t } = useLanguage();
  const [flowers, setFlowers] = useState(DEFAULT_FLOWERS);
  const [plantName, setPlantName] = useState('');
  const [isPlanting, setIsPlanting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newFlowerId, setNewFlowerId] = useState(null);
  const isSavingRef = useRef(false);

  const flowerTypes = {
    rose: { emoji: '🌹', color: 'from-red-400 to-red-600' },
    lily: { emoji: '🌸', color: 'from-pink-300 to-pink-500' },
    tulip: { emoji: '🌷', color: 'from-yellow-400 to-orange-500' },
    sunflower: { emoji: '🌻', color: 'from-yellow-400 to-yellow-600' },
    orchid: { emoji: '💐', color: 'from-purple-400 to-purple-600' },
  };

  // Fetch flowers from Cloudflare Worker API on mount
  useEffect(() => {
    const fetchFlowers = async () => {
      try {
        const response = await fetch(GARDEN_API_URL);
        if (response.ok) {
          const data = await response.json();
          if (data.flowers && Array.isArray(data.flowers)) {
            setFlowers(data.flowers);
          }
        }
      } catch (error) {
        console.log('Using default flowers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlowers();

    // Poll for new flowers every 30 seconds
    const pollInterval = setInterval(() => {
      if (!isSavingRef.current) {
        fetchFlowers();
      }
    }, 30000);

    return () => clearInterval(pollInterval);
  }, []);

  const plantFlower = async (e) => {
    e.preventDefault();
    if (!plantName.trim() || isPlanting) return;

    setIsPlanting(true);
    isSavingRef.current = true;

    const types = Object.keys(flowerTypes);
    const newFlower = {
      id: Date.now(),
      name: plantName.trim(),
      type: types[Math.floor(Math.random() * types.length)],
      plantedAt: new Date().toISOString(),
    };

    // Add new flower to the list
    const updatedFlowers = [...flowers, newFlower];
    setFlowers(updatedFlowers);
    setNewFlowerId(newFlower.id);

    try {
      // Save to Cloudflare Worker API (global storage)
      const response = await fetch(GARDEN_API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flowers: updatedFlowers })
      });

      if (!response.ok) {
        throw new Error('Failed to save');
      }

      console.log('Flower planted globally!');
      showToast('Your flower has been planted in the garden 🌸', 'success');
    } catch (error) {
      console.error('Error saving flower:', error);
      showToast('Flower planted locally (sync pending)', 'success');
    } finally {
      setPlantName('');
      setIsPlanting(false);
      isSavingRef.current = false;
      setTimeout(() => setNewFlowerId(null), 2000);
    }
  };

  // Dynamic sizing based on flower count
  const getFlowerSize = (count) => {
    if (count <= 12) return 'text-3xl sm:text-4xl';
    if (count <= 24) return 'text-2xl sm:text-3xl';
    if (count <= 48) return 'text-xl sm:text-2xl';
    if (count <= 96) return 'text-lg sm:text-xl';
    return 'text-base sm:text-lg';
  };

  // Dynamic grid columns based on flower count
  const getGridCols = (count) => {
    if (count <= 12) return 'grid-cols-4 sm:grid-cols-6 md:grid-cols-6 lg:grid-cols-6';
    if (count <= 24) return 'grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-8';
    if (count <= 48) return 'grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12';
    if (count <= 96) return 'grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-16';
    return 'grid-cols-10 sm:grid-cols-12 md:grid-cols-16 lg:grid-cols-20';
  };

  // Dynamic gap based on flower count
  const getGap = (count) => {
    if (count <= 12) return 'gap-4 sm:gap-5';
    if (count <= 24) return 'gap-3 sm:gap-4';
    if (count <= 48) return 'gap-2 sm:gap-3';
    if (count <= 96) return 'gap-1.5 sm:gap-2';
    return 'gap-1 sm:gap-1.5';
  };

  const flowerSize = getFlowerSize(flowers.length);
  const gridCols = getGridCols(flowers.length);
  const gridGap = getGap(flowers.length);

  return (
    <section className="py-16 sm:py-20 md:py-28 bg-gradient-to-b from-forest/5 via-cream to-cream relative overflow-hidden">
      {/* Garden background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-forest/20 to-transparent" />
      </div>
      <GoldenRainParticles intensity="light" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative">
        <SectionHeading
          eyebrow="Memorial Garden"
          title="Plant a Flower in Her Memory"
          subtitle="Each flower represents a life touched by Grandma's love and kindness"
        />

        {/* Garden Grid */}
        <AnimatedSection delay={200}>
          <div className="bg-gradient-to-b from-green-50/80 to-green-100/60 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 mb-8 sm:mb-12 shadow-soft border border-green-200/30 backdrop-blur-sm">
            {/* Loading state */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-forest border-t-transparent"></div>
                <span className="ml-3 text-forest">Loading garden...</span>
              </div>
            ) : (
              <>
                {/* Flower Grid - Responsive with dynamic sizing */}
                <div className={`grid ${gridCols} ${gridGap} justify-items-center`}>
                  {flowers.map((flower, index) => {
                    const type = flowerTypes[flower.type] || flowerTypes.rose;
                    const isNew = flower.id === newFlowerId;
                    return (
                      <div
                        key={flower.id}
                        className={`relative group cursor-pointer transition-all duration-300 ${isNew ? 'animate-bloom' : ''}`}
                        style={{ animationDelay: `${Math.min(index * 30, 1000)}ms` }}
                      >
                        <div className="animate-sway">
                          <div className={`${flowerSize} transform transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6`}>
                            {type.emoji}
                          </div>
                        </div>
                        {/* Tooltip - responsive positioning */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 sm:mb-2 px-2 py-1 bg-charcoal/90 text-white text-[10px] sm:text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none z-20 shadow-lg max-w-[120px] sm:max-w-none truncate">
                          {flower.name}
                        </div>
                        {/* Glow effect on hover */}
                        <div className="absolute inset-0 rounded-full bg-green-400/0 group-hover:bg-green-400/20 blur-md transition-all duration-300 -z-10"></div>
                      </div>
                    );
                  })}
                </div>

                {/* Garden stats - responsive */}
                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-green-200/50 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-forest">
                  <span className="flex items-center gap-2">
                    <span className="text-base sm:text-lg">🌱</span>
                    <span className="font-medium">{flowers.length}</span> flowers planted
                  </span>
                  <span className="hidden sm:inline text-green-300">•</span>
                  <span className="flex items-center gap-2">
                    <span className="text-base sm:text-lg">💚</span>
                    Growing with love
                  </span>
                </div>
              </>
            )}
          </div>
        </AnimatedSection>

        {/* Plant Form - Responsive */}
        <AnimatedSection delay={400}>
          <Card className="max-w-md mx-auto p-4 sm:p-6">
            <h3 className="font-display text-lg sm:text-xl text-charcoal mb-3 sm:mb-4 text-center">Plant Your Flower</h3>
            <form onSubmit={plantFlower} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={plantName}
                onChange={(e) => setPlantName(e.target.value)}
                placeholder="Your name"
                className="flex-1 px-4 py-3 rounded-xl border-2 border-warm-gray/20 focus:border-forest focus:ring-0 outline-none transition-colors bg-cream/50 text-sm sm:text-base"
                maxLength={30}
              />
              <Button type="submit" disabled={isPlanting || !plantName.trim()} className="w-full sm:w-auto justify-center">
                {isPlanting ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">🌱</span> Planting...
                  </span>
                ) : (
                  '🌸 Plant'
                )}
              </Button>
            </form>
            <p className="text-center text-xs text-warm-gray mt-3">Your flower will be visible to all visitors</p>
          </Card>
        </AnimatedSection>
      </div>
    </section>
  );
};

// ============================================
// FEATURE 9: MEMORY CONSTELLATION
// ============================================

const MemoryConstellation = () => {
  const { t } = useLanguage();
  const [selectedStar, setSelectedStar] = useState(null);
  const canvasRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const memories = [
    { id: 1, x: 20, y: 25, message: "A life of dedication and love", from: "The Family" },
    { id: 2, x: 45, y: 15, message: "Always caring for others", from: "John" },
    { id: 3, x: 70, y: 30, message: "Her smile lit up every room", from: "Osborn" },
    { id: 4, x: 30, y: 55, message: "The best grandmother", from: "Ria" },
    { id: 5, x: 55, y: 45, message: "Forever in our hearts", from: "Gayle" },
    { id: 6, x: 80, y: 60, message: "A true blessing to know", from: "Friends" },
    { id: 7, x: 15, y: 75, message: "Her legacy lives on", from: "Community" },
    { id: 8, x: 60, y: 75, message: "Rest in eternal peace", from: "With Love" },
  ];

  const connections = [
    [0, 1], [1, 2], [0, 3], [3, 4], [4, 5], [2, 5], [3, 6], [4, 7], [6, 7]
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );
    if (canvasRef.current) observer.observe(canvasRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-charcoal via-[#1a1a2e] to-charcoal relative overflow-hidden">
      {/* Starry background */}
      <div className="absolute inset-0">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-constellation"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              '--duration': `${2 + Math.random() * 4}s`,
              '--delay': `${Math.random() * 3}s`,
              opacity: 0.3 + Math.random() * 0.4,
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SectionHeading
          eyebrow="Memory Constellation"
          title="Stars of Remembrance"
          subtitle="Each star holds a precious memory of Grandma"
          light
        />

        <AnimatedSection delay={200}>
          <div
            ref={canvasRef}
            className="relative h-[400px] md:h-[500px] constellation-canvas rounded-3xl overflow-hidden"
          >
            {/* Connection lines SVG */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {isVisible && connections.map(([from, to], i) => (
                <line
                  key={i}
                  x1={memories[from].x}
                  y1={memories[from].y}
                  x2={memories[to].x}
                  y2={memories[to].y}
                  stroke="rgba(212,175,55,0.3)"
                  strokeWidth="0.2"
                  strokeDasharray="100"
                  className="animate-connect-line"
                  style={{ animationDelay: `${i * 200}ms` }}
                />
              ))}
            </svg>

            {/* Stars */}
            {memories.map((star, index) => (
              <div
                key={star.id}
                className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${selectedStar === star.id ? 'z-20 scale-150' : 'z-10 hover:scale-125'}`}
                style={{ left: `${star.x}%`, top: `${star.y}%` }}
                onClick={() => setSelectedStar(selectedStar === star.id ? null : star.id)}
              >
                <div className={`relative ${isVisible ? 'animate-constellation' : 'opacity-0'}`} style={{ '--delay': `${index * 200}ms`, '--duration': `${3 + Math.random() * 2}s` }}>
                  {/* Star glow */}
                  <div className="absolute inset-0 w-6 h-6 -m-1.5 bg-gold/30 rounded-full blur-md" />
                  {/* Star core */}
                  <div className="w-3 h-3 bg-gradient-to-br from-gold-light to-gold rounded-full shadow-gold-glow" />

                  {/* Expanded info */}
                  {selectedStar === star.id && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-8 w-48 p-4 bg-charcoal/95 backdrop-blur-sm rounded-xl border border-gold/30 text-center animate-fade-in">
                      <p className="text-white text-sm italic mb-2">"{star.message}"</p>
                      <p className="text-gold text-xs">— {star.from}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={400}>
          <p className="text-center text-white/50 mt-8">Click on a star to reveal its memory</p>
        </AnimatedSection>
      </div>
    </section>
  );
};

// ============================================
// FEATURE 10: LIVE VISITOR COUNTER
// ============================================

const VisitorGlobe = () => {
  const [visitorCount, setVisitorCount] = useState(0);
  const [recentVisitors, setRecentVisitors] = useState([]);

  useEffect(() => {
    // Simulate visitor count (in real implementation, this would come from analytics)
    const baseCount = parseInt(localStorage.getItem('memorial-visitor-count') || '47');
    const newCount = baseCount + Math.floor(Math.random() * 3);
    setVisitorCount(newCount);
    localStorage.setItem('memorial-visitor-count', newCount.toString());

    // Simulate recent visitors from different locations
    const locations = [
      { city: 'Accra', country: 'Ghana', x: 52, y: 48 },
      { city: 'London', country: 'UK', x: 48, y: 28 },
      { city: 'New York', country: 'USA', x: 25, y: 35 },
      { city: 'Lagos', country: 'Nigeria', x: 50, y: 47 },
      { city: 'Toronto', country: 'Canada', x: 22, y: 30 },
    ];
    setRecentVisitors(locations.slice(0, 3 + Math.floor(Math.random() * 2)));
  }, []);

  return (
    <div className="bg-gradient-to-br from-charcoal to-charcoal-light rounded-3xl p-6 md:p-8 text-white">
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Globe visualization */}
        <div className="relative w-48 h-48 flex-shrink-0">
          {/* Globe background */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-900/30 to-blue-950/50 animate-globe-pulse">
            {/* Continents approximation */}
            <div className="absolute inset-4 rounded-full border border-gold/20 opacity-50" />
            <div className="absolute inset-8 rounded-full border border-gold/10 opacity-30" />
          </div>

          {/* Visitor dots */}
          {recentVisitors.map((visitor, i) => (
            <div
              key={i}
              className="absolute"
              style={{ left: `${visitor.x}%`, top: `${visitor.y}%` }}
            >
              <div className="relative">
                <div className="absolute w-3 h-3 -m-1.5 bg-gold rounded-full animate-visitor-ping" style={{ animationDelay: `${i * 500}ms` }} />
                <div className="absolute w-2 h-2 -m-1 bg-gold rounded-full" />
              </div>
            </div>
          ))}

          {/* Center glow */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gold/10 blur-xl" />
          </div>
        </div>

        {/* Stats */}
        <div className="text-center md:text-left flex-1">
          <div className="mb-4">
            <span className="text-5xl md:text-6xl font-display text-shimmer">{visitorCount}</span>
            <p className="text-white/60 mt-1">people remembering Grandma</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-white/50">Recent visitors from:</p>
            <div className="flex flex-wrap gap-2">
              {recentVisitors.map((visitor, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-white/10 rounded-full text-xs animate-fade-in"
                  style={{ animationDelay: `${i * 200}ms` }}
                >
                  <span className="w-1.5 h-1.5 bg-gold rounded-full" />
                  {visitor.city}, {visitor.country}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// REUSABLE COMPONENTS
// ============================================

const AnimatedSection = ({ children, className = '', delay = 0, animation = 'fade-up' }) => {
  const [ref, isVisible] = useScrollReveal();

  const getAnimationStyles = () => {
    const baseTransition = `transition-all duration-700 ease-out`;
    const delayStyle = { transitionDelay: `${delay}ms` };

    switch (animation) {
      case 'fade-up':
        return {
          className: baseTransition,
          style: { ...delayStyle, opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(40px)' }
        };
      case 'fade-left':
        return {
          className: baseTransition,
          style: { ...delayStyle, opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateX(0)' : 'translateX(-60px)' }
        };
      case 'fade-right':
        return {
          className: baseTransition,
          style: { ...delayStyle, opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateX(0)' : 'translateX(60px)' }
        };
      case 'zoom':
        return {
          className: `${baseTransition} duration-500`,
          style: { ...delayStyle, opacity: isVisible ? 1 : 0, transform: isVisible ? 'scale(1)' : 'scale(0.85)' }
        };
      case 'rotate':
        return {
          className: baseTransition,
          style: { ...delayStyle, opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0) rotate(0deg)' : 'translateY(30px) rotate(-3deg)' }
        };
      case 'flip':
        return {
          className: `${baseTransition} perspective-1000`,
          style: { ...delayStyle, opacity: isVisible ? 1 : 0, transform: isVisible ? 'rotateX(0deg)' : 'rotateX(15deg)', transformOrigin: 'center bottom' }
        };
      default:
        return {
          className: baseTransition,
          style: { ...delayStyle, opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(40px)' }
        };
    }
  };

  const { className: animClass, style } = getAnimationStyles();

  return (
    <div ref={ref} className={`${animClass} ${className}`} style={style}>
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

const Card = ({ children, className = '', hover = true, delay = 0, tilt = false }) => {
  const [ref, isVisible] = useScrollReveal();
  const [tiltStyle, setTiltStyle] = useState({});

  const handleMouseMove = (e) => {
    if (!tilt) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    setTiltStyle({ transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)` });
  };

  const handleMouseLeave = () => {
    if (!tilt) return;
    setTiltStyle({});
  };

  return (
    <div
      ref={ref}
      className={`bg-white rounded-2xl shadow-soft transition-all duration-500 ${hover ? 'hover:shadow-elevated' : ''} ${tilt ? 'card-tilt' : hover ? 'hover:-translate-y-2' : ''} ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? (tiltStyle.transform || 'translateY(0)') : 'translateY(30px)',
        transitionDelay: `${delay}ms`,
        ...tiltStyle
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};

const Button = ({ children, variant = 'primary', className = '', onClick, disabled = false, type = 'button' }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-gold to-gold-dark text-white hover:shadow-gold-glow hover:scale-105',
    secondary: 'bg-white text-gold-dark border-2 border-gold hover:bg-gold hover:text-white hover:scale-105',
    outline: 'bg-transparent border-2 border-white text-white hover:bg-white hover:text-charcoal hover:scale-105'
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-8 py-3 rounded-full font-medium transition-all duration-300 btn-press active:scale-95 ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
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
  const [volume, setVolume] = useState(0.5);
  const [currentTrack, setCurrentTrack] = useState(0);
  const audioRef = useRef(null);

  const hasMusic = MUSIC_PLAYLIST.some(track => track.url);

  // Set volume when audio loads
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume, currentTrack]);

  const togglePlay = () => {
    if (!audioRef.current || !hasMusic) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.log('Playback failed:', err));
    }
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % MUSIC_PLAYLIST.length);
    setIsPlaying(false);
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + MUSIC_PLAYLIST.length) % MUSIC_PLAYLIST.length);
    setIsPlaying(false);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
    }
  };

  if (!hasMusic) return null;

  return (
    <div className={`fixed bottom-6 left-6 z-40 transition-all duration-300 ${isExpanded ? 'w-72' : 'w-14'}`}>
      {MUSIC_PLAYLIST[currentTrack]?.url && (
        <audio
          ref={audioRef}
          src={MUSIC_PLAYLIST[currentTrack].url}
          onEnded={nextTrack}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          preload="auto"
        />
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
              <button onClick={toggleMute} className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
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
    { id: 'lanterns', label: t('nav.lanterns') },
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
      <FloatingPhotoMemories />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className={`mb-8 transition-all duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-3 text-gold">
            <span className="h-px w-8 bg-current" />
            <span className="text-2xl">✦</span>
            <span className="h-px w-8 bg-current" />
          </div>
        </div>

        <div className={`mt-8 mb-10 transition-all duration-1000 delay-100 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative inline-block">
            {/* Outer pulsing ring */}
            <div className="absolute -inset-12 rounded-full border border-gold/10 animate-ping" style={{ animationDuration: '3s' }} />
            {/* Third ring - slow reverse spin with glow */}
            <div className="absolute -inset-10 rounded-full border border-gold/20 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '25s' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-gold rounded-full shadow-gold-glow" />
            </div>
            {/* Second ring - breathing effect */}
            <div className="absolute -inset-6 rounded-full border-2 border-gold/30 animate-pulse" style={{ animationDuration: '2s' }}>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-gold/60 rounded-full" />
              <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1.5 h-1.5 bg-gold/60 rounded-full" />
            </div>
            {/* Inner ring - elegant spin with orbiting dots */}
            <div className="absolute -inset-3 rounded-full border-2 border-gold/40 animate-spin-slow" style={{ animationDuration: '15s' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-gradient-to-br from-gold to-gold-dark rounded-full shadow-lg" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-gold/50 rounded-full" />
            </div>
            {/* Main photo container */}
            <div className="relative w-40 h-40 md:w-52 md:h-52 rounded-full overflow-hidden border-4 border-gold shadow-2xl shadow-gold/20">
              <img
                src="/photos/hero-2017.jpeg"
                alt="Josephine Worla Ameovi at Retiree Staff Meeting 2017"
                className="w-full h-full object-cover object-top scale-110"
              />
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
  const [lineRef, lineVisible] = useScrollReveal();

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

      {/* Floating decorative elements */}
      <div className="absolute top-20 right-10 w-32 h-32 opacity-10 animate-parallax-float">
        <div className="w-full h-full rounded-full border-2 border-gold" />
      </div>
      <div className="absolute bottom-40 left-10 w-24 h-24 opacity-10 animate-parallax-float" style={{ animationDelay: '-5s' }}>
        <div className="w-full h-full rounded-full border-2 border-burgundy" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SectionHeading eyebrow={t('life.eyebrow')} title={t('life.title')} subtitle={t('life.subtitle')} />

        <div className="relative" ref={lineRef}>
          {/* Animated timeline line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px hidden md:block overflow-hidden">
            <div
              className="w-full bg-gradient-to-b from-gold/0 via-gold to-gold/0 transition-all duration-1500 ease-out"
              style={{ height: lineVisible ? '100%' : '0%' }}
            />
          </div>

          <div className="space-y-12 md:space-y-0">
            {milestones.map((milestone, index) => (
              <AnimatedSection key={index} delay={index * 200} animation={index % 2 === 0 ? 'fade-left' : 'fade-right'}>
                <div className={`md:flex items-center gap-8 ${index % 2 === 0 ? '' : 'md:flex-row-reverse'} mb-12`}>
                  <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:pl-12'}`}>
                    <Card className="p-6 md:p-8 inline-block group" tilt>
                      <span className="text-4xl mb-4 block transform transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12">{milestone.icon}</span>
                      <span className="inline-block px-3 py-1 bg-gold/10 text-gold-dark rounded-full text-sm font-medium mb-3 transition-all duration-300 group-hover:bg-gold group-hover:text-white">{milestone.year}</span>
                      <h3 className="font-display text-2xl text-charcoal mb-3 transition-colors duration-300 group-hover:text-gold-dark">{milestone.title}</h3>
                      <p className="text-warm-gray leading-relaxed">{milestone.description}</p>
                    </Card>
                  </div>
                  <div className="hidden md:flex items-center justify-center relative">
                    <div className="absolute w-8 h-8 rounded-full bg-gold/20 animate-ripple" />
                    <div className="w-4 h-4 rounded-full bg-gold border-4 border-cream shadow-lg relative z-10 transition-transform duration-300 hover:scale-150" />
                  </div>
                  <div className="md:w-1/2" />
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>

        <AnimatedSection delay={800} animation="zoom">
          <div className="mt-20 text-center">
            <div className="inline-block relative group">
              <span className="absolute -top-6 -left-4 text-6xl text-gold/20 font-serif transition-all duration-500 group-hover:text-gold/40 group-hover:-translate-x-2 group-hover:-translate-y-2">"</span>
              <p className="text-2xl md:text-3xl font-display text-charcoal italic px-8 transition-colors duration-500 group-hover:text-gold-dark">{t('life.quote')}</p>
              <span className="absolute -bottom-8 -right-4 text-6xl text-gold/20 font-serif rotate-180 transition-all duration-500 group-hover:text-gold/40 group-hover:translate-x-2 group-hover:translate-y-2">"</span>
            </div>
            <p className="text-warm-gray mt-8">— {t('life.quoteAuthor')}</p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

// ============================================
// FAMILY TREE SECTION - SPECTACULAR EDITION
// ============================================

// Floating Golden Leaf Particle
const GoldenLeaf = ({ delay, duration, startX }) => (
  <div
    className="absolute w-3 h-3 pointer-events-none"
    style={{
      left: `${startX}%`,
      bottom: '-20px',
      animation: `leaf-float ${duration}s ease-in-out infinite`,
      animationDelay: `${delay}s`,
    }}
  >
    <svg viewBox="0 0 24 24" className="w-full h-full text-gold/60 animate-spin-slow" style={{ animationDuration: `${duration * 2}s` }}>
      <path fill="currentColor" d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"/>
    </svg>
  </div>
);

// Ethereal Orb Component for Family Members
const FamilyOrb = ({ member, size = 'lg', onClick, isMatriarch = false, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    xl: 'w-36 h-36 md:w-44 md:h-44',
    lg: 'w-24 h-24 md:w-28 md:h-28',
    md: 'w-20 h-20 md:w-24 md:h-24',
    sm: 'w-16 h-16 md:w-20 md:h-20'
  };

  const colorSchemes = {
    gold: {
      gradient: 'from-amber-300 via-yellow-400 to-amber-500',
      glow: 'shadow-[0_0_60px_rgba(212,175,55,0.5)]',
      hoverGlow: 'shadow-[0_0_80px_rgba(212,175,55,0.8)]',
      ring: 'ring-amber-300/50',
      bg: 'bg-gradient-to-br from-amber-50 to-yellow-100'
    },
    burgundy: {
      gradient: 'from-rose-400 via-red-500 to-rose-600',
      glow: 'shadow-[0_0_40px_rgba(139,21,56,0.4)]',
      hoverGlow: 'shadow-[0_0_60px_rgba(139,21,56,0.6)]',
      ring: 'ring-rose-300/50',
      bg: 'bg-gradient-to-br from-rose-50 to-pink-100'
    },
    rose: {
      gradient: 'from-pink-300 via-rose-400 to-pink-500',
      glow: 'shadow-[0_0_30px_rgba(236,72,153,0.3)]',
      hoverGlow: 'shadow-[0_0_50px_rgba(236,72,153,0.5)]',
      ring: 'ring-pink-300/50',
      bg: 'bg-gradient-to-br from-pink-50 to-rose-100'
    }
  };

  const colors = colorSchemes[member.color] || colorSchemes.gold;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col items-center focus:outline-none"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Outer pulsing rings - only for matriarch */}
      {isMatriarch && (
        <>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`${sizeClasses[size]} rounded-full border-2 border-gold/20 animate-ping`} style={{ animationDuration: '3s' }} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`${sizeClasses[size]} scale-125 rounded-full border border-gold/10 animate-ping`} style={{ animationDuration: '4s', animationDelay: '1s' }} />
          </div>
        </>
      )}

      {/* Ethereal glow background */}
      <div className={`absolute rounded-full blur-2xl transition-all duration-700 ${sizeClasses[size]} ${isHovered ? 'scale-150 opacity-80' : 'scale-100 opacity-40'}`}
        style={{ background: `radial-gradient(circle, ${member.color === 'gold' ? 'rgba(212,175,55,0.6)' : member.color === 'burgundy' ? 'rgba(139,21,56,0.5)' : 'rgba(236,72,153,0.4)'} 0%, transparent 70%)` }}
      />

      {/* Main orb */}
      <div className={`relative ${sizeClasses[size]} rounded-full transition-all duration-500 ${isHovered ? `scale-110 ${colors.hoverGlow}` : colors.glow}`}>
        {/* Gradient border ring */}
        <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${colors.gradient} p-[3px] ${isMatriarch ? 'animate-spin-slow' : ''}`} style={{ animationDuration: '20s' }}>
          <div className={`w-full h-full rounded-full ${colors.bg} flex items-center justify-center overflow-hidden`}>
            {/* Inner shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-transparent to-white/20 animate-shimmer" />

            {/* Crown/Icon for matriarch, initials for others */}
            {isMatriarch ? (
              <div className="relative">
                <span className="text-4xl md:text-5xl filter drop-shadow-lg">👑</span>
                <div className="absolute inset-0 animate-pulse" style={{ animationDuration: '2s' }}>
                  <span className="text-4xl md:text-5xl opacity-50 blur-sm">👑</span>
                </div>
              </div>
            ) : (
              <span className={`font-display font-bold ${size === 'lg' || size === 'md' ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'} ${member.color === 'burgundy' ? 'text-burgundy' : 'text-pink-500'}`}>
                {member.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </span>
            )}
          </div>
        </div>

        {/* Floating particles around orb on hover */}
        {isHovered && (
          <div className="absolute inset-0">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-gold animate-orbit"
                style={{
                  top: '50%',
                  left: '50%',
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: '2s',
                  transform: `rotate(${i * 60}deg) translateX(${size === 'xl' ? '80px' : size === 'lg' ? '60px' : '50px'})`
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Name and title */}
      <div className="mt-4 text-center transition-all duration-300 transform group-hover:-translate-y-1">
        <p className={`font-display ${isMatriarch ? 'text-xl md:text-2xl' : 'text-sm md:text-base'} text-charcoal group-hover:text-gold transition-colors duration-300 max-w-[150px]`}>
          {member.name}
        </p>
        {member.relation && (
          <p className={`text-xs md:text-sm ${member.color === 'gold' ? 'text-gold' : member.color === 'burgundy' ? 'text-burgundy' : 'text-pink-500'} mt-1 opacity-80`}>
            {member.relation}
          </p>
        )}
      </div>
    </button>
  );
};

// Animated Branch Connection
const TreeBranch = ({ isVisible, delay = 0, direction = 'down', length = 'md' }) => {
  const lengths = { sm: 'h-8', md: 'h-16', lg: 'h-24' };

  if (direction === 'horizontal') {
    return (
      <div className="relative h-1 w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/60 to-transparent transition-all duration-1000 ease-out"
          style={{
            transform: isVisible ? 'scaleX(1)' : 'scaleX(0)',
            transitionDelay: `${delay}ms`
          }}
        />
        {/* Animated pulse traveling along the branch */}
        {isVisible && (
          <div
            className="absolute top-0 h-full w-8 bg-gradient-to-r from-transparent via-white/80 to-transparent animate-branch-pulse"
            style={{ animationDelay: `${delay + 500}ms` }}
          />
        )}
      </div>
    );
  }

  return (
    <div className={`relative w-1 ${lengths[length]} overflow-hidden`}>
      {/* Main branch line */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-gold via-gold/70 to-gold/40 transition-all duration-1000 ease-out origin-top"
        style={{
          transform: isVisible ? 'scaleY(1)' : 'scaleY(0)',
          transitionDelay: `${delay}ms`
        }}
      />
      {/* Glowing core */}
      <div
        className="absolute inset-x-0 top-0 w-full bg-gradient-to-b from-white/80 via-gold/50 to-transparent transition-all duration-1000 ease-out origin-top"
        style={{
          transform: isVisible ? 'scaleY(1)' : 'scaleY(0)',
          transitionDelay: `${delay + 200}ms`,
          filter: 'blur(2px)'
        }}
      />
    </div>
  );
};

const FamilyTreeSection = () => {
  const { t } = useLanguage();
  const [selectedMember, setSelectedMember] = useState(null);
  const [sectionRef, isVisible] = useScrollReveal();
  const [showTree, setShowTree] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => setShowTree(true), 300);
    }
  }, [isVisible]);

  const getGrandchildrenForParent = (parentId) => {
    return FAMILY_DATA.grandchildren.filter(gc => gc.parentId === parentId);
  };

  return (
    <section id="family" className="py-24 md:py-32 bg-gradient-to-b from-cream via-white to-cream relative overflow-hidden" ref={sectionRef}>
      {/* Magical Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Large ethereal circles */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-gradient-radial from-gold/10 via-gold/5 to-transparent animate-pulse-soft" />
        <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] rounded-full bg-gradient-radial from-burgundy/10 via-burgundy/5 to-transparent animate-pulse-soft" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-radial from-gold/5 via-transparent to-transparent" />

        {/* Floating golden leaves */}
        {[...Array(12)].map((_, i) => (
          <GoldenLeaf key={i} delay={i * 2} duration={15 + Math.random() * 10} startX={5 + i * 8} />
        ))}

        {/* Light rays from top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-gold/5 via-transparent to-transparent" style={{ clipPath: 'polygon(40% 0%, 60% 0%, 80% 100%, 20% 100%)' }} />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-gold/10 text-gold rounded-full text-sm font-medium mb-4 animate-shimmer">
              {t('family.eyebrow')}
            </span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-charcoal mb-4">
              {t('family.title')}
            </h2>
            <p className="text-warm-gray text-lg max-w-2xl mx-auto">{t('family.subtitle')}</p>
          </div>
        </AnimatedSection>

        {/* The Magnificent Tree */}
        <div className="relative flex flex-col items-center">

          {/* MATRIARCH - The Crown of the Tree */}
          <AnimatedSection animation="zoom" delay={200}>
            <div className="relative mb-4">
              {/* Decorative crown rays */}
              <div className="absolute -inset-8 flex items-center justify-center opacity-60">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-24 bg-gradient-to-t from-transparent via-gold/30 to-gold/60 origin-bottom"
                    style={{
                      transform: `rotate(${i * 45}deg)`,
                      animation: showTree ? `ray-pulse 3s ease-in-out infinite` : 'none',
                      animationDelay: `${i * 0.2}s`
                    }}
                  />
                ))}
              </div>

              <FamilyOrb
                member={FAMILY_DATA.matriarch}
                size="xl"
                onClick={() => setSelectedMember(FAMILY_DATA.matriarch)}
                isMatriarch={true}
              />
            </div>

            {/* Matriarch quote */}
            <p className="text-center text-warm-gray/80 italic text-sm max-w-xs mx-auto mt-2 animate-fade-in" style={{ animationDelay: '1s' }}>
              "{FAMILY_DATA.matriarch.quote}"
            </p>
          </AnimatedSection>

          {/* Main trunk from matriarch */}
          <TreeBranch isVisible={showTree} delay={600} direction="down" length="lg" />

          {/* Children Generation Label */}
          <AnimatedSection delay={800}>
            <div className="my-6 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-px bg-gradient-to-r from-transparent via-burgundy/30 to-transparent" />
              </div>
              <span className="relative inline-block px-6 py-2 bg-burgundy/10 text-burgundy rounded-full text-sm font-semibold backdrop-blur-sm border border-burgundy/20">
                {t('family.children')}
              </span>
            </div>
          </AnimatedSection>

          {/* CHILDREN ROW */}
          <div className="relative w-full max-w-3xl">
            {/* Horizontal branch connecting children */}
            <div className="absolute top-0 left-1/4 right-1/4 h-1">
              <TreeBranch isVisible={showTree} delay={900} direction="horizontal" />
            </div>

            <div className="flex justify-center gap-24 md:gap-32 pt-6">
              {FAMILY_DATA.children.map((child, index) => {
                const childGrandchildren = getGrandchildrenForParent(child.id);

                return (
                  <div key={child.id} className="flex flex-col items-center">
                    {/* Vertical branch to child */}
                    <TreeBranch isVisible={showTree} delay={1000 + index * 150} direction="down" length="sm" />

                    <AnimatedSection delay={1100 + index * 150}>
                      <FamilyOrb
                        member={child}
                        size="lg"
                        onClick={() => setSelectedMember(child)}
                        delay={index * 100}
                      />
                    </AnimatedSection>

                    {/* Grandchildren under this child */}
                    {childGrandchildren.length > 0 && (
                      <div className="flex flex-col items-center mt-4">
                        <TreeBranch isVisible={showTree} delay={1400 + index * 150} direction="down" length="md" />

                        {/* Grandchildren row */}
                        <div className="relative">
                          {childGrandchildren.length > 1 && (
                            <div className="absolute top-0 left-0 right-0 h-1">
                              <TreeBranch isVisible={showTree} delay={1500 + index * 150} direction="horizontal" />
                            </div>
                          )}

                          <div className="flex gap-8 pt-4">
                            {childGrandchildren.map((grandchild, gcIndex) => (
                              <div key={grandchild.id} className="flex flex-col items-center">
                                <TreeBranch isVisible={showTree} delay={1600 + gcIndex * 100} direction="down" length="sm" />
                                <AnimatedSection delay={1700 + gcIndex * 100}>
                                  <FamilyOrb
                                    member={grandchild}
                                    size="md"
                                    onClick={() => setSelectedMember(grandchild)}
                                    delay={gcIndex * 50}
                                  />
                                </AnimatedSection>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Grandchildren Generation Label */}
          <AnimatedSection delay={1800}>
            <div className="mt-10 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-px bg-gradient-to-r from-transparent via-pink-400/30 to-transparent" />
              </div>
              <span className="relative inline-block px-6 py-2 bg-pink-100 text-pink-600 rounded-full text-sm font-semibold backdrop-blur-sm border border-pink-200">
                {t('family.grandchildren')}
              </span>
            </div>
          </AnimatedSection>
        </div>

        {/* Member Detail Modal */}
        {selectedMember && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/90 backdrop-blur-md animate-fade-in"
            onClick={() => setSelectedMember(null)}
          >
            {/* Floating particles in modal */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-gold/60 animate-float-up-fade"
                  style={{
                    left: `${Math.random() * 100}%`,
                    bottom: '-10px',
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${5 + Math.random() * 5}s`
                  }}
                />
              ))}
            </div>

            <div
              className="relative bg-gradient-to-br from-white via-cream to-white rounded-3xl p-8 md:p-10 max-w-md w-full shadow-2xl animate-scale-in border border-gold/20"
              onClick={e => e.stopPropagation()}
            >
              {/* Decorative corner ornaments */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-gold/30 rounded-tl-lg" />
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-gold/30 rounded-tr-lg" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-gold/30 rounded-bl-lg" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-gold/30 rounded-br-lg" />

              <div className="text-center">
                {/* Large orb display */}
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 w-32 h-32 rounded-full bg-gold/20 blur-2xl animate-pulse" />
                  <div className={`relative w-32 h-32 rounded-full bg-gradient-to-br ${selectedMember.color === 'gold' ? 'from-amber-300 via-yellow-400 to-amber-500' : selectedMember.color === 'burgundy' ? 'from-rose-400 via-red-500 to-rose-600' : 'from-pink-300 via-rose-400 to-pink-500'} p-1 shadow-[0_0_40px_rgba(212,175,55,0.4)]`}>
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-cream to-white flex items-center justify-center">
                      {selectedMember.color === 'gold' ? (
                        <span className="text-5xl">👑</span>
                      ) : (
                        <span className={`font-display text-4xl font-bold ${selectedMember.color === 'burgundy' ? 'text-burgundy' : 'text-pink-500'}`}>
                          {selectedMember.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <h3 className="font-display text-2xl md:text-3xl text-charcoal mb-2">{selectedMember.name}</h3>

                {selectedMember.title && (
                  <p className="text-gold font-medium mb-1">{selectedMember.title}</p>
                )}

                {selectedMember.relation && (
                  <p className="text-warm-gray">{selectedMember.relation}</p>
                )}

                {selectedMember.years && (
                  <p className="text-warm-gray/80 text-sm mt-2 font-medium">{selectedMember.years}</p>
                )}

                {selectedMember.quote && (
                  <p className="text-warm-gray/70 italic text-sm mt-4 px-4 py-3 bg-gold/5 rounded-xl">
                    "{selectedMember.quote}"
                  </p>
                )}

                <button
                  onClick={() => setSelectedMember(null)}
                  className="mt-8 px-8 py-3 bg-gradient-to-r from-gold to-gold-dark text-white rounded-full font-semibold hover:shadow-gold-glow hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  {t('common.close')}
                </button>
              </div>
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
  const [timelineRef, timelineVisible] = useScrollReveal();

  const decades = [
    {
      period: '1970s',
      photos: [
        { id: 1, src: '/photos/barclays-1971.jpeg', label: 'At Barclays, Kimberly Ave', year: '1971', story: 'Beginning her career at Barclays Bank, Kimberly Avenue branch.' },
        { id: 2, src: '/photos/labadi-1975.jpeg', label: 'Labadi Estate', year: '1975', story: 'A cherished moment at Labadi Estate.' },
        { id: 3, src: '/photos/portrait-1976.jpeg', label: 'Portrait', year: 'Nov 1976', story: 'A beautiful portrait capturing her grace.' },
        { id: 4, src: '/photos/wedding-1970s.jpeg', label: 'At a Wedding', year: '1970s', story: 'Celebrating love at a wedding ceremony.' }
      ]
    },
    {
      period: '1977-79',
      photos: [
        { id: 5, src: '/photos/pregnant-john-1977.jpeg', label: '6 Months with John', year: '1977', story: 'Expecting her first son, John Marion.' },
        { id: 6, src: '/photos/portrait-1979.jpeg', label: 'Portrait', year: '1979', story: 'Radiant beauty captured in this portrait.' }
      ]
    },
    {
      period: '1980s',
      photos: [
        { id: 7, src: '/photos/labadi-1981.jpeg', label: 'Labadi Estate', year: '1981', story: 'A wonderful day at Labadi Estate.' },
        { id: 8, src: '/photos/pregnant-oz.jpeg', label: '5 Months with Oz', year: '1980s', story: 'Expecting her second son, Osborn.' },
        { id: 9, src: '/photos/with-baby-oz-1985.jpeg', label: 'With Baby Oz', year: '1985', story: 'Precious moments with baby Osborn.' }
      ]
    },
    {
      period: '2000s-2020s',
      photos: [
        { id: 10, src: '/photos/with-john-2010.jpeg', label: 'With John', year: '2010', story: 'A loving moment with her son John.' },
        { id: 11, src: '/photos/with-ozzy-2010.jpeg', label: 'With Ozzy', year: '2010', story: 'A treasured moment with her son Osborn.' },
        { id: 12, src: '/photos/cultural-day-barclays.jpeg', label: 'Cultural Day at Barclays', year: '2000s', story: 'Celebrating Ghanaian culture at Barclays Bank.' },
        { id: 13, src: '/photos/long-service-award.jpeg', label: 'Long Service Award', year: '2000s', story: 'Recognized for her years of dedicated service.' },
        { id: 14, src: '/photos/portrait-2023.jpeg', label: 'Golden Years', year: '2023', story: 'A beautiful portrait in her golden years.' }
      ]
    }
  ];

  return (
    <section id="timeline" className="py-24 md:py-32 bg-cream relative overflow-hidden">
      {/* Decorative floating elements */}
      <div className="absolute top-10 left-10 w-20 h-20 border border-gold/10 rounded-lg rotate-12 animate-parallax-float" />
      <div className="absolute bottom-20 right-20 w-16 h-16 border border-burgundy/10 rounded-lg -rotate-12 animate-parallax-float" style={{ animationDelay: '-7s' }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={t('gallery.eyebrow')} title={t('gallery.title')} subtitle={t('gallery.subtitle')} />

        {/* Horizontal Timeline */}
        <div className="relative" ref={timelineRef}>
          {/* Animated timeline line */}
          <div className="absolute top-6 left-0 right-0 h-1 hidden md:block overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold/20 via-gold to-gold/20 animate-shimmer transition-all duration-1000"
              style={{ width: timelineVisible ? '100%' : '0%' }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {decades.map((decade, index) => (
              <AnimatedSection key={decade.period} delay={index * 150} animation="fade-up">
                <div className="text-center mb-4">
                  <span className="inline-block px-4 py-2 bg-gold text-white rounded-full text-sm font-bold relative z-10 shadow-gold-glow magnetic-hover transition-all duration-300 hover:scale-110">
                    {decade.period}
                  </span>
                </div>
                <div className="space-y-4 perspective-1000">
                  {decade.photos.map((photo, photoIndex) => (
                    <div
                      key={photo.id}
                      onClick={() => setSelectedPhoto(photo)}
                      className="relative aspect-[3/4] bg-gradient-to-br from-white to-warm-white rounded-2xl overflow-hidden cursor-pointer group shadow-soft hover:shadow-elevated transition-all duration-500 photo-hover transform-style-3d hover:rotate-y-[-3deg] hover:rotate-x-[3deg] hover:scale-105"
                      style={{
                        transitionDelay: `${photoIndex * 100}ms`,
                        transformStyle: 'preserve-3d',
                      }}
                      onMouseMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        const centerX = rect.width / 2;
                        const centerY = rect.height / 2;
                        const rotateX = (y - centerY) / 15;
                        const rotateY = (centerX - x) / 15;
                        e.currentTarget.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
                      }}
                    >
                      {/* 3D Depth layer - shadow behind */}
                      <div className="absolute inset-0 bg-charcoal/30 rounded-2xl transform translate-z-[-20px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ transform: 'translateZ(-20px)' }} />

                      {/* Actual photo */}
                      <img
                        src={photo.src}
                        alt={photo.label}
                        className="w-full h-full object-cover object-top transition-transform duration-700"
                      />

                      {/* Subtle gradient overlay for text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />

                      {/* Label overlay - always visible at bottom */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                        <p className="text-sm font-medium drop-shadow-lg">{photo.label}</p>
                        <p className="text-xs text-gold drop-shadow-lg">{photo.year}</p>
                      </div>

                      {/* Corner decorations on hover */}
                      <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-gold opacity-0 group-hover:opacity-100 transition-all duration-500 transform -translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0" />
                      <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-gold opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0" />
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>

        <AnimatedSection delay={700} animation="fade-up">
          <p className="text-center text-warm-gray mt-12 hover:text-gold transition-colors duration-300">{t('gallery.addNote')}</p>
        </AnimatedSection>
      </div>

      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/90 backdrop-blur-lg animate-fade-in" onClick={() => setSelectedPhoto(null)}>
          <div className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.label}
                className="w-full max-h-[70vh] object-contain bg-charcoal"
              />
            </div>
            <div className="p-6 bg-gradient-to-b from-white to-cream">
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-block px-3 py-1 bg-gold text-white rounded-full text-sm font-medium">
                  {selectedPhoto.year}
                </span>
                <h3 className="text-xl font-display text-charcoal">{selectedPhoto.label}</h3>
              </div>
              <p className="text-warm-gray leading-relaxed">{selectedPhoto.story}</p>
            </div>
            <button onClick={() => setSelectedPhoto(null)} className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 text-charcoal hover:bg-gold hover:text-white hover:rotate-90 transition-all duration-300 shadow-lg">
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

// Formspree endpoint for candles (backup/notification)
const FORMSPREE_CANDLES = 'https://formspree.io/f/xwpkgjkq';

// Cloudflare Worker API - GLOBAL candle storage (visible to ALL visitors)
const CANDLES_API_URL = 'https://memorial-candles-api.ghwmelite.workers.dev';

// Default candles - fallback if API fails
const DEFAULT_CANDLES = [
  { id: 1, name: "The Family", litAt: "2025-01-01T00:00:00Z" },
  { id: 2, name: "John Marion K. Hodges", litAt: "2025-01-02T00:00:00Z" },
  { id: 3, name: "Osborn M.D.K. Hodges", litAt: "2025-01-02T00:00:00Z" },
  { id: 4, name: "Ria Hodges", litAt: "2025-01-03T00:00:00Z" },
  { id: 5, name: "Gayle Hodges", litAt: "2025-01-03T00:00:00Z" },
  { id: 6, name: "With Love and Prayers", litAt: "2025-01-04T00:00:00Z" },
  { id: 7, name: "Forever Remembered", litAt: "2025-01-04T00:00:00Z" },
  { id: 8, name: "Rest In Peace", litAt: "2025-01-05T00:00:00Z" }
];

// Animated Candle Component - Now with dynamic sizing
const AnimatedCandle = ({ candle, index, isNew, size = 'normal' }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Size configurations based on total candle count
  const sizeConfig = {
    large: { wrapper: 'w-14 h-24', flame: 'w-5 h-8', body: 'w-7 h-16', base: 'w-10', text: 'text-sm' },
    normal: { wrapper: 'w-12 h-20', flame: 'w-4 h-7', body: 'w-6 h-14', base: 'w-8', text: 'text-sm' },
    medium: { wrapper: 'w-10 h-16', flame: 'w-3 h-5', body: 'w-5 h-11', base: 'w-7', text: 'text-xs' },
    small: { wrapper: 'w-8 h-14', flame: 'w-2.5 h-4', body: 'w-4 h-9', base: 'w-6', text: 'text-xs' },
    tiny: { wrapper: 'w-6 h-10', flame: 'w-2 h-3', body: 'w-3 h-7', base: 'w-5', text: 'text-[10px]' },
  };

  const s = sizeConfig[size] || sizeConfig.normal;

  return (
    <div
      className={`text-center group cursor-pointer transform transition-all duration-700 ${isNew ? 'animate-candle-appear' : ''}`}
      style={{ animationDelay: `${index * 30}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={`${candle.name} - ${candle.litAt ? new Date(candle.litAt).toLocaleDateString() : ''}`}
    >
      <div className={`relative mx-auto ${s.wrapper}`}>
        {/* Outer glow - large ambient */}
        <div className={`absolute -top-8 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full blur-2xl transition-all duration-500 ${isHovered ? 'bg-gold/50 scale-150' : 'bg-gold/20'}`} />

        {/* Middle glow - medium */}
        <div className={`absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full blur-xl transition-all duration-300 ${isHovered ? 'bg-orange-400/60' : 'bg-orange-400/30'}`} />

        {/* Inner glow - intense */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-4 h-4 bg-yellow-300/50 rounded-full blur-md animate-pulse" style={{ animationDuration: '1.5s' }} />

        {/* Flame outer */}
        <div className={`absolute -top-6 left-1/2 -translate-x-1/2 ${s.flame} bg-gradient-to-t from-orange-500 via-orange-400 to-yellow-300 rounded-full animate-candle-flicker opacity-90 blur-[1px]`} />

        {/* Flame middle */}
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-3 h-5 bg-gradient-to-t from-orange-400 via-yellow-400 to-yellow-200 rounded-full animate-candle-flicker-alt opacity-95" />

        {/* Flame core */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-2 h-3 bg-gradient-to-t from-yellow-300 via-yellow-100 to-white rounded-full animate-candle-flicker-fast" />

        {/* Flame tip - white hot */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-1 h-2 bg-white rounded-full opacity-90 animate-candle-flicker-fast" />

        {/* Wick */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-charcoal rounded-full" />

        {/* Candle body - wax drips effect */}
        <div className={`absolute top-2 left-1/2 -translate-x-1/2 ${s.body} bg-gradient-to-b from-cream via-warm-white to-cream/90 rounded-t-sm rounded-b-lg shadow-lg overflow-hidden`}>
          {/* Subtle shimmer */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>

        {/* Candle base/holder */}
        <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 ${s.base} h-1.5 bg-gradient-to-b from-gold to-gold-dark rounded-sm shadow-md`} />

        {/* Reflection on surface */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-2 bg-gold/10 rounded-full blur-md" />
      </div>

      {/* Name with elegant reveal */}
      <div className={`mt-3 transition-all duration-500 ${isHovered ? 'transform -translate-y-1' : ''}`}>
        <p className={`${s.text} font-medium truncate transition-all duration-300 max-w-full px-1 ${isHovered ? 'text-gold' : 'text-white/70'}`}>
          {candle.name}
        </p>
      </div>
    </div>
  );
};

// Floating Ember Particle
const FloatingEmber = ({ delay }) => {
  const randomX = Math.random() * 100;
  const randomDuration = 3 + Math.random() * 4;
  const randomSize = 2 + Math.random() * 4;

  return (
    <div
      className="absolute w-1 h-1 rounded-full animate-float-ember pointer-events-none"
      style={{
        left: `${randomX}%`,
        bottom: '20%',
        width: `${randomSize}px`,
        height: `${randomSize}px`,
        background: `radial-gradient(circle, rgba(255,200,100,1) 0%, rgba(255,150,50,0.8) 50%, rgba(255,100,0,0) 100%)`,
        animationDelay: `${delay}s`,
        animationDuration: `${randomDuration}s`,
        filter: 'blur(0.5px)',
        boxShadow: '0 0 6px rgba(255,180,50,0.8)'
      }}
    />
  );
};

const CandleLightingSection = ({ showToast }) => {
  const { t } = useLanguage();
  const [candles, setCandles] = useState(DEFAULT_CANDLES);
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newCandleId, setNewCandleId] = useState(null);
  const [showLightingEffect, setShowLightingEffect] = useState(false);
  const isSavingRef = useRef(false);

  const { ref: countRef, count: animatedCount } = useCountUp(candles.length, 2000);

  // Determine candle size based on total count
  const getCandleSize = (totalCount) => {
    if (totalCount <= 8) return 'large';
    if (totalCount <= 16) return 'normal';
    if (totalCount <= 32) return 'medium';
    if (totalCount <= 64) return 'small';
    return 'tiny';
  };

  // Get grid columns based on candle count
  const getGridCols = (totalCount) => {
    if (totalCount <= 8) return 'grid-cols-4 sm:grid-cols-4 md:grid-cols-8';
    if (totalCount <= 16) return 'grid-cols-4 sm:grid-cols-6 md:grid-cols-8';
    if (totalCount <= 32) return 'grid-cols-5 sm:grid-cols-8 md:grid-cols-10';
    if (totalCount <= 64) return 'grid-cols-6 sm:grid-cols-10 md:grid-cols-12';
    return 'grid-cols-8 sm:grid-cols-12 md:grid-cols-16';
  };

  // Fetch candles from Cloudflare Worker API on mount
  useEffect(() => {
    const fetchCandles = async () => {
      try {
        const response = await fetch(CANDLES_API_URL);
        if (response.ok) {
          const data = await response.json();
          if (data.candles && Array.isArray(data.candles)) {
            setCandles(data.candles);
          }
        }
      } catch (error) {
        console.log('Using default candles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandles();

    // Poll for new candles every 30 seconds
    const pollInterval = setInterval(() => {
      if (!isSavingRef.current) {
        fetchCandles();
      }
    }, 30000);

    return () => clearInterval(pollInterval);
  }, []);

  const lightCandle = async (e) => {
    e.preventDefault();
    if (!name.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setShowLightingEffect(true);
    isSavingRef.current = true;

    const newCandle = {
      id: Date.now(),
      name: name.trim(),
      litAt: new Date().toISOString()
    };

    // Add new candle to the list (at the beginning)
    const updatedCandles = [newCandle, ...candles];
    setCandles(updatedCandles);
    setNewCandleId(newCandle.id);

    try {
      // Save to Cloudflare Worker API (global storage)
      const response = await fetch(CANDLES_API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candles: updatedCandles })
      });

      if (!response.ok) {
        throw new Error('Failed to save');
      }

      console.log('Candle saved globally!');

      // Also send email notification via Formspree
      fetch(FORMSPREE_CANDLES, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCandle.name,
          litAt: newCandle.litAt,
          _subject: `🕯️ New candle lit by ${newCandle.name}`
        })
      }).catch(() => {});

    } catch (error) {
      console.error('Failed to save candle:', error);
    }

    // Complete the UI animation
    setTimeout(() => {
      setName('');
      setIsSubmitting(false);
      setShowLightingEffect(false);
      isSavingRef.current = false;
      showToast(t('candles.thankYou'), 'success');
      setTimeout(() => setNewCandleId(null), 2000);
    }, 1500);
  };

  const candleSize = getCandleSize(candles.length);
  const gridCols = getGridCols(candles.length);

  return (
    <section id="candles" className="py-24 md:py-32 bg-gradient-to-b from-charcoal via-[#1a1520] to-charcoal-light text-white relative overflow-hidden">
      {/* Deep space gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />

      {/* Animated starry background - more stars with varying sizes */}
      <div className="absolute inset-0">
        {Array.from({ length: 80 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              background: i % 3 === 0 ? '#D4AF37' : i % 3 === 1 ? '#ffffff' : '#FFD700',
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              opacity: 0.3 + Math.random() * 0.5,
              boxShadow: `0 0 ${2 + Math.random() * 4}px currentColor`
            }}
          />
        ))}
      </div>

      {/* Floating embers */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <FloatingEmber key={i} delay={i * 0.5} />
        ))}
      </div>

      {/* Large ambient light orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/5 rounded-full blur-[80px] animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/3 rounded-full blur-[120px]" />

      {/* Lighting effect overlay */}
      {showLightingEffect && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div className="absolute inset-0 bg-gold/20 animate-flash" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white rounded-full blur-3xl animate-ping" />
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SectionHeading eyebrow={t('candles.eyebrow')} title={t('candles.title')} subtitle={t('candles.subtitle')} light />

        {/* Central Feature Candle */}
        <AnimatedSection animation="zoom">
          <div className="flex justify-center mb-12">
            <div className="relative">
              {/* Massive glow for central candle */}
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 bg-gold/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '2s' }} />
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-28 h-28 bg-orange-400/40 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '1.5s' }} />

              {/* Large decorative candle */}
              <div className="relative w-20 h-32">
                {/* Flame layers */}
                <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-8 h-14 bg-gradient-to-t from-orange-500 via-orange-400 to-yellow-300 rounded-full animate-candle-flicker blur-[2px] opacity-80" />
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-6 h-12 bg-gradient-to-t from-orange-400 via-yellow-400 to-yellow-200 rounded-full animate-candle-flicker-alt" />
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-4 h-8 bg-gradient-to-t from-yellow-300 via-yellow-100 to-white rounded-full animate-candle-flicker-fast" />
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-2 h-4 bg-white rounded-full animate-candle-flicker-fast" />

                {/* Wick */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1 h-3 bg-charcoal rounded-full" />

                {/* Candle body */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-24 bg-gradient-to-b from-cream via-warm-white to-cream rounded-lg shadow-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                  {/* Decorative cross */}
                  <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-6 h-8 flex flex-col items-center">
                    <div className="w-1 h-3 bg-gold/30 rounded-full" />
                    <div className="w-4 h-1 bg-gold/30 rounded-full -mt-1.5" />
                    <div className="w-1 h-4 bg-gold/30 rounded-full -mt-0.5" />
                  </div>
                </div>

                {/* Base */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-gradient-to-b from-gold via-gold-dark to-gold-dark rounded-md shadow-lg" />
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Light a Candle Form - Enhanced */}
        <AnimatedSection animation="zoom" delay={200}>
          <div className="max-w-lg mx-auto mb-16">
            <div className="relative p-8 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm border border-white/10 shadow-2xl">
              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-gold/50 rounded-tl-xl" />
              <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-gold/50 rounded-tr-xl" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-gold/50 rounded-bl-xl" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-gold/50 rounded-br-xl" />

              <form onSubmit={lightCandle} className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('candles.yourName')}
                    disabled={isSubmitting}
                    className="w-full px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white text-center text-lg placeholder-white/40 focus:border-gold focus:outline-none focus:bg-white/15 focus:shadow-gold-glow transition-all duration-300 disabled:opacity-50"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-gold/0 via-gold/10 to-gold/0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || !name.trim()}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-gold via-gold-light to-gold text-charcoal font-bold text-lg tracking-wide shadow-lg hover:shadow-gold-glow transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" />
                        Lighting...
                      </>
                    ) : (
                      <>
                        <span className="text-2xl">🕯️</span>
                        {t('candles.lightCandle')}
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </button>
              </form>
            </div>
          </div>
        </AnimatedSection>

        {/* Animated Candle Count - More Dramatic */}
        <AnimatedSection delay={300} animation="zoom">
          <div className="text-center mb-16" ref={countRef}>
            <div className="relative inline-block">
              {/* Multiple glow layers */}
              <div className="absolute inset-0 scale-150 bg-gold/10 blur-3xl rounded-full animate-pulse" style={{ animationDuration: '3s' }} />
              <div className="absolute inset-0 scale-125 bg-gold/20 blur-2xl rounded-full animate-pulse" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
              <div className="absolute inset-0 bg-gold/30 blur-xl rounded-full animate-glow-pulse" />

              <div className="relative px-8 py-4">
                <span className="text-8xl md:text-9xl font-display bg-gradient-to-b from-gold via-yellow-400 to-gold-dark bg-clip-text text-transparent drop-shadow-2xl">
                  {animatedCount}
                </span>
              </div>
            </div>
            <p className="text-white/60 mt-6 text-lg tracking-wide">{t('candles.candlesLit')}</p>
          </div>
        </AnimatedSection>

        {/* Candles Grid - Dynamic sizing based on count */}
        <AnimatedSection delay={400}>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-gold/30 border-t-gold rounded-full animate-spin" />
                <p className="text-white/50">Loading candles...</p>
              </div>
            </div>
          ) : (
            <div className={`grid ${gridCols} gap-4 md:gap-6 transition-all duration-500`}>
              {candles.slice(0, 100).map((candle, index) => (
                <AnimatedCandle
                  key={candle.id}
                  candle={candle}
                  index={index}
                  isNew={candle.id === newCandleId}
                  size={candleSize}
                />
              ))}
            </div>
          )}
        </AnimatedSection>

        {candles.length > 100 && (
          <AnimatedSection delay={500}>
            <div className="text-center mt-12">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10">
                <span className="text-2xl">✨</span>
                <p className="text-white/50">+{candles.length - 100} more candles glowing in her memory</p>
                <span className="text-2xl">✨</span>
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Bottom decorative element */}
        <div className="mt-16 flex justify-center">
          <div className="flex items-center gap-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/50" />
            <span className="text-gold/50 text-2xl">🕊️</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/50" />
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// FLOATING LANTERNS SECTION
// ============================================

// Cloudflare Worker API - GLOBAL lantern storage (visible to ALL visitors)
const LANTERNS_API_URL = 'https://memorial-lanterns-api.ghwmelite.workers.dev';

// Formspree endpoint for lanterns (backup/notification)
const FORMSPREE_LANTERNS = 'https://formspree.io/f/xwpkgjkq';

// Default lanterns - fallback if API fails
const DEFAULT_LANTERNS = [
  { id: 1, name: "The Family", message: "Forever in our hearts, your light guides us still.", releasedAt: "2025-01-01T00:00:00Z" },
  { id: 2, name: "John Marion K. Hodges", message: "Your love and wisdom will never be forgotten.", releasedAt: "2025-01-02T00:00:00Z" },
  { id: 3, name: "Osborn M.D.K. Hodges", message: "Rest peacefully, Grandma. We love you always.", releasedAt: "2025-01-02T00:00:00Z" },
  { id: 4, name: "Ria Hodges", message: "Your spirit shines bright in all of us.", releasedAt: "2025-01-03T00:00:00Z" },
  { id: 5, name: "Gayle Hodges", message: "Until we meet again, sweet Grandma.", releasedAt: "2025-01-03T00:00:00Z" }
];

// Individual Floating Lantern Component
const FloatingLantern = ({ lantern, index, isNew, totalCount }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Calculate position - spread lanterns across the sky
  const getPosition = () => {
    // Use index to create varied positions
    const baseX = 5 + (index % 8) * 12 + (Math.random() * 5);
    const baseY = 60 + (index % 3) * 10 + (Math.random() * 10);
    return { x: Math.min(baseX, 90), y: Math.min(baseY, 85) };
  };

  const pos = getPosition();
  const animationDelay = (index * 2) % 25; // Stagger animations
  const animationDuration = 20 + (index % 5) * 3; // Vary duration

  return (
    <div
      className={`absolute cursor-pointer transition-transform duration-300 ${isNew ? 'animate-lantern-release' : ''}`}
      style={{
        left: `${pos.x}%`,
        bottom: `${pos.y}%`,
        animationDelay: `${animationDelay}s`,
        zIndex: isHovered ? 50 : 10 + index
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Lantern Container with float animation */}
      <div
        className="animate-lantern-float"
        style={{
          animationDelay: `${animationDelay}s`,
          animationDuration: `${animationDuration}s`
        }}
      >
        {/* Lantern with sway */}
        <div className="animate-lantern-sway" style={{ animationDelay: `${index * 0.3}s` }}>
          {/* Glow effect */}
          <div className="animate-lantern-glow">
            {/* Paper lantern shape */}
            <div className={`relative w-12 h-16 sm:w-14 sm:h-20 transition-transform duration-300 ${isHovered ? 'scale-125' : ''}`}>
              {/* Lantern body - warm orange gradient */}
              <div className="absolute inset-0 rounded-t-full rounded-b-lg bg-gradient-to-b from-orange-300 via-orange-400 to-orange-500 opacity-90" />

              {/* Inner glow */}
              <div className="absolute inset-1 rounded-t-full rounded-b-lg bg-gradient-to-b from-yellow-200 via-orange-300 to-orange-400 opacity-80" />

              {/* Light core */}
              <div className="absolute inset-2 top-4 rounded-full bg-gradient-radial from-yellow-100 via-orange-200 to-transparent opacity-90" />

              {/* Top rim */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-2 bg-gradient-to-b from-red-800 to-red-900 rounded-t-lg" />

              {/* Bottom rim */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1.5 bg-gradient-to-b from-red-800 to-red-900 rounded-b-lg" />

              {/* Flame inside */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-2 h-3 bg-gradient-to-t from-yellow-400 via-orange-300 to-transparent rounded-full animate-flame-flicker opacity-90" />

              {/* String/holder */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-px h-3 bg-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip with message */}
      <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-3 py-2 bg-charcoal/95 text-white text-xs rounded-xl shadow-xl transition-all duration-300 whitespace-nowrap max-w-[200px] ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
        <div className="font-medium text-gold mb-1">{lantern.name}</div>
        <div className="text-white/80 text-[10px] line-clamp-2 whitespace-normal">{lantern.message}</div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-charcoal/95" />
      </div>
    </div>
  );
};

const FloatingLanternsSection = ({ showToast }) => {
  const { t } = useLanguage();
  const [lanterns, setLanterns] = useState(DEFAULT_LANTERNS);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newLanternId, setNewLanternId] = useState(null);
  const [showReleaseEffect, setShowReleaseEffect] = useState(false);
  const isSavingRef = useRef(false);
  const sectionRef = useRef(null);

  const { ref: countRef, count: animatedCount } = useCountUp(lanterns.length, 2000);

  // Fetch lanterns from Cloudflare Worker API on mount
  useEffect(() => {
    const fetchLanterns = async () => {
      try {
        const response = await fetch(LANTERNS_API_URL);
        if (response.ok) {
          const data = await response.json();
          if (data.lanterns && Array.isArray(data.lanterns)) {
            setLanterns(data.lanterns);
          }
        }
      } catch (error) {
        console.log('Using default lanterns:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLanterns();

    // Poll for new lanterns every 30 seconds
    const pollInterval = setInterval(() => {
      if (!isSavingRef.current) {
        fetchLanterns();
      }
    }, 30000);

    return () => clearInterval(pollInterval);
  }, []);

  const releaseLantern = async (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setShowReleaseEffect(true);
    isSavingRef.current = true;

    const newLantern = {
      id: Date.now(),
      name: name.trim(),
      message: message.trim(),
      releasedAt: new Date().toISOString()
    };

    // Add new lantern to the list
    const updatedLanterns = [newLantern, ...lanterns];
    setLanterns(updatedLanterns);
    setNewLanternId(newLantern.id);

    try {
      // Save to Cloudflare Worker API (global storage)
      const response = await fetch(LANTERNS_API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lanterns: updatedLanterns })
      });

      if (!response.ok) {
        throw new Error('Failed to save');
      }

      console.log('Lantern released globally!');

      // Also send email notification via Formspree
      fetch(FORMSPREE_LANTERNS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newLantern.name,
          message: newLantern.message,
          releasedAt: newLantern.releasedAt,
          _subject: `🏮 New lantern released by ${newLantern.name}`
        })
      }).catch(() => {});

    } catch (error) {
      console.error('Failed to save lantern:', error);
    }

    // Complete the UI animation
    setTimeout(() => {
      setName('');
      setMessage('');
      setIsSubmitting(false);
      setShowReleaseEffect(false);
      isSavingRef.current = false;
      showToast(t('lanterns.thankYou'), 'success');
      setTimeout(() => setNewLanternId(null), 3000);
    }, 2000);
  };

  return (
    <section id="lanterns" ref={sectionRef} className="py-24 md:py-32 bg-gradient-to-b from-[#0a0a1a] via-[#1a1a3a] to-[#0f0f2a] text-white relative overflow-hidden min-h-[800px]">
      {/* Night sky background with stars */}
      <div className="absolute inset-0">
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] via-transparent to-[#1a1a4a]/30" />

        {/* Stars - multiple layers */}
        {Array.from({ length: 120 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-star-twinkle-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              background: i % 5 === 0 ? '#FFD700' : i % 3 === 0 ? '#87CEEB' : '#ffffff',
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
              opacity: 0.3 + Math.random() * 0.5,
            }}
          />
        ))}

        {/* Moon glow */}
        <div className="absolute top-10 right-10 md:top-20 md:right-20 w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-radial from-yellow-100/30 via-yellow-200/10 to-transparent blur-md" />
        <div className="absolute top-12 right-12 md:top-24 md:right-24 w-10 h-10 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 opacity-80" />
      </div>

      {/* Release burst effect */}
      {showReleaseEffect && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="w-32 h-32 rounded-full bg-gradient-radial from-orange-400/60 via-yellow-300/30 to-transparent animate-release-burst" />
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          eyebrow={t('lanterns.eyebrow')}
          title={t('lanterns.title')}
          subtitle={t('lanterns.subtitle')}
          light
        />

        {/* Lantern Sky Display Area */}
        <AnimatedSection delay={200}>
          <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden mb-12">
            {/* Floating Lanterns */}
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-400 border-t-transparent"></div>
                <span className="ml-3 text-white/70">Loading lanterns...</span>
              </div>
            ) : (
              <>
                {/* Display up to 30 lanterns for performance */}
                {lanterns.slice(0, 30).map((lantern, index) => (
                  <FloatingLantern
                    key={lantern.id}
                    lantern={lantern}
                    index={index}
                    isNew={lantern.id === newLanternId}
                    totalCount={lanterns.length}
                  />
                ))}

                {/* Ground/horizon line */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0a0a1a] to-transparent" />

                {/* Silhouette hills */}
                <div className="absolute bottom-0 left-0 right-0">
                  <svg viewBox="0 0 1200 120" className="w-full h-20 fill-[#0a0a1a]">
                    <path d="M0,120 L0,80 Q150,40 300,60 T600,50 T900,70 T1200,60 L1200,120 Z" />
                  </svg>
                </div>
              </>
            )}
          </div>
        </AnimatedSection>

        {/* Lantern Count */}
        <AnimatedSection delay={300}>
          <div ref={countRef} className="text-center mb-10">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-orange-500/20 backdrop-blur-sm">
              <span className="text-3xl">🏮</span>
              <span className="text-2xl md:text-3xl font-display text-orange-300">{animatedCount}</span>
              <span className="text-white/60">{t('lanterns.lanternsReleased')}</span>
            </div>
          </div>
        </AnimatedSection>

        {/* Release Lantern Form */}
        <AnimatedSection delay={400}>
          <div className="max-w-md mx-auto">
            <form onSubmit={releaseLantern} className="bg-white/5 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/10 shadow-2xl">
              <h3 className="text-xl font-display text-gold mb-6 text-center">{t('lanterns.releaseLantern')}</h3>

              {/* Name Input */}
              <div className="mb-4">
                <label className="block text-white/70 text-sm mb-2">{t('lanterns.yourName')}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('lanterns.yourName')}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-orange-400/50 focus:ring-2 focus:ring-orange-400/20 transition-all"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Message Input */}
              <div className="mb-6">
                <label className="block text-white/70 text-sm mb-2">{t('lanterns.yourMessage')}</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t('lanterns.messagePlaceholder')}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-orange-400/50 focus:ring-2 focus:ring-orange-400/20 transition-all resize-none"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !name.trim() || !message.trim()}
                className="w-full py-4 bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:via-orange-500 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-orange-400/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-orange-500/25"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {t('lanterns.releasing')}
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>🏮</span>
                    {t('lanterns.releaseLantern')}
                  </span>
                )}
              </button>
            </form>
          </div>
        </AnimatedSection>

        {/* More lanterns indicator */}
        {lanterns.length > 30 && (
          <AnimatedSection delay={500}>
            <div className="text-center mt-8">
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10">
                <span className="text-lg">✨</span>
                <p className="text-white/50 text-sm">+{lanterns.length - 30} more lanterns floating in the night sky</p>
                <span className="text-lg">✨</span>
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Bottom decorative element */}
        <div className="mt-16 flex justify-center">
          <div className="flex items-center gap-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-orange-400/50" />
            <span className="text-orange-400/50 text-2xl">🌙</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-orange-400/50" />
          </div>
        </div>
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
  const [prevSeconds, setPrevSeconds] = useState(0);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = STREAM_CONFIG.eventDateTime - new Date();
      if (difference > 0) {
        const newSeconds = Math.floor((difference / 1000) % 60);
        setPrevSeconds(timeLeft.seconds);
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: newSeconds
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
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 border border-white/10 rounded-full animate-pulse-soft" />
        <div className="absolute bottom-20 right-20 w-96 h-96 border border-white/10 rounded-full animate-pulse-soft" style={{ animationDelay: '-4s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full animate-spin-slow" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full animate-float-up-fade"
            style={{
              left: `${10 + (i * 6)}%`,
              bottom: '0',
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SectionHeading eyebrow={t('stream.eyebrow')} title={t('stream.title')} subtitle={t('stream.subtitle')} light />

        {!hasStream ? (
          // Countdown Mode
          <AnimatedSection animation="zoom">
            <div className="text-center">
              <p className="text-white/70 mb-8 animate-pulse">{t('stream.countdown')}</p>
              <div className="flex justify-center gap-4 md:gap-8">
                {[
                  { value: timeLeft.days, label: t('stream.days'), key: 'days' },
                  { value: timeLeft.hours, label: t('stream.hours'), key: 'hours' },
                  { value: timeLeft.minutes, label: t('stream.minutes'), key: 'minutes' },
                  { value: timeLeft.seconds, label: t('stream.seconds'), key: 'seconds' }
                ].map((item, i) => (
                  <div key={item.key} className="text-center group">
                    <div
                      className={`w-16 h-16 md:w-24 md:h-24 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-2 transition-all duration-300 hover:bg-white/20 hover:scale-105 ${item.key === 'seconds' ? 'animate-heartbeat' : ''}`}
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      <span
                        className={`text-3xl md:text-5xl font-display text-gold transition-all duration-300 ${item.key === 'seconds' && item.value !== prevSeconds ? 'animate-flip-in' : ''}`}
                        key={`${item.key}-${item.value}`}
                      >
                        {item.value.toString().padStart(2, '0')}
                      </span>
                    </div>
                    <span className="text-xs md:text-sm text-white/60 uppercase tracking-wider group-hover:text-gold transition-colors duration-300">{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Decorative separator */}
              <div className="flex items-center justify-center gap-2 mt-12 mb-4">
                <span className="h-px w-16 bg-white/20" />
                <span className="text-gold animate-twinkle">✦</span>
                <span className="h-px w-16 bg-white/20" />
              </div>

              <p className="text-white/50 hover:text-white/70 transition-colors duration-300">Stream link will be available when the service begins</p>
            </div>
          </AnimatedSection>
        ) : (
          // Stream Player
          <AnimatedSection animation="zoom">
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl group">
              {/* Decorative frame */}
              <div className="absolute -inset-1 bg-gradient-to-r from-gold via-white/20 to-gold rounded-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
              <div className="relative rounded-2xl overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${STREAM_CONFIG.youtubeVideoId}?autoplay=0`}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
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
// AI TRIBUTE WRITER MODAL
// ============================================

const AITributeWriterModal = ({ isOpen, onClose, onUseTribute, userName }) => {
  const { t, language } = useLanguage();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTribute, setGeneratedTribute] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    relationship: '',
    memories: [],
    specificMemory: ''
  });

  const relationships = [
    { value: 'family', label: language === 'en' ? 'Family Member' : 'Ƒomeviwo' },
    { value: 'church', label: language === 'en' ? 'Church Family' : 'Hame ƒomeviwo' },
    { value: 'friend', label: language === 'en' ? 'Friend' : 'Xɔlɔ' },
    { value: 'neighbor', label: language === 'en' ? 'Neighbor' : 'Tokplɔvi' },
    { value: 'colleague', label: language === 'en' ? 'Colleague' : 'Dɔwɔlɔ' },
    { value: 'other', label: language === 'en' ? 'Other' : 'Bubu' }
  ];

  const memoryOptions = [
    { value: 'smile', label: language === 'en' ? 'Her warm smile' : 'Eƒe nuko vivi' },
    { value: 'cooking', label: language === 'en' ? 'Her cooking' : 'Eƒe nuɖuɖu' },
    { value: 'faith', label: language === 'en' ? 'Her strong faith' : 'Eƒe xɔse sesẽ' },
    { value: 'kindness', label: language === 'en' ? 'Her kindness' : 'Eƒe nyuie' },
    { value: 'wisdom', label: language === 'en' ? 'Her wisdom' : 'Eƒe nunyala' },
    { value: 'love', label: language === 'en' ? 'Her love for family' : 'Eƒe lɔlɔ̃ na ƒome' },
    { value: 'laughter', label: language === 'en' ? 'Her laughter' : 'Eƒe kɔdzidzi' },
    { value: 'stories', label: language === 'en' ? 'Her stories' : 'Eƒe nyagbegblewo' }
  ];

  const toggleMemory = (value) => {
    setFormData(prev => ({
      ...prev,
      memories: prev.memories.includes(value)
        ? prev.memories.filter(m => m !== value)
        : [...prev.memories, value]
    }));
  };

  const generateTribute = async () => {
    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch(TRIBUTE_AI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          relationship: relationships.find(r => r.value === formData.relationship)?.label || formData.relationship,
          memories: formData.memories.map(m => memoryOptions.find(opt => opt.value === m)?.label || m),
          specificMemory: formData.specificMemory,
          name: userName
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate tribute');
      }

      const data = await response.json();
      setGeneratedTribute(data.tribute);
      setStep(3);
    } catch (err) {
      setError(language === 'en'
        ? 'Unable to generate tribute. Please try again or write your own message.'
        : 'Míate ŋu wɔ tribute o. Taflatse zã trɔa alo ŋlɔ tɔwoe ɖokui.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseTribute = () => {
    onUseTribute(generatedTribute);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setStep(1);
    setFormData({ relationship: '', memories: [], specificMemory: '' });
    setGeneratedTribute('');
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-burgundy to-burgundy-dark p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-display text-white">
                  {language === 'en' ? 'AI Tribute Writer' : 'AI Tribute Ŋlɔla'}
                </h3>
                <p className="text-white/70 text-sm">
                  {language === 'en' ? 'Let us help you find the right words' : 'Mía kpɔ mɔ be míakpe ɖe ŋuwò'}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  step >= s ? 'bg-gold text-white' : 'bg-white/20 text-white/50'
                }`}>
                  {step > s ? '✓' : s}
                </div>
                {s < 3 && <div className={`w-8 h-0.5 ${step > s ? 'bg-gold' : 'bg-white/20'}`} />}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Relationship */}
          {step === 1 && (
            <div className="space-y-4">
              <h4 className="font-medium text-charcoal text-lg">
                {language === 'en' ? 'How did you know Grandma?' : 'Aleke nènya Mama?'}
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {relationships.map((rel) => (
                  <button
                    key={rel.value}
                    onClick={() => setFormData(prev => ({ ...prev, relationship: rel.value }))}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      formData.relationship === rel.value
                        ? 'border-gold bg-gold/10 text-charcoal'
                        : 'border-warm-gray/20 hover:border-gold/50 text-warm-gray'
                    }`}
                  >
                    {rel.label}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={!formData.relationship}
                className={`w-full py-3 rounded-xl font-medium transition-all ${
                  formData.relationship
                    ? 'bg-gold text-white hover:bg-gold-dark'
                    : 'bg-warm-gray/20 text-warm-gray cursor-not-allowed'
                }`}
              >
                {language === 'en' ? 'Continue' : 'Yi ɖe ŋgɔ'}
              </button>
            </div>
          )}

          {/* Step 2: Memories */}
          {step === 2 && (
            <div className="space-y-4">
              <h4 className="font-medium text-charcoal text-lg">
                {language === 'en' ? 'What do you remember most about her?' : 'Nuka nèdoa ŋku ɖe eŋu nyuie?'}
              </h4>
              <p className="text-sm text-warm-gray">
                {language === 'en' ? 'Select all that apply' : 'Tia wo katã siwo sɔ'}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {memoryOptions.map((mem) => (
                  <button
                    key={mem.value}
                    onClick={() => toggleMemory(mem.value)}
                    className={`p-3 rounded-xl border-2 text-left text-sm transition-all ${
                      formData.memories.includes(mem.value)
                        ? 'border-gold bg-gold/10 text-charcoal'
                        : 'border-warm-gray/20 hover:border-gold/50 text-warm-gray'
                    }`}
                  >
                    {formData.memories.includes(mem.value) && <span className="mr-1">✓</span>}
                    {mem.label}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  {language === 'en' ? 'Any specific memory? (optional)' : 'Nane ŋkɔ ko? (mele be)'}
                </label>
                <textarea
                  value={formData.specificMemory}
                  onChange={(e) => setFormData(prev => ({ ...prev, specificMemory: e.target.value }))}
                  placeholder={language === 'en' ? 'Share a brief memory...' : 'Gblɔ nane kpui...'}
                  className="w-full px-4 py-3 rounded-xl border-2 border-warm-gray/20 focus:border-gold focus:ring-0 outline-none transition-colors resize-none bg-cream/50"
                  rows={3}
                />
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 rounded-xl border-2 border-warm-gray/20 text-warm-gray hover:border-gold hover:text-gold transition-all"
                >
                  {language === 'en' ? 'Back' : 'Gbugbɔ'}
                </button>
                <button
                  onClick={generateTribute}
                  disabled={formData.memories.length === 0 || isGenerating}
                  className={`flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                    formData.memories.length > 0 && !isGenerating
                      ? 'bg-gold text-white hover:bg-gold-dark'
                      : 'bg-warm-gray/20 text-warm-gray cursor-not-allowed'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {language === 'en' ? 'Writing...' : 'Le ŋlɔm...'}
                    </>
                  ) : (
                    language === 'en' ? 'Generate Tribute' : 'Wɔ Tribute'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Generated Tribute */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">
                  {language === 'en' ? 'Your tribute is ready!' : 'Wò tribute sɔ!'}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-cream border-2 border-gold/20">
                <textarea
                  value={generatedTribute}
                  onChange={(e) => setGeneratedTribute(e.target.value)}
                  className="w-full bg-transparent text-charcoal resize-none outline-none min-h-[120px]"
                  rows={5}
                />
              </div>

              <p className="text-sm text-warm-gray italic">
                {language === 'en'
                  ? 'Feel free to edit the message above before using it.'
                  : 'Àte ŋu trɔ nyaa dzi hafi azãe.'}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 rounded-xl border-2 border-warm-gray/20 text-warm-gray hover:border-gold hover:text-gold transition-all"
                >
                  {language === 'en' ? 'Try Again' : 'Zã trɔa'}
                </button>
                <button
                  onClick={handleUseTribute}
                  className="flex-1 py-3 rounded-xl bg-gold text-white font-medium hover:bg-gold-dark transition-all"
                >
                  {language === 'en' ? 'Use This Tribute' : 'Zã Tribute sia'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================
// TRIBUTES SECTION (Guestbook + Media)
// ============================================

const TributesSection = ({ showToast }) => {
  const { t, language } = useLanguage();
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', location: '', message: '' });
  const [showAIWriter, setShowAIWriter] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [displayCount, setDisplayCount] = useState(6);

  // Fetch entries from API on mount
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await fetch(GUESTBOOK_API_URL);
        if (response.ok) {
          const data = await response.json();
          setEntries(data.entries || []);
        }
      } catch (error) {
        console.error('Failed to fetch guestbook entries:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEntries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save to global API
      const apiResponse = await fetch(GUESTBOOK_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          location: formData.location || 'Not specified',
          message: formData.message
        })
      });

      if (apiResponse.ok) {
        const data = await apiResponse.json();
        setEntries(data.entries || []);
        setFormData({ name: '', location: '', message: '' });
        showToast(t('tributes.successMessage'), 'success');

        // Also send to Formspree for email notification
        fetch(FORMSPREE_GUESTBOOK, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            location: formData.location || 'Not specified',
            message: formData.message,
            _subject: `New Guestbook Entry from ${formData.name}`
          })
        }).catch(() => {});
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      showToast(t('common.error'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadMore = () => {
    setDisplayCount(prev => prev + 6);
  };

  const displayedEntries = entries.slice(0, displayCount);
  const hasMore = entries.length > displayCount;

  return (
    <section id="tributes" className="py-24 md:py-32 bg-cream relative">
      <CornerOrnament position="bottom-left" />
      <CornerOrnament position="bottom-right" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={t('tributes.eyebrow')} title={t('tributes.title')} subtitle={t('tributes.subtitle')} />

        {/* Written Tributes Form */}
        <AnimatedSection>
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
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-charcoal">{t('tributes.yourMessage')} *</label>
                  <button
                    type="button"
                    onClick={() => setShowAIWriter(true)}
                    className="flex items-center gap-1.5 text-sm text-burgundy hover:text-burgundy-dark transition-colors group"
                  >
                    <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    {t('tributes.helpMeWrite') || 'Help me write'}
                  </button>
                </div>
                <textarea required rows={4} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full px-4 py-3 rounded-xl border-2 border-warm-gray/20 focus:border-gold focus:ring-0 outline-none transition-colors resize-none bg-cream/50" />
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t('tributes.sending') : t('tributes.submitTribute')}
              </Button>
            </form>
          </Card>
        </AnimatedSection>

        {/* AI Tribute Writer Modal */}
        <AITributeWriterModal
          isOpen={showAIWriter}
          onClose={() => setShowAIWriter(false)}
          onUseTribute={(tribute) => setFormData(prev => ({ ...prev, message: tribute }))}
          userName={formData.name}
        />

        {/* Entries Count */}
        {!isLoading && entries.length > 0 && (
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 rounded-full text-gold-dark text-sm font-medium">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              {entries.length} {language === 'en' ? 'tributes shared' : 'akpɔkplɔwo'}
            </span>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-gold/30 border-t-gold rounded-full animate-spin mb-4" />
            <p className="text-warm-gray">{language === 'en' ? 'Loading tributes...' : 'Akpɔkplɔwo le dzadzram...'}</p>
          </div>
        )}

        {/* Entries List - Responsive Masonry-style Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {displayedEntries.map((entry, index) => (
              <AnimatedSection key={entry.id} delay={Math.min(index * 50, 300)}>
                <Card className={`p-4 sm:p-6 border-l-4 border-gold relative overflow-hidden group h-full ${entry.id === 'welcome' ? 'md:col-span-2 bg-gradient-to-br from-cream to-gold/5' : ''}`} hover={false}>
                  {/* Decorative corner flourish */}
                  <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <svg className="w-full h-full text-gold/20" viewBox="0 0 100 100">
                      <path d="M100 0 Q60 40 100 100" fill="none" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </div>

                  {/* Message */}
                  <div className="relative mb-4">
                    <span className="absolute -left-1 -top-1 text-2xl sm:text-3xl text-gold/20 font-serif">"</span>
                    <p className="text-charcoal text-sm sm:text-base italic pl-4 pr-4 leading-relaxed line-clamp-6 group-hover:line-clamp-none transition-all">
                      {entry.message}
                    </p>
                    <span className="absolute -right-1 bottom-0 text-2xl sm:text-3xl text-gold/20 font-serif rotate-180">"</span>
                  </div>

                  {/* Signature area */}
                  <div className="flex items-center justify-between flex-wrap gap-2 sm:gap-4 pt-3 sm:pt-4 border-t border-gold/10">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-white text-sm sm:text-base font-medium shadow-gold-glow transition-transform duration-300 group-hover:scale-110">
                          {entry.name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-display text-sm sm:text-base text-charcoal group-hover:text-gold transition-colors duration-300 truncate">
                          {entry.name}
                        </p>
                        {entry.location && entry.location !== 'Not specified' && (
                          <p className="text-xs sm:text-sm text-warm-gray flex items-center gap-1 truncate">
                            <span className="inline-block w-1 h-1 rounded-full bg-gold flex-shrink-0" />
                            <span className="truncate">{entry.location}</span>
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="text-xs sm:text-sm text-warm-gray italic flex-shrink-0">{entry.date}</span>
                  </div>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {!isLoading && hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={loadMore}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-gold text-gold-dark rounded-full font-medium hover:bg-gold hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              {language === 'en' ? `View More (${entries.length - displayCount} remaining)` : `Kpɔ bubuwo (${entries.length - displayCount})`}
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && entries.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <p className="text-warm-gray">{language === 'en' ? 'Be the first to share a tribute!' : 'Nye ame gbãtɔ si ana akpɔkplɔ!'}</p>
          </div>
        )}
      </div>
    </section>
  );
};

// ============================================
// DONATION SECTION
// ============================================

const DonationSection = ({ showToast }) => {
  const { t, language } = useLanguage();
  const [copiedId, setCopiedId] = useState(null);
  const [showPaystack, setShowPaystack] = useState(false);
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text.replace(/\s/g, ''));
    setCopiedId(id);
    showToast(t('donate.copied'), 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePaystackPayment = (e) => {
    e.preventDefault();
    if (!donorEmail || !amount || !donorName) {
      showToast(language === 'en' ? 'Please fill all fields' : 'Taflatse ŋlɔ nya siwo katã', 'error');
      return;
    }

    const amountInPesewas = parseFloat(amount) * 100;
    if (isNaN(amountInPesewas) || amountInPesewas < 100) {
      showToast(language === 'en' ? 'Minimum amount is GHS 1' : 'Gã la nye GHS 1', 'error');
      return;
    }

    setIsProcessing(true);

    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: donorEmail,
      amount: amountInPesewas,
      currency: 'GHS',
      ref: 'memorial_' + Math.floor(Math.random() * 1000000000 + 1),
      metadata: {
        custom_fields: [
          { display_name: 'Donor Name', variable_name: 'donor_name', value: donorName },
          { display_name: 'Memorial', variable_name: 'memorial', value: 'Josephine Worla Ameovi' }
        ]
      },
      callback: function(response) {
        setIsProcessing(false);
        showToast(
          language === 'en'
            ? `Thank you ${donorName}! Your donation of GHS ${amount} was successful.`
            : `Akpe na wò ${donorName}! Woƒe kpekpeɖeŋu GHS ${amount} dze.`,
          'success'
        );
        setDonorName('');
        setDonorEmail('');
        setAmount('');
        setShowPaystack(false);
      },
      onClose: function() {
        setIsProcessing(false);
      }
    });

    handler.openIframe();
  };

  const providers = [
    { id: 'mtn', name: 'MTN Mobile Money', color: 'from-yellow-400 to-yellow-500', icon: '📱', ...MOBILE_MONEY.mtn },
    { id: 'vodafone', name: 'Vodafone Cash', color: 'from-red-500 to-red-600', icon: '💰', ...MOBILE_MONEY.vodafone },
    { id: 'airtel', name: 'AirtelTigo Money', color: 'from-blue-500 to-blue-600', icon: '💳', ...MOBILE_MONEY.airtelTigo }
  ];

  const presetAmounts = [50, 100, 200, 500];

  return (
    <section id="donate" className="py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse-soft" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-forest/5 rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse-soft" style={{ animationDelay: '-3s' }} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SectionHeading eyebrow={t('donate.eyebrow')} title={t('donate.title')} subtitle={t('donate.subtitle')} />

        {/* Online Donation Section */}
        <AnimatedSection animation="zoom">
          <div className="text-center mb-8">
            <button
              onClick={() => setShowPaystack(!showPaystack)}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-forest to-green-600 text-white rounded-2xl text-lg font-medium magnetic-hover transition-all duration-300 hover:shadow-lg hover:scale-105 btn-press"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              {language === 'en' ? 'Donate Online (Card/Mobile Money)' : 'Na Kpekpeɖeŋu Online'}
            </button>
            <p className="text-warm-gray text-sm mt-2">
              {language === 'en' ? 'Secure payment via Paystack' : 'Ɖoɖo nyui to Paystack dzi'}
            </p>
          </div>
        </AnimatedSection>

        {/* Paystack Payment Form */}
        {showPaystack && (
          <AnimatedSection animation="zoom">
            <Card className="max-w-md mx-auto p-6 mb-12">
              <h3 className="font-display text-xl text-charcoal mb-4 text-center">
                {language === 'en' ? 'Make a Donation' : 'Na Kpekpeɖeŋu'}
              </h3>
              <form onSubmit={handlePaystackPayment} className="space-y-4">
                <div>
                  <label className="block text-sm text-warm-gray mb-1">
                    {language === 'en' ? 'Your Name' : 'Wò Ŋkɔ'}
                  </label>
                  <input
                    type="text"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-warm-gray/30 focus:border-gold focus:outline-none transition-all duration-300 input-animated"
                    placeholder={language === 'en' ? 'Enter your name' : 'Ŋlɔ wò ŋkɔ'}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-warm-gray mb-1">
                    {language === 'en' ? 'Email Address' : 'Email'}
                  </label>
                  <input
                    type="email"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-warm-gray/30 focus:border-gold focus:outline-none transition-all duration-300 input-animated"
                    placeholder="email@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-warm-gray mb-1">
                    {language === 'en' ? 'Amount (GHS)' : 'Ga (GHS)'}
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-warm-gray/30 focus:border-gold focus:outline-none transition-all duration-300 input-animated text-2xl font-mono"
                    placeholder="0.00"
                    min="1"
                    required
                  />
                  <div className="flex gap-2 mt-2">
                    {presetAmounts.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setAmount(preset.toString())}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${amount === preset.toString() ? 'bg-gold text-white' : 'bg-gold/10 text-gold-dark hover:bg-gold/20'}`}
                      >
                        GHS {preset}
                      </button>
                    ))}
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isProcessing}>
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {language === 'en' ? 'Processing...' : 'Wòle dzadzra...'}
                    </span>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      {language === 'en' ? 'Donate Securely' : 'Na Kpekpeɖeŋu'}
                    </>
                  )}
                </Button>
              </form>
              <p className="text-center text-xs text-warm-gray mt-4">
                {language === 'en' ? 'Powered by Paystack - Safe & Secure' : 'Paystack - Ɖoɖo nyui'}
              </p>
            </Card>
          </AnimatedSection>
        )}

        {/* Divider */}
        <AnimatedSection delay={100}>
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="h-px w-20 bg-warm-gray/30" />
            <span className="text-warm-gray text-sm">{language === 'en' ? 'or send via Mobile Money' : 'alo ɖo to Mobile Money dzi'}</span>
            <span className="h-px w-20 bg-warm-gray/30" />
          </div>
        </AnimatedSection>

        <AnimatedSection animation="zoom" delay={150}>
          <div className="text-center mb-8">
            <span className="inline-block px-6 py-2 bg-gold/10 text-gold-dark rounded-full text-lg font-medium magnetic-hover transition-all duration-300 hover:bg-gold hover:text-white hover:shadow-gold-glow">
              {t('donate.mobileMoneyTitle')}
            </span>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6">
          {providers.map((provider, index) => (
            <AnimatedSection key={provider.id} delay={200 + index * 150} animation={index === 1 ? 'fade-up' : index === 0 ? 'fade-right' : 'fade-left'}>
              <Card className="p-6 text-center group" tilt>
                <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${provider.color} flex items-center justify-center text-white text-2xl font-bold mb-4 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg`}>
                  <span className="transition-transform duration-300 group-hover:scale-125">{provider.icon}</span>
                </div>
                <h4 className="font-medium text-charcoal mb-2 group-hover:text-gold-dark transition-colors duration-300">{provider.name}</h4>
                <p className="text-2xl font-mono text-charcoal mb-1 transition-all duration-300 group-hover:tracking-wider">{provider.number}</p>
                <p className="text-sm text-warm-gray mb-4">{t('donate.accountName')}: {provider.name}</p>
                <button
                  onClick={() => copyToClipboard(provider.number, provider.id)}
                  className={`w-full py-2 rounded-lg text-sm font-medium transition-all duration-300 btn-press ${copiedId === provider.id ? 'bg-forest text-white scale-105' : 'bg-gold/10 text-gold-dark hover:bg-gold hover:text-white hover:scale-105'}`}
                >
                  <span className="flex items-center justify-center gap-2">
                    {copiedId === provider.id ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        {t('donate.copied')}
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        {t('donate.copyNumber')}
                      </>
                    )}
                  </span>
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
                <div className="space-y-3 text-warm-gray">
                  <a href="tel:+233540125882" className="flex items-center gap-3 hover:text-gold transition-colors duration-300 group">
                    <span className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">📱</span>
                    <span>0540 125 882</span>
                  </a>
                  <a href="tel:+233505982361" className="flex items-center gap-3 hover:text-gold transition-colors duration-300 group">
                    <span className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">📱</span>
                    <span>0505 982 361</span>
                  </a>
                  <a href="mailto:support@josephineameovi.com" className="flex items-center gap-3 hover:text-gold transition-colors duration-300 group">
                    <span className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">✉️</span>
                    <span>support@josephineameovi.com</span>
                  </a>
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

        {/* Visitor Globe - Live Visitor Counter */}
        <AnimatedSection delay={300} className="mt-12">
          <VisitorGlobe />
        </AnimatedSection>
      </div>
    </section>
  );
};

// ============================================
// FOOTER
// ============================================

const Footer = () => {
  const { t } = useLanguage();
  const [footerRef, footerVisible] = useScrollReveal();

  return (
    <footer className="bg-gradient-to-b from-charcoal via-charcoal-light to-charcoal text-white py-20 relative overflow-hidden" ref={footerRef}>
      {/* Kente Border at top */}
      <KenteBorder className="absolute top-0 left-0 right-0 h-2" />

      {/* Rich animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-charcoal/50" />

        {/* Large glowing orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-burgundy/5 rounded-full blur-3xl animate-float-slow-reverse" />

        {/* Spinning circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-gold/10 rounded-full animate-spin-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] border border-gold/5 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '35s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-burgundy/10 rounded-full animate-spin-slow" style={{ animationDuration: '45s' }} />

        {/* Twinkling stars */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gold/40 rounded-full animate-twinkle"
            style={{
              left: `${5 + (i * 4.5)}%`,
              top: `${10 + ((i * 17) % 80)}%`,
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}

        {/* Floating particles */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute w-2 h-2 bg-gold/20 rounded-full animate-float-up-fade"
            style={{
              left: `${10 + (i * 11)}%`,
              bottom: '-10px',
              animationDelay: `${i * 0.7}s`,
              animationDuration: '6s'
            }}
          />
        ))}

        {/* Decorative corner ornaments */}
        <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-gold/20 rounded-tl-lg" />
        <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-gold/20 rounded-tr-lg" />
        <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-gold/20 rounded-bl-lg" />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-gold/20 rounded-br-lg" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        {/* Decorative top element */}
        <div
          className="mb-8 transition-all duration-700"
          style={{ opacity: footerVisible ? 1 : 0, transform: footerVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.8)' }}
        >
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-gold/50" />
            <span className="text-gold text-3xl animate-twinkle inline-block">✦</span>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-gold/50" />
          </div>
        </div>

        <h2
          className="font-display text-3xl md:text-5xl text-white mb-3 transition-all duration-700"
          style={{ opacity: footerVisible ? 1 : 0, transform: footerVisible ? 'translateY(0)' : 'translateY(20px)', transitionDelay: '100ms' }}
        >
          Josephine Worla Ameovi
        </h2>

        <p
          className="text-gold text-xl mb-3 animate-gradient-text transition-all duration-700 font-display italic"
          style={{ opacity: footerVisible ? 1 : 0, transform: footerVisible ? 'translateY(0)' : 'translateY(20px)', transitionDelay: '200ms' }}
        >
          "{t('hero.grandma')}"
        </p>

        <p
          className="text-white/70 mb-10 text-lg transition-all duration-700"
          style={{ opacity: footerVisible ? 1 : 0, transitionDelay: '300ms' }}
        >
          July 15, 1948 — December 14, 2025
        </p>

        {/* Memorial quote card */}
        <div
          className="max-w-md mx-auto mb-10 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-gold/20 transition-all duration-700"
          style={{ opacity: footerVisible ? 1 : 0, transform: footerVisible ? 'translateY(0)' : 'translateY(20px)', transitionDelay: '350ms' }}
        >
          <p className="text-white/80 italic font-display">"Those we love don't go away, they walk beside us every day."</p>
        </div>

        <div
          className="flex items-center justify-center gap-4 mb-10 transition-all duration-700"
          style={{ opacity: footerVisible ? 1 : 0, transitionDelay: '400ms' }}
        >
          <span className="h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent transition-all duration-1000" style={{ width: footerVisible ? '6rem' : '0' }} />
          <span className="text-gold hover:text-gold-light transition-colors duration-300 cursor-default font-medium">{t('footer.foreverInHearts')}</span>
          <span className="h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent transition-all duration-1000" style={{ width: footerVisible ? '6rem' : '0' }} />
        </div>

        <p
          className="text-white/50 text-sm hover:text-white/70 transition-all duration-500"
          style={{ opacity: footerVisible ? 1 : 0, transitionDelay: '500ms' }}
        >
          {t('footer.builtWithLove')}
        </p>

        {/* Scroll to top button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="mt-10 mx-auto w-12 h-12 rounded-full border-2 border-gold/30 flex items-center justify-center text-gold/60 hover:text-gold hover:border-gold hover:bg-gold/10 hover:scale-110 transition-all duration-300 group shadow-lg shadow-gold/10"
          style={{ opacity: footerVisible ? 1 : 0, transitionDelay: '600ms' }}
          aria-label="Scroll to top"
        >
          <svg className="w-5 h-5 transform transition-transform duration-300 group-hover:-translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
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

  // Image protection - disable right-click and keyboard shortcuts
  useEffect(() => {
    const handleContextMenu = (e) => {
      if (e.target.tagName === 'IMG') {
        e.preventDefault();
        return false;
      }
    };

    const handleKeyDown = (e) => {
      // Disable Ctrl+S, Ctrl+U, Ctrl+Shift+I, F12
      if (
        (e.ctrlKey && e.key === 's') ||
        (e.ctrlKey && e.key === 'u') ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        e.key === 'F12'
      ) {
        // Allow for developers, but show warning
      }
    };

    const handleDragStart = (e) => {
      if (e.target.tagName === 'IMG') {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('dragstart', handleDragStart);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('dragstart', handleDragStart);
    };
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
        <MemorialGarden showToast={showToast} />
        <CandleLightingSection showToast={showToast} />
        <FloatingLanternsSection showToast={showToast} />
        <MemoryConstellation />
        <LiveStreamSection />
        <TributesSection showToast={showToast} />
        <DonationSection showToast={showToast} />
        <ContactSection showToast={showToast} />
        <Footer />
        <AmbientMusicPlayer />
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </LanguageProvider>
  );
}
