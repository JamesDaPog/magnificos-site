import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

// ─────────────────────────────────────────────────
// BRAND
// ─────────────────────────────────────────────────
const BRAND = "#c41e3a";   // refined crimson
const CREAM = "#faf8f5";   // warm cream
const DARK  = "#1a1a1a";   // near-black with warmth
const WARM  = "#5c4f47";   // warm brown-gray for body copy (8:1 contrast)
const MUTED = "#6e6460";   // warm medium-gray for secondary text (5.3:1 — WCAG AA)

// Asymmetric leaf — the signature shape
const LEAF      = "22px 4px 22px 4px";
const LEAFR     = "4px 22px 4px 22px";
const LEAFR_TOP = "4px 22px 0 0";
const LEAFR_BOT = "0 0 4px 22px";

// ─────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Menu",    path: "/menu"    },
  { label: "About",   path: "/about"   },
  { label: "Reviews", path: "/reviews" },
  { label: "Visit",   path: "/visit"   },
];

const FLAVORS = [
  { name: "Pistachio",             desc: "Rich & creamy with roasted pistachio pieces throughout.", img: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&q=80", dot: "#16a34a" },
  { name: "Cookies & Cream",       desc: "Velvety vanilla loaded with Oreo cookie crumble.",        img: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=500&q=80", dot: "#374151" },
  { name: "Strawberry Cheesecake", desc: "Fresh strawberries swirled with a graham cracker crust.", img: "https://images.unsplash.com/photo-1488900128323-21503983a07e?w=500&q=80", dot: "#e11d48" },
  { name: "Mint Chip",             desc: "Cool peppermint with dark chocolate pieces throughout.",   img: "https://images.unsplash.com/photo-1532635241-17e820acc59f?w=500&q=80", dot: "#0d9488" },
  { name: "Vanilla Bean",          desc: "Pure Madagascar vanilla — simple and absolutely perfect.", img: "https://images.unsplash.com/photo-1611293388250-580b08c4a145?w=500&q=80", dot: "#ca8a04" },
];

const MENU_CATEGORIES = [
  {
    name: "Ice Cream",
    sub: "30+ handmade flavors",
    desc: "Made fresh daily with premium ingredients. Pick from our permanent lineup or try one of our rotating specials — availability changes, so call ahead to confirm.",
    sections: [
      { label: "All Day Every Day", flavors: ["Vanilla","Chocolate","Pistachio","Butter Pecan","Coffee","Salted Caramel","Cake Batter","Cotton Candy","Chocolate Chip Mint"] },
      { label: "Rotating",          flavors: ["Oreo Cookie","Toasted Coconut","Strawberry","Black Raspberry","Peanut Butter","German Chocolate","Key Lime Pie","Coconut Cream","Nutella","Hazelnut","Banana","Mango","Blueberry"] },
      { label: "Seasonal",          flavors: ["Pumpkin","Orange Creamsicle","Candy Cane Peppermint"] },
    ],
  },
  {
    name: "Gelato",
    sub: "Authentic Italian style",
    desc: "Denser, richer, and more intensely flavored than regular ice cream. Our gelato is crafted the traditional Italian way — less air, more taste.",
    sections: [
      { label: "Flavors", flavors: ["Pistachio","Chocolate","Vanilla","Hazelnut","Strawberry","Nutella"] },
    ],
  },
  {
    name: "Sundaes",
    sub: "Built your way",
    desc: "Start with any flavor and stack on the toppings. Hot fudge, caramel, whipped cream, sprinkles, cherries — built exactly how you want it.",
    sections: [
      { label: "Build with any of our ice cream flavors", flavors: ["Vanilla","Chocolate","Pistachio","Butter Pecan","Coffee","Salted Caramel","Cake Batter","Oreo Cookie","Strawberry","Cotton Candy"] },
    ],
  },
  {
    name: "Milkshakes",
    sub: "Thick & creamy blends",
    desc: "Blended thick and served ice cold. Made with real Magnifico's ice cream for a rich, old-school shake you won't find anywhere else.",
    sections: [
      { label: "Shake Flavors", flavors: ["Black & White","Mocha","Cookies & Cream","Maple Walnut"] },
    ],
  },
  {
    name: "Italian Ice",
    sub: "Light & refreshing",
    desc: "Dairy-free, fat-free, and perfect on a hot day. Smooth, icy, and packed with real fruit flavor — a Route 18 summer staple.",
    sections: [
      { label: "Flavors", flavors: ["Lemon","Cherry","Mango","Bubble Gum","Sour Apple","Blue Raspberry","Watermelon","Orange","Red Raspberry"] },
    ],
  },
  {
    name: "Non-Dairy & Fat Free",
    sub: "Vegan · GF options",
    desc: "Everyone deserves a treat. We offer vegan, gluten-free, and no-sugar-added options so no one has to miss out.",
    sections: [
      { label: "Non-Dairy · Gluten Free · Vegan", flavors: ["Pineapple Dole Soft Serve","Orange Dole Soft Serve"] },
      { label: "Fat Free Yogurt (no sugar added)",  flavors: ["Vanilla","Chocolate"] },
    ],
  },
  {
    name: "Ice Cream Cakes",
    sub: "Custom celebrations",
    desc: "Make any occasion unforgettable with a custom Magnifico's ice cream cake. Call ahead to order — we'll build it with your favorite flavors.",
    sections: [
      { label: "Popular cake flavors", flavors: ["Vanilla","Chocolate","Oreo Cookie","Strawberry","Cake Batter","Pistachio","Butter Pecan","Coffee"] },
    ],
  },
  {
    name: "Toppings",
    sub: "28 toppings to pile on",
    desc: "Pile on as many as you want. We carry over 28 toppings — candy, crunch, nuts, fruit, and everything in between. Make it yours.",
    sections: [
      { label: "Candy & Fun",      flavors: ["Rainbow Sprinkles","Chocolate Sprinkles","M&Ms","Reese's Pieces","Peanut Butter Cups","Sour Worms","Sour Patch Kids","Swedish Fish","Gummi Bears","Maraschino Cherries"] },
      { label: "Cookie & Brownie", flavors: ["Oreos","Chocolate Chips","Cookie Dough","Brownie Bites","Graham Crackers","Heath Bar","Chocolate Crunch","Waffle Cone Crunch"] },
      { label: "Nuts & Extras",    flavors: ["Dry Walnuts","Toasted Almond Crunch","Pecans","Salted Almonds","Chopped Peanuts","Coconut","Toasted Coconut","Malt Powder","Whipped Cream","Nutella"] },
    ],
  },
];

const REVIEWS = [
  { name: "Sarah M.",    location: "East Brunswick, NJ", text: "The pistachio here is absolutely phenomenal. Best I've ever had — and I've been going since I was a kid. A true East Brunswick treasure.", avatar: "S" },
  { name: "Mike T.",     location: "New Brunswick, NJ",  text: "Magnifico's is a staple in our family. The homemade quality is unmatched. You can taste the care from the very first bite. Never disappoints.", avatar: "M" },
  { name: "Jennifer L.", location: "Piscataway, NJ",     text: "Every flavor is made with love and you can taste it. The sundaes are generous, the staff is always warm. This place is genuinely special.", avatar: "J" },
];

const HOURS = [
  { day: "Sunday – Thursday", time: "11:00 AM – 10:30 PM" },
  { day: "Friday – Saturday",  time: "11:00 AM – 11:00 PM" },
];

const ABOUT_STATS = [
  { num: "44+", label: "Years Open"    },
  { num: "30+", label: "Flavors Daily" },
  { num: "#1",  label: "In Central NJ" },
];


// ─────────────────────────────────────────────────
// ANIMATION PRESETS
// ─────────────────────────────────────────────────
const ease = [0.22, 0.03, 0.26, 1];

const fadeUp = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.32, ease } },
};

const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.28, ease } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.055, delayChildren: 0.02 } },
};

// ─────────────────────────────────────────────────
// PODIUM
// ─────────────────────────────────────────────────
const COL_SHAFT = "#f0ebe4";
const COL_CAP   = "#e2dbd2";
const COL_BASE  = "#d4cdc4";
const FLUTING   = "repeating-linear-gradient(90deg, rgba(0,0,0,0.055) 0px, rgba(0,0,0,0.055) 3px, transparent 3px, transparent 18px)";

const PODIUM_DATA = [
  { rank: "II",  name: "Strawberry",  h: 180, delay: 0.1  },
  { rank: "I",   name: "Oreo Cookie", h: 256, delay: 0    },
  { rank: "III", name: "Cake Batter", h: 128, delay: 0.18 },
];

function Podium() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-60px 0px" });

  return (
    <div className="mb-20">
      <Reveal className="text-center mb-14">
        <Label>Fan Favorites</Label>
        <motion.h2 variants={fadeUp}
          className="font-display font-bold mt-4 mb-3"
          style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", color: DARK, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
          Top 3 Flavors
        </motion.h2>
        <motion.p variants={fadeUp} className="text-[16px] italic"
          style={{ color: "#9a8c84", fontFamily: "'Fraunces', Georgia, serif" }}>
          Their favorites, every single time.
        </motion.p>
      </Reveal>

      <div ref={ref} className="flex items-end justify-center gap-5 sm:gap-8 px-4">
        {PODIUM_DATA.map(({ rank, name, h, delay }) => {
          const isFirst = rank === "I";
          return (
            <motion.div key={rank}
              className="flex flex-col items-center"
              style={{ flex: "1 1 0", maxWidth: 168 }}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
              transition={{ delay, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}>

              <p className="font-semibold text-[13px] sm:text-[15px] text-center leading-tight mb-3 px-1"
                style={{ color: isFirst ? BRAND : "#4b4540" }}>
                {name}
              </p>

              <div style={{ width: "92%", height: 14, background: COL_CAP,
                borderRadius: "5px 5px 0 0",
                boxShadow: "0 2px 4px rgba(0,0,0,0.06)" }} />
              <div style={{ width: "76%", height: 7, background: COL_SHAFT }} />

              <div style={{
                width: "76%", height: h,
                background: COL_SHAFT,
                backgroundImage: FLUTING,
                boxShadow: "inset -3px 0 6px rgba(0,0,0,0.04), inset 3px 0 6px rgba(0,0,0,0.04)",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: 6,
              }}>
                <span className="font-display select-none"
                  style={{
                    fontSize: "clamp(1.6rem, 2.8vw, 2.2rem)",
                    color: isFirst ? BRAND : "#8a8078",
                    fontStyle: "italic",
                    letterSpacing: "0.02em",
                  }}>
                  {rank}
                </span>
              </div>

              <div style={{ width: "76%",  height: 7,  background: COL_CAP }} />
              <div style={{ width: "88%",  height: 12, background: COL_CAP,
                boxShadow: "0 2px 4px rgba(0,0,0,0.06)" }} />
              <div style={{ width: "100%", height: 10, background: COL_BASE,
                borderRadius: "0 0 5px 5px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.08)" }} />
            </motion.div>
          );
        })}
      </div>

      <div className="mx-auto mt-1" style={{ maxWidth: 560 }}>
        <div style={{ height: 2, background: `rgba(0,0,0,0.07)`, borderRadius: 2,
          boxShadow: "0 2px 4px rgba(0,0,0,0.06)" }} />
      </div>
    </div>
  );
}

// Page slide transition
const pageVariants = {
  initial: { opacity: 0, y: 18 },
  enter:   { opacity: 1, y: 0,  transition: { duration: 0.28, ease } },
  exit:    { opacity: 0, y: -12, transition: { duration: 0.18, ease } },
};

// ─────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────
function Reveal({ children, className = "" }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-60px 0px" });
  return (
    <motion.div ref={ref} variants={stagger} initial="hidden"
      animate={inView ? "visible" : "hidden"} className={className}>
      {children}
    </motion.div>
  );
}

// Plain spaced uppercase label — no decorative markers
function Label({ children }) {
  return (
    <motion.span variants={fadeUp}
      className="inline-block text-[11px] font-bold tracking-[0.18em] uppercase"
      style={{ color: BRAND }}>
      {children}
    </motion.span>
  );
}

function Stars({ count = 5 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill={BRAND}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

// Page wrapper — handles enter/exit animation
function PageWrapper({ children, bg = "#faf8f6" }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
      className="min-h-screen"
      style={{ background: bg }}
    >
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────
// NAV
// ─────────────────────────────────────────────────
function Nav() {
  const [open,     setOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-sm shadow-[0_1px_0_rgba(0,0,0,0.08)]" : "bg-white/80 backdrop-blur-sm"
      }`}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16 lg:h-[72px]">

          <Link to="/">
            <img
              src="https://images.squarespace-cdn.com/content/v1/643f03c18761982f1e1024f4/a2f161b1-b67d-41b4-97b4-41e2dd1c3dfa/Magnificos-Logo-NoTag-KO.png?format=300w"
              alt="Magnifico's Ice Cream" className="h-9 w-auto transition-opacity hover:opacity-70"
              style={{ filter: "brightness(0) saturate(100%) invert(16%) sepia(85%) saturate(4500%) hue-rotate(334deg) brightness(87%)" }}
            />
          </Link>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, path }) => {
              const active = location.pathname === path;
              return (
                <Link key={path} to={path}
                  className={`px-3.5 py-2 text-[13px] rounded-lg transition-all ${
                    active
                      ? "font-semibold bg-black/5"
                      : "font-medium hover:bg-black/5"
                  }`}
                  style={{ color: active ? BRAND : MUTED }}>
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <motion.a whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
              href="https://www.instagram.com/magnificosicecream/" target="_blank" rel="noopener noreferrer"
              aria-label="Instagram"
              className="hidden sm:flex w-9 h-9 items-center justify-center border border-gray-200 hover:border-pink-300 bg-white transition-all"
              style={{ borderRadius: LEAF }}>
              <img src="https://cdn.simpleicons.org/instagram/E4405F" className="w-[18px] h-[18px]" alt="" />
            </motion.a>
            <motion.a whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
              href="https://www.facebook.com/p/Magnificos-Ice-Cream-100063570281450/" target="_blank" rel="noopener noreferrer"
              aria-label="Facebook"
              className="hidden sm:flex w-9 h-9 items-center justify-center border border-gray-200 hover:border-blue-300 bg-white transition-all"
              style={{ borderRadius: LEAFR }}>
              <img src="https://cdn.simpleicons.org/facebook/1877F2" className="w-[18px] h-[18px]" alt="" />
            </motion.a>
            <motion.a whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              href="https://www.doordash.com/store/magnifico%27s-ice-cream-east-brunswick-26274712/29228948/" target="_blank" rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-white"
              style={{ background: "#FF3008", borderRadius: LEAF }}>
              <img src="https://cdn.simpleicons.org/doordash/ffffff" className="h-[17px] w-auto" alt="" />
              <span className="text-[13px] font-semibold">DoorDash</span>
            </motion.a>

            {/* Hamburger */}
            <button onClick={() => setOpen(v => !v)} aria-label={open ? "Close menu" : "Open menu"}
              className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-[5px]">
              <motion.span animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }} transition={{ duration: 0.22 }}
                className="block h-[2px] bg-gray-800 rounded-full" style={{ width: 20 }} />
              <motion.span animate={open ? { opacity: 0 } : { opacity: 1 }} transition={{ duration: 0.18 }}
                className="block h-[2px] bg-gray-800 rounded-full" style={{ width: 16 }} />
              <motion.span animate={open ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }} transition={{ duration: 0.22 }}
                className="block h-[2px] bg-gray-800 rounded-full" style={{ width: 12 }} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div key="drawer" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
            className="fixed top-16 inset-x-0 z-40 md:hidden bg-white border-b border-gray-100 shadow-xl">
            <div className="max-w-7xl mx-auto px-5 py-5 flex flex-col gap-1">
              {NAV_LINKS.map(({ label, path }) => (
                <Link key={path} to={path}
                  className="text-left px-3 py-3 text-[15px] font-medium rounded-lg hover:bg-gray-50 transition-all"
                  style={{ color: DARK }}>
                  {label}
                </Link>
              ))}
              <div className="flex gap-2 mt-2">
                <a href="https://www.instagram.com/magnificosicecream/" target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-100 bg-gray-50 text-sm font-medium"
                  style={{ borderRadius: LEAF }}>
                  <img src="https://cdn.simpleicons.org/instagram/E4405F" className="w-5 h-5" alt="" /> Instagram
                </a>
                <a href="https://www.facebook.com/p/Magnificos-Ice-Cream-100063570281450/" target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-100 bg-gray-50 text-sm font-medium"
                  style={{ borderRadius: LEAFR }}>
                  <img src="https://cdn.simpleicons.org/facebook/1877F2" className="w-5 h-5" alt="" /> Facebook
                </a>
              </div>
              <a href="https://www.doordash.com/store/magnifico%27s-ice-cream-east-brunswick-26274712/29228948/" target="_blank" rel="noopener noreferrer"
                className="mt-1 w-full py-3.5 text-sm font-semibold text-white text-center flex items-center justify-center gap-2"
                style={{ background: "#FF3008", borderRadius: LEAF }}>
                <img src="https://cdn.simpleicons.org/doordash/ffffff" className="h-5 w-auto" alt="" /> Order on DoorDash
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: DARK, borderTop: `4px solid ${BRAND}` }} className="text-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/[0.08]">
          <div className="sm:col-span-2 lg:col-span-1">
            <img src="https://images.squarespace-cdn.com/content/v1/643f03c18761982f1e1024f4/a2f161b1-b67d-41b4-97b4-41e2dd1c3dfa/Magnificos-Logo-NoTag-KO.png?format=300w"
              alt="Magnifico's Ice Cream" className="h-9 w-auto mb-2" style={{ filter: "brightness(0) invert(1)" }} />
            <p className="font-display text-[14px] mb-3" style={{ fontStyle: "italic", color: "#9a8c84" }}>
              One scoop at a time, since 1981.
            </p>
            <p className="text-gray-500 text-[13px] leading-relaxed mb-6 max-w-[220px]">
              East Brunswick's favorite ice cream shop. Handmade with love on Route 18.
            </p>
            <div className="flex gap-2">
              {[
                { name: "Instagram", href: "https://www.instagram.com/magnificosicecream/", src: "https://cdn.simpleicons.org/instagram/ffffff" },
                { name: "Facebook",  href: "https://www.facebook.com/p/Magnificos-Ice-Cream-100063570281450/", src: "https://cdn.simpleicons.org/facebook/ffffff" },
              ].map(({ name, href, src }) => (
                <a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={name}
                  className="w-9 h-9 border border-white/10 flex items-center justify-center hover:border-white/30 transition-all"
                  style={{ borderRadius: LEAF }}>
                  <img src={src} className="w-4 h-4 opacity-60 hover:opacity-100" alt="" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-bold tracking-widest uppercase mb-5" style={{ color: BRAND }}>Pages</h4>
            <div className="flex flex-col gap-3">
              {NAV_LINKS.map(({ label, path }) => (
                <Link key={path} to={path} className="text-[13px] text-gray-400 hover:text-white transition-colors">{label}</Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-bold tracking-widest uppercase mb-5" style={{ color: BRAND }}>Visit Us</h4>
            <div className="flex flex-col gap-2.5 text-[13px] text-gray-400">
              <span>500 State Route 18</span>
              <span>East Brunswick, NJ 08816</span>
              <a href="tel:+17322389555" className="hover:text-white transition-colors mt-1">(732) 238-9555</a>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-bold tracking-widest uppercase mb-5" style={{ color: BRAND }}>Hours</h4>
            <div className="flex flex-col gap-3 text-[13px]">
              {HOURS.map(({ day, time }) => (
                <div key={day}>
                  <div className="text-gray-500 mb-0.5">{day}</div>
                  <div className="text-gray-300">{time}</div>
                </div>
              ))}
              <a href="https://www.doordash.com/store/magnifico%27s-ice-cream-east-brunswick-26274712/29228948/" target="_blank" rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-semibold" style={{ color: "#FF3008" }}>
                <img src="https://cdn.simpleicons.org/doordash/FF3008" className="h-3.5 w-auto" alt="" />
                Order on DoorDash
              </a>
            </div>
          </div>
        </div>
        <div className="pt-7 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-600">
          <span>© {new Date().getFullYear()} Magnifico's Ice Cream. All rights reserved.</span>
          <span>500 Route 18 · East Brunswick, NJ · Since 1981</span>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────
// PAGE: HOME
// ─────────────────────────────────────────────────
function Home() {
  return (
    <PageWrapper bg={CREAM}>
      <div className="relative overflow-hidden min-h-screen">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full"
            style={{ background: `radial-gradient(circle, ${BRAND}0d 0%, transparent 65%)` }} />
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-5 sm:px-8 pt-28 pb-16">
          <div className="grid lg:grid-cols-[1fr_1fr] gap-10 xl:gap-16 items-center min-h-[calc(100vh-120px)]">

            <motion.div initial="hidden" animate="visible" variants={stagger}
              className="flex flex-col justify-center py-10 lg:py-16">

              {/* Plain text location line — no pill wrapper */}
              <motion.p variants={fadeUp}
                className="text-[11px] font-bold tracking-[0.18em] uppercase mb-7"
                style={{ color: BRAND }}>
                Est. 1981 · Route 18, East Brunswick
              </motion.p>

              <motion.h1 variants={fadeUp} className="font-display font-black leading-[1.0] mb-6"
                style={{ fontSize: "clamp(2.8rem, 5.5vw, 4.5rem)", color: DARK, letterSpacing: "-0.03em" }}>
                East Brunswick's{" "}
                <span className="relative inline-block">
                  <em style={{ color: BRAND, fontStyle: "italic" }}>Favorite</em>
                  <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                    transition={{ delay: 0.45, duration: 0.35, ease }}
                    className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full origin-left"
                    style={{ background: BRAND }} />
                </span>{" "}Ice Cream Spot
              </motion.h1>

              <motion.p variants={fadeUp} className="text-[17px] leading-relaxed mb-9 max-w-[420px]"
                style={{ color: WARM }}>
                From pistachio to cake batter, every scoop is made from scratch — the same way Gary Magnifico made it when he opened these doors over 44 years ago.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-wrap gap-3.5 mb-10">
                <motion.a whileHover={{ scale: 1.03, boxShadow: "#FF300830 0px 6px 16px" }} whileTap={{ scale: 0.97 }}
                  href="https://www.doordash.com/store/magnifico%27s-ice-cream-east-brunswick-26274712/29228948/" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-[14px] font-semibold text-white"
                  style={{ background: "#FF3008", borderRadius: LEAF }}>
                  <img src="https://cdn.simpleicons.org/doordash/ffffff" className="h-4 w-auto" alt="" />
                  Order on DoorDash
                </motion.a>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <Link to="/menu"
                    className="inline-flex items-center gap-2 px-6 py-3.5 text-[14px] font-semibold border-2 transition-colors"
                    style={{ borderColor: BRAND, color: BRAND, borderRadius: LEAFR }}>
                    View Menu
                  </Link>
                </motion.div>
              </motion.div>

              {/* Simple text link — no avatar stack, no star row */}
              <motion.div variants={fadeUp}>
                <a href="https://www.google.com/maps/place/Magnifico%27s+Ice+Cream/@40.4329,-74.4285,17z/data=!4m8!3m7!1s0x89c3b0f34f8e4d5b:0x1a2b3c4d5e6f7890!8m2!3d40.4329!4d-74.4285!9m1!1b1"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[13px] transition-colors hover:opacity-80"
                  style={{ color: MUTED }}>
                  <Stars />
                  <span>4.9 &nbsp;·&nbsp; 200+ Google reviews</span>
                </a>
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 24, scale: 0.98 }} animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.45, ease, delay: 0.1 }} className="relative">
              <div className="relative overflow-hidden" style={{ borderRadius: 20, aspectRatio: "3/4", maxHeight: "78vh",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.12)" }}>
                <img src="https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=900&q=85"
                  alt="Colorful ice cream at Magnifico's" className="w-full h-full object-cover" loading="eager" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.12) 0%, transparent 40%)" }} />
              </div>
              {/* Offset accent square */}
              <div className="absolute -z-10 -bottom-5 -right-5 w-32 h-32 border"
                style={{ borderRadius: 12, borderColor: `${BRAND}22` }} />
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </PageWrapper>
  );
}

// ─────────────────────────────────────────────────
// ACCORDION CARD — tint-only open state, no edge stripes
// ─────────────────────────────────────────────────
function AccordionCard({ cat, isOpen, onToggle, isFeatured }) {
  const { name, sub, desc, sections } = cat;
  const pad       = isFeatured ? "24px 28px" : "18px 22px";
  const titleSize = isFeatured ? "text-[21px]" : "text-[16px]";
  const subSize   = isFeatured ? "text-[13px]" : "text-[12px]";
  const btnSize   = isFeatured ? 34 : 28;
  const btnFont   = isFeatured ? 20 : 16;

  return (
    <div className="transition-colors duration-200">
      <button
        onClick={() => onToggle(name)}
        className="w-full flex items-center justify-between gap-4 text-left transition-colors duration-200 cursor-pointer"
        style={{ padding: pad, background: isOpen ? `${BRAND}06` : "white" }}
      >
        <div className="flex-1 min-w-0">
          <h3 className={`font-display font-bold ${titleSize}`}
            style={{ color: isOpen ? BRAND : DARK, letterSpacing: "-0.02em" }}>{name}</h3>
          <p className={`mt-0.5 ${subSize}`} style={{ color: MUTED }}>{sub}</p>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.22, ease }}
          className="flex items-center justify-center flex-shrink-0 font-bold leading-none transition-colors duration-200"
          style={{
            width: btnSize, height: btnSize, fontSize: btnFont,
            borderRadius: LEAF,
            border: `1px solid ${isOpen ? BRAND : "#d1d5db"}`,
            color: isOpen ? BRAND : "#9ca3af",
            flexShrink: 0,
          }}
        >
          +
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 0.03, 0.26, 1] }}
            style={{ overflow: "hidden" }}>
            <div style={{ padding: pad, background: `${BRAND}04` }}>
              <p className="text-[15px] leading-relaxed mb-6 max-w-xl" style={{ color: WARM }}>{desc}</p>
              <div className="flex flex-col gap-6">
                {sections.map(({ label, flavors }) => (
                  <div key={label}>
                    {/* Plain uppercase section label — no dash/dot markers */}
                    <p className="text-[10px] font-bold tracking-[0.18em] uppercase mb-3"
                      style={{ color: BRAND }}>
                      {label}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {flavors.map((f, fi) => (
                        <span key={f}
                          className="px-3.5 py-1.5 text-[12px] font-semibold bg-white text-gray-900 hover:bg-gray-900 hover:text-white transition-colors cursor-pointer select-none"
                          style={{ border: "1.5px solid #1a1a1a", borderRadius: fi % 2 === 0 ? LEAFR : LEAF }}>
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────
// PAGE: MENU (combined with flavors + podium)
// ─────────────────────────────────────────────────
const FEATURED_NAMES = ["Ice Cream", "Toppings"];

function MenuPage() {
  const [openKey, setOpenKey] = useState(null);
  const toggle = (key) => setOpenKey((prev) => (prev === key ? null : key));

  const featured = MENU_CATEGORIES.filter(c => FEATURED_NAMES.includes(c.name));
  const others   = MENU_CATEGORIES.filter(c => !FEATURED_NAMES.includes(c.name));
  const col1 = others.filter((_, i) => i % 2 === 0);
  const col2 = others.filter((_, i) => i % 2 !== 0);

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-5 sm:px-8 pt-28 pb-20">

        <Podium />

        {/* Header */}
        <Reveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
          <div>
            <Label>What We Serve</Label>
            <motion.h2 variants={fadeUp} className="font-display font-bold mt-4"
              style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", color: DARK, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
              Our Menu
            </motion.h2>
          </div>
          <motion.a variants={fadeUp} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            href="https://www.doordash.com/store/magnifico%27s-ice-cream-east-brunswick-26274712/29228948/" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white flex-shrink-0"
            style={{ background: "#FF3008", borderRadius: LEAF }}>
            <img src="https://cdn.simpleicons.org/doordash/ffffff" className="h-4 w-auto" alt="" />
            Order Now
          </motion.a>
        </Reveal>

        {/* Featured: Ice Cream + Toppings — 2 big, flush side by side */}
        <div className="border border-gray-200 overflow-hidden mb-3" style={{ borderRadius: LEAFR }}>
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            {featured.map((cat) => (
              <AccordionCard key={cat.name} cat={cat}
                isOpen={openKey === cat.name} onToggle={toggle} isFeatured />
            ))}
          </div>
        </div>

        {/* Others: 2 × 3 flush grid */}
        <div className="border border-gray-200 overflow-hidden" style={{ borderRadius: LEAFR }}>
          <div className="flex flex-col sm:flex-row sm:divide-x divide-gray-200">
            <div className="flex-1 flex flex-col divide-y divide-gray-200">
              {col1.map(cat => (
                <AccordionCard key={cat.name} cat={cat}
                  isOpen={openKey === cat.name} onToggle={toggle} />
              ))}
            </div>
            <div className="flex-1 flex flex-col divide-y divide-gray-200 border-t sm:border-t-0 border-gray-200">
              {col2.map(cat => (
                <AccordionCard key={cat.name} cat={cat}
                  isOpen={openKey === cat.name} onToggle={toggle} />
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-[13px] mb-5" style={{ color: MUTED }}>Availability varies by season. Call ahead — we're always happy to tell you what's fresh today.</p>
          <a href="tel:+17322389555"
            className="inline-flex items-center gap-2 text-[13px] font-semibold transition-colors"
            style={{ color: BRAND }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill={BRAND}>
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
            </svg>
            (732) 238-9555
          </a>
        </div>
      </div>
      <Footer />
    </PageWrapper>
  );
}

// ─────────────────────────────────────────────────
// PAGE: ABOUT
// ─────────────────────────────────────────────────
function AboutPage() {
  return (
    <PageWrapper bg={CREAM}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-28 pb-20">
        <div className="grid lg:grid-cols-[5fr_6fr] gap-12 xl:gap-20 items-center">
          <Reveal>
            <motion.div variants={fadeIn} className="relative">
              <div className="overflow-hidden" style={{ borderRadius: 20, aspectRatio: "4/5",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.10)" }}>
                <img src="https://images.unsplash.com/photo-1580915411954-282cb1b0d780?w=800&q=85"
                  alt="Magnifico's Ice Cream Shop" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="absolute -z-10 -top-5 -left-5 w-28 h-28 rounded-2xl" style={{ background: `${BRAND}1f` }} />
              <div className="absolute -z-10 -bottom-5 -right-5 w-20 h-20 rounded-full" style={{ background: `${BRAND}15` }} />
              {/* Overlay card — background tint, no side stripe */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/92 backdrop-blur-sm p-4"
                style={{ borderRadius: LEAFR, boxShadow: "0 2px 4px rgba(0,0,0,0.08)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center flex-shrink-0"
                    style={{ background: BRAND, borderRadius: LEAF }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold" style={{ color: DARK }}>Family-Owned & Operated</p>
                    <p className="text-[11px]" style={{ color: MUTED }}>East Brunswick, NJ since 1981</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </Reveal>

          <Reveal className="flex flex-col gap-0">
            <Label>Our Story</Label>
            <motion.h2 variants={fadeUp} className="font-display font-bold mt-4 mb-6"
              style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", color: DARK, letterSpacing: "-0.02em", lineHeight: 1.08 }}>
              A Family Tradition <br className="hidden lg:block" />Since 1981
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[16px] leading-[1.85] mb-5" style={{ color: WARM }}>
              Magnifico's Ice Cream was born from a simple belief: that the best ice cream is made by hand, with quality ingredients, and served with genuine care. Gary Magnifico opened our doors on Route 18 over 44 years ago, and{" "}
              <em style={{ fontStyle: "italic", color: DARK }}>that same passion drives every scoop we serve.</em>
            </motion.p>
            <motion.p variants={fadeUp} className="text-[16px] leading-[1.85] mb-10" style={{ color: WARM }}>
              Today, our family continues that tradition — crafting small-batch flavors, welcoming every customer like a neighbor, and staying true to the recipes that made us East Brunswick's most beloved dessert destination.
            </motion.p>
            {/* Stats as a simple inline row — no card borders, no top stripes */}
            <motion.div variants={fadeUp} className="flex gap-10 pt-2 pb-2">
              {ABOUT_STATS.map(({ num, label }) => (
                <div key={label}>
                  <div className="font-display text-3xl font-black leading-none mb-1.5"
                    style={{ color: BRAND, letterSpacing: "-0.02em" }}>{num}</div>
                  <div className="text-[12px] font-medium" style={{ color: MUTED }}>{label}</div>
                </div>
              ))}
            </motion.div>
          </Reveal>
        </div>
      </div>
      <Footer />
    </PageWrapper>
  );
}

// ─────────────────────────────────────────────────
// PAGE: REVIEWS
// ─────────────────────────────────────────────────
function ReviewsPage() {
  return (
    <PageWrapper bg={CREAM}>
      <div className="max-w-3xl mx-auto px-5 sm:px-8 pt-28 pb-20">
        <Reveal className="mb-14">
          <Label>Reviews</Label>
          <motion.h2 variants={fadeUp} className="font-display font-bold mt-4 mb-5"
            style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", color: DARK, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
            What People Are Saying
          </motion.h2>
          <motion.div variants={fadeUp} className="flex items-center gap-2">
            <Stars />
            <span className="text-[13px] font-semibold" style={{ color: DARK }}>4.9</span>
            <span className="text-[13px]" style={{ color: MUTED }}>· 200+ Google Reviews</span>
          </motion.div>
        </Reveal>

        {/* Pull-quote layout — no cards, no borders, staggered indentation */}
        <Reveal className="flex flex-col">
          {REVIEWS.map((r, ri) => (
            <motion.div key={r.name} variants={fadeUp}
              className="py-10 flex flex-col gap-5"
              style={{
                borderTop: ri > 0 ? "1px solid rgba(0,0,0,0.08)" : "none",
                paddingLeft:  ri === 1 ? "6%" : "0",
                paddingRight: ri === 1 ? "0"  : "6%",
              }}>
              <Stars count={5} />
              <p className="font-display leading-[1.75]"
                style={{ fontSize: "clamp(1.05rem, 2vw, 1.25rem)", fontStyle: "italic", color: DARK }}>
                "{r.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center text-[12px] font-bold text-white flex-shrink-0"
                  style={{ background: BRAND, borderRadius: ri % 2 === 0 ? LEAF : LEAFR }}>{r.avatar}</div>
                <div>
                  <div className="text-[13px] font-semibold" style={{ color: DARK }}>{r.name}</div>
                  <div className="text-[11px]" style={{ color: MUTED }}>{r.location}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </Reveal>

        <div className="mt-10 pt-8 border-t border-gray-200 text-center">
          <a href="https://www.google.com/maps/place/Magnifico%27s+Ice+Cream/@40.4329,-74.4285,17z"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-semibold border border-gray-300 transition-colors hover:border-gray-500"
            style={{ borderRadius: LEAFR, color: DARK }}>
            Read all reviews on Google Maps
          </a>
        </div>
      </div>
      <Footer />
    </PageWrapper>
  );
}

// ─────────────────────────────────────────────────
// PAGE: VISIT
// ─────────────────────────────────────────────────
function VisitPage() {
  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-28 pb-20">
        <Reveal className="text-center mb-14">
          <Label>Find Us</Label>
          <motion.h2 variants={fadeUp} className="font-display font-bold mt-4 mb-4"
            style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", color: DARK, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
            Come Visit Us
          </motion.h2>
          <motion.p variants={fadeUp} className="font-display text-[17px]"
            style={{ fontStyle: "italic", color: "#9a8c84" }}>
            We'd love to see you.
          </motion.p>
        </Reveal>

        <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
          <Reveal className="h-full">
            <motion.div variants={fadeUp} className="h-full rounded-2xl p-8 lg:p-10 flex flex-col gap-8" style={{ background: "white", boxShadow: "0 2px 4px rgba(0,0,0,0.07)" }}>
              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: MUTED }}>Address</p>
                <p className="font-display text-xl font-bold leading-snug" style={{ color: DARK }}>
                  500 State Route 18<br />East Brunswick, NJ 08816
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: MUTED }}>Phone</p>
                <a href="tel:+17322389555" className="font-display text-xl font-bold transition-opacity hover:opacity-70" style={{ color: DARK }}>
                  (732) 238-9555
                </a>
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold tracking-widest uppercase mb-4" style={{ color: MUTED }}>Hours</p>
                <div className="flex flex-col gap-3">
                  {HOURS.map(({ day, time }) => (
                    <div key={day} className="flex items-center justify-between py-3 border-b last:border-b-0"
                      style={{ borderColor: "rgba(0,0,0,0.07)" }}>
                      <span className="text-[13px] font-medium" style={{ color: WARM }}>{day}</span>
                      <span className="text-[13px] font-bold" style={{ color: BRAND }}>{time}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <motion.a whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  href="tel:+17322389555"
                  className="flex-1 py-3.5 text-[13px] font-semibold text-white text-center"
                  style={{ background: BRAND, borderRadius: LEAF }}>Call Now</motion.a>
                <motion.a whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  href="https://maps.google.com/?q=500+State+Route+18,+East+Brunswick,+NJ+08816"
                  target="_blank" rel="noopener noreferrer"
                  className="flex-1 py-3.5 text-[13px] font-semibold text-center border-2 transition-colors hover:bg-gray-50"
                  style={{ borderColor: DARK, color: DARK, borderRadius: LEAFR }}>Get Directions</motion.a>
              </div>
            </motion.div>
          </Reveal>

          <Reveal className="h-full">
            <motion.div variants={fadeIn} className="rounded-2xl overflow-hidden"
              style={{ minHeight: 480, boxShadow: "0 2px 4px rgba(0,0,0,0.10)" }}>
              <iframe title="Magnifico's on Google Maps"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3032.912!2d-74.42851!3d40.43291!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c3b0f34f8e4d5b%3A0x1a2b3c4d5e6f7890!2s500%20NJ-18%2C%20East%20Brunswick%2C%20NJ%2008816!5e0!3m2!1sen!2sus!4v1700000000000"
                width="100%" height="100%"
                style={{ border: 0, display: "block", minHeight: 480 }}
                allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </motion.div>
          </Reveal>
        </div>
      </div>
      <Footer />
    </PageWrapper>
  );
}

// ─────────────────────────────────────────────────
// APP SHELL — router + animated routes
// ─────────────────────────────────────────────────
function AppShell() {
  const location = useLocation();

  return (
    <>
      <Nav />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/"        element={<Home />}        />
          <Route path="/menu"    element={<MenuPage />}    />
          <Route path="/about"   element={<AboutPage />}   />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/visit"   element={<VisitPage />}   />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
