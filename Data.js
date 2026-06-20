// World Cup 2026 — team data
// Elo, world ranking and best World Cup finish drive the match predictor.
// "odds" is the starting (pre-simulation) title chance, from 200,000 offline runs —
// it's shown as a baseline until the user runs their own simulation.

const TEAMS = [
  { name: "Spain",          flag: "🇪🇸", elo: 2129, rank: 1,  best: 1, player: "Lamine Yamal",      odds: 19.54 },
  { name: "France",         flag: "🇫🇷", elo: 2063, rank: 2,  best: 1, player: "Kylian Mbappe",     odds: 15.02 },
  { name: "Argentina",      flag: "🇦🇷", elo: 2115, rank: 3,  best: 1, player: "Lionel Messi",      odds: 12.55 },
  { name: "England",        flag: "🏴", elo: 2020, rank: 4,  best: 1, player: "Jude Bellingham",   odds: 10.31 },
  { name: "Portugal",       flag: "🇵🇹", elo: 1985, rank: 5,  best: 3, player: "Cristiano Ronaldo", odds: 4.48 },
  { name: "Brazil",         flag: "🇧🇷", elo: 1991, rank: 6,  best: 1, player: "Vinicius Junior",   odds: 8.16 },
  { name: "Netherlands",    flag: "🇳🇱", elo: 1940, rank: 7,  best: 2, player: "Virgil van Dijk",   odds: 4.71 },
  { name: "Morocco",        flag: "🇲🇦", elo: 1898, rank: 8,  best: 4, player: "Achraf Hakimi",     odds: 2.52 },
  { name: "Belgium",        flag: "🇧🇪", elo: 1885, rank: 9,  best: 3, player: "Kevin De Bruyne",   odds: 2.82 },
  { name: "Germany",        flag: "🇩🇪", elo: 1952, rank: 10, best: 1, player: "Jamal Musiala",     odds: 6.05 },
  { name: "Croatia",        flag: "🇭🇷", elo: 1870, rank: 11, best: 2, player: "Luka Modric",       odds: 3.34 },
  { name: "Colombia",       flag: "🇨🇴", elo: 1935, rank: 13, best: 5, player: "Luis Diaz",         odds: 1.58 },
  { name: "Senegal",        flag: "🇸🇳", elo: 1810, rank: 14, best: 5, player: "Sadio Mane",        odds: 1.33 },
  { name: "Mexico",         flag: "🇲🇽", elo: 1795, rank: 15, best: 5, player: "Santiago Gimenez",  odds: 1.33 },
  { name: "United States",  flag: "🇺🇸", elo: 1822, rank: 16, best: 3, player: "Christian Pulisic", odds: 1.93 },
  { name: "Uruguay",        flag: "🇺🇾", elo: 1944, rank: 17, best: 1, player: "Federico Valverde", odds: 4.32 },
];
