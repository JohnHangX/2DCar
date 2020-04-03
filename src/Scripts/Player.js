import Car from "./Car";

/**
*
* @ author:John
* @ email:-----
* @ data: 2020-04-02 10:58
*/
export default class Player extends Laya.Script {

    constructor() {
        super();
        this.playerMinX = 200;
        this.playerMaxX = 870;
        this.isGameStart = false;
        this.initXArr = [260, 450, 640, 820];
    }

    onAwake() {
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
        Laya.stage.on(Laya.Event.MOUSE_UP, this, this.mouseUp);
        Laya.stage.on("StartGame", this, function(){this.isGameStart = true;});
        this.rig = this.owner.getComponent(Laya.RigidBody);

        var index = this.getRandom(0, this.initXArr.length - 1);
        this.owner.pos(this.initXArr[index], 1360);
    }

    mouseDown()
    {
        if(this.isGameStart == false)
            return;
        var mouseX = Laya.stage.mouseX;
        var force = 0;
        if(mouseX < Laya.stage.width/2)
        {
            force = -1;
        }
        else
        {
            force = 1;
        }
        this.rig.linearVelocity = {x:force*6, y:0};
        Laya.Tween.to(this.owner, {rotation:force * 25}, 300);
    }

    mouseUp()
    {
        this.rig.linearVelocity = {x:0, y:0};
        Laya.Tween.to(this.owner, {rotation:0}, 300);
    }

    onUpdate()
    {
        if(this.owner.x > this.playerMaxX)
        {
            this.owner.x = this.playerMaxX;
        }
        if(this.owner.x < this.playerMinX)
        {
            this.owner.x = this.playerMinX;
        }
    }
    /**
     * 
     * @param {最小值} min 
     * @param {*最大值} max 
     */
    getRandom(min, max)
    {
        var value = Math.random()*(max - min);
        return Math.round(value) + min;
    }

    onTriggerEnter(other)
    {
        if(other.label == "Coin")
        {
            other.owner.getComponent(Car).recover();
            //得分
        }
        else if(other.label == "Car")
        {
            Laya.stage.event("GameOver");
        }
    }
}