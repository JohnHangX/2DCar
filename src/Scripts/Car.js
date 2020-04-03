/**
*
* @ author:John
* @ email:-----
* @ data: 2020-04-02 14:21
*/
export default class Car extends Laya.Script {

    constructor() {
        super();
        /** @prop {name:speed, tips:"提示文本", type:Number, default:null}*/
        this.speed=10;
    }

    onAwake() {
    }

    onUpdate()
    {
        this.owner.y += this.speed;
    }

    Init(sign)
    {
        this.sign = sign;
    }

    onTriggerExit(other)
    {
        if(other.label == "BottomCollision")
        {
            this.owner.removeSelf();
            this.recover();
        }
    }

    recover()
    {
        Laya.Pool.recover(this.sign,this.owner);
    }
}