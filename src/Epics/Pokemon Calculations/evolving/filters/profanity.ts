// profanityFilter.ts

// ✅ Master profanity list
// (Expanded with common swears, slurs, sexual slang, insults, etc.)
const baseProfanity: string[] = [
  // General profanity
  "fuck","shit","bitch","bastard","damn","hell","asshole","douche","dick",
  "cock","pussy","cunt","twat","prick","slut","whore","skank","hoe",

  // Sexual slang
  "fag","faggot","dyke","tranny","shemale","cum","jizz","spunk","spooge",
  "orgy","gangbang","anal","blowjob","handjob","rimjob","deepthroat",
  "dildo","vibrator","dickhead","buttfuck","buttsex","assfuck","asshat",
  "fellatio","cunnilingus","clit","clitoris","testicle","scrotum",

  // Bodily function insults
  "piss","pissed","pissing","shithead","shitter","crap","anus","rectum",
  "fart","smegma","tosser","wanker","bugger",

  // Racial/ethnic slurs
  "nigger","nigga","chink","gook","spic","beaner","wetback","paki","raghead",
  "sandnigger","kike","heeb","yid","gypsy","coon","jigaboo","porchmonkey",
  "tarbaby","redskin","injun",

  // Religion-related
  "christkiller","heathen","infidel","mohammedan","allahfuck","muslimterrorist",

  // Homophobic/transphobic
  "queer","fudgepacker","buttpirate","ladyboy","heshe","sissy",

  // Misc insults / ableist
  "retard","retarded","mong","spaz","cripple","gimp","idiot","moron","imbecile",
  "jackass","jackoff","jerkoff","tosspot","dipshit","shitstain","fucktard",
  "fuckwit","scumbag"
];

// ✅ Whitelist (safe words that might otherwise trigger false positives)
const whitelist: string[] = [
  "scunthorpe", "passion", "assessment", "classic", "bass"
];

// ✅ Leetspeak substitutions
const substitutions: Record<string, string> = {
  "0": "o","1": "i","!": "i","3": "e","4": "a","@": "a",
  "5": "s","$": "s","7": "t","+": "t","8": "b","9": "g"
};

// ✅ Unicode homoglyphs (Cyrillic/Greek lookalikes → Latin)
const homoglyphs: Record<string, string> = {
  "а": "a", // Cyrillic a
  "ο": "o", // Greek omicron
  "е": "e", // Cyrillic e
  "і": "i", // Cyrillic i
  "ѕ": "s", // Cyrillic s
  "ӏ": "l"  // Cyrillic small el
};

// ✅ Normalize input text
function normalize(input: string): string {
  let lowered = input.toLowerCase();

  // Replace leetspeak
  for (const [key, val] of Object.entries(substitutions)) {
    lowered = lowered.split(key).join(val);
  }

  // Replace homoglyphs
  for (const [key, val] of Object.entries(homoglyphs)) {
    lowered = lowered.split(key).join(val);
  }

  // Strip diacritics (e.g., čúñt → cunt)
  lowered = lowered.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Remove non-alphanumeric
  lowered = lowered.replace(/[^a-z0-9]/g, "");

  // Collapse duplicate letters (fuuuuuck → fuck)
  lowered = lowered.replace(/(.)\1{2,}/g, "$1");

  return lowered;
}

// ✅ Main profanity check
export function containsProfanity(input: string): boolean {
  const clean = normalize(input);

  // Whitelist bypass
  if (whitelist.some(word => clean.includes(word))) return false;

  // Check base list
  return baseProfanity.some(badWord => {
    // Direct substring match
    if (clean.includes(badWord)) return true;

    // Regex fuzzy match (handles symbols/junk/spacing inside)
    const regex = new RegExp(
      badWord
        .split("")
        .map(ch => `${ch}+[^a-z0-9]*`)
        .join(""),
      "i"
    );

    return regex.test(input.toLowerCase()); // test raw input to catch split letters like "c o c k"
  });
}
