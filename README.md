# Text-Based Dungeon Game Engine

This is a simple text-based dungeon game engine that uses a human-readable and extensible format for creating and playing dungeon games. The game engine is implemented in JavaScript and reads YAML files that define the game structure, levels, and player and monster status.

## Features

- Human-readable YAML format for defining games
- Kishōtenketsu plot structure for game stories
- ASCII dungeon representation for easy game level design
- Dynamic game and level loading
- Simple RPG mechanics with hit points, attack, and defense

## Getting Started

1. Clone or download this repository.
2. Install a local web server, such as `serve` or `http-server`, to serve the project files.
3. Open the `index.html` file in your browser to start playing the game.
4. Choose a game and follow the on-screen instructions.

## Creating Your Own Game

To create your own game:

1. Create a new folder inside the `games` directory and name it after your game.
2. Create one or more `.yaml` files inside your game folder, one for each level.
3. Define your game levels using the YAML format, specifying the opening and ending novels, ASCII dungeon layout, player status, and monster status.

Example level file structure:

```yaml
opening_novel: |
  Your opening novel text here.

dungeon_map: |
  Your ASCII dungeon layout here.

ending_novel: |
  Your ending novel text here.
```

## Contributing
If you have any ideas or suggestions for improving the game engine or adding new features, feel free to open an issue or submit a pull request.

## License
This project is licensed under the MIT License. See the LICENSE file for details.
