import { useState, useEffect } from "react";
import { supabase } from "./supabase";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

const AI_TOOLS = ["Adobe Firefly","Gemini Omni","Grok Imagine","Hailuo 2.3","Kling 3.0","Luma Ray 3","Pika 2.5","PixVerse 5.5","Runway Gen 4.5","Seedance 2","Sora 2","Veo 3","Wan 2.6","Other"];
const CATEGORIES = ["Cinematic & Film","Music Videos","Art & Animation","Gaming","Nature & Space","Comedy","Education","Experimental","Short Film","Abstract"];

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');
  :root {
    --surface-base: #0a0a0a;
    --surface-raised: #141414;
    --surface-overlay: #1c1c1c;
    --surface-subtle: rgba(255,255,255,0.04);
    --text-primary: #FFFFFF;
    --text-secondary: rgba(255,255,255,0.70);
    --text-muted: rgba(255,255,255,0.40);
    --accent-green: #00CDAB;
    --accent-green-subtle: rgba(0,205,171,0.12);
    --accent-rose: #FFB64D;
    --accent-rose-subtle: rgba(255,182,77,0.12);
    --border-default: rgba(255,255,255,0.10);
    --border-subtle: rgba(255,255,255,0.05);
    --border-emphasis: rgba(0,205,171,0.35);
    --font-display: 'Rajdhani', sans-serif;
    --font-body: 'DM Sans', system-ui, sans-serif;
    --radius-sm: 6px;
    --radius-md: 10px;
    --radius-lg: 16px;
    --radius-xl: 24px;
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--surface-base); color: var(--text-primary); font-family: var(--font-body); min-height: 100vh; -webkit-font-smoothing: antialiased; }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: var(--surface-base); }
  ::-webkit-scrollbar-thumb { background: var(--border-default); border-radius: 2px; }
  h1, h2, h3 { font-family: var(--font-display); font-weight: 600; letter-spacing: 0.5px; line-height: 1.2; color: var(--text-primary); }
  input, textarea, select { background: var(--surface-raised); border: 1px solid var(--border-default); color: var(--text-primary); border-radius: var(--radius-md); padding: 10px 14px; font-size: 14px; font-family: var(--font-body); outline: none; width: 100%; height: 44px; transition: border-color 200ms ease; }
  input::placeholder, textarea::placeholder { color: var(--text-muted); }
  textarea { height: auto; min-height: 88px; resize: vertical; }
  input:focus, textarea:focus, select:focus { border-color: var(--accent-green); box-shadow: 0 0 0 3px rgba(0,205,171,0.15); }
  select option { background: var(--surface-overlay); }
  button { cursor: pointer; font-family: var(--font-body); border: none; outline: none; transition: all 200ms ease; }
  .logo { font-family: var(--font-display); font-weight: 700; font-size: 22px; letter-spacing: 1px; color: var(--text-primary); }
  .logo-accent { color: var(--accent-green); }
  .btn-primary { background: var(--accent-green); color: #0a0a0a; padding: 10px 22px; border-radius: var(--radius-md); font-size: 14px; font-weight: 600; font-family: var(--font-body); }
  .btn-primary:hover { opacity: 0.88; }
  .btn-secondary { background: transparent; border: 1px solid var(--border-default); color: var(--text-primary); padding: 10px 22px; border-radius: var(--radius-md); font-size: 14px; font-weight: 500; font-family: var(--font-body); }
  .btn-secondary:hover { border-color: var(--border-emphasis); color: var(--accent-green); }
  .btn-ghost { background: var(--surface-subtle); color: var(--text-secondary); padding: 9px 18px; border-radius: var(--radius-md); font-size: 14px; font-family: var(--font-body); border: none; }
  .btn-ghost:hover { background: var(--surface-raised); }
  .video-card { background: var(--surface-raised); border: 1px solid var(--border-default); border-radius: var(--radius-lg); overflow: hidden; cursor: pointer; transition: all 200ms ease; }
  .video-card:hover { border-color: var(--border-emphasis); transform: translateY(-4px); }
  .thumb-wrap { position: relative; width: 100%; aspect-ratio: 16/9; overflow: hidden; }
  .thumb-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .thumb-wrap::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 40%, var(--surface-raised) 100%); pointer-events: none; }
  .badge-tool { display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 4px; font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; background: var(--accent-green-subtle); color: var(--accent-green); font-family: var(--font-body); border: 1px solid rgba(0,205,171,0.25); }
  .badge-cat { display: inline-flex; align-items: center; padding: 4px 12px; border-radius: 99px; font-size: 11px; font-weight: 500; background: var(--surface-subtle); border: 1px solid var(--border-subtle); color: var(--text-secondary); font-family: var(--font-body); }
  .section-label { font-family: var(--font-body); font-size: 11px; font-weight: 600; letter-spacing: 0.10em; text-transform: uppercase; color: var(--accent-green); display: block; margin-bottom: 6px; }
  .nav-link { display: flex; align-items: center; gap: 10px; padding: 9px 14px; border-radius: var(--radius-sm); color: var(--text-secondary); font-size: 14px; cursor: pointer; transition: all 200ms ease; border: none; background: none; width: 100%; font-family: var(--font-body); }
  .nav-link:hover { color: var(--text-primary); background: var(--surface-subtle); }
  .nav-link.active { color: var(--accent-green); background: var(--accent-green-subtle); }
  .stat-card { background: var(--surface-raised); border: 1px solid var(--border-default); border-radius: var(--radius-lg); padding: 20px 24px; }
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); z-index: 1000; display: flex; align-items: flex-start; justify-content: center; padding: 32px 20px; overflow-y: auto; backdrop-filter: blur(4px); }
  .modal { background: var(--surface-overlay); border: 1px solid var(--border-default); border-radius: var(--radius-xl); width: 100%; max-width: 880px; margin: auto; }
  .divider { height: 1px; background: var(--border-default); margin: 20px 0; }
  .meta-label { font-family: var(--font-body); font-size: 11px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; color: var(--text-muted); }
  .toast { position: fixed; bottom: 24px; right: 24px; background: var(--surface-overlay); border: 1px solid var(--accent-green); border-radius: var(--radius-md); padding: 14px 20px; font-size: 14px; color: var(--text-primary); z-index: 2000; box-shadow: 0 8px 32px rgba(0,0,0,0.4); animation: slideIn 0.3s ease; }
  @keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .legal-content * { text-align: left !important; }

  /* ── MOBILE RESPONSIVE ── */
  .grid-4 { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 20px; }
  .hero-grid { display: grid; grid-template-columns: 1fr 1fr; }
  .sidebar { width: 220px; min-height: 100vh; flex-shrink: 0; }
  .bottom-nav { display: none; }
  .top-bar { height: 56px; padding: 0 24px; }
  .main-pad { padding: 36px 28px 48px; }
  .hero-text { padding: 40px 36px; }
  .legal-pad { padding: 48px 60px; }
  .stat-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; margin-bottom: 32px; }

  @media (max-width: 768px) {
    .sidebar { display: none !important; }
    .bottom-nav { display: flex !important; position: fixed; bottom: 0; left: 0; right: 0; background: var(--surface-raised); border-top: 1px solid var(--border-default); z-index: 100; height: 60px; }
    .bottom-nav button { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; background: none; border: none; color: var(--text-muted); font-size: 10px; font-family: var(--font-body); padding: 8px 4px; cursor: pointer; transition: color 200ms; }
    .bottom-nav button.active { color: var(--accent-green); }
    .bottom-nav button span.icon { font-size: 18px; line-height: 1; }
    .grid-4 { grid-template-columns: repeat(2, minmax(0,1fr)); gap: 12px; }
    .hero-grid { grid-template-columns: 1fr; }
    .hero-img { display: none; }
    .hero-text { padding: 28px 20px; }
    .hero-text h1 { font-size: 22px !important; }
    .top-bar { height: 52px; padding: 0 16px; }
    .main-pad { padding: 16px 16px 80px; }
    .legal-pad { padding: 24px 16px 80px; }
    .stat-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
    .modal { border-radius: var(--radius-lg) !important; margin: 0 !important; width: 100% !important; }
    .modal-overlay { padding: 16px 12px !important; align-items: flex-end !important; }
    .search-bar { padding: 10px 16px !important; }
    .video-table-row { grid-template-columns: auto 1fr auto !important; }
    .upload-grid { grid-template-columns: 1fr !important; }
  }

  @media (max-width: 480px) {
    .grid-4 { grid-template-columns: 1fr; gap: 12px; }
    .hero-text h1 { font-size: 20px !important; }
  }
`;

function Toast({ message, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, []);
  return <div className="toast">{message}</div>;
}

function Avatar({ src, size = 36, name = "" }) {
  return (
    <img src={src || `https://api.dicebear.com/7.x/initials/svg?seed=${name}`} alt={name}
      style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", border: "1px solid var(--border-default)", flexShrink: 0 }}
      onError={e => { e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${name}`; }} />
  );
}

function ToolBadge({ tool }) { return <span className="badge-tool">✦ {tool}</span>; }

function VideoCard({ video, onClick }) {
  return (
    <div className="video-card" onClick={() => onClick(video)}>
      <div className="thumb-wrap">
        <img src={video.thumbnail_url || video.thumbnail} alt={video.title}
          onError={e => { e.target.src = "https://picsum.photos/seed/fallback/400/225"; }} />
      </div>
      <div style={{ padding: "14px" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap", alignItems: "center" }}>
          <ToolBadge tool={video.ai_tool || video.tool} />
          <span className="badge-cat">{video.category}</span>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <Avatar src={video.avatar_url || video.avatar} size={30} name={video.creator_username || video.creator} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600, lineHeight: 1.3, marginBottom: 3, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{video.title}</p>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 1 }}>{video.creator_username || video.creator}</p>
            <p className="meta-label" style={{ marginTop: 2 }}>{(video.views || 0).toLocaleString()} views</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoGrid({ videos, onVideoClick }) {
  const isMobile = useIsMobile();
  const cols = isMobile ? (window.innerWidth <= 480 ? 1 : 2) : 4;
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`, gap: isMobile ? 12 : 20 }}>
      {videos.map(v => <VideoCard key={v.id} video={v} onClick={onVideoClick} />)}
    </div>
  );
}

function VideoModal({ video, onClose, currentUser, onSubscribe, subscriptions, onToast }) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const isSubscribed = subscriptions.includes(video.creator_username || video.creator);

  useEffect(() => {
    loadComments();
    loadLikes();
    incrementView();
  }, []);

  const incrementView = async () => {
    await supabase.from("videos").update({ views: (video.views || 0) + 1 }).eq("id", video.id);
  };

  const loadComments = async () => {
    const { data } = await supabase.from("comments").select("*").eq("video_id", video.id).order("created_at", { ascending: true });
    if (data) setComments(data);
    else setComments(video.comments || []);
  };

  const loadLikes = async () => {
    const { count } = await supabase.from("likes").select("*", { count: "exact" }).eq("video_id", video.id);
    setLikeCount(count || 0);
    if (currentUser) {
      const { data } = await supabase.from("likes").select("id").eq("video_id", video.id).eq("user_id", currentUser.id).single();
      setLiked(!!data);
    }
  };

  const toggleLike = async () => {
    if (!currentUser) { onToast("Please log in to like videos"); return; }
    if (liked) {
      await supabase.from("likes").delete().eq("video_id", video.id).eq("user_id", currentUser.id);
      setLikeCount(l => l - 1);
    } else {
      await supabase.from("likes").insert({ video_id: video.id, user_id: currentUser.id });
      setLikeCount(l => l + 1);
    }
    setLiked(!liked);
  };

  const postComment = async () => {
    if (!comment.trim() || !currentUser) { onToast("Please log in to comment"); return; }
    const newComment = { video_id: video.id, user_id: currentUser.id, username: currentUser.username, avatar_url: currentUser.avatar_url, content: comment };
    const { data } = await supabase.from("comments").insert(newComment).select().single();
    if (data) setComments(prev => [...prev, data]);
    setComment("");
  };

  const reportVideo = async () => {
    if (!currentUser) { onToast("Please log in to report"); return; }
    const reason = prompt("Please describe why you're reporting this video:");
    if (!reason) return;
    await supabase.from("reports").insert({ video_id: video.id, reporter_username: currentUser.username, reason });
    onToast("Report submitted. Thank you.");
  };

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div style={{ position: "relative" }}>
          <div className="thumb-wrap" style={{ borderRadius: "var(--radius-xl) var(--radius-xl) 0 0", overflow: "hidden", aspectRatio: "16/9" }}>
            {video.mux_playback_id ? (
              <iframe src={`https://stream.mux.com/${video.mux_playback_id}`} style={{ width: "100%", height: "100%", border: "none" }} allowFullScreen />
            ) : (
              <img src={video.thumbnail_url || video.thumbnail} alt={video.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            )}
          </div>
          <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, background: "rgba(15,18,38,0.8)", border: "1px solid var(--border-default)", color: "var(--text-primary)", width: 36, height: 36, borderRadius: "50%", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>
        <div style={{ padding: "28px 32px" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
            <ToolBadge tool={video.ai_tool || video.tool} />
            <span className="badge-cat">{video.category}</span>
            {video.age_restricted && <span className="badge-cat" style={{ color: "#f59e0b", borderColor: "rgba(245,158,11,0.3)" }}>18+</span>}
          </div>
          <h1 style={{ fontSize: 28, marginBottom: 18 }}>{video.title}</h1>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14, marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Avatar src={video.avatar_url || video.avatar} size={44} name={video.creator_username || video.creator} />
              <div>
                <p style={{ fontWeight: 500, fontSize: 15, color: "var(--text-primary)" }}>{video.creator_username || video.creator}</p>
                <p className="meta-label">{video.subscribers || 0} subscribers</p>
              </div>
              {currentUser && currentUser.username !== (video.creator_username || video.creator) && (
                <button onClick={() => onSubscribe(video.creator_username || video.creator)} className={isSubscribed ? "btn-secondary" : "btn-primary"} style={{ padding: "8px 18px", fontSize: 13 }}>
                  {isSubscribed ? "Following" : "Follow"}
                </button>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button onClick={toggleLike} className="btn-ghost" style={{ background: liked ? "var(--accent-green-subtle)" : "var(--surface-subtle)", color: liked ? "var(--accent-green)" : "var(--text-secondary)", border: liked ? "1px solid var(--border-emphasis)" : "none", display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                ♥ {likeCount.toLocaleString()}
              </button>
              <p className="meta-label">{(video.views || 0).toLocaleString()} views</p>
              <button onClick={reportVideo} className="btn-ghost" style={{ fontSize: 12, padding: "6px 12px" }}>⚑ Report</button>
            </div>
          </div>
          <div style={{ background: "var(--surface-raised)", borderRadius: "var(--radius-md)", padding: "16px", marginBottom: 24, border: "1px solid var(--border-subtle)" }}>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7 }}>{video.description}</p>
          </div>
          <div>
            <h3 style={{ fontSize: 18, marginBottom: 16 }}>Comments <span style={{ color: "var(--text-muted)", fontSize: 14, fontFamily: "var(--font-body)", fontWeight: 400 }}>({comments.length})</span></h3>
            {currentUser && (
              <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                <Avatar src={currentUser.avatar_url} size={36} name={currentUser.username} />
                <div style={{ flex: 1 }}>
                  <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Share your thoughts…" style={{ marginBottom: 10, fontSize: 13 }} />
                  <button className="btn-primary" style={{ padding: "8px 18px", fontSize: 13 }} onClick={postComment}>Post</button>
                </div>
              </div>
            )}
            {comments.map((c, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: 16, paddingBottom: 16, borderBottom: i < comments.length - 1 ? "1px solid var(--border-subtle)" : "none" }}>
                <Avatar src={c.avatar_url} size={32} name={c.username} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 4, color: "var(--text-primary)" }}>{c.username}</p>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{c.content || c.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthModal({ mode, onClose, onAuth, onToast }) {
  const [tab, setTab] = useState(mode);
  const [form, setForm] = useState({ username: "", email: "", password: "", dob: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setLoading(true);
    setError("");
    try {
      if (tab === "signup") {
        if (!form.username || !form.email || !form.password || !form.dob) { setError("All fields are required."); setLoading(false); return; }
        const age = (new Date() - new Date(form.dob)) / (1000 * 60 * 60 * 24 * 365.25);
        if (age < 13) { setError("You must be 13 or older to create an account."); setLoading(false); return; }
        const { data, error: signUpError } = await supabase.auth.signUp({ email: form.email, password: form.password });
        if (signUpError) { setError(signUpError.message); setLoading(false); return; }
        await supabase.from("users").insert({ id: data.user.id, username: form.username, email: form.email, dob: form.dob });
        onAuth({ id: data.user.id, username: form.username, email: form.email, dob: form.dob, avatar_url: null, subscribers: 0 });
        onToast("Welcome to Lorely! 🎉");
      } else {
        if (!form.email || !form.password) { setError("Enter your email and password."); setLoading(false); return; }
        const { data, error: signInError } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
        if (signInError) { setError(signInError.message); setLoading(false); return; }
        const { data: profile } = await supabase.from("users").select("*").eq("id", data.user.id).single();
        onAuth(profile || { id: data.user.id, username: form.email.split("@")[0], email: form.email });
        onToast("Welcome back!");
      }
    } catch (e) { setError("Something went wrong. Please try again."); }
    setLoading(false);
  };

  const Label = ({ children }) => (
    <label style={{ fontSize: 11, color: "var(--text-muted)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500 }}>{children}</label>
  );

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" style={{ maxWidth: 440, padding: 40, margin: "auto" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div className="logo" style={{ fontSize: 28, marginBottom: 6 }}>L<span className="logo-accent">o</span>rely</div>
          <p style={{ color: "var(--text-muted)", fontSize: 13 }}>The home of AI-created storytelling</p>
        </div>
        <div style={{ display: "flex", gap: 4, marginBottom: 28, background: "var(--surface-raised)", borderRadius: "var(--radius-md)", padding: 4 }}>
          {["login", "signup"].map(t => (
            <button key={t} onClick={() => { setTab(t); setError(""); }} style={{ flex: 1, padding: "9px", borderRadius: "var(--radius-sm)", background: tab === t ? "var(--accent-green)" : "transparent", color: tab === t ? "#fff" : "var(--text-secondary)", fontSize: 14, fontWeight: 500, border: "none", transition: "all 200ms" }}>
              {t === "login" ? "Log In" : "Sign Up"}
            </button>
          ))}
        </div>
        {tab === "signup" && <div style={{ marginBottom: 14 }}><Label>Username</Label><input placeholder="your_channel_name" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} /></div>}
        <div style={{ marginBottom: 14 }}><Label>Email</Label><input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
        <div style={{ marginBottom: 14 }}><Label>Password</Label><input type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></div>
        {tab === "signup" && <div style={{ marginBottom: 14 }}><Label>Date of Birth</Label><input type="date" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} /></div>}
        {error && <p style={{ color: "#f87171", fontSize: 13, marginBottom: 14 }}>{error}</p>}
        <button className="btn-primary" style={{ width: "100%", padding: "13px", fontSize: 15, marginTop: 4, opacity: loading ? 0.7 : 1 }} onClick={handle} disabled={loading}>
          {loading ? "Please wait…" : tab === "login" ? "Log In" : "Create Account"}
        </button>
        <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-muted)", marginTop: 18, lineHeight: 1.6 }}>By continuing you agree to our Terms & Privacy Policy</p>
      </div>
    </div>
  );
}

function UploadModal({ onClose, onUpload, currentUser, onToast }) {
  const [form, setForm] = useState({ title: "", description: "", tags: "", category: "", tools: [], otherTool: "", age_restricted: false });
  const [thumbFile, setThumbFile] = useState(null);
  const [thumbPreview, setThumbPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleThumb = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setThumbFile(file);
    setThumbPreview(URL.createObjectURL(file));
  };

  const submit = async () => {
    if (!form.title || !form.category || form.tools.length === 0) { onToast("Please fill in title, category and at least one AI tool."); return; }
    const toolLabel = form.tools.includes("Other") ? [...form.tools.filter(t => t !== "Other"), form.otherTool].filter(Boolean).join(", ") : form.tools.join(", ");
    setLoading(true);
    try {
      let thumbnail_url = null;
      if (thumbFile) {
        const ext = thumbFile.name.split(".").pop();
        const path = `${currentUser.id}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("thumbnails").upload(path, thumbFile);
        if (!uploadError) {
          const { data: urlData } = supabase.storage.from("thumbnails").getPublicUrl(path);
          thumbnail_url = urlData.publicUrl;
        }
      }
      const videoData = {
        title: form.title, description: form.description || "No description provided.",
        tags: form.tags, category: form.category, ai_tool: toolLabel,
        age_restricted: form.age_restricted, thumbnail_url,
        creator_id: currentUser.id, creator_username: currentUser.username,
        views: 0
      };
      const { data, error } = await supabase.from("videos").insert(videoData).select().single();
      if (error) { onToast("Upload failed. Please try again."); setLoading(false); return; }
      onUpload(data);
      onToast("Video uploaded successfully! 🎬");
      onClose();
    } catch (e) { onToast("Something went wrong."); }
    setLoading(false);
  };

  const Label = ({ children }) => (
    <label style={{ fontSize: 11, color: "var(--text-muted)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500 }}>{children}</label>
  );

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" style={{ maxWidth: 560, padding: 36, margin: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div><span className="section-label">Studio</span><h2 style={{ fontSize: 24 }}>Upload a Creation</h2></div>
          <button onClick={onClose} className="btn-ghost" style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, padding: 0, borderRadius: "50%" }}>×</button>
        </div>
        <div style={{ marginBottom: 16 }}><Label>Title *</Label><input placeholder="Give your creation a title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
        <div style={{ marginBottom: 16 }}><Label>Description</Label><textarea placeholder="Describe your creation…" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
        <div style={{ marginBottom: 16 }}><Label>Tags</Label><input placeholder="cinematic, neon, dreamscape" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} /></div>
        <div style={{ className="upload-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:16 }}> }}>
          <div><Label>Category *</Label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              <option value="">Select category</option>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div><Label>Made with AI Tool * (select all that apply)</Label>
            <div style={{ background: "var(--surface-raised)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: "12px 14px", maxHeight: 180, overflowY: "auto" }}>
              {AI_TOOLS.map(t => (
                <label key={t} style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 0", cursor: "pointer", fontSize: 13, color: form.tools.includes(t) ? "var(--accent-green)" : "var(--text-secondary)" }}>
                  <input type="checkbox" checked={form.tools.includes(t)} onChange={e => {
                    const updated = e.target.checked ? [...form.tools, t] : form.tools.filter(x => x !== t);
                    setForm({ ...form, tools: updated });
                  }} style={{ width: 14, height: 14, accentColor: "var(--accent-green)", flexShrink: 0 }} />
                  {t}
                </label>
              ))}
            </div>
            {form.tools.includes("Other") && (
              <input placeholder="Type the AI tool you used…" value={form.otherTool} onChange={e => setForm({ ...form, otherTool: e.target.value })} style={{ marginTop: 8, fontSize: 13 }} />
            )}
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <Label>Thumbnail</Label>
          <label style={{ display: "block", border: "1px dashed var(--border-default)", borderRadius: "var(--radius-md)", padding: "20px", textAlign: "center", cursor: "pointer", color: "var(--text-muted)", fontSize: 13, background: "var(--surface-raised)" }}>
            {thumbPreview ? <img src={thumbPreview} alt="thumb" style={{ height: 72, borderRadius: "var(--radius-sm)", objectFit: "cover" }} /> : "↑ Click to upload thumbnail"}
            <input type="file" accept="image/*" onChange={handleThumb} style={{ display: "none" }} />
          </label>
        </div>
        <div style={{ marginBottom: 16 }}>
          <Label>Video File</Label>
          <div style={{ border: "1px dashed var(--border-default)", borderRadius: "var(--radius-md)", padding: "20px", textAlign: "center", color: "var(--text-muted)", fontSize: 13, background: "var(--surface-raised)" }}>
            ↑ Mux video upload — connect Mux plugin to enable
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
          <input type="checkbox" id="agr" checked={form.age_restricted} onChange={e => setForm({ ...form, age_restricted: e.target.checked })} style={{ width: 16, height: 16, accentColor: "var(--accent-green)" }} />
          <label htmlFor="agr" style={{ fontSize: 13, color: "var(--text-secondary)", cursor: "pointer" }}>Mark as age restricted (18+)</label>
        </div>
        <button className="btn-primary" style={{ width: "100%", padding: "13px", fontSize: 15, opacity: loading ? 0.7 : 1 }} onClick={submit} disabled={loading}>
          {loading ? "Uploading…" : "Upload Creation"}
        </button>
      </div>
    </div>
  );
}

const EFFECTIVE_DATE = "7 June 2025";
const CONTACT_EMAIL = "lorely.help@gmail.com";

function LegalPage({ title, label, children }) {
  return (
    <div style={{ className="legal-pad" style={{ flex: 1, overflowY: "auto" }}>
      <span className="section-label" style={{ textAlign: "left", display: "block" }}>{label}</span>
      <h1 style={{ fontSize: 36, marginBottom: 8, textAlign: "left" }}>{title}</h1>
      <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 40, fontFamily: "var(--font-body)", textAlign: "left" }}>Effective date: {EFFECTIVE_DATE} · Lorely is operated by Aigenix, Western Australia, Australia</p>
      <div style={{ maxWidth: 720, fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.9, fontFamily: "var(--font-body)", textAlign: "left" }}>
        {children}
      </div>
    </div>
  );
}

function LegalSection({ title, children }) {
  return (
    <div style={{ marginBottom: 36, textAlign: "left" }}>
      <h2 style={{ fontSize: 18, marginBottom: 12, color: "var(--text-primary)", fontFamily: "var(--font-display)", textAlign: "left" }}>{title}</h2>
      <div style={{ color: "var(--text-secondary)", lineHeight: 1.9, textAlign: "left" }}>{children}</div>
    </div>
  );
}

function AboutPage() {
  return (
    <LegalPage title="About Lorely" label="Our Story">
      <LegalSection title="What is Lorely?">
        <p>Lorely is a video sharing platform built specifically for AI-generated content. We are the home for creators who use tools like Veo 3, Seedance, Kling, Runway, Sora, and other generative AI platforms to produce cinematic, artistic, and experimental video content.</p>
        <p style={{ marginTop: 12 }}>We built Lorely because we believe AI-generated video is one of the most exciting creative frontiers of our time — and creators deserve a dedicated space to share, discover, and grow their work.</p>
      </LegalSection>
      <LegalSection title="Our Mission">
        <p>To build the world's leading destination for AI-generated video — a place where human creativity and artificial intelligence combine to tell stories that could not exist any other way.</p>
      </LegalSection>
      <LegalSection title="Who Can Use Lorely?">
        <p>Lorely is open to anyone aged 13 and over. Creators can upload AI-generated video content, build a channel, grow a subscriber base, and — once eligible — earn revenue through our Creator Partner Program.</p>
        <p style={{ marginTop: 12 }}>Viewers can watch, like, comment on, and share videos from creators around the world, completely free.</p>
      </LegalSection>
      <LegalSection title="Content Standards">
        <p>All content on Lorely must be AI-generated or AI-assisted. Creators are required to disclose which AI tool was used to create their content. We believe in transparency — viewers have a right to know what they are watching and how it was made.</p>
        <p style={{ marginTop: 12 }}>We do not allow content that is harmful, misleading, discriminatory, or illegal. Full content guidelines are set out in our Terms of Service.</p>
      </LegalSection>
      <LegalSection title="Age Restriction">
        <p>Some content on Lorely is marked as age restricted by its creator. Age-restricted content is only accessible to users who are logged in and have verified they are 18 years of age or older. We take our obligations to protect younger users seriously.</p>
      </LegalSection>
      <LegalSection title="Contact Us">
        <p>We would love to hear from you. Whether you have a question, a concern, a creator inquiry, or a partnership opportunity — reach out to us at <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "var(--accent-green)" }}>{CONTACT_EMAIL}</a>.</p>
        <p style={{ marginTop: 12 }}>Lorely is operated by Aigenix, based in Western Australia, Australia.</p>
      </LegalSection>
    </LegalPage>
  );
}

function TermsPage() {
  return (
    <LegalPage title="Terms of Service" label="Legal">
      <p style={{ marginBottom: 32, padding: "16px 20px", background: "var(--surface-raised)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-default)", fontSize: 13 }}>
        Please read these Terms of Service carefully before using Lorely. By accessing or using the platform, you agree to be bound by these terms. If you do not agree, do not use Lorely.
      </p>

      <LegalSection title="1. Acceptance of Terms">
        <p>These Terms of Service ("Terms") constitute a legally binding agreement between you and Aigenix ("we", "us", "our"), the operator of Lorely ("Platform"). By creating an account or using any part of the Platform, you confirm that you have read, understood, and agree to these Terms and our Privacy Policy.</p>
        <p style={{ marginTop: 12 }}>We reserve the right to update these Terms at any time. Continued use of the Platform after changes are posted constitutes your acceptance of the updated Terms.</p>
      </LegalSection>

      <LegalSection title="2. Eligibility">
        <p>You must be at least 13 years of age to create an account on Lorely. By registering, you represent and warrant that you meet this age requirement. Users under 18 are not permitted to access age-restricted content.</p>
        <p style={{ marginTop: 12 }}>If you are under 18, you represent that your parent or legal guardian has reviewed and agreed to these Terms on your behalf.</p>
      </LegalSection>

      <LegalSection title="3. Account Registration">
        <p>You must provide accurate, current, and complete information when creating your account, including your date of birth. You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account.</p>
        <p style={{ marginTop: 12 }}>You must notify us immediately at {CONTACT_EMAIL} if you suspect any unauthorised use of your account. We are not liable for any loss or damage arising from your failure to maintain account security.</p>
        <p style={{ marginTop: 12 }}>We reserve the right to suspend or terminate any account at our sole discretion, with or without notice, for any breach of these Terms.</p>
      </LegalSection>

      <LegalSection title="4. Content You Upload">
        <p>Lorely is a platform for AI-generated and AI-assisted video content. By uploading content you confirm that:</p>
        <ul style={{ marginTop: 8, paddingLeft: 20, lineHeight: 2 }}>
          <li>The content was created using artificial intelligence tools</li>
          <li>You have disclosed which AI tool was used</li>
          <li>You have the right to upload and share the content</li>
          <li>The content does not infringe any third-party intellectual property rights</li>
          <li>The content complies with all applicable laws, including Australian law</li>
        </ul>
        <p style={{ marginTop: 12 }}>By uploading content to Lorely, you grant Aigenix a worldwide, non-exclusive, royalty-free licence to host, store, display, reproduce, and distribute your content solely for the purpose of operating and promoting the Platform. You retain all ownership of your content.</p>
      </LegalSection>

      <LegalSection title="5. Prohibited Content">
        <p>You must not upload, share, or promote content that:</p>
        <ul style={{ marginTop: 8, paddingLeft: 20, lineHeight: 2 }}>
          <li>Depicts or sexualises minors in any way</li>
          <li>Constitutes hate speech, harassment, or incitement to violence</li>
          <li>Is defamatory, fraudulent, or intentionally misleading</li>
          <li>Infringes copyright, trademarks, or other intellectual property rights</li>
          <li>Contains malware, spam, or other harmful material</li>
          <li>Depicts real identifiable individuals without their consent in a harmful or sexual manner</li>
          <li>Violates any applicable Australian or international law or regulation</li>
          <li>Presents AI-generated content as real footage in a way intended to deceive</li>
        </ul>
        <p style={{ marginTop: 12 }}>Violation of these rules may result in immediate content removal, account suspension, and where applicable, referral to law enforcement authorities.</p>
      </LegalSection>

      <LegalSection title="6. Age-Restricted Content">
        <p>Creators may designate content as age-restricted (18+). Age-restricted content is only accessible to users who have verified they are 18 or older based on the date of birth provided at registration. You must not provide false information about your age. Doing so is a breach of these Terms and may result in account termination.</p>
      </LegalSection>

      <LegalSection title="7. Intellectual Property">
        <p>All platform design, branding, software, and original content created by Aigenix is the intellectual property of Aigenix and is protected under Australian and international copyright law. You may not copy, reproduce, distribute, or create derivative works from our platform without our express written consent.</p>
        <p style={{ marginTop: 12 }}>If you believe any content on Lorely infringes your intellectual property rights, please contact us at {CONTACT_EMAIL} with details of the alleged infringement.</p>
      </LegalSection>

      <LegalSection title="8. Monetisation and Creator Payments">
        <p>Lorely operates a Creator Partner Program that allows eligible creators to earn revenue from their content through advertising and other means. Eligibility requirements, payment terms, and revenue share percentages are set by Aigenix and may change at any time with reasonable notice.</p>
        <p style={{ marginTop: 12 }}>Aigenix makes no guarantee of earnings. All payments are subject to applicable Australian tax law. Creators are responsible for declaring and paying any applicable taxes on earnings received through the Platform.</p>
      </LegalSection>

      <LegalSection title="9. Advertising">
        <p>Lorely may display advertising on the Platform. By using the Platform, you consent to the display of advertisements. We are not responsible for the content of third-party advertisements.</p>
      </LegalSection>

      <LegalSection title="10. Disclaimer of Warranties">
        <p>Lorely is provided on an "as is" and "as available" basis without any warranties of any kind, either express or implied. We do not warrant that the Platform will be uninterrupted, error-free, or free of viruses or other harmful components.</p>
        <p style={{ marginTop: 12 }}>To the maximum extent permitted by Australian consumer law, we disclaim all implied warranties including merchantability, fitness for a particular purpose, and non-infringement.</p>
      </LegalSection>

      <LegalSection title="11. Limitation of Liability">
        <p>To the maximum extent permitted by law, Aigenix and its directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the Platform, including but not limited to loss of data, loss of revenue, or loss of goodwill.</p>
        <p style={{ marginTop: 12 }}>Nothing in these Terms limits or excludes any rights you may have under the Australian Consumer Law that cannot be lawfully limited or excluded.</p>
      </LegalSection>

      <LegalSection title="12. Termination">
        <p>We reserve the right to suspend or terminate your account and access to the Platform at any time, for any reason, with or without notice. Upon termination, your right to use the Platform ceases immediately. Content you have uploaded may be removed at our discretion.</p>
        <p style={{ marginTop: 12 }}>You may terminate your account at any time by contacting us at {CONTACT_EMAIL}.</p>
      </LegalSection>

      <LegalSection title="13. Governing Law">
        <p>These Terms are governed by the laws of Western Australia, Australia. Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of Western Australia.</p>
      </LegalSection>

      <LegalSection title="14. Contact">
        <p>For any questions regarding these Terms, please contact us at <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "var(--accent-green)" }}>{CONTACT_EMAIL}</a>.</p>
      </LegalSection>
    </LegalPage>
  );
}

function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" label="Legal">
      <p style={{ marginBottom: 32, padding: "16px 20px", background: "var(--surface-raised)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-default)", fontSize: 13 }}>
        This Privacy Policy explains how Aigenix collects, uses, stores, and protects your personal information when you use Lorely. We are committed to protecting your privacy in accordance with the Australian Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs).
      </p>

      <LegalSection title="1. Who We Are">
        <p>Lorely is operated by Aigenix, based in Western Australia, Australia. References to "we", "us", or "our" in this policy refer to Aigenix. You can contact us at <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "var(--accent-green)" }}>{CONTACT_EMAIL}</a>.</p>
      </LegalSection>

      <LegalSection title="2. Information We Collect">
        <p>We collect the following categories of personal information:</p>
        <p style={{ marginTop: 12, fontWeight: 500, color: "var(--text-primary)" }}>Information you provide directly:</p>
        <ul style={{ marginTop: 6, paddingLeft: 20, lineHeight: 2 }}>
          <li>Username and email address (at registration)</li>
          <li>Date of birth (used solely for age verification)</li>
          <li>Profile picture and banner image (if uploaded)</li>
          <li>Video content, titles, descriptions, and tags you upload</li>
          <li>Comments you post</li>
          <li>Reports you submit</li>
        </ul>
        <p style={{ marginTop: 12, fontWeight: 500, color: "var(--text-primary)" }}>Information collected automatically:</p>
        <ul style={{ marginTop: 6, paddingLeft: 20, lineHeight: 2 }}>
          <li>IP address and approximate location</li>
          <li>Browser type and device information</li>
          <li>Pages visited and time spent on the Platform</li>
          <li>Video view counts and interaction data (likes, comments)</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. How We Use Your Information">
        <p>We use your personal information to:</p>
        <ul style={{ marginTop: 8, paddingLeft: 20, lineHeight: 2 }}>
          <li>Create and manage your account</li>
          <li>Verify your age and enforce content restrictions</li>
          <li>Display your content and profile to other users</li>
          <li>Process creator payments where applicable</li>
          <li>Respond to your support requests</li>
          <li>Monitor and moderate content for safety and compliance</li>
          <li>Improve and develop the Platform</li>
          <li>Send you important service-related communications</li>
          <li>Comply with our legal obligations under Australian law</li>
        </ul>
        <p style={{ marginTop: 12 }}>We will not use your personal information for any purpose not described in this policy without your consent.</p>
      </LegalSection>

      <LegalSection title="4. How We Store Your Information">
        <p>Your data is stored securely using Supabase, a cloud database provider with servers located in Singapore. Supabase complies with industry-standard security practices including encryption at rest and in transit.</p>
        <p style={{ marginTop: 12 }}>Video files are hosted through Mux, a professional video infrastructure provider. Thumbnail images are stored in Supabase Storage.</p>
        <p style={{ marginTop: 12 }}>We retain your data for as long as your account is active. If you delete your account, we will delete your personal information within 30 days, except where retention is required by law.</p>
      </LegalSection>

      <LegalSection title="5. Sharing Your Information">
        <p>We do not sell your personal information to third parties. We may share your information with:</p>
        <ul style={{ marginTop: 8, paddingLeft: 20, lineHeight: 2 }}>
          <li><strong style={{ color: "var(--text-primary)" }}>Service providers</strong> — Supabase (database), Mux (video hosting), and Stripe (payments) who process data on our behalf under strict data processing agreements</li>
          <li><strong style={{ color: "var(--text-primary)" }}>Law enforcement</strong> — where required by Australian law or court order</li>
          <li><strong style={{ color: "var(--text-primary)" }}>Advertising partners</strong> — anonymised and aggregated data only, never your personal identifying information</li>
        </ul>
        <p style={{ marginTop: 12 }}>All third-party service providers are required to handle your data securely and only for the purposes we specify.</p>
      </LegalSection>

      <LegalSection title="6. Cookies and Tracking">
        <p>Lorely uses essential cookies and local storage to keep you logged in and remember your preferences. We may also use analytics tools to understand how users interact with the Platform. These tools may collect anonymised usage data.</p>
        <p style={{ marginTop: 12 }}>If advertising is enabled on the Platform, third-party advertising partners (such as Google AdSense) may place cookies on your device to serve relevant advertisements. You can opt out of personalised advertising through your Google account settings.</p>
      </LegalSection>

      <LegalSection title="7. Your Rights">
        <p>Under the Australian Privacy Act 1988 and Australian Privacy Principles, you have the right to:</p>
        <ul style={{ marginTop: 8, paddingLeft: 20, lineHeight: 2 }}>
          <li>Access the personal information we hold about you</li>
          <li>Request correction of inaccurate or outdated information</li>
          <li>Request deletion of your personal information</li>
          <li>Withdraw consent for processing where consent is the basis for processing</li>
          <li>Lodge a complaint with the Office of the Australian Information Commissioner (OAIC)</li>
        </ul>
        <p style={{ marginTop: 12 }}>To exercise any of these rights, contact us at <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "var(--accent-green)" }}>{CONTACT_EMAIL}</a>. We will respond within 30 days.</p>
      </LegalSection>

      <LegalSection title="8. Children's Privacy">
        <p>Lorely is not directed at children under 13. We do not knowingly collect personal information from children under 13. If we become aware that a user is under 13, we will immediately delete their account and associated data.</p>
        <p style={{ marginTop: 12 }}>Users aged 13–17 may use the Platform with appropriate parental consent. Age-restricted content (18+) is not accessible to users under 18. We use the date of birth provided at registration to enforce this restriction.</p>
      </LegalSection>

      <LegalSection title="9. Data Breaches">
        <p>In the event of a data breach that is likely to result in serious harm to you, we will notify you and the Office of the Australian Information Commissioner (OAIC) as required under the Notifiable Data Breaches (NDB) scheme within 30 days of becoming aware of the breach.</p>
      </LegalSection>

      <LegalSection title="10. International Data Transfers">
        <p>Some of your data may be processed outside of Australia by our third-party service providers (including Supabase in Singapore and Mux in the United States). We take steps to ensure these transfers are made in accordance with the Australian Privacy Principles and that your data receives adequate protection.</p>
      </LegalSection>

      <LegalSection title="11. Changes to This Policy">
        <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by posting a notice on the Platform or by email. Your continued use of Lorely after changes are posted constitutes your acceptance of the updated policy.</p>
      </LegalSection>

      <LegalSection title="12. Complaints">
        <p>If you have a complaint about how we have handled your personal information, please contact us first at <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "var(--accent-green)" }}>{CONTACT_EMAIL}</a>. We will investigate and respond within 30 days.</p>
        <p style={{ marginTop: 12 }}>If you are not satisfied with our response, you may lodge a complaint with the Office of the Australian Information Commissioner (OAIC) at <a href="https://www.oaic.gov.au" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-green)" }}>www.oaic.gov.au</a>.</p>
      </LegalSection>

      <LegalSection title="13. Contact">
        <p>For any privacy-related questions or requests, contact us at <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "var(--accent-green)" }}>{CONTACT_EMAIL}</a>.</p>
        <p style={{ marginTop: 8, color: "var(--text-muted)", fontSize: 13 }}>Aigenix · Western Australia, Australia</p>
      </LegalSection>
    </LegalPage>
  );
}

function Sidebar({ page, setPage, currentUser }) {
  const links = [{ id: "home", icon: "⌂", label: "Home" }, { id: "trending", icon: "↑", label: "Trending" }, { id: "subscriptions", icon: "◎", label: "Subscriptions" }];
  return (
    <div className="sidebar" style={{ background: "var(--surface-base)", borderRight: "1px solid var(--border-default)", padding: "20px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
      <div className="logo" style={{ padding: "8px 0 8px 14px", marginBottom: 16, fontSize: 26, textAlign: "left" }}>L<span className="logo-accent">o</span>rely</div>
      {links.map(l => (
        <button key={l.id} className={`nav-link${page === l.id ? " active" : ""}`} onClick={() => setPage(l.id)}>
          <span style={{ fontSize: 15, color: "inherit", lineHeight: 1 }}>{l.icon}</span>{l.label}
        </button>
      ))}
      {currentUser && (
        <>
          <div className="divider" style={{ margin: "14px 0" }} />
          <p style={{ fontSize: 10, color: "var(--text-muted)", padding: "0 14px", marginBottom: 4, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500 }}>Your Studio</p>
          <button className={`nav-link${page === "channel" ? " active" : ""}`} onClick={() => setPage("channel")}><span style={{ fontSize: 15, color: "inherit" }}>◉</span>Your Channel</button>
          <button className={`nav-link${page === "dashboard" ? " active" : ""}`} onClick={() => setPage("dashboard")}><span style={{ fontSize: 15, color: "inherit" }}>▤</span>Dashboard</button>
          <button className={`nav-link${page === "admin" ? " active" : ""}`} onClick={() => setPage("admin")}><span style={{ fontSize: 15, color: "inherit" }}>◈</span>Admin Panel</button>
        </>
      )}
      <div style={{ flex: 1 }} />
      <div style={{ background: "var(--accent-green-subtle)", border: "1px solid var(--border-emphasis)", borderRadius: "var(--radius-md)", padding: "16px", margin: "8px 0", textAlign: "left" }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: "var(--accent-green)", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>Create with AI</p>
        <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6 }}>Share your Seedance, Veo, Kling and Gemini Omni creations with the world.</p>
      </div>
      <div style={{ display: "flex", gap: 14, padding: "6px 14px", flexWrap: "wrap" }}>
        {[["About","about"],["Terms","terms"],["Privacy","privacy"]].map(([l,id]) => (
          <span key={id} onClick={() => setPage(id)} style={{ fontSize: 11, color: "var(--text-muted)", cursor: "pointer", transition: "color 200ms" }}
            onMouseOver={e => e.target.style.color="var(--accent-green)"}
            onMouseOut={e => e.target.style.color="var(--text-muted)"}
          >{l}</span>
        ))}
      </div>
      <div style={{ padding: "8px 14px 4px" }}>
        <p style={{ fontSize: 10, color: "var(--text-muted)", opacity: 0.5 }}>Powered by <span style={{ color: "var(--accent-green)", opacity: 0.8 }}>Aigenix</span></p>
      </div>
    </div>
  );
}

function HomePage({ videos, onVideoClick, onUpload, currentUser }) {
  const isMobile = useIsMobile();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const filtered = videos.filter(v =>
    (search === "" || v.title.toLowerCase().includes(search.toLowerCase()) || (v.creator_username || v.creator || "").toLowerCase().includes(search.toLowerCase())) &&
    (category === "" || v.category === category)
  );
  return (
    <div style={{ flex: 1, overflowY: "auto" }}>

      {/* Hero Banner */}
      <div style={{ margin: isMobile ? "12px 12px 0" : "16px 16px 0", borderRadius: "var(--radius-lg)", overflow: "hidden", background: "#111" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", minHeight: isMobile ? 200 : 220 }}>
          <div style={{ padding: isMobile ? "24px 20px" : "40px 36px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", background: "linear-gradient(135deg, #0a0a0a 0%, #141414 100%)" }}>
            <h1 style={{ fontSize: isMobile ? 22 : 30, fontWeight: 700, lineHeight: 1.2, marginBottom: 12, color: "#fff", textAlign: "left" }}>
              The Home of AI-Generated Media
            </h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.60)", lineHeight: 1.7, marginBottom: 20, textAlign: "left" }}>
              Discover cinematic, machine-born creations from the world's most imaginative AI creators. Upload your own and join the future of generative video.
            </p>
            <button className="btn-primary" style={{ padding: "10px 20px", fontSize: 14, display: "flex", alignItems: "center", gap: 8 }} onClick={navToUpload}>
              + Upload Video
            </button>
          </div>
          {!isMobile && (
            <div style={{ position: "relative", overflow: "hidden" }}>
              <img src="https://images.unsplash.com/photo-1715615751025-e7ebe7f47eea?ixid=M3w2OTk3Mjl8MHwxfHJhbmRvbXx8fHx8fHx8fDE3ODA2Mjg1Mzh8&ixlib=rb-4.1.0" alt="AI Generated Media" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} onError={e => { e.target.src = "https://picsum.photos/seed/hero/800/400"; }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, #0a0a0a 0%, transparent 40%)" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, rgba(10,10,10,0.6) 100%)" }} />
            </div>
          )}
        </div>
      </div>

      {/* Search bar */}
      <div style={{ padding: isMobile ? "12px 12px 0" : "16px 16px 0", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ flex: 1, position: "relative" }}>
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: 14 }}>⌕</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search videos…" style={{ paddingLeft: 40, height: 40 }} />
        </div>
        {!isMobile && (
          <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: 160, height: 40, flexShrink: 0 }}>
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        )}
      </div>

      {/* Recent Uploads */}
      <div style={{ padding: isMobile ? "20px 12px 80px" : "28px 24px 48px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 16 }}>
          <div>
            <span className="section-label">Fresh from the community</span>
            <h2 style={{ fontSize: isMobile ? 20 : 26 }}>Recent Uploads</h2>
          </div>
          <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>See all →</span>
        </div>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "var(--text-muted)", marginBottom: 10 }}>No videos yet</p>
            <p style={{ fontSize: 14, color: "var(--text-muted)" }}>Be the first to upload an AI-generated video.</p>
          </div>
        ) : <VideoGrid videos={filtered} onVideoClick={onVideoClick} />}
      </div>
    </div>
  );
  function navToUpload() { onUpload(); }
}

function TrendingPage({ videos, onVideoClick }) {
  const isMobile = useIsMobile();
  const sorted = [...videos].sort((a, b) => (b.views || 0) - (a.views || 0));
  return (
    <div className="main-pad" style={{ flex: 1, overflowY: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
        <div><span className="section-label">Most watched · Last 7 days</span><h1 style={{ fontSize: isMobile ? 24 : 32 }}>Trending Now</h1></div>
        <span className="badge-cat" style={{ fontSize: 12 }}>Last 7 Days</span>
      </div>
      {sorted.length === 0 ? <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)", fontSize: 20 }}>No videos yet — be the first to upload!</p> : <VideoGrid videos={sorted} onVideoClick={onVideoClick} />}
    </div>
  );
}

function SubscriptionsPage({ videos, onVideoClick, subscriptions }) {
  const isMobile = useIsMobile();
  const subVideos = videos.filter(v => subscriptions.includes(v.creator_username || v.creator));
  return (
    <div className="main-pad" style={{ flex: 1, overflowY: "auto" }}>
      <div style={{ marginBottom: 28 }}><span className="section-label">Creators you follow</span><h1 style={{ fontSize: isMobile ? 24 : 32 }}>Your Feed</h1></div>
      {subVideos.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--text-muted)", marginBottom: 10 }}>Nothing here yet</p>
          <p style={{ fontSize: 14, color: "var(--text-muted)" }}>Follow creators to see their latest work here.</p>
        </div>
      ) : <VideoGrid videos={subVideos} onVideoClick={onVideoClick} />}
    </div>
  );
}

function ChannelPage({ currentUser, videos }) {
  const myVideos = videos.filter(v => (v.creator_username || v.creator) === currentUser?.username);
  if (!currentUser) return <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--text-muted)" }}>Please log in to view your channel.</p></div>;
  return (
    <div style={{ flex: 1, overflowY: "auto" }}>
      <div style={{ height: 200, background: "linear-gradient(135deg, #0a0a0a, #141414)", borderBottom: "1px solid var(--border-default)", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(45deg,transparent,transparent 30px,rgba(217,181,109,0.02) 30px,rgba(217,181,109,0.02) 31px)" }} />
      </div>
      <div style={{ padding: "0 32px 40px", marginTop: -52 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 20, marginBottom: 24 }}>
          <Avatar src={currentUser.avatar_url} size={96} name={currentUser.username} />
          <div style={{ flex: 1, paddingBottom: 6 }}>
            <h1 style={{ fontSize: 30 }}>{currentUser.username}</h1>
            <p className="meta-label" style={{ marginTop: 4 }}>{currentUser.subscribers || 0} subscribers</p>
          </div>
          <div style={{ display: "flex", gap: 10, paddingBottom: 6 }}>
            <button className="btn-secondary" style={{ fontSize: 13, padding: "9px 18px" }}>Edit Profile</button>
          </div>
        </div>
        <div className="divider" />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20 }}>
          <div><span className="section-label">All works</span><h2 style={{ fontSize: 22 }}>Uploads</h2></div>
        </div>
        {myVideos.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px", border: "1px dashed var(--border-default)", borderRadius: "var(--radius-lg)" }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "var(--text-muted)", marginBottom: 8 }}>No uploads yet</p>
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Head to Dashboard to upload your first creation.</p>
          </div>
        ) : <VideoGrid videos={myVideos} onVideoClick={() => {}} />}
      </div>
    </div>
  );
}

function DashboardPage({ currentUser, videos, onUploadClick }) {
  const isMobile = useIsMobile();
  const myVideos = videos.filter(v => (v.creator_username || v.creator) === currentUser?.username);
  const totalViews = myVideos.reduce((s, v) => s + (v.views || 0), 0);
  if (!currentUser) return <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--text-muted)" }}>Please log in to view your dashboard.</p></div>;

  const deleteVideo = async (id) => {
    if (!confirm("Delete this video? This cannot be undone.")) return;
    await supabase.from("videos").delete().eq("id", id);
  };

  return (
    <div className="main-pad" style={{ flex: 1, overflowY: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "flex-end", flexDirection: isMobile ? "column" : "row", gap: 12, marginBottom: 24 }}>
        <div><span className="section-label">Analytics</span><h1 style={{ fontSize: isMobile ? 24 : 32 }}>Creator Dashboard</h1></div>
        <button className="btn-primary" style={{ padding: "10px 20px", fontSize: 13 }} onClick={onUploadClick}>+ Upload New Video</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3,1fr)", gap: isMobile ? 10 : 16, marginBottom: 24 }}>
        {[{ label: "Total Views", value: totalViews.toLocaleString() }, { label: "Subscribers", value: currentUser.subscribers || 0 }, { label: "Videos Uploaded", value: myVideos.length }].map(s => (
          <div key={s.label} className="stat-card" style={{ padding: isMobile ? "14px 16px" : "20px 24px" }}>
            <p className="meta-label" style={{ marginBottom: 8 }}>{s.label}</p>
            <p style={{ fontFamily: "var(--font-display)", fontSize: isMobile ? 28 : 40, fontWeight: 600, color: "var(--text-primary)" }}>{s.value}</p>
          </div>
        ))}
      </div>
      <div style={{ background: "var(--surface-raised)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border-default)" }}>
          <h3 style={{ fontSize: 18 }}>Your Videos</h3>
        </div>
        {myVideos.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)", fontFamily: "var(--font-display)", fontSize: 18 }}>No videos uploaded yet.</div>
        ) : myVideos.map((v, i) => (
          <div key={v.id} style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 18px", borderBottom: i < myVideos.length - 1 ? "1px solid var(--border-subtle)" : "none" }}>
            <img src={v.thumbnail_url || v.thumbnail} alt={v.title} style={{ width: 60, height: 34, objectFit: "cover", borderRadius: "var(--radius-sm)", flexShrink: 0 }} onError={e => { e.target.src = "https://picsum.photos/seed/fallback/72/40"; }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 13, color: "var(--text-primary)", marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{v.title}</p>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <ToolBadge tool={v.ai_tool || v.tool} />
                <span className="meta-label">{(v.views || 0).toLocaleString()} views</span>
              </div>
            </div>
            <button className="btn-ghost" style={{ padding: "6px 10px", fontSize: 12, color: "#f87171", flexShrink: 0 }} onClick={() => deleteVideo(v.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminPage({ onToast }) {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({ reports: 0, flagged: 0, suspended: 0 });

  useEffect(() => { loadReports(); }, []);

  const loadReports = async () => {
    const { data, count } = await supabase.from("reports").select("*", { count: "exact" }).order("created_at", { ascending: false });
    if (data) setReports(data);
    setStats(s => ({ ...s, reports: count || 0 }));
  };

  const dismissReport = async (id) => {
    await supabase.from("reports").delete().eq("id", id);
    setReports(prev => prev.filter(r => r.id !== id));
    onToast("Report dismissed.");
  };

  const deleteVideo = async (videoId, reportId) => {
    await supabase.from("videos").delete().eq("id", videoId);
    await supabase.from("reports").delete().eq("id", reportId);
    setReports(prev => prev.filter(r => r.id !== reportId));
    onToast("Video deleted.");
  };

  return (
    <div className="main-pad" style={{ flex: 1, overflowY: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
        <div><span className="section-label">Moderation</span><h1 style={{ fontSize: 32 }}>Admin Panel</h1></div>
        <span className="badge-cat" style={{ color: "var(--accent-green)", borderColor: "var(--border-emphasis)" }}>Restricted Access</span>
      </div>
      <div className="stat-grid">
        {[{ label: "Open Reports", value: reports.length }, { label: "Flagged Videos", value: stats.flagged }, { label: "Suspended Accounts", value: stats.suspended }].map(s => (
          <div key={s.label} className="stat-card">
            <p className="meta-label" style={{ marginBottom: 12 }}>{s.label}</p>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 600 }}>{s.value}</p>
          </div>
        ))}
      </div>
      <span className="section-label" style={{ marginBottom: 16 }}>Awaiting Review</span>
      {reports.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px", border: "1px dashed var(--border-default)", borderRadius: "var(--radius-lg)" }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "var(--text-muted)" }}>No reports to review</p>
        </div>
      ) : reports.map((r, i) => (
        <div key={i} style={{ background: "var(--surface-raised)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-lg)", padding: 24, marginBottom: 16 }}>
          <p style={{ fontWeight: 500, fontSize: 15, color: "var(--text-primary)", marginBottom: 4 }}>Video ID: {r.video_id}</p>
          <p className="meta-label" style={{ marginBottom: 12 }}>Reported by {r.reporter_username}</p>
          <div style={{ background: "var(--surface-overlay)", borderRadius: "var(--radius-md)", padding: "14px 16px", marginBottom: 16, border: "1px solid var(--border-subtle)" }}>
            <p className="meta-label" style={{ marginBottom: 6 }}>Report Reason</p>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{r.reason}</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn-primary" style={{ fontSize: 13, padding: "8px 18px" }} onClick={() => deleteVideo(r.video_id, r.id)}>Delete Video</button>
            <button className="btn-ghost" style={{ fontSize: 13, padding: "8px 18px" }} onClick={() => dismissReport(r.id)}>Dismiss</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Lorely() {
  const isMobile = useIsMobile();
  const [page, setPage] = useState("home");
  const [currentUser, setCurrentUser] = useState(null);
  const [authModal, setAuthModal] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [videos, setVideos] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => setToast(msg);

  useEffect(() => {
    loadVideos();
    checkSession();
  }, []);

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data: profile } = await supabase.from("users").select("*").eq("id", session.user.id).single();
      if (profile) setCurrentUser(profile);
    }
  };

  const loadVideos = async () => {
    setLoading(true);
    const { data } = await supabase.from("videos").select("*").order("created_at", { ascending: false });
    if (data) setVideos(data);
    setLoading(false);
  };

  const handleAuth = (user) => { setCurrentUser(user); setAuthModal(null); };

  const handleSubscribe = async (creator) => {
    if (!currentUser) { setAuthModal("login"); return; }
    if (subscriptions.includes(creator)) {
      setSubscriptions(prev => prev.filter(s => s !== creator));
      showToast(`Unfollowed ${creator}`);
    } else {
      setSubscriptions(prev => [...prev, creator]);
      await supabase.from("subscriptions").insert({ subscriber_id: currentUser.id, creator_username: creator });
      showToast(`Now following ${creator}!`);
    }
  };

  const handleUpload = (video) => { setVideos(prev => [video, ...prev]); };

  const handleVideoClick = (video) => {
    const age = currentUser ? (new Date() - new Date(currentUser.dob)) / (1000 * 60 * 60 * 24 * 365.25) : 0;
    if (video.age_restricted && (!currentUser || age < 18)) {
      showToast(currentUser ? "This video is age restricted to viewers 18+." : "Please log in to watch age-restricted content.");
      return;
    }
    setSelectedVideo(video);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    showToast("Logged out.");
  };

  const navToUpload = () => { if (!currentUser) { setAuthModal("signup"); return; } setShowUpload(true); };

  return (
    <>
      <style>{STYLES}</style>
      <div style={{ display: "flex", minHeight: "100vh", background: "var(--surface-base)" }}>
        {!isMobile && <Sidebar page={page} setPage={setPage} currentUser={currentUser} />}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <div className="top-bar" style={{ background: "var(--surface-base)", borderBottom: "1px solid var(--border-default)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <button className="btn-primary" style={{ fontSize: 13, padding: "8px 18px", display: "flex", alignItems: "center", gap: 7 }} onClick={navToUpload}>
              <span style={{ fontSize: 18, lineHeight: 1, fontWeight: 300 }}>+</span> Upload Video
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {currentUser ? (
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Avatar src={currentUser.avatar_url} size={32} name={currentUser.username} />
                  <span style={{ fontSize: 14, color: "var(--text-primary)" }}>{currentUser.username}</span>
                  <button className="btn-ghost" style={{ fontSize: 13, padding: "7px 14px" }} onClick={handleLogout}>Log Out</button>
                </div>
              ) : (
                <>
                  <button className="btn-ghost" style={{ fontSize: 13, padding: "7px 16px" }} onClick={() => setAuthModal("login")}>Log In</button>
                  <button className="btn-primary" style={{ fontSize: 13, padding: "7px 16px" }} onClick={() => setAuthModal("signup")}>Sign Up</button>
                </>
              )}
            </div>
          </div>
          <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
            {loading ? (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--text-muted)" }}>Loading…</p>
              </div>
            ) : (
              <>
                {page === "home" && <HomePage videos={videos} onVideoClick={handleVideoClick} onUpload={navToUpload} currentUser={currentUser} />}
                {page === "trending" && <TrendingPage videos={videos} onVideoClick={handleVideoClick} />}
                {page === "subscriptions" && <SubscriptionsPage videos={videos} onVideoClick={handleVideoClick} subscriptions={subscriptions} />}
                {page === "channel" && <ChannelPage currentUser={currentUser} videos={videos} />}
                {page === "dashboard" && <DashboardPage currentUser={currentUser} videos={videos} onUploadClick={navToUpload} />}
                {page === "admin" && <AdminPage onToast={showToast} />}
                {page === "about" && <AboutPage />}
                {page === "terms" && <TermsPage />}
                {page === "privacy" && <PrivacyPage />}
              </>
            )}
          </div>
        </div>
      </div>
      {selectedVideo && <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} currentUser={currentUser} onSubscribe={handleSubscribe} subscriptions={subscriptions} onToast={showToast} />}
      {authModal && <AuthModal mode={authModal} onClose={() => setAuthModal(null)} onAuth={handleAuth} onToast={showToast} />}
      {showUpload && currentUser && <UploadModal onClose={() => setShowUpload(false)} onUpload={handleUpload} currentUser={currentUser} onToast={showToast} />}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      {/* Mobile Bottom Nav */}
      {isMobile && (
        <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "var(--surface-raised)", borderTop: "1px solid var(--border-default)", zIndex: 100, height: 60, display: "flex" }}>
          {[
            { id: "home", icon: "⌂", label: "Home" },
            { id: "trending", icon: "↑", label: "Trending" },
            { id: "upload", icon: "+", label: "Upload" },
            { id: "subscriptions", icon: "◎", label: "Feed" },
            { id: "channel", icon: "◉", label: "Profile" },
          ].map(l => (
            <button key={l.id}
              onClick={() => { if (l.id === "upload") { navToUpload(); return; } setPage(l.id); }}
              style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, background: "none", border: "none", color: (page === l.id || (l.id === "upload" && showUpload)) ? "var(--accent-green)" : "var(--text-muted)", fontSize: 10, fontFamily: "var(--font-body)", padding: "8px 4px", cursor: "pointer", transition: "color 200ms" }}>
              <span style={{ fontSize: l.id === "upload" ? 22 : 18, lineHeight: 1, fontWeight: l.id === "upload" ? 300 : 400 }}>{l.icon}</span>
              <span>{l.label}</span>
            </button>
          ))}
        </nav>
      )}
    </>
  );
}