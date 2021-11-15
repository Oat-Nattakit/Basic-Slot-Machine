// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Game_Control from "./Game_Control";
import { Data_Play, IGameDataResponse, IGameResponseSpin, Player_Reward, simpleData, slot_SymbolID } from "./interfaceClass";

const { ccclass, property } = cc._decorator;

@ccclass
export class Server_Manager {

    private static _insServer_Manager: Server_Manager = new Server_Manager();
    private _result_symbol: number[] = new Array(9);

    private _data_Player: Data_Play;
    private _reward: Player_Reward;
    private _gameCon: Game_Control;

    public getValueRound: boolean = false;
    private socket;

    constructor() {
        Server_Manager._insServer_Manager = this;
    }

    public static getinstance_Server(): Server_Manager {
        return Server_Manager._insServer_Manager;
    }

    private gameConnectServer() {

        //let serverURL = "http://10.5.70.38:3310/socket.io";
        let serverURL = "http://10.0.2.141:3310/socket.io";
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

    public async gameGetDataPlayer(game: Game_Control): Promise<Data_Play> {
        this._gameCon = game;

        await this.gameConnectServer();
        await this.getStartDataPlayer();

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(this._data_Player);
                //reject(this.errorCase());
            }, 1000);
        });
    }

    private getStartDataPlayer() {
        this.socket.on('resetPlayer', (param: IGameDataResponse) => {
            const playerData = param.player_data;
            this._data_Player = new Data_Play(playerData);
        });
    }
    public errorCase(): Data_Play {

        let sim : simpleData = new simpleData(1000,1,1);
        this._data_Player = new Data_Play(sim);
        return this._data_Player;
    }

    public slot_GetSymbolValue() : number[]/*: Promise<number[]>*/ {

        return this._result_symbol;

       /* if (this.getValueRound == false) {
            this.getValueRound = true;
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(this._result_symbol);
                }, 2000);
            });
        }
        else {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(this._result_symbol);
                }, 1000);
            });
        }*/
    }  

    public async requestSlotSymbol() {    
        
        const paramiter: Data_Play = {
            balance: this._data_Player.balance,
            bet_size: this._data_Player.bet_size,
            line: this._data_Player.line,
            total_bet: this._data_Player.total_bet
        };

        this.socket.emit(
            'requestSpin',
            paramiter,
            (response: IGameResponseSpin) => {
                let dataPlayer = response.player_data;
                this._data_Player.balance = this._data_Player.balance - this._data_Player.total_bet;

                let GetData: slot_SymbolID = new slot_SymbolID(dataPlayer);
                this._result_symbol = GetData.bet_array;                

                this._reward = new Player_Reward(GetData.pay_out2, GetData.pay_out3,GetData.total_payout);
                this._gameCon.updateData_TotalBet();
                this._data_Player.balance = GetData.balance;
            });
    }

    public reward_Value() {
        return this._reward;
    }
}
/*

interface SlotDataPattern {

    balance: number;
    bet_size: number;
    line: number;
    total_bet: number;
    bet_array: number[];
    pay_out2: number;
    pay_out3: number;
    total_payout: number;

}

interface slotSymbol {
    balance: number;
    bet_array: number[];
    pay_out2: number,
    pay_out3: number,
    total_payout: number,
}

interface IGameResponseSpin {
    error: string;
    player_data: SlotDataPattern;
    request_id: string;
    response_name: string;
}

class SlotID implements slotSymbol {

    balance: number;
    bet_array: number[] = new Array();
    pay_out2: number;
    pay_out3: number;
    total_payout: number;

    constructor(res_Data: slotSymbol) {
        this.balance = res_Data.balance;
        this.bet_array = res_Data.bet_array;
        this.pay_out2 = res_Data.pay_out2;
        this.pay_out3 = res_Data.pay_out3;
        this.total_payout = res_Data.total_payout;
    }
}


interface IGameDataResponse {

    player_data: SlotDataPattern,
    request_id: string,
    response_name: string,
    timestamp: string,
}


interface Payout_Price {
    payout2: number;
    payout3: number;
    totalPayout : number;
}


class simpleData implements SlotDataPattern {
    balance: number;
    bet_size: number;
    line: number;
    total_bet: number;
    bet_array: number[];
    pay_out2: number;
    pay_out3: number;
    total_payout: number;

    constructor(_balance, _bet_size, _line) {
        this.balance = _balance;
        this.bet_size = _bet_size;
        this.line = _line;
        this.total_bet = _line * _bet_size;
    }
}
export class Data_Play {

    public balance: number;
    public bet_size: number;
    public line: number;
    public total_bet: number;

    constructor(Dataplayer: SlotDataPattern) {

        this.balance = Dataplayer.balance;
        this.bet_size = Dataplayer.bet_size;
        this.line = Dataplayer.line;
        this.total_bet = Dataplayer.line * Dataplayer.bet_size;
    }
}

export class Player_Reward implements Payout_Price {

    public payout2: number;
    public payout3: number;
    public totalPayout : number;

    constructor(_price_Payout2: number, _price_Payout3: number , total : number) {
        this.payout2 = _price_Payout2;
        this.payout3 = _price_Payout3;
        this.totalPayout = total;
    }
}
*/
