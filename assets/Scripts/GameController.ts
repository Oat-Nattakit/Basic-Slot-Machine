// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Payline_Manager } from "./Payline_Manager";
import Reel_Control from "./Reel_Control";
import UI_Manager from "./UI_Manager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(UI_Manager)
    private UI_Manager: UI_Manager = null;

    @property(Reel_Control)
    private Reel_Control: Reel_Control = null;

    private Payline: Payline_Manager;

    private ReelRun: boolean = false;

    start() {

        this.Payline = Payline_Manager.GetIns_();
        this.UI_Manager.Spin_Button.node.on('click', this.Spin_Slot, this);
    }

    private Spin_Slot() {
        if (this.ReelRun == false) {
            this.UI_Manager.startPlayBonusAnimation();
            this.Reel_Control.StartReelRun();
            this.ReelRun = true;
            setTimeout(() => this.Stop_Slot(), 1000);
        }
    }

    private Stop_Slot() {
        this.Reel_Control.StopReel();
        this.ReelRun = false;
        setTimeout(() => this.CheckResult_Player(), 400);
    }

    CheckResult_Player() {
        let GetPlayerPayline = this.Payline.GetPlayerPayline();
        let GetSymbolBonus = this.Payline.GetPlayerSymbol();
        if (GetPlayerPayline.length != 0) {

            for (let i = 0; i < GetPlayerPayline.length; i++) {
                console.log(GetPlayerPayline[i]);               
            }

            this.UI_Manager.PlayerGetBouns();
            this.UI_Manager.ShowPriceBonus(1000);
        }
    }
}
