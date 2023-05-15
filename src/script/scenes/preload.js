import Phaser from 'phaser'
import MenuImages from '../../assets/GameUI/Menu/*.png'
import GameplayImages from '../../assets/GameUI/GamePlay/*.png'
import BatsmanThumnail from  '../../assets/BatsmanThumnail/*.png'
import GameObjectImages from '../../assets/*.png'


export default class Preload extends Phaser.Scene
{

    constructor()
    {
        super('preload');
    }

    FillBar;

    preload()
    {
        this.load.image('MenuBG', MenuImages.MenuBg);
        this.load.image('Title', MenuImages.Title);
        this.load.image('Play', MenuImages.PlayBtn);
        this.load.image('ShowVideo', MenuImages.WatchVideoBtn)
        this.load.image('Sound', MenuImages.SoundBtn);
        this.load.image('Leaderboard', MenuImages.LeaderboardBtn);
        this.load.image('ButtonBg', MenuImages.ButtonBg);

        this.load.image('PlayGround', GameplayImages.GamePlayPortraitBG);
        this.load.image('ScoreBoard', GameplayImages.ScoreBoard);
        this.load.image('BackButton', GameplayImages.BackButton);
        this.load.image('SoundButton', GameplayImages.SoundButton);
        this.load.image('ButtonsBg', GameplayImages.ButtonsBg);
        this.load.image('Batsman5', BatsmanThumnail.Batsman5);
        this.load.image('Batsman7', BatsmanThumnail.Batsman7);
        this.load.image('Batsman13', BatsmanThumnail.Batsman13);
        this.load.image('Batsman10', BatsmanThumnail.Batsman10);
        this.load.image('ball', 'assets/red.png');
        this.load.image('ballTrail', 'assets/white.png');

        this.load.image('OtherMan', 'assets/BatsmanRun/otherman.png');
        this.load.atlas('BatsmanRun', 'assets/BatsmanRun/BatsmanRun.png', 'assets/BatsmanRun/BatsmanRun.json');

        this.load.spritesheet('Stumps', GameObjectImages.stump, {frameWidth: 128, frameHeight: 128});
        this.load.atlas('Umpire', 'assets/Umpire/Umpire.png', 'assets/Umpire/Umpire.json');

        this.load.image('fielder', GameObjectImages.fielder);
        this.load.spritesheet('batsman5', GameObjectImages.batsman1, {frameWidth: 280, frameHeight: 423});
        this.load.spritesheet('batsman7', GameObjectImages.batsman2, {frameWidth: 280, frameHeight: 423});
        this.load.spritesheet('batsman10', GameObjectImages.batsman3, {frameWidth: 280, frameHeight: 423});
        this.load.spritesheet('batsman13', GameObjectImages.batsman3, {frameWidth: 280, frameHeight: 423});

        this.load.spritesheet('bowling', GameObjectImages.baller0, {frameWidth: 72, frameHeight: 132});

        this.load.spritesheet('batsmanidle', GameObjectImages.batsmanidlenew, {frameWidth: 176, frameHeight: 356});
        this.load.image('fourBillboard', 'assets/Four.png');
        this.load.image('sixBillboard', 'assets/Six.png');
        this.load.image('outBillboard', 'assets/Out.png');
        this.load.image('PlayerIcon','assets/PlayerIcon.png');


        this.add.image(240, 360, 'LoadingBG');
        this.add.image(240, 260, 'LoadingTitle').setScale(0.5);
        this.add.image(240, 540, 'LoadingText').setScale(0.5);
        this.add.image(240, 580, 'FillBarBg').setScale(0.5).setAlpha(0.5);
        this.FillBar = this.add.image(240, 580, 'FillBar').setScale(0, 0.5);

        this.load.on('progress', (percent)=>{
             this.FillBar.setScale(percent * 0.5, 0.5);
        });

    }


    create()
    {
        this.scene.start('menu');
    }


}