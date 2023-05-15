import Phaser from 'phaser'

export default class UI extends Phaser.Scene
{
    constructor()
    {
        super('ui');
    }
    
    NamesArray;
    PlayerName;
    EnemyName;
    PlayerIcon;
    EnemyIcon;
    PlayerNameText;
    EnemyNameText;
    TargetScoreText;
    BallsText;
    ScoreText;

    create()
    {

        let Game = this.scene.get('game');
        Game.events.on('UpdateScore', this.UpdateScore, this);
        Game.events.on('UpdateTarget', this.UpdateTarget, this);
        Game.events.on('UpdateBalls', this.UpdateBalls, this);
        console.log('Bind');

        this.NamesArray = new Array('Gautam', 'Rohit', 'Virat', 'Sachin', 'Ravi', 'Rahul', 'Sanket');
        var lengthOfArray = this.NamesArray.length;
        var index = Phaser.Math.Between(0, lengthOfArray-1);
        this.PlayerName = this.NamesArray[index];
        if(index == lengthOfArray-1)
        {
            index = 0;
        }else
        {
            index++;
        }
        this.EnemyName = this.NamesArray[index];

        this.add.image(240, 80, 'ScoreBoard').setScale(0.4);

        // UI
        var BackButton = this.add.image(0, 60, 'BackButton').setScale(0.5).setOrigin(0, 0.5).setInteractive();
        BackButton.on('pointerdown', this.ShowMenu, this);

        this.add.image(480, 60, 'SoundButton').setScale(0.5).setOrigin(1, 0.5);
        this.add.image(240, 640, 'ButtonsBg').setScale(0.5);

        this.PlayerIcon = this.add.image(150, 65, 'PlayerIcon').setScale(0.4);
        this.EnemyIcon = this.add.image(280, 65, 'PlayerIcon').setScale(0.4);
        
        this.PlayerNameText = this.add.text(165, 60, this.PlayerName, {fontfamily:'verdana', color: '1xffffff', align: ' center' });
        this.add.text(230, 60, 'Vs', {fontfamily:'verdana', color: '1xffffff', align: ' center' })
        this.EnemyNameText = this.add.text(295, 60, this.EnemyName, {fontfamily:'verdana', color: '1xffffff', align: ' center' });

        this.add.text(140, 80, 'Target:', {fontfamily:'verdana', color: '1xffffff', align: ' center' });
        this.TargetScoreText = this.add.text(220, 80, '12',{fontfamily:'verdana', color: '1xffffff', align: ' center' });
        this.add.text(260, 80, 'Balls:', {fontfamily:'verdana', color: '1xffffff', align: ' center' });
        this.BallsText = this.add.text(330, 80, '6',{fontfamily:'verdana', color: '1xffffff', align: ' center' });
        this.ScoreText = this.add.text(255, 115, '0/0', {fontfamily:'verdana', color: '#ffffff', align: ' center' });

        var hookShotBtn = this.add.image(60, 640, 'Batsman5').setScale(0.5).setInteractive();
        hookShotBtn.on('pointerdown', this.batsman5, this);

        var driveShotBtn = this.add.image(180, 640, 'Batsman7').setScale(0.5).setInteractive();
        driveShotBtn.on('pointerdown', this.batsman7, this);

        var CoverShot = this.add.image(300, 640, 'Batsman13').setScale(0.5).setInteractive();
        CoverShot.on('pointerdown', this.batsman13, this);

        var offdrive = this.add.image(420, 640, 'Batsman10').setScale(0.5).setInteractive();
        offdrive.on('pointerdown', this.batsman10, this);

        console.log('player Name: ' + this.PlayerName);
        this.events.emit('UIInit', this.PlayerName);

    }

    UpdateScore(Score, Wicket)
    {
        this.ScoreText.text= Score + '/' + Wicket;
    }

    UpdateTarget(Target)
    {
        console.log(Target);
        this.TargetScoreText.text= Target;
    }

    UpdateBalls(BallCount)
    {
        this.BallsText.text = BallCount;
    }

    ShowMenu()
    {
        this.scene.stop('game');
        this.scene.start('menu');
    }

    batsman5()
    {
        this.events.emit('batsman5');
    }

    batsman7()
    {
        this.events.emit('batsman7');
    }

    batsman13()
    {
        this.events.emit('batsman13');
    }

    batsman10()
    {
        this.events.emit('batsman10');
    }
}