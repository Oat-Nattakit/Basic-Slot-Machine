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
    private slotNode: cc.Node[] = new Array();

    @property(cc.Node)
    public reelNode: cc.Node[] = new Array();

    private _reelAnimation: cc.Animation[];
    public reel_Button: cc.Button[];

    @property(cc.SpriteFrame)
    private picture_Symbol: cc.SpriteFrame[] = new Array();    

    private _payline: Payline_Manager;
    private _server: Server_Manager;
    
    private _slotSymbol_ID: number[] = new Array();
    private _numberReel_Slot: number[] = new Array();
    private _stack_ReelRun: boolean[] = new Array();

    start() {

        this._payline = Payline_Manager.getPayline_Manager();
        this._server = Server_Manager.getInstant();        
        
        this._getComponentInNode();
        this._preGame_RandomPicture();
    }

    private _getComponentInNode() {

        this._reelAnimation = new Array(this.reelNode.length);

        for (let i = 0; i < this.reelNode.length; i++) {
            this.reelNode[i].addComponent(Reel_Description).reel_Description = (i);
            this._reelAnimation[i] = (this.reelNode[i].getComponent(cc.Animation));
        }
    }

    public setDefult_Blackground() {

        for (let i = 0; i < this.slotNode.length; i++) {
            let _parentBg_ = this.slotNode[i].getParent();
            this.slotNode[i].opacity = 255;
            _parentBg_.color = cc.Color.BLACK;
        }
    }

    private _preGame_SetSymbolID(): number[] {

        let _preID: number[] = new Array();
        for (let i = 0; i < this.slotNode.length; i++) {
            _preID.push(Math.floor(Math.random() * 5));
        }
        return _preID;
    }

    private _preGame_RandomPicture() {

        this._numberReel_Slot = [Reel_Number.reel_1, Reel_Number.reel_2, Reel_Number.reel_3];
        this._slotSymbol_ID = this._preGame_SetSymbolID();

        for (let i = 0; i < this.slotNode.length; i++) {
            this.slotNode[i].scale = 0.9;
            let _getSprite = this.slotNode[i].getComponent(cc.Sprite);
            _getSprite.spriteFrame = this.picture_Symbol[this._slotSymbol_ID[i]];
        }
    }

    private async _getSymbol_ID_FromServer() {
        
        await this._server.slot_GetSymbolValue();
        this._slotSymbol_ID = this._server.slot_Result();
        this._payline.managePayline(this._slotSymbol_ID);
    }

    public set_SlotSymbol() {
        
        if (this._stack_ReelRun.length == 0) {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(this._getSymbol_ID_FromServer());
                }, 0);
            });            
        }
    }

    public reel_PlayAnimation(_button_Reel: cc.Button, _reelNumber: number) {
       
        this._reelAnimation[_reelNumber].play();
        this._numberReel_Slot[_reelNumber] = -1;
        _button_Reel.enabled = false;        
        return this._reelAnimation[_reelNumber];
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

    public _setPicture_Slot(_reelNumber: number) {

        this._reelAnimation[_reelNumber].stop();

        if (_reelNumber == 0) {
            this._roundShowSlot(SlotLine.slot_0, SlotLine.slot_3);
        }
        else if (_reelNumber == 1) {
            this._roundShowSlot(SlotLine.slot_3, SlotLine.slot_6);
        }
        else if (_reelNumber == 2) {
            this._roundShowSlot(SlotLine.slot_6, this.slotNode.length);
        }
        if (this._stack_ReelRun.length == this.reelNode.length) {           
            this._reset_Slot();
        }
    }

    private _roundShowSlot(_minlist: number, _maxlist: number) {

        for (let i = _minlist; i < _maxlist; i++) {
            let _getSprite = this.slotNode[i].getComponent(cc.Sprite);
            this.slotNode[i].opacity = 120;
            _getSprite.spriteFrame = this.picture_Symbol[this._slotSymbol_ID[i]];
        }
        this._stack_ReelRun.push(true);
    }

    private _reset_Slot() {

        this._stack_ReelRun = new Array();
        this._numberReel_Slot = [Reel_Number.reel_1, Reel_Number.reel_2, Reel_Number.reel_3];
        for (let i = 0; i < this.reelNode.length; i++) {
            this.reel_Button[i].enabled = true;
        }
    }

    public slotBonus(): cc.Node[] {

        let _payline_BackGround = this._payline.positionBonuse();
        let _node_BG: cc.Node[] = new Array();

        for (let i = 0; i < _payline_BackGround.length; i++) {
            let ParentBg_ = this.slotNode[_payline_BackGround[i]].getParent();
            _node_BG.push(ParentBg_);
        }
        return _node_BG;
    }
}

export enum Reel_Number {
    reel_1 = 0,
    reel_2 = 1,
    reel_3 = 2,
}