// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { CreatePayLine } from "../Commence_Class/class_Pattern";
import { Reel_Number, TypePayout } from "../Commence_Class/enum_Pattern";

const { ccclass, property } = cc._decorator;

export class Payline_Manager {

    private static _insPaylineManager: Payline_Manager = new Payline_Manager();
    private _slotNumberlist: number[] = null;
    private _payline: CreatePayLine = null;

    public paylineList : number[][] = new Array();

    private _bonusPosition: number[];

    private _paylineHitReward: number[];

    constructor() {

        Payline_Manager._insPaylineManager = this;
    }

    public static getinstancePayline(): Payline_Manager {

        if (Payline_Manager._insPaylineManager._payline == null) {
            Payline_Manager._insPaylineManager._payline = new CreatePayLine();
            Payline_Manager._insPaylineManager._createPayline();
        }
        return Payline_Manager._insPaylineManager;
    }

    public managePayline(_idSymbolList: number[]) {

        this._slotNumberlist = _idSymbolList;
    }

    private _createPayline() {

        this.paylineList = this._payline.CreatePaylineList();
    }

    public checkPaylineReward(_lineBet: number) {

        this._bonusPosition = new Array();
        this._paylineHitReward = new Array();

        for (let i = 0; i < _lineBet; i++) {

            let reelRow = this.paylineList[i];

            let idSymbolCol1 = this._slotNumberlist[reelRow[Reel_Number.reel_1]];
            let idSymbolCol2 = this._slotNumberlist[reelRow[Reel_Number.reel_2]];
            let idSymbolCol3 = this._slotNumberlist[reelRow[Reel_Number.reel_3]];

            let _checkSymbolFirstCouple = this._payoutCheck(idSymbolCol1,idSymbolCol2);
            let _checkSymbolSecCouple = this._payoutCheck(idSymbolCol2,idSymbolCol3);

            if (_checkSymbolFirstCouple == true && _checkSymbolSecCouple == true) {

                this._collectBonusPayout3(i);
            }
            else if (_checkSymbolFirstCouple == true) {

                this._collectBonusPayout2(i);
            }
        }
    }

    private _payoutCheck(_idSymbolPos1: number, _idSymbolPos2: number) : boolean {        
        return _idSymbolPos1 == _idSymbolPos2;
    }

    private _collectBonusPayout2(_linePayout: number) {

        for (let _symbolOrder = 0; _symbolOrder < TypePayout._payout2; _symbolOrder++) {
            this._collectPositionSlotBonus(this.paylineList[_linePayout][_symbolOrder]);
        }
        this._collectLinePayout(_linePayout);
    }

    private _collectBonusPayout3(_linePayout: number) {

        for (let _symbolOrder = 0; _symbolOrder < TypePayout._payout3; _symbolOrder++) {
            this._collectPositionSlotBonus(this.paylineList[_linePayout][_symbolOrder]);
        }
        this._collectLinePayout(_linePayout);
    }

    private _collectPositionSlotBonus(_slotBonusePosition: number) {

        this._bonusPosition.push(_slotBonusePosition);
    }

    private _collectLinePayout(_linePayout: number) {

        this._paylineHitReward.push(_linePayout);
    }

    public positionBonuse() {

        return this._bonusPosition;
    }
    public paylineReward() {

        return this._paylineHitReward;
    }
}
