(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _devUtils = require("./dev/devUtils");

var _Maze = require("./Maze");

var _Maze2 = _interopRequireDefault(_Maze);

var _PointsManager = require("./managers/PointsManager");

var _PointsManager2 = _interopRequireDefault(_PointsManager);

var _RNGBotManager = require("./managers/RNGBotManager");

var _RNGBotManager2 = _interopRequireDefault(_RNGBotManager);

var _UserInterface = require("./UserInterface");

var _UserInterface2 = _interopRequireDefault(_UserInterface);

var _UpgradeManager = require("./managers/UpgradeManager");

var _UpgradeManager2 = _interopRequireDefault(_UpgradeManager);

var _Serializable2 = require("./models/Serializable");

var _Serializable3 = _interopRequireDefault(_Serializable2);

var _SaveManager = require("./managers/SaveManager");

var _SaveManager2 = _interopRequireDefault(_SaveManager);

var _PlayerManager = require("./managers/PlayerManager");

var _PlayerManager2 = _interopRequireDefault(_PlayerManager);

var _MazeItemManager = require("./managers/MazeItemManager");

var _MazeItemManager2 = _interopRequireDefault(_MazeItemManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SERIALIZABLE_PROPERTIES = ['points', 'upgrades'];

var Game = function (_Serializable) {
    _inherits(Game, _Serializable);

    function Game() {
        var isDisableUi = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        var isDevMode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        _classCallCheck(this, Game);

        var _this = _possibleConstructorReturn(this, (Game.__proto__ || Object.getPrototypeOf(Game)).call(this, SERIALIZABLE_PROPERTIES));

        _this.isDevMode = isDevMode;
        _this.isDisableUi = isDisableUi;
        _this.maze = new _Maze2.default(_this);
        _this.points = new _PointsManager2.default(_this, _this.isDevMode);
        _this.rngBot = new _RNGBotManager2.default(_this, _this.isDevMode);
        _this.ui = new _UserInterface2.default(_this, _this.isDisableUi);
        _this.upgrades = new _UpgradeManager2.default(_this);
        _this.players = new _PlayerManager2.default(_this);
        _this.save = new _SaveManager2.default(_this);
        _this.items = new _MazeItemManager2.default(_this);
        _this.ui.setDebugPanelVisible(_this.isDevMode);
        _this.ui.init();
        return _this;
    }

    _createClass(Game, [{
        key: "hardResetGame",
        value: function hardResetGame() {
            this.save.clearLocalStorage();
            this.resetGame();
            this.maze = new _Maze2.default(this);
            this.points.points = 0;
            this.upgrades.resetUpgrades();
            this.startGame();
            this.save.startSaveTimer();
        }
    }, {
        key: "setMaze",
        value: function setMaze() {
            this.maze.newMaze();
            this.players.resetAllPlayers();
        }
    }, {
        key: "startGame",
        value: function startGame() {
            this.upgrades.updateAllUpgradeUi();
            this.players.resetAllPlayers();
            this.ui.deleteMaze();
            this.maze.newMaze();
            //TODO: re-run maze option, reset visited
            this.ui.printMaze(this.maze.maze);
            this.players.createDefaultPlayer();
            this.rngBot.enableGlobalRngBot();
        }
    }, {
        key: "completeMaze",
        value: function completeMaze() {
            this.rngBot.disableGlobalMovement();
            this.players.resetAllPlayers();
            this.points.addMazeCompletionBonus();
            if (this.isDevMode) {
                (0, _devUtils.printMazeCompleteData)(this);
                return;
            }
            this.startGame();
        }
    }, {
        key: "resetGame",
        value: function resetGame() {
            this.rngBot.disableGlobalMovement();
            this.rngBot.disableReEnableBotMovementTimer();
            this.players.resetAllPlayers();
            this.items.clearAllItems();
        }
    }]);

    return Game;
}(_Serializable3.default);

exports.default = Game;

},{"./Maze":2,"./UserInterface":4,"./dev/devUtils":5,"./managers/MazeItemManager":11,"./managers/PlayerManager":12,"./managers/PointsManager":13,"./managers/RNGBotManager":14,"./managers/SaveManager":15,"./managers/UpgradeManager":16,"./models/Serializable":18}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DEFAULT_PLAYER_ID = exports.VISITED_TILE_COLOR = exports.DEFAULT_MAZE_SIZE = exports.STARTING_POSITION = exports.DIRECTIONS_ARR = exports.DIRECTION_RIGHT = exports.DIRECTION_LEFT = exports.DIRECTION_DOWN = exports.DIRECTION_UP = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _MazeGenerator = require("./MazeGenerator");

var _UpgradeConstants = require("./upgrades/UpgradeConstants");

var _FruitMazeItem = require("./items/definitions/FruitMazeItem");

var _FruitMazeItem2 = _interopRequireDefault(_FruitMazeItem);

var _BrainMazeItem = require("./items/definitions/BrainMazeItem");

var _BrainMazeItem2 = _interopRequireDefault(_BrainMazeItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DIRECTION_UP = exports.DIRECTION_UP = { x: 0, y: -1 };
var DIRECTION_DOWN = exports.DIRECTION_DOWN = { x: 0, y: 1 };
var DIRECTION_LEFT = exports.DIRECTION_LEFT = { x: -1, y: 0 };
var DIRECTION_RIGHT = exports.DIRECTION_RIGHT = { x: 1, y: 0 };
var DIRECTIONS_ARR = exports.DIRECTIONS_ARR = [DIRECTION_UP, DIRECTION_DOWN, DIRECTION_LEFT, DIRECTION_RIGHT];
var STARTING_POSITION = exports.STARTING_POSITION = { x: 0, y: 0 };
var DEFAULT_MAZE_SIZE = exports.DEFAULT_MAZE_SIZE = 4;
var VISITED_TILE_COLOR = exports.VISITED_TILE_COLOR = '#7CFCFF';
var DEFAULT_PLAYER_ID = exports.DEFAULT_PLAYER_ID = 0;

var Maze = function () {
    function Maze(game) {
        var isDevMode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        _classCallCheck(this, Maze);

        this.game = game;
        this.isDevMode = isDevMode;
        this.maze = null;
        this.visitedMaze = null;
        this.smartPathMaze = null;
        this.deadEndTileMap = new Map();
    }

    _createClass(Maze, [{
        key: "getMazeExitTile",
        value: function getMazeExitTile() {
            return { x: this.getCurrentMazeSize(), y: this.getCurrentMazeSize() - 1 };
        }
    }, {
        key: "getNextMazeSize",
        value: function getNextMazeSize() {
            return DEFAULT_MAZE_SIZE + this.game.upgrades.getUpgradeLevel(_UpgradeConstants.UpgradeKey.MAZE_SIZE_UPGRADE);
        }
    }, {
        key: "getCurrentMazeSize",
        value: function getCurrentMazeSize() {
            return this.maze.length;
        }
    }, {
        key: "newMaze",
        value: function newMaze() {
            var mazeSize = this.getNextMazeSize();
            this.visitedMaze = (0, _MazeGenerator.generateMazeArr)(mazeSize, mazeSize, false);
            this.maze = (0, _MazeGenerator.generateNewMaze)(this.game, mazeSize, mazeSize);
            this.smartPathMaze = (0, _MazeGenerator.generateMazeSmartPathingArr)(this.game, this.maze, this.getMazeExitTile());
            this.deadEndTileMap = new Map();
            _FruitMazeItem2.default.generateFruitItemDrops(this.game, mazeSize, mazeSize);
            _BrainMazeItem2.default.generateBrainItemDrops(this.game, mazeSize, mazeSize);
        }
    }, {
        key: "markVisited",
        value: function markVisited(tile) {
            this.game.points.addVisitPoints(this.isVisited(tile));
            this.visitedMaze[tile.y][tile.x] = true;
        }
    }, {
        key: "isValidTile",
        value: function isValidTile(tile) {
            return tile.x >= 0 && tile.x < this.getCurrentMazeSize() && tile.y >= 0 && tile.y < this.getCurrentMazeSize();
        }
    }, {
        key: "isVisited",
        value: function isVisited(tile) {
            return this.visitedMaze[tile.y][tile.x];
        }
    }, {
        key: "getSmartPathingDistanceFromExit",
        value: function getSmartPathingDistanceFromExit(tile) {
            return this.smartPathMaze[tile.y][tile.x];
        }
    }, {
        key: "setTileBackgroundColor",
        value: function setTileBackgroundColor(tile) {
            var isPlayer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            var tileColor = this.getTileBackgroundColor(tile);
            var new_tile_key = (0, _MazeGenerator.generateTileKey)(tile.x, tile.y);
            $("#" + new_tile_key).css('background-color', tileColor);
            $("#" + new_tile_key).css('-moz-border-radius', isPlayer ? '90%' : '0%');
            $("#" + new_tile_key).css('border-radius', isPlayer ? '90%' : '0%');
        }
    }, {
        key: "getTileCount",
        value: function getTileCount() {
            return this.maze.length * this.maze[0].length;
        }
    }, {
        key: "spawnSplitBot",
        value: function spawnSplitBot(playerId, dirArr) {
            var currTile = this.game.players.getCurrTile(playerId);
            for (var i = 0; i < dirArr.length; i++) {
                if (i === 0) {
                    // Move the original bot
                    this.game.players.movePlayer(playerId, dirArr[i]);
                    continue;
                }
                // Spawn new split bot in the new tile
                var newTile = (0, _MazeGenerator.getNewTilePositionByVector)(currTile, dirArr[i]);
                var newPlayer = this.game.players.createNewPlayerObj(newTile);
            }
        }
    }, {
        key: "getTileBackgroundColor",
        value: function getTileBackgroundColor(tile) {
            // Check for a player in the tile
            var playerColor = this.game.players.getPlayerColorAtTile(tile);
            if (playerColor != null) {
                return playerColor;
            }
            var tileKey = (0, _MazeGenerator.generateTileKey)(tile.x, tile.y);
            if (this.deadEndTileMap.has(tileKey)) {
                return _MazeGenerator.DEAD_END_COLOR;
            }
            if (this.isVisited(tile)) {
                return VISITED_TILE_COLOR;
            }
            return _MazeGenerator.EMPTY_COLOR;
        }
    }, {
        key: "updatePlayerTileByTileVector",
        value: function updatePlayerTileByTileVector(playerId, dirVector) {
            var playerCurrTile = this.game.players.getCurrTile(playerId);
            var newTile = (0, _MazeGenerator.getNewTilePositionByVector)(playerCurrTile, dirVector);
            this.updatePlayerTile(playerId, newTile);
        }
    }, {
        key: "updatePlayerTile",
        value: function updatePlayerTile(playerId, newTile) {
            var _this = this;

            var player = this.game.players.getPlayer(playerId);
            if (this.isMazeExitTile(newTile)) {
                this.game.completeMaze();
                return;
            }
            // Clear destructible tiles after they move away from the tile
            this.clearDestructibleTilesFromTile(player.currTile);
            player.prevTile = { x: player.currTile.x, y: player.currTile.y };
            player.currTile = { x: newTile.x, y: newTile.y };
            this.markVisited(newTile);
            this.updateDeadEndTilesMap(newTile);
            this.setTileBackgroundColor(player.prevTile);
            this.setTileBackgroundColor(newTile, true);
            var tileKey = (0, _MazeGenerator.generateTileKey)(newTile.x, newTile.y);
            // Pick up fruits if any are on the tile
            if (this.game.items.hasMazeItem(tileKey)) {
                this.game.items.pickupItem(tileKey, playerId);
            }
            if (this.game.upgrades.getUpgradeLevel(_UpgradeConstants.UpgradeKey.BOT_SPLIT_BOT_AUTO_MERGE)) {
                var playerIdsAtTileArr = this.game.players.getPlayerIdsAtTile(player.currTile);
                playerIdsAtTileArr.forEach(function (killPlayerId) {
                    if (killPlayerId !== playerId) {
                        _this.game.players.deletePlayer(killPlayerId);
                    }
                });
            }
        }
    }, {
        key: "clearDestructibleTilesFromTile",
        value: function clearDestructibleTilesFromTile(tile) {
            this.clearDestructibleTileByVector(tile, DIRECTION_UP, _MazeGenerator.MazeDirectionIndex.UP);
            this.clearDestructibleTileByVector(tile, DIRECTION_DOWN, _MazeGenerator.MazeDirectionIndex.DOWN);
            this.clearDestructibleTileByVector(tile, DIRECTION_LEFT, _MazeGenerator.MazeDirectionIndex.LEFT);
            this.clearDestructibleTileByVector(tile, DIRECTION_RIGHT, _MazeGenerator.MazeDirectionIndex.RIGHT);
        }
    }, {
        key: "clearDestructibleTileByVector",
        value: function clearDestructibleTileByVector(tile, direction, mazeDirectionIndex) {
            var neighborTile = (0, _MazeGenerator.getNewTilePositionByVector)(tile, direction);
            if (!this.isValidTile(neighborTile)) return;
            var tileArray = this.maze[tile.y][tile.x];
            var neighborWallTileArr = this.maze[neighborTile.y][neighborTile.x];
            // Neighbor has inverse direction
            var neighborDirectionIndex = (0, _MazeGenerator.getInverseDirectionIndex)(mazeDirectionIndex);
            // Remove destructible wall from current and neighbor tile.
            if (tileArray[mazeDirectionIndex] === _MazeGenerator.MazeWallTypes.DESTRUCTIBLE_WALL && neighborWallTileArr[neighborDirectionIndex] === _MazeGenerator.MazeWallTypes.DESTRUCTIBLE_WALL) {
                tileArray[mazeDirectionIndex] = _MazeGenerator.MazeWallTypes.NO_WALL;
                neighborWallTileArr[neighborDirectionIndex] = _MazeGenerator.MazeWallTypes.NO_WALL;
                // Update the UI with the new tile border css.
                this.game.ui.setTileCss(this.maze, tile.x, tile.y);
                this.game.ui.setTileCss(this.maze, neighborTile.x, neighborTile.y);
            }
        }
    }, {
        key: "canMove",
        value: function canMove(tile, dirVector) {
            var isExcludeExit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
            var isIgnoreDestructibleWalls = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

            var newTile = (0, _MazeGenerator.getNewTilePositionByVector)(tile, dirVector);
            // Check if maze exit and is valid tile
            if (this.isMazeExitTile(newTile) && !isExcludeExit) return true;
            if (!this.isValidTile(newTile)) return false;
            var tileVal = null;
            // Check for walls in current tile in each direction
            if (dirVector === DIRECTION_UP) {
                tileVal = this.maze[tile.y][tile.x][_MazeGenerator.MazeDirectionIndex.UP];
            } else if (dirVector === DIRECTION_DOWN) {
                tileVal = this.maze[tile.y][tile.x][_MazeGenerator.MazeDirectionIndex.DOWN];
            } else if (dirVector === DIRECTION_LEFT) {
                tileVal = this.maze[tile.y][tile.x][_MazeGenerator.MazeDirectionIndex.LEFT];
            } else if (dirVector === DIRECTION_RIGHT) {
                tileVal = this.maze[tile.y][tile.x][_MazeGenerator.MazeDirectionIndex.RIGHT];
            }
            return tileVal === _MazeGenerator.MazeWallTypes.NO_WALL || isIgnoreDestructibleWalls && tileVal === _MazeGenerator.MazeWallTypes.DESTRUCTIBLE_WALL;
        }
    }, {
        key: "getPossibleSplitBotCount",
        value: function getPossibleSplitBotCount(validDirs) {
            if (validDirs.length <= 1) {
                return 0;
            }
            // Total bots active
            var rngBotCount = this.game.players.getPlayerCount(true);
            var splitUpgradeCount = this.game.upgrades.getUpgradeLevel(_UpgradeConstants.UpgradeKey.BOT_SPLIT_DIRECTION);
            // One bot auto-allowed, and +1 extra bot allowed per upgrade
            return Math.max(0, splitUpgradeCount + 1 - rngBotCount);
        }
    }, {
        key: "teleportPlayerBackToBot",
        value: function teleportPlayerBackToBot() {
            var manualPlayer = this.game.players.getManuallyControlledPlayer();
            var primaryBot = this.game.players.getPrimaryBot();
            if (!manualPlayer || !primaryBot) return;
            // Move player and delete the bot.
            this.updatePlayerTile(manualPlayer.id, primaryBot.currTile);
            this.game.players.deletePlayer(primaryBot.id);
        }
    }, {
        key: "teleportBotBackToPlayer",
        value: function teleportBotBackToPlayer() {
            var manualPlayer = this.game.players.getManuallyControlledPlayer();
            var primaryBot = this.game.players.getPrimaryBot();
            if (!manualPlayer || !primaryBot) return;
            // Move player and delete the bot.
            this.updatePlayerTile(primaryBot.id, manualPlayer.currTile);
            this.game.players.deletePlayer(primaryBot.id);
        }
    }, {
        key: "isMazeExitTile",
        value: function isMazeExitTile(tile) {
            return (0, _MazeGenerator.isTileEqual)(tile, this.getMazeExitTile());
        }
    }, {
        key: "getValidDirectionsByPlayerId",
        value: function getValidDirectionsByPlayerId(playerId) {
            var currTile = this.game.players.getPlayer(playerId).currTile;
            return this.getValidDirectionsByTile(currTile);
        }
    }, {
        key: "getValidDirectionsByTile",
        value: function getValidDirectionsByTile(tile) {
            var _this2 = this;

            var isIncludeDestructible = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            var validDirsArr = DIRECTIONS_ARR.filter(function (dir) {
                return _this2.canMove(tile, dir, false, isIncludeDestructible);
            });
            return validDirsArr;
        }
    }, {
        key: "getDeadEndValue",
        value: function getDeadEndValue(tile, validDirsArr) {
            var _this3 = this;

            var deadEndCount = 0,
                deadEndMaxVal = 0;
            var upgradeCount = this.game.upgrades.getUpgradeLevel(_UpgradeConstants.UpgradeKey.BOT_REMEMBER_DEADEND_TILES);
            // Count dead ends from valid dirs
            validDirsArr.forEach(function (dir) {
                var newTile = (0, _MazeGenerator.getNewTilePositionByVector)(tile, dir);
                var tileKey = (0, _MazeGenerator.generateTileKey)(newTile.x, newTile.y);
                if (_this3.deadEndTileMap.has(tileKey)) {
                    deadEndCount++;
                    deadEndMaxVal = Math.max(_this3.deadEndTileMap.get(tileKey), deadEndMaxVal);
                }
            });
            // All but one are deadends -- return the max value if within upgrade limit
            if (deadEndCount === validDirsArr.length - 1 && deadEndMaxVal < upgradeCount) {
                return deadEndMaxVal + 1;
            }
            return null;
        }
    }, {
        key: "updateDeadEndTilesMap",
        value: function updateDeadEndTilesMap(tile) {
            var upgradeCount = this.game.upgrades.getUpgradeLevel(_UpgradeConstants.UpgradeKey.BOT_REMEMBER_DEADEND_TILES);
            if (upgradeCount === 0) {
                return;
            }
            var validDirsArr = this.getValidDirectionsByTile(tile, true);
            var tileKey = (0, _MazeGenerator.generateTileKey)(tile.x, tile.y);
            if (validDirsArr.length === 1) {
                this.deadEndTileMap.set(tileKey, 1);
                return;
            }
            var deadEndDistance = this.getDeadEndValue(tile, validDirsArr);
            if (deadEndDistance != null) {
                this.deadEndTileMap.set(tileKey, deadEndDistance);
            }
        }
    }, {
        key: "filterPlayerExitMazeDirection",
        value: function filterPlayerExitMazeDirection(playerId, validDirs) {
            var _this4 = this;

            if (!this.game.players.playerExists(playerId)) return;
            var currTile = this.game.players.getPlayer(playerId).currTile;
            var currDistance = this.getSmartPathingDistanceFromExit(currTile);
            var autoExitMazeUpgradeLevel = this.game.upgrades.getUpgradeLevel(_UpgradeConstants.UpgradeKey.AUTO_EXIT_MAZE);
            var playerHasSmartPathing = this.game.players.playerHasSmartPathing(playerId);
            // Check if within X tiles of exit (1 per upgrade) and player has no smart pathing
            if (currDistance > autoExitMazeUpgradeLevel && !playerHasSmartPathing) {
                return [];
            }
            // Find best direction
            var exitMazeDir = validDirs.filter(function (dir) {
                var newTile = (0, _MazeGenerator.getNewTilePositionByVector)(currTile, dir);
                // Exit tile or one step closer to exit. If distance 1, MUST be exit tile.
                return _this4.isMazeExitTile(newTile) || currDistance !== 1 && _this4.isValidTile(newTile) && _this4.getSmartPathingDistanceFromExit(newTile) === currDistance - 1;
            });
            return exitMazeDir;
        }
    }, {
        key: "filterAvoidRevisitLastPosition",
        value: function filterAvoidRevisitLastPosition(playerId, validDirs) {
            var _this5 = this;

            if (!this.game.players.playerExists(playerId)) return;
            // Find any tiles that are not the previous tile.
            var noRevisitDirsArr = validDirs.filter(function (dir) {
                var previousTile = _this5.game.players.getPreviousTile(playerId);
                var newTile = (0, _MazeGenerator.getNewTilePositionByVector)(_this5.game.players.getCurrTile(playerId), dir);
                return !(0, _MazeGenerator.isTileEqual)(newTile, previousTile);
            });
            return noRevisitDirsArr;
        }
    }, {
        key: "prioritizeUnvisitedDirection",
        value: function prioritizeUnvisitedDirection(playerId, validDirs) {
            var _this6 = this;

            if (!this.game.players.playerExists(playerId)) return;
            // Find any unvisited tiles within reach.
            var unvisitedDirsArr = validDirs.filter(function (dir) {
                var newTile = (0, _MazeGenerator.getNewTilePositionByVector)(_this6.game.players.getCurrTile(playerId), dir);
                return !_this6.isVisited(newTile);
            });
            return unvisitedDirsArr;
        }
    }, {
        key: "filterDeadEndTiles",
        value: function filterDeadEndTiles(playerId, validDirs) {
            var _this7 = this;

            if (!this.game.players.playerExists(playerId)) return;
            var nonDeadEndTiles = validDirs.filter(function (dir) {
                var newTile = (0, _MazeGenerator.getNewTilePositionByVector)(_this7.game.players.getCurrTile(playerId), dir);
                var tileKey = (0, _MazeGenerator.generateTileKey)(newTile.x, newTile.y);
                return !_this7.deadEndTileMap.has(tileKey);
            });
            return nonDeadEndTiles;
        }
    }]);

    return Maze;
}();

exports.default = Maze;

},{"./MazeGenerator":3,"./items/definitions/BrainMazeItem":9,"./items/definitions/FruitMazeItem":10,"./upgrades/UpgradeConstants":20}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.generateMazeSmartPathingArr = exports.generateMazeArr = exports.generateNewMaze = exports.generateTileKey = exports.isTileEqual = exports.getNewTilePositionByVector = exports.getInverseDirectionIndex = exports.MazeWallTypes = exports.MazeDirectionIndex = exports.DEFAULT_TILE_WIDTH_CSS = exports.SMART_PATHING_PLAYER_COLOR = exports.DEAD_END_COLOR = exports.EMPTY_COLOR = exports.RNG_BOT_COLOR = exports.PLAYER_COLOR = undefined;

var _Maze = require('./Maze');

var PLAYER_COLOR = exports.PLAYER_COLOR = '#1ec438';
var RNG_BOT_COLOR = exports.RNG_BOT_COLOR = '#000000';
var EMPTY_COLOR = exports.EMPTY_COLOR = '#FFFFFF';
var DEAD_END_COLOR = exports.DEAD_END_COLOR = '#F13241';
var SMART_PATHING_PLAYER_COLOR = exports.SMART_PATHING_PLAYER_COLOR = '#dbaed8';
var DEFAULT_TILE_WIDTH_CSS = exports.DEFAULT_TILE_WIDTH_CSS = '20px';
var MazeDirectionIndex = exports.MazeDirectionIndex = undefined;
(function (MazeDirectionIndex) {
    MazeDirectionIndex[MazeDirectionIndex["UP"] = 0] = "UP";
    MazeDirectionIndex[MazeDirectionIndex["RIGHT"] = 1] = "RIGHT";
    MazeDirectionIndex[MazeDirectionIndex["DOWN"] = 2] = "DOWN";
    MazeDirectionIndex[MazeDirectionIndex["LEFT"] = 3] = "LEFT";
})(MazeDirectionIndex || (exports.MazeDirectionIndex = MazeDirectionIndex = {}));
var MazeWallTypes = exports.MazeWallTypes = undefined;
(function (MazeWallTypes) {
    MazeWallTypes[MazeWallTypes["WALL"] = 0] = "WALL";
    MazeWallTypes[MazeWallTypes["NO_WALL"] = 1] = "NO_WALL";
    MazeWallTypes[MazeWallTypes["DESTRUCTIBLE_WALL"] = 2] = "DESTRUCTIBLE_WALL";
})(MazeWallTypes || (exports.MazeWallTypes = MazeWallTypes = {}));
var getInverseDirectionIndex = exports.getInverseDirectionIndex = function getInverseDirectionIndex(mazeDirIndex) {
    if (mazeDirIndex === MazeDirectionIndex.UP) {
        return MazeDirectionIndex.DOWN;
    } else if (mazeDirIndex === MazeDirectionIndex.DOWN) {
        return MazeDirectionIndex.UP;
    } else if (mazeDirIndex === MazeDirectionIndex.LEFT) {
        return MazeDirectionIndex.RIGHT;
    } else if (mazeDirIndex === MazeDirectionIndex.RIGHT) {
        return MazeDirectionIndex.LEFT;
    }
    return null;
};
var getNewTilePositionByVector = exports.getNewTilePositionByVector = function getNewTilePositionByVector(tile, vector) {
    return { x: tile.x + vector.x, y: tile.y + vector.y };
};
var isTileEqual = exports.isTileEqual = function isTileEqual(tile1, tile2) {
    return tile1.x === tile2.x && tile1.y === tile2.y;
};
var generateTileKey = exports.generateTileKey = function generateTileKey(x, y) {
    return x + '-' + y;
};
var generateNewMaze = exports.generateNewMaze = function generateNewMaze(game, x, y) {
    // Establish variables and starting grid
    var totalCells = x * y;
    var cells = new Array();
    var unvis = new Array();
    for (var i = 0; i < y; i++) {
        cells[i] = new Array();
        unvis[i] = new Array();
        for (var j = 0; j < x; j++) {
            cells[i][j] = [0, 0, 0, 0];
            unvis[i][j] = true;
        }
    }
    // Set a random position to start from
    var currentCell = [Math.floor(Math.random() * y), Math.floor(Math.random() * x)];
    var path = [currentCell];
    unvis[currentCell[0]][currentCell[1]] = false;
    var visited = 1;
    // Loop through all available cell positions
    while (visited < totalCells) {
        // Determine neighboring cells
        var pot = [[currentCell[0] - 1, currentCell[1], 0, 2], [currentCell[0], currentCell[1] + 1, 1, 3], [currentCell[0] + 1, currentCell[1], 2, 0], [currentCell[0], currentCell[1] - 1, 3, 1]];
        var neighbors = new Array();
        // Determine if each neighboring cell is in game grid, and whether it has already been checked
        for (var l = 0; l < 4; l++) {
            if (pot[l][0] > -1 && pot[l][0] < y && pot[l][1] > -1 && pot[l][1] < x && unvis[pot[l][0]][pot[l][1]]) {
                neighbors.push(pot[l]);
            }
        }
        // If at least one active neighboring cell has been found
        if (neighbors.length) {
            // Choose one of the neighbors at random
            var next = neighbors[Math.floor(Math.random() * neighbors.length)];
            // Remove the wall between the current cell and the chosen neighboring cell
            var destructibleWallSpawnProbability = game.points.getDestructibleWallSpawnProbability();
            var wallType = Math.random() < destructibleWallSpawnProbability ? MazeWallTypes.DESTRUCTIBLE_WALL : MazeWallTypes.NO_WALL;
            cells[currentCell[0]][currentCell[1]][next[2]] = wallType;
            cells[next[0]][next[1]][next[3]] = wallType;
            // Mark the neighbor as visited, and set it as the current cell
            unvis[next[0]][next[1]] = false;
            visited++;
            currentCell = [next[0], next[1]];
            path.push(currentCell);
        }
        // Otherwise go back up a step and keep going
        else {
                currentCell = path.pop();
            }
    }
    // Set entrance/exit
    cells[x - 1][y - 1][MazeDirectionIndex.RIGHT] = MazeWallTypes.NO_WALL;
    return cells;
};
var generateMazeArr = exports.generateMazeArr = function generateMazeArr(x, y, defaultValue) {
    var mazeArr = new Array();
    for (var i = 0; i < y; i++) {
        mazeArr[i] = new Array();
        for (var j = 0; j < x; j++) {
            mazeArr[i][j] = defaultValue;
        }
    }
    return mazeArr;
};
// Generates a maze with a number in each position representing the distance from exit using optimal pathing.
var generateMazeSmartPathingArr = exports.generateMazeSmartPathingArr = function generateMazeSmartPathingArr(game, maze, exitTile) {
    var smartPathArr = generateMazeArr(maze[0].length, maze.length, 0);
    //TODO: figure out how to handle exit tile better
    var lastTile = { x: exitTile.x - 1, y: exitTile.y };
    // Mark first tile visited first -- canMove() cannot handle starting outside of the maze (ie. exit point).
    smartPathArr[lastTile.y][lastTile.x] = 1;
    var tileQueue = [lastTile];
    var stepCount = 2;
    // BFS iteration
    while (tileQueue.length > 0) {
        var loopSize = tileQueue.length;
        // One step in all directions for each tile
        for (var i = 0; i < loopSize; i++) {
            var tile = tileQueue.shift();
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = _Maze.DIRECTIONS_ARR[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var dir = _step.value;

                    // Only test valid directions (ie. non-wall, etc.)
                    //TODO: this needs to handle destructible walls
                    if (game.maze.canMove(tile, dir, true)) {
                        var newTile = getNewTilePositionByVector(tile, dir);
                        // Don't revisit tiles
                        if (smartPathArr[newTile.y][newTile.x] === 0) {
                            smartPathArr[newTile.y][newTile.x] = stepCount;
                            tileQueue.push(newTile);
                        }
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
        stepCount++;
    }
    return smartPathArr;
};

},{"./Maze":2}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _MazeGenerator = require("./MazeGenerator");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UserInterface = function () {
    function UserInterface(game) {
        var disableUi = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        _classCallCheck(this, UserInterface);

        this.game = game;
        this.disableUi = disableUi;
    }

    _createClass(UserInterface, [{
        key: "init",
        value: function init() {
            if (this.disableUi) return;
            this.initText();
            this.initEvents();
        }
    }, {
        key: "initText",
        value: function initText() {
            this.setPointsText();
        }
    }, {
        key: "initEvents",
        value: function initEvents() {
            var _this = this;

            $("#manualSaveGame").click(function () {
                return _this.game.save.saveGameToLocalStorage();
            });
            $("#deleteSaveGame").click(function () {
                return _this.game.save.clearLocalStorage();
            });
            $("#newGame").click(function () {
                return _this.game.hardResetGame();
            });
        }
    }, {
        key: "setDebugPanelVisible",
        value: function setDebugPanelVisible(isVisible) {
            $("#debug").css("display", isVisible ? "block" : "none");
        }
    }, {
        key: "setPointsText",
        value: function setPointsText() {
            $("#points").text("Points: " + this.game.points.points.toLocaleString());
        }
    }, {
        key: "printMaze",
        value: function printMaze(maze) {
            if (this.disableUi) return;
            for (var y = 0; y < maze.length; y++) {
                $("#maze > tbody").append("<tr>");
                for (var x = 0; x < maze[y].length; x++) {
                    var tileKey = (0, _MazeGenerator.generateTileKey)(x, y);
                    // Place cell element
                    $("#maze > tbody").append("<td id=\"" + tileKey + "\">&nbsp;</td>");
                    // Draw edges
                    this.setTileCss(maze, x, y);
                    // Draw fruit in tile.
                    if (this.game.items.hasMazeItem(tileKey)) {
                        this.game.items.drawItem(tileKey);
                    }
                }
                $("#maze > tbody").append("</tr>");
            }
        }
    }, {
        key: "setTileCss",
        value: function setTileCss(maze, x, y) {
            var selector = (0, _MazeGenerator.generateTileKey)(x, y);
            $("#" + selector).css("border-top", this.getMazeBorderCss(maze[y][x][_MazeGenerator.MazeDirectionIndex.UP]));
            $("#" + selector).css("border-right", this.getMazeBorderCss(maze[y][x][_MazeGenerator.MazeDirectionIndex.RIGHT]));
            $("#" + selector).css("border-bottom", this.getMazeBorderCss(maze[y][x][_MazeGenerator.MazeDirectionIndex.DOWN]));
            $("#" + selector).css("border-left", this.getMazeBorderCss(maze[y][x][_MazeGenerator.MazeDirectionIndex.LEFT]));
        }
    }, {
        key: "getMazeBorderCss",
        value: function getMazeBorderCss(val) {
            if (val === _MazeGenerator.MazeWallTypes.WALL) {
                return '2px solid black';
            } else if (val === _MazeGenerator.MazeWallTypes.DESTRUCTIBLE_WALL) {
                return '2px dotted black';
            } else {
                //TODO: make this occupy space still
                return 'hidden';
            }
        }
    }, {
        key: "drawBanana",
        value: function drawBanana(tileSelector) {
            $("#" + tileSelector).css("background-image", "url(\"img/banana.png\")");
            $("#" + tileSelector).css("background-size", "20px");
        }
    }, {
        key: "removeBanana",
        value: function removeBanana(tileSelector) {
            $("#" + tileSelector).css("background-size", "");
        }
    }, {
        key: "deleteMaze",
        value: function deleteMaze() {
            if (this.disableUi) return;
            $("#maze td").remove();
            $("#maze tr").remove();
        }
    }]);

    return UserInterface;
}();

exports.default = UserInterface;

},{"./MazeGenerator":3}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.printMazeCompleteData = exports.IS_FREE_MODE_ENABLED = exports.DEV_MODE_AUTOSTART = exports.DEV_MODE_DISABLE_UI = exports.IS_DEV_MODE_ENABLED = undefined;

var _Game = require("../Game");

var _Game2 = _interopRequireDefault(_Game);

var _Maze = require("../Maze");

var _MazeGenerator = require("../MazeGenerator");

var _UpgradeConstants = require("../upgrades/UpgradeConstants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var IS_DEV_MODE_ENABLED = exports.IS_DEV_MODE_ENABLED = false;
var DEV_MODE_DISABLE_UI = exports.DEV_MODE_DISABLE_UI = false;
var DEV_MODE_AUTOSTART = exports.DEV_MODE_AUTOSTART = false;
var IS_FREE_MODE_ENABLED = exports.IS_FREE_MODE_ENABLED = true;
var generateScalingNumbers = function generateScalingNumbers() {
    var startingUpgradeCount = 0;
    var baseCost = 10;
    var costMultiplier = 2.0;
    var baseVal = 1000;
    var valMultiplier = 0.98;
    var maxUpgradeCount = 50;
    for (var x = startingUpgradeCount; x < maxUpgradeCount; x++) {
        var cost = baseCost * Math.pow(costMultiplier, x);
        var val = baseVal * Math.pow(valMultiplier, x);
        $('#debugTable > tbody').append("<tr>");
        $('#debugTable > tbody').append("<td width=\"" + _MazeGenerator.DEFAULT_TILE_WIDTH_CSS + "\">" + (x + 1) + ":   </td>");
        $('#debugTable > tbody').append("<td width=\"100px\">" + cost.toLocaleString() + "</td>");
        $('#debugTable > tbody').append("<td width=\"100px\">" + val.toFixed(4) + "</td>");
        $('#debugTable > tbody').append("</tr>");
    }
};
// generateScalingNumbers();
var game1;
var game2;
var game3;
var game4;
var game5;
var iterationCount = 0;
var maxIterationCount = 100;
var getMazeData = function getMazeData() {
    game1 = new _Game2.default(DEV_MODE_DISABLE_UI, true);
    game1.setMaze();
    // game1.points.rngBotPrioritizeUnvisited = Boolean($(`#debugInputPrioritizeUnvisited`).val());
    // // game1.points.rngBotAvoidRevisitLastPosition = Boolean($(`#debugAvoidRevisit`).val());
    // game1.points.rngBotAutoExitMaze = Boolean($(`#debugAutoExit`).val());
    // game1.points.mazeSizeUpgradeCount = parseInt($(`#debugMazeUpgradeCount`).val().toString());
    // maxIterationCount = parseInt($(`#debugMaxIterations`).val().toString());
    // game1.points.rngMovementSpeedUpgrades = 1000;
    // game1.points.pointsPerVisitUpgradeCount = 0;
    // game1.points.rngMovementSpeedUpgrades = 20;
    console.info('start debug maze');
    game1.startGame();
};
var sumMoves = 0;
var sumPoints = 0;
var printAverages = function printAverages() {
    var mazeSize = _Maze.DEFAULT_MAZE_SIZE + game1.upgrades.getUpgradeLevel(_UpgradeConstants.UpgradeKey.MAZE_SIZE_UPGRADE);
    $("#debugResult").append("Avg Moves: " + (sumMoves / iterationCount).toFixed(2) + "<br>");
    $("#debugResult").append("Avg New Tile Visits: " + (sumPoints / iterationCount).toFixed(2) + "<br>");
    $("#debugResult").append("Avg Tile Revisits: " + ((sumMoves - sumPoints) / iterationCount).toFixed(2) + "<br>");
    $("#debugResult").append("Maze size: " + mazeSize + "<br>");
};
var printMazeCompleteData = exports.printMazeCompleteData = function printMazeCompleteData(game) {
    var moveCount = game.maze.moveCount;
    // let totalTime = game.rngBot.getBotMoveInterval() * moveCount;
    var points = game.points.points;
    var completionBonus = game.points.getMazeCompletionBonus();
    $('#debugTable > tbody').append("<tr>");
    $('#debugTable > tbody').append("<td>" + (1 + iterationCount) + ":   </td>");
    $('#debugTable > tbody').append("<td>" + moveCount + "</td>");
    // $('#debugTable > tbody').append(`<td>${totalTime}</td>`);
    $('#debugTable > tbody').append("<td>" + (points - completionBonus).toFixed(2) + "</td>");
    $('#debugTable > tbody').append("<td>" + points.toFixed(2) + "</td>");
    $('#debugTable > tbody').append("</tr>");
    sumMoves += moveCount;
    sumPoints += points - completionBonus;
    iterationCount++;
    if (iterationCount == maxIterationCount) {
        printAverages();
        return;
    }
    game.points.points = 0;
    game.startGame();
};
var debugHeader = function debugHeader() {
    $('#debugTable > tbody').append("<tr>");
    $('#debugTable > tbody').append("<th>#</td>");
    $('#debugTable > tbody').append("<th>Move Count</th>");
    $('#debugTable > tbody').append("<th>Points</th>");
    $('#debugTable > tbody').append("<th>Points (+comp)</th>");
    $('#debugTable > tbody').append("</tr>");
};
$(document).ready(function () {
    if (!IS_DEV_MODE_ENABLED) return;
    $('#debugRunButton').click(function () {
        $('#debugTable > tbody').empty();
        $("#debugResult").empty();
        iterationCount = 0;
        sumMoves = 0;
        sumPoints = 0;
        debugHeader();
        getMazeData();
    });
});

},{"../Game":1,"../Maze":2,"../MazeGenerator":3,"../upgrades/UpgradeConstants":20}],6:[function(require,module,exports){
"use strict";

var _devUtils = require("./dev/devUtils");

var _Game = require("./Game");

var _Game2 = _interopRequireDefault(_Game);

var _Maze = require("./Maze");

var _UpgradeConstants = require("./upgrades/UpgradeConstants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

$(document).ready(function () {
    if (_devUtils.IS_DEV_MODE_ENABLED && !_devUtils.DEV_MODE_AUTOSTART) return;
    var game = new _Game2.default();
    game.save.loadGameSaveFromLocalStorage();
    game.startGame();
    game.save.startSaveTimer();
    //TODO: this should be in UI
    $(document).keydown(function (event) {
        // Up
        if (event.keyCode === 38) {
            game.players.movePlayer(_Maze.DEFAULT_PLAYER_ID, _Maze.DIRECTION_UP, true);
            event.preventDefault();
        }
        // Down
        else if (event.keyCode === 40) {
                game.players.movePlayer(_Maze.DEFAULT_PLAYER_ID, _Maze.DIRECTION_DOWN, true);
                event.preventDefault();
            }
            // Left
            else if (event.keyCode === 37) {
                    game.players.movePlayer(_Maze.DEFAULT_PLAYER_ID, _Maze.DIRECTION_LEFT, true);
                    event.preventDefault();
                }
                // Right
                else if (event.keyCode === 39) {
                        game.players.movePlayer(_Maze.DEFAULT_PLAYER_ID, _Maze.DIRECTION_RIGHT, true);
                        event.preventDefault();
                    }
                    // E = Teleport Bot to Player
                    else if (event.keyCode === 69) {
                            if (game.upgrades.isUpgraded(_UpgradeConstants.UpgradeKey.TELEPORT_PLAYER_BACK_TO_BOT)) {
                                game.maze.teleportPlayerBackToBot();
                            }
                            event.preventDefault();
                        }
                        // Q = Teleport Bot to Player
                        else if (event.keyCode === 81) {
                                if (game.upgrades.isUpgraded(_UpgradeConstants.UpgradeKey.TELEPORT_BOT_BACK_TO_PLAYER)) {
                                    game.maze.teleportBotBackToPlayer();
                                    event.preventDefault();
                                }
                            }
    });
});

},{"./Game":1,"./Maze":2,"./dev/devUtils":5,"./upgrades/UpgradeConstants":20}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var MazeItemKey = exports.MazeItemKey = undefined;
(function (MazeItemKey) {
    MazeItemKey[MazeItemKey["FRUIT"] = 0] = "FRUIT";
    MazeItemKey[MazeItemKey["BRAIN"] = 1] = "BRAIN";
})(MazeItemKey || (exports.MazeItemKey = MazeItemKey = {}));
var FRUIT_SPAWN_BASE_PROBABILITY = exports.FRUIT_SPAWN_BASE_PROBABILITY = 0.005;
var FRUIT_PICKUP_POINTS_BASE_AMOUNT = exports.FRUIT_PICKUP_POINTS_BASE_AMOUNT = 10;
var FRUIT_PICKUP_POINTS_BASE_AMOUNT_MULTIPLIER = exports.FRUIT_PICKUP_POINTS_BASE_AMOUNT_MULTIPLIER = 1.2;
var BRAIN_SPAWN_BASE_PROBABILITY = exports.BRAIN_SPAWN_BASE_PROBABILITY = 0.005;
var BRAIN_STARTING_TILE_DISTANCE = exports.BRAIN_STARTING_TILE_DISTANCE = 20;

},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _MazeGenerator = require("../MazeGenerator");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MazeItem = function () {
    function MazeItem(game, tile, mazeItemKey, backgroundImagePath) {
        _classCallCheck(this, MazeItem);

        this.game = game;
        this.tile = tile;
        this.tileKey = (0, _MazeGenerator.generateTileKey)(tile.x, tile.y);
        this.mazeItemKey = mazeItemKey;
        this.backgroundImagePath = backgroundImagePath;
    }

    _createClass(MazeItem, [{
        key: "drawItem",
        value: function drawItem() {
            $("#" + this.tileKey).css("background-image", "url(\"" + this.backgroundImagePath + "\")");
            $("#" + this.tileKey).css("background-size", '22px');
        }
    }, {
        key: "removeItem",
        value: function removeItem() {
            $("#" + this.tileKey).css("background-size", "");
        }
    }, {
        key: "triggerPickup",
        value: function triggerPickup(playerId) {
            this.removeItem();
        }
    }]);

    return MazeItem;
}();

exports.default = MazeItem;

},{"../MazeGenerator":3}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _UpgradeConstants = require("../../upgrades/UpgradeConstants");

var _ItemConstants = require("../ItemConstants");

var _MazeItem2 = require("../MazeItem");

var _MazeItem3 = _interopRequireDefault(_MazeItem2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BACKGROUND_IMAGE_PATH = 'img/brain.png';

var BrainMazeItem = function (_MazeItem) {
    _inherits(BrainMazeItem, _MazeItem);

    function BrainMazeItem(game, tile, mazeItemKey) {
        _classCallCheck(this, BrainMazeItem);

        return _possibleConstructorReturn(this, (BrainMazeItem.__proto__ || Object.getPrototypeOf(BrainMazeItem)).call(this, game, tile, mazeItemKey, BACKGROUND_IMAGE_PATH));
    }

    _createClass(BrainMazeItem, [{
        key: "triggerPickup",
        value: function triggerPickup(playerId) {
            _get(BrainMazeItem.prototype.__proto__ || Object.getPrototypeOf(BrainMazeItem.prototype), "triggerPickup", this).call(this, playerId);
            if (!this.game.players.playerMap.has(playerId)) return;
            var tileDistance = this.getBrainTileDistanceAmount();
            this.game.players.getPlayer(playerId).smartPathingTileDistanceRemaining += tileDistance;
        }
    }, {
        key: "getBrainTileDistanceAmount",
        value: function getBrainTileDistanceAmount() {
            return _ItemConstants.BRAIN_STARTING_TILE_DISTANCE;
        }
    }], [{
        key: "getBrainSpawnProbability",
        value: function getBrainSpawnProbability(game) {
            // 1% increase per upgrade
            var upgradeLevel = game.upgrades.getUpgradeLevel(_UpgradeConstants.UpgradeKey.BRAIN_SPAWN);
            return _ItemConstants.BRAIN_SPAWN_BASE_PROBABILITY * (1 + upgradeLevel);
        }
    }, {
        key: "generateBrainItemDrops",
        value: function generateBrainItemDrops(game, sizeX, sizeY) {
            var spawnProb = BrainMazeItem.getBrainSpawnProbability(game);
            //TODO: calculate global probability and assign randomly
            for (var y = 0; y < sizeY; y++) {
                for (var x = 0; x < sizeX; x++) {
                    var rand = Math.random();
                    if (rand < spawnProb) {
                        var tile = { x: x, y: y };
                        game.items.createMazeItem(tile, _ItemConstants.MazeItemKey.BRAIN);
                    }
                }
            }
        }
    }]);

    return BrainMazeItem;
}(_MazeItem3.default);

exports.default = BrainMazeItem;

},{"../../upgrades/UpgradeConstants":20,"../ItemConstants":7,"../MazeItem":8}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _UpgradeConstants = require("../../upgrades/UpgradeConstants");

var _ItemConstants = require("../ItemConstants");

var _MazeItem2 = require("../MazeItem");

var _MazeItem3 = _interopRequireDefault(_MazeItem2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BACKGROUND_IMAGE_PATH = 'img/banana.png';
// Note: This item will bypass destructible walls.

var FruitMazeItem = function (_MazeItem) {
    _inherits(FruitMazeItem, _MazeItem);

    function FruitMazeItem(game, tile, mazeItemKey) {
        _classCallCheck(this, FruitMazeItem);

        return _possibleConstructorReturn(this, (FruitMazeItem.__proto__ || Object.getPrototypeOf(FruitMazeItem)).call(this, game, tile, mazeItemKey, BACKGROUND_IMAGE_PATH));
    }

    _createClass(FruitMazeItem, [{
        key: "triggerPickup",
        value: function triggerPickup(playerId) {
            var points = this.getFruitPickupPointsAmount();
            this.game.points.addPoints(points);
            _get(FruitMazeItem.prototype.__proto__ || Object.getPrototypeOf(FruitMazeItem.prototype), "triggerPickup", this).call(this, playerId);
        }
    }, {
        key: "getFruitPickupPointsAmount",
        value: function getFruitPickupPointsAmount() {
            var upgradeLevel = this.game.upgrades.getUpgradeLevel(_UpgradeConstants.UpgradeKey.FRUIT_PICKUP_POINTS);
            return _ItemConstants.FRUIT_PICKUP_POINTS_BASE_AMOUNT * Math.pow(_ItemConstants.FRUIT_PICKUP_POINTS_BASE_AMOUNT_MULTIPLIER, upgradeLevel);
        }
    }], [{
        key: "getFruitSpawnProbability",
        value: function getFruitSpawnProbability(game) {
            // 1% increase per upgrade
            var upgradeLevel = game.upgrades.getUpgradeLevel(_UpgradeConstants.UpgradeKey.FRUIT_SPAWN);
            return _ItemConstants.FRUIT_SPAWN_BASE_PROBABILITY * (1 + upgradeLevel);
        }
    }, {
        key: "generateFruitItemDrops",
        value: function generateFruitItemDrops(game, sizeX, sizeY) {
            var spawnProb = FruitMazeItem.getFruitSpawnProbability(game);
            //TODO: calculate global probability and assign randomly
            for (var y = 0; y < sizeY; y++) {
                for (var x = 0; x < sizeX; x++) {
                    var rand = Math.random();
                    if (rand < spawnProb) {
                        var tile = { x: x, y: y };
                        game.items.createMazeItem(tile, _ItemConstants.MazeItemKey.FRUIT);
                    }
                }
            }
        }
    }]);

    return FruitMazeItem;
}(_MazeItem3.default);

exports.default = FruitMazeItem;

},{"../../upgrades/UpgradeConstants":20,"../ItemConstants":7,"../MazeItem":8}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _MazeGenerator = require("../MazeGenerator");

var _FruitMazeItem = require("../items/definitions/FruitMazeItem");

var _FruitMazeItem2 = _interopRequireDefault(_FruitMazeItem);

var _ItemConstants = require("../items/ItemConstants");

var _BrainMazeItem = require("../items/definitions/BrainMazeItem");

var _BrainMazeItem2 = _interopRequireDefault(_BrainMazeItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MazeItemManager = function () {
    function MazeItemManager(game) {
        _classCallCheck(this, MazeItemManager);

        this.mazeItemMap = new Map();
        this.game = game;
    }

    _createClass(MazeItemManager, [{
        key: "createMazeItem",
        value: function createMazeItem(tile, mazeItemKey) {
            var tileKey = (0, _MazeGenerator.generateTileKey)(tile.x, tile.y);
            var mazeItem = null;
            if (mazeItemKey === _ItemConstants.MazeItemKey.FRUIT) {
                mazeItem = new _FruitMazeItem2.default(this.game, tile, mazeItemKey);
            } else if (mazeItemKey === _ItemConstants.MazeItemKey.BRAIN) {
                mazeItem = new _BrainMazeItem2.default(this.game, tile, mazeItemKey);
            } else {
                console.error('Failed to create maze item of type.  No valid type: ' + mazeItemKey);
                return;
            }
            //TODO: create items in a single loop to dedupe.
            if (this.hasMazeItem(tileKey)) {
                console.error('Cannot create item. Tile is already occupied.');
                return;
            }
            this.mazeItemMap.set(tileKey, mazeItem);
        }
    }, {
        key: "clearAllItems",
        value: function clearAllItems() {
            this.mazeItemMap = new Map();
        }
    }, {
        key: "getMazeItem",
        value: function getMazeItem(tileKey) {
            if (!this.hasMazeItem(tileKey)) return null;
            return this.mazeItemMap.get(tileKey);
        }
    }, {
        key: "hasMazeItem",
        value: function hasMazeItem(tileKey) {
            return this.mazeItemMap.has(tileKey);
        }
    }, {
        key: "drawItem",
        value: function drawItem(tileKey) {
            if (!this.hasMazeItem(tileKey)) return;
            this.getMazeItem(tileKey).drawItem();
        }
    }, {
        key: "pickupItem",
        value: function pickupItem(tileKey, playerId) {
            if (!tileKey || !this.hasMazeItem(tileKey)) return;
            this.mazeItemMap.get(tileKey).triggerPickup(playerId);
            this.mazeItemMap.delete(tileKey);
        }
    }]);

    return MazeItemManager;
}();

exports.default = MazeItemManager;

},{"../MazeGenerator":3,"../items/ItemConstants":7,"../items/definitions/BrainMazeItem":9,"../items/definitions/FruitMazeItem":10}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Maze = require("../Maze");

var _Player = require("../models/Player");

var _Player2 = _interopRequireDefault(_Player);

var _UpgradeConstants = require("../upgrades/UpgradeConstants");

var _MazeGenerator = require("../MazeGenerator");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PlayerManager = function () {
    function PlayerManager(game) {
        _classCallCheck(this, PlayerManager);

        this.game = game;
        this.playerMap = new Map();
    }

    _createClass(PlayerManager, [{
        key: "resetAllPlayers",
        value: function resetAllPlayers() {
            this.playerMap.clear();
        }
    }, {
        key: "createDefaultPlayer",
        value: function createDefaultPlayer() {
            this.createNewPlayerObj(_Maze.STARTING_POSITION);
        }
    }, {
        key: "createNewPlayerObj",
        value: function createNewPlayerObj(startTile) {
            var isPrimaryBot = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            var newPlayer = new _Player2.default(this.game, this.getNewPlayerId(), startTile, startTile, false, isPrimaryBot);
            this.playerMap.set(newPlayer.id, newPlayer);
            this.game.maze.updatePlayerTile(newPlayer.id, startTile);
            return newPlayer;
        }
    }, {
        key: "getManuallyControlledPlayer",
        value: function getManuallyControlledPlayer() {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.playerMap[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _step$value = _slicedToArray(_step.value, 2),
                        id = _step$value[0],
                        player = _step$value[1];

                    if (player.isManuallyControlled) {
                        return player;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return null;
        }
    }, {
        key: "getIsPlayerManuallyControlling",
        value: function getIsPlayerManuallyControlling() {
            return this.getManuallyControlledPlayer() == null ? false : true;
        }
    }, {
        key: "getPlayerCount",
        value: function getPlayerCount() {
            var isExcludeManualControl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            // If manual controlling, don't count
            return this.playerMap.size - (isExcludeManualControl && this.getIsPlayerManuallyControlling() ? 1 : 0);
        }
    }, {
        key: "isPrimaryBotPresent",
        value: function isPrimaryBotPresent() {
            return this.getPrimaryBot() == null ? false : true;
        }
    }, {
        key: "getPrimaryBot",
        value: function getPrimaryBot() {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.playerMap[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var _step2$value = _slicedToArray(_step2.value, 2),
                        id = _step2$value[0],
                        player = _step2$value[1];

                    if (player.isPrimaryBot) {
                        return player;
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            return null;
        }
    }, {
        key: "movePlayer",
        value: function movePlayer(playerId, dirVector) {
            var isManual = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            var player = this.getPlayer(playerId);
            if (player == null) return;
            if (!this.game.maze.canMove(player.currTile, dirVector)) {
                // Bots that get stuck in deadends.
                if (!isManual) {
                    this.game.players.deletePlayer(playerId);
                }
                return;
            }
            // Disable auto-move on current player
            player.isManuallyControlled = isManual;
            player.moveCount++;
            player.reduceSmartPathingDistance();
            // Reset timer for auto-moves
            if (isManual) {
                // Spawn new bot unless it exists already.
                if (this.game.upgrades.isUpgraded(_UpgradeConstants.UpgradeKey.PLAYER_MOVE_INDEPENDENTLY)) {
                    if (!this.isPrimaryBotPresent()) {
                        this.createNewPlayerObj(this.getCurrTile(playerId), true);
                    }
                    // If independence upgraded, don't re-enable the timer to have a bot take over.
                    this.game.rngBot.disableReEnableBotMovementTimer();
                } else {
                    // Only set the movement timer if independent movement disabled.
                    this.game.rngBot.enableReEnableBotMovementTimer();
                }
            }
            this.game.maze.updatePlayerTileByTileVector(playerId, dirVector);
        }
    }, {
        key: "getPlayerIdList",
        value: function getPlayerIdList() {
            var playerIdArr = [];
            this.playerMap.forEach(function (player) {
                playerIdArr.push(player.id);
            });
            return playerIdArr;
        }
    }, {
        key: "getPlayerIdsAtTile",
        value: function getPlayerIdsAtTile(tile) {
            var playerIdList = [];
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this.playerMap[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var _step3$value = _slicedToArray(_step3.value, 2),
                        id = _step3$value[0],
                        player = _step3$value[1];

                    if ((0, _MazeGenerator.isTileEqual)(tile, player.currTile)) {
                        playerIdList.push(player.id);
                    }
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            return playerIdList;
        }
    }, {
        key: "getNewPlayerId",
        value: function getNewPlayerId() {
            for (var i = 0;; i++) {
                if (!this.playerMap.has(i)) return i;
            }
        }
    }, {
        key: "deletePlayer",
        value: function deletePlayer(playerId) {
            if (!this.playerMap.has(playerId)) return;
            var player = this.getPlayer(playerId);
            var currTile = player.currTile;
            this.playerMap.delete(playerId);
            // There must always be a primary bot.  Re-assign at random if primary bot deleted.
            if (player.isPrimaryBot) {
                this.assignPrimaryBotToPlayer();
            }
            this.game.maze.setTileBackgroundColor(currTile, true);
        }
        // Try to assign a new primary bot based on ID.  Else, pick first bot.

    }, {
        key: "assignPrimaryBotToPlayer",
        value: function assignPrimaryBotToPlayer() {
            var playerId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = this.playerMap[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var _step4$value = _slicedToArray(_step4.value, 2),
                        id = _step4$value[0],
                        player = _step4$value[1];

                    if (playerId == null && !player.isManuallyControlled) {
                        player.isPrimaryBot = true;
                        return;
                    }
                    if (player.id === playerId) {
                        player.isPrimaryBot = true;
                        return;
                    }
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }
        }
    }, {
        key: "getPlayer",
        value: function getPlayer(playerId) {
            if (!this.playerMap.has(playerId)) return null;
            return this.playerMap.get(playerId);
        }
    }, {
        key: "getPlayerColorAtTile",
        value: function getPlayerColorAtTile(tile) {
            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = this.playerMap[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var _step5$value = _slicedToArray(_step5.value, 2),
                        id = _step5$value[0],
                        player = _step5$value[1];

                    if ((0, _MazeGenerator.isTileEqual)(tile, player.currTile)) {
                        if (player.isManuallyControlled) {
                            return _MazeGenerator.PLAYER_COLOR;
                        } else if (player.hasSmartPathingRemaining()) {
                            return _MazeGenerator.SMART_PATHING_PLAYER_COLOR;
                        } else {
                            return _MazeGenerator.RNG_BOT_COLOR;
                        }
                    }
                }
            } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion5 && _iterator5.return) {
                        _iterator5.return();
                    }
                } finally {
                    if (_didIteratorError5) {
                        throw _iteratorError5;
                    }
                }
            }

            return null;
        }
    }, {
        key: "isOccupiedByPlayer",
        value: function isOccupiedByPlayer(tile) {
            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
                for (var _iterator6 = this.playerMap[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                    var _step6$value = _slicedToArray(_step6.value, 2),
                        id = _step6$value[0],
                        player = _step6$value[1];

                    if ((0, _MazeGenerator.isTileEqual)(tile, player.currTile)) {
                        return true;
                    }
                }
            } catch (err) {
                _didIteratorError6 = true;
                _iteratorError6 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion6 && _iterator6.return) {
                        _iterator6.return();
                    }
                } finally {
                    if (_didIteratorError6) {
                        throw _iteratorError6;
                    }
                }
            }

            return false;
        }
    }, {
        key: "getPreviousTile",
        value: function getPreviousTile(playerId) {
            if (!this.playerMap.has(playerId)) return null;
            return this.getPlayer(playerId).prevTile;
        }
    }, {
        key: "getCurrTile",
        value: function getCurrTile(playerId) {
            if (!this.playerMap.has(playerId)) return null;
            return this.getPlayer(playerId).currTile;
        }
    }, {
        key: "playerExists",
        value: function playerExists(playerId) {
            return this.playerMap.has(playerId);
        }
    }, {
        key: "playerHasSmartPathing",
        value: function playerHasSmartPathing(playerId) {
            return this.game.players.getPlayer(playerId).smartPathingTileDistanceRemaining > 0;
        }
    }]);

    return PlayerManager;
}();

exports.default = PlayerManager;

},{"../Maze":2,"../MazeGenerator":3,"../models/Player":17,"../upgrades/UpgradeConstants":20}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _devUtils = require("../dev/devUtils");

var _UpgradeConstants = require("../upgrades/UpgradeConstants");

var _Serializable2 = require("../models/Serializable");

var _Serializable3 = _interopRequireDefault(_Serializable2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SERIALIZABLE_PROPERTIES = ['points'];

var Points = function (_Serializable) {
    _inherits(Points, _Serializable);

    function Points(game) {
        var isDevMode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        _classCallCheck(this, Points);

        var _this = _possibleConstructorReturn(this, (Points.__proto__ || Object.getPrototypeOf(Points)).call(this, SERIALIZABLE_PROPERTIES));

        _this.game = game;
        _this.isDevMode = isDevMode;
        _this.points = 0.0;
        return _this;
    }

    _createClass(Points, [{
        key: "addPoints",
        value: function addPoints(amount) {
            this.points += amount;
            this.totalPoints += amount;
            this.game.ui.setPointsText();
        }
    }, {
        key: "canAffordPointsAmount",
        value: function canAffordPointsAmount(cost) {
            if (_devUtils.IS_FREE_MODE_ENABLED) return true;
            return cost <= this.points;
        }
    }, {
        key: "getPointsPerVisit",
        value: function getPointsPerVisit(isVisitedAlready) {
            var upgradeLevel = this.game.upgrades.getUpgradeLevel(_UpgradeConstants.UpgradeKey.POINTS_PER_VISIT);
            var bonus = Math.round(100 * _UpgradeConstants.POINTS_PER_VISIT_BASE_AMOUNT * Math.pow(_UpgradeConstants.POINTS_PER_VISIT_BASE_AMOUNT_MULTIPLIER, upgradeLevel)) / 100;
            if (isVisitedAlready) {
                bonus *= _UpgradeConstants.TILE_REVISIT_MULTIPLIER;
            }
            return bonus;
        }
    }, {
        key: "addVisitPoints",
        value: function addVisitPoints(isVisitedAlready) {
            var points = this.getPointsPerVisit(isVisitedAlready);
            this.addPoints(points);
        }
    }, {
        key: "addMazeCompletionBonus",
        value: function addMazeCompletionBonus() {
            var bonus = this.getMazeCompletionBonus();
            this.addPoints(bonus);
        }
        //TODO: move these as static functions in the upgrade class.

    }, {
        key: "getMazeCompletionBonus",
        value: function getMazeCompletionBonus() {
            var tileCount = this.game.maze.getTileCount();
            var upgradeLevel = this.game.upgrades.getUpgradeLevel(_UpgradeConstants.UpgradeKey.MAZE_COMPLETION_BONUS);
            return tileCount * (1 + _UpgradeConstants.MAZE_COMPLETION_BONUS_BASE_MULTIPLIER * upgradeLevel);
        }
    }, {
        key: "getDestructibleWallSpawnProbability",
        value: function getDestructibleWallSpawnProbability() {
            if (!this.game.upgrades.isUnlocked(_UpgradeConstants.UpgradeKey.DESTRUCTIBLE_WALLS)) {
                return 0;
            }
            return 0.05;
        }
    }]);

    return Points;
}(_Serializable3.default);

exports.default = Points;

},{"../dev/devUtils":5,"../models/Serializable":18,"../upgrades/UpgradeConstants":20}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _UpgradeConstants = require("../upgrades/UpgradeConstants");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BASE_MOVEMENT_SPEED = 1000;
var BASE_MOVEMENT_REDUCTION = 0.98;
var AUTO_RE_ENABLE_RNG_BOT_TIMER = 3000;
var DEV_MODE_MOVEMENT_SPEED = 1;

var RNGBotManager = function () {
    function RNGBotManager(game, isDevMode) {
        _classCallCheck(this, RNGBotManager);

        this.getRandomInt = function (max) {
            return Math.floor(Math.random() * Math.floor(max));
        };
        this.getRandomXValues = function (arr, pickX) {
            return _.sampleSize(arr, pickX);
        };
        this.game = game;
        this.isDevMode = isDevMode;
        this.rngBotGlobalInterval = null;
        this.rngBotReEnableMovementTimer = null;
    }

    _createClass(RNGBotManager, [{
        key: "enableGlobalRngBot",
        value: function enableGlobalRngBot() {
            var _this = this;

            var upgradeSpeed = this.game.upgrades.getUpgradeLevel(_UpgradeConstants.UpgradeKey.BOT_MOVEMENT_SPEED);
            clearInterval(this.rngBotGlobalInterval);
            this.rngBotGlobalInterval = setInterval(function () {
                // Move each player.
                _this.game.players.getPlayerIdList().forEach(function (playerId) {
                    var player = _this.game.players.getPlayer(playerId);
                    if (player == null || player.isManuallyControlled) return;
                    _this.moveRandomly(playerId);
                });
                // Reset the interval with the new time interval
                if (upgradeSpeed !== _this.game.upgrades.getUpgradeLevel(_UpgradeConstants.UpgradeKey.BOT_MOVEMENT_SPEED)) {
                    _this.disableGlobalRngBot();
                    _this.enableGlobalRngBot();
                }
            }, this.getBotMoveInterval(this.isDevMode));
        }
    }, {
        key: "getBotMoveInterval",
        value: function getBotMoveInterval() {
            var isDevMode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            if (isDevMode) return DEV_MODE_MOVEMENT_SPEED;
            return BASE_MOVEMENT_SPEED * Math.pow(BASE_MOVEMENT_REDUCTION, this.game.upgrades.getUpgradeLevel(_UpgradeConstants.UpgradeKey.BOT_MOVEMENT_SPEED));
        }
    }, {
        key: "disableGlobalRngBot",
        value: function disableGlobalRngBot() {
            clearInterval(this.rngBotGlobalInterval);
            this.rngBotGlobalInterval = null;
            clearInterval(this.rngBotReEnableMovementTimer);
            this.rngBotReEnableMovementTimer = null;
        }
        // After a short delay, manually controlled bots will start moving again.

    }, {
        key: "enableReEnableBotMovementTimer",
        value: function enableReEnableBotMovementTimer() {
            var _this2 = this;

            this.disableReEnableBotMovementTimer();
            //TODO: this might be better handled within the player class.
            this.rngBotReEnableMovementTimer = setTimeout(function () {
                var player = _this2.game.players.getManuallyControlledPlayer();
                if (!player) return;
                player.isManuallyControlled = false;
                _this2.disableReEnableBotMovementTimer();
            }, AUTO_RE_ENABLE_RNG_BOT_TIMER);
        }
    }, {
        key: "disableReEnableBotMovementTimer",
        value: function disableReEnableBotMovementTimer() {
            clearTimeout(this.rngBotReEnableMovementTimer);
            this.rngBotReEnableMovementTimer = null;
        }
    }, {
        key: "disableGlobalMovement",
        value: function disableGlobalMovement() {
            clearInterval(this.rngBotGlobalInterval);
            this.rngBotGlobalInterval = null;
        }
    }, {
        key: "moveRandomly",
        value: function moveRandomly(playerId) {
            if (!this.game.players.playerExists(playerId)) return;
            var dirArr = this.chooseRandomDirectionsArr(playerId);
            if (!dirArr || dirArr.length === 0) {
                return;
            }
            if (dirArr.length === 1) {
                this.game.players.movePlayer(playerId, dirArr[0]);
            } else {
                this.game.maze.spawnSplitBot(playerId, dirArr);
            }
        }
    }, {
        key: "chooseRandomDirectionsArr",
        value: function chooseRandomDirectionsArr(playerId) {
            var validDirs = this.getPossibleDirectionsList(playerId);
            if (!validDirs) {
                return null;
            }
            var possibleNewSplits = this.game.maze.getPossibleSplitBotCount(validDirs);
            // Only split if both directions are unvisited.
            var unvisitedDirs = this.game.upgrades.isUpgraded(_UpgradeConstants.UpgradeKey.PRIORITIZE_UNVISITED) ? this.game.maze.prioritizeUnvisitedDirection(playerId, validDirs) : validDirs;
            // Must have at least two possible directions and one split available.
            if (possibleNewSplits >= 1 && unvisitedDirs.length >= 2) {
                var numDirectionsToPick = Math.min(possibleNewSplits + 1, unvisitedDirs.length);
                return this.getRandomXValues(validDirs, numDirectionsToPick);
            }
            // Randomly pick one.
            var randDirIndex = this.getRandomInt(validDirs.length);
            return [validDirs[randDirIndex]];
        }
    }, {
        key: "getPossibleDirectionsList",
        value: function getPossibleDirectionsList(playerId) {
            var validDirs = this.game.maze.getValidDirectionsByPlayerId(playerId);
            if (validDirs.length === 0) {
                return;
            }
            if (this.game.upgrades.isUpgraded(_UpgradeConstants.UpgradeKey.AUTO_EXIT_MAZE) || this.game.players.playerHasSmartPathing(playerId)) {
                var exitDirsArr = this.game.maze.filterPlayerExitMazeDirection(playerId, validDirs);
                if (exitDirsArr.length > 0) {
                    return exitDirsArr;
                }
            }
            // Remove all dead end tiles from possible directions.
            if (this.game.upgrades.getUpgradeLevel(_UpgradeConstants.UpgradeKey.BOT_REMEMBER_DEADEND_TILES) >= 1) {
                validDirs = this.game.maze.filterDeadEndTiles(playerId, validDirs);
            }
            // Prioritize any adjacent unvisited tiles if any.
            if (this.game.upgrades.isUpgraded(_UpgradeConstants.UpgradeKey.PRIORITIZE_UNVISITED)) {
                var unvisitedDirsArr = this.game.maze.prioritizeUnvisitedDirection(playerId, validDirs);
                if (unvisitedDirsArr.length > 0) {
                    return unvisitedDirsArr;
                }
            }
            // Avoid revisiting the last position if possible.
            if (this.game.upgrades.isUpgraded(_UpgradeConstants.UpgradeKey.AVOID_REVISIT_LAST_POSITION)) {
                var noRevisitDirs = this.game.maze.filterAvoidRevisitLastPosition(playerId, validDirs);
                if (noRevisitDirs.length > 0) {
                    return noRevisitDirs;
                }
            }
            // No fancy moves, just choose random ones.
            return validDirs;
        }
    }]);

    return RNGBotManager;
}();

exports.default = RNGBotManager;

},{"../upgrades/UpgradeConstants":20}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SAVE_GAME_INTERVAL = 10000;
var SAVE_GAME_LOCAL_STORE_KEY = 'a-mazing-idle';

var SaveManager = function () {
    function SaveManager(game) {
        var _this = this;

        _classCallCheck(this, SaveManager);

        this.createSaveJsonObject = function () {
            var gamePropList = _this.game.getSerializablePropertyList();
            var gameJson = {};
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = gamePropList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var gameProp = _step.value;

                    gameJson[gameProp] = _this.game[gameProp].serialize();
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return gameJson;
        };
        this.importSaveJsonObject = function (jsonObj) {
            for (var gameProp in jsonObj) {
                _this.game[gameProp].deserialize(jsonObj[gameProp]);
            }
        };
        this.game = game;
        this.saveInterval = null;
    }

    _createClass(SaveManager, [{
        key: 'startSaveTimer',
        value: function startSaveTimer() {
            var _this2 = this;

            this.disableSaveTimer();
            this.saveInterval = setInterval(function () {
                _this2.saveGameToLocalStorage();
            }, SAVE_GAME_INTERVAL);
        }
    }, {
        key: 'disableSaveTimer',
        value: function disableSaveTimer() {
            clearInterval(this.saveInterval);
            this.saveInterval = null;
        }
    }, {
        key: 'saveGameToLocalStorage',
        value: function saveGameToLocalStorage() {
            var saveJson = this.createSaveJsonObject();
            this.persistSaveToLocalStorage(saveJson);
        }
    }, {
        key: 'loadGameSaveFromLocalStorage',
        value: function loadGameSaveFromLocalStorage() {
            var gameObj = this.getSaveJsonFromLocalStorage();
            if (!gameObj) return;
            this.importSaveJsonObject(gameObj);
        }
    }, {
        key: 'persistSaveToLocalStorage',
        value: function persistSaveToLocalStorage(jsonObj) {
            var jsonString = JSON.stringify(jsonObj);
            localStorage.setItem(SAVE_GAME_LOCAL_STORE_KEY, jsonString);
        }
    }, {
        key: 'getSaveJsonFromLocalStorage',
        value: function getSaveJsonFromLocalStorage() {
            var json = localStorage.getItem(SAVE_GAME_LOCAL_STORE_KEY);
            if (json === null || json === "") {
                return null;
            }
            try {
                return JSON.parse(json);
            } catch (e) {
                console.error('Failed to parse local game save.  Error: ' + e.message + '.  \n\nLocal Save Json: json');
                return null;
            }
        }
    }, {
        key: 'clearLocalStorage',
        value: function clearLocalStorage() {
            localStorage.clear();
        }
    }]);

    return SaveManager;
}();

exports.default = SaveManager;

},{}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _AvoidRevisitLastPositionUpgrade = require("../upgrades/definitions/AvoidRevisitLastPositionUpgrade");

var _AvoidRevisitLastPositionUpgrade2 = _interopRequireDefault(_AvoidRevisitLastPositionUpgrade);

var _PrioritizeUnvisitedUpgrade = require("../upgrades/definitions/PrioritizeUnvisitedUpgrade");

var _PrioritizeUnvisitedUpgrade2 = _interopRequireDefault(_PrioritizeUnvisitedUpgrade);

var _AutoExitMazeUpgrade = require("../upgrades/definitions/AutoExitMazeUpgrade");

var _AutoExitMazeUpgrade2 = _interopRequireDefault(_AutoExitMazeUpgrade);

var _PlayerMoveIndependentlyUpgrade = require("../upgrades/definitions/PlayerMoveIndependentlyUpgrade");

var _PlayerMoveIndependentlyUpgrade2 = _interopRequireDefault(_PlayerMoveIndependentlyUpgrade);

var _TeleportPlayerBacktoBotUpgrade = require("../upgrades/definitions/TeleportPlayerBacktoBotUpgrade");

var _TeleportPlayerBacktoBotUpgrade2 = _interopRequireDefault(_TeleportPlayerBacktoBotUpgrade);

var _TeleportBotBackToPlayerUpgrade = require("../upgrades/definitions/TeleportBotBackToPlayerUpgrade");

var _TeleportBotBackToPlayerUpgrade2 = _interopRequireDefault(_TeleportBotBackToPlayerUpgrade);

var _FruitPickupPointsMultiplierUpgrade = require("../upgrades/definitions/FruitPickupPointsMultiplierUpgrade");

var _FruitPickupPointsMultiplierUpgrade2 = _interopRequireDefault(_FruitPickupPointsMultiplierUpgrade);

var _FruitSpawnRateUpgrade = require("../upgrades/definitions/FruitSpawnRateUpgrade");

var _FruitSpawnRateUpgrade2 = _interopRequireDefault(_FruitSpawnRateUpgrade);

var _BrainSpawnRateUpgrade = require("../upgrades/definitions/BrainSpawnRateUpgrade");

var _BrainSpawnRateUpgrade2 = _interopRequireDefault(_BrainSpawnRateUpgrade);

var _BotRememberDeadEndsUpgrade = require("../upgrades/definitions/BotRememberDeadEndsUpgrade");

var _BotRememberDeadEndsUpgrade2 = _interopRequireDefault(_BotRememberDeadEndsUpgrade);

var _MazeCompletionBonusUpgrade = require("../upgrades/definitions/MazeCompletionBonusUpgrade");

var _MazeCompletionBonusUpgrade2 = _interopRequireDefault(_MazeCompletionBonusUpgrade);

var _BotMovementSpeedUpgrade = require("../upgrades/definitions/BotMovementSpeedUpgrade");

var _BotMovementSpeedUpgrade2 = _interopRequireDefault(_BotMovementSpeedUpgrade);

var _PointsPerVisitUpgrade = require("../upgrades/definitions/PointsPerVisitUpgrade");

var _PointsPerVisitUpgrade2 = _interopRequireDefault(_PointsPerVisitUpgrade);

var _MazeSizeUpgrade = require("../upgrades/definitions/MazeSizeUpgrade");

var _MazeSizeUpgrade2 = _interopRequireDefault(_MazeSizeUpgrade);

var _BotSplitDirectionUpgrade = require("../upgrades/definitions/BotSplitDirectionUpgrade");

var _BotSplitDirectionUpgrade2 = _interopRequireDefault(_BotSplitDirectionUpgrade);

var _BotSplitAutoMergeUpgrade = require("../upgrades/definitions/BotSplitAutoMergeUpgrade");

var _BotSplitAutoMergeUpgrade2 = _interopRequireDefault(_BotSplitAutoMergeUpgrade);

var _DestructibleWallUpgrade = require("../upgrades/definitions/DestructibleWallUpgrade");

var _DestructibleWallUpgrade2 = _interopRequireDefault(_DestructibleWallUpgrade);

var _UpgradeConstants = require("../upgrades/UpgradeConstants");

var _Serializable2 = require("../models/Serializable");

var _Serializable3 = _interopRequireDefault(_Serializable2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SERIALIZABLE_PROPERTIES = ['upgradeMap'];

var UpgradeManager = function (_Serializable) {
    _inherits(UpgradeManager, _Serializable);

    function UpgradeManager(game) {
        _classCallCheck(this, UpgradeManager);

        var _this = _possibleConstructorReturn(this, (UpgradeManager.__proto__ || Object.getPrototypeOf(UpgradeManager)).call(this, SERIALIZABLE_PROPERTIES));

        _this.game = game;
        _this.resetUpgrades();
        return _this;
    }

    _createClass(UpgradeManager, [{
        key: "resetUpgrades",
        value: function resetUpgrades() {
            this.upgradeMap = new Map();
            this.createUpgrade(new _AutoExitMazeUpgrade2.default(this.game, _UpgradeConstants.UpgradeKey.AUTO_EXIT_MAZE));
            this.createUpgrade(new _AvoidRevisitLastPositionUpgrade2.default(this.game, _UpgradeConstants.UpgradeKey.AVOID_REVISIT_LAST_POSITION));
            this.createUpgrade(new _BotMovementSpeedUpgrade2.default(this.game, _UpgradeConstants.UpgradeKey.BOT_MOVEMENT_SPEED));
            this.createUpgrade(new _BotSplitAutoMergeUpgrade2.default(this.game, _UpgradeConstants.UpgradeKey.BOT_SPLIT_BOT_AUTO_MERGE));
            this.createUpgrade(new _BotSplitDirectionUpgrade2.default(this.game, _UpgradeConstants.UpgradeKey.BOT_SPLIT_DIRECTION));
            this.createUpgrade(new _BotRememberDeadEndsUpgrade2.default(this.game, _UpgradeConstants.UpgradeKey.BOT_REMEMBER_DEADEND_TILES));
            this.createUpgrade(new _FruitPickupPointsMultiplierUpgrade2.default(this.game, _UpgradeConstants.UpgradeKey.FRUIT_PICKUP_POINTS));
            this.createUpgrade(new _FruitSpawnRateUpgrade2.default(this.game, _UpgradeConstants.UpgradeKey.FRUIT_SPAWN));
            this.createUpgrade(new _BrainSpawnRateUpgrade2.default(this.game, _UpgradeConstants.UpgradeKey.BRAIN_SPAWN));
            this.createUpgrade(new _MazeCompletionBonusUpgrade2.default(this.game, _UpgradeConstants.UpgradeKey.MAZE_COMPLETION_BONUS));
            this.createUpgrade(new _MazeSizeUpgrade2.default(this.game, _UpgradeConstants.UpgradeKey.MAZE_SIZE_UPGRADE));
            this.createUpgrade(new _PlayerMoveIndependentlyUpgrade2.default(this.game, _UpgradeConstants.UpgradeKey.PLAYER_MOVE_INDEPENDENTLY));
            this.createUpgrade(new _PointsPerVisitUpgrade2.default(this.game, _UpgradeConstants.UpgradeKey.POINTS_PER_VISIT));
            this.createUpgrade(new _PrioritizeUnvisitedUpgrade2.default(this.game, _UpgradeConstants.UpgradeKey.PRIORITIZE_UNVISITED));
            this.createUpgrade(new _TeleportPlayerBacktoBotUpgrade2.default(this.game, _UpgradeConstants.UpgradeKey.TELEPORT_PLAYER_BACK_TO_BOT));
            this.createUpgrade(new _TeleportBotBackToPlayerUpgrade2.default(this.game, _UpgradeConstants.UpgradeKey.TELEPORT_BOT_BACK_TO_PLAYER));
            // Features
            this.createUpgrade(new _DestructibleWallUpgrade2.default(this.game, _UpgradeConstants.UpgradeKey.DESTRUCTIBLE_WALLS));
        }
    }, {
        key: "updateAllUpgradeUi",
        value: function updateAllUpgradeUi() {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.upgradeMap[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _step$value = _slicedToArray(_step.value, 2),
                        upgradeKey = _step$value[0],
                        val = _step$value[1];

                    val.updateUiProperties();
                    val.updateUiDisabled();
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }, {
        key: "createUpgrade",
        value: function createUpgrade(upgrade) {
            upgrade.upgradeLevel = this.getInitialUpgradeLevel(upgrade.upgradeKey);
            this.upgradeMap.set(upgrade.upgradeKey, upgrade);
        }
    }, {
        key: "getUpgrade",
        value: function getUpgrade(upgradeKey) {
            if (!this.upgradeMap.has(upgradeKey)) {
                throw "Unexpected upgrade key found: " + upgradeKey;
            }
            return this.upgradeMap.get(upgradeKey);
        }
    }, {
        key: "getInitialUpgradeLevel",
        value: function getInitialUpgradeLevel(upgradeKey) {
            //TODO: use for saving.
            return 0;
        }
    }, {
        key: "getUpgradeLevel",
        value: function getUpgradeLevel(upgradeKey) {
            return this.getUpgrade(upgradeKey).upgradeLevel;
        }
    }, {
        key: "isUpgraded",
        value: function isUpgraded(upgradeKey) {
            return this.getUpgrade(upgradeKey).getIsUpgraded();
        }
    }, {
        key: "serializeProperty",
        value: function serializeProperty(property) {
            // Upgrade map will export the upgrade level of each key
            if (property === 'upgradeMap') {
                var obj = {};
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = this.upgradeMap[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var _step2$value = _slicedToArray(_step2.value, 2),
                            k = _step2$value[0],
                            v = _step2$value[1];

                        obj[k] = v.upgradeLevel;
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }

                return obj;
            } else {
                return _get(UpgradeManager.prototype.__proto__ || Object.getPrototypeOf(UpgradeManager.prototype), "serializeProperty", this).call(this, property);
            }
        }
    }, {
        key: "deserializeProperty",
        value: function deserializeProperty(property, value) {
            // Upgrade map will restore the upgrade level of each key
            if (property === 'upgradeMap') {
                for (var upgradeKey in value) {
                    this.upgradeMap.get(upgradeKey).upgradeLevel = parseInt(value[upgradeKey]);
                }
            } else {
                return _get(UpgradeManager.prototype.__proto__ || Object.getPrototypeOf(UpgradeManager.prototype), "deserializeProperty", this).call(this, property, value);
            }
        }
    }, {
        key: "isUnlocked",
        value: function isUnlocked(upgradeKey) {
            return this.upgradeMap.get(upgradeKey).isUnlocked();
        }
    }]);

    return UpgradeManager;
}(_Serializable3.default);

exports.default = UpgradeManager;

},{"../models/Serializable":18,"../upgrades/UpgradeConstants":20,"../upgrades/definitions/AutoExitMazeUpgrade":21,"../upgrades/definitions/AvoidRevisitLastPositionUpgrade":22,"../upgrades/definitions/BotMovementSpeedUpgrade":23,"../upgrades/definitions/BotRememberDeadEndsUpgrade":24,"../upgrades/definitions/BotSplitAutoMergeUpgrade":25,"../upgrades/definitions/BotSplitDirectionUpgrade":26,"../upgrades/definitions/BrainSpawnRateUpgrade":27,"../upgrades/definitions/DestructibleWallUpgrade":28,"../upgrades/definitions/FruitPickupPointsMultiplierUpgrade":29,"../upgrades/definitions/FruitSpawnRateUpgrade":30,"../upgrades/definitions/MazeCompletionBonusUpgrade":31,"../upgrades/definitions/MazeSizeUpgrade":32,"../upgrades/definitions/PlayerMoveIndependentlyUpgrade":33,"../upgrades/definitions/PointsPerVisitUpgrade":34,"../upgrades/definitions/PrioritizeUnvisitedUpgrade":35,"../upgrades/definitions/TeleportBotBackToPlayerUpgrade":36,"../upgrades/definitions/TeleportPlayerBacktoBotUpgrade":37}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Player = function () {
    function Player(game, id) {
        var currTile = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        var prevTile = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
        var isManuallyControlled = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
        var isPrimaryBot = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
        var moveCount = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
        var smartPathingTileDistanceRemaining = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 0;

        _classCallCheck(this, Player);

        this.game = game;
        this.isManuallyControlled = isManuallyControlled;
        this.id = id;
        this.currTile = currTile;
        this.prevTile = prevTile;
        this.moveCount = moveCount;
        this.isPrimaryBot = isPrimaryBot;
        this.smartPathingTileDistanceRemaining = smartPathingTileDistanceRemaining;
    }

    _createClass(Player, [{
        key: "hasSmartPathingRemaining",
        value: function hasSmartPathingRemaining() {
            return this.smartPathingTileDistanceRemaining > 0;
        }
    }, {
        key: "reduceSmartPathingDistance",
        value: function reduceSmartPathingDistance() {
            var distance = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

            this.smartPathingTileDistanceRemaining = Math.max(0, this.smartPathingTileDistanceRemaining - distance);
        }
    }]);

    return Player;
}();

exports.default = Player;

},{}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Serializable = function () {
    function Serializable(serializablePropertyList) {
        _classCallCheck(this, Serializable);

        this.serializablePropertyList = [];
        this.serializablePropertyList = serializablePropertyList;
    }

    _createClass(Serializable, [{
        key: "getSerializablePropertyList",
        value: function getSerializablePropertyList() {
            return this.serializablePropertyList;
        }
    }, {
        key: "serializeProperty",
        value: function serializeProperty(property) {
            return this[property];
        }
    }, {
        key: "deserializeProperty",
        value: function deserializeProperty(property, value) {
            this[property] = value;
        }
    }, {
        key: "serialize",
        value: function serialize() {
            var gamePropList = this.getSerializablePropertyList();
            var jsonObj = {};
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = gamePropList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var prop = _step.value;

                    jsonObj[prop] = this.serializeProperty(prop);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return jsonObj;
        }
    }, {
        key: "deserialize",
        value: function deserialize(jsonObj) {
            for (var prop in jsonObj) {
                this.deserializeProperty(prop, jsonObj[prop]);
            }
        }
    }]);

    return Serializable;
}();

exports.default = Serializable;

},{}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _devUtils = require('../dev/devUtils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Upgrade = function () {
    function Upgrade(game, uiId) {
        var tooltipText = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
        var upgradeKey = arguments[3];

        var _this = this;

        var upgradeCount = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
        var isSinglePurchase = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;

        _classCallCheck(this, Upgrade);

        this.isSinglePurchase = false;
        this.buyUpgrade = function () {
            if (!_this.canAffordToBuyUpgrade()) {
                console.error('Cannot afford to buy.');
                return;
            }
            _this.game.points.addPoints(-_this.getCost());
            _this.upgradeLevel++;
            _this.updateUiProperties();
            _this.updateUiDisabled();
        };
        this.game = game;
        this.upgradeKey = upgradeKey;
        this.uiId = uiId;
        this.tooptipText = tooltipText;
        this.upgradeLevel = upgradeCount;
        this.isSinglePurchase = isSinglePurchase;
        this.updateUiProperties();
        this.updateUiDisabled();
        this.initClickEvent();
    }

    _createClass(Upgrade, [{
        key: 'getIsUpgraded',
        value: function getIsUpgraded() {
            return this.upgradeLevel >= 1;
        }
    }, {
        key: 'canAffordToBuyUpgrade',
        value: function canAffordToBuyUpgrade() {
            return _devUtils.IS_FREE_MODE_ENABLED || this.getCost() <= this.game.points.points;
        }
    }, {
        key: 'setUiText',
        value: function setUiText(text) {
            $('#' + this.uiId).attr('title', this.tooptipText);
            $('#' + this.uiId).text(text);
        }
    }, {
        key: 'updateUiDisabled',
        value: function updateUiDisabled() {
            $('#' + this.uiId).prop("disabled", this.isDisabled());
        }
    }, {
        key: 'initClickEvent',
        value: function initClickEvent() {
            var _this2 = this;

            $('#' + this.uiId).click(function () {
                return _this2.buyUpgrade();
            });
        }
    }, {
        key: 'isDisabled',
        value: function isDisabled() {
            return this.isSinglePurchase && this.upgradeLevel >= 1;
        }
    }, {
        key: 'updateUiProperties',
        value: function updateUiProperties() {
            throw 'updateUiProperties must be implemented.';
        }
    }, {
        key: 'getCost',
        value: function getCost() {
            throw 'getCost must be implemented.';
        }
    }, {
        key: 'isUnlocked',
        value: function isUnlocked() {
            return true;
        }
    }]);

    return Upgrade;
}();

exports.default = Upgrade;

},{"../dev/devUtils":5}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var UpgradeKey = exports.UpgradeKey = undefined;
(function (UpgradeKey) {
    UpgradeKey["PRIORITIZE_UNVISITED"] = "PRIORITIZE_UNVISITED";
    UpgradeKey["AVOID_REVISIT_LAST_POSITION"] = "AVOID_REVISIT_LAST_POSITION";
    UpgradeKey["AUTO_EXIT_MAZE"] = "AUTO_EXIT_MAZE";
    UpgradeKey["PLAYER_MOVE_INDEPENDENTLY"] = "ALLOW_PLAYER_TO_MOVE_INDEPENDENTLY";
    UpgradeKey["TELEPORT_BOT_BACK_TO_PLAYER"] = "TELEPORT_BOT_BACK_TO_PLAYER";
    UpgradeKey["TELEPORT_PLAYER_BACK_TO_BOT"] = "TELEPORT_BOT_BACK_TO_PLAYER";
    UpgradeKey["BOT_SPLIT_DIRECTION"] = "BOT_SPLIT_DIRECTION";
    UpgradeKey["BOT_SPLIT_BOT_AUTO_MERGE"] = "BOT_SPLIT_BOT_AUTO_MERGE";
    UpgradeKey["TILE_REVISIT_MULTIPLIER"] = "TILE_REVISIT_MULTIPLIER";
    UpgradeKey["MAZE_COMPLETION_BONUS"] = "MAZE_COMPLETION_BONUS";
    UpgradeKey["BOT_MOVEMENT_SPEED"] = "BOT_MOVEMENT_SPEED";
    UpgradeKey["BOT_REMEMBER_DEADEND_TILES"] = "BOT_REMEMBER_DEADEND_TILES";
    UpgradeKey["MAZE_SIZE_UPGRADE"] = "MAZE_SIZE_UPGRADE";
    UpgradeKey["POINTS_PER_VISIT"] = "POINTS_PER_VISIT";
    UpgradeKey["FRUIT_SPAWN"] = "FRUIT_SPAWN";
    UpgradeKey["BRAIN_SPAWN"] = "BRAIN_SPAWN";
    UpgradeKey["FRUIT_PICKUP_POINTS"] = "FRUIT_PICKUP_POINTS";
    // "Feature" Upgrades
    UpgradeKey["DESTRUCTIBLE_WALLS"] = "DESTRUCTIBLE WALLS";
})(UpgradeKey || (exports.UpgradeKey = UpgradeKey = {}));
var PRIORITIZE_UNVISITED_UPGRADE_COST = exports.PRIORITIZE_UNVISITED_UPGRADE_COST = 500;
var AVOID_REVISIT_LAST_POSITION_UPGRADE_COST = exports.AVOID_REVISIT_LAST_POSITION_UPGRADE_COST = 1000;
var ALLOW_PLAYER_TO_MOVE_INDEPENDENTLY_UPGRADE_COST = exports.ALLOW_PLAYER_TO_MOVE_INDEPENDENTLY_UPGRADE_COST = 1500;
var AUTO_EXIT_MAZE_UPGRADE_BASE_COST = exports.AUTO_EXIT_MAZE_UPGRADE_BASE_COST = 250;
var AUTO_EXIT_MAZE_UPGRADE_BASE_COST_MULTIPLIER = exports.AUTO_EXIT_MAZE_UPGRADE_BASE_COST_MULTIPLIER = 2;
var TELEPORT_PLAYER_BACK_TO_BOT_UPGRADE_COST = exports.TELEPORT_PLAYER_BACK_TO_BOT_UPGRADE_COST = 1000;
var TELEPORT_BOT_BACK_TO_PLAYER_UPGRADE_COST = exports.TELEPORT_BOT_BACK_TO_PLAYER_UPGRADE_COST = 1000;
var SPLIT_DIRECTION_UPGRADE_BASE_COST = exports.SPLIT_DIRECTION_UPGRADE_BASE_COST = 1000;
var SPLIT_DIRECTION_UPGRADE_BASE_MULTIPLIER = exports.SPLIT_DIRECTION_UPGRADE_BASE_MULTIPLIER = 5;
var SPLIT_BOT_AUTO_MERGE_UPGRADE_COST = exports.SPLIT_BOT_AUTO_MERGE_UPGRADE_COST = 50000;
var TILE_REVISIT_MULTIPLIER = exports.TILE_REVISIT_MULTIPLIER = 0;
var MAZE_COMPLETION_BONUS_BASE_MULTIPLIER = exports.MAZE_COMPLETION_BONUS_BASE_MULTIPLIER = 0.1;
var MAZE_COMPLETION_BONUS_UPGRADE_SIZE_MULTIPLIER = exports.MAZE_COMPLETION_BONUS_UPGRADE_SIZE_MULTIPLIER = 1.1;
var MAZE_COMPLETION_BONUS_UPGRADE_BASE_COST = exports.MAZE_COMPLETION_BONUS_UPGRADE_BASE_COST = 100;
var MAZE_COMPLETION_BONUS_UPGRADE_BASE_COST_MULTIPLIER = exports.MAZE_COMPLETION_BONUS_UPGRADE_BASE_COST_MULTIPLIER = 2;
var BOT_MOVEMENT_UPGRADE_BASE_COST = exports.BOT_MOVEMENT_UPGRADE_BASE_COST = 10;
var BOT_MOVEMENT_UPGRADE_BASE_COST_MUTLIPLIER = exports.BOT_MOVEMENT_UPGRADE_BASE_COST_MUTLIPLIER = 1.1;
var BOT_REMEMBER_DEADEND_TILES_UPGRADE_BASE_COST = exports.BOT_REMEMBER_DEADEND_TILES_UPGRADE_BASE_COST = 1000;
var BOT_REMEMBER_DEADEND_TILES_UPGRADE_BASE_COST_MULTIPLIER = exports.BOT_REMEMBER_DEADEND_TILES_UPGRADE_BASE_COST_MULTIPLIER = 3;
var MAZE_SIZE_UPGRADE_BASE_COST = exports.MAZE_SIZE_UPGRADE_BASE_COST = 100;
var MAZE_SIZE_UPGRADE_BASE_COST_MULTIPLIER = exports.MAZE_SIZE_UPGRADE_BASE_COST_MULTIPLIER = 4;
var POINTS_PER_VISIT_UPGRADE_BASE_COST = exports.POINTS_PER_VISIT_UPGRADE_BASE_COST = 10;
var POINTS_PER_VISIT_UPGRADE_BASE_COST_MULTIPLIER = exports.POINTS_PER_VISIT_UPGRADE_BASE_COST_MULTIPLIER = 2;
var POINTS_PER_VISIT_BASE_AMOUNT = exports.POINTS_PER_VISIT_BASE_AMOUNT = 1;
var POINTS_PER_VISIT_BASE_AMOUNT_MULTIPLIER = exports.POINTS_PER_VISIT_BASE_AMOUNT_MULTIPLIER = 1.1;
var FRUIT_SPAWN_UPGRADE_BASE_COST = exports.FRUIT_SPAWN_UPGRADE_BASE_COST = 10;
var FRUIT_SPAWN_UPGRADE_BASE_COST_MULTIPLIER = exports.FRUIT_SPAWN_UPGRADE_BASE_COST_MULTIPLIER = 2;
var FRUIT_PICKUP_POINTS_UPGRADE_BASE_COST = exports.FRUIT_PICKUP_POINTS_UPGRADE_BASE_COST = 10;
var FRUIT_PICKUP_POINTS_UPGRADE_BASE_COST_MULTIPLIER = exports.FRUIT_PICKUP_POINTS_UPGRADE_BASE_COST_MULTIPLIER = 2;
var BRAIN_SPAWN_UPGRADE_BASE_COST = exports.BRAIN_SPAWN_UPGRADE_BASE_COST = 100;
var BRAIN_SPAWN_UPGRADE_BASE_COST_MULTIPLIER = exports.BRAIN_SPAWN_UPGRADE_BASE_COST_MULTIPLIER = 2;

},{}],21:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Upgrade2 = require("../Upgrade");

var _Upgrade3 = _interopRequireDefault(_Upgrade2);

var _UpgradeConstants = require("../UpgradeConstants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BUTTON_UI_ID = 'buyBotAutoExitMaze';
var TOOLTIP_TEXT = 'When a bot is within X non-walled tiles of the maze exit, it will automatically navigate to the exit.';

var AutoExitMazeUpgrade = function (_Upgrade) {
    _inherits(AutoExitMazeUpgrade, _Upgrade);

    function AutoExitMazeUpgrade(game, upgradeKey) {
        var upgradeLevel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

        _classCallCheck(this, AutoExitMazeUpgrade);

        return _possibleConstructorReturn(this, (AutoExitMazeUpgrade.__proto__ || Object.getPrototypeOf(AutoExitMazeUpgrade)).call(this, game, BUTTON_UI_ID, TOOLTIP_TEXT, upgradeKey, upgradeLevel));
    }

    _createClass(AutoExitMazeUpgrade, [{
        key: "updateUiProperties",
        value: function updateUiProperties() {
            this.setUiText("Auto Exit Maze Distance (" + this.upgradeLevel + " tiles): " + this.getCost().toLocaleString() + " pts");
        }
    }, {
        key: "getCost",
        value: function getCost() {
            return _UpgradeConstants.AUTO_EXIT_MAZE_UPGRADE_BASE_COST * Math.pow(_UpgradeConstants.AUTO_EXIT_MAZE_UPGRADE_BASE_COST_MULTIPLIER, this.upgradeLevel);
        }
    }]);

    return AutoExitMazeUpgrade;
}(_Upgrade3.default);

exports.default = AutoExitMazeUpgrade;

},{"../Upgrade":19,"../UpgradeConstants":20}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Upgrade2 = require("../Upgrade");

var _Upgrade3 = _interopRequireDefault(_Upgrade2);

var _UpgradeConstants = require("../UpgradeConstants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BUTTON_UI_ID = 'buyBotAvoidRevisitLastPosition';
var TOOLTIP_TEXT = 'Bots will avoid revisiting the position that they were just at.';

var AvoidRevisitLastPositionUpgrade = function (_Upgrade) {
    _inherits(AvoidRevisitLastPositionUpgrade, _Upgrade);

    function AvoidRevisitLastPositionUpgrade(game, upgradeKey) {
        var upgradeLevel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

        _classCallCheck(this, AvoidRevisitLastPositionUpgrade);

        return _possibleConstructorReturn(this, (AvoidRevisitLastPositionUpgrade.__proto__ || Object.getPrototypeOf(AvoidRevisitLastPositionUpgrade)).call(this, game, BUTTON_UI_ID, TOOLTIP_TEXT, upgradeKey, upgradeLevel, true));
    }

    _createClass(AvoidRevisitLastPositionUpgrade, [{
        key: "updateUiProperties",
        value: function updateUiProperties() {
            this.setUiText("Basic Avoid Revisit: " + this.getCost() + " pts");
        }
    }, {
        key: "getCost",
        value: function getCost() {
            return _UpgradeConstants.AVOID_REVISIT_LAST_POSITION_UPGRADE_COST;
        }
    }]);

    return AvoidRevisitLastPositionUpgrade;
}(_Upgrade3.default);

exports.default = AvoidRevisitLastPositionUpgrade;

},{"../Upgrade":19,"../UpgradeConstants":20}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Upgrade2 = require("../Upgrade");

var _Upgrade3 = _interopRequireDefault(_Upgrade2);

var _UpgradeConstants = require("../UpgradeConstants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BUTTON_UI_ID = 'buyBotMoveFaster';
var TOOLTIP_TEXT = 'Bots will avoid revisiting the position that they were just at.';

var BotMovementSpeedUpgrade = function (_Upgrade) {
    _inherits(BotMovementSpeedUpgrade, _Upgrade);

    function BotMovementSpeedUpgrade(game, upgradeKey) {
        var upgradeLevel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

        _classCallCheck(this, BotMovementSpeedUpgrade);

        return _possibleConstructorReturn(this, (BotMovementSpeedUpgrade.__proto__ || Object.getPrototypeOf(BotMovementSpeedUpgrade)).call(this, game, BUTTON_UI_ID, TOOLTIP_TEXT, upgradeKey, upgradeLevel));
    }

    _createClass(BotMovementSpeedUpgrade, [{
        key: "updateUiProperties",
        value: function updateUiProperties() {
            this.setUiText("Bot Movement Speed (" + this.upgradeLevel + "): " + this.getCost().toFixed(2) + " pts");
        }
    }, {
        key: "getCost",
        value: function getCost() {
            return _UpgradeConstants.BOT_MOVEMENT_UPGRADE_BASE_COST * Math.pow(_UpgradeConstants.BOT_MOVEMENT_UPGRADE_BASE_COST_MUTLIPLIER, this.upgradeLevel);
        }
    }]);

    return BotMovementSpeedUpgrade;
}(_Upgrade3.default);

exports.default = BotMovementSpeedUpgrade;

},{"../Upgrade":19,"../UpgradeConstants":20}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Upgrade2 = require("../Upgrade");

var _Upgrade3 = _interopRequireDefault(_Upgrade2);

var _UpgradeConstants = require("../UpgradeConstants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BUTTON_UI_ID = 'buyBotRememberDeadEnds';
var TOOLTIP_TEXT = 'Bots will automatically mark deadends up to X tiles as RED and will not revisit them.';

var BotRememberDeadEndTilesUpgrade = function (_Upgrade) {
    _inherits(BotRememberDeadEndTilesUpgrade, _Upgrade);

    function BotRememberDeadEndTilesUpgrade(game, upgradeKey) {
        var upgradeLevel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

        _classCallCheck(this, BotRememberDeadEndTilesUpgrade);

        return _possibleConstructorReturn(this, (BotRememberDeadEndTilesUpgrade.__proto__ || Object.getPrototypeOf(BotRememberDeadEndTilesUpgrade)).call(this, game, BUTTON_UI_ID, TOOLTIP_TEXT, upgradeKey, upgradeLevel));
    }

    _createClass(BotRememberDeadEndTilesUpgrade, [{
        key: "updateUiProperties",
        value: function updateUiProperties() {
            this.setUiText("Remember Dead Ends (" + this.upgradeLevel + " Tiles): " + this.getCost().toLocaleString() + " pts");
        }
    }, {
        key: "getCost",
        value: function getCost() {
            return _UpgradeConstants.BOT_REMEMBER_DEADEND_TILES_UPGRADE_BASE_COST * Math.pow(_UpgradeConstants.BOT_REMEMBER_DEADEND_TILES_UPGRADE_BASE_COST_MULTIPLIER, this.upgradeLevel);
        }
    }]);

    return BotRememberDeadEndTilesUpgrade;
}(_Upgrade3.default);

exports.default = BotRememberDeadEndTilesUpgrade;

},{"../Upgrade":19,"../UpgradeConstants":20}],25:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Upgrade2 = require("../Upgrade");

var _Upgrade3 = _interopRequireDefault(_Upgrade2);

var _UpgradeConstants = require("../UpgradeConstants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BUTTON_UI_ID = 'buySplitBotAutoMerge';
var TOOLTIP_TEXT = 'When bots step on the same tile, they will merge together and re-split on the next available opportunity.';

var BotSplitAutoMergeUpgrade = function (_Upgrade) {
    _inherits(BotSplitAutoMergeUpgrade, _Upgrade);

    function BotSplitAutoMergeUpgrade(game, upgradeKey) {
        var upgradeLevel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

        _classCallCheck(this, BotSplitAutoMergeUpgrade);

        return _possibleConstructorReturn(this, (BotSplitAutoMergeUpgrade.__proto__ || Object.getPrototypeOf(BotSplitAutoMergeUpgrade)).call(this, game, BUTTON_UI_ID, TOOLTIP_TEXT, upgradeKey, upgradeLevel, true));
    }

    _createClass(BotSplitAutoMergeUpgrade, [{
        key: "updateUiProperties",
        value: function updateUiProperties() {
            this.setUiText("Bot Split Auto Merge: " + this.getCost().toLocaleString() + " pts");
        }
    }, {
        key: "getCost",
        value: function getCost() {
            return _UpgradeConstants.SPLIT_BOT_AUTO_MERGE_UPGRADE_COST;
        }
    }]);

    return BotSplitAutoMergeUpgrade;
}(_Upgrade3.default);

exports.default = BotSplitAutoMergeUpgrade;

},{"../Upgrade":19,"../UpgradeConstants":20}],26:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Upgrade2 = require("../Upgrade");

var _Upgrade3 = _interopRequireDefault(_Upgrade2);

var _UpgradeConstants = require("../UpgradeConstants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BUTTON_UI_ID = 'buyBotSplitDirections';
var TOOLTIP_TEXT = 'Bots will split into two different bots when different pathways are available to it up to X total times.';

var BotSplitDirectionUpgrade = function (_Upgrade) {
    _inherits(BotSplitDirectionUpgrade, _Upgrade);

    function BotSplitDirectionUpgrade(game, upgradeKey) {
        var upgradeLevel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

        _classCallCheck(this, BotSplitDirectionUpgrade);

        return _possibleConstructorReturn(this, (BotSplitDirectionUpgrade.__proto__ || Object.getPrototypeOf(BotSplitDirectionUpgrade)).call(this, game, BUTTON_UI_ID, TOOLTIP_TEXT, upgradeKey, upgradeLevel));
    }

    _createClass(BotSplitDirectionUpgrade, [{
        key: "updateUiProperties",
        value: function updateUiProperties() {
            this.setUiText("Bot Split Direction (" + this.upgradeLevel + "): " + this.getCost().toLocaleString() + " pts");
        }
    }, {
        key: "getCost",
        value: function getCost() {
            return _UpgradeConstants.SPLIT_DIRECTION_UPGRADE_BASE_COST * Math.pow(_UpgradeConstants.SPLIT_DIRECTION_UPGRADE_BASE_MULTIPLIER, this.upgradeLevel);
        }
    }]);

    return BotSplitDirectionUpgrade;
}(_Upgrade3.default);

exports.default = BotSplitDirectionUpgrade;

},{"../Upgrade":19,"../UpgradeConstants":20}],27:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Upgrade2 = require("../Upgrade");

var _Upgrade3 = _interopRequireDefault(_Upgrade2);

var _UpgradeConstants = require("../UpgradeConstants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BUTTON_UI_ID = 'buyBrainSpawnRateUpgrade';
var TOOLTIP_TEXT = 'Brains spawn more frequently. Brains auto-path your bots to the exit up to X distance.';

var FruitPickupPointsMultiplierUpgrade = function (_Upgrade) {
    _inherits(FruitPickupPointsMultiplierUpgrade, _Upgrade);

    function FruitPickupPointsMultiplierUpgrade(game, upgradeKey) {
        var upgradeLevel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

        _classCallCheck(this, FruitPickupPointsMultiplierUpgrade);

        return _possibleConstructorReturn(this, (FruitPickupPointsMultiplierUpgrade.__proto__ || Object.getPrototypeOf(FruitPickupPointsMultiplierUpgrade)).call(this, game, BUTTON_UI_ID, TOOLTIP_TEXT, upgradeKey, upgradeLevel));
    }

    _createClass(FruitPickupPointsMultiplierUpgrade, [{
        key: "updateUiProperties",
        value: function updateUiProperties() {
            this.setUiText("Brain Spawn Rate (" + this.upgradeLevel + "): " + this.getCost().toLocaleString() + " pts");
        }
    }, {
        key: "getCost",
        value: function getCost() {
            return _UpgradeConstants.BRAIN_SPAWN_UPGRADE_BASE_COST * Math.pow(_UpgradeConstants.BRAIN_SPAWN_UPGRADE_BASE_COST_MULTIPLIER, this.upgradeLevel);
        }
    }]);

    return FruitPickupPointsMultiplierUpgrade;
}(_Upgrade3.default);

exports.default = FruitPickupPointsMultiplierUpgrade;

},{"../Upgrade":19,"../UpgradeConstants":20}],28:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Upgrade2 = require('../Upgrade');

var _Upgrade3 = _interopRequireDefault(_Upgrade2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BUTTON_UI_ID = 'noop';
var TOOLTIP_TEXT = '';

var DestructibleWallUpgrade = function (_Upgrade) {
    _inherits(DestructibleWallUpgrade, _Upgrade);

    function DestructibleWallUpgrade(game, upgradeKey) {
        var upgradeLevel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

        _classCallCheck(this, DestructibleWallUpgrade);

        return _possibleConstructorReturn(this, (DestructibleWallUpgrade.__proto__ || Object.getPrototypeOf(DestructibleWallUpgrade)).call(this, game, BUTTON_UI_ID, TOOLTIP_TEXT, upgradeKey, upgradeLevel));
    }

    _createClass(DestructibleWallUpgrade, [{
        key: 'updateUiProperties',
        value: function updateUiProperties() {}
    }, {
        key: 'getCost',
        value: function getCost() {
            return 0;
        }
    }, {
        key: 'isUnlocked',
        value: function isUnlocked() {
            return false;
        }
    }]);

    return DestructibleWallUpgrade;
}(_Upgrade3.default);

exports.default = DestructibleWallUpgrade;

},{"../Upgrade":19}],29:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Upgrade2 = require("../Upgrade");

var _Upgrade3 = _interopRequireDefault(_Upgrade2);

var _UpgradeConstants = require("../UpgradeConstants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BUTTON_UI_ID = 'buyFruitPickupPointsUpgrade';
var TOOLTIP_TEXT = 'Fruits pickups are worth more points!';

var FruitPickupPointsMultiplierUpgrade = function (_Upgrade) {
    _inherits(FruitPickupPointsMultiplierUpgrade, _Upgrade);

    function FruitPickupPointsMultiplierUpgrade(game, upgradeKey) {
        var upgradeLevel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

        _classCallCheck(this, FruitPickupPointsMultiplierUpgrade);

        return _possibleConstructorReturn(this, (FruitPickupPointsMultiplierUpgrade.__proto__ || Object.getPrototypeOf(FruitPickupPointsMultiplierUpgrade)).call(this, game, BUTTON_UI_ID, TOOLTIP_TEXT, upgradeKey, upgradeLevel));
    }

    _createClass(FruitPickupPointsMultiplierUpgrade, [{
        key: "updateUiProperties",
        value: function updateUiProperties() {
            this.setUiText("Fruit Pickup Points (" + this.upgradeLevel + "): " + this.getCost().toLocaleString() + " pts");
        }
    }, {
        key: "getCost",
        value: function getCost() {
            return _UpgradeConstants.FRUIT_PICKUP_POINTS_UPGRADE_BASE_COST * Math.pow(_UpgradeConstants.FRUIT_PICKUP_POINTS_UPGRADE_BASE_COST_MULTIPLIER, this.upgradeLevel);
        }
    }]);

    return FruitPickupPointsMultiplierUpgrade;
}(_Upgrade3.default);

exports.default = FruitPickupPointsMultiplierUpgrade;

},{"../Upgrade":19,"../UpgradeConstants":20}],30:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Upgrade2 = require("../Upgrade");

var _Upgrade3 = _interopRequireDefault(_Upgrade2);

var _UpgradeConstants = require("../UpgradeConstants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BUTTON_UI_ID = 'buyFruitSpawnRateUpgrade';
var TOOLTIP_TEXT = 'Fruits spawn more frequently.';

var FruitSpawnRateUpgrade = function (_Upgrade) {
    _inherits(FruitSpawnRateUpgrade, _Upgrade);

    function FruitSpawnRateUpgrade(game, upgradeKey) {
        var upgradeLevel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

        _classCallCheck(this, FruitSpawnRateUpgrade);

        return _possibleConstructorReturn(this, (FruitSpawnRateUpgrade.__proto__ || Object.getPrototypeOf(FruitSpawnRateUpgrade)).call(this, game, BUTTON_UI_ID, TOOLTIP_TEXT, upgradeKey, upgradeLevel));
    }

    _createClass(FruitSpawnRateUpgrade, [{
        key: "updateUiProperties",
        value: function updateUiProperties() {
            this.setUiText("Fruit Spawn Rate (" + this.upgradeLevel + "): " + this.getCost().toLocaleString() + " pts");
        }
    }, {
        key: "getCost",
        value: function getCost() {
            return _UpgradeConstants.FRUIT_SPAWN_UPGRADE_BASE_COST * Math.pow(_UpgradeConstants.FRUIT_SPAWN_UPGRADE_BASE_COST_MULTIPLIER, this.upgradeLevel);
        }
    }]);

    return FruitSpawnRateUpgrade;
}(_Upgrade3.default);

exports.default = FruitSpawnRateUpgrade;

},{"../Upgrade":19,"../UpgradeConstants":20}],31:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Upgrade2 = require("../Upgrade");

var _Upgrade3 = _interopRequireDefault(_Upgrade2);

var _UpgradeConstants = require("../UpgradeConstants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BUTTON_UI_ID = 'buyMazeCompletionBonusUpgrade';
var TOOLTIP_TEXT = 'Each maze completion is worth more points!';

var MazeCompletionBonusUpgrade = function (_Upgrade) {
    _inherits(MazeCompletionBonusUpgrade, _Upgrade);

    function MazeCompletionBonusUpgrade(game, upgradeKey) {
        var upgradeLevel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

        _classCallCheck(this, MazeCompletionBonusUpgrade);

        return _possibleConstructorReturn(this, (MazeCompletionBonusUpgrade.__proto__ || Object.getPrototypeOf(MazeCompletionBonusUpgrade)).call(this, game, BUTTON_UI_ID, TOOLTIP_TEXT, upgradeKey, upgradeLevel));
    }

    _createClass(MazeCompletionBonusUpgrade, [{
        key: "updateUiProperties",
        value: function updateUiProperties() {
            this.setUiText("Maze Completion Bonus (" + this.upgradeLevel + "): " + this.getCost() + " pts");
        }
    }, {
        key: "getCost",
        value: function getCost() {
            return _UpgradeConstants.MAZE_COMPLETION_BONUS_UPGRADE_BASE_COST * Math.pow(_UpgradeConstants.MAZE_COMPLETION_BONUS_UPGRADE_BASE_COST_MULTIPLIER, this.upgradeLevel);
        }
    }]);

    return MazeCompletionBonusUpgrade;
}(_Upgrade3.default);

exports.default = MazeCompletionBonusUpgrade;

},{"../Upgrade":19,"../UpgradeConstants":20}],32:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Upgrade2 = require("../Upgrade");

var _Upgrade3 = _interopRequireDefault(_Upgrade2);

var _UpgradeConstants = require("../UpgradeConstants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BUTTON_UI_ID = 'buyMazeSize';
var TOOLTIP_TEXT = 'Maze is increased in size by 1 for both x/y dimension!';

var MazeSizeUpgrade = function (_Upgrade) {
    _inherits(MazeSizeUpgrade, _Upgrade);

    function MazeSizeUpgrade(game, upgradeKey) {
        var upgradeLevel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

        _classCallCheck(this, MazeSizeUpgrade);

        return _possibleConstructorReturn(this, (MazeSizeUpgrade.__proto__ || Object.getPrototypeOf(MazeSizeUpgrade)).call(this, game, BUTTON_UI_ID, TOOLTIP_TEXT, upgradeKey, upgradeLevel));
    }

    _createClass(MazeSizeUpgrade, [{
        key: "updateUiProperties",
        value: function updateUiProperties() {
            this.setUiText("Maze Size (" + this.upgradeLevel + "): " + this.getCost().toLocaleString() + " pts");
        }
    }, {
        key: "getCost",
        value: function getCost() {
            return _UpgradeConstants.MAZE_SIZE_UPGRADE_BASE_COST * Math.pow(_UpgradeConstants.MAZE_SIZE_UPGRADE_BASE_COST_MULTIPLIER, this.upgradeLevel);
        }
    }]);

    return MazeSizeUpgrade;
}(_Upgrade3.default);

exports.default = MazeSizeUpgrade;

},{"../Upgrade":19,"../UpgradeConstants":20}],33:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Upgrade2 = require("../Upgrade");

var _Upgrade3 = _interopRequireDefault(_Upgrade2);

var _UpgradeConstants = require("../UpgradeConstants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BUTTON_UI_ID = 'buyPlayerMoveIndependently';
var TOOLTIP_TEXT = 'Players can have one bot moving at the same time as they manually move.';

var PlayerMoveIndependentlyUpgrade = function (_Upgrade) {
    _inherits(PlayerMoveIndependentlyUpgrade, _Upgrade);

    function PlayerMoveIndependentlyUpgrade(game, upgradeKey) {
        var upgradeLevel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

        _classCallCheck(this, PlayerMoveIndependentlyUpgrade);

        return _possibleConstructorReturn(this, (PlayerMoveIndependentlyUpgrade.__proto__ || Object.getPrototypeOf(PlayerMoveIndependentlyUpgrade)).call(this, game, BUTTON_UI_ID, TOOLTIP_TEXT, upgradeKey, upgradeLevel, true));
    }

    _createClass(PlayerMoveIndependentlyUpgrade, [{
        key: "updateUiProperties",
        value: function updateUiProperties() {
            this.setUiText('Player Can Move Independently: ' + this.getCost());
        }
    }, {
        key: "getCost",
        value: function getCost() {
            return _UpgradeConstants.ALLOW_PLAYER_TO_MOVE_INDEPENDENTLY_UPGRADE_COST;
        }
    }]);

    return PlayerMoveIndependentlyUpgrade;
}(_Upgrade3.default);

exports.default = PlayerMoveIndependentlyUpgrade;

},{"../Upgrade":19,"../UpgradeConstants":20}],34:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Upgrade2 = require("../Upgrade");

var _Upgrade3 = _interopRequireDefault(_Upgrade2);

var _UpgradeConstants = require("../UpgradeConstants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BUTTON_UI_ID = 'buyPointsPerVisit';
var TOOLTIP_TEXT = 'Get more points per tile that you visit!';

var PointsPerVisitUpgrade = function (_Upgrade) {
    _inherits(PointsPerVisitUpgrade, _Upgrade);

    function PointsPerVisitUpgrade(game, upgradeKey) {
        var upgradeLevel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

        _classCallCheck(this, PointsPerVisitUpgrade);

        return _possibleConstructorReturn(this, (PointsPerVisitUpgrade.__proto__ || Object.getPrototypeOf(PointsPerVisitUpgrade)).call(this, game, BUTTON_UI_ID, TOOLTIP_TEXT, upgradeKey, upgradeLevel));
    }

    _createClass(PointsPerVisitUpgrade, [{
        key: "updateUiProperties",
        value: function updateUiProperties() {
            this.setUiText("Points per visit (" + this.upgradeLevel + "): " + this.getCost().toLocaleString() + " pts");
        }
    }, {
        key: "getCost",
        value: function getCost() {
            return _UpgradeConstants.POINTS_PER_VISIT_UPGRADE_BASE_COST * Math.pow(_UpgradeConstants.POINTS_PER_VISIT_UPGRADE_BASE_COST_MULTIPLIER, this.upgradeLevel);
        }
    }]);

    return PointsPerVisitUpgrade;
}(_Upgrade3.default);

exports.default = PointsPerVisitUpgrade;

},{"../Upgrade":19,"../UpgradeConstants":20}],35:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Upgrade2 = require("../Upgrade");

var _Upgrade3 = _interopRequireDefault(_Upgrade2);

var _UpgradeConstants = require("../UpgradeConstants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BUTTON_UI_ID = 'buyBotPrioritizeUnvisited';
var TOOLTIP_TEXT = 'Bots will always prioritize an unvisited tile before a previously visited one.';

var PrioritizeUnvisitedUpgrade = function (_Upgrade) {
    _inherits(PrioritizeUnvisitedUpgrade, _Upgrade);

    function PrioritizeUnvisitedUpgrade(game, upgradeKey) {
        var upgradeLevel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

        _classCallCheck(this, PrioritizeUnvisitedUpgrade);

        return _possibleConstructorReturn(this, (PrioritizeUnvisitedUpgrade.__proto__ || Object.getPrototypeOf(PrioritizeUnvisitedUpgrade)).call(this, game, BUTTON_UI_ID, TOOLTIP_TEXT, upgradeKey, upgradeLevel, true));
    }

    _createClass(PrioritizeUnvisitedUpgrade, [{
        key: "updateUiProperties",
        value: function updateUiProperties() {
            this.setUiText("Basic Prioritize Unvisited: " + this.getCost() + " pts");
        }
    }, {
        key: "getCost",
        value: function getCost() {
            return _UpgradeConstants.PRIORITIZE_UNVISITED_UPGRADE_COST;
        }
    }]);

    return PrioritizeUnvisitedUpgrade;
}(_Upgrade3.default);

exports.default = PrioritizeUnvisitedUpgrade;

},{"../Upgrade":19,"../UpgradeConstants":20}],36:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Upgrade2 = require("../Upgrade");

var _Upgrade3 = _interopRequireDefault(_Upgrade2);

var _UpgradeConstants = require("../UpgradeConstants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BUTTON_UI_ID = 'buyBotTeleportToPlayer';
var TOOLTIP_TEXT = "Players can teleport their bot back to the themselves by pressing 'e'.";

var TeleportBotBackToPlayerUpgrade = function (_Upgrade) {
    _inherits(TeleportBotBackToPlayerUpgrade, _Upgrade);

    function TeleportBotBackToPlayerUpgrade(game, upgradeKey) {
        var upgradeLevel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

        _classCallCheck(this, TeleportBotBackToPlayerUpgrade);

        return _possibleConstructorReturn(this, (TeleportBotBackToPlayerUpgrade.__proto__ || Object.getPrototypeOf(TeleportBotBackToPlayerUpgrade)).call(this, game, BUTTON_UI_ID, TOOLTIP_TEXT, upgradeKey, upgradeLevel, true));
    }

    _createClass(TeleportBotBackToPlayerUpgrade, [{
        key: "updateUiProperties",
        value: function updateUiProperties() {
            this.setUiText("Teleport Bot Back to Player: " + this.getCost() + " pts");
        }
    }, {
        key: "getCost",
        value: function getCost() {
            return _UpgradeConstants.TELEPORT_BOT_BACK_TO_PLAYER_UPGRADE_COST;
        }
    }]);

    return TeleportBotBackToPlayerUpgrade;
}(_Upgrade3.default);

exports.default = TeleportBotBackToPlayerUpgrade;

},{"../Upgrade":19,"../UpgradeConstants":20}],37:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Upgrade2 = require("../Upgrade");

var _Upgrade3 = _interopRequireDefault(_Upgrade2);

var _UpgradeConstants = require("../UpgradeConstants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BUTTON_UI_ID = 'buyPlayerTeleportToBot';
var TOOLTIP_TEXT = "Players can teleport their themselves back to the bot by pressing 'q'.";

var TeleportPlayerBacktoBotUpgrade = function (_Upgrade) {
    _inherits(TeleportPlayerBacktoBotUpgrade, _Upgrade);

    function TeleportPlayerBacktoBotUpgrade(game, upgradeKey) {
        var upgradeLevel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

        _classCallCheck(this, TeleportPlayerBacktoBotUpgrade);

        return _possibleConstructorReturn(this, (TeleportPlayerBacktoBotUpgrade.__proto__ || Object.getPrototypeOf(TeleportPlayerBacktoBotUpgrade)).call(this, game, BUTTON_UI_ID, TOOLTIP_TEXT, upgradeKey, upgradeLevel, true));
    }

    _createClass(TeleportPlayerBacktoBotUpgrade, [{
        key: "updateUiProperties",
        value: function updateUiProperties() {
            this.setUiText("Teleport Player Back to Bot: " + this.getCost() + " pts");
        }
    }, {
        key: "getCost",
        value: function getCost() {
            return _UpgradeConstants.TELEPORT_PLAYER_BACK_TO_BOT_UPGRADE_COST;
        }
    }]);

    return TeleportPlayerBacktoBotUpgrade;
}(_Upgrade3.default);

exports.default = TeleportPlayerBacktoBotUpgrade;

},{"../Upgrade":19,"../UpgradeConstants":20}]},{},[6]);
