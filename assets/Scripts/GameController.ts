// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Bet_System } from "./Bet_System";
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
    private Bet: Bet_System

    private ReelRun: boolean = false;

    @property(cc.Integer)
    private StartBalance: number = 10000;

    private LineBetValue: number = 0;
    private Bet_Price: number = 0;

    start() {

        this.Payline = Payline_Manager.GetIns_();
        this.Bet = Bet_System.GetIns();
        this.SetButton_Function();
        this.UI_Manager.ShowCurrentBalance(this.StartBalance.toString());
        this.LineBetValue = this.Bet.LineBet_Start(this.Payline.PaylineList.length);
        this.Bet_Price = this.Bet.Bet_Control(0);
        this.UpdateData_TotalBet();

    }

    private SetButton_Function() {
        this.UI_Manager.Spin_Button.node.on('click', this.Spin_Slot, this);
        this.UI_Manager.Add_Bet.node.on('click', this.Bet_Manager_Add, this);
        this.UI_Manager.Del_Bet.node.on('click', this.Bet_Manager_Del, this);
        this.UI_Manager.Add_Line.node.on('click', this.LineBet_Add, this);
        this.UI_Manager.Del_Line.node.on('click', this.LineBet_Del, this);
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

    private CheckResult_Player() {
        let GetPlayerPayline = this.Payline.GetPlayerPayline();
        let GetSymbolBonus = this.Payline.GetPlayerSymbol();
        if (GetPlayerPayline.length != 0) {

            this.UI_Manager.PlayerGetBouns();
            this.Cal_Bonus();
        }
    }

    private Bet_Manager_Add() {
        this.Bet_Price = this.Bet.Bet_Control(1);
        this.UpdateData_TotalBet();
    }

    private Bet_Manager_Del() {
        this.Bet_Price = this.Bet.Bet_Control(-1);
        this.UpdateData_TotalBet();
    }

    private LineBet_Add() {
        this.LineBetValue = this.Bet.Line_Control(1);
        this.UpdateData_TotalBet();
    }
    private LineBet_Del() {
        this.LineBetValue = this.Bet.Line_Control(-1);
        this.UpdateData_TotalBet();
    }
    private UpdateData_TotalBet() {
        this.UI_Manager.ShowCurrentBet(this.Bet_Price);
        this.UI_Manager.ShowCurrentLineBet(this.LineBetValue);
        let TotalBet_Value = (this.LineBetValue * this.Bet_Price);
        this.UI_Manager.TotalBet_Show(TotalBet_Value);
    }

    private Cal_Bonus() {
        let PlayBonuse_Value = (this.LineBetValue * this.Bet_Price);
        //this.UI_Manager.ShowPriceBonus(PlayBonuse_Value);
    }
}
