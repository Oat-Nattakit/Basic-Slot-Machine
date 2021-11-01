// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;


export class Payline_Manager {

    private static Ins_: Payline_Manager = new Payline_Manager();
    private GetArrNUm: number[] = null;
    private Payline: CreatePayLine = null;

    private Payout2: CreatePayout2 = null;
    private Payout3: CreatePayout3 = null;

    private Price_Payout2: number[];
    private Price_Payout3: number[];

    public PaylineList = new Array();

    private listPo: number[];


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
        
        this.GetArrNUm = value;
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
        for (let i = 0; i < CountLineBet; i++) {

            let Check_PayoutType2 = this.PayoutCheck(this.GetArrNUm[this.PaylineList[i][0]], this.GetArrNUm[this.PaylineList[i][1]]);
            let Check_PayoutType3 = this.PayoutCheck(this.GetArrNUm[this.PaylineList[i][1]], this.GetArrNUm[this.PaylineList[i][2]]);

            if (Check_PayoutType2 == true && Check_PayoutType3 == true) {

                let Range_Payout3 = 3;
                for (let j = 0; j < Range_Payout3; j++) {
                    this.CollectPositionSlot_GetBonus(this.PaylineList[i][j]);
                }
                let Symbol = this.GetArrNUm[this.PaylineList[i][0]];
                this.PayoutType3_Bonus(Symbol);
            }
            else if (Check_PayoutType2 == true) {

                let Range_Payout2 = 2;
                for (let j = 0; j < Range_Payout2; j++) {
                    this.CollectPositionSlot_GetBonus(this.PaylineList[i][j]);
                }

                let Symbol = this.GetArrNUm[this.PaylineList[i][0]];                
                this.PayoutType2_Bonus(Symbol);
            }
        }
    }

    private CollectPositionSlot_GetBonus(Slot_Position: number) {
        this.listPo.push(Slot_Position);
    }
    public PositionBonuse() {
        return this.listPo;
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

    public Total_Payout2(): number[] {
        return this.Price_Payout2;
    }
    public Total_Payout3(): number[] {
        return this.Price_Payout3;
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
