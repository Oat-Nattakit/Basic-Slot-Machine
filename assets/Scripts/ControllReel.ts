// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;
import StopReel from "./StopReel";

@ccclass
export default class ControllReel extends cc.Component {

    @property(cc.Node)
    private SlotAni_: cc.Node[] = new Array();

    @property(cc.SpriteFrame)
    private All_Picture: cc.SpriteFrame[] = new Array();

    @property()
    private SetNumber: number[] = new Array();

    start() {

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.ReelRun, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.ReelStop, this);
        this.RandomPicture();
    }

    RandomPicture() {
        for (let i = 0; i < this.SlotAni_.length; i++) {
            this.SetNumber[i] = Math.floor(Math.random() * this.All_Picture.length);
            let GetSp = this.SlotAni_[i].getComponent(cc.Sprite);            
            GetSp.spriteFrame = this.All_Picture[this.SetNumber[i]];
        }
    }



    StartReelRun() {

        for (let i = 0; i < this.SlotAni_.length; i++) {
            let GetAni = this.SlotAni_[i].getComponent(cc.Animation);
            GetAni.play();
        }
        for (let i = 0; i < this.SlotAni_.length; i++) {
            this.SetNumber[i] = Math.floor(Math.random() * this.All_Picture.length);
        }


    }

    StopReel() {
        for (let i = 0; i < this.SlotAni_.length; i++) {
            let GetAni = this.SlotAni_[i].getComponent(cc.Animation);
            GetAni.stop();
            let GetSp = this.SlotAni_[i].getComponent(cc.Sprite);
            GetSp.spriteFrame = this.All_Picture[this.SetNumber[i]];
        }
    }


    ReelRun(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.q:
                this.StartReelRun();
                break;
        }
    }

    ReelStop(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.space:
                this.StopReel();
                break;
        }
    }
}

