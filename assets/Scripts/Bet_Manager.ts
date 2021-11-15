// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { CreateBet, Data_Play } from "./interfaceClass";

const { ccclass, property } = cc._decorator;

export class Bet_Manager {

    private static _insBet_Manager: Bet_Manager = new Bet_Manager();
    private _bet_Price: CreateBet = null;
    private _countBet: number = 0;

    private _countLine: number = 0;
    private _maxLine: number = 0;

    constructor() {
        Bet_Manager._insBet_Manager = this;
    }

    public static getInstance_Bet(): Bet_Manager {
        if (Bet_Manager._insBet_Manager._bet_Price == null) {            
            Bet_Manager._insBet_Manager._bet_Price = new CreateBet();
        }
        return Bet_Manager._insBet_Manager;
    }

    public bet_Control(_data: Data_Play, _valueChange: number) {

        const maxBetStep = this._bet_Price.bet_Order.length - 1;
        this._countBet = cc.misc.clampf(this._countBet + _valueChange, 0, maxBetStep);
        _data.bet_size = this._bet_Price.bet_Order[this._countBet];
    }

    public lineBet_Start(_maxLine: number): number {
        this._countLine = _maxLine;
        this._maxLine = _maxLine;
        return this._countLine;
    }

    public line_Control(_data: Data_Play, _lineValueChange: number = 0) {
        _data.line = cc.misc.clampf(_data.line + _lineValueChange, 1, this._maxLine);
    }
}