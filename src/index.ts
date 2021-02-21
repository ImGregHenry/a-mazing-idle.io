import { IS_DEV_MODE_ENABLED, DEV_MODE_AUTOSTART } from "./dev/devUtils";
import Game from "./Game";
import { DEFAULT_PLAYER_ID, DIRECTION_DOWN, DIRECTION_LEFT, DIRECTION_RIGHT, DIRECTION_UP } from "./Maze";
import { UpgradeKey } from "./upgrades/UpgradeConstants";
declare var $: any;


$(document).ready(() => {
  if (IS_DEV_MODE_ENABLED && !DEV_MODE_AUTOSTART) return;
  
  const game: Game = new Game();
  game.save.loadGameSaveFromLocalStorage(); 
  game.startGame();
  game.save.startSaveTimer();
  
  //TODO: this should be in UI
  $(document).keydown(function(event) {
    // Up
    if (event.keyCode === 38) {
      game.players.movePlayer(DEFAULT_PLAYER_ID, DIRECTION_UP, true);
      event.preventDefault();
    }
    // Down
    else if (event.keyCode === 40) {
      game.players.movePlayer(DEFAULT_PLAYER_ID, DIRECTION_DOWN, true);
      event.preventDefault();
    }
    // Left
    else if (event.keyCode === 37) {
      game.players.movePlayer(DEFAULT_PLAYER_ID, DIRECTION_LEFT, true);
      event.preventDefault();
    }
    // Right
    else if (event.keyCode === 39) {
      game.players.movePlayer(DEFAULT_PLAYER_ID, DIRECTION_RIGHT, true);
      event.preventDefault();
    }
    // E = Teleport Bot to Player
    else if (event.keyCode === 69) {
      if (game.upgrades.isUpgraded(UpgradeKey.TELEPORT_PLAYER_BACK_TO_BOT)) {
        game.maze.teleportPlayerBackToBot();
      }
      event.preventDefault();
    }
    // Q = Teleport Bot to Player
    else if (event.keyCode === 81) {
      if (game.upgrades.isUpgraded(UpgradeKey.TELEPORT_BOT_BACK_TO_PLAYER)) {
        game.maze.teleportBotBackToPlayer();
        event.preventDefault();
      }
    }
  });
});
