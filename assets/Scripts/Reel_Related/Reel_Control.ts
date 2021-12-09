// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Payline_Manager } from "../Bet_Related/Payline_Manager";
import { animation_Command, SlotLine } from "../Commence_Class/enum_Pattern";
import Game_Control from "../GameControl_Related/Game_Control";
import { Server_Manager } from "../Server_Related/Server_Manager";
import Reel_Description from "./Reel_Description";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Reel_Control extends cc.Component {

    @property(cc.Node)
    private slotNode: cc.Node[] = new Array();

    @property(cc.Node)
    public reelNode: cc.Node[] = new Array();

    @property(cc.Animation)
    private reelAnimation: cc.Animation[] = new Array();

    public reelButton: cc.Button[];

    @property(cc.SpriteFrame)
    private picture_Symbol: cc.SpriteFrame[] = new Array();

    private _payline: Payline_Manager;
    private _server: Server_Manager;

    private _slotSymbolID: number[] = new Array();
    private _stackReelStop: boolean[] = new Array();
    public stackReelSpin: number[] = new Array();

    start() {

        this._payline = Payline_Manager.getinstancePayline();
        this._server = Server_Manager.getinstanceServer();

        this._getComponentInNode();
        this._preGameRandomPicture();
    }

    private _getComponentInNode() {

        for (let i = 0; i < this.reelNode.length; i++) {
            this.reelNode[i].addComponent(Reel_Description).reel_Description = (i);
            this.reelAnimation[i].node.getComponent(cc.Layout).enabled = false;
            let getStage = this.reelAnimation[i].getAnimationState(animation_Command.reel_Animation);
            getStage.speed = 2;
        }
    }

    public setDefultBackground() {

        for (let i = 0; i < this.slotNode.length; i++) {
            let _parentBg = this.slotNode[i].getParent();
            this.slotNode[i].opacity = 255;
            _parentBg.color = cc.Color.BLACK;
        }
    }

    private _preGameSetSymbolID(): number[] {

        let _preID: number[] = new Array();
        for (let i = 0; i < this.slotNode.length; i++) {
            _preID.push(Math.floor(Math.random() * this.picture_Symbol.length));
        }
        return _preID;
    }

    private _preGameRandomPicture() {

        this._slotSymbolID = this._preGameSetSymbolID();

        for (let i = 0; i < this.slotNode.length; i++) {
            this.slotNode[i].scale = 0.9;
            let _getSprite = this.slotNode[i].getComponent(cc.Sprite);
            _getSprite.spriteFrame = this.picture_Symbol[this._slotSymbolID[i]];
        }
    }

    public async isRequestSymbolIDFromServer(): Promise<void> {

        return new Promise(resolve => {
            setTimeout(() => {
                resolve(this.getDataslot())
            });
        });
    }

    private getDataslot() {

        this._slotSymbolID = this._server.slotGetSymbolValue();
        this._payline.managePayline(this._slotSymbolID);
    }

    public reelPlayAnimation(_button_Reel: cc.Button, _reelNumber: number) {

        this.reelNode[_reelNumber].active = false;
        this.reelAnimation[_reelNumber].node.active = true;
        this.reelAnimation[_reelNumber].play();
        _button_Reel.enabled = false;
        this.stackReelSpin.push(_reelNumber);
    }

    public setPictureSlot(_reelNumber: number, _gameControl: Game_Control) {

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
        if (this._stackReelStop.length == this.reelNode.length) {
            _gameControl.checkPlayerReward();
            this._resetSlot();
        }
       
    }

    private _roundShowSlot(_minlist: number, _maxlist: number) {

        for (let i = _minlist; i < _maxlist; i++) {
            let _getSprite = this.slotNode[i].getComponent(cc.Sprite);
            this.slotNode[i].opacity = 120;
            _getSprite.spriteFrame = this.picture_Symbol[this._slotSymbolID[i]];
        }
        this._stackReelStop.push(true);        
    }

    private _resetSlot() {

        this._stackReelStop = new Array();
        this.stackReelSpin = new Array();

        for (let i = 0; i < this.reelNode.length; i++) {
            this.reelButton[i].enabled = true;
        }
    }

    public slotBonus(): cc.Node[] {

        let _paylineBackground = this._payline.positionBonuse();
        let _backgroundList: cc.Node[] = new Array();

        for (let i = 0; i < _paylineBackground.length; i++) {
            let _parentBackground = this.slotNode[_paylineBackground[i]].getParent();
            _backgroundList.push(_parentBackground);
        }
        return _backgroundList;
    }
}