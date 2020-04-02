(function () {
    'use strict';

    /**
    *
    * @ author:John
    * @ email:-----
    * @ data: 2020-04-02 10:35
    */
    class AutoMove extends Laya.Script {

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
            this.owner.y += this.moveSpeed;
            if(this.owner.y >= this.height)
            {
                this.owner.y -= this.height*2;
            }
        }
    }

    /**
    *
    * @ author:John
    * @ email:-----
    * @ data: 2020-04-02 09:42
    */
    class StartPanel extends Laya.Script {

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

    /**
    *
    * @ author:John
    * @ email:-----
    * @ data: 2020-04-02 10:58
    */
    class Player extends Laya.Script {

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

        onTriggerEnter()
        {

        }
    }

    /**
    *
    * @ author:John
    * @ email:-----
    * @ data: 2020-04-02 14:21
    */
    class Car extends Laya.Script {

        constructor() {
            super();
            /** @prop {name:speed, tips:"提示文本", type:Number, default:null}*/
            this.speed=0;
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
                Laya.Pool.recover(this.sign,this.owner);
                console.log("000");
            }
        }
    }

    /**
    *
    * @ author:John
    * @ email:-----
    * @ data: 2020-04-02 15:26
    */
    class GameManager extends Laya.Script {
        constructor() {
            super();
            /** @prop {name:car_1, tips:"提示文本", type:Prefab, default:null}*/
            this.car_1 = null;
            /** @prop {name:car_2, tips:"提示文本", type:Prefab, default:null}*/
            this.car_2 = null;

            this.initXArr = [260, 450, 640, 820];
            this.carPrefabArr = [];
        }

        onAwake() {
            this.loadPrefab();
        }

        loadPrefab()
        {
            
            var pathArr = [
                "prefab/Car_1.json",
                "prefab/Car_2.json",
            ];
            var infoArr = [];
            for(var i = 0; i < pathArr.length; i++)
            {
                infoArr.push({url:pathArr[i], type:Laya.loader.PREFAB});
            }
            Laya.loader.load(infoArr, Laya.Handler.create(this, function(result){
                for(var i = 0; i < pathArr.length; i++)
                {
                    this.carPrefabArr.push(Laya.loader.getRes(pathArr[i]));
                }
                this.ranTime = this.getRandom(300, 800);
                Laya.timer.loop(this.ranTime, this, function(){
                    this.spawn();
                    this.ranTime = this.getRandom(300, 800);
                });
            }));
        }

        spawn()
        {
            var y = -300;
            var x = this.initXArr[this.getRandom(0, this.initXArr.length - 1)];
            var carIndex = this.getRandom(0, this.carPrefabArr.length - 1);
            var car = Laya.Pool.getItemByCreateFun(carIndex.toString(), function(){return this.carPrefabArr[carIndex].create()}, this);
            Laya.stage.addChild(car);
            car.pos(x, y);
            car.getComponent(Car).Init(carIndex.toString());
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

        carRestore(prefab)
        {

        }
    }

    /**This class is automatically generated by LayaAirIDE, please do not make any modifications. */

    class GameConfig {
        static init() {
            //注册Script或者Runtime引用
            let reg = Laya.ClassUtils.regClass;
    		reg("Scripts/AutoMove.js",AutoMove);
    		reg("Scripts/StartPanel.js",StartPanel);
    		reg("Scripts/Player.js",Player);
    		reg("Scripts/GameManager.js",GameManager);
    		reg("Scripts/Car.js",Car);
        }
    }
    GameConfig.width = 1080;
    GameConfig.height = 1920;
    GameConfig.scaleMode ="showall";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "middle";
    GameConfig.alignH = "center";
    GameConfig.startScene = "Main.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;

    GameConfig.init();

    class Main {
    	constructor() {
    		//根据IDE设置初始化引擎		
    		if (window["Laya3D"]) Laya3D.init(GameConfig.width, GameConfig.height);
    		else Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
    		Laya["Physics"] && Laya["Physics"].enable();
    		Laya["DebugPanel"] && Laya["DebugPanel"].enable();
    		Laya.stage.scaleMode = GameConfig.scaleMode;
    		Laya.stage.screenMode = GameConfig.screenMode;
    		Laya.stage.alignV = GameConfig.alignV;
    		Laya.stage.alignH = GameConfig.alignH;
    		//兼容微信不支持加载scene后缀场景
    		Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;

    		//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
    		if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
    		if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
    		if (GameConfig.stat) Laya.Stat.show();
    		Laya.alertGlobalError = true;

    		//激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
    		Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
    	}

    	onVersionLoaded() {
    		//激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
    		Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
    	}

    	onConfigLoaded() {
    		//加载IDE指定的场景
    		GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
    	}
    }
    //激活启动类
    new Main();

}());
