// ===================== utils =====================

function ordinal(n) {
  const s = ["th", "st", "nd", "rd"], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function pctFmt(n) {
  return (Math.round(n * 10) / 10).toFixed(1) + "%";
}

// ===================== nav / tabs =====================

const panels = {
  match: document.getElementById("panel-match"),
  champ: document.getElementById("panel-champ"),
};
const navBtns = {
  match: document.getElementById("nav-match"),
  champ: document.getElementById("nav-champ"),
};

function showPanel(key) {
  Object.keys(panels).forEach((k) => {
    panels[k].hidden = k !== key;
    navBtns[k].classList.toggle("active", k === key);
  });
}

navBtns.match.addEventListener("click", () => showPanel("match"));
navBtns.champ.addEventListener("click", () => showPanel("champ"));

// ===================== match predictor =====================
// Same formula as the original script: average of Elo share, ranking share,
// and best-finish share, with the draw carved symmetrically out of the gap.

function calcMatchChance(a, b) {
  const eloP1 = (100 / (a.elo + b.elo)) * a.elo;
  const eloP2 = (100 / (a.elo + b.elo)) * b.elo;
  const rankP1 = (100 / (a.rank + b.rank)) * b.rank;
  const rankP2 = (100 / (a.rank + b.rank)) * a.rank;
  const bestP1 = (100 / (a.best + b.best)) * b.best;
  const bestP2 = (100 / (a.best + b.best)) * a.best;

  let f1 = Math.round((eloP1 + rankP1 + bestP1) / 3);
  let f2 = Math.round((eloP2 + rankP2 + bestP2) / 3);
  let draw = Math.round(100 - Math.abs(f1 - f2)) / 3;
  f1 = f1 - Math.round(draw / 2);
  f2 = f2 - Math.round(draw / 2);
  return { f1, f2, draw: Math.round(draw) };
}

const t1Sel = document.getElementById("team1");
const t2Sel = document.getElementById("team2");

TEAMS.forEach((t, i) => {
  t1Sel.add(new Option(`${t.flag} ${t.name}`, i));
  t2Sel.add(new Option(`${t.flag} ${t.name}`, i));
});
t1Sel.value = 0;
t2Sel.value = 2;

function updateMatch() {
  const i1 = parseInt(t1Sel.value, 10);
  const i2 = parseInt(t2Sel.value, 10);
  const a = TEAMS[i1];
  const b = TEAMS[i2];
  const { f1, f2, draw } = calcMatchChance(a, b);

  document.getElementById("bar1").style.width = f1 + "%";
  document.getElementById("barD").style.width = draw + "%";
  document.getElementById("bar2").style.width = f2 + "%";

  document.getElementById("name1").textContent = a.name;
  document.getElementById("name2").textContent = b.name;
  document.getElementById("pct1").textContent = f1 + "%";
  document.getElementById("pctD").textContent = draw + "%";
  document.getElementById("pct2").textContent = f2 + "%";

  document.getElementById("h1").textContent = a.name;
  document.getElementById("h2").textContent = b.name;
  document.getElementById("elo1").textContent = a.elo;
  document.getElementById("elo2").textContent = b.elo;
  document.getElementById("rank1").textContent = "#" + a.rank;
  document.getElementById("rank2").textContent = "#" + b.rank;
  document.getElementById("best1").textContent = ordinal(a.best);
  document.getElementById("best2").textContent = ordinal(b.best);
}

t1Sel.addEventListener("change", updateMatch);
t2Sel.addEventListener("change", updateMatch);
updateMatch();

// ===================== champion picker =====================

const champSel = document.getElementById("champTeam");
TEAMS.forEach((t, i) => {
  champSel.add(new Option(`${t.flag} ${t.name}`, i));
});
champSel.value = 0;

function playMatch(i1, i2) {
  const { f1 } = calcMatchChance(TEAMS[i1], TEAMS[i2]);
  const roll = Math.random() * 100;
  return roll < f1 ? i1 : i2;
}

function shuffledIndices(n) {
  const arr = Array.from({ length: n }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Returns the full bracket: r16 pairs, qf pairs (winners only as input),
// sf pairs, final pair, and the champion index.
function playTournament() {
  const order = shuffledIndices(16);
  const r16 = [];
  for (let i = 0; i < 16; i += 2) r16.push([order[i], order[i + 1]]);

  const qfInput = r16.map((m) => playMatch(m[0], m[1]));
  const qf = [];
  for (let i = 0; i < 8; i += 2) qf.push([qfInput[i], qfInput[i + 1]]);

  const sfInput = qf.map((m) => playMatch(m[0], m[1]));
  const sf = [];
  for (let i = 0; i < 4; i += 2) sf.push([sfInput[i], sfInput[i + 1]]);

  const finalPair = sf.map((m) => playMatch(m[0], m[1]));
  const champion = playMatch(finalPair[0], finalPair[1]);

  return { r16, qf, sf, final: finalPair, champion };
}

function teamChip(idx, advanced, highlightIdx) {
  const t = TEAMS[idx];
  const isHighlight = idx === highlightIdx;
  const cls = ["match-team"];
  if (advanced) cls.push("advanced");
  if (isHighlight) cls.push("highlight");
  return `<div class="${cls.join(" ")}">
    <span class="match-flag">${t.flag}</span>
    <span class="match-team-name">${t.name}</span>
  </div>`;
}

function renderPairRound(containerId, pairs, winners, highlightIdx) {
  const el = document.getElementById(containerId);
  el.innerHTML = pairs
    .map((pair, i) => {
      const winnerIdx = winners[i];
      const a = pair[0], b = pair[1];
      return `<div class="match-pair">
        ${teamChip(a, a === winnerIdx, highlightIdx)}
        <div class="match-divider"></div>
        ${teamChip(b, b === winnerIdx, highlightIdx)}
      </div>`;
    })
    .join("");
}

function renderSingleRound(containerId, indices, highlightIdx) {
  const el = document.getElementById(containerId);
  el.innerHTML = indices
    .map((idx) => {
      const t = TEAMS[idx];
      const isHighlight = idx === highlightIdx;
      return `<div class="single-slot${isHighlight ? " highlight" : ""}">
        <span class="match-flag">${t.flag}</span>
        <span>${t.name}</span>
      </div>`;
    })
    .join("");
}

function renderBracket(result, chosenIdx) {
  const { r16, qf, sf, final, champion } = result;

  // round of 16 -> quarter-finals winners
  const r16Winners = qf.flat();
  renderPairRound("slot-r16", r16, r16Winners, chosenIdx);

  // quarter-finals -> semi-final winners
  const qfWinners = sf.flat();
  renderPairRound("slot-qf", qf, qfWinners, chosenIdx);

  // semi-finals -> final pair
  renderPairRound("slot-sf", sf, final, chosenIdx);

  // final
  renderSingleRound("slot-final", final, chosenIdx);

  // winner
  renderSingleRound("slot-winner", [champion], chosenIdx);
}

function setOutcomeLabel(result, chosenIdx) {
  const { r16, qf, sf, final, champion } = result;
  const r16Winners = qf.flat();
  const qfWinners = sf.flat();

  const outcomeEl = document.getElementById("champOutcome");
  let label, isWin;

  if (champion === chosenIdx) {
    label = "Champion! 🏆";
    isWin = true;
  } else if (final.includes(chosenIdx)) {
    label = "Lost the final";
    isWin = false;
  } else if (qfWinners.includes(chosenIdx)) {
    label = "Lost in the semi-finals";
    isWin = false;
  } else if (r16Winners.includes(chosenIdx)) {
    label = "Lost in the quarter-finals";
    isWin = false;
  } else {
    label = "Out in the round of 16";
    isWin = false;
  }

  outcomeEl.textContent = label;
  outcomeEl.className = "champ-odds-sub " + (isWin ? "outcome-win" : "outcome-out");
}

const simBtn = document.getElementById("simBtn");
const simBtnLabel = document.getElementById("simBtnLabel");
const resultArea = document.getElementById("resultArea");
const champOddsCard = document.getElementById("champOddsCard");

let simRunning = false;

function runSimulation() {
  if (simRunning) return;
  simRunning = true;
  simBtn.disabled = true;
  simBtnLabel.textContent = "Simulating...";

  const chosenIdx = parseInt(champSel.value, 10);
  const chosenTeam = TEAMS[chosenIdx];

  setTimeout(() => {
    // Run a single live tournament to show the bracket...
    const liveResult = playTournament();

    // ...and a larger batch to give a fresh title-odds read for the chosen team.
    const N = 5000;
    let chosenWins = 0;
    for (let i = 0; i < N; i++) {
      const r = playTournament();
      if (r.champion === chosenIdx) chosenWins++;
    }
    const freshOdds = (chosenWins / N) * 100;

    document.getElementById("champResultLabel").textContent =
      `Title odds for ${chosenTeam.flag} ${chosenTeam.name}`;
    document.getElementById("champPct").textContent = pctFmt(freshOdds);

    setOutcomeLabel(liveResult, chosenIdx);
    renderBracket(liveResult, chosenIdx);

    resultArea.hidden = false;
    simBtn.disabled = false;
    simBtnLabel.textContent = "Run another simulation";
    simRunning = false;
  }, 30);
}

simBtn.addEventListener("click", runSimulation);
