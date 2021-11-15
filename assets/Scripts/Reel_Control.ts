// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { SlotLine } from "./interfaceClass";
import { Payline_Manager } from "./Payline_Manager";
import Reel_Description from "./Reel_Description";
import { Server_Manager } from "./Server_Manager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Reel_Control extends cc.Component {

    @property(cc.Node)
    private slotNode: cc.Node[] = new Array();

    @property(cc.Node)
    public reelNode: cc.Node[] = new Array();

    @property(cc.Animation)
    private reelAnimation: cc.Animation[] = new Array();

    public reel_Button: cc.Button[];

    @property(cc.SpriteFrame)
    private picture_Symbol: cc.SpriteFrame[] = new Array();

    private _payline: Payline_Manager;
    private _server: Server_Manager;

    private _slotSymbol_ID: number[] = new Array();
    private _stack_ReelRun: boolean[] = new Array();

    start() {

        this._payline = Payline_Manager.getinstance_Payline();
        this._server = Server_Manager.getinstance_Server();

        this._getComponentInNode();
        this._preGame_RandomPicture();
    }

    private _getComponentInNode() {

        for (let i = 0; i < this.reelNode.length; i++) {
            this.reelNode[i].addComponent(Reel_Description).reel_Description = (i);
            this.reelAnimation[i].node.getComponent(cc.Layout).enabled = false;
            let getStage = this.reelAnimation[i].getAnimationState("reelSpin_animation");
            getStage.speed = 2;
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

        this._slotSymbol_ID = this._preGame_SetSymbolID();

        for (let i = 0; i < this.slotNode.length; i++) {
            this.slotNode[i].scale = 0.9;
            let _getSprite = this.slotNode[i].getComponent(cc.Sprite);
            _getSprite.spriteFrame = this.picture_Symbol[this._slotSymbol_ID[i]];
        }
    }

    public async _getSymbol_ID_FromServer(): Promise<void> {

        return new Promise(resolve => {
            setTimeout(() => {
                resolve(this.getDataslot())
            }, 1000)
        });


    }
    private getDataslot() {
        this._slotSymbol_ID = this._server.slot_GetSymbolValue();
        console.log(this._slotSymbol_ID);
        this._payline.managePayline(this._slotSymbol_ID);
    }

    public reel_PlayAnimation(_button_Reel: cc.Button, _reelNumber: number) {

        this.reelNode[_reelNumber].active = false;
        this.reelAnimation[_reelNumber].node.active = true;
        this.reelAnimation[_reelNumber].play();
        _button_Reel.enabled = false;

        return this.reelAnimation[_reelNumber];

    }

    public _setPicture_Slot(_reelNumber: number) {

        this.reelAnimation[_reelNumber].stop();
        this.reelAnimation[_reelNumber].node.active = false;
        this.reelNode[_reelNumber].active = true;

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
        for (let i = 0; i < this.reelNode.length; i++) {
            this.reel_Button[i].enabled = true;
        }

    }

    public slotBonus(): cc.Node[] {

        let _payline_BackGround = this._payline.positionBonuse();
        let _background_list: cc.Node[] = new Array();

        for (let i = 0; i < _payline_BackGround.length; i++) {
            let _parentBackground = this.slotNode[_payline_BackGround[i]].getParent();
            _background_list.push(_parentBackground);
        }
        return _background_list;
    }
}