import Phaser from 'phaser'
import Loading from '../../assets/Loading/*.png'

export default class Boot extends Phaser.Scene
{

    constructor()
    {
        super('boot');
    }

    preload()
    {
        this.load.image('LoadingBG', Loading.BG);
        this.load.image('FillBar', Loading.FillBar);
        this.load.image('FillBarBg', Loading.FillBarBg);
        this.load.image('LoadingText', Loading.LoadingText);
        this.load.image('LoadingTitle', Loading.Title);
    }0

    create()
    {
        this.scene.start('preload');
    }
}