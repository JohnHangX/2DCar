/**
*
* @ author:John
* @ email:-----
* @ data: 2020-04-02 10:35
*/
export default class AutoMove extends Laya.Script {

    constructor() {
        super();
        /** @prop {name:name, tips:"提示文本", type:Node, default:null}*/
        this.xx=null;

        this.moveSpeed = 20;
    }
    onAwake()
    {
        this.height = this.owner.height;
    }
    onUpdate()
    {
        this.owner.y += this.moveSpeed
        if(this.owner.y >= this.height)
        {
            this.owner.y -= this.height*2;
        }
    }
}