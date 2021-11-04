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
import { Data_Play, Player_Reward, Server_Manager } from "./Server_Manager";
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
    private Balance_Status: boolean = false;

    @property(cc.Integer)
    private Current_balance: number = 0;

    private LineBetValue: number = 0;
    private Bet_Price: number = 0;
    private TotalBet_Value: number = 0;
    private TotalReel: number = 0;
    private Total_Reward: number = 0;

    private Last_animation: cc.Animation;

    private Data_Player: Data_Play;

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
        this.UI_Manager.acc_.node.on('click', this.HidePanal_BalanceNotReady, this);
        this.UI_Manager.Cliam_reward.node.on('click', this.Hide_UI_Reward, this);
    }

    private SetReelButton() {

        let ReelNode = this.Reel_Control.ReelNode;
        let Reel_Button: cc.Button[];
        this.Reel_Control.Reel_Button = new Array(ReelNode.length);
        Reel_Button = this.Reel_Control.Reel_Button;

        for (let i = 0; i < ReelNode.length; i++) {
            Reel_Button[i] = ReelNode[i].getComponent(cc.Button);
            Reel_Button[i].node.on('click', this.Spin_One_Reel, this);
        }
    }
    private Set_DefultReel() {

        this.Balance_Status = false;
        this.UI_Manager.startPlayBonusAnimation();

        this.Data_Player = new Data_Play(this.LineBetValue, this.Bet_Price, this.Current_balance, this.TotalBet_Value);
        this.Data_Player = this.Server_.DataPlayer_BeforeSpin(this.Data_Player);
        this.Balance_Status = this.Balance_Update();
        this.Reel_Control.Set_SlotSymbol();
        this.Payline.SetPayLine_Reward(this.LineBetValue);
    }

    async Spin_All_Reel() {

        if (this.ReelRun == false) {
            await this.Set_DefultReel();

            if (this.Balance_Status == true) {
                this.ReelRun = true;
                let ReelRange = this.Reel_Control.ReelNode.length;
                this.UI_Manager.Button_Status(false, ReelRange);
                this.Last_animation = this.Reel_Control.All_Reel_PlayAniamtion();
                setTimeout(() => this.Stop_All_Reel(), 1000);
            }
            else {
                this.UI_Manager.Balance_ReadytoPlay(true);
            }
        }
    }

    private Stop_All_Reel() {

        let Reel_Range: number = this.Reel_Control.ReelNode.length;
        for (let i = 0; i < Reel_Range; i++) {
            setTimeout(() => this.Reel_Control.SetPicture_Slot(i), 100 * i);
        }
        this.End_AnimationCheckResult();
    }

    async Spin_One_Reel(ButtonReel: cc.Button) {

        if (this.TotalReel == 0) {
            await this.Set_DefultReel();
        }

        if (this.Balance_Status == true) {
            let ReelNumber = ButtonReel.node.getComponent(Reel_Description).Reel_Description;
            this.Last_animation = this.Reel_Control.One_Reel_PlayAnimation(ButtonReel, ReelNumber);
            this.TotalReel++;
            this.UI_Manager.Button_Status(false, this.TotalReel);
            setTimeout(() => this.Stop_Once_Reel(ReelNumber), 1000);
        }
        else {
            this.UI_Manager.Balance_ReadytoPlay(true);
        }
    }

    private Stop_Once_Reel(ReelNumber: number) {

        setTimeout(() => this.Reel_Control.SetPicture_Slot(ReelNumber), 100 * this.TotalReel);

        if (this.TotalReel == this.Reel_Control.ReelNode.length) {
            this.End_AnimationCheckResult();
        }
    }

    private End_AnimationCheckResult() {

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

        let GetStack2 = this.Payline.StackSymbol_Payout2();
        let GetStack3 = this.Payline.StackSymbol_Payout3();

        let Reward = this.Server_.Player_WinRound(GetStack2, GetStack3);

        this.Show_Reward(Reward);
    }

    private Show_Reward(Reward: Player_Reward) {

        this.Total_Reward = 0;
        this.Total_Reward = Reward.Payout2 + Reward.Payout3;
        if (this.Total_Reward != 0) {

            let ListBlackground_Slot = this.Reel_Control.SlotBonus();
            let GetLine_bonus = this.Payline.Payline_Reward();

            for (let i = 0; i < GetLine_bonus.length; i++) {
                this.UI_Manager.Active_Line_Payline(GetLine_bonus[i]);
            }
            this.UI_Manager.SetSlot_BG_Bonuse(ListBlackground_Slot);
            this.UI_Manager.ShowPriceBonus(this.Total_Reward, false);
        }
        if (Reward.Payout3 != 0) {
            this.UI_Manager.ShowPriceBonus(this.Total_Reward, true);
            this.UI_Manager.PlayerGetBouns();
        }

        this.EndRound_Game();
    }

    private EndRound_Game() {

        this.Current_balance += this.Total_Reward;
        this.UI_Manager.ShowCurrentBalance(this.Current_balance);
        this.UI_Manager.Button_Status(true);
        this.Server_.GetValueRound = false;
    }
    private Hide_UI_Reward() {
        this.Reel_Control.SetDefult_Blackground();
        this.UI_Manager.Hide_ClamReward();
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

        let Balacne_Ready: boolean = false;
        let Balance = this.Current_balance - this.TotalBet_Value;
        if (Balance >= 0) {
            this.Current_balance = Balance;
            this.UI_Manager.ShowCurrentBalance(this.Current_balance);
            Balacne_Ready = true;
        }
        return Balacne_Ready;
    }

    private HidePanal_BalanceNotReady() {
        this.UI_Manager.Balance_ReadytoPlay(false);
    }
}
