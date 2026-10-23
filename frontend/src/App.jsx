import { useEffect, useState } from "react";
import {
  BrowserRouter,
  NavLink,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  Activity,
  Bell,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Download,
  Dumbbell,
  FileText,
  Clipboard,
  Flame,
  HeartPulse,
  Home,
  Menu,
  Pause,
  Play,
  Search,
  Settings,
  TrendingUp,
  Phone,
  MapPin,
  Star,
  ArrowRight,
  Quote,
  Stethoscope,
  MessageCircle,
  Mail,
  X,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import "./App.css";
const initial = [
  {
    id: 1,
    name: "Knee Extensions",
    mins: 8,
    reps: "3 × 12",
    level: "Beginner",
    done: true,
    c: "teal",
    note: "Slowly straighten your knee and hold at the top.",
  },
  {
    id: 2,
    name: "Straight Leg Raises",
    mins: 10,
    reps: "3 × 10",
    level: "Beginner",
    done: true,
    c: "violet",
    note: "Keep your knee straight as you lift your leg.",
  },
  {
    id: 3,
    name: "Seated Hamstring Stretch",
    mins: 6,
    reps: "3 × 30 sec",
    level: "Gentle",
    done: true,
    c: "orange",
    note: "Reach forward until you feel a gentle stretch.",
  },
  {
    id: 4,
    name: "Heel Slides",
    mins: 8,
    reps: "3 × 12",
    level: "Beginner",
    done: false,
    c: "blue",
    note: "Slide your heel toward you with control.",
  },
  {
    id: 5,
    name: "Glute Bridge",
    mins: 9,
    reps: "3 × 10",
    level: "Intermediate",
    done: false,
    c: "rose",
    note: "Lift through your hips while keeping ribs relaxed.",
  },
  {
    id: 6,
    name: "Wall Calf Stretch",
    mins: 5,
    reps: "2 × 30 sec",
    level: "Gentle",
    done: false,
    c: "mint",
    note: "Keep the back heel grounded.",
  },
];
const week = [
  ["Mon", 80],
  ["Tue", 100],
  ["Wed", 70],
  ["Thu", 92],
  ["Fri", 75],
  ["Sat", 88],
  ["Sun", 60],
].map(([d, value]) => ({ d, value }));
const pain = [
  ["Oct 11", 5],
  ["Oct 12", 4],
  ["Oct 13", 5],
  ["Oct 14", 3],
  ["Oct 15", 4],
  ["Oct 16", 2],
  ["Today", 3],
].map(([d, value]) => ({ d, value }));
const get = (k, d) => {
  try {
    return JSON.parse(localStorage.getItem(k)) || d;
  } catch {
    return d;
  }
};
function App() {
  const [ex, setEx] = useState(() => get("pt-ex", initial));
  const [journal, setJournal] = useState(() =>
    get("pt-journal", [
      {
        id: 1,
        date: "2026-10-16",
        area: "Right knee",
        pain: 3,
        note: "Mild stiffness after my walk.",
      },
    ]),
  );
  const [toast, setToast] = useState("");
  const [loggedIn, setLoggedIn] = useState(
    () => localStorage.getItem("pt-auth") === "true",
  );
  useEffect(() => {
    localStorage.setItem("pt-ex", JSON.stringify(ex));
  }, [ex]);
  useEffect(() => {
    localStorage.setItem("pt-journal", JSON.stringify(journal));
  }, [journal]);
  const notify = (x) => {
    setToast(x);
    setTimeout(() => setToast(""), 2500);
  };
  const toggle = (id) => {
    setEx((a) => a.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));
    notify("Exercise progress updated");
  };
  const data = { ex, journal, setJournal, toggle, notify };
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingV2 page="home" />} />
        <Route path="/about" element={<LandingV2 page="about" />} />
        <Route path="/services" element={<LandingV2 page="services" />} />
        <Route path="/doctors" element={<LandingV2 page="doctors" />} />
        <Route path="/gallery" element={<LandingV2 page="gallery" />} />
        <Route path="/blog" element={<LandingV2 page="blog" />} />
        <Route path="/contact" element={<LandingV2 page="contact" />} />
        <Route path="/login" element={<Auth setLoggedIn={setLoggedIn} />} />
        <Route path="/register" element={<Auth setLoggedIn={setLoggedIn} />} />
        <Route
          path="/*"
          element={
            loggedIn ? <Layout {...data} /> : <Navigate to="/login" replace />
          }
        />
      </Routes>
      {toast && (
        <div className="toast">
          <Check size={16} />
          {toast}
        </div>
      )}
    </BrowserRouter>
  );
}
const links = [
  ["/dashboard", "Overview", Home],
  ["/exercises", "My Exercises", Dumbbell],
  ["/sessions", "Guided Sessions", Play],
  ["/analytics", "Progress & Analytics", TrendingUp],
  ["/pain", "Pain Journal", HeartPulse],
  ["/reports", "Therapist Reports", FileText],
  ["/settings", "Settings", Settings],
];
function Layout(p) {
  const [mobile, setMobile] = useState(false);
  const [notes, setNotes] = useState(false);
  return (
    <div className="shell">
      <aside className={mobile ? "side open" : "side"}>
        <div className="side-brand">
          <NavLink to="/dashboard" className="brand" onClick={() => setMobile(false)}>
            <i><Activity /></i>
            <span className="side-brand-name">Physio<span>Track</span></span>
          </NavLink>
          <button
            className="close"
            aria-label="Close sidebar"
            onClick={() => setMobile(false)}
          >
            <X />
          </button>
        </div>
        <div className="person">
          <div className="person-avatar">AM<span /></div>
          <div className="person-info">
            <strong>Alex Morgan</strong>
            <small><HeartPulse size={12} /> Recovery journey</small>
          </div>
          <span className="profile-menu" aria-hidden="true">•••</span>
        </div>
        <div className="side-section-label">YOUR SPACE</div>
        <nav className="side-nav" aria-label="Patient dashboard">
          {links.map(([to, t, I], index) => (
            <NavLink end to={to} key={t} onClick={() => setMobile(false)}>
              <span className="side-nav-icon"><I size={18} /></span>
              <span className="side-nav-copy">
                <strong>{t}</strong>
                <small>{[
                  "Your plan at a glance",
                  "Your prescribed movement",
                  "Follow guided routines",
                  "See how far you’ve come",
                  "Log symptoms and notes",
                  "Updates for your therapist",
                  "Make it work for you",
                ][index]}</small>
              </span>
              {t === "Guided Sessions" && <span className="side-nav-badge">4</span>}
            </NavLink>
          ))}
        </nav>
        <div className="side-goal">
          <div className="side-goal-top">
            <span className="side-goal-icon"><Flame size={15} /></span>
            <span><small>THIS WEEK</small><strong>Weekly movement goal</strong></span>
            <b>75%</b>
          </div>
          <div className="side-goal-track"><i /></div>
          <p><strong>18 of 24</strong> exercises complete</p>
        </div>
        <div className="help">
          <span className="help-icon"><MessageCircle size={16} /></span>
          <div><b>Need a hand?</b><p>Your care team is here when you need support.</p></div>
          <ArrowRight size={15} />
        </div>
        <div className="therapist">
          <div className="therapist-avatar">JR<span /></div>
          <div className="therapist-info">
            <small>YOUR CARE PARTNER</small>
            <strong>Jordan Reed, PT</strong>
          </div>
          <span className="therapist-status">ONLINE</span>
        </div>
      </aside>
      <main>
        <header>
          <button
            className="menub"
            aria-label="Open dashboard navigation"
            aria-expanded={mobile}
            onClick={() => setMobile(true)}
          >
            <Menu />
          </button>
          <div>
            <small>Patient portal</small>
            <h1>Welcome back, Alex</h1>
          </div>
          <div className="top">
            <label>
              <Search size={17} />
              <input placeholder="Search anything" />
            </label>
            <button className="bell" onClick={() => setNotes(!notes)}>
              <Bell size={19} />
              <i />
            </button>
            <b>AM</b>
          </div>
          {notes && (
            <div className="notices">
              <strong>Notifications</strong>
              <p>
                <b>Today's plan is ready</b>
                <br />
                Four exercises are scheduled.
              </p>
              <p>
                <b>Great consistency!</b>
                <br />
                You reached a 6 day streak.
              </p>
            </div>
          )}
        </header>
        <Routes>
          <Route path="/dashboard" element={<Overview {...p} />} />
          <Route path="/exercises" element={<Exercises {...p} />} />
          <Route path="/sessions" element={<Sessions {...p} />} />
          <Route path="/analytics" element={<Analytics {...p} />} />
          <Route path="/pain" element={<Pain {...p} />} />
          <Route path="/reports" element={<Reports {...p} />} />
          <Route path="/settings" element={<SettingsPage {...p} />} />
        </Routes>
      </main>
    </div>
  );
}
function Landing() {
  return (
    <div className="landing">
      <header className="landnav">
        <NavLink to="/" className="brand">
          <i>
            <Activity />
          </i>
          Physio<span>Track</span>
        </NavLink>
        <nav>
          <a href="#features">Features</a>
          <a href="#how">How it works</a>
          <NavLink to="/login">Login</NavLink>
          <NavLink className="primary" to="/register">
            Get started
          </NavLink>
        </nav>
      </header>
      <section className="landhero">
        <div>
          <span className="eyebrow">YOUR RECOVERY, YOUR RHYTHM</span>
          <h1>
            Feel stronger with <em>every small step.</em>
          </h1>
          <p>
            PhysioTrack makes it simple to follow your home exercise plan, track
            your progress, and stay connected to your recovery goals.
          </p>
          <div>
            <NavLink className="primary" to="/register">
              Create your account <ChevronRight size={16} />
            </NavLink>
            <NavLink className="landlink" to="/login">
              I already have an account
            </NavLink>
          </div>
        </div>
        <div className="heroart">
          <div className="heroicon">
            <Activity size={62} />
          </div>
          <div className="floatcard">
            <Check /> Today’s plan
            <br />
            <small>4 exercises ready</small>
          </div>
          <div className="floatcard two">
            <Flame /> 6 day streak
            <br />
            <small>You’re doing great</small>
          </div>
        </div>
      </section>
      <section className="feature-section" id="features">
        <p className="eyebrow">DESIGNED FOR YOUR HOME ROUTINE</p>
        <h2>Recovery support that fits into real life.</h2>
        <div className="featuregrid">
          <article>
            <Dumbbell />
            <h3>Clear guided exercises</h3>
            <p>
              Simple instructions and session controls help you move with
              confidence.
            </p>
          </article>
          <article>
            <TrendingUp />
            <h3>Meaningful progress</h3>
            <p>
              See adherence, exercise time, and recovery patterns in one calm
              view.
            </p>
          </article>
          <article>
            <HeartPulse />
            <h3>Symptom journal</h3>
            <p>
              Log how you feel and bring a clear history to care conversations.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}
function LandingV2({ page = "home" }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [lightbox, setLightbox] = useState(null);
  const [testimonial, setTestimonial] = useState(0);
  const doctors = [
    ["Dr. Olivia Parker", "Physiotherapist", "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=700&q=85", "12 years experience", "Orthopaedic & mobility care", "Olivia helps people build strength and confidence after joint injuries, with a calm, goal-led approach."],
    ["Dr. James Wilson", "Sports injury specialist", "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=700&q=85", "10 years experience", "Sports & return-to-play", "James works with active people to recover from sports injuries and return to movement safely."],
    ["Dr. Amelia Ross", "Rehabilitation consultant", "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=700&q=85", "14 years experience", "Post-surgery rehabilitation", "Amelia creates practical recovery plans that support steady progress after surgery and complex injuries."],
  ];
  const gallery = [
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1576765608866-5b51046452be?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=900&q=85",
  ];
  const galleryNotes = [
    ["A welcoming first visit", "Our team takes time to understand what matters to you."],
    ["Room to move", "Open, comfortable spaces for guided movement and exercise."],
    ["Support at every step", "One-to-one conversations help make each plan feel personal."],
    ["A calm place to recover", "Thoughtful details help you feel at ease during your visit."],
    ["Movement with confidence", "Practical sessions focus on the everyday goals that matter."],
    ["Care that feels connected", "A friendly team makes your recovery a shared journey."],
  ];
  const testimonials = [
    ["The team made every part of my recovery feel achievable. I am back to walking pain-free and feel stronger every week.", "Sophia Martin", "Knee rehabilitation"],
    ["Such a calm, professional clinic. My treatment plan was clear and the support never felt rushed.", "Daniel Reed", "Sports recovery"],
    ["I finally found care that listens. The progress tracking gave me confidence between appointments.", "Ava Williams", "Back pain treatment"],
  ];
  const services = [
    ["Physiotherapy", "Evidence-led treatment to restore movement, confidence, and everyday comfort.", Dumbbell, "#fff0f5"],
    ["Sports recovery", "A focused return-to-play plan for injuries, strength, and lasting performance.", TrendingUp, "#eef0ff"],
    ["Pain management", "Gentle, progressive support that addresses pain and its root causes.", HeartPulse, "#fff6e5"],
    ["Post-surgery rehab", "Build mobility safely after surgery with specialist guidance at every stage.", Activity, "#edfaf7"],
    ["Manual therapy", "Hands-on techniques that help your body move with greater ease.", Stethoscope, "#f4edff"],
    ["Home programmes", "Clear exercise plans and progress check-ins that fit your real life.", Calendar, "#eaf7ff"],
  ];
  const articles = [
    ["https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=700&q=85", "15 Oct 2026", "Three ways to ease back pain at your desk", "Everyday movement", "Small, comfortable changes to your sitting routine can make the workday feel easier. Learn how gentle movement breaks and a better setup can support your back.", "4 min read"],
    ["https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=700&q=85", "08 Oct 2026", "How physiotherapy supports your recovery", "Your care journey", "Physiotherapy is more than exercises. Discover how clear goals, tailored movement, and regular check-ins can help you build confidence over time.", "6 min read"],
    ["https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=700&q=85", "28 Sep 2026", "A guide to your first clinic appointment", "Getting started", "Knowing what to expect can help your first visit feel less daunting. Here is how to prepare and the questions you may want to bring.", "5 min read"],
  ];
  const book = (e) => { e.preventDefault(); const form = e.currentTarget; if (!form.checkValidity()) return form.reportValidity(); setNotice("Thanks! Your appointment request is saved locally. Our team will confirm availability."); form.reset(); document.querySelector("#appointment")?.scrollIntoView({ behavior: "smooth" }); };
  const goToBooking = () => navigate("/contact");
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [page]);
  return (
    <div className="landing landing-v2">
      <header className="landnav">
        <NavLink to="/" className="brand"><i><Activity /></i>Physio<span>Med</span></NavLink>
        <button
          className="land-menu"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
        <nav className={menuOpen ? "open" : ""}>
          <NavLink to="/" onClick={() => setMenuOpen(false)}>Home</NavLink>
          <NavLink to="/about" onClick={() => setMenuOpen(false)}>About</NavLink>
          <NavLink to="/services" onClick={() => setMenuOpen(false)}>Services</NavLink>
          <NavLink to="/doctors" onClick={() => setMenuOpen(false)}>Doctors</NavLink>
          <NavLink to="/gallery" onClick={() => setMenuOpen(false)}>Gallery</NavLink>
          <NavLink to="/blog" onClick={() => setMenuOpen(false)}>Blog</NavLink>
          <NavLink to="/contact" onClick={() => setMenuOpen(false)}>Contact</NavLink>
          <NavLink className="auth-nav" to="/login" onClick={() => setMenuOpen(false)}>Log in / Sign up</NavLink>
          <button className="primary" onClick={goToBooking}>Book appointment</button>
        </nav>
      </header>
      {page === "home" && <><section className="landhero" id="home">
        <div className="hero-copy">
          <span className="eyebrow">YOUR HEALTH IS OUR PRIORITY</span>
          <h1>We take care of <em>your healthy life.</em></h1>
          <p>Experience thoughtful physiotherapy and personalised rehabilitation that helps you move freely, live fully, and feel like yourself again.</p>
          <div className="hero-actions"><button className="primary" onClick={goToBooking}>Book appointment <ChevronRight size={16} /></button><NavLink className="landlink" to="/services">Our services</NavLink></div>
          <div className="hero-proof"><div className="faces"><b>JM</b><b>AS</b><b>RK</b></div><div><strong>4.9/5 from our patients</strong><small>Trusted care from experienced specialists</small></div></div>
        </div>
        <div className="heroart">
          <div className="hero-orb" />
          <img className="hero-doctor" src={doctors[0][2]} alt="Female physiotherapist in a medical coat" />
          <div className="floatcard appointment-card"><i><Calendar size={18} /></i><div><b>Book an appointment</b><small>Choose a time that works for you</small></div></div>
          <div className="floatcard care-card"><Check size={18} /><div><b>Care that feels personal</b><small>Here with you at every step</small></div></div>
        </div>
      </section>
      <section className="trustbar"><div><b>24/7</b><span>Care support</span></div><div><b>10k+</b><span>Happy patients</span></div><div><b>30+</b><span>Expert therapists</span></div><div><b>98%</b><span>Patient satisfaction</span></div></section>
      <section className="feature-section"><p className="eyebrow">COMPLETE CARE FOR BETTER MOVEMENT</p><h2>Everything you need for a stronger recovery.</h2><div className="featuregrid"><article><Dumbbell /><h3>Targeted therapy</h3><p>Personalised treatment plans built around your body, goals, and daily life.</p></article><article><TrendingUp /><h3>Progress you can see</h3><p>Follow your progress clearly and celebrate every important step forward.</p></article><article><HeartPulse /><h3>Compassionate specialists</h3><p>Feel heard and supported by a team that puts your comfort first.</p></article></div></section>
      <section className="home-services">
        <div className="home-section-heading">
          <div><span className="eyebrow">CARE THAT FITS YOUR NEEDS</span><h2>Support for every stage of recovery.</h2><p>Start with the kind of care you need today. We will help you shape the next step.</p></div>
          <NavLink to="/services">Explore all services <ArrowRight size={15} /></NavLink>
        </div>
        <div className="home-service-grid">
          {services.slice(0, 3).map(([title, text, Icon, color]) => <article key={title}>
            <i style={{ background: color }}><Icon /></i><h3>{title}</h3><p>{text}</p>
            <NavLink to="/services">Learn about this service <ArrowRight size={14} /></NavLink>
          </article>)}
        </div>
      </section>
      <section className="steps-section home-steps">
        <p className="eyebrow">A CLEAR PATH FORWARD</p><h2>Care that starts with listening.</h2>
        <div className="steps">
          <article><b>01</b><MessageCircle /><h3>Tell us your goals</h3><p>Share what has changed and what you would like to get back to doing.</p></article>
          <article><b>02</b><Stethoscope /><h3>Meet your specialist</h3><p>Talk through your options and build a plan at a pace that feels right.</p></article>
          <article><b>03</b><TrendingUp /><h3>Make progress together</h3><p>Review your progress and adapt the plan as your confidence grows.</p></article>
        </div>
      </section>
      <section className="home-quote">
        <Quote /><p>“{testimonials[testimonial][0]}”</p><strong>{testimonials[testimonial][1]}</strong>
        <span>{testimonials[testimonial][2]}</span>
        <div className="slider-controls">
          <button onClick={() => setTestimonial((testimonial + testimonials.length - 1) % testimonials.length)} aria-label="Previous patient story">←</button>
          <button onClick={() => setTestimonial((testimonial + 1) % testimonials.length)} aria-label="Next patient story">→</button>
        </div>
      </section>
      <section className="home-cta">
        <div><span className="eyebrow">READY WHEN YOU ARE</span><h2>Let’s find a plan that works for you.</h2><p>Our friendly team is here to answer questions and help you choose a first appointment.</p></div>
        <button className="primary" onClick={goToBooking}>Talk to our team <ArrowRight size={16} /></button>
      </section>
      </>}
      {page === "about" && (
        <>
          <section className="page-intro about-intro">
            <span className="eyebrow">A LITTLE ABOUT US</span>
            <h1>Care that sees the person, not just the injury.</h1>
            <p>
              We bring skilled physiotherapists and thoughtful, individual care
              together to help people move with confidence at every stage of
              recovery.
            </p>
            <div className="intro-proof">
              <span><strong>10k+</strong> people supported</span>
              <span><strong>30+</strong> expert therapists</span>
              <span><strong>98%</strong> would recommend us</span>
            </div>
          </section>
          <section className="consult about-story">
            <img
              src="https://images.unsplash.com/photo-1579684453423-f84349ef60b0?auto=format&fit=crop&w=1000&q=85"
              alt="Physiotherapist listening to a patient during a consultation"
            />
            <div>
              <span className="eyebrow">OUR APPROACH</span>
              <h2>Recovery works better when it feels like a partnership.</h2>
              <p>
                Every person arrives with a different story. We take time to
                understand what matters to you, explain your options clearly,
                and shape a practical plan around your everyday life.
              </p>
              <ul>
                <li><Check /> Time to listen and understand your goals</li>
                <li><Check /> Clear plans with meaningful milestones</li>
                <li><Check /> Support that adapts as you make progress</li>
              </ul>
              <button className="primary" onClick={goToBooking}>Meet your care team</button>
            </div>
          </section>
          <section className="steps-section about-values">
            <p className="eyebrow">WHAT GUIDES US</p>
            <h2>Good care is built on trust.</h2>
            <div className="steps">
              <article><b>01</b><HeartPulse /><h3>People first</h3><p>Your comfort, priorities, and pace shape every conversation and care plan.</p></article>
              <article><b>02</b><Stethoscope /><h3>Expert guidance</h3><p>Practical, evidence-informed care helps make the next step feel clear.</p></article>
              <article><b>03</b><TrendingUp /><h3>Progress together</h3><p>We celebrate the small wins and keep adjusting as your confidence grows.</p></article>
            </div>
          </section>
        </>
      )}
      {page === "services" && (
        <>
          <section className="page-intro services-intro">
            <span className="eyebrow">PERSONALISED PHYSIOTHERAPY</span>
            <h1>Find the right support for your next step.</h1>
            <p>
              From easing everyday pain to rebuilding strength after surgery,
              explore care designed around how you want to move and live.
            </p>
            <button className="primary" onClick={goToBooking}>
              Talk to our team <ArrowRight size={16} />
            </button>
          </section>
          <section className="service-showcase">
            <div className="service-intro">
              <span className="eyebrow">OUR TREATMENTS</span>
              <h2>Specialist care for every way you move.</h2>
              <p>
                Choose a starting point. Your therapist will tailor each session
                to your goals, comfort, and progress.
              </p>
              <button className="primary" onClick={goToBooking}>
                Find your treatment <ArrowRight size={16} />
              </button>
            </div>
            <div className="service-grid">
              {services.map(([title, text, Icon, color], index) => (
                <article
                  style={{ "--service-color": color, "--delay": `${index * 80}ms` }}
                  key={title}
                >
                  <i><Icon /></i>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <button onClick={goToBooking}>Explore service <ArrowRight size={15} /></button>
                </article>
              ))}
            </div>
          </section>
          <section className="steps-section service-steps">
            <p className="eyebrow">YOUR CARE, MADE SIMPLE</p>
            <h2>Three thoughtful steps, one clear plan.</h2>
            <div className="steps">
              <article><b>01</b><Calendar /><h3>Tell us what you need</h3><p>Share your goals and choose an appointment that works for you.</p></article>
              <article><b>02</b><Stethoscope /><h3>Meet your specialist</h3><p>Get to know your therapist and talk through the best way forward.</p></article>
              <article><b>03</b><TrendingUp /><h3>Move forward with support</h3><p>Build confidence with a plan that grows with your recovery.</p></article>
            </div>
          </section>
          <section className="emergency">
            <div><Phone /><div><span>NOT SURE WHERE TO START?</span><h2>We’ll help you find the right care.</h2><p>Talk to our friendly team about your goals and available appointments.</p></div></div>
            <button className="primary" onClick={goToBooking}>Book a consultation <ArrowRight size={16} /></button>
          </section>
        </>
      )}
      {page === "doctors" && (
        <>
          <section className="page-intro directory-intro">
            <span className="eyebrow">MEET YOUR CARE TEAM</span>
            <h1>Experienced specialists. A genuinely personal approach.</h1>
            <p>Get to know the people who will listen to your goals, explain your options, and support your progress at every visit.</p>
            <div className="intro-proof"><span><strong>30+</strong> experienced therapists</span><span><strong>1:1</strong> personalised sessions</span><span><strong>Here</strong> for your next step</span></div>
          </section>
          <section className="doctors-section" id="doctors">
            <p className="eyebrow">OUR CLINICAL TEAM</p><h2>Find a specialist who understands your goals.</h2>
            <p className="section-lead">Our therapists work across movement, sports recovery, and rehabilitation. Your first appointment is a conversation about you.</p>
            <div className="doctor-grid">
              {doctors.map((doctor) => <article key={doctor[0]}>
                <img src={doctor[2]} alt={doctor[0]} />
                <div><span>{doctor[1]}</span><h3>{doctor[0]}</h3>
                  <small className="doctor-experience">{doctor[3]} · {doctor[4]}</small>
                  <p>{doctor[5]}</p>
                  <button onClick={goToBooking}>Book with {doctor[0].split(" ")[1]} <ArrowRight size={15} /></button>
                </div>
              </article>)}
            </div>
          </section>
          <section className="steps-section doctor-approach">
            <p className="eyebrow">WHAT TO EXPECT</p><h2>Your first visit is about understanding you.</h2>
            <div className="steps">
              <article><b>01</b><MessageCircle /><h3>We listen first</h3><p>Talk through your history, questions, and the things you want to get back to doing.</p></article>
              <article><b>02</b><Activity /><h3>We explore movement</h3><p>Your therapist discusses comfortable next steps based on your needs and goals.</p></article>
              <article><b>03</b><Clipboard /><h3>You leave with a plan</h3><p>Understand what happens next, what to practise, and how progress is reviewed.</p></article>
            </div>
          </section>
          <section className="emergency"><div><Phone /><div><span>HAVE A QUESTION?</span><h2>We can help you choose a specialist.</h2><p>Tell us a little about what you need and we will guide you to a good next step.</p></div></div><button className="primary" onClick={goToBooking}>Contact our team <ArrowRight size={16} /></button></section>
        </>
      )}
      {page === "gallery" && (
        <>
          <section className="page-intro directory-intro">
            <span className="eyebrow">WELCOME TO PHYSIOMED</span>
            <h1>A closer look at a calmer kind of care.</h1>
            <p>Explore the people and spaces that make up your PhysioMed experience—from your first welcome to the work you do together.</p>
            <div className="intro-proof"><span><strong>Friendly</strong> from the first hello</span><span><strong>Thoughtful</strong> spaces to move</span><span><strong>Personal</strong> care, every visit</span></div>
          </section>
          <section className="gallery-section" id="gallery">
            <p className="eyebrow">A LOOK INSIDE PHYSIOMED</p><h2>Care spaces made for healing.</h2>
            <p className="section-lead">Every image tells part of the story: a welcoming place, a supportive team, and movement at your own pace.</p>
            <div className="gallery-grid">
              {gallery.map((image, index) => <button className="gallery-item" key={image} onClick={() => setLightbox(image)} aria-label={`Open gallery image: ${galleryNotes[index][0]}`}>
                <img src={image} alt={galleryNotes[index][0]} />
                <span><strong>{galleryNotes[index][0]}</strong><small>{galleryNotes[index][1]}</small></span>
              </button>)}
            </div>
          </section>
          <section className="gallery-note"><HeartPulse /><div><span className="eyebrow">YOUR VISIT, YOUR PACE</span><h2>A supportive space to ask questions and take the next step.</h2><p>Whether you are visiting for the first time or returning to build on your progress, our team is ready to welcome you.</p></div><button className="primary" onClick={goToBooking}>Plan your visit <ArrowRight size={16} /></button></section>
        </>
      )}
      {page === "blog" && (
        <>
          <section className="page-intro directory-intro">
            <span className="eyebrow">THE PHYSIOMED JOURNAL</span>
            <h1>Practical ideas for moving well and feeling confident.</h1>
            <p>Clear, approachable notes from our care team about recovery, everyday movement, and what to expect from physiotherapy.</p>
            <div className="intro-proof"><span><strong>Movement</strong> everyday tips</span><span><strong>Recovery</strong> expert perspectives</span><span><strong>Wellbeing</strong> thoughtful guidance</span></div>
          </section>
          <section className="testimonial-section">
            <Quote /><p>“{testimonials[testimonial][0]}”</p><div className="stars">{[1,2,3,4,5].map((x) => <Star key={x} fill="currentColor" />)}</div><strong>{testimonials[testimonial][1]}</strong><small>{testimonials[testimonial][2]}</small>
            <div className="slider-controls"><button onClick={() => setTestimonial((testimonial + testimonials.length - 1) % testimonials.length)} aria-label="Previous review">←</button><button onClick={() => setTestimonial((testimonial + 1) % testimonials.length)} aria-label="Next review">→</button></div>
          </section>
          <section className="blog-section" id="blog">
            <p className="eyebrow">FROM OUR JOURNAL</p><h2>Ideas and guidance for your recovery.</h2>
            <p className="section-lead">Small, helpful reads to make your next step feel more informed and less overwhelming.</p>
            <div className="blog-grid">
              {articles.map(([img, date, title, category, description, length]) => <article key={title}>
                <img src={img} alt={title} />
                <div><div className="article-meta"><small>{category}</small><small>{length}</small></div><time>{date}</time><h3>{title}</h3><p>{description}</p><NavLink to="/contact">Ask our team about this <ArrowRight size={14} /></NavLink></div>
              </article>)}
            </div>
          </section>
          <section className="home-cta"><div><span className="eyebrow">A QUESTION AFTER READING?</span><h2>Get advice that is personal to you.</h2><p>Our team can help you talk through your options and find the right appointment.</p></div><button className="primary" onClick={goToBooking}>Get in touch <ArrowRight size={16} /></button></section>
        </>
      )}
      {page === "contact" && (
        <>
          <section className="page-intro directory-intro contact-intro">
            <span className="eyebrow">WE’RE HERE TO HELP</span>
            <h1>Your next step starts with a conversation.</h1>
            <p>Ask a question, tell us what you are looking for, or request an appointment. Our friendly team will help you work out what comes next.</p>
          </section>
          <section className="contact-quick">
            <a href="tel:+18005550188"><i><Phone /></i><span><small>CALL OUR TEAM</small><strong>+1 800 555 0188</strong><em>Mon–Fri, 8 AM–7 PM</em></span><ArrowRight /></a>
            <a href="mailto:hello@physiomed.example"><i><Mail /></i><span><small>SEND US A NOTE</small><strong>hello@physiomed.example</strong><em>We’ll reply within one working day</em></span><ArrowRight /></a>
            <div><i><MapPin /></i><span><small>VISIT THE CLINIC</small><strong>24 Wellness Avenue</strong><em>New York · By appointment</em></span><MapPin /></div>
          </section>
          <section className="appointment-section" id="appointment">
            <div>
              <span className="eyebrow">REQUEST AN APPOINTMENT</span><h2>Let’s find a time that works for you.</h2>
              <p>Share a few details and your preferred time. Our team will follow up to confirm availability. This demo form stores no medical information.</p>
              <div className="appointment-detail"><Clock /> Mon–Fri: 8:00 AM – 7:00 PM</div>
              <div className="appointment-detail"><Calendar /> Saturday: 9:00 AM – 4:00 PM</div>
              <div className="appointment-detail"><HeartPulse /> First visit? We’ll explain what to expect.</div>
            </div>
            <form onSubmit={book}>
              <label>Full name<input required name="name" placeholder="Your full name" /></label>
              <label>Email address<input required type="email" name="email" placeholder="you@email.com" /></label>
              <label>Phone number<input required type="tel" name="phone" placeholder="(000) 000-0000" /></label>
              <label>Choose doctor<select required defaultValue=""><option value="" disabled>Select a doctor</option>{doctors.map((d) => <option key={d[0]}>{d[0]}</option>)}</select></label>
              <label>Service<select required defaultValue=""><option value="" disabled>Select a service</option>{services.map(([title]) => <option key={title}>{title}</option>)}</select></label>
              <label>Appointment date<input required type="date" name="date" /></label>
              <label>Preferred time<select required defaultValue=""><option value="" disabled>Select a time</option><option>09:00 AM</option><option>11:00 AM</option><option>02:00 PM</option><option>04:00 PM</option></select></label>
              <label className="form-message">Message<textarea name="message" placeholder="What would you like help with?" /></label>
              <button className="primary">Request appointment <ArrowRight size={16} /></button>
              {notice && <p className="form-notice" role="status">{notice}</p>}
            </form>
          </section>
          <section className="contact-faq">
            <p className="eyebrow">A FEW HELPFUL ANSWERS</p><h2>Before you get in touch.</h2>
            <div>
              <details><summary>What should I bring to my first appointment?</summary><p>Bring any relevant referral or scan information you have, a list of questions, and comfortable clothing that lets you move easily. Our team can let you know if anything specific is needed.</p></details>
              <details><summary>How long does it take to hear back?</summary><p>Appointment requests are reviewed by our team. We aim to reply within one working day to confirm a suitable time or discuss alternatives.</p></details>
              <details><summary>Can you help me choose a service?</summary><p>Absolutely. Tell us what you would like help with and we can guide you to an appropriate first conversation with a member of our care team.</p></details>
              <details><summary>What if I need to change my appointment?</summary><p>Call or email us as soon as you can. We will help you find another time that works with your schedule.</p></details>
            </div>
          </section>
        </>
      )}
      <footer id="contact"><div className="footer-brand"><NavLink to="/" className="brand"><i><Activity /></i>Physio<span>Med</span></NavLink><p>Thoughtful physiotherapy and rehabilitation for every stage of your recovery.</p><div className="socials"><a href="https://facebook.com" aria-label="Facebook">f</a><a href="https://instagram.com" aria-label="Instagram">◎</a><a href="https://linkedin.com" aria-label="LinkedIn">in</a></div></div><div><h3>Quick links</h3><NavLink to="/about">About us</NavLink><NavLink to="/services">Our services</NavLink><NavLink to="/doctors">Our doctors</NavLink><NavLink to="/blog">News & articles</NavLink></div><div><h3>Services</h3><NavLink to="/services">Physiotherapy</NavLink><NavLink to="/services">Sports injury</NavLink><NavLink to="/services">Pain management</NavLink><NavLink to="/services">Rehabilitation</NavLink></div><div><h3>Opening hours</h3><p>Mon–Fri: 8:00 AM – 7:00 PM</p><p>Saturday: 9:00 AM – 4:00 PM</p><p>Sunday: Closed</p></div><small className="copyright">© 2026 Physio Med. Frontend demonstration only.</small></footer>
      {lightbox && <div className="lightbox" role="dialog" aria-modal="true" onClick={() => setLightbox(null)}><button aria-label="Close image" onClick={() => setLightbox(null)}><X /></button><img src={lightbox} alt="Expanded clinic gallery" onClick={(e) => e.stopPropagation()} /></div>}
    </div>
  );
}
function Auth({ setLoggedIn }) {
  const nav = useNavigate();
  const location = useLocation();
  const mode = location.pathname === "/register" ? "register" : "login";
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const notice = location.state?.registered
    ? "Your account is ready. Log in to continue."
    : "";
  const submit = (e) => {
    e.preventDefault();
    setError("");
    if (mode === "register") {
      if (!form.name || !form.email || form.password.length < 6)
        return setError(
          "Please complete all fields. Password must be at least 6 characters.",
        );
      localStorage.setItem("pt-user", JSON.stringify(form));
      nav("/login", { state: { registered: true } });
      return;
    }
    let saved = get("pt-user", null);
    if (!saved) return setError("No account found. Please register first.");
    if (saved.email !== form.email || saved.password !== form.password)
      return setError("Email or password is incorrect.");
    localStorage.setItem("pt-auth", "true");
    setLoggedIn(true);
    nav("/dashboard");
  };
  return (
    <div className="auth auth-v2">
      <header className="auth-top">
        <NavLink to="/" className="brand">
          <i><Activity /></i>
          Physio<span>Med</span>
        </NavLink>
        <NavLink to="/" className="auth-back"><ArrowRight size={15} /> Back to website</NavLink>
      </header>
      <main className="auth-layout">
        <div className="auth-promo">
          <span className="eyebrow">YOUR RECOVERY, YOUR RHYTHM</span>
          <h1>A little stronger, one step at a time.</h1>
          <p>
            Keep your recovery plan close, celebrate the progress you make, and
            stay connected to care that fits your life.
          </p>
          <div className="auth-promo-card">
            <span><HeartPulse /></span>
            <div><strong>Care that moves with you</strong><small>Personalised support for every milestone.</small></div>
            <TrendingUp />
          </div>
          <div className="auth-promo-points">
            <span><Check /> Your plan, all in one place</span>
            <span><Check /> Progress you can feel good about</span>
          </div>
        </div>
        <section className="auth-card">
          <span className="eyebrow">WELCOME TO PHYSIOMED</span>
          <h2>{mode === "register" ? "Create your account" : "Welcome back"}</h2>
          <p>
            {mode === "register"
              ? "Start your recovery journey in just a few steps."
              : "Log in to pick up right where you left off."}
          </p>
          {notice && <p className="authnotice" role="status">{notice}</p>}
          <form onSubmit={submit}>
            {mode === "register" && (
              <label>
                Full name
                <input
                  autoComplete="name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Alex Morgan"
                />
              </label>
            )}
            <label>
              Email address
              <input
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
              />
            </label>
            <label>
              Password
              <input
                type="password"
                autoComplete={mode === "register" ? "new-password" : "current-password"}
                minLength={mode === "register" ? 6 : undefined}
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder={mode === "register" ? "At least 6 characters" : "Enter your password"}
              />
            </label>
            {error && <p className="autherror" role="alert">{error}</p>}
            <button type="submit" className="primary full">
              {mode === "register" ? "Create my account" : "Log in to my account"}
              <ArrowRight size={16} />
            </button>
          </form>
          <p className="auth-switch">
            {mode === "register" ? "Already have an account?" : "Don’t have an account yet?"}{" "}
            <NavLink to={mode === "register" ? "/login" : "/register"}>
              {mode === "register" ? "Log in" : "Create an account"}
            </NavLink>
          </p>
          <div className="auth-secure"><Check size={14} /> Your recovery journey stays personal and secure.</div>
        </section>
      </main>
    </div>
  );
}
const Page = ({ children }) => <div className="page">{children}</div>;
function Stat({ icon, label, value, sub, c }) {
  return (
    <div className="stat">
      <i className={c}>{icon}</i>
      <div>
        <small>{label}</small>
        <h3>{value}</h3>
        <p>{sub}</p>
      </div>
    </div>
  );
}
function Title({ title, sub, children }) {
  return (
    <div className="title">
      <div>
        <h3>{title}</h3>
        {sub && <p>{sub}</p>}
      </div>
      {children}
    </div>
  );
}
function Row({ x, toggle }) {
  return (
    <div className="row">
      <i className={"art " + x.c}>
        <Dumbbell size={20} />
      </i>
      <div>
        <b>{x.name}</b>
        <small>
          <Clock size={13} />
          {x.mins} min · {x.reps}
        </small>
      </div>
      <span>{x.level}</span>
      <button
        className={x.done ? "check" : "start"}
        onClick={() => toggle(x.id)}
      >
        {x.done ? <Check size={16} /> : <Play size={14} />}
      </button>
    </div>
  );
}
function Overview({ ex, toggle, notify }) {
  let done = ex.filter((x) => x.done).length;
  return (
    <Page>
      <section className="hero">
        <div>
          <small>
            <Calendar size={14} /> Thursday, October 17
          </small>
          <h2>Good morning, Alex 👋</h2>
          <p>Small steps every day lead to stronger recovery.</p>
        </div>
        <button
          className="primary"
          onClick={() => notify("Your guided session is ready")}
        >
          <Play size={15} />
          Start today’s session
        </button>
      </section>
      <div className="stats">
        <Stat
          c="teal"
          icon={<Check />}
          label="Today’s completion"
          value={`${done * 25}%`}
          sub="On track for today"
        />
        <Stat
          c="violet"
          icon={<TrendingUp />}
          label="Weekly adherence"
          value="86%"
          sub="↑ 8% vs last week"
        />
        <Stat
          c="orange"
          icon={<Dumbbell />}
          label="Exercises completed"
          value={`${done + 15}/24`}
          sub="6 remaining this week"
        />
        <Stat
          c="pink"
          icon={<Flame />}
          label="Current streak"
          value="6 days"
          sub="Your personal best: 8"
        />
      </div>
      <div className="twocol">
        <section className="card">
          <Title title="Today’s therapy plan" sub="4 exercises · 32 minutes">
            <button className="link">
              View all <ChevronRight size={15} />
            </button>
          </Title>
          <div className="chips">
            <b>All</b>
            <span>Pending</span>
            <span>Completed</span>
          </div>
          {ex.slice(0, 4).map((x) => (
            <Row x={x} toggle={toggle} key={x.id} />
          ))}
        </section>
        <section className="card milestone">
          <i>
            <TrendingUp />
          </i>
          <h3>You’re building consistency!</h3>
          <p>
            You’ve completed 18 exercises this week. Keep moving at a pace that
            feels right for you.
          </p>
          <div className="label">
            <span>Weekly goal</span>
            <b>18 of 24</b>
          </div>
          <div className="progress">
            <i style={{ width: "75%" }} />
          </div>
          <small>6 more exercises to reach your weekly goal</small>
        </section>
      </div>
      <div className="twocol charts">
        <section className="card">
          <Title
            title="Weekly recovery activity"
            sub="Your completion rate this week"
          >
            <select>
              <option>This week</option>
              <option>This month</option>
            </select>
          </Title>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={week}>
              <CartesianGrid vertical={false} stroke="#edf1f3" />
              <XAxis dataKey="d" axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip />
              <Bar dataKey="value" fill="#0f766e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>
        <section className="card">
          <Title
            title="Pain progress"
            sub="Patient-reported demo data · 0–10 scale"
          />
          <ResponsiveContainer width="100%" height={210}>
            <LineChart data={pain}>
              <CartesianGrid vertical={false} stroke="#edf1f3" />
              <XAxis dataKey="d" axisLine={false} tickLine={false} />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Line dataKey="value" stroke="#7c83fd" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </section>
      </div>
    </Page>
  );
}
function Exercises({ ex, toggle, notify }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("All");
  const [active, setActive] = useState(null);
  let visible = ex.filter(
    (x) =>
      (filter === "All" || (filter === "Completed") === x.done) &&
      x.name.toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <Page>
      <Head
        title="My exercises"
        text="Your therapist-prescribed home exercise plan."
        action="Today’s plan"
      />
      <div className="tools">
        <label>
          <Search size={17} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search exercises"
          />
        </label>
        <div className="chips">
          {["All", "Pending", "Completed"].map((x) => (
            <button
              onClick={() => setFilter(x)}
              className={x === filter ? "on" : ""}
              key={x}
            >
              {x}
            </button>
          ))}
        </div>
      </div>
      <div className="grid">
        {visible.map((x) => (
          <article className="exercise" key={x.id}>
            <div className={"cover " + x.c}>
              <Dumbbell size={37} />
              {x.done && (
                <span>
                  <Check size={13} />
                  Completed
                </span>
              )}
            </div>
            <div className="body">
              <div>
                <span>{x.level}</span>
                <button
                  className={x.done ? "check" : "circle"}
                  onClick={() => toggle(x.id)}
                >
                  {x.done && <Check size={15} />}
                </button>
              </div>
              <h3>{x.name}</h3>
              <p>{x.note}</p>
              <small>
                <Clock size={13} />
                {x.mins} min · {x.reps}
              </small>
              <footer>
                <button className="link" onClick={() => setActive(x)}>
                  View details
                </button>
                <button
                  className="primary mini"
                  onClick={() => {
                    setActive(x);
                    notify(x.name + " ready to begin");
                  }}
                >
                  <Play size={13} />
                  Start
                </button>
              </footer>
            </div>
          </article>
        ))}
      </div>
      {!visible.length && (
        <div className="empty">No exercises match this search.</div>
      )}
      {active && (
        <Modal x={active} close={() => setActive(null)} toggle={toggle} />
      )}
    </Page>
  );
}
function Modal({ x, close, toggle }) {
  return (
    <div className="modalbg" onMouseDown={close}>
      <section className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <button className="x" onClick={close}>
          <X />
        </button>
        <div className={"video " + x.c}>
          <Play size={29} />
          <span>Guided demonstration</span>
        </div>
        <span>{x.level}</span>
        <h2>{x.name}</h2>
        <p>{x.note}</p>
        <div className="modalmeta">
          <span>
            <Clock /> {x.mins} minutes
          </span>
          <span>
            <Activity /> {x.reps}
          </span>
        </div>
        <h3>How to perform</h3>
        <ol>
          <li>Set up in a comfortable position.</li>
          <li>Move slowly with a controlled range of motion.</li>
          <li>Stop if you feel pain beyond your usual level.</li>
        </ol>
        <div className="warning">
          Follow your therapist-prescribed instructions. This demo does not
          replace professional medical advice.
        </div>
        <button className="primary full" onClick={() => toggle(x.id)}>
          <Check />
          Mark exercise complete
        </button>
      </section>
    </div>
  );
}
function Head({ title, text, action }) {
  return (
    <div className="head">
      <div>
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
      {action && (
        <button className="primary">
          <Calendar size={15} />
          {action}
        </button>
      )}
    </div>
  );
}
function Sessions({ ex, toggle, notify }) {
  const [i, setI] = useState(0),
    [run, setRun] = useState(false),
    [sec, setSec] = useState(0),
    [reps, setReps] = useState(0);
  useEffect(() => {
    if (!run) return;
    let t = setInterval(() => setSec((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [run]);
  let x = ex[i];
  return (
    <Page>
      <Head title="Guided session" text="Follow along at your own pace." />
      <div className="session">
        <section className="sessionvideo">
          <div className={"stage " + x.c}>
            <span>
              Exercise {i + 1} of {ex.length}
            </span>
            <Dumbbell size={68} />
          </div>
          <footer>
            <button onClick={() => setI(Math.max(0, i - 1))}>‹ Previous</button>
            <button className="timer" onClick={() => setRun(!run)}>
              {run ? <Pause /> : <Play />}
              {String((sec / 60) | 0).padStart(2, "0")}:
              {String(sec % 60).padStart(2, "0")}
            </button>
            <button onClick={() => setI(Math.min(ex.length - 1, i + 1))}>
              Next ›
            </button>
          </footer>
        </section>
        <section className="sessioncard">
          <span>{x.level}</span>
          <h2>{x.name}</h2>
          <p>{x.note}</p>
          <div className="label">
            <span>Session progress</span>
            <b>
              {i + 1}/{ex.length}
            </b>
          </div>
          <div className="progress">
            <i style={{ width: ((i + 1) / ex.length) * 100 + "%" }} />
          </div>
          <div className="reps">
            <span>Repetitions completed</span>
            <div>
              <button onClick={() => setReps(Math.max(0, reps - 1))}>−</button>
              <b>{reps}</b>
              <button onClick={() => setReps(reps + 1)}>+</button>
            </div>
            <small>Suggested: {x.reps}</small>
          </div>
          <button
            className="primary full"
            onClick={() => {
              toggle(x.id);
              notify("Exercise recorded");
            }}
          >
            <Check />
            Complete exercise
          </button>
          <button
            className="secondary full"
            onClick={() => {
              setRun(false);
              setSec(0);
              setReps(0);
            }}
          >
            Reset timer
          </button>
        </section>
      </div>
    </Page>
  );
}
function Analytics() {
  return (
    <Page>
      <Head
        title="Progress & analytics"
        text="A clear view of your recovery routine. Demo data is shown."
      />
      <div className="stats">
        <Stat
          c="teal"
          icon={<TrendingUp />}
          label="Plan adherence"
          value="86%"
          sub="↑ 8% from last period"
        />
        <Stat
          c="violet"
          icon={<Clock />}
          label="Exercise minutes"
          value="142"
          sub="This month"
        />
        <Stat
          c="orange"
          icon={<Check />}
          label="Completed sessions"
          value="18"
          sub="3 sessions remaining"
        />
        <Stat
          c="pink"
          icon={<Flame />}
          label="Longest streak"
          value="8 days"
          sub="Current: 6 days"
        />
      </div>
      <div className="twocol charts">
        <section className="card">
          <Title title="Adherence over time" sub="Daily completion rate" />
          <ResponsiveContainer width="100%" height={270}>
            <AreaChart data={week}>
              <XAxis dataKey="d" />
              <YAxis />
              <Tooltip />
              <Area dataKey="value" stroke="#0f766e" fill="#d1fae5" />
            </AreaChart>
          </ResponsiveContainer>
        </section>
        <section className="card">
          <Title title="Pain trend" sub="Patient-reported demo data" />
          <ResponsiveContainer width="100%" height={270}>
            <LineChart data={pain}>
              <XAxis dataKey="d" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Line dataKey="value" stroke="#7c83fd" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </section>
      </div>
    </Page>
  );
}
function Pain({ journal, setJournal, notify }) {
  const [f, setF] = useState({
    date: "2026-10-17",
    area: "Right knee",
    pain: 3,
    note: "",
  });
  const save = () => {
    if (!f.note.trim()) return notify("Add a short note before saving");
    setJournal([{ ...f, id: Date.now() }, ...journal]);
    setF({ ...f, note: "" });
    notify("Pain entry saved");
  };
  return (
    <Page>
      <Head
        title="Pain journal"
        text="Record your symptoms to help guide your next conversation with your care team."
      />
      <div className="pain">
        <section className="card form">
          <Title title="Log how you’re feeling" />
          <label>
            Date
            <input
              type="date"
              value={f.date}
              onChange={(e) => setF({ ...f, date: e.target.value })}
            />
          </label>
          <label>
            Body area
            <select
              value={f.area}
              onChange={(e) => setF({ ...f, area: e.target.value })}
            >
              <option>Right knee</option>
              <option>Left knee</option>
              <option>Lower back</option>
              <option>Hip</option>
            </select>
          </label>
          <label>
            Pain intensity{" "}
            <b>
              {f.pain}
              <small>/10</small>
            </b>
            <input
              type="range"
              min="0"
              max="10"
              value={f.pain}
              onChange={(e) => setF({ ...f, pain: +e.target.value })}
            />
          </label>
          <label>
            Notes
            <textarea
              value={f.note}
              onChange={(e) => setF({ ...f, note: e.target.value })}
              placeholder="What did you notice today?"
            />
          </label>
          <button className="primary full" onClick={save}>
            Save journal entry
          </button>
          <p className="fine">
            This records patient-reported symptoms and does not replace
            professional medical advice.
          </p>
        </section>
        <section className="card history">
          <Title title="Recent entries" sub="Your private local demo history" />
          {journal.map((x) => (
            <div className="journal" key={x.id}>
              <b>{x.pain}</b>
              <div>
                <strong>{x.area}</strong>
                <p>{x.note}</p>
                <small>{x.date}</small>
              </div>
              <button
                onClick={() => {
                  if (confirm("Delete this entry?")) {
                    setJournal(journal.filter((j) => j.id !== x.id));
                    notify("Entry deleted");
                  }
                }}
              >
                <X size={15} />
              </button>
            </div>
          ))}
        </section>
      </div>
    </Page>
  );
}
function Reports({ ex, journal, notify }) {
  const csv = () => {
    let a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob(
        [
          "Date,Body area,Pain,Notes\n" +
            journal
              .map((x) => `${x.date},${x.area},${x.pain},${x.note}`)
              .join("\n"),
        ],
        { type: "text/csv" },
      ),
    );
    a.download = "physiotrack-report.csv";
    a.click();
    notify("CSV report downloaded");
  };
  return (
    <Page>
      <Head
        title="Therapist reports"
        text="Create a local progress summary. Nothing is sent automatically."
      />
      <section className="card report">
        <div className="reporttop">
          <b className="brand">
            <i>
              <Activity />
            </i>
            Physio<span>Track</span>
          </b>
          <span>Demo-data preview</span>
        </div>
        <h2>Recovery progress summary</h2>
        <p>Alex Morgan · Reporting period: October 11–17, 2026</p>
        <div className="reportstats">
          <b>
            <small>Weekly adherence</small>86%
          </b>
          <b>
            <small>Completed exercises</small>
            {ex.filter((x) => x.done).length + 15}/24
          </b>
          <b>
            <small>Exercise minutes</small>142 min
          </b>
          <b>
            <small>Average pain entry</small>
            {journal.length
              ? (
                  journal.reduce((a, x) => a + x.pain, 0) / journal.length
                ).toFixed(1)
              : "—"}
            /10
          </b>
        </div>
        {ex.map((x) => (
          <div className="reportrow" key={x.id}>
            {x.name}
            <b>{x.done ? "Completed" : "Planned"}</b>
          </div>
        ))}
        <div className="warning">
          This report is generated locally for demonstration. Review the
          information with your healthcare professional.
        </div>
        <button className="primary" onClick={csv}>
          <Download size={15} />
          Export CSV
        </button>
        <button className="secondary" onClick={() => print()}>
          Print report
        </button>
      </section>
    </Page>
  );
}
function SettingsPage({ notify }) {
  const [s, setS] = useState(() =>
    get("pt-settings", {
      reminders: true,
      weekly: true,
      large: false,
      theme: "System",
    }),
  );
  const tog = (k) => setS({ ...s, [k]: !s[k] });
  const Toggle = ({ k, title, text }) => (
    <div className="toggle">
      <div>
        <b>{title}</b>
        <p>{text}</p>
      </div>
      <button onClick={() => tog(k)} className={s[k] ? "on" : ""}>
        <i />
      </button>
    </div>
  );
  return (
    <Page>
      <Head title="Settings" text="Manage your profile and experience." />
      <div className="settings">
        <section className="card form">
          <Title title="Patient profile" />
          <label>
            Display name
            <input defaultValue="Alex Morgan" />
          </label>
          <label>
            Email
            <input defaultValue="alex.morgan@example.com" />
          </label>
          <label>
            Preferred reminder time
            <input type="time" defaultValue="08:00" />
          </label>
        </section>
        <section className="card">
          <Title title="Notifications" />
          <Toggle
            k="reminders"
            title="Exercise reminders"
            text="Receive a reminder for your daily plan."
          />
          <Toggle
            k="weekly"
            title="Weekly check-in"
            text="See a summary of your weekly activity."
          />
        </section>
        <section className="card form">
          <Title title="Accessibility" />
          <Toggle
            k="large"
            title="Larger interface text"
            text="Improve readability across the portal."
          />
          <label>
            Theme
            <select
              value={s.theme}
              onChange={(e) => setS({ ...s, theme: e.target.value })}
            >
              <option>System</option>
              <option>Light</option>
              <option>Dark</option>
            </select>
          </label>
        </section>
      </div>
      <button
        className="primary"
        onClick={() => {
          localStorage.setItem("pt-settings", JSON.stringify(s));
          notify("Settings saved");
        }}
      >
        Save changes
      </button>
    </Page>
  );
}
export default App;
