// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Bet_Manager } from "./Bet_Manager";
import { Payline_Manager } from "./Payline_Manager";
import Reel_Control from "./Reel_Control";
import Reel_Description from "./Reel_Description";
import { Server_Manager } from "./Server_Manager";
import UI_Manager from "./UI_Manager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game_Control extends cc.Component {

    private UI_Manager: UI_Manager = null;
    private Reel_Control: Reel_Control = null;
    private Payline: Payline_Manager;
    private Bet: Bet_Manager
    private Server_: Server_Manager;

    private ReelRun: boolean = false;

    @property(cc.Integer)
    private Current_balance: number = 10000;

    private LineBetValue: number = 0;
    private Bet_Price: number = 0;
    private TotalBet_Value: number = 0;

    private TotalReel: number = 0;

    onLoad() {
        this.UI_Manager = this.node.getComponent(UI_Manager);
        this.Reel_Control = this.node.getComponent(Reel_Control);

        this.Payline = Payline_Manager.GetIns_();
        this.Bet = Bet_Manager.GetIns();
        this.Server_ = Server_Manager.Getinstant();

        this.UI_Manager.add_ArrayButton();
    }

    start() {

        this.SetButton_Function();
        this.SetReelButton();

        this.UI_Manager.ShowCurrentBalance(this.Current_balance);
        this.LineBetValue = this.Bet.LineBet_Start(this.Payline.PaylineList.length);
        this.Bet.Bet_Control(0);
        this.Bet_Price = this.Bet.Current_BetPrice();
        this.UpdateData_TotalBet();
    }

    private SetButton_Function() {
        this.UI_Manager.Spin_Button.node.on('click', this.Spin_All_Slot, this);
        this.UI_Manager.Add_Bet.node.on('click', this.Bet_Manager_Add, this);
        this.UI_Manager.Del_Bet.node.on('click', this.Bet_Manager_Del, this);
        this.UI_Manager.Add_Line.node.on('click', this.LineBet_Add, this);
        this.UI_Manager.Del_Line.node.on('click', this.LineBet_Del, this);
    }

    private SetReelButton() {
        let ReelNode = this.Reel_Control.ReelNode;
        let Reel_Button = this.Reel_Control.Reel_Button = new Array(ReelNode.length)

        for (let i = 0; i < ReelNode.length; i++) {
            Reel_Button[i] = ReelNode[i].getComponent(cc.Button);
            Reel_Button[i].node.on('click', this.Spin_Once_Slot, this);
        }
    }
    private Set_DefultReel() {
        this.UI_Manager.startPlayBonusAnimation();
        let Test = this.Server_.Result_Round(this.LineBetValue, this.Bet_Price, this.Current_balance, this.TotalBet_Value);
        this.Balance_Update();
    }

    private Spin_All_Slot() {

        if (this.ReelRun == false) {
            this.ReelRun = true;
            this.Reel_Control.Run_Reel_All();
            this.Set_DefultReel();
            setTimeout(() => this.Stop_All_Reel(), 1000);
        }
    }

    private Spin_Once_Slot(ButtonReel: cc.Button) {

        if (this.TotalReel == 0) {
            this.Set_DefultReel();
        }

        let ReelNumber = ButtonReel.node.getComponent(Reel_Description).Reel_Description;
        let ReelAniamtion = ButtonReel.node.getComponent(cc.Animation);
        this.Reel_Control.Run_Reel_Once(ButtonReel, ReelNumber);
        ReelAniamtion.play();
        this.TotalReel++;
        setTimeout(() => this.Stop_Once_Reel(ReelNumber, ReelAniamtion), 1000);
    }

    private Stop_Once_Reel(ReelNumber: number, ReelAnimation: cc.Animation) {

        this.Reel_Control.StopReel_Once(ReelNumber, ReelAnimation);

        if (this.TotalReel == this.Reel_Control.ReelNode.length) {
            this.End_SpinCheckResult();
        }
    }

    private Stop_All_Reel() {
        this.Reel_Control.StopReel_All();
        this.End_SpinCheckResult();
    }

    private End_SpinCheckResult() {

        this.TotalReel = 0;
        this.ReelRun = false;
        this.CheckResult_Player();
    }

    async CheckResult_Player() {

        let Price_reward2: number = 0;
        let Price_reward3: number = 0;

        await this.Payline.Awit2();
        await this.Payline.Awit3();

        this.UI_Manager.Button_Status(true);

        let GetBGSlot = this.Reel_Control.SlotBonus();
        this.UI_Manager.SetSlot_BG_Bonuse(GetBGSlot);

        let GetLine_bonus = this.Payline.PaylineBonus();

        Price_reward2 = this.Payline.Total_Payout2();
        Price_reward3 = this.Payline.Total_Payout3();

        let Price_reward = Price_reward2 + Price_reward3;

        if (Price_reward != 0) {
            this.UI_Manager.ShowPriceBonus(Price_reward, false);
            for (let i = 0; i < GetLine_bonus.length; i++) {
                this.UI_Manager.Active_Line_Payline(GetLine_bonus[i]);
            }
        }
        if (Price_reward3 != 0) {
            this.UI_Manager.ShowPriceBonus(Price_reward, true);
            this.UI_Manager.PlayerGetBouns();
        }
        this.Current_balance += Price_reward;
        this.UI_Manager.ShowCurrentBalance(this.Current_balance);
    }

    private Bet_Manager_Add() {
        this.Bet.Bet_Control(1);
        this.UpdateData_TotalBet();
    }
    private Bet_Manager_Del() {
        this.Bet.Bet_Control(-1);
        this.UpdateData_TotalBet();
    }
    private LineBet_Add() {
        this.Bet.Line_Control(1);
        this.UpdateData_TotalBet();
    }
    private LineBet_Del() {
        this.Bet.Line_Control(-1);
        this.UpdateData_TotalBet();
    }
    private UpdateData_TotalBet() {

        this.LineBetValue = this.Bet.Current_LineBet();
        this.Bet_Price = this.Bet.Current_BetPrice();

        this.UI_Manager.ShowCurrentBet(this.Bet_Price);
        this.UI_Manager.ShowCurrentLineBet(this.LineBetValue);
        this.TotalBet_Value = (this.LineBetValue * this.Bet_Price);
        this.UI_Manager.TotalBet_Show(this.TotalBet_Value);
    }

    private Balance_Update() {
        this.Current_balance = this.Current_balance - this.TotalBet_Value;
        this.UI_Manager.ShowCurrentBalance(this.Current_balance);
    }
}
