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

    private static _ins: Server_Manager = new Server_Manager();
    private _result_symbol: number[] = new Array(9);
    private _balance: number = 1000;

    private _data_Player: Data_Play;
    private _reward: Player_Reward;

    public getValueRound: boolean = false;

    constructor() {
        Server_Manager._ins = this;
    }

    public static getInstant(): Server_Manager {
        return Server_Manager._ins;
    }

    public player_CurrentBalance(): number {
        return this._balance;
    }

    public player_DefultData(): Data_Play {
        this._data_Player = new Data_Play(this._balance, 1, 5, 5);        
        return this._data_Player;
    }  

    public slot_GetSymbolValue() {
       
        if (this.getValueRound == false) {
            this.getValueRound = true;
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(this._testAwiteValue());
                }, 2000);
            });
        }
        else {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(0);
                }, 2000);
            });
        }
    }

    private _testAwiteValue() {


        // if (this.GetValueRound == false) {

        for (let i = 0; i < this._result_symbol.length; i++) {
            this._result_symbol[i] = Math.floor(Math.random() * 5);
        }

        //this.GetValueRound = true;
        //}
    }

    public slot_Result(): number[] {       
        return this._result_symbol;
    }

    public dataPlayer_BeforeSpin(Data: Data_Play) {

        this._data_Player = Data;

        //TestCast call server
        /*let _jsonData = JSON.stringify(this._data_Player);
        let _data_Respon : SlotDataPatten = JSON.parse(_jsonData);

        this._data_Player = new Data_Play(_data_Respon.bl , this._data_Player.b , this._data_Player.l ,this._data_Player.tb);    */  
        
        return this._data_Player;
    }

    public player_WinRound(_symbol2: number[], _symbol3: number[], _data: Data_Play) {

        let _payout2: CreatePayout2 = new CreatePayout2();
        let _payout3: CreatePayout3 = new CreatePayout3();

        let _total_Payout2: number = 0;
        let _total_Payout3: number = 0;

        for (let i = 0; i < _symbol2.length; i++) {
            let _getPrice = _payout2.listPayout2[_symbol2[i]];
            _total_Payout2 += _getPrice * _data.b;
        }
        for (let i = 0; i < _symbol3.length; i++) {
            let _getPrice = _payout3.listPayout3[_symbol3[i]];
            _total_Payout3 += _getPrice * _data.b;
        }

        this._reward = new Player_Reward(_total_Payout2, _total_Payout3);
        return this._reward;
    }
}

interface SlotDataPatten {
    bl: number; // Balance
    b: number;  // Bet
    l: number;  // Line
    tb: number; // Total_Bet
}

interface Payout_Price {
    Payout2: number;
    Payout3: number;
}

export class Data_Play implements SlotDataPatten {

    bl: number;
    b: number;
    l: number;
    tb: number;

    constructor(Current_Balance: number, bet: number, line: number, Total_Bet: number) {
        this.bl = Current_Balance;
        this.b = bet;
        this.l = line;
        this.tb = Total_Bet;
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
