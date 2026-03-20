import { Player, system, world } from "@minecraft/server";
import { ActionForm, ModalForm } from "../../../Papers/FormPaper";
import { calculatePokemonPrice } from "./priceCalculator";
import { selected } from "../../Main/Forms/PC/main";
import { updateSidebar } from "../../Pokemon Calculations/updateTeam";
import pokemonList from "../../../Letters/pokemon/list";
import { ballTags } from "../../Pokemon Calculations/catch";
import { deletePokemon } from "../../Pokemon Database/main";
import TypeList from "../../../Letters/pokemon/TypeList";
import wildPokemon from "../../../Letters/pokemon/wild";
import pokemonNatures from "../../../Letters/pokemon/natures";
import { confirmForm, pokemonText } from "../../../Papers/Paragraphs/ExtrasParagraphs";
import { pokemonGrowth } from "../../../Letters/pokemon/growth";
import { variant } from "../../Main/Forms/PC/search";

interface AuctionListing {
    seller: string;
    price: number;
    pokemon: any;
    createdAt: number; // ✅ NEW: store Unix timestamp
}

const AUCTION_KEY = "auctionListings";
const AUCTION_RETURNS_KEY = "auctionReturns";

const EXPIRE_TIME = 48 * 60 * 60 * 1000; // 48 hours in ms

function loadAuctions(): AuctionListing[] {
    let auctions: AuctionListing[] = JSON.parse(world.getDynamicProperty(AUCTION_KEY) as string || "[]");
    const now = Date.now();

    const [valid, expired] = auctions.reduce<[AuctionListing[], AuctionListing[]]>((acc, listing) => {
        if (now - listing.createdAt < EXPIRE_TIME) {
            acc[0].push(listing);
        } else {
            acc[1].push(listing);
        }
        return acc;
    }, [[], []]);

    if (expired.length > 0) {
        let returns: AuctionListing[] = JSON.parse(world.getDynamicProperty(AUCTION_RETURNS_KEY) as string || "[]");
        returns.push(...expired);
        world.setDynamicProperty(AUCTION_RETURNS_KEY, JSON.stringify(returns));
        world.setDynamicProperty(AUCTION_KEY, JSON.stringify(valid));
    }

    return valid;
}

// Correct hit pattern
world.afterEvents.entityHitEntity.subscribe(event => {
    const player = event.damagingEntity;
    const target = event.hitEntity;

    if (!(player instanceof Player)) return;
    if (!target || target.typeId !== "pokeworld:auction_attendant") return;

    if (player.isSneaking && (player.hasTag("Admin") || player.hasTag("Owner"))) {
        showAdminListings(player);
    } else {
        showAuctionMenu(player);
    }
});

// Main Auction House menu
function showAuctionMenu(player: Player) {
    const form = new ActionForm();
    form.setTitle("Auction House");
    form.setBody("What would you like to do?");
    form.addButton("Put Pokémon Up For Auction");
    form.addButton("Browse Auctions");
    form.addButton("My Listings");
    form.addButton("Reclaim Returns");
    if (player.hasTag("Admin") || player.hasTag("Owner")) {
        form.addButton("Admin: Manage Listings");
    }

    form.send(player, (res) => {
        if (res.canceled) return;
        switch (res.selection) {
            case 0: showTeamSelector(player); break;
            case 1: showSearch(player); break;
            case 2: showMyListings(player); break;
            case 3: reclaimReturns(player); break;
            case 4: showAdminListings(player); break;
        }
    });
}

// Select Pokémon from team to auction
function showTeamSelector(player: Player) {
    const teamObj = selected[player.name] ?? {};
    const slotsArray = Object.values(teamObj);

    if (slotsArray.filter(Boolean).length === 0) {
        player.sendMessage("§cYou have no Pokémon to sell.");
        return;
    }

    const form = new ActionForm();
    form.setTitle("Your Pokémon");
    form.setBody("Select a Pokémon to auction.");

    slotsArray.forEach((p, i) => {
        if (!p || !Array.isArray(p) || !p[2]) {
            form.addButton(`Slot ${i + 1} - Empty`);
            return;
        }

        const [id, name, data] = p;
        const level = data.level ?? 1;
        form.addButton(`Slot ${i + 1} - ${name} Lv.${level}`);
    });

    form.send(player, (res) => {
        if (res.canceled) return;

        const selectedSlot = slotsArray[res.selection];
        if (!selectedSlot) {
            player.sendMessage("§cInvalid slot.");
            return;
        }

        const [rID, name, data] = selectedSlot;

        // ✅ Lean listing: store longHand only
        const pokemon = {
            name,
            longHand: data
        };

        const minPrice = calculatePokemonPrice(pokemon);
        const maxPrice = Math.floor(minPrice * 1.5);

        const priceForm = new ModalForm();
        priceForm.setTitle(`Sell ${name}`);
        priceForm.addInput(`Price (min: $${minPrice} | max: $${maxPrice})`, "Amount", `${minPrice}`);

        priceForm.send(player, (pRes) => {
            if (pRes.canceled) return;

            const price = parseInt(pRes.formValues[0]);
            if (isNaN(price) || price < minPrice) {
                player.sendMessage(`§cPrice must be at least $${minPrice}.`);
                return;
            }

            if (price > maxPrice) {
                player.sendMessage(`§cYou can't list this Pokémon for more than $${maxPrice}.`);
                return;
            }

            // ✅ Shift up all slots after removing
            const slotToRemove = res.selection;
            for (let i = slotToRemove; i < 5; i++) {
                const next = selected[player.name][i + 1];
                if (next) {
                    selected[player.name][i] = next;
                    player.runCommand(`scoreboard players operation @s poke${i + 1}rID = @s poke${i + 2}rID`);
                    player.runCommand(`scoreboard players operation @s poke${i + 1}Id = @s poke${i + 2}Id`);
                    player.runCommand(`scoreboard players operation @s poke${i + 1}Lvl = @s poke${i + 2}Lvl`);
                    player.runCommand(`scoreboard players operation @s poke${i + 1}Var = @s poke${i + 2}Var`);
                    player.runCommand(`scoreboard players operation @s poke${i + 1}HP = @s poke${i + 2}HP`);
                    player.runCommand(`scoreboard players operation @s poke${i + 1}HPmax = @s poke${i + 2}HPmax`);
                    player.runCommand(`scoreboard players operation @s poke${i + 1}Ball = @s poke${i + 2}Ball`);
                } else {
                    delete selected[player.name][i];
                    player.runCommand(`scoreboard players reset @s poke${i + 1}rID`);
                    player.runCommand(`scoreboard players set @s poke${i + 1}Id 0`);
                    player.runCommand(`scoreboard players reset @s poke${i + 1}Lvl`);
                    player.runCommand(`scoreboard players reset @s poke${i + 1}Var`);
                    player.runCommand(`scoreboard players reset @s poke${i + 1}HP`);
                    player.runCommand(`scoreboard players reset @s poke${i + 1}HPmax`);
                    player.runCommand(`scoreboard players reset @s poke${i + 1}Ball`);
                }
            }

            // ✅ Clear final slot
            delete selected[player.name][5];
            player.runCommand(`scoreboard players reset @s poke6rID`);
            player.runCommand(`scoreboard players set @s poke6Id 0`);
            player.runCommand(`scoreboard players reset @s poke6Lvl`);
            player.runCommand(`scoreboard players reset @s poke6Var`);
            player.runCommand(`scoreboard players reset @s poke6HP`);
            player.runCommand(`scoreboard players reset @s poke6HPmax`);
            player.runCommand(`scoreboard players reset @s poke6Ball`);

            // ✅ Actually delete Pokémon from PC storage too!
            deletePokemon(player, name, Number(rID));

            // ✅ Update sidebar
            updateSidebar(player, slotToRemove);

            // ✅ Push listing to auction
            let auctions: AuctionListing[] = loadAuctions();

            // ✅ Limit: max 10 active per seller
            const sellerListings = auctions.filter(l => l.seller === player.name);
            if (sellerListings.length >= 10) {
                player.sendMessage("§cYou already have 10 active auctions! Cancel one before listing another.");
                return;
            }

            // ✅ Push with timestamp
            auctions.push({
                seller: player.name,
                price,
                pokemon,
                createdAt: Date.now()
            });
            world.setDynamicProperty(AUCTION_KEY, JSON.stringify(auctions));

            player.sendMessage(`§aListed ${name} for $${price}.`);
        });
    });
}

const shinyVariants = [1, 3, 5, 7, 9];
const generationRanges: [number, number][] = [
    [1, 151],
    [152, 251],
    [252, 386],
    [387, 494],
    [494, 650],
    [650, 722],
    [722, 810],
    [810, 906],
    [906, 1026],
];

export function getIVPercent(p: any): number {
    const IVhp = p.IV_health ?? p.IVhp ?? 0;
    const IVatk = p.IV_attack ?? p.IVatk ?? 0;
    const IVdef = p.IV_defense ?? p.IVdef ?? 0;
    const IVspa = p.IV_special_attack ?? p.IVspa ?? 0;
    const IVspd = p.IV_special_defense ?? p.IVspd ?? 0;
    const IVsp = p.IV_speed ?? p.IVsp ?? 0;
    const totalIV = IVhp + IVatk + IVdef + IVspa + IVspd + IVsp;
    return Math.floor((totalIV / 186) * 100);
}

export async function showSearch(player: Player) {
    const form = new ModalForm();
    form.setTitle("Search Auctions");
    form.addInput("Name Contains", "e.g. Pikachu");
    form.addDropdown(
        "Filter by Generation",
        ["Any", "Kanto", "Johto", "Hoenn", "Sinnoh", "Unova", "Kalos", "Alola", "Galar", "Paldea"],
        0
    );
    form.addInput("Level Range (min-max)", "e.g. 1-100", "1-100");
    form.addInput("IV% Range (min-max)", "e.g. 50-100", "1-100");
    form.addToggle("Only Shiny", false);
    form.addToggle("Only Tradeable", false);
    form.addDropdown(
        "Filter by Nature",
        ["Any", ...pokemonNatures.values.map(n => n[2])],
        0
    );
    form.addDropdown(
        "Filter by Type",
        ["Any", ...TypeList],
        0
    );

    form.send(player, (res) => {
        if (res.canceled) return;

        const [
            nameQuery,
            genIndex,
            lvlRange,
            ivRange,
            shinyOnly,
            tradeOnly,
            natureIndex,
            typeIndex,
        ] = res.formValues;

        const selectedGen = genIndex - 1;
        const selectedNature = natureIndex > 0 ? pokemonNatures.values[natureIndex - 1][2] : undefined;
        const selectedTypeName = typeIndex > 0 ? TypeList[typeIndex - 1] : null;

        const [lvlMin, lvlMax] = (lvlRange as string).split("-").map(v => Math.max(1, Math.min(100, Number(v.trim()) || 1)));
        const [ivMin, ivMax] = (ivRange as string).split("-").map(v => Math.max(1, Math.min(100, Number(v.trim()) || 1)));

        let auctions: AuctionListing[] = JSON.parse(world.getDynamicProperty(AUCTION_KEY) as string || "[]");

        const results = auctions.filter(a => {
            const base = a.pokemon ?? {};
            const p = base.longHand ?? base;
            const name = p.name ?? a.pokemon.name ?? "";

            if (nameQuery && !name.toLowerCase().includes(nameQuery.toLowerCase())) return false;

            if (genIndex > 0) {
                const indexInList = pokemonList.indexOf(name as any);
                const [start, end] = generationRanges[selectedGen];
                if (indexInList < start || indexInList > end) return false;
            }

            const lvl = p.level ?? p.Level ?? 0;
            if (lvl < lvlMin || lvl > lvlMax) return false;

            const iv = getIVPercent(p);
            if (iv < ivMin || iv > ivMax) return false;

            const isShiny = shinyVariants.includes(p.Variant ?? p.Vr ?? 0);
            if (shinyOnly && !isShiny) return false;

            const traded = p.Traded ?? false;
            if (tradeOnly && !traded) return false;

            if (selectedNature && p.Nature?.[0] !== selectedNature) return false;

            let type1 = -1, type2 = -1;
            const wildKey = Object.keys(wildPokemon).find(k => k.toLowerCase().endsWith(`_${name.toLowerCase()}`));
            let wildEntry = wildKey ? wildPokemon[wildKey] : undefined;
            if (!wildEntry) {
                const fallbackKey = Object.keys(wildPokemon).find(k => k.toLowerCase().includes(name.toLowerCase()));
                wildEntry = fallbackKey ? wildPokemon[fallbackKey] : undefined;
            }

            const variant = p.Variant ?? p.Vr ?? 0;
            if (wildEntry) {
                switch (variant) {
                    case 0: case 1: type1 = wildEntry.Type_1; type2 = wildEntry.Type_2; break;
                    case 2: case 3: type1 = wildEntry.Type_3; type2 = wildEntry.Type_4; break;
                    case 4: case 5: type1 = wildEntry.Type_5; type2 = wildEntry.Type_6; break;
                    case 6: case 7: type1 = wildEntry.Type_7; type2 = wildEntry.Type_8; break;
                }
            }

            const type1Name = TypeList[type1] ?? "";
            const type2Name = TypeList[type2] ?? "";
            if (selectedTypeName &&
                selectedTypeName.toLowerCase() !== type1Name.toLowerCase() &&
                selectedTypeName.toLowerCase() !== type2Name.toLowerCase()) {
                return false;
            }

            return true;
        });

        if (results.length === 0) {
            player.sendMessage("§cNo matching Pokémon found.");
            return;
        }

        const resultForm = new ActionForm();
        resultForm.setTitle("Auction Listings");
        resultForm.setBody("Select a Pokémon to buy:");

        results.forEach((a: AuctionListing) => {
            const p = a.pokemon.longHand ?? a.pokemon;

            // ✅ Safe variant fallback
            const variantValue = p.Variant ?? p.Vr ?? 0;

            // ✅ Compute index and path safely
            const iconIndex = Math.max(0, Math.min(
                variant.length - 1,
                variantValue
            ));
            const speciesName = p.name ?? a.pokemon.name ?? "Unknown";
            const iconPath = `${variant[iconIndex]}/${speciesName.charAt(0).toUpperCase() + speciesName.slice(1)}`;

            const lvl = p.level ?? p.Level ?? 1;
            const iv = getIVPercent(p);
            const ivText = `${iv}%%`;  // ✅ Correct single % (not double)

            const shiny = [1, 3, 5, 7, 9].includes(variantValue) ? " ✨" : "";

            resultForm.addButton(
                `${speciesName} Lv.${lvl} | IV's: ${ivText}${shiny}\nPrice: $${a.price} | Seller: ${a.seller}`,
                iconPath
            );
        });

        resultForm.send(player, (r) => {
            if (r.canceled) return;
            confirmPurchase(player, results[r.selection]);
        });
    });
}

async function confirmPurchase(player: Player, listing: AuctionListing) {
    const money = world.scoreboard.getObjective("Money")?.getScore(player) ?? 0;

    const p = listing.pokemon.longHand ?? listing.pokemon;
    const name = p.name ?? listing.pokemon.name ?? "Unknown";

    const wildName = pokemonText(name);
    let wildEntry = wildPokemon[wildName];
    if (!wildEntry) {
        const fallbackKey = Object.keys(wildPokemon).find(k =>
            k.toLowerCase().includes(name.toLowerCase())
        );
        wildEntry = fallbackKey ? wildPokemon[fallbackKey] : undefined;
    }

    const growth = wildEntry?.Growth ?? "Unknown";
    const lvl = p.Level ?? p.level ?? 1;
    const nextLevel = growth !== "Unknown" ? pokemonGrowth[growth]?.[lvl] : undefined;
    const iv = getIVPercent(p);

    const confirmText =
        `Lvl: ${lvl}${nextLevel ? ` (${p.Experience ?? 0}/${nextLevel})` : ""}
Growth: ${growth}
Nature: ${p.Nature?.[0] ?? 'Unknown'}
Terra: ${p.Terra?.[0] ?? 'None'}
Dmax Lvl: ${p.DMax ?? 0}/10
Traded: ${p.Traded ?? false}
Base Stats: ${p.Base_Health}/${p.Base_attack}/${p.Base_defense}/${p.Base_special_attack}/${p.Base_special_defense}/${p.Base_speed}
IV's: ${p.IV_health}/${p.IV_attack}/${p.IV_defense}/${p.IV_special_attack}/${p.IV_special_defense}/${p.IV_speed} (${iv}%)
Price: $${listing.price} | Seller: ${listing.seller}`;

    const confirm = await confirmForm(
        player,
        `Buy ${name}?`,
        confirmText,
        '§aYes',
        '§cNo'
    );
    if (!confirm) {
        player.sendMessage("§ePurchase cancelled.");
        return;
    }

    if (money < listing.price) {
        player.sendMessage(`§cYou need $${listing.price} to buy this Pokémon!`);
        return;
    }

    // ✅ Load auctions fresh again
    let auctions: AuctionListing[] = JSON.parse(world.getDynamicProperty(AUCTION_KEY) as string || "[]");
    const index = auctions.findIndex(a =>
        a.seller === listing.seller &&
        a.price === listing.price &&
        a.pokemon.name === name
    );
    if (index === -1) {
        player.sendMessage("§cThis listing no longer exists.");
        return;
    }

    // ✅ Try adding Pokémon to player before removing listing!
    if (!selected.hasOwnProperty(player.name)) selected[player.name] = {};
    let slot = 0;
    while (slot < 6 && selected[player.name][slot]) slot++;
    if (slot >= 6) {
        player.sendMessage("§cYou have no empty slots for this Pokémon!");
        return;
    }

    const rID = ~~(Math.random() * 999999999);
    const data = p.longHand ?? p;
    selected[player.name][slot] = [rID, name, data];
    system.run(() => {
        const suffix = slot > 0 ? slot + 1 : "";
        player.runCommand(`scoreboard players set @s poke${suffix}rID ${rID}`);
        player.runCommand(`scoreboard players set @s poke${suffix}Id ${pokemonList.indexOf(name)}`);
        player.runCommand(`scoreboard players set @s poke${suffix}Lvl ${data.level ?? data.Level ?? 1}`);
        player.runCommand(`scoreboard players set @s poke${suffix}Var ${data.Variant ?? data.Vr ?? 0}`);
        player.runCommand(`scoreboard players set @s poke${suffix}HP ${data.Current_Health ?? 0}`);
        player.runCommand(`scoreboard players set @s poke${suffix}HPmax ${data.Base_Health ?? 0}`);
        player.runCommand(`scoreboard players set @s poke${suffix}Ball ${Object.keys(ballTags).indexOf(data.pokeBall ?? "pokeball")}`);
    });

    updateSidebar(player, slot);

    // ✅ NOW remove from listing
    auctions.splice(index, 1);
    world.setDynamicProperty(AUCTION_KEY, JSON.stringify(auctions));

    // ✅ Transfer money
    player.runCommand(`scoreboard players remove @s Money ${listing.price}`);
    const seller = world.getAllPlayers().find(p => p.name === listing.seller);
    if (seller) {
        seller.runCommand(`scoreboard players add "${seller.name}" Money ${listing.price}`);
        seller.sendMessage(`§aYou sold ${name} for $${listing.price} to ${player.name}!`);
    }

    player.sendMessage(`§aYou bought ${name} for $${listing.price} from ${listing.seller}.`);
}

function reclaimReturns(player: Player) {
    let returns: AuctionListing[] = JSON.parse(world.getDynamicProperty(AUCTION_RETURNS_KEY) as string || "[]");
    const mine = returns.filter(r => r.seller === player.name);
    if (!mine.length) {
        player.sendMessage("§eNo Pokémon to reclaim.");
        return;
    }

    let slot = 0;
    while (slot < 6 && selected[player.name]?.[slot]) slot++;
    if (slot >= 6) {
        player.sendMessage("§cNo free slots. Clear a slot first!");
        return;
    }

    const reclaim = mine.shift()!;
    const rID = ~~(Math.random() * 999999999);
    const data = reclaim.pokemon.longHand;
    selected[player.name][slot] = [rID, reclaim.pokemon.name, data];

    system.run(() => {
        const suffix = slot > 0 ? slot + 1 : "";
        player.runCommand(`scoreboard players set @s poke${suffix}rID ${rID}`);
        player.runCommand(`scoreboard players set @s poke${suffix}Id ${pokemonList.indexOf(reclaim.pokemon.name)}`);
        player.runCommand(`scoreboard players set @s poke${suffix}Lvl ${data.level ?? data.lv}`);
        player.runCommand(`scoreboard players set @s poke${suffix}Var ${data.Variant ?? data.Vr ?? 0}`);
        player.runCommand(`scoreboard players set @s poke${suffix}HP ${data.Current_Health ?? data.CH ?? 0}`);
        player.runCommand(`scoreboard players set @s poke${suffix}HPmax ${data.Base_Health ?? data.HP ?? 0}`);
        player.runCommand(`scoreboard players set @s poke${suffix}Ball ${Object.keys(ballTags).indexOf(data.pokeBall ?? data.ball ?? "pokeball")}`);
    });

    updateSidebar(player, slot);
    world.setDynamicProperty(AUCTION_RETURNS_KEY, JSON.stringify(returns));
    player.sendMessage(`§aReclaimed ${reclaim.pokemon.name}!`);
}

// Show player's own listings
function showMyListings(player: Player) {
    let auctions: AuctionListing[] = loadAuctions();
    const mine = auctions.filter(a => a.seller === player.name);

    if (mine.length === 0) {
        player.sendMessage("§eYou have no active listings.");
        return;
    }

    const form = new ActionForm();
    form.setTitle("My Listings");
    form.setBody("Select one to manage:");
    mine.forEach(a => {
        const timeLeft = Math.max(0, Math.floor((EXPIRE_TIME - (Date.now() - a.createdAt)) / (60 * 60 * 1000)));
        form.addButton(`${a.pokemon.name} | $${a.price}\nExpires in: ${timeLeft}h`);
    });

    form.send(player, (res) => {
        if (res.canceled) return;

        const listing = mine[res.selection];

        const sub = new ActionForm();
        sub.setTitle(`Manage: ${listing.pokemon.name}`);
        sub.setBody(`Price: $${listing.price}\nSeller: ${listing.seller}\nWhat do you want to do?`);
        sub.addButton("§cCancel Listing");
        sub.addButton("§eView Details");
        sub.addButton("§aRenew (Extend 48h)");

        sub.send(player, (choice) => {
            if (choice.canceled) return;

            if (choice.selection === 0) {
                cancelListing(player, listing);
            } else if (choice.selection === 1) {
                const p = listing.pokemon.longHand ?? listing.pokemon;
                const iv = getIVPercent(p);
                const lvl = p.Level ?? p.level ?? 1;
                const shiny = [1, 3, 5, 7, 9].includes(p.Variant ?? p.Vr ?? 0) ? "Yes" : "No";

                player.sendMessage(
                    `§bListing Info:\n` +
                    `Name: ${p.name}\n` +
                    `Lvl: ${lvl} IV's: ${iv}%\n` +
                    `Shiny: ${shiny}\n` +
                    `Price: $${listing.price}\n` +
                    `Time Left: ${Math.floor((EXPIRE_TIME - (Date.now() - listing.createdAt)) / (60 * 60 * 1000))}h`
                );
            } else if (choice.selection === 2) {
                let all = loadAuctions();
                const idx = all.findIndex(a => a.seller === listing.seller && a.pokemon.name === listing.pokemon.name && a.price === listing.price);
                if (idx !== -1) {
                    all[idx].createdAt = Date.now();
                    world.setDynamicProperty(AUCTION_KEY, JSON.stringify(all));
                    player.sendMessage(`§aListing renewed for another 48h.`);
                }
            }
        });
    });
}

function cancelListing(player: Player, listing: AuctionListing) {
    let auctions: AuctionListing[] = JSON.parse(world.getDynamicProperty(AUCTION_KEY) as string || "[]");
    const index = auctions.findIndex((a: AuctionListing) =>
        a.seller === listing.seller &&
        a.price === listing.price &&
        a.pokemon.name === listing.pokemon.name
    );

    if (index === -1) return;

    auctions.splice(index, 1);
    world.setDynamicProperty(AUCTION_KEY, JSON.stringify(auctions));

    const team = JSON.parse(player.getDynamicProperty("pokemon_team") as string || "[]");
    team.push(listing.pokemon);
    player.setDynamicProperty("pokemon_team", JSON.stringify(team));

    player.sendMessage(`Cancelled ${listing.pokemon.name}. Returned to your PC.`);
}

// Admin listings manager
function showAdminListings(player: Player) {
    let auctions: AuctionListing[] = JSON.parse(world.getDynamicProperty(AUCTION_KEY) as string || "[]");
    if (auctions.length === 0) {
        player.sendMessage("No active listings.");
        return;
    }

    const form = new ActionForm();
    form.setTitle("Admin: Manage Listings");
    form.setBody("Select a listing to void:");
    auctions.forEach((a: AuctionListing) => {
        form.addButton(`${a.pokemon.name} $${a.price} Seller:${a.seller}`);
    });

    form.send(player, (res) => {
        if (res.canceled) return;

        const listing = auctions[res.selection];
        const index = auctions.findIndex((a: AuctionListing) =>
            a.seller === listing.seller &&
            a.price === listing.price &&
            a.pokemon.name === listing.pokemon.name
        );

        if (index === -1) return;

        auctions.splice(index, 1);
        world.setDynamicProperty(AUCTION_KEY, JSON.stringify(auctions));

        player.sendMessage(`Voided ${listing.pokemon.name} by ${listing.seller}.`);
    });
}