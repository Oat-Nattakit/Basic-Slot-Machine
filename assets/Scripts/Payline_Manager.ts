// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Reel_Number } from "./Reel_Control";

const { ccclass, property } = cc._decorator;

export class Payline_Manager {

    private static Ins_: Payline_Manager = new Payline_Manager();
    private List_SlotNumber: number[] = null;
    private Payline: CreatePayLine = null;

    /*private Payout2: CreatePayout2 = null;
    private Payout3: CreatePayout3 = null;

    private Price_Payout2: number[];
    private Price_Payout3: number[];*/

    public PaylineList = new Array();

    private Bonus_Position: number[];

    private PaylineTrue: number[];

    private Test: number[];
    private Test2: number[];

    constructor() {
        Payline_Manager.Ins_ = this;
    }

    public static GetIns_(): Payline_Manager {
        if (Payline_Manager.Ins_.Payline == null) {
            Payline_Manager.Ins_.Payline = new CreatePayLine();
            Payline_Manager.Ins_.CreatePayline();
        }
        return Payline_Manager.Ins_;
    }

    public ManagePayline(value: number[]) {
        this.List_SlotNumber = value;
        /*this.Price_Payout2 = new Array();
        this.Price_Payout3 = new Array();*/
        this.Test = new Array();
        this.Test2 = new Array();
    }

    private CreatePayline() {
        this.PaylineList = this.Payline.CreatePaylineList();
        /*this.Payout2 = new CreatePayout2();
        this.Payout3 = new CreatePayout3();*/
    }

    public CheckPayLine_Reward(Line_Bet: number) {

        this.Bonus_Position = new Array();
        this.PaylineTrue = new Array();

        for (let i = 0; i < Line_Bet; i++) {

            let Check_PayoutType2 = this.PayoutCheck(this.List_SlotNumber[this.PaylineList[i][Reel_Number.Reel_1]], this.List_SlotNumber[this.PaylineList[i][Reel_Number.Reel_2]]);
            let Check_PayoutType3 = this.PayoutCheck(this.List_SlotNumber[this.PaylineList[i][Reel_Number.Reel_2]], this.List_SlotNumber[this.PaylineList[i][Reel_Number.Reel_3]]);

            if (Check_PayoutType2 == true && Check_PayoutType3 == true) {
                let Range_Payout3 = 3;
                for (let j = 0; j < Range_Payout3; j++) {
                    this.CollectPositionSlot_GetBonus(this.PaylineList[i][j]);
                }
                this.PaylineTrue.push(i);
                let Symbol = this.List_SlotNumber[this.PaylineList[i][Reel_Number.Reel_1]];
                this.PayoutSymbol_Bonus(TypePayout.Payout3,Symbol);
            }
            else if (Check_PayoutType2 == true) {

                let Range_Payout2 = 2;
                for (let j = 0; j < Range_Payout2; j++) {
                    this.CollectPositionSlot_GetBonus(this.PaylineList[i][j]);
                }
                this.PaylineTrue.push(i);
                let Symbol = this.List_SlotNumber[this.PaylineList[i][Reel_Number.Reel_1]];
                this.PayoutSymbol_Bonus(TypePayout.Payout2,Symbol);
            }
        }
    }

    private CollectPositionSlot_GetBonus(Slot_Position: number) {
        this.Bonus_Position.push(Slot_Position);
    }
    public PositionBonuse() {
        return this.Bonus_Position;
    }
    public PaylineBonus() {
        return this.PaylineTrue;
    }

    private PayoutCheck(Number1: number, Number2: number) {
        let Payout: boolean = false;
        if (Number1 == Number2) {
            Payout = true;
        }
        return Payout
    }

    private PayoutSymbol_Bonus(Payout_Type: number, Symbol: number) {
        /*let Price_By_Symbol: number = this.Payout2.ListPayout2[Symbol];
        this.Price_Payout2.push(Price_By_Symbol);*/
        if (Payout_Type == TypePayout.Payout2) {
            this.Test.push(Symbol);
        }
        else if(Payout_Type == TypePayout.Payout3){
            this.Test2.push(Symbol);
        }
    }

    /*private PayoutType3_Bonus(Symbol: number) {
        let Price_By_Symbol: number = this.Payout3.ListPayout3[Symbol];
        this.Price_Payout3.push(Price_By_Symbol);
        this.Test2.push(Symbol);
    }*/

    public StackSymbol_Payout2() {
        return this.Test;
    }

    public StackSymbol_Payout3() {
        return this.Test2;
    }

    /*public Total_Payout2(): number {
        let RewardCount: number = 0;
        for (let i = 0; i < this.Price_Payout2.length; i++) {
            RewardCount += this.Price_Payout2[i];
        }
        return RewardCount;
    }
    public Total_Payout3(): number {
        let RewardCount: number = 0;
        for (let i = 0; i < this.Price_Payout3.length; i++) {
            RewardCount += this.Price_Payout3[i];
        }
        return RewardCount;
    }*/
}

enum TypePayout {
    Payout2 = 2,
    Payout3 = 3,
}

export enum SlotLine {
    Slot_0 = 0,
    Slot_1 = 1,
    Slot_2 = 2,
    Slot_3 = 3,
    Slot_4 = 4,
    Slot_5 = 5,
    Slot_6 = 6,
    Slot_7 = 7,
    Slot_8 = 8,
}

export enum PayoutCount2 {
    PayoutType2_0 = 5,
    PayoutType2_1 = 7,
    PayoutType2_2 = 10,
    PayoutType2_3 = 15,
    PayoutType2_4 = 30,
}

export enum PayoutCount3 {
    PayoutType3_0 = 10,
    PayoutType3_1 = 20,
    PayoutType3_2 = 50,
    PayoutType3_3 = 100,
    PayoutType3_4 = 500,
}

interface SlotPayLine {
    PayLine_1: number[];
    PayLine_2: number[];
    PayLine_3: number[];
    PayLine_4: number[];
    PayLine_5: number[];
}

class PayLine implements SlotPayLine {

    private SlotPosition = SlotLine;

    PayLine_1: number[];
    PayLine_2: number[];
    PayLine_3: number[];
    PayLine_4: number[];
    PayLine_5: number[];

    constructor() {
        this.PayLine_1 = [this.SlotPosition.Slot_1, this.SlotPosition.Slot_4, this.SlotPosition.Slot_7];
        this.PayLine_2 = [this.SlotPosition.Slot_0, this.SlotPosition.Slot_3, this.SlotPosition.Slot_6];
        this.PayLine_3 = [this.SlotPosition.Slot_2, this.SlotPosition.Slot_5, this.SlotPosition.Slot_8];
        this.PayLine_4 = [this.SlotPosition.Slot_2, this.SlotPosition.Slot_4, this.SlotPosition.Slot_6];
        this.PayLine_5 = [this.SlotPosition.Slot_0, this.SlotPosition.Slot_4, this.SlotPosition.Slot_8];
    }
}

class CreatePayLine extends PayLine {

    private ListPayLine = new Array();

    constructor() {
        super();
    }

    CreatePaylineList() {

        this.ListPayLine.push(this.PayLine_1);
        this.ListPayLine.push(this.PayLine_2);
        this.ListPayLine.push(this.PayLine_3);
        this.ListPayLine.push(this.PayLine_4);
        this.ListPayLine.push(this.PayLine_5);

        return this.ListPayLine;
    }
}
export class CreatePayout2 {

    public ListPayout2: number[] = new Array();

    constructor() {
        this.ListPayout2.push(PayoutCount2.PayoutType2_0);
        this.ListPayout2.push(PayoutCount2.PayoutType2_1);
        this.ListPayout2.push(PayoutCount2.PayoutType2_2);
        this.ListPayout2.push(PayoutCount2.PayoutType2_3);
        this.ListPayout2.push(PayoutCount2.PayoutType2_4);
    }
}

export class CreatePayout3 {

    public ListPayout3: number[] = new Array();

    constructor() {
        this.ListPayout3.push(PayoutCount3.PayoutType3_0);
        this.ListPayout3.push(PayoutCount3.PayoutType3_1);
        this.ListPayout3.push(PayoutCount3.PayoutType3_2);
        this.ListPayout3.push(PayoutCount3.PayoutType3_3);
        this.ListPayout3.push(PayoutCount3.PayoutType3_4);
    }
}
