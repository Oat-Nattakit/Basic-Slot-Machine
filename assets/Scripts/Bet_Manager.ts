// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Data_Play } from "./Server_Manager";

const { ccclass, property } = cc._decorator;

export class Bet_Manager {

    private static Ins_: Bet_Manager = new Bet_Manager();
    private Bet_Price: CreateBet = null;
    private CountBet: number;

    private CountLine: number = 0;
    private MaxLine: number = 0;
    //private CurrentBet_Price: number = 0;

    constructor() {
        this.CountBet = 0;
        Bet_Manager.Ins_ = this;
    }

    public static GetIns(): Bet_Manager {
        if (Bet_Manager.Ins_.Bet_Price == null) {
            Bet_Manager.Ins_.Bet_Price = new CreateBet();
        }
        return Bet_Manager.Ins_;
    }

    /*public Bet_Control( Value: number){

        this.CurrentBet_Price = 0;
        this.CountBet += Value;
        
        if (this.CountBet <= 0) {
            this.CountBet = 0;
        }
        else if (this.CountBet >= this.Bet_Price.BetStep.length) {
            this.CountBet = this.Bet_Price.BetStep.length - 1;
        }
        this.CurrentBet_Price = this.Bet_Price.BetStep[this.CountBet];        
    }*/

    public Bet_StartValue() {
        let StartBet = this.Bet_Price.BetStep[0];
        return StartBet;
    }
    public Bet_Control(Data: Data_Play, Value: number) {

        //this.CurrentBet_Price = 0;
        //Data.Total_Bet = 0;
        //Data.Bet += Value;
        this.CountBet += Value;

        if (this.CountBet <= 0) {
            this.CountBet = 0;
        }
        else if (this.CountBet >= this.Bet_Price.BetStep.length) {
            this.CountBet = this.Bet_Price.BetStep.length - 1;
        }
        Data.Bet = this.Bet_Price.BetStep[this.CountBet];
    }

    public LineBet_Start(MaxLine: number): number {
        this.CountLine = MaxLine;
        this.MaxLine = MaxLine;
        return this.CountLine;
    }

    /*public Line_Control(LineBet_Value: number = 0){

        this.CountLine += LineBet_Value;

        if (this.CountLine >= this.MaxLine) {
            this.CountLine = this.MaxLine;
        }
        else if (this.CountLine <= 1) {
            this.CountLine = 1
        }              
    }*/

    public Line_Control(Data: Data_Play, CountLine: number = 0) {

        Data.Line += CountLine;
        if (Data.Line >= this.MaxLine) {
            Data.Line = this.MaxLine;
        }
        else if (Data.Line <= 1) {
            Data.Line = 1;
        }
    }

    /*public Current_LineBet() : number{
        return this.CountLine;
    }

    public Current_BetPrice() : number{
        return this.CurrentBet_Price;
    }*/
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
