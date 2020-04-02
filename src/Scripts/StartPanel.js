/**
*
* @ author:John
* @ email:-----
* @ data: 2020-04-02 09:42
*/
export default class StartPanel extends Laya.Script {

    constructor() {
        super();
        /** @prop {name:btn_Play, tips:"提示文本", type:Node, default:null}*/
        this.btn_Play=null;
        /** @prop {name:btn_AudioOn, tips:"提示文本", type:Node, default:null}*/
        this.btn_AudioOn = null;
        /** @prop {name:btn_AudioOff, tips:"提示文本", type:Node, default:null}*/
        this.btn_AudioOff = null;
    }
    onAwake()
    {
        this.btn_Play.on(Laya.Event.CLICK, this, this.OnPlayClick);
        this.btn_AudioOn.on(Laya.Event.CLICK, this, this.OnAudioOnClick);
        this.btn_AudioOff.on(Laya.Event.CLICK, this, this.OnAudioOffClick);
    }

    OnPlayClick()
    {
        this.owner.visible = false;
        Laya.stage.event("StartGame");
    }

    OnAudioOnClick()
    {
        this.btn_AudioOn.visible = false;
        this.btn_AudioOff.visible = true;
    }

    OnAudioOffClick()
    {
        this.btn_AudioOn.visible = true;
        this.btn_AudioOff.visible = false;
    }
}