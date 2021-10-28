// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

export class Bet_System {

    private static Ins_: Bet_System = new Bet_System();
    private Bet_Price: CreateBet = null;
    private CountBet: number;

    private CountLine: number = 0;
    private MaxLine: number = 0;

    constructor() {
        this.CountBet = 0;
        Bet_System.Ins_ = this;
    }

    public static GetIns(): Bet_System {
        if (Bet_System.Ins_.Bet_Price == null) {
            Bet_System.Ins_.Bet_Price = new CreateBet();
        }
        return Bet_System.Ins_;
    }

    public Bet_Control(Value: number): number {

        let Price_Bet: number = 0;
        this.CountBet += Value;
        if (this.CountBet <= 0) {
            this.CountBet = 0;
        }
        else if (this.CountBet >= this.Bet_Price.BetStep.length) {
            this.CountBet = this.Bet_Price.BetStep.length - 1;
        }
        Price_Bet = this.Bet_Price.BetStep[this.CountBet];
        return Price_Bet;
    }

    public LineBet_Start(MaxLine: number) : number{
        this.CountLine = MaxLine;
        this.MaxLine = MaxLine;
        return this.CountLine;
    }

    public Line_Control(LineBet_Value: number = 0): number {

        this.CountLine += LineBet_Value;

        if (this.CountLine >= this.MaxLine) {
            this.CountLine = this.MaxLine;
        }
        else if (this.CountLine <= 1) {
            this.CountLine = 1
        }
        return this.CountLine;
    }
}

export enum Bet_Price {
    Bet_Price1 = 1,
    Bet_Price2 = 2,
    Bet_Price3 = 5,
    Bet_Price4 = 10,
    Bet_Price5 = 50,
    Bet_Price6 = 100,
}

interface Bet_Step {
    BetStep: number[];
}

class CreateBet implements Bet_Step {

    BetStep: number[];

    constructor() {
        this.BetStep = [Bet_Price.Bet_Price1, Bet_Price.Bet_Price2, Bet_Price.Bet_Price3, Bet_Price.Bet_Price4, Bet_Price.Bet_Price5, Bet_Price.Bet_Price6];
    }
}
