import Phaser from 'phaser'

export default class GameOver extends Phaser.Scene
{
    constructor()
    {
        super('gameover');
    }

    Win;
    Runs;
    Wickets;
    PlayerName;
    PlayerNameText
    PlayerIconTexture;
    PlayerStatus;

    init(data)
    {
        console.log(data);
        this.Win= data.Win;
        this.PlayerName = data.PlayerName;
        this.Runs = data.Runs;
        this.Wickets = data.Wickets;
    }

    create()
    {
        this.add.image(0, 0, 'MenuBG').setOrigin(0,0).setDisplaySize(480, 720);
        this.add.image(240, 200, 'Title').setScale(0.35);
        var playBtn = this.add.image(240, 640, 'Play').setScale(0.5).setInteractive();
        this.PlayerIconTexture = this.add.image(200, 360, 'PlayerIcon').setScale(0.5);
        this.PlayerNameText = this.add.text(240, 350, this.PlayerName , {fontfamily:'verdana', color: '#000000', align: ' center', fontSize: '24px' });
        this.PlayerStatus = this.add.text(140, 400, 'Won by  Wickets', {fontfamily:'verdana', color: '#000000', align: ' center', fontSize: '24px' });
        playBtn.on('pointerdown', function (event) {
            this.scene.start('game');
        }, this);
        this.ShowGameOver();
    }

    ShowGameOver()
    {
        this.PlayerNameText.text = this.PlayerName;
        if(this.Win)
        {
            this.PlayerStatus.text = 'Won by ' + this.Wickets + ' Wickets';
        }else
        {
            this.PlayerStatus.text = 'Lost by ' + this.Runs + ' Runs';
        }
    }
}