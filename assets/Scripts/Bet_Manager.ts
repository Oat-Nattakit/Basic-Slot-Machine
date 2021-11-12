// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { CreateBet } from "./interfaceClass";
import { Data_Play } from "./Server_Manager";

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

    public static getIns(): Bet_Manager {
        if (Bet_Manager._insBet_Manager._bet_Price == null) {            
            Bet_Manager._insBet_Manager._bet_Price = new CreateBet();
        }
        return Bet_Manager._insBet_Manager;
    }

    /*public bet_StartValue() {
        let _startBet = this._bet_Price.betStep[0];        
        return _startBet;
    }*/ 

    public bet_Control(_data: Data_Play, _valueChange: number) {

        const maxBetStep = this._bet_Price.betStep.length - 1;
        this._countBet = cc.misc.clampf(this._countBet + _valueChange, 0, maxBetStep);
        _data.bet_size = this._bet_Price.betStep[this._countBet];
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

/*export enum Bet_Price {
    bet_Price1 = 1,
    bet_Price2 = 2,
    bet_Price3 = 5,
    bet_Price4 = 10,
    bet_Price5 = 50,
    bet_Price6 = 100,
}

interface Bet_Step {
    betStep: number[];
}

class CreateBet implements Bet_Step {

    public betStep: number[];

    constructor() {
        this.betStep = [Bet_Price.bet_Price1, Bet_Price.bet_Price2, Bet_Price.bet_Price3, Bet_Price.bet_Price4, Bet_Price.bet_Price5, Bet_Price.bet_Price6];
    }
}*/
