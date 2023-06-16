/*
 * Dungeons Stats Script
 * Version: 0.1
 * Author: Mitchell McDaniel
 * 
 */


// add input for this
const name = "SirTomm"

// using this URL means it only updates when the website updates
const url = `https://sky.shiiyu.moe/api/v2/profile/${name}`

// Cucumber = Bingo, Pomegranate = Normal, Tomato = Ironman
// make this selectable from list at start?
const profileName = "Tomato"

let profile = null

function nameReplace() {
    let pnameRep = document.getElementsByClassName("playername")
         
    for (let i = 0; i < pnameRep.length; i++) {
        pnameRep[i].innerHTML = 
                String(pnameRep[i].innerHTML).replace('[Playername]', name + "'s")
    }
}

async function getProfile() {
    let playerUrl = url
    const playerResponse = await fetch(playerUrl)
    //console.log(playerResponse)
    let data = await playerResponse.json()
    // get profile matching profile name
    for (let i of Object.keys(data.profiles)) {
        if (data.profiles[i].cute_name === profileName)
            profile = data.profiles[i]
        else {
            // add in some kind of error event or document notification here?
            continue
        }
        console.log(profile)
    }   
    showArmor()
    showDungeonsStats()
}

function showArmor() {
    let armor = profile.items.armor
    console.log(armor)
    document.getElementById("armor_table").innerHTML = 
            `<tr id='helmet'>
                <td>Helmet:</td>
                <td>${armor[3].display_name}</td>
                <td>${String(armor[3].rarity).toUpperCase()}</td>
            </tr>
            <tr id='chestplate'>
                <td>Chestplate:</td>
                <td>${armor[2].display_name}</td>
                <td>${String(armor[2].rarity).toUpperCase()}</td>
            </tr>
            <tr id='leggings'>
                <td>Leggings</td>
                <td>${armor[1].display_name}</td>
                <td>${String(armor[1].rarity).toUpperCase()}</td>
            </tr>
            <tr id='boots'>
                <td>Boots</td>
                <td>${armor[0].display_name}</td>
                <td>${String(armor[0].rarity).toUpperCase()}</td>
            </tr>`
}

function showDungeonsStats() {
    let cataLevel = profile.data.dungeons.catacombs.level.level
    document.getElementById("cata_level").innerHTML = 
            `Catacombs Level: ${cataLevel}`
    
    dungeonClassLevels()
    dungeonFloorStats()
    dungeonMaxDmg()
        
}

function dungeonClassLevels() {
    let classes = profile.data.dungeons.classes
    let selected_class = String(profile.data.dungeons.selected_class)
    selected_class = selected_class[0].toUpperCase() + selected_class.slice(1)
    
    document.getElementById("class_levels").innerHTML = 
            `<td>Level: </td>
            <td>${classes.healer.experience.level}</td>
            <td>${classes.mage.experience.level}</td>
            <td>${classes.berserk.experience.level}</td>
            <td>${classes.archer.experience.level}</td>
            <td>${classes.tank.experience.level}</td>
            `    
    document.getElementById("class_xp").innerHTML = 
            `<td>EXP:</td>
            <td>${Math.floor(classes.healer.experience.xp)}</td>
            <td>${Math.floor(classes.mage.experience.xp)}</td>
            <td>${Math.floor(classes.berserk.experience.xp)}</td>
            <td>${Math.floor(classes.archer.experience.xp)}</td>
            <td>${Math.floor(classes.tank.experience.xp)}</td>`
    
    document.getElementById("selected_class").innerHTML = `${selected_class}`
}

function dungeonFloorStats() {
    let floors = profile.data.dungeons.catacombs.floors
    let text = ""
    for (let i of Object.keys(floors)) {
        let floor_name = (i > 0 ? ("Floor " + i) : "Entrance")
        
        text += `<tr><td>${floor_name}</td>
            <td>${floors[i].stats.tier_completions}</td>
            <td>${floors[i].stats.times_played}</td>
            <td>${floors[i].stats.best_score}</td>
            <td>${floors[i].stats.milestone_completions}</td>
            <td>${Math.floor(floors[i].stats.fastest_time/1000)} Seconds</td>
            <td>${floors[i].stats.mobs_killed}</td>
            <td>${floors[i].stats.most_mobs_killed}</td>
        </tr>`
    }
    document.getElementById("dungeons_floor_stats").innerHTML = text
    
}

function dungeonMaxDmg() {
    let class_dmg = profile.raw.dungeons.dungeon_types.catacombs
    let floors = profile.data.dungeons.catacombs.floors
    let text = ""
    for (let i of Object.keys(floors)) {
        
        let healer = class_dmg.most_damage_healer[i]
        healer = (healer ? Math.floor(healer) : 0)
        
        let mage = class_dmg.most_damage_mage[i]
        mage = (mage ? Math.floor(mage) : 0)
        
        let berserker = class_dmg.most_damage_berserk[i]
        berserker = (berserker ? Math.floor(berserker) : 0)
        
        let archer = class_dmg.most_damage_archer[i]
        archer = (archer ? Math.floor(archer) : 0)
        
        let tank = class_dmg.most_damage_tank[i]
        tank = (tank ? Math.floor(tank) : 0)
        
        let floor_name = (i > 0 ? ("Floor " + i) : "Entrance")
        text += `<tr><td>${floor_name}</td>
            <td>${healer}</td>
            <td>${mage}</td>
            <td>${berserker}</td>
            <td>${archer}</td>
            <td>${tank}</td>
        </tr>`
    }
    
    document.getElementById("class_dmg").innerHTML = text
}

function start() {
    nameReplace()
    getProfile()
}

// wait for html to load before JS begins
if (window.addEventListener) {
    window.addEventListener("load", start, false);
} else if (window.attachEvent) {
    window.attachEvent("onload", start);
}


