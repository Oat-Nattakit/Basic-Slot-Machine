// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Reel_Number } from "./Reel_Control";

const { ccclass, property } = cc._decorator;

export class Payline_Manager {

    private static _insPayline_Manager: Payline_Manager = new Payline_Manager();
    private _slotNumber_list: number[] = null;
    private _payline: CreatePayLine = null;

    public payline_List = new Array();

    private _bonus_Position: number[];

    private _payline_HitReward: number[];

    private _listSymbol2: number[];
    private _listSymbol3: number[];

    constructor() {
        Payline_Manager._insPayline_Manager = this;
    }

    public static getPayline_Manager(): Payline_Manager {
        if (Payline_Manager._insPayline_Manager._payline == null) {
            Payline_Manager._insPayline_Manager._payline = new CreatePayLine();
            Payline_Manager._insPayline_Manager._createPayline();
        }
        return Payline_Manager._insPayline_Manager;
    }

    public managePayline(_idSymbol_list: number[]) {

        this._slotNumber_list = _idSymbol_list;
        this._listSymbol2 = new Array();
        this._listSymbol3 = new Array();

    }

    private _createPayline() {
        this.payline_List = this._payline.CreatePaylineList();
    }

    public checkPayLine_Reward(_line_Bet: number) {

        this._bonus_Position = new Array();
        this._payline_HitReward = new Array();

        for (let i = 0; i < _line_Bet; i++) {

            let _check_PayoutType2 = this._payoutCheck(this._slotNumber_list[this.payline_List[i][Reel_Number.reel_1]], this._slotNumber_list[this.payline_List[i][Reel_Number.reel_2]]);
            let _check_PayoutType3 = this._payoutCheck(this._slotNumber_list[this.payline_List[i][Reel_Number.reel_2]], this._slotNumber_list[this.payline_List[i][Reel_Number.reel_3]]);

            if (_check_PayoutType2 == true && _check_PayoutType3 == true) {

                let _range_Payout3 = 3;
                for (let j = 0; j < _range_Payout3; j++) {
                    this._collectPositionSlot_Bonus(this.payline_List[i][j]);
                }
                this._payline_HitReward.push(i);
                let _symbol = this._slotNumber_list[this.payline_List[i][Reel_Number.reel_1]];
                this._payoutSymbol_Bonus(TypePayout._payout3, _symbol);
            }
            else if (_check_PayoutType2 == true) {

                let _range_Payout2 = 2;
                for (let j = 0; j < _range_Payout2; j++) {
                    this._collectPositionSlot_Bonus(this.payline_List[i][j]);
                }
                this._payline_HitReward.push(i);
                let _symbol = this._slotNumber_list[this.payline_List[i][Reel_Number.reel_1]];
                this._payoutSymbol_Bonus(TypePayout._payout2, _symbol);
            }
        }
    }

    private _payoutCheck(_idSymbolPos1: number, _idSymbolPos2: number) {

        let _payoutHitReward: boolean = false;
        if (_idSymbolPos1 == _idSymbolPos2) {
            _payoutHitReward = true;
        }
        return _payoutHitReward
    }

    private _collectPositionSlot_Bonus(_slotBonuse_Position: number) {
        this._bonus_Position.push(_slotBonuse_Position);
    }

    public positionBonuse() {
        return this._bonus_Position;
    }
    public payline_Reward() {
        return this._payline_HitReward;
    }

    private _payoutSymbol_Bonus(_payout_Type: number, _idSymbol: number) {

        if (_payout_Type == TypePayout._payout2) {
            this._listSymbol2.push(_idSymbol);
        }
        else if (_payout_Type == TypePayout._payout3) {
            this._listSymbol3.push(_idSymbol);
        }
    }

    public stackSymbol_Payout2() {
        return this._listSymbol2;
    }

    public stackSymbol_Payout3() {
        return this._listSymbol3;
    }
}

enum TypePayout {
    _payout2 = 2,
    _payout3 = 3,
}

export enum SlotLine {
    slot_0 = 0,
    slot_1 = 1,
    slot_2 = 2,
    slot_3 = 3,
    slot_4 = 4,
    slot_5 = 5,
    slot_6 = 6,
    slot_7 = 7,
    slot_8 = 8,
}

enum PayoutCount2 {
    _payoutType2_0 = 5,
    _payoutType2_1 = 7,
    _payoutType2_2 = 10,
    _payoutType2_3 = 15,
    _payoutType2_4 = 30,
}

enum PayoutCount3 {
    _payoutType3_0 = 10,
    _payoutType3_1 = 20,
    _payoutType3_2 = 50,
    _payoutType3_3 = 100,
    _payoutType3_4 = 500,
}

interface SlotPayLine {
    _payLine_1: number[];
    _payLine_2: number[];
    _payLine_3: number[];
    _payLine_4: number[];
    _payLine_5: number[];
}

class PayLine implements SlotPayLine {

    private _slotPosition = SlotLine;

    _payLine_1: number[];
    _payLine_2: number[];
    _payLine_3: number[];
    _payLine_4: number[];
    _payLine_5: number[];

    constructor() {

        this._payLine_1 = [this._slotPosition.slot_1, this._slotPosition.slot_4, this._slotPosition.slot_7];
        this._payLine_2 = [this._slotPosition.slot_0, this._slotPosition.slot_3, this._slotPosition.slot_6];
        this._payLine_3 = [this._slotPosition.slot_2, this._slotPosition.slot_5, this._slotPosition.slot_8];
        this._payLine_4 = [this._slotPosition.slot_2, this._slotPosition.slot_4, this._slotPosition.slot_6];
        this._payLine_5 = [this._slotPosition.slot_0, this._slotPosition.slot_4, this._slotPosition.slot_8];
    }
}

class CreatePayLine extends PayLine {

    private _listPayLine = new Array();

    constructor() {
        super();
    }

    CreatePaylineList() {

        this._listPayLine.push(this._payLine_1);
        this._listPayLine.push(this._payLine_2);
        this._listPayLine.push(this._payLine_3);
        this._listPayLine.push(this._payLine_4);
        this._listPayLine.push(this._payLine_5);

        return this._listPayLine;
    }
}
export class CreatePayout2 {

    public listPayout2: number[] = new Array();

    constructor() {
        this.listPayout2.push(PayoutCount2._payoutType2_0);
        this.listPayout2.push(PayoutCount2._payoutType2_1);
        this.listPayout2.push(PayoutCount2._payoutType2_2);
        this.listPayout2.push(PayoutCount2._payoutType2_3);
        this.listPayout2.push(PayoutCount2._payoutType2_4);
    }
}

export class CreatePayout3 {

    public listPayout3: number[] = new Array();

    constructor() {
        this.listPayout3.push(PayoutCount3._payoutType3_0);
        this.listPayout3.push(PayoutCount3._payoutType3_1);
        this.listPayout3.push(PayoutCount3._payoutType3_2);
        this.listPayout3.push(PayoutCount3._payoutType3_3);
        this.listPayout3.push(PayoutCount3._payoutType3_4);
    }
}
