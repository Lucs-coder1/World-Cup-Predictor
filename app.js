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
  document.getElementById("player1").textContent = a.player;
  document.getElementById("player2").textContent = b.player;

  renderHeadToHead(a, b);

  // a new matchup invalidates any scoreline shown for the previous one
  document.getElementById("scoreResult").hidden = true;
}

function renderHeadToHead(a, b) {
  const el = document.getElementById("h2hBody");
  const record = getHeadToHead(a.name, b.name);

  if (!record) {
    el.innerHTML = `<span class="h2h-none">No previous World Cup meeting</span>`;
    return;
  }

  const aName = record.perspective === a.name ? a.name : b.name;
  const bName = record.perspective === a.name ? b.name : a.name;
  const meetingWord = record.meetings === 1 ? "meeting" : "meetings";

  el.innerHTML = `
    <span class="h2h-record">${record.meetings} World Cup ${meetingWord}: ${aName} ${record.wins}, Draw ${record.draws}, ${bName} ${record.losses}</span>
    <span class="h2h-notable">${record.notable}</span>
  `;
}

t1Sel.addEventListener("change", updateMatch);
t2Sel.addEventListener("change", updateMatch);
updateMatch();

// ===================== play match (scoreline) =====================
// Reuses the exact win/draw/loss percentages already shown on the odds bar,
// then invents a plausible scoreline consistent with that outcome.

function randomGoals(maxLikely) {
  // weighted toward low scores, like real football
  const weights = [0.30, 0.32, 0.22, 0.11, 0.04, 0.01];
  let roll = Math.random();
  for (let g = 0; g < weights.length; g++) {
    roll -= weights[g];
    if (roll <= 0) return g;
  }
  return weights.length - 1;
}

function generateScoreline(outcome) {
  // outcome: "team1", "draw", or "team2"
  if (outcome === "draw") {
    const g = randomGoals();
    return [g, g];
  }
  const winnerGoals = Math.max(1, randomGoals());
  // loser scores fewer goals than the winner, with the same shape of bias toward low scores
  const loserGoals = Math.floor(Math.random() * winnerGoals);
  return outcome === "team1" ? [winnerGoals, loserGoals] : [loserGoals, winnerGoals];
}

function playMatchScore() {
  const i1 = parseInt(t1Sel.value, 10);
  const i2 = parseInt(t2Sel.value, 10);
  const a = TEAMS[i1];
  const b = TEAMS[i2];
  const { f1, f2, draw } = calcMatchChance(a, b);

  const roll = Math.random() * 100;
  let outcome;
  if (roll < f1) outcome = "team1";
  else if (roll < f1 + draw) outcome = "draw";
  else outcome = "team2";

  const [g1, g2] = generateScoreline(outcome);

  document.getElementById("scoreFlag1").textContent = a.flag;
  document.getElementById("scoreFlag2").textContent = b.flag;
  document.getElementById("scoreName1").textContent = a.name;
  document.getElementById("scoreName2").textContent = b.name;
  document.getElementById("scoreVal1").textContent = g1;
  document.getElementById("scoreVal2").textContent = g2;

  const outcomeEl = document.getElementById("scoreOutcome");
  if (outcome === "draw") {
    outcomeEl.textContent = "It's a draw";
  } else if (outcome === "team1") {
    outcomeEl.textContent = `${a.name} win`;
  } else {
    outcomeEl.textContent = `${b.name} win`;
  }

  document.getElementById("scoreResult").hidden = false;
}

document.getElementById("playMatchBtn").addEventListener("click", playMatchScore);

// ===================== champion picker =====================

const champSel = document.getElementById("champTeam");
TEAMS.forEach((t, i) => {
  champSel.add(new Option(`${t.flag} ${t.name}`, i));
});
champSel.value = 0;

function playMatch(i1, i2) {
  const { f1, f2 } = calcMatchChance(TEAMS[i1], TEAMS[i2]);
  const roll = Math.random() * 100;
  const winner = roll < f1 ? i1 : i2;
  const loser = winner === i1 ? i2 : i1;
  const winnerChance = winner === i1 ? f1 : f2;
  return { winner, loser, winnerChance };
}

function shuffledIndices(n) {
  const arr = Array.from({ length: n }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function pairUp(list) {
  const pairs = [];
  for (let i = 0; i < list.length; i += 2) pairs.push([list[i], list[i + 1]]);
  return pairs;
}

// Plays every match in a round, returns the winners (for the next round)
// and records each result (with its winner's win chance) into the upsets log.
function playRound(pairs, upsetLog) {
  return pairs.map((m) => {
    const result = playMatch(m[0], m[1]);
    upsetLog.push(result);
    return result.winner;
  });
}

// Returns the full 32-team bracket: r32, r16, qf, sf pairs, final pair, champion index,
// and a log of every match played (with the winner's pre-match win chance), used to
// find the biggest upset of the tournament.
function playTournament() {
  const upsetLog = [];
  const order = shuffledIndices(32);
  const r32 = pairUp(order);

  const r16Input = playRound(r32, upsetLog);
  const r16 = pairUp(r16Input);

  const qfInput = playRound(r16, upsetLog);
  const qf = pairUp(qfInput);

  const sfInput = playRound(qf, upsetLog);
  const sf = pairUp(sfInput);

  const finalPair = playRound(sf, upsetLog);
  const finalResult = playMatch(finalPair[0], finalPair[1]);
  upsetLog.push(finalResult);
  const champion = finalResult.winner;

  return { r32, r16, qf, sf, final: finalPair, champion, upsetLog };
}

// Finds the match where the winner had the lowest win chance —
// i.e. the most surprising result of this particular simulation.
function findBiggestUpset(upsetLog) {
  let biggest = upsetLog[0];
  for (const m of upsetLog) {
    if (m.winnerChance < biggest.winnerChance) biggest = m;
  }
  return biggest;
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
  const { r32, r16, qf, sf, final, champion } = result;

  const r32Winners = r16.flat();
  renderPairRound("slot-r32", r32, r32Winners, chosenIdx);

  const r16Winners = qf.flat();
  renderPairRound("slot-r16", r16, r16Winners, chosenIdx);

  const qfWinners = sf.flat();
  renderPairRound("slot-qf", qf, qfWinners, chosenIdx);

  renderPairRound("slot-sf", sf, final, chosenIdx);

  renderPairRound("slot-final", [final], [champion], chosenIdx);

  renderSingleRound("slot-winner", [champion], chosenIdx);
}

function setOutcomeLabel(result, chosenIdx) {
  const { r32, r16, qf, sf, final, champion } = result;
  const r32Winners = r16.flat();
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
  } else if (r32Winners.includes(chosenIdx)) {
    label = "Out in the round of 16";
    isWin = false;
  } else {
    label = "Out in the round of 32";
    isWin = false;
  }

  outcomeEl.textContent = label;
  outcomeEl.className = "champ-odds-sub " + (isWin ? "outcome-win" : "outcome-out");
}

function renderUpset(upsetLog) {
  const upset = findBiggestUpset(upsetLog);
  const el = document.getElementById("upsetCard");
  const winner = TEAMS[upset.winner];
  const loser = TEAMS[upset.loser];

  // winnerChance is the winner's pre-match win probability, so a low number
  // here means the winner was a heavy underdog — the lower, the bigger the upset.
  document.getElementById("upsetWinner").textContent = `${winner.flag} ${winner.name}`;
  document.getElementById("upsetLoser").textContent = `${loser.flag} ${loser.name}`;
  document.getElementById("upsetChance").textContent =
    `Had just a ${upset.winnerChance}% chance to win`;

  el.hidden = false;
}

const simBtn = document.getElementById("simBtn");
const simBtnLabel = document.getElementById("simBtnLabel");
const resultArea = document.getElementById("resultArea");

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
    const N = 4000;
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
    renderUpset(liveResult.upsetLog);

    resultArea.hidden = false;
    simBtn.disabled = false;
    simBtnLabel.textContent = "Run another simulation";
    simRunning = false;
  }, 30);
}

simBtn.addEventListener("click", runSimulation);
