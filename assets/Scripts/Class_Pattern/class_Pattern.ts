import { Bet_Price, SlotLine } from "./enum_Pattern";
import { bet_Order, Payout_Price, SlotPayLine, slotSymbol, slot_DataPattern } from "./interface_Pattern";

export class CreateBet implements bet_Order {

    public bet_Order: number[];

    constructor() {
        this.bet_Order = [Bet_Price.bet_Price1, Bet_Price.bet_Price2, Bet_Price.bet_Price3, Bet_Price.bet_Price4, Bet_Price.bet_Price5, Bet_Price.bet_Price6];
    }
}

export class slot_SymbolID implements slotSymbol {

    balance: number;
    bet_array: number[] = new Array();
    pay_out2: number;
    pay_out3: number;
    total_payout: number;

    constructor(res_Data: slotSymbol) {
        this.balance = res_Data.balance;
        this.bet_array = res_Data.bet_array;
        this.pay_out2 = res_Data.pay_out2;
        this.pay_out3 = res_Data.pay_out3;
        this.total_payout = res_Data.total_payout;
    }
}

export class simpleData implements slot_DataPattern {
    
    balance: number;
    bet_size: number;
    line: number;
    total_bet: number;
    bet_array: number[];
    pay_out2: number;
    pay_out3: number;
    total_payout: number;

    constructor(_balance, _bet_size, _line) {
        this.balance = _balance;
        this.bet_size = _bet_size;
        this.line = _line;
        this.total_bet = _line * _bet_size;
    }
}
export class Data_Play {

    public balance: number;
    public bet_size: number;
    public line: number;
    public total_bet: number;

    constructor(Dataplayer: slot_DataPattern) {

        this.balance = Dataplayer.balance;
        this.bet_size = Dataplayer.bet_size;
        this.line = Dataplayer.line;
        this.total_bet = Dataplayer.line * Dataplayer.bet_size;
    }
}

export class Player_Reward implements Payout_Price {

    public payout2: number;
    public payout3: number;
    public totalPayout : number;

    constructor(_price_Payout2: number, _price_Payout3: number , total : number) {
        this.payout2 = _price_Payout2;
        this.payout3 = _price_Payout3;
        this.totalPayout = total;
    }
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

export class CreatePayLine extends PayLine {

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