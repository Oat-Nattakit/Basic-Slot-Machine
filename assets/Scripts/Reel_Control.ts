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

    private SetNumber: number[] = new Array();

    private CheckPayline: Payline_Manager;
    private BetSystem: Bet_Manager;
    private Server_: Server_Manager;

    private Stack_ReelRun: number = 0;
    private CountLineBet: number = 0;

    private NumberReel_Slot: number[] = new Array();

    start() {
        this.CheckPayline = Payline_Manager.GetIns_();
        this.BetSystem = Bet_Manager.GetIns();
        this.Server_ = Server_Manager.Getinstant();

        this.Server_.Set_Slot_Range(this.SlotNode.length);
        this.GetComponentInNode();
        this.RandomPicture();
    }

    private GetComponentInNode() {
        this.ReelAnimation = new Array(this.ReelNode.length);
        for (let i = 0; i < this.ReelNode.length; i++) {
            this.ReelNode[i].addComponent(Reel_Description).Reel_Description = (i);
            this.ReelAnimation[i] = (this.ReelNode[i].getComponent(cc.Animation));
        }
    }

    private SetDefult_Blackground() {
        for (let i = 0; i < this.SlotNode.length; i++) {
            let ParentBg_ = this.SlotNode[i].getParent();
            this.SlotNode[i].opacity = 255;
            ParentBg_.color = cc.Color.BLACK;
        }
    }

    private RandomPicture() {
        this.SetNumber = this.Server_.Slot_Result();
        for (let i = 0; i < this.SlotNode.length; i++) {            
            let GetSp = this.SlotNode[i].getComponent(cc.Sprite);
            GetSp.spriteFrame = this.Picture_Symbol[this.SetNumber[i]];
        }
    }

    private RandomResult() {
        if (this.Stack_ReelRun == 0) {
            this.SetNumber = this.Server_.Slot_Result();
        }
        this.NumberReel_Slot = [Reel_Number.Reel_1, Reel_Number.Reel_2, Reel_Number.Reel_3];
    }

    public Run_Reel_Once(Button_Reel: cc.Button, ReelNumber: number) {
        if (this.Stack_ReelRun == 0) {
            this.SetDefult_Blackground();
            this.RandomResult();
            this.CountLineBet = this.BetSystem.Current_LineBet();
        }
        this.Stack_ReelRun++;
        this.NumberReel_Slot[ReelNumber] = -1;
        Button_Reel.enabled = false;
    }

    public Run_Reel_All() {
        let WaitingTime = 0;
        this.SetDefult_Blackground();
        this.RandomResult();
        this.CountLineBet = this.BetSystem.Current_LineBet();

        for (let i = 0; i < this.ReelAnimation.length; i++) {
            if (this.NumberReel_Slot[i] != -1) {
                this.ReelNode[i].getComponent(cc.Button).enabled = false;
                setTimeout(() => this.ReelAnimation[i].play(), WaitingTime);
                WaitingTime += 150;
            }
        }
    }

    public StopReel_Once(NumberReel: number, Reel_Animation: cc.Animation) {
        Reel_Animation.stop();
        if (NumberReel == 0) {
            this.RoundShowSlot(SlotLine.Slot_0, SlotLine.Slot_3);
        }
        else if (NumberReel == 1) {
            this.RoundShowSlot(SlotLine.Slot_3, SlotLine.Slot_6);
        }
        else if (NumberReel == 2) {
            this.RoundShowSlot(SlotLine.Slot_6, this.SlotNode.length);
        }
        if(this.Stack_ReelRun == this.ReelNode.length){
            setTimeout(() =>this.Slot_Setresult(), 300);            
        }
    }

    public StopReel_All() {
        let WaitingTime = 0;
        for (let i = 0; i < this.ReelAnimation.length; i++) {
            setTimeout(() => this.SetPicture_Slot(i), WaitingTime);
            WaitingTime += 150;
        }
    }

    private Slot_Setresult() {
        this.CheckPayline.ManagePayline(this.SetNumber, this.CountLineBet);        
        this.Stack_ReelRun = 0;
        for (let i = 0; i < this.ReelNode.length; i++) {
            this.Reel_Button[i].enabled = true;
        }
    }

    private SetPicture_Slot(ReelSlot: number) {
        this.ReelAnimation[ReelSlot].stop();

        if (ReelSlot == 0) {
            this.RoundShowSlot(SlotLine.Slot_0, SlotLine.Slot_3);
        }
        else if (ReelSlot == 1) {
            this.RoundShowSlot(SlotLine.Slot_3, SlotLine.Slot_6);
        }
        else if (ReelSlot == 2) {
            this.RoundShowSlot(SlotLine.Slot_6, this.SlotNode.length);
            this.Slot_Setresult();
        }
    }

    public SlotBonus() : cc.Node[]{
        let Payline_BlackGroung = this.CheckPayline.PositionBonuse();
        let Node_BG : cc.Node[] = new Array();
        for (let i = 0; i < Payline_BlackGroung.length; i++) {
            let ParentBg_ = this.SlotNode[Payline_BlackGroung[i]].getParent();
            Node_BG.push(ParentBg_);            
        }
        return Node_BG;
    }

    private RoundShowSlot(Min: number, Max: number) {
        for (let i = Min; i < Max; i++) {
            let GetSp = this.SlotNode[i].getComponent(cc.Sprite);
            this.SlotNode[i].opacity = 120;
            GetSp.spriteFrame = this.Picture_Symbol[this.SetNumber[i]];
        }
    }
}

export enum Reel_Number {
    Reel_1 = 0,
    Reel_2 = 1,
    Reel_3 = 2,
}