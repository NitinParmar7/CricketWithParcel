import Phaser from 'phaser'
import Preload from './scenes/preload'
import Boot from './scenes/boot'
import Menu from './scenes/menu'
import Game from './scenes/game'

export default {
    type: Phaser.AUTO,
    scale: {
        parent: 'phaserGame',
        width: 480,
        height: 720
    },
    backgroundColor: '#000000',
    scene: [Preload, Boot, Menu, Game]
}