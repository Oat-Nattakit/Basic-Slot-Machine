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

    private ListPayline: number[];
    private ListSymbol: number[];

    private PaylineList = new Array();


    constructor() {
        Payline_Manager.Ins_ = this;
    }

    public static GetIns_(): Payline_Manager {
        if ( Payline_Manager.Ins_.Payline == null) {
            Payline_Manager.Ins_.Payline = new CreatePayLine();
            Payline_Manager.Ins_.CreatePayline();
        }
        return Payline_Manager.Ins_;
    }

    public ManagePayline(value: number[]) {
        this.GetArrNUm = value;
        this.ListPayline = new Array();
        this.ListSymbol = new Array();
        this.CheckPayLine();       
    }

    private CreatePayline() {
        this.PaylineList = this.Payline.CreatePaylineList();
        
    }

    private CheckPayLine() {

        for (let i = 0; i < this.PaylineList.length; i++) {
            let Status = false;
            if ((this.GetArrNUm[this.PaylineList[i][0]] == this.GetArrNUm[this.PaylineList[i][1]]) 
            && (this.GetArrNUm[this.PaylineList[i][1]] == this.GetArrNUm[this.PaylineList[i][2]])) {
                Status = true;
            }
            this.ShowJackPot(Status, i + 1, this.GetArrNUm[this.PaylineList[i][0]]);
        }
    }    

    private ShowJackPot(value: boolean, Payline: number, Symbol: number) {

        if (value == true) {
            this.ListPayline.push(Payline);
            this.ListSymbol.push(Symbol);            
        }
    }

    public GetPlayerPayline(): number[] {
        return this.ListPayline;
    }
    public GetPlayerSymbol(): number[] {
        return this.ListSymbol;
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
