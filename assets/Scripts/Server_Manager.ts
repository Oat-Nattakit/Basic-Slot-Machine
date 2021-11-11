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

    public static getInstant(): Server_Manager {
        return Server_Manager._insServer_Manager;
    }

    private gameConnectServer() {

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

    public async gameGetDataPlayer(game: Game_Control): Promise<Data_Play> {
        this._gameCon = game;

        await this.gameConnectServer();
        await this.getStartDataPlayer();

        return new Promise(resolve => {
            setTimeout(() => {
                resolve(this._data_Player);
            }, 500);
        });
    }

    private getStartDataPlayer() {
        this.socket.on('resetPlayer', (param: IGameDataResponse) => {
            const playerData = param.player_data;
            this._data_Player = new Data_Play(playerData);
            //console.log(this._data_Player.balance);
        });
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
                    resolve(this._testAwiteValue());
                }, 1000);
            });
        }
    }

    private _testAwiteValue() {
        //console.log("Waiting");        
    }

    public async test_ReqSym() {

        const param: any = { balance: this._data_Player.balance, bet_size: this._data_Player.bet_size, line: this._data_Player.line, total_bet: this._data_Player.total_bet };
        this.socket.emit(
            'requestSpin',
            param,
            (response: IGameResponseSpin) => {               
                let dataPlayer = response.player_data;
                this._data_Player.balance = this._data_Player.balance - this._data_Player.total_bet;

                let GetData: SlotID = new SlotID(dataPlayer);                
                this._result_symbol = GetData.bet_array;
                this._data_Player.balance = GetData.balance;
                this._reward = new Player_Reward(GetData.pay_out2, GetData.pay_out3);
                this._gameCon.updateData_TotalBet();
            });
    }

    public getSlot_Result(): number[] {
        return this._result_symbol;
    }  

    public reward_Value() {
        return this._reward;
    }
}


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

    constructor(res_Data : slotSymbol ) {
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
    timestamp: string
}

interface Payout_Price {
    payout2: number;
    payout3: number;
}

export class Data_Play {

    public balance: number;
    public bet_size: number;
    public line: number;
    public total_bet: number;   

    constructor(Dataplayer : SlotDataPattern) {

        this.balance = Dataplayer.balance;
        this.bet_size = Dataplayer.bet_size;
        this.line = Dataplayer.line;
        this.total_bet = Dataplayer.line * Dataplayer.bet_size;
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

