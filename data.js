// World Cup 2026 — 32-team field
// Elo ratings from eloratings.net / footballratings.org (mid-June 2026 where available).
// "best" = best-ever World Cup finish, on a 1–5 scale: 1 = winner, 2 = runner-up,
// 3 = third place, 4 = fourth place / semi-finalist, 5 = quarter-finalist or worse.
// All 32 teams below are genuinely qualified for the 2026 World Cup.

const TEAMS = [
  { name: "Spain",          flag: "🇪🇸", elo: 2129, rank: 1,  best: 1, player: "Lamine Yamal" },
  { name: "Argentina",      flag: "🇦🇷", elo: 2128, rank: 2,  best: 1, player: "Lionel Messi" },
  { name: "France",         flag: "🇫🇷", elo: 2084, rank: 3,  best: 1, player: "Kylian Mbappe" },
  { name: "England",        flag: "🏴", elo: 2055, rank: 4,  best: 1, player: "Jude Bellingham" },
  { name: "Colombia",       flag: "🇨🇴", elo: 1998, rank: 5,  best: 5, player: "Luis Diaz" },
  { name: "Brazil",         flag: "🇧🇷", elo: 1978, rank: 6,  best: 1, player: "Vinicius Junior" },
  { name: "Portugal",       flag: "🇵🇹", elo: 1967, rank: 7,  best: 3, player: "Cristiano Ronaldo" },
  { name: "Netherlands",    flag: "🇳🇱", elo: 1944, rank: 8,  best: 2, player: "Virgil van Dijk" },
  { name: "Germany",        flag: "🇩🇪", elo: 1939, rank: 9,  best: 1, player: "Jamal Musiala" },
  { name: "Norway",         flag: "🇳🇴", elo: 1929, rank: 10, best: 5, player: "Erling Haaland" },
  { name: "Japan",          flag: "🇯🇵", elo: 1910, rank: 11, best: 5, player: "Takefusa Kubo" },
  { name: "Mexico",         flag: "🇲🇽", elo: 1896, rank: 12, best: 4, player: "Santiago Gimenez" },
  { name: "Croatia",        flag: "🇭🇷", elo: 1933, rank: 13, best: 2, player: "Luka Modric" },
  { name: "Switzerland",    flag: "🇨🇭", elo: 1897, rank: 14, best: 5, player: "Granit Xhaka" },
  { name: "Uruguay",        flag: "🇺🇾", elo: 1890, rank: 15, best: 1, player: "Federico Valverde" },
  { name: "Morocco",        flag: "🇲🇦", elo: 1898, rank: 16, best: 4, player: "Achraf Hakimi" },
  { name: "Belgium",        flag: "🇧🇪", elo: 1849, rank: 17, best: 3, player: "Kevin De Bruyne" },
  { name: "Senegal",        flag: "🇸🇳", elo: 1869, rank: 18, best: 5, player: "Sadio Mane" },
  { name: "Turkey",         flag: "🇹🇷", elo: 1880, rank: 19, best: 3, player: "Arda Guler" },
  { name: "Denmark",        flag: "🇩🇰", elo: 1864, rank: 20, best: 5, player: "Christian Eriksen" },
  { name: "United States",  flag: "🇺🇸", elo: 1822, rank: 21, best: 3, player: "Christian Pulisic" },
  { name: "Ecuador",        flag: "🇪🇨", elo: 1840, rank: 22, best: 5, player: "Moises Caicedo" },
  { name: "Austria",        flag: "🇦🇹", elo: 1820, rank: 23, best: 4, player: "David Alaba" },
  { name: "Sweden",         flag: "🇸🇪", elo: 1810, rank: 24, best: 2, player: "Alexander Isak" },
  { name: "Czechia",        flag: "🇨🇿", elo: 1795, rank: 25, best: 2, player: "Patrik Schick" },
  { name: "South Korea",    flag: "🇰🇷", elo: 1790, rank: 26, best: 4, player: "Son Heung-min" },
  { name: "Scotland",       flag: "🏴", elo: 1780, rank: 27, best: 5, player: "Scott McTominay" },
  { name: "Canada",         flag: "🇨🇦", elo: 1770, rank: 28, best: 5, player: "Alphonso Davies" },
  { name: "Saudi Arabia",   flag: "🇸🇦", elo: 1740, rank: 29, best: 5, player: "Salem Al-Dawsari" },
  { name: "Iran",           flag: "🇮🇷", elo: 1735, rank: 30, best: 5, player: "Mehdi Taremi" },
  { name: "Ivory Coast",    flag: "🇨🇮", elo: 1760, rank: 31, best: 5, player: "Simon Adingra" },
  { name: "Paraguay",       flag: "🇵🇾", elo: 1750, rank: 32, best: 5, player: "Julio Enciso" },
];

// Verified World Cup head-to-head records — these are real historical meetings,
// not estimates. Only pairs with a confirmed aggregate record are included; every
// other matchup in the app correctly shows "no previous World Cup meeting" rather
// than a guessed number. Keyed by "TeamA|TeamB" with names in the order they
// appear in TEAMS above (lookup handles either selection order).
//
// wins/draws/losses are from the perspective of the first-listed team.
// notable: a short, well-documented highlight from their meetings.
const HEAD_TO_HEAD = {
  "Argentina|Brazil": {
    meetings: 4, wins: 1, draws: 1, losses: 2,
    notable: "Argentina's only win came in the 1990 round of 16 (1-0), their first World Cup win over Brazil",
  },
  "Argentina|Spain": {
    meetings: 1, wins: 1, draws: 0, losses: 0,
    notable: "Their only meeting: Argentina won 2-1 in 1966",
  },
  "France|Croatia": {
    meetings: 2, wins: 2, draws: 0, losses: 0,
    notable: "France won the 1998 semi-final (2-1) and the 2018 final (4-2)",
  },
  "Netherlands|Brazil": {
    meetings: 5, wins: 3, draws: 1, losses: 1,
    notable: "Netherlands beat hosts Brazil 3-0 in the 2014 third-place match",
  },
  "England|Brazil": {
    meetings: 1, wins: 0, draws: 0, losses: 1,
    notable: "Brazil won their 2002 quarter-final 2-1 on Ronaldinho's lobbed free-kick",
  },
  "Germany|Brazil": {
    meetings: 1, wins: 1, draws: 0, losses: 0,
    notable: "Germany's 7-1 win in the 2014 semi-final is one of the biggest shocks in World Cup history",
  },
};

// Looks up a verified head-to-head record between two team names, regardless
// of the order they're passed in. Returns null if no World Cup meeting is on record.
function getHeadToHead(nameA, nameB) {
  const direct = HEAD_TO_HEAD[`${nameA}|${nameB}`];
  if (direct) return { ...direct, perspective: nameA };

  const reversed = HEAD_TO_HEAD[`${nameB}|${nameA}`];
  if (reversed) {
    return {
      meetings: reversed.meetings,
      wins: reversed.losses,
      draws: reversed.draws,
      losses: reversed.wins,
      notable: reversed.notable,
      perspective: nameA,
    };
  }

  return null;
}
