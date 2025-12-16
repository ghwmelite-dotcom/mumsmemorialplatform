import { useState, useEffect } from 'react';

// Kente-inspired geometric pattern SVG
const KentePattern = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" preserveAspectRatio="none">
    <defs>
      <pattern id="kente" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <rect width="20" height="20" fill="#1a1a1a"/>
        <rect x="0" y="0" width="5" height="20" fill="#D4AF37"/>
        <rect x="10" y="0" width="5" height="20" fill="#1A5D1A"/>
        <rect x="0" y="5" width="20" height="5" fill="#8B1538"/>
        <rect x="0" y="15" width="20" height="5" fill="#D4AF37"/>
      </pattern>
    </defs>
    <rect width="100" height="100" fill="url(#kente)"/>
  </svg>
);

// Custom CSS styles
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Lato:wght@300;400;500;700&display=swap');
  
  .memorial-container * { box-sizing: border-box; }
  .font-display { font-family: 'Cormorant Garamond', serif; font-weight: 500; }
  .font-body { font-family: 'Lato', sans-serif; }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn { animation: fadeIn 1s ease-out forwards; }
  
  .memorial-container::-webkit-scrollbar { width: 8px; }
  .memorial-container::-webkit-scrollbar-track { background: #1C1917; }
  .memorial-container::-webkit-scrollbar-thumb { background: #D4AF37; border-radius: 4px; }
`;

// Navigation Component
const Navigation = ({ activeSection, setActiveSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'life', label: 'Her Life' },
    { id: 'funeral', label: 'Funeral' },
    { id: 'guestbook', label: 'Guestbook' },
    { id: 'tribute', label: 'Tributes' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled ? 'bg-stone-900/95 backdrop-blur-md shadow-xl' : 'bg-transparent'
    }`} style={{ backgroundColor: isScrolled ? 'rgba(28, 25, 23, 0.95)' : 'transparent' }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <span className="font-display text-lg tracking-wide" style={{ color: '#D4AF37' }}>
            In Loving Memory
          </span>
          
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className="px-4 py-2 text-sm tracking-wide transition-all duration-300 rounded"
                style={{
                  color: activeSection === item.id ? '#D4AF37' : '#D6D3D1',
                  backgroundColor: activeSection === item.id ? 'rgba(212, 175, 55, 0.1)' : 'transparent'
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
            style={{ color: '#D4AF37' }}
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

        {mobileMenuOpen && (
          <div className="md:hidden backdrop-blur-md border-t animate-fadeIn" 
               style={{ backgroundColor: 'rgba(28, 25, 23, 0.98)', borderColor: 'rgba(212, 175, 55, 0.2)' }}>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveSection(item.id); setMobileMenuOpen(false); }}
                className="block w-full text-left px-4 py-3 text-sm tracking-wide transition-all"
                style={{ color: activeSection === item.id ? '#D4AF37' : '#D6D3D1' }}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

// Hero Section
const HeroSection = () => {
  const calculateAge = () => {
    const birth = new Date(1948, 6, 15);
    const death = new Date(2025, 11, 14);
    return Math.floor((death - birth) / (365.25 * 24 * 60 * 60 * 1000));
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden"
             style={{ background: 'linear-gradient(to bottom, #0C0A09, #1C1917, #0C0A09)' }}>
      
      {/* Kente border accents */}
      <div className="absolute top-0 left-0 right-0 h-2 opacity-80">
        <KentePattern className="w-full h-full" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-2 opacity-80">
        <KentePattern className="w-full h-full" />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(212, 175, 55, 0.05)' }} />
      <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(139, 21, 56, 0.1)' }} />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fadeIn">
        {/* Photo placeholder */}
        <div className="mb-8 inline-block">
          <div className="w-48 h-48 md:w-64 md:h-64 mx-auto rounded-full overflow-hidden shadow-2xl"
               style={{ border: '4px solid rgba(212, 175, 55, 0.6)', backgroundColor: '#292524' }}>
            <div className="w-full h-full flex items-center justify-center" style={{ color: '#57534E' }}>
              <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
          </div>
          <p className="text-sm mt-3 italic" style={{ color: '#78716C' }}>Photo coming soon</p>
        </div>

        <p className="tracking-widest uppercase text-sm md:text-base mb-4 font-light" style={{ color: 'rgba(212, 175, 55, 0.8)', letterSpacing: '0.3em' }}>
          Sunrise · July 15, 1948 — Sunset · December 14, 2025
        </p>
        
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl mb-4 leading-tight" style={{ color: '#FAF8F5' }}>
          Josephine Worla Ameovi
        </h1>
        
        <p className="text-2xl md:text-3xl font-light mb-6 italic" style={{ color: '#D4AF37' }}>
          "Grandma"
        </p>

        <div className="flex items-center justify-center gap-4 mb-8" style={{ color: '#A8A29E' }}>
          <span className="h-px w-12" style={{ backgroundColor: 'rgba(212, 175, 55, 0.4)' }} />
          <span className="text-lg">{calculateAge()} Years of Grace</span>
          <span className="h-px w-12" style={{ backgroundColor: 'rgba(212, 175, 55, 0.4)' }} />
        </div>

        <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-8" style={{ color: '#D6D3D1' }}>
          A beloved mother, grandmother, and pillar of her community. 
          Daughter of the Volta Region, speaker of Ewe, Ga, and English — 
          her wisdom transcended language.
        </p>

        <div className="mt-8" style={{ color: 'rgba(212, 175, 55, 0.6)' }}>
          <p className="text-sm tracking-widest uppercase mb-2">Rest in Perfect Peace</p>
          <div className="text-4xl">🕊️</div>
        </div>
      </div>
    </section>
  );
};

// Life Story Section
const LifeSection = () => {
  return (
    <section id="life" className="py-20 md:py-32 relative" style={{ backgroundColor: '#0C0A09' }}>
      <div className="absolute left-0 top-0 bottom-0 w-1" 
           style={{ background: 'linear-gradient(to bottom, transparent, rgba(212, 175, 55, 0.4), transparent)' }} />
      
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <p className="tracking-widest uppercase text-sm mb-4" style={{ color: '#D4AF37', letterSpacing: '0.3em' }}>Her Journey</p>
          <h2 className="font-display text-3xl md:text-5xl mb-6" style={{ color: '#FAF8F5' }}>A Life Well Lived</h2>
          <div className="w-24 h-1 mx-auto" style={{ background: 'linear-gradient(to right, transparent, #D4AF37, transparent)' }} />
        </div>

        <div className="space-y-8 leading-relaxed" style={{ color: '#D6D3D1' }}>
          <div className="p-8 rounded-lg" style={{ backgroundColor: 'rgba(28, 25, 23, 0.5)', borderLeft: '4px solid rgba(212, 175, 55, 0.6)' }}>
            <h3 className="font-display text-xl mb-4" style={{ color: '#D4AF37' }}>Early Life</h3>
            <p className="text-lg">
              Josephine Worla Ameovi was born on July 15, 1948, in the Volta Region of Ghana. 
              From her earliest days, she embodied the rich cultural heritage of the Ewe people, 
              growing up surrounded by the traditions, values, and warmth that would define her entire life.
            </p>
            <p className="mt-4 text-sm italic" style={{ color: '#78716C' }}>
              [More details about her childhood can be added here]
            </p>
          </div>

          <div className="p-8 rounded-lg" style={{ backgroundColor: 'rgba(28, 25, 23, 0.5)', borderLeft: '4px solid rgba(26, 93, 26, 0.6)' }}>
            <h3 className="font-display text-xl mb-4" style={{ color: '#D4AF37' }}>Family & Motherhood</h3>
            <p className="text-lg">
              As a mother, Grandma Josephine was the cornerstone of her family. Her home was always 
              open, her kitchen always full, and her wisdom always available to those who sought it.
            </p>
          </div>

          <div className="p-8 rounded-lg" style={{ backgroundColor: 'rgba(28, 25, 23, 0.5)', borderLeft: '4px solid rgba(139, 21, 56, 0.6)' }}>
            <h3 className="font-display text-xl mb-4" style={{ color: '#D4AF37' }}>Legacy & Community</h3>
            <p className="text-lg">
              Known affectionately as "Grandma" by most who knew her, Josephine touched countless lives 
              through her kindness. She was fluent in Ewe, Ga, and English — a testament to her connection 
              with people from all walks of life.
            </p>
          </div>

          <div className="text-center mt-16 p-8 rounded-lg" 
               style={{ background: 'linear-gradient(to right, rgba(212, 175, 55, 0.05), rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05))' }}>
            <p className="italic text-xl font-display" style={{ color: '#D4AF37' }}>
              "She lived not for herself, but for all those she loved."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// Funeral Details Section
const FuneralSection = () => {
  const events = [
    { title: "Filing Past / Laying in State", date: "Date to be announced", time: "Time TBA", venue: "Venue TBA", dress: "Traditional (Kente or black/red)", icon: "🕯️" },
    { title: "Funeral Service", date: "Date to be announced", time: "Time TBA", venue: "Venue TBA", dress: "Traditional attire", icon: "⛪" },
    { title: "Burial", date: "Date to be announced", time: "After service", venue: "Cemetery TBA", dress: "Traditional attire", icon: "🌹" },
    { title: "Reception / Thanksgiving", date: "Date to be announced", time: "After burial", venue: "Venue TBA", dress: "Smart casual", icon: "🎉" }
  ];

  return (
    <section id="funeral" className="py-20 md:py-32 relative overflow-hidden" style={{ backgroundColor: '#0C0A09' }}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-16">
          <p className="tracking-widest uppercase text-sm mb-4" style={{ color: '#D4AF37', letterSpacing: '0.3em' }}>Celebration of Life</p>
          <h2 className="font-display text-3xl md:text-5xl mb-6" style={{ color: '#FAF8F5' }}>Funeral Programme</h2>
          <div className="w-24 h-1 mx-auto" style={{ background: 'linear-gradient(to right, transparent, #D4AF37, transparent)' }} />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {events.map((event, index) => (
            <div key={index} className="p-6 md:p-8 rounded-xl transition-all duration-300"
                 style={{ background: 'linear-gradient(to bottom right, #1C1917, rgba(28, 25, 23, 0.5))', border: '1px solid #292524' }}>
              <div className="flex items-start gap-4">
                <span className="text-3xl">{event.icon}</span>
                <div className="flex-1">
                  <h3 className="font-display text-xl mb-3" style={{ color: '#D4AF37' }}>{event.title}</h3>
                  <div className="space-y-2" style={{ color: '#D6D3D1' }}>
                    <p className="flex items-center gap-2">
                      <span style={{ color: 'rgba(212, 175, 55, 0.6)' }}>📅</span> {event.date}
                    </p>
                    <p className="flex items-center gap-2">
                      <span style={{ color: 'rgba(212, 175, 55, 0.6)' }}>🕐</span> {event.time}
                    </p>
                    <p className="flex items-center gap-2">
                      <span style={{ color: 'rgba(212, 175, 55, 0.6)' }}>📍</span> {event.venue}
                    </p>
                  </div>
                  <div className="mt-4 pt-4" style={{ borderTop: '1px solid #292524' }}>
                    <p className="text-sm" style={{ color: 'rgba(212, 175, 55, 0.8)' }}>
                      <span style={{ color: '#78716C' }}>Dress Code:</span> {event.dress}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Guestbook Section
const GuestbookSection = () => {
  const [entries, setEntries] = useState([
    { id: 1, name: "The Family", location: "Accra, Ghana", message: "We welcome all who knew and loved Grandma to share their memories here.", date: "December 2025" }
  ]);
  const [formData, setFormData] = useState({ name: '', location: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.message) return;
    
    const newEntry = {
      id: entries.length + 1,
      ...formData,
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };
    setEntries([newEntry, ...entries]);
    setFormData({ name: '', location: '', message: '' });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section id="guestbook" className="py-20 md:py-32" style={{ backgroundColor: '#1C1917' }}>
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <p className="tracking-widest uppercase text-sm mb-4" style={{ color: '#D4AF37', letterSpacing: '0.3em' }}>Share Your Memories</p>
          <h2 className="font-display text-3xl md:text-5xl mb-6" style={{ color: '#FAF8F5' }}>Guestbook</h2>
          <div className="w-24 h-1 mx-auto" style={{ background: 'linear-gradient(to right, transparent, #D4AF37, transparent)' }} />
        </div>

        <div className="p-6 md:p-8 rounded-xl mb-12" style={{ backgroundColor: '#0C0A09', border: '1px solid #292524' }}>
          <h3 className="font-display text-xl mb-6" style={{ color: '#D4AF37' }}>Leave a Message</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2" style={{ color: '#A8A29E' }}>Your Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full rounded-lg px-4 py-3 transition-colors outline-none"
                  style={{ backgroundColor: '#1C1917', border: '1px solid #44403C', color: '#FAF8F5' }}
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: '#A8A29E' }}>Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full rounded-lg px-4 py-3 transition-colors outline-none"
                  style={{ backgroundColor: '#1C1917', border: '1px solid #44403C', color: '#FAF8F5' }}
                  placeholder="City, Country"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm mb-2" style={{ color: '#A8A29E' }}>Your Message *</label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full rounded-lg px-4 py-3 transition-colors outline-none resize-none"
                style={{ backgroundColor: '#1C1917', border: '1px solid #44403C', color: '#FAF8F5' }}
                placeholder="Share a memory or condolence..."
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3 rounded-lg font-medium transition-all"
              style={{ backgroundColor: '#D4AF37', color: '#0C0A09' }}
            >
              {submitted ? '✓ Message Sent' : 'Sign Guestbook'}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          {entries.map((entry) => (
            <div key={entry.id} className="p-6 rounded-xl" style={{ backgroundColor: 'rgba(12, 10, 9, 0.5)', borderLeft: '4px solid rgba(212, 175, 55, 0.4)' }}>
              <p className="text-lg mb-4 italic" style={{ color: '#D6D3D1' }}>"{entry.message}"</p>
              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-medium" style={{ color: '#D4AF37' }}>{entry.name}</span>
                  {entry.location && <span style={{ color: '#78716C' }}> • {entry.location}</span>}
                </div>
                <span style={{ color: '#57534E' }}>{entry.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Tributes Section
const TributeSection = () => {
  return (
    <section id="tribute" className="py-20 md:py-32" style={{ backgroundColor: '#0C0A09' }}>
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <p className="tracking-widest uppercase text-sm mb-4" style={{ color: '#D4AF37', letterSpacing: '0.3em' }}>Honor Her Memory</p>
          <h2 className="font-display text-3xl md:text-5xl mb-6" style={{ color: '#FAF8F5' }}>Tributes & Contributions</h2>
          <div className="w-24 h-1 mx-auto" style={{ background: 'linear-gradient(to right, transparent, #D4AF37, transparent)' }} />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-8 rounded-xl" style={{ background: 'linear-gradient(to bottom right, #1C1917, rgba(28, 25, 23, 0.5))', border: '1px solid #292524' }}>
            <div className="text-4xl mb-4">💝</div>
            <h3 className="font-display text-xl mb-4" style={{ color: '#D4AF37' }}>Funeral Contributions</h3>
            <p className="mb-6" style={{ color: '#A8A29E' }}>
              Your generous contributions help the family give Grandma Josephine the dignified send-off she deserves.
            </p>
            <div className="p-4 rounded-lg mb-4" style={{ backgroundColor: '#0C0A09' }}>
              <p className="text-sm mb-2" style={{ color: '#78716C' }}>Bank Details</p>
              <p style={{ color: '#D6D3D1' }}>Account details coming soon</p>
              <p className="text-sm mt-2" style={{ color: '#78716C' }}>Mobile Money</p>
              <p style={{ color: '#D6D3D1' }}>Number coming soon</p>
            </div>
          </div>

          <div className="p-8 rounded-xl" style={{ background: 'linear-gradient(to bottom right, #1C1917, rgba(28, 25, 23, 0.5))', border: '1px solid #292524' }}>
            <div className="text-4xl mb-4">📜</div>
            <h3 className="font-display text-xl mb-4" style={{ color: '#D4AF37' }}>Order of Service</h3>
            <p className="mb-6" style={{ color: '#A8A29E' }}>
              Download the funeral programme when available.
            </p>
            <button 
              className="px-6 py-3 rounded-lg font-medium transition-all"
              style={{ backgroundColor: 'transparent', border: '2px solid #D4AF37', color: '#D4AF37', opacity: 0.5, cursor: 'not-allowed' }}
              disabled
            >
              Coming Soon
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => {
  return (
    <footer className="py-12 relative" style={{ backgroundColor: '#0C0A09' }}>
      <div className="absolute top-0 left-0 right-0 h-1 opacity-60">
        <KentePattern className="w-full h-full" />
      </div>
      
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="mb-6">
          <p className="font-display text-2xl mb-2" style={{ color: '#D4AF37' }}>Josephine Worla Ameovi</p>
          <p style={{ color: '#A8A29E' }}>"Grandma"</p>
          <p className="mt-2" style={{ color: '#78716C' }}>July 15, 1948 — December 14, 2025</p>
        </div>
        
        <div className="w-16 h-px mx-auto my-6" style={{ backgroundColor: 'rgba(212, 175, 55, 0.4)' }} />
        
        <p className="text-sm" style={{ color: '#78716C' }}>
          Forever in our hearts 💛
        </p>

        <div className="mt-8 p-6 rounded-xl" style={{ background: 'linear-gradient(to right, rgba(212, 175, 55, 0.05), rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05))' }}>
          <p className="italic" style={{ color: '#FAF8F5' }}>"Mía wò kpɔ́ fú o"</p>
          <p className="text-sm mt-2" style={{ color: '#A8A29E' }}>(We will meet again) — Ewe proverb</p>
        </div>
        
        <p className="text-xs mt-8" style={{ color: '#57534E' }}>
          Built with love by the family
        </p>
      </div>
    </footer>
  );
};

// Main App
export default function App() {
  const [activeSection, setActiveSection] = useState('home');

  return (
    <>
      <style>{styles}</style>
      <div className="memorial-container font-body min-h-screen" style={{ backgroundColor: '#0C0A09', color: '#FAF8F5' }}>
        <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
        <HeroSection />
        <LifeSection />
        <FuneralSection />
        <GuestbookSection />
        <TributeSection />
        <Footer />
      </div>
    </>
  );
}
