// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Bet_Manager } from "./Bet_Manager";
import { Payline_Manager, SlotLine } from "./Payline_Manager";
import Reel_Description from "./Reel_Description";
import { Server_Manager } from "./Server_Manager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Reel_Control extends cc.Component {

    @property(cc.Node)
    private SlotNode: cc.Node[] = new Array();

    @property(cc.Node)
    public ReelNode: cc.Node[] = new Array();

    private ReelAnimation: cc.Animation[];
    public Reel_Button: cc.Button[];

    @property(cc.SpriteFrame)
    private Picture_Symbol: cc.SpriteFrame[] = new Array();

    private SlotSymbol_ID: number[] = new Array();

    private Payline: Payline_Manager;
    private Server_: Server_Manager;

    private NumberReel_Slot: number[] = new Array();
    private Stack_ReelRun: boolean[] = new Array();

    start() {

        this.Payline = Payline_Manager.GetIns_();
        this.Server_ = Server_Manager.getInstant();        
        
        this.GetComponentInNode();
        this.PreGame_RandomPicture();
    }

    private GetComponentInNode() {

        this.ReelAnimation = new Array(this.ReelNode.length);
        for (let i = 0; i < this.ReelNode.length; i++) {
            this.ReelNode[i].addComponent(Reel_Description).Reel_Description = (i);
            this.ReelAnimation[i] = (this.ReelNode[i].getComponent(cc.Animation));
        }
    }

    public SetDefult_Blackground() {

        for (let i = 0; i < this.SlotNode.length; i++) {
            let ParentBg_ = this.SlotNode[i].getParent();
            this.SlotNode[i].opacity = 255;
            ParentBg_.color = cc.Color.BLACK;
        }
    }

    private PreGame_SetSymbolID(): number[] {
        let PreID: number[] = new Array();
        for (let i = 0; i < this.SlotNode.length; i++) {
            PreID.push(Math.floor(Math.random() * 5));
        }
        return PreID;
    }

    private PreGame_RandomPicture() {

        this.NumberReel_Slot = [Reel_Number.Reel_1, Reel_Number.Reel_2, Reel_Number.Reel_3];
        this.SlotSymbol_ID = this.PreGame_SetSymbolID();
        for (let i = 0; i < this.SlotNode.length; i++) {
            this.SlotNode[i].scale = 0.9;
            let GetSp = this.SlotNode[i].getComponent(cc.Sprite);
            GetSp.spriteFrame = this.Picture_Symbol[this.SlotSymbol_ID[i]];
        }
    }

    private async GetSymbol_ID_FromServer() {
        
        await this.Server_.slot_GetSymbolValue();
        this.SlotSymbol_ID = this.Server_.slot_Result();
        this.Payline.ManagePayline(this.SlotSymbol_ID);
    }

    public Set_SlotSymbol() {
        
        if (this.Stack_ReelRun.length == 0) {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(this.GetSymbol_ID_FromServer());
                }, 0);
            });            
        }
    }

    public Reel_PlayAnimation(Button_Reel: cc.Button, ReelNumber: number) {
       
        this.ReelAnimation[ReelNumber].play();
        this.NumberReel_Slot[ReelNumber] = -1;
        Button_Reel.enabled = false;        
        return this.ReelAnimation[ReelNumber];
    }

    /*public All_Reel_PlayAniamtion() {

        let WaitingTime = 0;
        
        for (let i = 0; i < this.ReelAnimation.length; i++) {
            if (this.NumberReel_Slot[i] != -1) {
                this.ReelNode[i].getComponent(cc.Button).enabled = false;
                setTimeout(() => this.ReelAnimation[i].play(), WaitingTime);
                WaitingTime += 150;
            }
        }
        return this.ReelAnimation[this.ReelAnimation.length - 1];
    }*/
    /*testSlow(ReelSlot: number){
        let TestSpeed : cc.AnimationState = this.ReelAnimation[ReelSlot].getAnimationState("ReelAnimation");
        TestSpeed.speed = 0.5;
    }*/

    public SetPicture_Slot(ReelSlot: number) {

        this.ReelAnimation[ReelSlot].stop();

        if (ReelSlot == 0) {
            this.RoundShowSlot(SlotLine.Slot_0, SlotLine.Slot_3);
        }
        else if (ReelSlot == 1) {
            this.RoundShowSlot(SlotLine.Slot_3, SlotLine.Slot_6);
        }
        else if (ReelSlot == 2) {
            this.RoundShowSlot(SlotLine.Slot_6, this.SlotNode.length);
        }
        if (this.Stack_ReelRun.length == this.ReelNode.length) {           
            this.Reset_Slot();
        }
    }

    private RoundShowSlot(Min: number, Max: number) {
        for (let i = Min; i < Max; i++) {
            let GetSp = this.SlotNode[i].getComponent(cc.Sprite);
            this.SlotNode[i].opacity = 120;
            GetSp.spriteFrame = this.Picture_Symbol[this.SlotSymbol_ID[i]];
        }
        this.Stack_ReelRun.push(true);
    }

    private Reset_Slot() {
        this.Stack_ReelRun = new Array();
        this.NumberReel_Slot = [Reel_Number.Reel_1, Reel_Number.Reel_2, Reel_Number.Reel_3];
        for (let i = 0; i < this.ReelNode.length; i++) {
            this.Reel_Button[i].enabled = true;
        }
    }

    public SlotBonus(): cc.Node[] {

        let Payline_BlackGroung = this.Payline.PositionBonuse();
        let Node_BG: cc.Node[] = new Array();

        for (let i = 0; i < Payline_BlackGroung.length; i++) {

            let ParentBg_ = this.SlotNode[Payline_BlackGroung[i]].getParent();
            Node_BG.push(ParentBg_);
        }
        return Node_BG;
    }
}

export enum Reel_Number {
    Reel_1 = 0,
    Reel_2 = 1,
    Reel_3 = 2,
}