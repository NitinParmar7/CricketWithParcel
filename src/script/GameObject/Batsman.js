import Phaser from 'phaser'

export default class Batsman extends Phaser.GameObjects.Sprite
{

    constructor(scene, x, y , texture)
    {
        super(scene, x, y, texture);   
    }

}