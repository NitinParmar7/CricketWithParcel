import Phaser from 'phaser'
import Batsman from '../GameObject/Batsman'

const GameState = {
    PREBOWLING : 0,
    BOWLING: 1,
    BATTING: 2,
    UMPIRE: 3
};

export default class Game extends Phaser.Scene
{
    constructor()
    {
        super('game');
    }

    Batsman;
    BatsmanRunner1;
    BatsmanRunner2;
    Otherman;
    Stumps;
    Umpire;
    Bowler;
    LeftFielder;
    RightFielder;
    OutFielder;

    CurrentState = GameState.PREBOWLING;

    batsmanRunnerPath;
    batsman5Path;
    batsman7Path;
    batsman10Path;
    batsman13Path;

    ball;
    ballPoint;
    ballTrail;
    ballTrailParticle;
    ballTween;
    ballPath1;
    ballPath2;
    ballPath3;
    BallRotateTween;
    BatsmanRunnerTween;
    BillboardScore;

    BallCount = 6;
    BowlingType = 0;
    TotalScore = 0;
    Target;
    Wickets = 0;
    Run = 0;
    PlayerName;

    follower;
    BatsmanRunnerFollower;
    bMatchHasStarted = false;
    timeToStartMatch = 2000;
    delayBetweenBowling = 2000;
    currentTime = 0;
    battingType = 0;

    create()
    {
        this.cameras.main.setBounds(-180, 0, 2160, 1920);
        this.cameras.main.centerOn(240, 360);
        this.cameras.main.setZoom(1);
        // playground
        this.add.image(240, 360,'PlayGround').setScale(0.4);
        

        this.scene.launch('ui');
        this.scene.setActive(true, 'ui');
        this.scene.setVisible(true, 'ui');
        this.scene.bringToTop('ui');
        var UI = this.scene.get('ui');
        UI.events.on('batsman5', this.batsman5, this);
        UI.events.on('batsman7', this.batsman7, this);
        UI.events.on('batsman10', this.batsman10, this);
        UI.events.on('batsman13', this.batsman13, this);
        UI.events.on('UIInit', this.UIInit, this);

        // Game Object
        this.LeftFielder = this.add.sprite(70, 330, 'fielder');
        this.LeftFielder.setScale(0.4);

        this.RightFielder = this.add.sprite(385, 330, 'fielder');
        this.RightFielder.setScale(0.25);

        this.OutFielder = this.add.sprite(160, 325, 'fielder');
        this.OutFielder.setScale(0.25);

        this.BillboardScore = this.add.image(240, 215, 'fourBillboard').setScale(0.25).setVisible(false);

        var UmpireIdle = {
            key: 'UmpireIdle',
            frames: [ {key: 'Umpire', frame: 'UmpireIdle.png'}],
            framerate: 1,
            repeat: -1
        }

        this.anims.create(UmpireIdle);

        var UmpireFour = {
            key: 'UmpireFour',
            frames: [
                    { key: 'Umpire', frame: 'UmpireFour01.png'},
                    { key: 'Umpire', frame: 'UmpireFour02.png'},
                    { key: 'Umpire', frame: 'UmpireFour03.png'},
                    { key: 'Umpire', frame: 'UmpireFour05.png'},
                    { key: 'Umpire', frame: 'UmpireFour06.png'},
                    { key: 'Umpire', frame: 'UmpireFour07.png'},
                    { key: 'Umpire', frame: 'UmpireFour08.png'},
                ],
            duration: 1000,
            }

        this.anims.create(UmpireFour);

        var UmpireOut = {
            key: 'UmpireOut',
            frames: [
                { key: 'Umpire', frame: 'UmpireOut01.png'},
                { key: 'Umpire', frame: 'UmpireOut02.png'},
                { key: 'Umpire', frame: 'UmpireOut03.png'},
            ],
            duration: 1000,
        }

        this.anims.create(UmpireOut);

        var UmpireSix = {
            key: 'UmpireSix',
            frames: [
                { key: 'Umpire', frame: 'UmpireSix01.png'},
                { key: 'Umpire', frame: 'UmpireSix02.png'},
                { key: 'Umpire', frame: 'UmpireSix03.png'},
            ],            
            duration: 1000,
        }

        this.anims.create(UmpireSix);

        this.Umpire = this.add.sprite(240, 325, 'Umpire').play('UmpireIdle').setScale(0.5);


        this.Bowler = this.add.sprite(265, 330, 'bowling').setScale(0.5);

        this.Otherman = this.add.image(220, 330, 'OtherMan').setScale(0.25);

        var BatsmanFrontRun = {
            key: 'BatsmanFrontRun',
            frames: [
                {key: 'BatsmanRun', frame: 'FronRun1.png'},
                {key: 'BatsmanRun', frame: 'FrontRun2.png'},
                {key: 'BatsmanRun', frame: 'FrontRun3.png'},
                {key: 'BatsmanRun', frame: 'FrontRun4.png'},
            ],
            duration: 500,
            repeat: -1
        }

        this.anims.create(BatsmanFrontRun);

        var BatsmanBackRun = {
            key: 'BatsmanBackRun',
            frames: [
                {key: 'BatsmanRun', frame: 'BackRun1.png'},
                {key: 'BatsmanRun', frame: 'BackRun2.png'},
                {key: 'BatsmanRun', frame: 'BackRun3.png'},
                {key: 'BatsmanRun', frame: 'BackRun4.png'},
            ],
            duration: 500,
            repeat: -1
        }

        this.anims.create(BatsmanBackRun);

        this.BatsmanRunner1 = this.add.sprite(220, 330, 'BatsmanRun').play('BatsmanFrontRun').setVisible(false).setScale(0.5).setDepth(1);
        this.BatsmanRunner2 = this.add.sprite(200, 420, 'BatsmanRun').play('BatsmanBackRun').setVisible(false).setScale(0.5).setDepth(1);

        this.batsmanRunnerPath = new Phaser.Curves.Path(220, 330);
        this.batsmanRunnerPath.lineTo(200, 420);

        this.ball = this.add.image(256, 320, 'ball').setVisible(false);
        this.ballPoint = this.add.image(256, 320, 'ballTrail').setVisible(false).setAlpha(0.5);
        this.ballPoint.setTint('0x000000')
        this.ballTrailParticle = this.add.particles('ballTrail').createEmitter({
            follow: this.ball,
            frequency: 50,
            speed: { min: 0, max: 0.1},
            angle: { min: 90, max: 90},
            scale: { start: 0, end: 0.1, ease: 'Linear'},
            alpha: { start: 1, end: 0, ease: 'Linear'},
            delay: {min: 0.1, max:0.2},
            blendMode: 'SCREEN',
            lifespan: 500
        }).setVisible(false);

        this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
        this.BatsmanRunnerFollower = { t: 0, vec: new Phaser.Math.Vector2() };

        this.ballPath1 = new Phaser.Curves.Path(256, 320);
        this.ballPath1.splineTo([260, 380, 270, 430, 260, 420, 250, 410, 240, 400, 230, 390]);

        this.ballPath2 = new Phaser.Curves.Path(256, 320);
        this.ballPath2.splineTo([270, 360, 260, 420, 250, 430, 240, 410, 230, 400, 230, 390]);

        this.ballPath3 = new Phaser.Curves.Path(256, 320);
        this.ballPath3.splineTo([230, 400, 230, 450, 230, 440, 235, 430, 240, 420, 245, 410]);

        this.batsman5Path = new Phaser.Curves.Path(240, 400);
        this.batsman5Path.lineTo(160, 340);

        this.batsman7Path = new Phaser.Curves.Path(240, 400);
        this.batsman7Path.splineTo([200, 350, 100, 320, 0, 260, -200, 180]);

        this.batsman10Path = new Phaser.Curves.Path(240, 450);
        this.batsman10Path.lineTo(385, 350);

        this.batsman13Path = new Phaser.Curves.Path(240, 400);
        this.batsman13Path.lineTo(720,350);


        var graphics = this.add.graphics();
        graphics.lineStyle(2, 0xffffff, 1);
       //this.ballPath3.draw(graphics);

      

        var bowlingConfig = {
            key: 'bowlingAnim',
            frames: this.anims.generateFrameNumbers('bowling', {start: 0, end: 9, first: 0}),
            framerate: 1
        }

        this.anims.create(bowlingConfig);

        this.add.image(240, 350, 'Stumps').setScale(0.2);

        this.Batsman = new Batsman(this,200, 420, 'batsmanidle').setScale(0.5);
        this.add.existing(this.Batsman);

        var idleconfig = {
            key: 'idle',
            frames: this.anims.generateFrameNumbers('batsmanidle', {start: 0, end: 2, first:0}),
            duration: 1000,
            repeat:-1
        }

        this.anims.create(idleconfig);

        var Batsman5Config = {
            key: 'batsman5',
            frames: this.anims.generateFrameNumbers('batsman5', {start: 0, end: 3, first:0}),
            duration: 500,
            delay: 200
        }

        this.anims.create(Batsman5Config);

        var Batsman7Config = {
            key: 'batsman7',
            frames: this.anims.generateFrameNumbers('batsman7', {start: 0, end: 3, first:0}),
            duration: 500,
        }

        this.anims.create(Batsman7Config);

        var batsman10Config = {
            key: 'batsman10',
            frames: this.anims.generateFrameNumbers('batsman10', {start: 0, end: 3, first: 0}),
            duration: 500,
        }

        this.anims.create(batsman10Config);


        var batsman13Config = {
            key: 'batsman13',
            frames: this.anims.generateFrameNumbers('batsman13', {start: 0, end: 3, first: 0}),
            duration: 500,
        }

        this.anims.create(batsman13Config);

        this.Batsman.play('idle');


        this.Stumps = this.add.sprite(240, 518, 'Stumps');

        var stumpConfig = {
            key: 'out',
            frames: this.anims.generateFrameNumbers('Stumps', {start: 0, end: 5, first: 0}),
            framerate: 3
        }
        this.anims.create(stumpConfig);
        
    }

    UIInit(Player)
    {
        this.PlayerName = Player;
        console.log(this.PlayerName + Player);
        this.Target = Phaser.Math.Between(12, 24);
        this.events.emit('UpdateTarget', this.Target);
    }

    update(t, dt)
    {  
        this.currentTime += dt;
        if(this.currentTime >= this.timeToStartMatch && !this.bMatchHasStarted)
        {
            this.bMatchHasStarted = true;
            this.Bowl();
        }
        else if(this.bMatchHasStarted)
        {
            if(this.CurrentState == GameState.BOWLING)
            {
                if(this.BowlingType == 0)
                {
                    this.ballPath1.getPoint(this.follower.t, this.follower.vec);
                    if(this.follower.t > 0.6)
                    {
                        this.ballPoint.x = 270;
                        this.ballPoint.y = 430;
                        this.ballPoint.setVisible(true);
                        this.ballPoint.setScale(0.1,0.05);
                    }
                }
                else if(this.BowlingType == 1)
                {
                    this.ballPath2.getPoint(this.follower.t, this.follower.vec);
                    if(this.follower.t > 0.6)
                    {
                        this.ballPoint.x = 250;
                        this.ballPoint.y = 430;
                        this.ballPoint.setVisible(true);
                        this.ballPoint.setScale(0.1,0.05);
                    }
                }
                else if(this.BowlingType == 2)
                {
                    this.ballPath3.getPoint(this.follower.t, this.follower.vec); 
                    if(this.follower.t > 0.6)
                    {
                        this.ballPoint.x = 230;
                        this.ballPoint.y = 450;
                        this.ballPoint.setVisible(true);
                        this.ballPoint.setScale(0.1,0.05);
                    }
                }
                this.ball.x = Phaser.Math.RoundTo(this.follower.vec.x, 0);
                this.ball.y = Phaser.Math.RoundTo(this.follower.vec.y, 0);
                this.ball.setScale(Phaser.Math.Linear(0.05, 0.08, this.follower.t));   
            }
            else if(this.CurrentState == GameState.PREBOWLING && this.Wickets < 3 && this.currentTime > this.delayBetweenBowling)
            {
                this.Bowl();
            }
            else if(this.CurrentState == GameState.BATTING)
            {
                if(this.battingType == 5)
                {
                    this.batsman5Path.getPoint(this.follower.t, this.follower.vec);
                    this.batsmanRunnerPath.getPoint(this.BatsmanRunnerFollower.t, this.BatsmanRunnerFollower.vec);
                    this.BatsmanRunner1.x = Phaser.Math.RoundTo(this.BatsmanRunnerFollower.vec.x - 10, 0);
                    this.BatsmanRunner1.y = Phaser.Math.RoundTo(this.BatsmanRunnerFollower.vec.y, 0);
                    this.batsmanRunnerPath.getPoint(1 - this.BatsmanRunnerFollower.t, this.BatsmanRunnerFollower.vec);
                    this.BatsmanRunner2.x = Phaser.Math.RoundTo(this.BatsmanRunnerFollower.vec.x + 10, 0);
                    this.BatsmanRunner2.y = Phaser.Math.RoundTo(this.BatsmanRunnerFollower.vec.y, 0);
                    this.BatsmanRunner1.setScale(Phaser.Math.Linear(0.5, 1, this.BatsmanRunnerFollower.t));
                    this.BatsmanRunner2.setScale(Phaser.Math.Linear(1, 0.5, this.BatsmanRunnerFollower.t));
                }
                else if(this.battingType == 7)
                {
                    this.batsman7Path.getPoint(this.follower.t, this.follower.vec);
                }
                else if(this.battingType == 10)
                {
                    this.batsman10Path.getPoint(this.follower.t, this.follower.vec);
                    this.batsmanRunnerPath.getPoint(this.BatsmanRunnerFollower.t, this.BatsmanRunnerFollower.vec);
                    this.BatsmanRunner1.x = Phaser.Math.RoundTo(this.BatsmanRunnerFollower.vec.x - 10, 0);
                    this.BatsmanRunner1.y = Phaser.Math.RoundTo(this.BatsmanRunnerFollower.vec.y, 0);
                    this.batsmanRunnerPath.getPoint(1 - this.BatsmanRunnerFollower.t, this.BatsmanRunnerFollower.vec);
                    this.BatsmanRunner2.x = Phaser.Math.RoundTo(this.BatsmanRunnerFollower.vec.x + 10, 0);
                    this.BatsmanRunner2.y = Phaser.Math.RoundTo(this.BatsmanRunnerFollower.vec.y, 0);
                    this.BatsmanRunner1.setScale(Phaser.Math.Linear(0.5, 1, this.BatsmanRunnerFollower.t));
                    this.BatsmanRunner2.setScale(Phaser.Math.Linear(1, 0.5, this.BatsmanRunnerFollower.t));
                }
                else if(this.battingType == 13)
                {
                    this.batsman13Path.getPoint(this.follower.t, this.follower.vec);
                }
                this.ball.x = Phaser.Math.RoundTo(this.follower.vec.x, 0);
                this.ball.y = Phaser.Math.RoundTo(this.follower.vec.y, 0);
                this.ball.setScale(Phaser.Math.Linear(0.08, 0.02, this.follower.t));
            }
        }
    }

    Bowl()
    {
        this.BowlingType = Phaser.Math.Between(0, 2);
        var cam = this.cameras.main;
        cam.pan(240, 360, 100, 'Linear');
        cam.zoomTo(1, 100);
        this.Batsman.setTexture('batsmanidle');
        this.Batsman.play('idle');
        this.ballTween = this.tweens.add({
            targets: this.follower,
            t: 1,
            ease: 'Power1',
            duration: 1500,
            delay: 300,
        });
        this.follower.t = 0;
        this.BatsmanRunnerFollower.t = 0;
        this.ballTween.once('start', this.SetVisibleBall,  this);
        this.ballTween.once('complete', this.Out,  this);
        this.Stumps.setFrame(0);
        this.Bowler.play('bowlingAnim');
        this.CurrentState = GameState.BOWLING;
        this.BallRotateTween = this.tweens.add({
            targets: this.ball,
            angle: -90,
            duration: 200,
            yoyo: true,
            repeat: -1
        });

    }

    SetVisibleBall()
    {
        this.ball.setVisible(true);
    }

    Out()
    {
        this.ball.setVisible(false);
        this.ballPoint.setVisible(false);
        this.currentTime = 0;
        this.Stumps.play('out');
        this.run = 0;
        this.Wickets++;
        this.events.emit('UpdateScore', this.TotalScore, this.Wickets);
        this.ShowUmpire();        
    }



    batsman5()
    {
        if(!this.bBatting)
        {
            this.Batsman.setTexture('batsman5');
            this.Batsman.play('batsman5');
            this.battingType = 5;
            this.time.delayedCall(500, this.PerformBatting, [], this);
        }
    }

    batsman7()
    {
        if(!this.bBatting)
        {
            this.Batsman.setTexture('batsman7');
            this.Batsman.play('batsman7');
            this.battingType = 7;
            this.time.delayedCall(200, this.PerformBatting, [], this);
        }
    }

    batsman10()
    {
        if(!this.bBatting)
        {
            this.Batsman.setTexture('batsman10');
            this.Batsman.play('batsman10');
            this.battingType = 10;
            this.time.delayedCall(500, this.PerformBatting, [], this);
        }
    }

    batsman13()
    {
        if(!this.bBatting)
        {
            this.Batsman.setTexture('batsman13');
            this.Batsman.play('batsman13');
            this.battingType = 13;
            this.time.delayedCall(500, this.PerformBatting, [], this);
        }
    }

    PerformBatting()
    {
        if(this.follower.t >= 0.8 && this.follower.t <= 0.98)
        {
            this.ballTween.stop();
            this.BallRotateTween.stop();
            this.ballTween = this.tweens.add({
                targets: this.follower,
                t: 1,
                ease: 'Power1',
                duration: 1500
            });

            this.ballPoint.setVisible(false);
            this.ballTween.once('complete', this.BattingComplete, this);
            this.follower.t = 0;
            this.BatsmanRunnerFollower.t = 0;
            this.CurrentState = GameState.BATTING;
            var cam = this.cameras.main;
            if(this.battingType == 5)
            {
                cam.pan(150, 330, 500, 'Linear');
                cam.zoomTo(1.25, 500);
                this.BatsmanRunnerTween = this.tweens.add({
                    targets: this.BatsmanRunnerFollower,
                    t: 1,
                    ease: 'Power1',
                    duration: 1500
                });
                this.Otherman.setVisible(false);
                this.Batsman.setVisible(false);
                this.BatsmanRunner1.setVisible(true);
                this.BatsmanRunner2.setVisible(true);
                this.BatsmanRunnerTween.once('complete', this.BatsmanRunningComplete, this);
            }else if(this.battingType == 7)
            {
                cam.pan(-200, 200, 500, 'Linear');
                cam.zoomTo(1.5, 500);
            }
            else if(this.battingType == 10)
            {
                cam.pan(380, 340, 500, 'Linear');
                cam.zoomTo(1.25, 500);
                this.BatsmanRunnerTween = this.tweens.add({
                    targets: this.BatsmanRunnerFollower,
                    t: 1,
                    ease: 'Power1',
                    duration: 750,
                    repeat: 2
                });
                this.Otherman.setVisible(false);
                this.Batsman.setVisible(false);
                this.BatsmanRunner1.setVisible(true);
                this.BatsmanRunner2.setVisible(true);
                this.BatsmanRunnerTween.once('complete', this.BatsmanRunningComplete, this);
            }
            else if(this.battingType == 13)
            {
                cam.pan(500, 450, 500, 'Linear');
                cam.zoomTo(1.5, 500);
            }
            this.ballTrailParticle.setVisible(true);
        }
    }

    BatsmanRunningComplete()
    {
        this.Otherman.setVisible(true);
        this.Batsman.setVisible(true);
        this.BatsmanRunner1.setVisible(false);
        this.BatsmanRunner2.setVisible(false);
        this.Batsman.setTexture('batsmanidle');
    }

    BattingComplete()
    {
        this.ball.setVisible(false);
        this.currentTime = 0;
        if(this.battingType == 5)
        {
            this.run = 1;
        }
        else if(this.battingType == 7)
        {
            this.run = 6;
        }
        else if(this.battingType == 10)
        {
            this.run = 2;
        }
        else if(this.battingType == 13)
        {
            this.run = 4;
        }
        this.TotalScore += this.run;
        this.events.emit('UpdateScore', this.TotalScore, this.Wickets);
        this.ballTrailParticle.setVisible(false);
        this.ShowUmpire();
    }

    ShowUmpire()
    {
        this.BatsmanRunningComplete()
        var cam = this.cameras.main;
        cam.pan(240, 360, 100, 'Linear');
        cam.zoomTo(1.25, 100);
        this.CurrentState = GameState.UMPIRE;
        if(this.run == 0)
        {
            this.Umpire.setTexture('UmpireOut')
            this.Umpire.play('UmpireOut').once('animationcomplete', this.UmpireAnimationFinish, this);
            this.BillboardScore.setTexture('outBillboard');
            this.BillboardScore.setVisible(true);

        }
        else if(this.run == 4)
        {
            this.Umpire.setTexture('UmpireFour')
            this.Umpire.play('UmpireFour').once('animationcomplete', this.UmpireAnimationFinish, this);
            this.BillboardScore.setTexture('fourBillboard');
            this.BillboardScore.setVisible(true);

        }
        else if(this.run  == 6)
        {
            this.Umpire.setTexture('UmpireSix')
            this.Umpire.play('UmpireSix').once('animationcomplete', this.UmpireAnimationFinish, this);
            this.BillboardScore.setTexture('sixBillboard');
            this.BillboardScore.setVisible(true);
        }
        else
        {
            this.UmpireAnimationFinish();
        }
        this.BallCount--;
        this.events.emit('UpdateBalls', this.BallCount);
        if(this.BallCount <= 0 || this.Wickets >= 3)
        {
            this.GameOver(false);
        }else if(this.TotalScore >= this.Target)
        {
            this.GameOver(true);
        }
    }

    UmpireAnimationFinish()
    {
        this.time.delayedCall(1000, this.PreBowling, [], this);
        this.Umpire.play('UmpireIdle');
        this.BillboardScore.setVisible(false);
    }

    PreBowling()
    {
        this.CurrentState = GameState.PREBOWLING;
    }

    GameOver(Win)
    {
        var RemainingWickets = 3 - this.Wickets;
        var RemainingRuns = this.Target - this.TotalScore;
        this.scene.stop('ui');
        this.scene.start('gameover', { PlayerName: this.PlayerName, Win: Win, Runs: RemainingRuns, Wickets: RemainingWickets});
    }
}