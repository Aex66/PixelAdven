// ---- Types for the Showdown request shape (the .d.ts is incomplete, so we use our own) ----

interface ShowdownMove {
    move: string;
    id: string;
    pp?: number;
    maxpp?: number;
    target?: string;
    disabled?: boolean | string;
}

interface ShowdownPokemonSlot {
    ident: string;        // "p1: Pikachu"
    details: string;      // "Pikachu, L25, M"
    condition: string;    // "267/267" | "189/267 par" | "0 fnt"
    active: boolean;
    moves: string[];
    item: string;
    baseAbility: string;
}

interface ShowdownActiveData {
    moves: ShowdownMove[];
    trapped?: boolean;
    maybeTrapped?: boolean;
    canMegaEvo?: boolean;
}

interface ShowdownRequest {
    wait?: true;
    active?: ShowdownActiveData[];
    forceSwitch?: boolean[];
    teamPreview?: true;
    side: {
        id: string;        // "p1"
        name: string;
        pokemon: ShowdownPokemonSlot[];
    };
    noCancel?: boolean;
}