const AbilityList = [
    'None', //0
    'Adaptability', //1
    'Aerilate', //2
    'Aftermath', //3
    'Air Lock', //4
    'Analytic', //5
    'Anger Point', //6
    'Anger Shell', //7
    'Anticipation', //8
    'Arena Trap', //9
    'Armor Tail', //10
    'Aroma Veil', //11
    'As One', //12
    'Aura Break', //13
    'Bad Dreams', //14
    'Ball Fetch', //15
    'Battery', //16
    'Battle Armor', //17
    'Battle Bond', //18
    'Beads of Ruin', //19
    'Beast Boost', //20
    'Berserk', //21
    'Big Pecks', //22
    'Blaze', //23
    'Bulletproof', //24
    'Cheek Pouch', //25
    'Chilling Neigh', //26
    'Chlorophyll', //27
    'Clear Body', //28
    'Cloud Nine', //29
    'Color Change', //30
    'Comatose', //31
    'Commander', //32
    'Competitive', //33
    'Compound Eyes', //34
    'Contrary', //35
    'Corrosion', //36
    'Costar', //37
    'Cotton Down', //38
    'Cud Chew', //39
    'Curious Medicine', //40
    'Cursed Body', //41
    'Cute Charm', //42
    'Damp', //43
    'Dancer', //44
    'Dark Aura', //45
    'Dauntless Shield', //46
    'Dazzling', //47
    'Defeatist', //48
    'Defiant', //49
    'Delta Stream', //50
    'Desolate Land', //51
    'Disguise', //52
    'Download', //53
    "Dragon's Maw", //54
    'Drizzle', //55
    'Drought', //56
    'Dry Skin', //57
    'Early Bird', //58
    'Earth Eater', //59
    'Effect Spore', //60
    'Electric Surge', //61
    'Electromorphosis', //62
    'Embody Aspect', //63
    'Emergency Exit', //64
    'Fairy Aura', //65
    'Filter', //66
    'Flame Body', //67
    'Flare Boost', //68
    'Flash Fire', //69
    'Flower Gift', //70
    'Flower Veil', //71
    'Fluffy', //72
    'Forecast', //73
    'Forewarn', //74
    'Friend Guard', //75
    'Frisk', //76
    'Full Metal Body', //77
    'Fur Coat', //78
    'Gale Wings', //79
    'Galvanize', //80
    'Gluttony', //81
    'Good as Gold', //82
    'Gooey', //83
    'Gorilla Tactics', //84
    'Grass Pelt', //85
    'Grassy Surge', //86
    'Grim Neigh', //87
    'Guard Dog', //88
    'Gulp Missile', //89
    'Guts', //90
    'Hadron Engine', //91
    'Harvest', //92
    'Healer', //93
    'Heatproof', //94
    'Heavy Metal', //95
    'Honey Gather', //96
    'Hospitality', //97
    'Huge Power', //98
    'Hunger Switch', //99
    'Hustle', //100
    'Hydration', //101
    'Hyper Cutter', //102
    'Ice Body', //103
    'Ice Face', //104
    'Ice Scales', //105
    'Illuminate', //106
    'Illusion', //107
    'Immunity', //108
    'Imposter', //109
    'Infiltrator', //110
    'Innards Out', //111
    'Inner Focus', //112
    'Insomnia', //113
    'Intimidate', //114
    'Intrepid Sword', //115
    'Iron Barbs', //116
    'Iron Fist', //117
    'Justified', //118
    'Keen Eye', //119
    'Klutz', //120
    'Leaf Guard', //121
    'Levitate', //122
    'Libero', //123
    'Light Metal', //124
    'Lightning Rod', //125
    'Limber', //126
    'Lingering Aroma', //127
    'Liquid Ooze', //128
    'Liquid Voice', //129
    'Long Reach', //130
    'Magic Bounce', //131
    'Magic Guard', //132
    'Magician', //133
    'Magma Armor', //134
    'Magnet Pull', //135
    'Marvel Scale', //136
    'Mega Launcher', //137
    'Merciless', //138
    'Mimicry', //139
    "Mind's Eye", //140
    'Minus', //141
    'Mirror Armor', //142
    'Misty Surge', //143
    'Mold Breaker', //144
    'Moody', //145
    'Motor Drive', //146
    'Moxie', //147
    'Multiscale', //148
    'Multitype', //149
    'Mummy', //150
    'Mycelium Might', //151
    'Natural Cure', //152
    'Neuroforce', //153
    'Neutralizing Gas', //154
    'No Guard', //155
    'Normalize', //156
    'Oblivious', //157
    'Opportunist', //158
    'Orichalcum Pulse', //159
    'Overcoat', //160
    'Overgrow', //161
    'Own Tempo', //162
    'Parental Bond', //163
    'Pastel Veil', //164
    'Perish Body', //165
    'Pickpocket', //166
    'Pickup', //167
    'Pixilate', //168
    'Plus', //169
    'Poison Heal', //170
    'Poison Point', //171
    'Poison Puppeteer', //172
    'Poison Touch', //173
    'Power Construct', //174
    'Power of Alchemy', //175
    'Power Spot', //176
    'Prankster', //177
    'Pressure', //178
    'Primordial Sea', //179
    'Prism Armor', //180
    'Propeller Tail', //181
    'Protean', //182
    'Protosynthesis', //183
    'Psychic Surge', //184
    'Punk Rock', //185
    'Pure Power', //186
    'Purifying Salt', //187
    'Quark Drive', //188
    'Queenly Majesty', //189
    'Quick Draw', //190
    'Quick Feet', //191
    'RKS System', //192
    'Rain Dish', //193
    'Rattled', //194
    'Receiver', //195
    'Reckless', //196
    'Refrigerate', //197
    'Regenerator', //198
    'Ripen', //199
    'Rivalry', //200
    'Rock Head', //201
    'Rocky Payload', //202
    'Rough Skin', //203
    'Run Away', //204
    'Sand Force', //205
    'Sand Rush', //206
    'Sand Spit', //207
    'Sand Stream', //208
    'Sand Veil', //209
    'Sap Sipper', //210
    'Schooling', //211
    'Scrappy', //212
    'Screen Cleaner', //213
    'Seed Sower', //214
    'Serene Grace', //215
    'Shadow Shield', //216
    'Shadow Tag', //217
    'Sharpness', //218
    'Shed Skin', //219
    'Sheer Force', //220
    'Shell Armor', //221
    'Shield Dust', //222
    'Shields Down', //223
    'Simple', //224
    'Skill Link', //225
    'Slow Start', //226
    'Slush Rush', //227
    'Sniper', //228
    'Snow Cloak', //229
    'Snow Warning', //230
    'Solar Power', //231
    'Solid Rock', //232
    'Soul-Heart', //233
    'Soundproof', //234
    'Speed Boost', //235
    'Stakeout', //236
    'Stall', //237
    'Stalwart', //238
    'Stamina', //239
    'Stance Change', //240
    'Static', //241
    'Steadfast', //242
    'Steam Engine', //243
    'Steelworker', //244
    'Steely Spirit', //245
    'Stench', //246
    'Sticky Hold', //247
    'Storm Drain', //248
    'Strong Jaw', //249
    'Sturdy', //250
    'Suction Cups', //251
    'Super Luck', //252
    'Supersweet Syrup', //253
    'Supreme Overlord', //254
    'Surge Surfer', //255
    'Swarm', //256
    'Sweet Veil', //257
    'Swift Swim', //258
    'Sword of Ruin', //259
    'Symbiosis', //260
    'Synchronize', //261
    'Tablets of Ruin', //262
    'Tangled Feet', //263
    'Tangling Hair', //264
    'Technician', //265
    'Telepathy', //266
    'Tera Shell', //267
    'Tera Shift', //268
    'Teraform Zero', //269
    'Teravolt', //270
    'Thermal Exchange', //271
    'Thick Fat', //272
    'Tinted Lens', //273
    'Torrent', //274
    'Tough Claws', //275
    'Toxic Boost', //276
    'Toxic Chain', //277
    'Toxic Debris', //278
    'Trace', //279
    'Transistor', //280
    'Triage', //281
    'Truant', //282
    'Turboblaze', //283
    'Unaware', //284
    'Unburden', //285
    'Unnerve', //286
    'Unseen Fist', //287
    'Vessel of Ruin', //288
    'Victory Star', //289
    'Vital Spirit', //290
    'Volt Absorb', //291
    'Wandering Spirit', //292
    'Water Absorb', //293
    'Water Bubble', //294
    'Water Compaction', //295
    'Water Veil', //296
    'Weak Armor', //297
    'Well-Baked Body', //298
    'White Smoke', //299
    'Wimp Out', //300
    'Wind Power', //301
    'Wind Rider', //302
    'Wonder Guard', //303
    'Wonder Skin', //304
    'Zen Mode', //305
    'Zero to Hero', //306
] as const;

export default AbilityList;
