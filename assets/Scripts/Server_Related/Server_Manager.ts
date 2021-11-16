// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Data_Play, Player_Reward, slot_SymbolID } from "../Commence_Class/class_Pattern";
import { server_Command } from "../Commence_Class/enum_Pattern";
import { IGameDataResponse, IGameResponseSpin } from "../Commence_Class/interface_Pattern";
import Game_Control from "../GameControl_Related/Game_Control";

const { ccclass, property } = cc._decorator;

@ccclass
export class Server_Manager {

    private static _insServer_Manager: Server_Manager = new Server_Manager();   

    private _data_Player: Data_Play;
    private _reward: Player_Reward;
    private _gameCon: Game_Control;
    
    private _result_symbol: number[] = new Array(9);
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

        this.socket.on(server_Command.server_Connect, (param: any) => {
            console.log('connected');
        });

        this.socket.on(server_Command.server_Connect_Error, (error) => {
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
            }, 1000);
        });
    }

    private getStartDataPlayer() {

        this.socket.on(server_Command.prepair_Data, (param: IGameDataResponse) => {
            const playerData = param.player_data;            
            this._data_Player = new Data_Play(playerData);
        });
    }   

    public async requestSlotSymbol(){    
        
        const paramiter: Data_Play = {
            balance: this._data_Player.balance,
            bet_size: this._data_Player.bet_size,
            line: this._data_Player.line,
            total_bet: this._data_Player.total_bet
        };

        this.socket.emit(
            server_Command.request_Data,
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
        return true;
    } 
    
    public slot_GetSymbolValue() : number[]{

        return this._result_symbol;       
    }  

    public reward_Value() {

        return this._reward;
    }
}