

export interface TutorialType {
    name: string;
    description: string;
    tag: string;
    categories: {
        [category: string]: {
            title: string;
            pages: string[];
        }
    }
}

export const TutorialConfig = {
    "starter": {
        name: "Starter Tutorial",
        description: "This is the first tutorial",
        tag: "starter",
        categories: {
            "§1§lWhat is Pixelmon Adventures": {
                title: "What is Pixelmon Adventures",
                pages: [
                    "Pixelmon Adventures is a unique take on the classic Pixelmon for Minecraft. Although it is different there is still plenty to do and work towards.",
                    "Battles have turn based mechanics with possibilities for moves to miss and even crit. Moves utilize Pokémon Go's mechanics where you have to build up [Power] to use stronger Moves.",
                    "Catching is straightforward walk up to the Pokémon and click it with a ball. Weakening it will have no affect on catch rates.",
                    "Gym Leaders & Elite Four have a form of AI when it comes to battles to keep things interesting.",
                    "Overall although things may be confusing with a little bit of time it will make sense should you give it a chance. Plus you are welcome to ask questions within the Community Chat  of the Discord should you have any issues.",
                    "Season 2 has a complete overhaul scheduled and has been making great progress as of recently that will make it more like Pixelmon than it currently is.",
                    "We hope you will give us a proper chance!!! Have fun trainers!!!! "
                ]
            },
            "§2§lServer Rules": {
                title: "Server Rules",
                pages: [
                    "Please adhere to the following rules while playing on the server. These rules are subject to change.",
                    "1. §lNo Duplicating -\n§rPunishment: Permanent Ban",
                    "2. §lNo Griefing - \n§rDefinition: Griefing refers to intentionally disrupting the immersion of another player's gameplay using aspects of the game in unintended ways or intentionally misusing game mechanics to produce unintended outcomes.\nPunishment: Permanent Ban",
                    "3. §lNo Spamming Chats - \n§rPunishment:\n1st Offense: 1 Day Mute\n2nd Offense: 1 Week Mute\n3rd Offense: Permanent Ban",
                    "4. §lNo Harassment - \n§rPunishment: Permanent Ban",
                    "5. §lNo Trolling - \n§rPunishment: Permanent Ban",
                    "6. §lNo Hack Clients - \n§r(This includes receiving items from someone using a hack client and not reporting it to a staff member intentionally.)\nPunishment: Permanent Ban",
                    "7. §lNo Exploits - \n§r(Please use common sense.)\nPunishment: Permanent Ban",
                    "8. §lNo Scamming Players - \n§rPunishment:\n1st Offense: Warning\n2nd Offense: 3 Day Temporary Ban\n3rd Offense: Permanent Ban",
                    "9. §lNo Asking for Items from Staff - \n§rPunishment:\n1st Offense: 1 Day Mute\n2nd Offense: 1 Week Mute\n3rd Offense: Permanent Ban",
                    "10. §lNo Improper Use of 'Support' - \n§rDiscord Bot\nPunishment:\n1st Offense: Warning\n2nd Offense: 3 Day Temporary Ban\n3rd Offense: Permanent Ban",
                    "11. §lNo Acting or Playing Dumb - \n§r(Staff members have responsibilities and limited time. Purposefully causing disruptions or justifying actions on false grounds is not allowed.)",
                    "12. §lRespect All Team Members - \n§r(Staff members are players too but with added responsibilities. Respect them and be patient. Everyone has different schedules and real-world responsibilities.)",
                    "13. §lStaff Have the Final Say - \n§r(Staff members may moderate at their discretion. Refrain from arguing with staff members on rule violations.)",
                    "14. §lNo Split-Screen Accounts - \n§rPunishment: \nPermanent Ban",
                    "15. §lNo Invisible Skins Allowed - \n§rPunishment:\n1st Offense: Warning\n2nd Offense: 3 Day Temporary Ban\n3rd Offense: Permanent Ban",
                    "§lPlease ensure you follow these rules to maintain a fair and enjoyable environment for all players on the server. Violating these rules may result in disciplinary actions as specified."
                ]
            },
            "§3§lGetting Started": {
                title: "Getting Started",
                pages: [
                    "Welcome, Trainer!\nIf you're new to our community and wondering how to get started, follow these simple steps to kickstart your journey:",
                    "1. §lClaim Your Bonus Gift:\n§rAs soon as you spawn, you'll find a bonus gift waiting for you in the first building you enter. Redeem it by clicking on the item.",
                    "2. §lChoose Your Starter:\n§rMake your way to the lab, where you'll have the exciting choice of selecting one of five starter Pokémon: Pikachu, Eevee, Charmander, Squirtle, or Bulbasaur.",
                    "3. §lInvest in Property:\n§rInside the building leading to Route 1, you'll encounter a Property Manager. You can purchase properties from them for 30,000 PokeCoins.",
                    "4. §lCash in Your Crate Tickets:\n§rWhile in spawn, visit the Poke Center and head to the bottom floor to exchange the Crate tickets you received from the Bonus starter crate.",
                    "5. §lVisit Poke Marts Regularly:\n§rDon't forget to visit Poke Marts frequently to sell the nuggets you obtain from battling Pokémon. You can find the selling pads at the back wall of the shop.",
                    "6. §lEmbrace Quests:\n§rMake sure to drop by spawn regularly and speak with the quest giver on the second floor of the Poke Center. This is where you can start quests and turn in completed ones to earn crate tickets and PokéCoins.",
                    "7. §lEmbark on Your Adventure:\n§rOnce you've selected your starter, leave the lab and head toward the building next to it. This will take you to Route 1, where your thrilling adventure awaits!"
                ]
            }
        }
    },
    "starter2": {
        name: "Starter tutorial",
        description: "This is the first tutorial",
        tag: "begin",
        categories: {
            "How to bake a cake": {
                title: "Bake a cake",
                pages: [
                    "First, you need to gather the ingredients",
                    "Then, you need to craft the cake",
                    "Finally, you need to bake the cake"
                ]
            }
        }
    }
} as { [name: string]: TutorialType };