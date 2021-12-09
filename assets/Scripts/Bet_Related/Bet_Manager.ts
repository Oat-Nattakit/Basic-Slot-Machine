// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { CreateBet, Data_Play } from "../Commence_Class/class_Pattern";

const { ccclass, property } = cc._decorator;

export class Bet_Manager {

    private static _insBetManager: Bet_Manager = new Bet_Manager();
    private _betPrice: CreateBet = null;
    private _countBet: number = 0;

    private _countLine: number = 0;
    private _maxLine: number = 0;

    constructor() {

        Bet_Manager._insBetManager = this;
    }

    public static getInstanceBet(): Bet_Manager {

        if (Bet_Manager._insBetManager._betPrice == null) {            
            Bet_Manager._insBetManager._betPrice = new CreateBet();
        }
        return Bet_Manager._insBetManager;
    }

    public betControl(_data: Data_Play, _valueChange: number) {

        const maxBetStep = this._betPrice.betOrder.length - 1;
        this._countBet = cc.misc.clampf(this._countBet + _valueChange, 0, maxBetStep);
        _data.bet_size = this._betPrice.betOrder[this._countBet];
    }

    public lineBetStart(_maxLine: number): number {

        this._countLine = _maxLine;
        this._maxLine = _maxLine;
        return this._countLine;
    }

    public lineControl(_data: Data_Play, _lineValueChange: number = 0) {
        
        _data.line = cc.misc.clampf(_data.line + _lineValueChange, 1, this._maxLine);
    }
}