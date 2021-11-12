export enum Bet_Price {
    bet_Price1 = 1,
    bet_Price2 = 2,
    bet_Price3 = 5,
    bet_Price4 = 10,
    bet_Price5 = 50,
    bet_Price6 = 100,
}

export enum Reel_Number {
    reel_1 = 0,
    reel_2 = 1,
    reel_3 = 2,
}

interface Bet_Step {
    betStep: number[];
}

export class CreateBet implements Bet_Step {

    public betStep: number[];

    constructor() {
        this.betStep = [Bet_Price.bet_Price1, Bet_Price.bet_Price2, Bet_Price.bet_Price3, Bet_Price.bet_Price4, Bet_Price.bet_Price5, Bet_Price.bet_Price6];
    }
}

interface SlotDataPattern {

    balance: number;
    bet_size: number;
    line: number;
    total_bet: number;
    bet_array: number[];
    pay_out2: number;
    pay_out3: number;
    total_payout: number;

}

interface slotSymbol {
    balance: number;
    bet_array: number[];
    pay_out2: number,
    pay_out3: number,
    total_payout: number,
}

export interface IGameResponseSpin {
    error: string;
    player_data: SlotDataPattern;
    request_id: string;
    response_name: string;
}

export class SlotID implements slotSymbol {

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


export interface IGameDataResponse {

    player_data: SlotDataPattern,
    request_id: string,
    response_name: string,
    timestamp: string,
}


interface Payout_Price {
    payout2: number;
    payout3: number;
    totalPayout : number;
}


export class simpleData implements SlotDataPattern {
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

    constructor(Dataplayer: SlotDataPattern) {

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

export enum TypePayout {
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