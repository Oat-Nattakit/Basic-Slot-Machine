// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;


export class Payline_Pattern {

    private static Ins_: Payline_Pattern = new Payline_Pattern();
    private GetArrNUm: number[] = null; 

    private ListPayline : number[] ;
    private ListSymbol : number[];

    constructor() {
        Payline_Pattern.Ins_ = this;
    }

    public static GetIns_(): Payline_Pattern {
        return Payline_Pattern.Ins_;
    }

    public ManagePayline(value: number[]) {
        this.GetArrNUm = value;
        this.ListPayline = new Array();
        this.ListSymbol = new Array();
        this.checkPayLine_1();
        this.checkPayLine_2();
        this.checkPayLine_3();
        this.checkPayLine_4();
        this.checkPayLine_5();     
        console.log("Hoho");   
    }

    private checkPayLine_1(){
        let Status: boolean = false;

        if ((this.GetArrNUm[1] == this.GetArrNUm[4]) && (this.GetArrNUm[4] == this.GetArrNUm[7])) {
            Status = true;
        }
        this.ShowJackPot(Status,1,this.GetArrNUm[1]);

    }
    private checkPayLine_2(){
        let Status: boolean = false;

        if ((this.GetArrNUm[0] == this.GetArrNUm[3]) && (this.GetArrNUm[3] == this.GetArrNUm[6])) {
            Status = true;
        }
        this.ShowJackPot(Status,2,this.GetArrNUm[0]);
    }
    private checkPayLine_3(){
        let Status: boolean = false;

        if ((this.GetArrNUm[2] == this.GetArrNUm[5]) && (this.GetArrNUm[5] == this.GetArrNUm[8])) {
            Status = true;
        }
        this.ShowJackPot(Status,3,this.GetArrNUm[2]);
    }
    private checkPayLine_4(){
        let Status: boolean = false;

        if ((this.GetArrNUm[2] == this.GetArrNUm[4]) && (this.GetArrNUm[4] == this.GetArrNUm[6])) {
            Status = true;
        }
        this.ShowJackPot(Status,4,this.GetArrNUm[2]);
    }
    private checkPayLine_5(){
        let Status: boolean = false;

        if ((this.GetArrNUm[0] == this.GetArrNUm[4]) && (this.GetArrNUm[4] == this.GetArrNUm[8])) {
            Status = true;
        }
        this.ShowJackPot(Status,5,this.GetArrNUm[0]);
    }

    private ShowJackPot(value : boolean , Payline : number,Symbol : number){
        
        if(value == true){            
            this.ListPayline.push(Payline);
            this.ListSymbol.push(Symbol);               
        }
    }    

    public GetPlayerPayline() : number[]{        
        return this.ListPayline;
    }
    public GetPlayerSymbol() : number[]{
        return this.ListSymbol;
    }
}

export enum Payline {
    Payline_1 = 1,
    Payline_2 = 2,
    Payline_3 = 3,
    Payline_4 = 4,
    Payline_5 = 5,
}