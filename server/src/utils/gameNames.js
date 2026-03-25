const ADJECTIVES = [
  "Amber", "Ancient", "Autumn", "Bold", "Bright", "Calm", "Clever", "Cloudy", "Crimson", "Crystal",
  "Daring", "Dawn", "Deep", "Electric", "Emerald", "Fierce", "Golden", "Grand", "Hidden", "Icy",
  "Ivory", "Jade", "Lucky", "Lunar", "Maple", "Mellow", "Midnight", "Misty", "Nimble", "Noble",
  "Olive", "Opal", "Prime", "Quiet", "Rapid", "Royal", "Ruby", "Shady", "Silent", "Silver",
];

const COLORS = [
  "Ash", "Azure", "Blue", "Bronze", "Coral", "Cream", "Cyan", "Gold", "Green", "Indigo",
  "Ivory", "Lilac", "Lime", "Maroon", "Mint", "Navy", "Ochre", "Orange", "Pink", "Red",
  "Rose", "Sage", "Scarlet", "Slate", "Snow", "Teal", "Umber", "Violet", "White", "Yellow",
];

const NOUNS = [
  "Beacon", "Bridge", "Castle", "Circuit", "Cloud", "Comet", "Cottage", "Falcon", "Forest", "Garden",
  "Harbor", "Hill", "House", "Island", "Jungle", "Lantern", "Library", "Meadow", "Mirror", "Mountain",
  "Ocean", "Palace", "Path", "Pine", "Planet", "River", "Shadow", "Signal", "Sky", "Spring",
  "Star", "Stone", "Summit", "Temple", "Thunder", "Tower", "Valley", "Voyage", "Willow", "Window",
];

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

export function generateGameName() {
  return `${pick(ADJECTIVES)} ${pick(COLORS)} ${pick(NOUNS)}`;
}
