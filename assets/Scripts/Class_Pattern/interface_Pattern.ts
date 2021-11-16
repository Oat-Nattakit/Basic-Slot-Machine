import { Bet_Price, SlotLine } from "./enum_Pattern";

export interface bet_Order {
    
    bet_Order: number[];
}

export interface slot_DataPattern {

    balance: number;
    bet_size: number;
    line: number;
    total_bet: number;
    bet_array: number[];
    pay_out2: number;
    pay_out3: number;
    total_payout: number;
}

export interface slotSymbol {

    balance: number;
    bet_array: number[];
    pay_out2: number,
    pay_out3: number,
    total_payout: number,
}

export interface Payout_Price {

    payout2: number;
    payout3: number;
    totalPayout : number;
}

export interface SlotPayLine {

    _payLine_1: number[];
    _payLine_2: number[];
    _payLine_3: number[];
    _payLine_4: number[];
    _payLine_5: number[];
}

export interface IGameDataResponse {

    player_data: slot_DataPattern,
    request_id: string,
    response_name: string,
    timestamp: string,
}

export interface IGameResponseSpin {

    error: string;
    player_data: slot_DataPattern;
    request_id: string;
    response_name: string;
}