import Phaser from 'phaser'
import Preload from './scenes/preload'
import Boot from './scenes/boot'
import Menu from './scenes/menu'
import Game from './scenes/game'
import UI from './scenes/ui'
import GameOver from './scenes/gameover'

var GameConfig = {
    type: Phaser.AUTO,
    scale: {
        parent: 'phaserGame',
        width: 480,
        height: 720
    },
    backgroundColor: '#000000',
    scene: [Boot, Preload, Menu, Game, UI, GameOver]
}

let game;

window.onload = function()
{
    if (module.hot) 
    {
        module.hot.dispose(destroyGame);
        module.hot.accept(newGame);
    }

    if (!game) newGame();
    window.focus();
    resizeGame();
    window.addEventListener("resize", resizeGame);
}

function newGame()
{
    if (game) return;
    game = new Phaser.Game(GameConfig);
}

function destroyGame () {
    if (!game) return;
    game.destroy(true);
    game.runDestroy();
    game = null;
  }


function resizeGame()
{
    var canvas = document.querySelector("canvas");
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var windowRatio = windowWidth / windowHeight;
    var gameRatio = game.config.width / game.config.height;
    if(windowRatio < gameRatio){
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    }
    else{
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}



