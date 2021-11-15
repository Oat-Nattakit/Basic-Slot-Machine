// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Game_Control from "./Game_Control";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ButtonNode_Manager extends cc.Component {

    @property(cc.Button)
    public add_Button: cc.Button = null;

    @property(cc.Button)
    public del_Button: cc.Button = null;

    @property(cc.Label)
    public showValue_Text: cc.Label = null;  

    public setBtnCallback(onClickAdd: () => void, onClickDel: () => void, game: Game_Control) {

        this.add_Button.node.on("click", onClickAdd, game);
        this.del_Button.node.on("click", onClickDel, game);
    }
}
