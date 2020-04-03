import Car from "./Car";
/**
*
* @ author:John
* @ email:-----
* @ data: 2020-04-02 15:26
*/
export default class GameManager extends Laya.Script {
    constructor() {
        super();

        this.initXArr = [260, 450, 640, 820];
        this.carPrefabArr = [];
        this.isGameStart = false;
        this.carSpawnArr = [];
    }

    onAwake() {
        this.loadPrefab();
        Laya.stage.on("StartGame", this, function(){this.isGameStart = true});
        Laya.stage.on("GameOver", this, function(){this.gameOver()});
    }

    loadPrefab()
    {
        
        var pathArr = [
            
            "prefab/Car_3.json",
            "prefab/Coin.json",
            // "prefab/Car_1.json",
            // "prefab/Car_2.json",
        ]
        var infoArr = [];
        for(var i = 0; i < pathArr.length; i++)
        {
            infoArr.push({url:pathArr[i], type:Laya.loader.PREFAB})
        }
        console.log(infoArr);
        Laya.loader.load(infoArr, Laya.Handler.create(this, function(result){
            for(var i = 0; i < pathArr.length; i++)
            {
                this.carPrefabArr.push(Laya.loader.getRes(pathArr[i]));
            }
            this.ranTime = this.getRandom(400, 900);
            // Laya.timer.loop(this.ranTime, this, function(){
            //     this.spawn();
            //     this.ranTime = this.getRandom(400, 900);
            // })
        }))
        console.log(this.carPrefabArr);
    }

    spawn()
    {
        if(this.isGameStart == false)
            return;
        var y = -300;
        var x = this.initXArr[this.getRandom(0, this.initXArr.length - 1)];
        var carIndex = this.getRandom(0, this.carPrefabArr.length - 1);
        var car = Laya.Pool.getItemByCreateFun(carIndex.toString(), function(){return this.carPrefabArr[carIndex].create()}, this);
        Laya.stage.getChildAt(0).addChild(car);
        car.pos(x, y);
        car.getComponent(Car).Init(carIndex.toString());
        this.carSpawnArr.push(car);
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

    gameOver()
    {
        this.carSpawnArr.forEach(element =>{
            element.removeSelf();
        })
    }
}