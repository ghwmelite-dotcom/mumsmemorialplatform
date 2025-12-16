# In Loving Memory of Josephine Worla Ameovi

## Grandma (July 15, 1948 – December 14, 2025)

A dignified memorial website honoring the life of Josephine Worla Ameovi, affectionately known as "Grandma" by all who knew her.

---

## 🕊️ About This Project

This memorial platform serves both as a tribute to Grandma's life and a coordination tool for funeral arrangements. Built with love, incorporating Ghanaian cultural elements and kente-inspired design.

## 🎨 Design Features

- **Kente-inspired color palette**: Gold, burgundy, forest green, and deep stone tones
- **Typography**: Elegant Cormorant Garamond for headings, clean Lato for body
- **Cultural elements**: Ewe proverbs, kente pattern accents
- **Responsive**: Works beautifully on mobile, tablet, and desktop

## 📋 Sections

1. **Home/Hero** - Memorial banner with photo, name, dates
2. **Her Life** - Biography and life story
3. **Gallery** - Photo memories
4. **Funeral Details** - Schedule, venues, dress code
5. **Guestbook** - Digital condolences
6. **Tributes** - Contributions and order of service
7. **Contact** - Family contact information

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

```bash
# Navigate to project
cd grandma-josephine-memorial

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the site.

### Build for Production

```bash
npm run build
```

### Deploy to Cloudflare Pages

```bash
npm run deploy
```

Or connect GitHub repository to Cloudflare Pages for automatic deployments.

---

## ✏️ Customization Guide

### Adding Photos

1. Add images to `/public/photos/` directory
2. Update the gallery section in `src/App.jsx`:

```jsx
const photos = [
  { id: 1, src: '/photos/grandma-1.jpg', caption: 'With family, 1985' },
  { id: 2, src: '/photos/grandma-2.jpg', caption: 'Her wedding day' },
  // ... more photos
];
```

### Updating Funeral Details

In `src/App.jsx`, find the `FuneralSection` component and update the `events` array:

```jsx
const events = [
  {
    title: "Filing Past / Laying in State",
    date: "Saturday, January 4, 2025",      // Update this
    time: "8:00 AM - 12:00 PM",             // Update this
    venue: "Community Hall, Ho",             // Update this
    address: "123 Main Street, Ho, Volta",   // Update this
    dress: "Traditional attire (Kente or black/red)",
    icon: "🕯️"
  },
  // ... update other events
];
```

### Adding Biography Content

Find the `LifeSection` component and fill in the biography paragraphs:

```jsx
<div className="bg-stone-900/50 p-8 rounded-lg border-l-4 border-gold/60">
  <h3 className="font-display text-xl text-gold mb-4">Early Life</h3>
  <p className="text-lg">
    Your detailed content about her early life here...
  </p>
</div>
```

### Contact Information

Update the `ContactSection` component with family phone numbers:

```jsx
<p className="flex items-center gap-3">
  <span className="text-gold">📞</span>
  <span>+233 XX XXX XXXX (Son - Kofi)</span>
</p>
```

### Contribution Details

Update bank/Mobile Money details in `TributeSection`:

```jsx
<div className="bg-stone-950 p-4 rounded-lg mb-4">
  <p className="text-stone-500 text-sm mb-2">Bank Details</p>
  <p className="text-stone-300">Bank Name: GCB Bank</p>
  <p className="text-stone-300">Account: 123456789</p>
  <p className="text-stone-300">Name: Family Name</p>
  <p className="text-stone-500 text-sm mt-2">Mobile Money</p>
  <p className="text-stone-300">MTN: 024 XXX XXXX</p>
</div>
```

---

## 📁 Project Structure

```
grandma-josephine-memorial/
├── public/
│   ├── favicon.svg
│   └── photos/          # Add family photos here
├── src/
│   ├── App.jsx          # Main application
│   ├── main.jsx         # Entry point
│   └── index.css        # Styles
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── wrangler.toml        # Cloudflare config
```

---

## 🌐 Deployment Options

### Option 1: Cloudflare Pages (Recommended)

1. Push code to GitHub
2. Go to Cloudflare Dashboard → Pages
3. Create project → Connect to GitHub
4. Build settings:
   - Framework: None
   - Build command: `npm run build`
   - Output directory: `dist`

### Option 2: Netlify

1. Push code to GitHub
2. Connect repo to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`

### Option 3: Vercel

```bash
npm i -g vercel
vercel
```

---

## 🙏 Features Coming Soon

- [ ] Photo upload functionality
- [ ] RSVP form with database
- [ ] Livestream integration
- [ ] WhatsApp sharing buttons
- [ ] Downloadable Order of Service PDF

---

## 💛 Built With Love

This memorial was created to honor the memory of Grandma Josephine, a beloved mother and grandmother whose warmth touched everyone she met.

*"Mía wò kpɔ́ fú o"* — We will meet again.

---

May her soul rest in perfect peace. 🕊️
