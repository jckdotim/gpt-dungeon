const gameContainer = document.getElementById("game-container");
const gameNovel = document.getElementById("game-novel");
const gameMap = document.getElementById("game-map");
const statusElement = document.getElementById("game-status");
const gameName = prompt('Please enter the name of the game you want to play:');

let mapArray = [];
let playerPosition;
let player;
const levels = {};
let currentLevel;


function createPlayer() {
    return {
        level: 1,
        hp: 20,
        attack: 2,
        defense: 2,
        xp: 0,
        nextLevelXP: 10,
        baseHp: 10,
        baseAttack: 2,
        baseDefense: 2,
    };
}

function createMonster(level) {
    return {
        level,
        hp: level * 5 + 5,
        attack: level * 2 + 2,
        defense: level * 1 + 1,
    };
}

function levelUp(player) {
    player.level++;
    player.hp = player.baseHp + player.level * 10;
    player.attack = player.baseAttack + player.level * 2;
    player.defense = player.baseDefense + player.level * 2;
    player.nextLevelXP += player.level * 10;
    updateStatus(); // Update the player's status
}

function battle(player, monster) {
    while (player.hp > 0 && monster.hp > 0) {
        // Player attacks monster
        const playerDamage = Math.max(player.attack - monster.defense, 1);
        monster.hp -= playerDamage;

        if (monster.hp <= 0) {
            player.xp += (monster.level + 1) * 3;
            if (player.xp >= player.nextLevelXP) {
                levelUp(player);
            }
            updateStatus(); // Update the player's status
            return true;
        }

        // Monster attacks player
        const monsterDamage = Math.max(monster.attack - player.defense, 1);
        player.hp -= monsterDamage;

        if (player.hp <= 0) {
            return false;
        }
    }
}

async function loadLevel(level) {
    const filePath = `games/${gameName}/${level}.yaml`;
    const response = await fetch(filePath);
    const text = await response.text();
    const data = jsyaml.load(text);

    levels[level] = data; // Store the loaded level data in the levels object
    currentLevel = level;

    gameNovel.textContent = data.opening_novel;
    gameMap.textContent = data.dungeon_map;

    mapArray = data.dungeon_map.split("\n").map(row => row.split(""));
    playerPosition = findPlayerPosition(mapArray);
}

function findPlayerPosition(map) {
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === "@") {
                return { x, y };
            }
        }
    }
}

function updateStatus() {
    statusElement.innerHTML = `
        <strong>Player Status:</strong>
        Level: ${player.level}
        HP: ${player.hp}
        Attack: ${player.attack}
        Defense: ${player.defense}
        XP: ${player.xp}
        Next Level XP: ${player.nextLevelXP}
    `;
}


async function movePlayer(dx, dy) {
    const newX = playerPosition.x + dx;
    const newY = playerPosition.y + dy;
    const targetCell = mapArray[newY][newX];

    if (targetCell === "#") {
        return; // Can't move through walls
    }

    if (targetCell === "$") {
        displayEndingNovel(levels[currentLevel].ending_novel);
        await waitForAnyKey();
        loadLevel('a');
        return;
    }

    if ("0123456789".includes(targetCell)) {
        // Battle logic
        const monsterLevel = parseInt(targetCell, 10);
        const monster = createMonster(monsterLevel);

        const isPlayerVictorious = battle(player, monster);

        if (isPlayerVictorious) {
            // Monster defeated, move player
            mapArray[playerPosition.y][playerPosition.x] = ".";
            playerPosition.x = newX;
            playerPosition.y = newY;
            mapArray[newY][newX] = "@";
        } else {
            // Player defeated, game over
            gameNovel.textContent = "Game Over";
            gameMap.textContent = "";
            statusElement.textContent = "";
            gameS
            return;
        }
    }


    if ("abcdefghijklmnopqrstuvwxyz".includes(targetCell)) {
        displayEndingNovel(levels[currentLevel].ending_novel);
        await waitForAnyKey();
        // Load next level
        loadLevel(targetCell);
        return;
    }

    // Move player
    mapArray[playerPosition.y][playerPosition.x] = ".";
    playerPosition.x = newX;
    playerPosition.y = newY;
    mapArray[newY][newX] = "@";

    // Update the displayed map
    gameMap.textContent = mapArray.map(row => row.join("")).join("\n");
}

function displayEndingNovel(endingNovel) {
    gameNovel.textContent = endingNovel;
    gameMap.textContent = "";
    statusElement.textContent = "";
}

function waitForAnyKey() {
    return new Promise((resolve) => {
        const keydownHandler = () => {
            document.removeEventListener('keydown', keydownHandler);
            resolve();
        };
        document.addEventListener('keydown', keydownHandler);
    });
}

document.addEventListener("keydown", event => {
    switch (event.key) {
        case "ArrowUp":
            movePlayer(0, -1);
            break;
        case "ArrowDown":
            movePlayer(0, 1);
            break;
        case "ArrowLeft":
            movePlayer(-1, 0);
            break;
        case "ArrowRight":
            movePlayer(1, 0);
            break;
    }
});

player = createPlayer();

// Start the game by loading the first level.
loadLevel("a");
updateStatus(); // Update the player's status