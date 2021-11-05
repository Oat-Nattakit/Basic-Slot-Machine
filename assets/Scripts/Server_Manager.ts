// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { CreatePayout2, CreatePayout3, Payline_Manager } from "./Payline_Manager";

const { ccclass, property } = cc._decorator;

@ccclass
export class Server_Manager {

    private static Ins: Server_Manager = new Server_Manager();
    private Result: number[];
    private Balance: number = 10000;

    private Data: Data_Play;
    private Reward: Player_Reward;

    public GetValueRound: boolean = false;

    constructor() {
        Server_Manager.Ins = this;
    }

    public static Getinstant(): Server_Manager {
        return Server_Manager.Ins;
    }

    public Player_CurrentBalance(): number {
        return this.Balance;
    }

    public Set_Slot_Range(Range: number) {
        this.Result = new Array(Range);
    }

    public Slot_GetSymbolValue() {

        /*if (this.GetValueRound == false) {
            for (let i = 0; i < this.Result.length; i++) {
                this.Result[i] = Math.floor(Math.random() * 5);
            }
            this.GetValueRound = true;
        }*/
        
        if (this.GetValueRound == false) {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(this.TestAwiteValue());
                }, 2000);
            });
        }
        else{
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(0);
                }, 2000);
            });
        }
    }

    private TestAwiteValue() {

        if (this.GetValueRound == false) {

            for (let i = 0; i < this.Result.length; i++) {
                this.Result[i] = Math.floor(Math.random() * 5);
            }
            this.GetValueRound = true;
        }
    }

    public Slot_Result(): number[] {
        return this.Result;
    }

    public DataPlayer_BeforeSpin(Data: Data_Play) {

        this.Data = Data;
        return this.Data;
    }

    public Player_WinRound(Symbol2: number[], Symbol3: number[]) {

        let Payout2: CreatePayout2 = new CreatePayout2();
        let Payout3: CreatePayout3 = new CreatePayout3();

        let Total_Payout2: number = 0;
        let Total_Payout3: number = 0;

        for (let i = 0; i < Symbol2.length; i++) {
            let GetPrice = Payout2.ListPayout2[Symbol2[i]];
            Total_Payout2 += GetPrice;
        }
        for (let i = 0; i < Symbol3.length; i++) {
            let GetPrice = Payout3.ListPayout3[Symbol3[i]];
            Total_Payout3 += GetPrice;
        }

        this.Reward = new Player_Reward(Total_Payout2, Total_Payout3);
        return this.Reward;
    }
}

interface SlotDataPatten {
    Line: number;
    Bet: number;
    Balance: number;
    Total_Bet: number;
}

interface Payout_Price {
    Payout2: number;
    Payout3: number;
}

export class Data_Play implements SlotDataPatten {

    Line: number;
    Bet: number;
    Balance: number;
    Total_Bet: number;

    constructor(line: number, bet: number, Current_Balance: number, Total_Bet: number) {
        this.Line = line;
        this.Bet = bet;
        this.Balance = Current_Balance;
        this.Total_Bet = Total_Bet;
    }
}

export class Player_Reward implements Payout_Price {

    Payout2: number;
    Payout3: number;

    constructor(Price_Payout2: number, Price_Payout3: number) {
        this.Payout2 = Price_Payout2;
        this.Payout3 = Price_Payout3;
    }
}
