import Game from "../../Game";
import Upgrade from "../Upgrade";
import { AUTO_EXIT_MAZE_UPGRADE_BASE_COST, AUTO_EXIT_MAZE_UPGRADE_BASE_COST_MULTIPLIER, UpgradeKey } from "../UpgradeConstants";

const BUTTON_UI_ID = 'buyBotAutoExitMaze';
const TOOLTIP_TEXT = 'When a bot is within X non-walled tiles of the maze exit, it will automatically navigate to the exit.';

class AutoExitMazeUpgrade extends Upgrade {
  
  constructor(game: Game, upgradeKey: UpgradeKey, upgradeLevel: number = 0) {
    super(game, BUTTON_UI_ID, TOOLTIP_TEXT, upgradeKey, upgradeLevel);
  }
  
  updateUiProperties(): void {
    this.setUiText(`Auto Exit Maze Distance (${this.upgradeLevel} tiles): ${this.getCost().toLocaleString()} pts`);
  }

  getCost(): number {
    return AUTO_EXIT_MAZE_UPGRADE_BASE_COST * Math.pow(AUTO_EXIT_MAZE_UPGRADE_BASE_COST_MULTIPLIER, this.upgradeLevel);
  }
}

export default AutoExitMazeUpgrade;
