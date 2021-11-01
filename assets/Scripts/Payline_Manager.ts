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
    private Current_SlotNumber: number[] = null;
    private Payline: CreatePayLine = null;

    private Payout2: CreatePayout2 = null;
    private Payout3: CreatePayout3 = null;

    private Price_Payout2: number[];
    private Price_Payout3: number[];

    public PaylineList = new Array();

    private listPo: number[];

    private PaylineTrue : number[] ;


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

    public ManagePayline(value: number[], CountLineBet: number) {

        this.Current_SlotNumber = value;
        this.Price_Payout2 = new Array();
        this.Price_Payout3 = new Array();
        this.CheckPayLine(CountLineBet);
    }

    private CreatePayline() {
        this.PaylineList = this.Payline.CreatePaylineList();
        this.Payout2 = new CreatePayout2();
        this.Payout3 = new CreatePayout3();

    }

    private CheckPayLine(CountLineBet: number) {
        this.listPo = new Array();
        this.PaylineTrue = new Array();
        for (let i = 0; i < CountLineBet; i++) {

            let Check_PayoutType2 = this.PayoutCheck(this.Current_SlotNumber[this.PaylineList[i][Reel_Number.Reel_1]], this.Current_SlotNumber[this.PaylineList[i][Reel_Number.Reel_2]]);
            let Check_PayoutType3 = this.PayoutCheck(this.Current_SlotNumber[this.PaylineList[i][1]], this.Current_SlotNumber[this.PaylineList[i][Reel_Number.Reel_3]]);

            if (Check_PayoutType2 == true && Check_PayoutType3 == true) {
                let Range_Payout3 = 3;
                for (let j = 0; j < Range_Payout3; j++) {
                    this.CollectPositionSlot_GetBonus(this.PaylineList[i][j]);
                }
                this.PaylineTrue.push(i);
                let Symbol = this.Current_SlotNumber[this.PaylineList[i][Reel_Number.Reel_1]];
                this.PayoutType3_Bonus(Symbol);
            }
            else if (Check_PayoutType2 == true) {

                let Range_Payout2 = 2;
                for (let j = 0; j < Range_Payout2; j++) {
                    this.CollectPositionSlot_GetBonus(this.PaylineList[i][j]);
                }
                this.PaylineTrue.push(i);
                let Symbol = this.Current_SlotNumber[this.PaylineList[i][Reel_Number.Reel_1]];
                this.PayoutType2_Bonus(Symbol);
            }
        }

        for(let i=0 ; i<this.PaylineTrue.length ; i++){
            console.log(this.PaylineTrue[i]+1);
        }
    }

    private CollectPositionSlot_GetBonus(Slot_Position: number) {
        this.listPo.push(Slot_Position);
    }
    public PositionBonuse() {
        return this.listPo;
    }
    public PaylineBonus(){
        return this.PaylineTrue;
    }

    private PayoutCheck(Number1: number, Number2: number) {
        let Payout: boolean = false;
        if (Number1 == Number2) {
            Payout = true;
        }
        return Payout
    }

    private PayoutType2_Bonus(Symbol: number) {
        let GetPayout_Price: number = this.Payout2.ListPayout2[Symbol];
        this.Price_Payout2.push(GetPayout_Price);
    }

    private PayoutType3_Bonus(Symbol: number) {
        let GetPayout_Price: number = this.Payout3.ListPayout3[Symbol];
        this.Price_Payout3.push(GetPayout_Price);
    }

    public Total_Payout2() : number{

        let RewardCOunt : number =0;
        for(let i=0 ; i<this.Price_Payout2.length ; i++){
            RewardCOunt += this.Price_Payout2[i];
        }       
        return RewardCOunt;
    }
    public Total_Payout3() : number {
        let RewardCOunt : number = 0;
        for(let i=0 ; i<this.Price_Payout3.length ; i++){
            RewardCOunt += this.Price_Payout3[i];
        }       
        return RewardCOunt;
    }

    public Awit2() {
        return new Promise(resolve => {
            setTimeout(() => {
              resolve(this.Total_Payout2());
            }, 400);
          });
    }
    public Awit3(){
        return new Promise(resolve => {
            setTimeout(() => {
              resolve(this.Total_Payout3());
            }, 400);
          });
    }
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
class CreatePayout2 {

    public ListPayout2: number[] = new Array();

    constructor() {
        this.ListPayout2.push(PayoutCount2.PayoutType2_0);
        this.ListPayout2.push(PayoutCount2.PayoutType2_1);
        this.ListPayout2.push(PayoutCount2.PayoutType2_2);
        this.ListPayout2.push(PayoutCount2.PayoutType2_3);
        this.ListPayout2.push(PayoutCount2.PayoutType2_4);
    }
}

class CreatePayout3 {

    public ListPayout3: number[] = new Array();

    constructor() {
        this.ListPayout3.push(PayoutCount3.PayoutType3_0);
        this.ListPayout3.push(PayoutCount3.PayoutType3_1);
        this.ListPayout3.push(PayoutCount3.PayoutType3_2);
        this.ListPayout3.push(PayoutCount3.PayoutType3_3);
        this.ListPayout3.push(PayoutCount3.PayoutType3_4);
    }
}
