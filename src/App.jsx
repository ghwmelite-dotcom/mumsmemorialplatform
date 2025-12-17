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
const CLOUDINARY_CLOUD_NAME = 'db967oq9r';
const CLOUDINARY_UPLOAD_PRESET = 'memorial_tributes';

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

// Paystack configuration (TEST MODE)
const PAYSTACK_PUBLIC_KEY = 'pk_test_9cdde18d25bee33638801838a5779d21f1e7e423';

// Music playlist (add URLs to hymns/songs)
// Audio hosted on Cloudinary for reliable cross-origin playback
const MUSIC_PLAYLIST = [
  { title: 'A Faithful Life Remembered Through Music', artist: 'Memorial Hymns Collection (12 Tracks)', url: 'https://res.cloudinary.com/db967oq9r/video/upload/v1766007005/k96tzpjq8audsvde0rov.mp3' }
];

// Family tree data
const FAMILY_DATA = {
  matriarch: {
    name: 'Josephine Worla Ameovi',
    title: 'Grandma',
    years: '1948 - 2025',
    icon: '👑'
  },
  children: [
    { id: 1, name: 'John Marion K. Hodges', relation: 'Son', icon: '👨' },
    { id: 2, name: 'Osborn M.D.K. Hodges', relation: 'Son', icon: '👨' }
  ],
  grandchildren: [
    { id: 1, name: 'Ria Hodges', parentId: 1, icon: '👩' },
    { id: 2, name: 'Gayle Hodges', parentId: 1, icon: '👩' }
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
// FEATURE 5: AMBIENT MUSIC PLAYER
// ============================================

const AmbientMusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef(null);

  // Use the same playlist as MusicPlayer
  const currentTrack = MUSIC_PLAYLIST[0];
  const hasMusic = currentTrack && currentTrack.url;

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current || !hasMusic) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log('Audio play failed:', err));
    }
  };

  if (!hasMusic) return null;

  return (
    <div className={`fixed bottom-6 left-6 z-40 transition-all duration-500 ${isExpanded ? 'w-72' : 'w-14'}`}>
      <audio
        ref={audioRef}
        src={currentTrack.url}
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onError={(e) => console.error('Audio error:', e.target.error)}
      />
      <div className="music-player-mini rounded-2xl shadow-2xl border border-gold/20 overflow-hidden">
        {/* Mini View */}
        <div className="flex items-center p-3 gap-3">
          <button
            onClick={togglePlay}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gold text-white hover:bg-gold-dark transition-colors flex-shrink-0"
          >
            {isPlaying ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
            ) : (
              <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>

          {/* Equalizer Bars */}
          {isPlaying && (
            <div className="flex items-end gap-0.5 h-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-gold rounded-full animate-equalizer"
                  style={{ '--max-height': `${12 + Math.random() * 12}px`, '--speed': `${0.3 + Math.random() * 0.3}s` }}
                />
              ))}
            </div>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-auto text-white/60 hover:text-white transition-colors"
          >
            <svg className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Expanded View */}
        {isExpanded && (
          <div className="px-3 pb-3 border-t border-white/10">
            <div className="py-3">
              <p className="text-white font-medium text-sm truncate">{currentTrack.title}</p>
              <p className="text-white/50 text-xs">{currentTrack.artist}</p>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={togglePlay}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-gold text-white hover:bg-gold-dark transition-colors"
              >
                {isPlaying ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
                ) : (
                  <svg className="w-6 h-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                )}
              </button>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-2 mt-3">
              <svg className="w-4 h-4 text-white/50" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3z"/></svg>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => {
                  const newVol = parseFloat(e.target.value);
                  setVolume(newVol);
                  if (audioRef.current) audioRef.current.volume = newVol;
                }}
                className="flex-1 h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-gold [&::-webkit-slider-thumb]:rounded-full"
              />
              <svg className="w-4 h-4 text-white/50" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// FEATURE 7: VIRTUAL MEMORIAL GARDEN
// ============================================

const MemorialGarden = ({ showToast }) => {
  const { t } = useLanguage();
  const [flowers, setFlowers] = useState(() => {
    const saved = localStorage.getItem('memorial-garden-flowers');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'The Family', type: 'rose', plantedAt: '2025-01-01' },
      { id: 2, name: 'Friends', type: 'lily', plantedAt: '2025-01-02' },
      { id: 3, name: 'With Love', type: 'tulip', plantedAt: '2025-01-03' },
    ];
  });
  const [plantName, setPlantName] = useState('');
  const [isPlanting, setIsPlanting] = useState(false);
  const [newFlowerId, setNewFlowerId] = useState(null);

  const flowerTypes = {
    rose: { emoji: '🌹', color: 'from-red-400 to-red-600' },
    lily: { emoji: '🌸', color: 'from-pink-300 to-pink-500' },
    tulip: { emoji: '🌷', color: 'from-yellow-400 to-orange-500' },
    sunflower: { emoji: '🌻', color: 'from-yellow-400 to-yellow-600' },
    orchid: { emoji: '💐', color: 'from-purple-400 to-purple-600' },
  };

  const plantFlower = (e) => {
    e.preventDefault();
    if (!plantName.trim() || isPlanting) return;

    setIsPlanting(true);
    const types = Object.keys(flowerTypes);
    const newFlower = {
      id: Date.now(),
      name: plantName.trim(),
      type: types[Math.floor(Math.random() * types.length)],
      plantedAt: new Date().toISOString(),
    };

    const updated = [...flowers, newFlower];
    setFlowers(updated);
    setNewFlowerId(newFlower.id);
    localStorage.setItem('memorial-garden-flowers', JSON.stringify(updated));

    setTimeout(() => {
      setPlantName('');
      setIsPlanting(false);
      showToast('Your flower has been planted in the garden 🌸', 'success');
      setTimeout(() => setNewFlowerId(null), 2000);
    }, 1000);
  };

  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-forest/5 via-cream to-cream relative overflow-hidden">
      {/* Garden background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-forest/20 to-transparent" />
      </div>
      <GoldenRainParticles intensity="light" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SectionHeading
          eyebrow="Memorial Garden"
          title="Plant a Flower in Her Memory"
          subtitle="Each flower represents a life touched by Grandma's love and kindness"
        />

        {/* Garden Grid */}
        <AnimatedSection delay={200}>
          <div className="bg-gradient-to-b from-green-50 to-green-100/50 rounded-3xl p-8 mb-12 shadow-soft border border-green-200/30">
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3">
              {flowers.map((flower, index) => {
                const type = flowerTypes[flower.type] || flowerTypes.rose;
                const isNew = flower.id === newFlowerId;
                return (
                  <div
                    key={flower.id}
                    className={`relative group cursor-pointer ${isNew ? 'animate-bloom' : ''}`}
                    style={{ animationDelay: `${index * 50}ms` }}
                    title={flower.name}
                  >
                    <div className="animate-sway">
                      <div className="text-2xl sm:text-3xl transform transition-transform duration-300 group-hover:scale-125">
                        {type.emoji}
                      </div>
                    </div>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-charcoal text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      {flower.name}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Garden stats */}
            <div className="mt-6 pt-6 border-t border-green-200/50 flex items-center justify-center gap-6 text-sm text-forest">
              <span className="flex items-center gap-2">
                <span className="text-lg">🌱</span>
                {flowers.length} flowers planted
              </span>
              <span className="flex items-center gap-2">
                <span className="text-lg">💚</span>
                Growing with love
              </span>
            </div>
          </div>
        </AnimatedSection>

        {/* Plant Form */}
        <AnimatedSection delay={400}>
          <Card className="max-w-md mx-auto p-6">
            <h3 className="font-display text-xl text-charcoal mb-4 text-center">Plant Your Flower</h3>
            <form onSubmit={plantFlower} className="flex gap-3">
              <input
                type="text"
                value={plantName}
                onChange={(e) => setPlantName(e.target.value)}
                placeholder="Your name"
                className="flex-1 px-4 py-3 rounded-xl border-2 border-warm-gray/20 focus:border-forest focus:ring-0 outline-none transition-colors bg-cream/50"
                maxLength={30}
              />
              <Button type="submit" disabled={isPlanting || !plantName.trim()}>
                {isPlanting ? '🌱' : '🌸 Plant'}
              </Button>
            </form>
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
// FAMILY TREE SECTION
// ============================================

const FamilyTreeSection = () => {
  const { t } = useLanguage();
  const [selectedMember, setSelectedMember] = useState(null);
  const [branchRef, branchVisible] = useScrollReveal();

  // Get grandchildren for a specific parent
  const getGrandchildrenForParent = (parentId) => {
    return FAMILY_DATA.grandchildren.filter(gc => gc.parentId === parentId);
  };

  return (
    <section id="family" className="py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Decorative tree elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 border border-forest/5 rounded-full animate-pulse-soft" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 border border-gold/5 rounded-full animate-pulse-soft" style={{ animationDelay: '-4s' }} />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SectionHeading eyebrow={t('family.eyebrow')} title={t('family.title')} subtitle={t('family.subtitle')} />

        <div className="flex flex-col items-center" ref={branchRef}>
          {/* Matriarch */}
          <AnimatedSection animation="zoom">
            <div className="text-center mb-8">
              <button onClick={() => setSelectedMember(FAMILY_DATA.matriarch)} className="group relative">
                {/* Glow effect */}
                <div className="absolute inset-0 w-32 h-32 mx-auto rounded-full bg-gold/20 animate-glow-pulse blur-xl" />
                <div className="relative w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-gold to-gold-dark p-1 shadow-gold-glow group-hover:scale-110 transition-all duration-500">
                  <div className="w-full h-full rounded-full bg-cream flex items-center justify-center group-hover:bg-gold/10 transition-colors duration-300">
                    <span className="text-4xl transition-transform duration-500 group-hover:scale-110">{FAMILY_DATA.matriarch.icon}</span>
                  </div>
                </div>
                <p className="mt-3 font-display text-xl text-charcoal group-hover:text-gold-dark transition-colors duration-300">{FAMILY_DATA.matriarch.name}</p>
                <p className="text-gold text-sm animate-gradient-text">{t('family.matriarch')}</p>
              </button>
            </div>
          </AnimatedSection>

          {/* Animated Connector Line from Matriarch */}
          <div className="w-px h-12 overflow-hidden">
            <div
              className="w-full bg-gradient-to-b from-gold to-burgundy/50 transition-all duration-700 ease-out"
              style={{ height: branchVisible ? '100%' : '0%', transitionDelay: '300ms' }}
            />
          </div>

          {/* Children Label */}
          <AnimatedSection delay={350}>
            <div className="text-center mb-6">
              <span className="inline-block px-4 py-1 bg-burgundy/10 text-burgundy rounded-full text-sm font-medium magnetic-hover">{t('family.children')}</span>
            </div>
          </AnimatedSection>

          {/* Children Row with Grandchildren Branches */}
          <AnimatedSection delay={400}>
            <div className="flex flex-wrap justify-center gap-16 md:gap-24">
              {FAMILY_DATA.children.map((child, index) => {
                const childGrandchildren = getGrandchildrenForParent(child.id);
                const hasGrandchildren = childGrandchildren.length > 0;

                return (
                  <div key={child.id} className="flex flex-col items-center">
                    {/* Child */}
                    <button
                      onClick={() => setSelectedMember(child)}
                      className="group text-center"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="relative">
                        <div className="absolute inset-0 w-20 h-20 mx-auto rounded-full bg-burgundy/20 scale-0 group-hover:scale-150 transition-transform duration-500 opacity-50" />
                        <div className="relative w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-burgundy to-burgundy-dark p-0.5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                          <div className="w-full h-full rounded-full bg-cream flex items-center justify-center group-hover:bg-burgundy/10 transition-colors duration-300">
                            <span className="text-2xl transition-transform duration-300 group-hover:scale-125">{child.icon}</span>
                          </div>
                        </div>
                      </div>
                      <p className="mt-2 text-sm font-medium text-charcoal group-hover:text-burgundy transition-colors duration-300 max-w-[120px]">{child.name}</p>
                    </button>

                    {/* Connector and Grandchildren under this child */}
                    {hasGrandchildren && (
                      <>
                        {/* Vertical connector from child */}
                        <div className="w-px h-8 overflow-hidden mt-4">
                          <div
                            className="w-full bg-gradient-to-b from-burgundy/30 to-forest/50 transition-all duration-700 ease-out"
                            style={{ height: branchVisible ? '100%' : '0%', transitionDelay: `${600 + index * 100}ms` }}
                          />
                        </div>

                        {/* Horizontal connector bar */}
                        {childGrandchildren.length > 1 && (
                          <div className="h-px overflow-hidden" style={{ width: `${(childGrandchildren.length - 1) * 80 + 40}px` }}>
                            <div
                              className="h-full bg-forest/40 transition-all duration-700 ease-out"
                              style={{ width: branchVisible ? '100%' : '0%', transitionDelay: `${700 + index * 100}ms` }}
                            />
                          </div>
                        )}

                        {/* Grandchildren */}
                        <div className="flex gap-6 mt-2">
                          {childGrandchildren.map((grandchild, gcIndex) => (
                            <div key={grandchild.id} className="flex flex-col items-center">
                              {/* Small vertical connector to each grandchild */}
                              <div className="w-px h-4 overflow-hidden">
                                <div
                                  className="w-full bg-forest/40 transition-all duration-500 ease-out"
                                  style={{ height: branchVisible ? '100%' : '0%', transitionDelay: `${800 + gcIndex * 50}ms` }}
                                />
                              </div>
                              <button
                                onClick={() => setSelectedMember(grandchild)}
                                className="group text-center"
                                style={{ animationDelay: `${gcIndex * 50}ms` }}
                              >
                                <div className="relative">
                                  <div className="absolute inset-0 w-14 h-14 mx-auto rounded-full bg-pink-200/30 scale-0 group-hover:scale-150 transition-transform duration-500 opacity-50" />
                                  <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-pink-400 to-pink-500 p-0.5 group-hover:scale-125 group-hover:-rotate-6 transition-all duration-500 shadow-md">
                                    <div className="w-full h-full rounded-full bg-cream flex items-center justify-center group-hover:bg-pink-50 transition-colors duration-300">
                                      <span className="text-xl transition-transform duration-300 group-hover:scale-110">{grandchild.icon}</span>
                                    </div>
                                  </div>
                                </div>
                                <p className="mt-2 text-xs font-medium text-charcoal group-hover:text-pink-500 transition-colors duration-300">{grandchild.name}</p>
                              </button>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </AnimatedSection>

          {/* Grandchildren Label */}
          <AnimatedSection delay={900}>
            <div className="text-center mt-8">
              <span className="inline-block px-4 py-1 bg-pink-100 text-pink-600 rounded-full text-sm font-medium magnetic-hover">{t('family.grandchildren')}</span>
            </div>
          </AnimatedSection>
        </div>

        {/* Member Modal */}
        {selectedMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/80 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedMember(null)}>
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-scale-in text-center" onClick={e => e.stopPropagation()}>
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-gold to-gold-dark p-1 mb-4 animate-glow-pulse">
                <div className="w-full h-full rounded-full bg-cream flex items-center justify-center">
                  <span className="text-4xl">{selectedMember.icon || '👤'}</span>
                </div>
              </div>
              <h3 className="font-display text-2xl text-charcoal mb-2">{selectedMember.name}</h3>
              {selectedMember.title && <p className="text-gold">{selectedMember.title}</p>}
              {selectedMember.relation && <p className="text-warm-gray">{selectedMember.relation}</p>}
              {selectedMember.years && <p className="text-warm-gray text-sm mt-2">{selectedMember.years}</p>}
              <button onClick={() => setSelectedMember(null)} className="mt-6 px-6 py-2 bg-gold text-white rounded-full hover:bg-gold-dark hover:scale-105 active:scale-95 transition-all duration-300">
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
                  <div key={tribute.id} className="aspect-video bg-charcoal rounded-xl overflow-hidden relative group">
                    {tribute.type === 'video' ? (
                      <video src={tribute.url} controls className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4">
                        {/* Animated Waveform Visualization */}
                        <div className="flex items-center justify-center gap-1 mb-4 h-16">
                          {Array.from({ length: 12 }).map((_, i) => (
                            <div
                              key={i}
                              className="w-1 bg-gradient-to-t from-gold to-gold-light rounded-full animate-waveform"
                              style={{
                                height: `${20 + Math.random() * 30}px`,
                                animationDelay: `${i * 0.1}s`,
                                animationDuration: `${0.4 + Math.random() * 0.3}s`,
                              }}
                            />
                          ))}
                        </div>
                        <audio src={tribute.url} controls className="w-full" />
                        <p className="text-white/60 text-xs mt-2">Audio Tribute</p>
                      </div>
                    )}
                    {/* Play overlay for video */}
                    {tribute.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-charcoal/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="w-12 h-12 rounded-full bg-gold/90 flex items-center justify-center">
                          <svg className="w-5 h-5 ml-1 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
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

        {/* Entries List - Animated Guestbook Signatures */}
        <div className="space-y-6">
          {entries.map((entry, index) => (
            <AnimatedSection key={entry.id} delay={index * 100}>
              <Card className="p-6 border-l-4 border-gold relative overflow-hidden group" hover={false}>
                {/* Decorative corner flourish */}
                <div className="absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <svg className="w-full h-full text-gold/20" viewBox="0 0 100 100">
                    <path d="M100 0 Q60 40 100 100" fill="none" stroke="currentColor" strokeWidth="2" className="animate-draw-path" style={{ strokeDasharray: 200, strokeDashoffset: 200 }} />
                  </svg>
                </div>

                {/* Message with typewriter effect container */}
                <div className="relative">
                  <span className="absolute -left-2 -top-2 text-4xl text-gold/20 font-serif">"</span>
                  <p className="text-charcoal text-lg italic mb-4 pl-4 pr-6">{entry.message}</p>
                  <span className="absolute -right-1 bottom-2 text-4xl text-gold/20 font-serif rotate-180">"</span>
                </div>

                {/* Signature area with animated underline */}
                <div className="flex items-center justify-between flex-wrap gap-4 pt-4 border-t border-gold/10">
                  <div className="flex items-center gap-3">
                    {/* Animated avatar with pulse */}
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-gold/30 animate-ping opacity-0 group-hover:opacity-100" style={{ animationDuration: '2s' }} />
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-white font-medium shadow-gold-glow transition-transform duration-300 group-hover:scale-110">
                        {entry.name.charAt(0)}
                      </div>
                    </div>
                    <div>
                      {/* Animated signature-style name */}
                      <p className="font-display text-lg text-charcoal group-hover:text-gold transition-colors duration-300 relative">
                        {entry.name}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold transition-all duration-500 group-hover:w-full" />
                      </p>
                      {entry.location && (
                        <p className="text-sm text-warm-gray flex items-center gap-1">
                          <span className="inline-block w-1 h-1 rounded-full bg-gold" />
                          {entry.location}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-warm-gray italic">{entry.date}</span>
                </div>

                {/* Subtle paper texture effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />
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
