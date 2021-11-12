// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Bet_Manager } from "./Bet_Manager";
import Game_Control from "./Game_Control";
import { Data_Play } from "./Server_Manager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ButtonNode_Manager extends cc.Component {

    @property(cc.Button)
    public add_Button: cc.Button = null;

    @property(cc.Button)
    public del_Button: cc.Button = null;

    @property(cc.Label)
    public showValue_Text: cc.Label = null;

    private _bet : Bet_Manager;    
    //private _data : Data_Play;

    start(){
        this._bet = Bet_Manager.getIns();      
    }

    public setBtnCallback(onClickAdd: () => void, onClickDel: () => void , game : Game_Control ) {

        this.add_Button.node.on("click", onClickAdd, game);
        this.del_Button.node.on("click", onClickDel, game);
    }

    private setBetFunction(data : Data_Play  , value : number){

        this._bet.bet_Control(data , value);
    }
    
    
}
