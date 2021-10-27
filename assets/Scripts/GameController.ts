// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Payline_Pattern } from "./Payline_Patten";
import Reel_Control from "./Reel_Control";
import UI_Manager from "./UI_Manager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(UI_Manager)
    private UI_Manager: UI_Manager = null;

    @property(Reel_Control)
    private Reel_Control: Reel_Control = null;

    private Payline : Payline_Pattern;

    private ReelRun: boolean = false;

    start() {

        this.Payline = Payline_Pattern.GetIns_();
        this.UI_Manager.Spin_Button.node.on('click', this.Spin_Slot, this);
        this.UI_Manager.StopSpin.node.on('click', this.Stop_Slot, this);
    }

    private Spin_Slot() {
        if (this.ReelRun == false) {
            this.Reel_Control.StartReelRun();
            this.ReelRun = true;
        }
    }

    async Stop_Slot() {
        this.Reel_Control.StopReel();
        this.ReelRun = false;           
    }
}
