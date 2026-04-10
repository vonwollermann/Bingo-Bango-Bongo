import { useState } from "react";

const TOTAL_HOLES = 18;

const DISC_ICON = "🥏";

const palette = {
  bg: "#0f1a0f",
  surface: "#162016",
  card: "#1c2b1c",
  border: "#2a3d2a",
  accent: "#7ecb6f",
  accentDim: "#4a8a3d",
  bingo: "#f5c842",
  bango: "#6fcfcf",
  bongo: "#f07060",
  text: "#e8f5e4",
  muted: "#7a9977",
};

const BingoIcon = ({ color }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="9" />
    <line x1="12" y1="2" x2="12" y2="6" />
    <line x1="12" y1="18" x2="12" y2="22" />
    <line x1="2" y1="12" x2="6" y2="12" />
    <line x1="18" y1="12" x2="22" y2="12" />
    <circle cx="12" cy="12" r="2" fill={color} stroke="none" />
  </svg>
);

const BasketIcon = ({ color }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {/* pole */}
    <line x1="12" y1="22" x2="12" y2="6" />
    {/* top disc / tee pad */}
    <ellipse cx="12" cy="6" rx="4" ry="1.2" fill={color} stroke="none" />
    {/* basket rim */}
    <ellipse cx="12" cy="13" rx="6" ry="1.5" />
    {/* basket body lines */}
    <line x1="6" y1="13" x2="7.5" y2="18" />
    <line x1="18" y1="13" x2="16.5" y2="18" />
    {/* basket bottom */}
    <ellipse cx="12" cy="18" rx="4.5" ry="1" />
    {/* chains suggestion */}
    <line x1="12" y1="6" x2="9" y2="13" strokeDasharray="1.5 1.5" />
    <line x1="12" y1="6" x2="12" y2="13" strokeDasharray="1.5 1.5" />
    <line x1="12" y1="6" x2="15" y2="13" strokeDasharray="1.5 1.5" />
  </svg>
);

const pointLabels = [
  { key: "bingo", label: "Bingo", desc: "First, or from longest distance, to land in C2", color: palette.bingo, Icon: BingoIcon },
  { key: "bango", label: "Bango", desc: "Closest to basket when first landing in C2", color: palette.bango, emoji: "🎯" },
  { key: "bongo", label: "Bongo", desc: "Longest putt", color: palette.bongo, Icon: BasketIcon },
];

function getInitialState() {
  return {
    screen: "setup",
    players: [],
    currentHole: 1,
    holes: Array.from({ length: TOTAL_HOLES }, () => ({ bingo: null, bango: null, bongo: null })),
  };
}

function Section({ label, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 11, color: palette.muted, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>
        {label}
      </div>
      {children}
    </div>
  );
}

export default function App() {
  const [state, setState] = useState(getInitialState());
  const [nameInputs, setNameInputs] = useState(["", "", "", ""]);
  const [playerCount, setPlayerCount] = useState(4);
  const [showSummary, setShowSummary] = useState(false);
  const [animHole, setAnimHole] = useState(false);

  const startGame = () => {
    const names = nameInputs
      .slice(0, playerCount)
      .map((n, i) => n.trim() || `Player ${i + 1}`);
    setState({
      ...getInitialState(),
      screen: "game",
      players: names,
      currentHole: 1,
      holes: Array.from({ length: TOTAL_HOLES }, () => ({ bingo: null, bango: null, bongo: null })),
    });
    setShowSummary(false);
  };

  const assignPoint = (pointKey, playerIndex) => {
    setState((prev) => {
      const holes = prev.holes.map((h, i) => {
        if (i !== prev.currentHole - 1) return h;
        return { ...h, [pointKey]: h[pointKey] === playerIndex ? null : playerIndex };
      });
      return { ...prev, holes };
    });
  };

  const nextHole = () => {
    if (state.currentHole < TOTAL_HOLES) {
      setAnimHole(true);
      setTimeout(() => setAnimHole(false), 300);
      setState((prev) => ({ ...prev, currentHole: prev.currentHole + 1 }));
    } else {
      setShowSummary(true);
    }
  };

  const prevHole = () => {
    if (state.currentHole > 1) {
      setState((prev) => ({ ...prev, currentHole: prev.currentHole - 1 }));
    }
  };

  const resetGame = () => {
    setState(getInitialState());
    setShowSummary(false);
    setNameInputs(["", "", "", ""]);
  };

  const getPlayerTotals = () =>
    state.players.map((_, pi) => {
      let total = 0;
      state.holes.forEach((h) => {
        if (h.bingo === pi) total++;
        if (h.bango === pi) total++;
        if (h.bongo === pi) total++;
      });
      return total;
    });

  const currentHoleData = state.holes[state.currentHole - 1] || {};
  const totals = getPlayerTotals();
  const maxPts = Math.max(...totals, 0);

  // ── SETUP SCREEN ──────────────────────────────────────────────
  if (state.screen === "setup") {
    return (
      <div style={{ minHeight: "100dvh", background: palette.bg, color: palette.text, fontFamily: "'Georgia', serif", display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 16px" }}>
        <div style={{ width: "100%", maxWidth: 420 }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: 52, marginBottom: 8 }}>{DISC_ICON}</div>
            <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: 2, color: palette.accent, margin: 0, textTransform: "uppercase" }}>
              Bingo Bango Bongo
            </h1>
            <p style={{ color: palette.muted, fontSize: 13, marginTop: 6, fontStyle: "italic" }}>
              Disc Golf Edition
            </p>
          </div>

          <Section label="Number of Players">
            <div style={{ display: "flex", gap: 8 }}>
              {[2, 3, 4].map((n) => (
                <button
                  key={n}
                  onClick={() => setPlayerCount(n)}
                  style={{ flex: 1, padding: "12px 0", borderRadius: 8, border: `2px solid ${playerCount === n ? palette.accent : palette.border}`, background: playerCount === n ? palette.accentDim : palette.card, color: palette.text, fontFamily: "inherit", fontSize: 17, fontWeight: 700, cursor: "pointer" }}
                >
                  {n}
                </button>
              ))}
            </div>
          </Section>

          <Section label="Player Names">
            {Array.from({ length: playerCount }).map((_, i) => (
              <input
                key={i}
                placeholder={`Player ${i + 1}`}
                value={nameInputs[i]}
                onChange={(e) =>
                  setNameInputs((prev) => prev.map((v, j) => (j === i ? e.target.value : v)))
                }
                style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: `1px solid ${palette.border}`, background: palette.surface, color: palette.text, fontFamily: "inherit", fontSize: 15, marginBottom: 8, outline: "none" }}
              />
            ))}
          </Section>

          <button
            onClick={startGame}
            style={{ width: "100%", padding: "16px 0", borderRadius: 12, border: "none", background: palette.accent, color: "#0f1a0f", fontFamily: "inherit", fontSize: 18, fontWeight: 900, cursor: "pointer", letterSpacing: 1, textTransform: "uppercase" }}
          >
            Start Round
          </button>
        </div>
      </div>
    );
  }

  // ── SUMMARY SCREEN ────────────────────────────────────────────
  if (showSummary) {
    return (
      <div style={{ minHeight: "100dvh", background: palette.bg, color: palette.text, fontFamily: "'Georgia', serif", display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 16px" }}>
        <div style={{ width: "100%", maxWidth: 420 }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 44, marginBottom: 4 }}>🏁</div>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: palette.accent, margin: 0, textTransform: "uppercase", letterSpacing: 2 }}>
              Final Results
            </h2>
          </div>

          {state.players.map((name, pi) => {
            const pts = totals[pi];
            const isWinner = pts === maxPts && maxPts > 0;
            return (
              <div
                key={pi}
                style={{ background: isWinner ? palette.accentDim : palette.card, border: `2px solid ${isWinner ? palette.accent : palette.border}`, borderRadius: 12, padding: "16px 20px", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {isWinner && <span style={{ fontSize: 20 }}>🥏</span>}
                  <span style={{ fontWeight: 700, fontSize: 17 }}>{name}</span>
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: isWinner ? palette.accent : palette.text }}>
                  {pts} pts
                </div>
              </div>
            );
          })}

          {/* Per-hole breakdown */}
          <Section label="Hole by Hole">
            <div style={{ background: palette.card, border: `1px solid ${palette.border}`, borderRadius: 10, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: `40px repeat(${state.players.length}, 1fr)`, borderBottom: `1px solid ${palette.border}`, padding: "8px 12px" }}>
                <div style={{ fontSize: 11, color: palette.muted }}>Hole</div>
                {state.players.map((n, pi) => (
                  <div key={pi} style={{ fontSize: 11, color: palette.muted, textAlign: "center" }}>{n.slice(0, 5)}</div>
                ))}
              </div>
              {state.holes.map((h, hi) => {
                const holePts = state.players.map((_, pi) =>
                  (h.bingo === pi ? 1 : 0) + (h.bango === pi ? 1 : 0) + (h.bongo === pi ? 1 : 0)
                );
                return (
                  <div key={hi} onClick={() => { setShowSummary(false); setState(prev => ({ ...prev, currentHole: hi + 1 })); }}
                    style={{ display: "grid", gridTemplateColumns: `40px repeat(${state.players.length}, 1fr)`, padding: "7px 12px", borderBottom: hi < TOTAL_HOLES - 1 ? `1px solid ${palette.border}` : "none", cursor: "pointer" }}>
                    <div style={{ fontSize: 13, color: palette.muted }}>{hi + 1}</div>
                    {holePts.map((p, pi) => (
                      <div key={pi} style={{ textAlign: "center", fontSize: 13, fontWeight: p > 0 ? 700 : 400, color: p > 0 ? palette.accent : palette.border }}>{p > 0 ? p : "–"}</div>
                    ))}
                  </div>
                );
              })}
            </div>
          </Section>

          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <button onClick={() => setShowSummary(false)} style={{ flex: 1, padding: "13px 0", borderRadius: 10, border: `2px solid ${palette.border}`, background: palette.card, color: palette.text, fontFamily: "inherit", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
              ← Back
            </button>
            <button onClick={resetGame} style={{ flex: 1, padding: "13px 0", borderRadius: 10, border: "none", background: palette.accent, color: "#0f1a0f", fontFamily: "inherit", fontSize: 15, fontWeight: 900, cursor: "pointer", textTransform: "uppercase" }}>
              New Round
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── GAME SCREEN ───────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100dvh", background: palette.bg, color: palette.text, fontFamily: "'Georgia', serif", display: "flex", flexDirection: "column", alignItems: "center", padding: "16px" }}>
      <div style={{ width: "100%", maxWidth: 420 }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <span style={{ fontSize: 12, color: palette.muted, textTransform: "uppercase", letterSpacing: 1 }}>
            {DISC_ICON} Bingo Bango Bongo
          </span>
          <button onClick={() => setShowSummary(true)} style={{ background: "none", border: `1px solid ${palette.border}`, borderRadius: 6, color: palette.muted, padding: "4px 10px", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
            Scores
          </button>
        </div>

        {/* Hole number */}
        <div style={{ textAlign: "center", marginBottom: 16, opacity: animHole ? 0.2 : 1, transition: "opacity 0.2s" }}>
          <div style={{ fontSize: 38, fontWeight: 900, color: palette.accent, lineHeight: 1 }}>
            Hole {state.currentHole}
          </div>
          <div style={{ color: palette.muted, fontSize: 12, marginTop: 2 }}>of {TOTAL_HOLES}</div>

          {/* Progress dots */}
          <div style={{ display: "flex", justifyContent: "center", gap: 5, marginTop: 10, flexWrap: "wrap" }}>
            {Array.from({ length: TOTAL_HOLES }).map((_, i) => {
              const h = state.holes[i];
              const filled = (h.bingo !== null ? 1 : 0) + (h.bango !== null ? 1 : 0) + (h.bongo !== null ? 1 : 0);
              const isCurrent = i === state.currentHole - 1;
              return (
                <div
                  key={i}
                  onClick={() => setState((prev) => ({ ...prev, currentHole: i + 1 }))}
                  style={{ width: 11, height: 11, borderRadius: "50%", background: isCurrent ? palette.accent : filled === 3 ? palette.accentDim : filled > 0 ? "#3a5a3a" : palette.surface, border: `1px solid ${isCurrent ? palette.accent : palette.border}`, cursor: "pointer", transition: "background 0.2s" }}
                />
              );
            })}
          </div>
        </div>

        {/* Point cards */}
        {pointLabels.map(({ key, label, desc, color, emoji, Icon }) => (
          <div key={key} style={{ background: palette.card, border: `1px solid ${palette.border}`, borderRadius: 14, padding: "13px 15px", marginBottom: 11 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 18, display: "flex", alignItems: "center" }}>{Icon ? <Icon color={color} /> : emoji}</span>
              <div>
                <div style={{ fontWeight: 900, fontSize: 15, color, letterSpacing: 1 }}>{label}</div>
                <div style={{ fontSize: 11, color: palette.muted }}>{desc}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {state.players.map((name, pi) => {
                const selected = currentHoleData[key] === pi;
                return (
                  <button
                    key={pi}
                    onClick={() => assignPoint(key, pi)}
                    style={{ flex: 1, padding: "9px 4px", borderRadius: 8, border: `2px solid ${selected ? color : palette.border}`, background: selected ? color + "33" : palette.surface, color: selected ? color : palette.muted, fontFamily: "inherit", fontSize: 12, fontWeight: selected ? 800 : 400, cursor: "pointer", transition: "all 0.15s", textAlign: "center", lineHeight: 1.3 }}
                  >
                    {name.length > 7 ? name.slice(0, 6) + "…" : name}
                    {selected && <div style={{ fontSize: 13, marginTop: 2 }}>✓</div>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Running totals */}
        <div style={{ background: palette.surface, border: `1px solid ${palette.border}`, borderRadius: 12, padding: "12px 16px", marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: palette.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
            Running Totals
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {state.players.map((name, pi) => (
              <div key={pi} style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: 11, color: palette.muted, marginBottom: 2 }}>
                  {name.length > 7 ? name.slice(0, 6) + "…" : name}
                </div>
                <div style={{ fontSize: 24, fontWeight: 900, color: totals[pi] === maxPts && maxPts > 0 ? palette.accent : palette.text }}>
                  {totals[pi]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nav buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={prevHole}
            disabled={state.currentHole === 1}
            style={{ flex: 1, padding: "14px 0", borderRadius: 10, border: `2px solid ${palette.border}`, background: state.currentHole === 1 ? palette.surface : palette.card, color: state.currentHole === 1 ? palette.border : palette.text, fontFamily: "inherit", fontSize: 15, fontWeight: 700, cursor: state.currentHole === 1 ? "not-allowed" : "pointer" }}
          >
            ← Prev
          </button>
          <button
            onClick={nextHole}
            style={{ flex: 2, padding: "14px 0", borderRadius: 10, border: "none", background: state.currentHole === TOTAL_HOLES ? palette.bongo : palette.accent, color: "#0f1a0f", fontFamily: "inherit", fontSize: 15, fontWeight: 900, cursor: "pointer", textTransform: "uppercase", letterSpacing: 1 }}
          >
            {state.currentHole === TOTAL_HOLES ? "Finish Round 🏁" : "Next Hole →"}
          </button>
        </div>
      </div>
    </div>
  );
}
