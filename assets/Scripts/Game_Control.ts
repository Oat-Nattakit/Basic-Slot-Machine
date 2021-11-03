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
    private CheckPlayer_reward: boolean = false;

    @property(cc.Integer)
    private Current_balance: number = 10000;

    private LineBetValue: number = 0;
    private Bet_Price: number = 0;
    private TotalBet_Value: number = 0;
    private TotalReel: number = 0;

    private Last_animation: cc.Animation;

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
        this.UI_Manager.Spin_Button.node.on('click', this.Spin_All_Reel, this);
        this.UI_Manager.Add_Bet.node.on('click', this.Bet_Manager_Add, this);
        this.UI_Manager.Del_Bet.node.on('click', this.Bet_Manager_Del, this);
        this.UI_Manager.Add_Line.node.on('click', this.LineBet_Add, this);
        this.UI_Manager.Del_Line.node.on('click', this.LineBet_Del, this);   
        this.UI_Manager.acc_.node.on('click', this.HidePanal, this);      
    }

    private SetReelButton() {
        let ReelNode = this.Reel_Control.ReelNode;
        let Reel_Button = this.Reel_Control.Reel_Button = new Array(ReelNode.length)

        for (let i = 0; i < ReelNode.length; i++) {
            Reel_Button[i] = ReelNode[i].getComponent(cc.Button);
            Reel_Button[i].node.on('click', this.Spin_One_Reel, this);
        }
    }
    private Set_DefultReel(): boolean {

        this.UI_Manager.startPlayBonusAnimation();
        this.Server_.DataPlayer_BeforeSpin(this.LineBetValue, this.Bet_Price, this.Current_balance, this.TotalBet_Value);
        let GetStatus = this.Balance_Update();
        this.Reel_Control.SetValue_SlotSymbol();
        this.Payline.CheckPayLine_Reward(this.LineBetValue);
        return GetStatus;
    }

    async Spin_All_Reel() {

        if (this.ReelRun == false) {
            let Spin: boolean = await this.Set_DefultReel();
            console.log(Spin);
            if (Spin == true) {
                this.ReelRun = true;
                this.UI_Manager.Button_Status(false, 3);
                this.Last_animation = this.Reel_Control.All_Reel_PlayAniamtion();
                setTimeout(() => this.Stop_All_Reel(), 1000);
            }
            else {
                this.UI_Manager.Player_NotBalance(true);               
            }
        }
    }

    private Stop_All_Reel() {

        let Reel_Range: number = this.Reel_Control.ReelNode.length;
        for (let i = 0; i < Reel_Range; i++) {
            setTimeout(() => this.Reel_Control.SetPicture_Slot(i), 100 * i);
        }
        this.End_SpinCheckResult();
    }

    async Spin_One_Reel(ButtonReel: cc.Button) {
        let Spin: boolean = false;
        if (this.TotalReel == 0) {
            Spin = await this.Set_DefultReel();
        }

        if (Spin == true) {
            let ReelNumber = ButtonReel.node.getComponent(Reel_Description).Reel_Description;
            this.Last_animation = this.Reel_Control.One_Reel_PlayAnimation(ButtonReel, ReelNumber);
            this.TotalReel++;
            this.UI_Manager.Button_Status(false, this.TotalReel);
            setTimeout(() => this.Stop_Once_Reel(ReelNumber), 1000);
        }
        else {
            this.UI_Manager.Player_NotBalance(true);                    
        }
    }

    private Stop_Once_Reel(ReelNumber: number) {

        setTimeout(() => this.Reel_Control.SetPicture_Slot(ReelNumber), 100 * this.TotalReel);

        if (this.TotalReel == this.Reel_Control.ReelNode.length) {
            this.End_SpinCheckResult();
        }
    }

    private End_SpinCheckResult() {

        this.TotalReel = 0;
        this.ReelRun = false;
        this.CheckPlayer_reward = true;
    }

    update() {
        if (this.CheckPlayer_reward == true) {
            if (this.Last_animation.getAnimationState('ReelAnimation').isPlaying == false) {
                this.CheckPlayer_reward = false;
                setTimeout(() => this.CheckResult_Player(), 100);
            }
        }
    }

    private CheckResult_Player() {

        let GetBGSlot = this.Reel_Control.SlotBonus();
        this.UI_Manager.SetSlot_BG_Bonuse(GetBGSlot);

        let GetLine_bonus = this.Payline.PaylineBonus();

        let GetStack2 = this.Payline.StackSymbol_Payout2();
        let GetStack3 = this.Payline.StackSymbol_Payout3();

        let Reward = this.Server_.Player_WinRound(GetStack2, GetStack3);

        let TotalPrice_reward = Reward.Payout2 + Reward.Payout3;

        if (TotalPrice_reward != 0) {
            this.UI_Manager.ShowPriceBonus(TotalPrice_reward, false);
            for (let i = 0; i < GetLine_bonus.length; i++) {
                this.UI_Manager.Active_Line_Payline(GetLine_bonus[i]);
            }
        }

        if (Reward.Payout3 != 0) {
            this.UI_Manager.ShowPriceBonus(TotalPrice_reward, true);
            this.UI_Manager.PlayerGetBouns();
        }
        this.Current_balance += TotalPrice_reward;
        this.UI_Manager.ShowCurrentBalance(this.Current_balance);
        this.UI_Manager.Button_Status(true);
        this.Server_.GetValueRound = false;
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

    private Balance_Update(): boolean {

        let Balance = this.Current_balance - this.TotalBet_Value;        
        if (Balance >= 0) {
            this.Current_balance = Balance;
            this.UI_Manager.ShowCurrentBalance(this.Current_balance);
            return true;
        }
        else {
            return false;
        }
    }

    private HidePanal(){
        this.UI_Manager.Player_NotBalance(false);
    }
}
