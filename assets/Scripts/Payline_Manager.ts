// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { CreatePayLine } from "./Commence_Class/class_Pattern";
import { Reel_Number, TypePayout } from "./Commence_Class/enum_Pattern";

const { ccclass, property } = cc._decorator;

export class Payline_Manager {

    private static _insPayline_Manager: Payline_Manager = new Payline_Manager();
    private _slotNumber_list: number[] = null;
    private _payline: CreatePayLine = null;

    public payline_List = new Array();

    private _bonus_Position: number[];

    private _payline_HitReward: number[];

    constructor() {

        Payline_Manager._insPayline_Manager = this;
    }

    public static getinstance_Payline(): Payline_Manager {

        if (Payline_Manager._insPayline_Manager._payline == null) {
            Payline_Manager._insPayline_Manager._payline = new CreatePayLine();
            Payline_Manager._insPayline_Manager._createPayline();
        }
        return Payline_Manager._insPayline_Manager;
    }

    public managePayline(_idSymbol_list: number[]) {

        this._slotNumber_list = _idSymbol_list;
    }

    private _createPayline() {

        this.payline_List = this._payline.CreatePaylineList();
    }

    public checkPayLine_Reward(_line_Bet: number) {

        this._bonus_Position = new Array();
        this._payline_HitReward = new Array();

        for (let i = 0; i < _line_Bet; i++) {

            let _check_symbolPos1_2 = this._payoutCheck(this._slotNumber_list[this.payline_List[i][Reel_Number.reel_1]], this._slotNumber_list[this.payline_List[i][Reel_Number.reel_2]]);
            let _check_symbolPos2_3 = this._payoutCheck(this._slotNumber_list[this.payline_List[i][Reel_Number.reel_2]], this._slotNumber_list[this.payline_List[i][Reel_Number.reel_3]]);

            if (_check_symbolPos1_2 == true && _check_symbolPos2_3 == true) {

                this._collectBonus_Payout3(i);
            }
            else if (_check_symbolPos1_2 == true) {

                this._collectBonus_Payout2(i);
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

    private _collectBonus_Payout2(linePayout: number) {

        for (let _symbolOrder = 0; _symbolOrder < TypePayout._payout2; _symbolOrder++) {
            this._collectPositionSlot_Bonus(this.payline_List[linePayout][_symbolOrder]);
        }
        this._collectLinePayout(linePayout);
    }

    private _collectBonus_Payout3(linePayout: number) {

        for (let _symbolOrder = 0; _symbolOrder < TypePayout._payout3; _symbolOrder++) {
            this._collectPositionSlot_Bonus(this.payline_List[linePayout][_symbolOrder]);
        }
        this._collectLinePayout(linePayout);
    }

    private _collectPositionSlot_Bonus(_slotBonuse_Position: number) {

        this._bonus_Position.push(_slotBonuse_Position);
    }

    private _collectLinePayout(linePayout: number) {

        this._payline_HitReward.push(linePayout);
    }

    public positionBonuse() {

        return this._bonus_Position;
    }
    public payline_Reward() {

        return this._payline_HitReward;
    }
}
