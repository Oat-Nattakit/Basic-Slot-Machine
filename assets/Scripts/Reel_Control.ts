// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Payline_Manager } from "./Payline_Manager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Reel_Control extends cc.Component {

    @property(cc.Node)
    private SlotNode: cc.Node[] = new Array();

    @property(cc.Animation)
    private ReelAnimation: cc.Animation[] = new Array();

    @property(cc.SpriteFrame)
    private Picture_Symbol: cc.SpriteFrame[] = new Array();

    private SetNumber: number[] = new Array();

    private CheckPayline: Payline_Manager;

    start() {

        this.CheckPayline = Payline_Manager.GetIns_();
        this.RandomPicture();
    }

    private RandomPicture() {

        for (let i = 0; i < this.SlotNode.length; i++) {

            this.SetNumber.push(Math.floor(Math.random() * this.Picture_Symbol.length));
            let GetSp = this.SlotNode[i].getComponent(cc.Sprite);
            GetSp.spriteFrame = this.Picture_Symbol[this.SetNumber[i]];
        }
    }

    public StartReelRun() {


        let WaitingTime = 0;
        for (let i = 0; i < this.ReelAnimation.length; i++) {
            setTimeout(() => this.ReelAnimation[i].play(), WaitingTime);
            WaitingTime += 150;
        }
        for (let i = 0; i < this.SlotNode.length; i++) {
            this.SetNumber[i] = Math.floor(Math.random() * this.Picture_Symbol.length);
        }
    }

    public StopReel(CountLineBet : number) {

        let WaitingTime = 0;
        for (let i = 0; i < this.ReelAnimation.length; i++) {

            setTimeout(() => this.SetPicture_Slot(i,CountLineBet), WaitingTime);
            WaitingTime += 150;
        }
    }

    private SetPicture_Slot(ReelSlot: number,CountLineBet : number) {

        this.ReelAnimation[ReelSlot].stop();

        if (ReelSlot == 0) {
            this.RoundShowSlot(0, 3);
        }
        else if (ReelSlot == 1) {
            this.RoundShowSlot(3, 6);
        }
        else if (ReelSlot == 2) {
            this.RoundShowSlot(6, 9);
            this.CheckPayline.ManagePayline(this.SetNumber,CountLineBet);            
        }        
    }

    private RoundShowSlot(Min: number, Max: number) {
        for (let i = Min; i < Max; i++) {
            let GetSp = this.SlotNode[i].getComponent(cc.Sprite);
            GetSp.spriteFrame = this.Picture_Symbol[this.SetNumber[i]];
        }
    }
}

