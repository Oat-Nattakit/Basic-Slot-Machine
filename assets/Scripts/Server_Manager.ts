// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Game_Control from "./Game_Control";
import { CreatePayout2, CreatePayout3, Payline_Manager } from "./Payline_Manager";

const { ccclass, property } = cc._decorator;

@ccclass
export class Server_Manager {

    private static _insServer_Manager: Server_Manager = new Server_Manager();
    private _result_symbol: number[] = new Array(9);
    //private _balance: number = 1000;

    private _data_Player: Data_Play;
    private _reward: Player_Reward;
    private _gameCon: Game_Control;

    public getValueRound: boolean = false;
    private socket;

    constructor() {
        Server_Manager._insServer_Manager = this;
    }

    public connect() {

        let serverURL = "http://10.5.70.38:3310/socket.io";
        let url = new URL(serverURL);
        let path = url.pathname;
        let hostPath = url.toString().replace(path, "");

        let config: SocketIOClient.ConnectOpts = {
            path: path,
            transports: ['websocket'],
            upgrade: false
        };

        this.socket = io(hostPath, config);
        console.log('try to connect');

        this.socket.on('connect', (param: any) => {
            console.log('connected');
        });


        this.socket.on("connect_error", (error) => {
            console.log('connect_error', error);
        });
    }


    public static getInstant(): Server_Manager {
        return Server_Manager._insServer_Manager;
    }

    public player_DefultData(gameCon: Game_Control) {

        this._gameCon = gameCon;
        this.socket.on('resetPlayer', (param: any) => {
            let Getdata: string = JSON.stringify(param.data);
            this.data_Convent(Getdata);
        });
    }

    private data_Convent(preData: string) {

        let dataPlayer: SlotDataPatten = JSON.parse(preData);
        this._data_Player = new Data_Play(dataPlayer.balance, dataPlayer.bet_size, dataPlayer.line, dataPlayer.total_bet);
        this.playerGetData();
    }

    public playerGetData() {
        this._gameCon.waitingstart(this._data_Player);
    }

    public async slot_GetSymbolValue() {

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
                }, 1000);
            });
        }
    }

    private _testAwiteValue() {

        /*for (let i = 0; i < this._result_symbol.length; i++) {
            this._result_symbol[i] = Math.floor(Math.random() * 5);
        }*/
    }

    public async test_ReqSym() {
////////////////////////////////////////////////////////* ส่งก่อนค่อยหัก///////////////////////////////////////
        console.log("in");
        this.socket.emit('requestSpin', { balance: this._data_Player.balance, bet_size: this._data_Player.bet_size, line: this._data_Player.line, total_bet: this._data_Player.total_bet }, (para: any) => {
            let Getsting: string = JSON.stringify(para.data);
            this.setSlotSymbol(Getsting);
        });
    }
    private setSlotSymbol(value: string) {

        let dataPlayer: slotSymbol = JSON.parse(value);
        let TestData: SlotID = new SlotID(dataPlayer.balance, dataPlayer.bet_array, dataPlayer.timestamp);
        this._result_symbol = TestData.bet_array;
        console.log(TestData.balance);
        this._gameCon.readytoStop(TestData.bet_array);
    }

    public slot_Result(): number[] {
        return this._result_symbol;
    }

    public dataPlayer_BeforeSpin(Data: Data_Play) {

        this._data_Player = Data;

        return this._data_Player;
    }

    public player_WinRound(_symbol2: number[], _symbol3: number[], _data: Data_Play) {

        let _payout2: CreatePayout2 = new CreatePayout2();
        let _payout3: CreatePayout3 = new CreatePayout3();

        let _total_Payout2: number = 0;
        let _total_Payout3: number = 0;

        for (let i = 0; i < _symbol2.length; i++) {
            let _getPrice = _payout2.listPayout2[_symbol2[i]];
            _total_Payout2 += _getPrice * _data.bet_size;
        }
        for (let i = 0; i < _symbol3.length; i++) {
            let _getPrice = _payout3.listPayout3[_symbol3[i]];
            _total_Payout3 += _getPrice * _data.bet_size;
        }

        this._reward = new Player_Reward(_total_Payout2, _total_Payout3);
        return this._reward;
    }
}

interface slotSymbol {
    balance: number;
    bet_array: number[];
    timestamp: string;
}

class SlotID implements slotSymbol {
    balance: number;
    bet_array: number[] = new Array();
    timestamp: string;


    constructor(bal: number, listSym: number[], time) {
        this.balance = bal;
        this.bet_array = listSym;
        this.timestamp = time;
    }
}

interface SlotDataPatten {

    balance: number; // Balance    
    bet_size: number;  // Bet  
    line: number;  // Line
    total_bet: number; // Total_Bet       
}

interface Payout_Price {
    payout2: number;
    payout3: number;
}

export class Data_Play implements SlotDataPatten {

    public balance: number;
    public bet_size: number;
    public line: number;
    public total_bet: number;

    constructor(Current_Balance: number, bet: number, line: number, Total_Bet: number) {
        this.balance = Current_Balance;
        this.bet_size = bet;
        this.line = line;
        this.total_bet = line * bet;
    }
}

export class Player_Reward implements Payout_Price {

    public payout2: number;
    public payout3: number;

    constructor(_price_Payout2: number, _price_Payout3: number) {
        this.payout2 = _price_Payout2;
        this.payout3 = _price_Payout3;
    }
}
