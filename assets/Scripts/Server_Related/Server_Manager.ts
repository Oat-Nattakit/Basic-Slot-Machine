// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Data_Play, Player_Reward, IResultReelSpin } from "../Commence_Class/class_Pattern";
import { server_Command } from "../Commence_Class/enum_Pattern";
import { IGameDataResponse, IGameResponseSpin, slot_DataPattern } from "../Commence_Class/interface_Pattern";
import Game_Control from "../GameControl_Related/Game_Control";

const { ccclass, property } = cc._decorator;

@ccclass
export class Server_Manager {

    private static _insServerManager: Server_Manager = new Server_Manager();

    private _dataPlayer: Data_Play;
    private _reward: Player_Reward;
    private _gameCon: Game_Control;

    private _resultSymbol: number[] = new Array(9);
    private socket;

    constructor() {
        Server_Manager._insServerManager = this;
    }

    public static getinstanceServer(): Server_Manager {
        return Server_Manager._insServerManager;
    }

    public gameConnectServer(game: Game_Control) {

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

        this._gameCon = game;
    }

    public async gameGetDataPlayer(): Promise<Data_Play> {

        //this._gameCon = game;
        //await this.gameConnectServer();

        //let dataPlay = await this.getStartDataPlayer();

        /*return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(this._data_Player);
            });
        });*/
        //return dataPlay;//
        return new Promise((resolve, reject) => {
            this.socket.on(server_Command.prepair_Data, (param: IGameDataResponse) => {
                const playerData = param.player_data;

                this._dataPlayer = new Data_Play(playerData);
                this.socket.off(server_Command.prepair_Data);
                resolve(this._dataPlayer);
            });
        });


    }
    /*private async getStartDataPlayer(): Promise<Data_Play> {
        return new Promise((resolve) => {
            this.socket.on(server_Command.prepair_Data, (param: IGameDataResponse) => {
                const playerData = param.player_data;

                //this._dataPlayer = new Data_Play(playerData);
                let dataPlay = new Data_Play(playerData);
                resolve(dataPlay);
            });
        });
    }*/

    public requestSlotSymbol(_currentDataPlay: Data_Play): slot_DataPattern {

        let dataReelSymbol : slot_DataPattern = null;
        this.socket.emit(
            server_Command.request_Data,
            _currentDataPlay,
            (response: IGameResponseSpin) => {
                    if(response.error == "false"){                    
                    dataReelSymbol = response.player_data;                    
                    }
            });
        return dataReelSymbol;
    }    
}

