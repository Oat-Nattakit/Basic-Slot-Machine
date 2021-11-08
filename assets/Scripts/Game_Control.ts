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

    private TotalReel: number = 0;
    private Total_Reward: number = 0;

    private Last_animation: cc.Animation;

    private Data_Player: Data_Play;
    private List: number = 1;
    private ListTest: number[] = new Array();


    onLoad() {
        this.UI_Manager = this.node.getComponent(UI_Manager);
        this.Reel_Control = this.node.getComponent(Reel_Control);

        this.Payline = Payline_Manager.GetIns_();
        this.Bet = Bet_Manager.getIns();
        this.Server_ = Server_Manager.getInstant();

        this.UI_Manager.add_ArrayButton();

    }

    start() {

        this.SetButton_Function();
        this.SetReelButton();

        this.Data_Player = this.Server_.player_DefultData();
        this.Bet.lineBet_Start(this.Data_Player.l);
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
    private async Set_DefultReel() {

        await this.Reel_Control.Set_SlotSymbol();
        this.Payline.SetPayLine_Reward(this.Data_Player.l);

    }
    private CheckCurrentBalance() {

        this.ReelRun = true;
        this.Balance_Status = false;
        this.ListTest = new Array();
        this.UI_Manager.startPlayBonusAnimation();
        this.Data_Player = this.Server_.dataPlayer_BeforeSpin(this.Data_Player);
        this.Balance_Status = this.Balance_Update();
    }

    async Spin_All_Reel() {

        if (this.ReelRun == false) {
            this.CheckCurrentBalance();
        }

        if (this.Balance_Status == true) {

            let WaitingTime = 0;
            let Reel_Button = this.Reel_Control.Reel_Button;
            this.UI_Manager.Button_Status(false, Reel_Button.length);

            for (let i = 0; i < Reel_Button.length; i++) {
                if (Reel_Button[i].enabled == true) {
                    setTimeout(() => this.Spin_One_Reel(Reel_Button[i]), WaitingTime);
                    WaitingTime += 200;
                }
            }
        }
        else {
            this.UI_Manager.Balance_ReadytoPlay(true);
        }
    }

    async Spin_One_Reel(ButtonReel: cc.Button) {

        if (this.ReelRun == false) {
            this.CheckCurrentBalance();
        }

        if (this.Balance_Status == true) {
            let ReelNumber = ButtonReel.node.getComponent(Reel_Description).Reel_Description;
            this.Last_animation = this.Reel_Control.Reel_PlayAnimation(ButtonReel, ReelNumber);
            this.TotalReel++;
            this.UI_Manager.Button_Status(false, this.TotalReel);
            this.ListTest.push(ReelNumber);

            if (this.ListTest.length == 3) {
                this.Testwaiting();
            }
            /*await this.Set_DefultReel();
            setTimeout(() => this.Stop_Once_Reel(ReelNumber), 500 * this.List);*/
            //this.List++;
        }
        else {
            this.UI_Manager.Balance_ReadytoPlay(true);
        }
    }
    async Testwaiting() {

        await this.Set_DefultReel();
        for (let i = 0; i < this.ListTest.length; i++) {
            //setTimeout(() => this.Reel_Control.testSlow(this.ListTest[i]), 250 * this.List);
            setTimeout(() => this.Stop_Once_Reel(this.ListTest[i]), 500 * this.List);
            this.List++;
        }
    }

    private Stop_Once_Reel(ReelNumber: number) {

        setTimeout(() => this.Reel_Control.SetPicture_Slot(ReelNumber), 100 * this.TotalReel);

        if (this.TotalReel == this.Reel_Control.ReelNode.length) {

            this.End_AnimationCheckResult();
        }
    }

    private End_AnimationCheckResult() {

        this.List = 0;
        this.TotalReel = 0;
        this.ReelRun = false;
        this.CheckPlayer_reward = true;
    }

    update() {

        if (this.CheckPlayer_reward == true) {
            if (this.Last_animation.getAnimationState('ReelAnimation').isPlaying == false) {
                this.CheckPlayer_reward = false;
                setTimeout(() => this.CheckResult_Player(), 200);
            }
        }
    }

    private CheckResult_Player() {

        let GetStack2 = this.Payline.StackSymbol_Payout2();
        let GetStack3 = this.Payline.StackSymbol_Payout3();

        let Reward = this.Server_.player_WinRound(GetStack2, GetStack3, this.Data_Player);

        this.Show_Reward(Reward);
    }

    private Show_Reward(Reward: Player_Reward) {

        this.Total_Reward = 0;
        this.Total_Reward = Reward.Payout2 + Reward.Payout3;

        let Payline3_Bonus = false;
        if (this.Total_Reward != 0) {

            let ListBlackground_Slot = this.Reel_Control.SlotBonus();
            let GetLine_bonus = this.Payline.Payline_Reward();

            for (let i = 0; i < GetLine_bonus.length; i++) {
                this.UI_Manager.Active_Line_Payline(GetLine_bonus[i]);
            }
            if (Reward.Payout3 != 0) {
                Payline3_Bonus = true;
                this.UI_Manager.PlayerGetBouns();
            }
            this.UI_Manager.SetSlot_BG_Bonuse(ListBlackground_Slot);
            this.UI_Manager.ShowPriceBonus(this.Total_Reward, Payline3_Bonus);
        }

        else {
            this.Reel_Control.SetDefult_Blackground();
            this.UI_Manager.startPlayBonusAnimation();
        }

        this.EndRound_Game();
    }

    private EndRound_Game() {

        this.Data_Player.bl += this.Total_Reward;
        this.UI_Manager.ShowCurrentBalance(this.Data_Player.bl);
        this.UI_Manager.Button_Status(true);
        this.Server_.getValueRound = false;
    }
    private Hide_UI_Reward() {
        this.Reel_Control.SetDefult_Blackground();
        this.UI_Manager.Hide_ClamReward();
    }

    private Bet_Manager_Add() {

        this.Bet.bet_Control(this.Data_Player, 1);
        this.UpdateData_TotalBet();
    }
    private Bet_Manager_Del() {

        this.Bet.bet_Control(this.Data_Player, -1);
        this.UpdateData_TotalBet();
    }
    private LineBet_Add() {

        this.Bet.line_Control(this.Data_Player, 1);
        this.UI_Manager.Show_Use_Payline(this.Data_Player.l);
        this.UpdateData_TotalBet();
    }

    private LineBet_Del() {

        this.Bet.line_Control(this.Data_Player, -1);
        this.UI_Manager.Show_Use_Payline(this.Data_Player.l);
        this.UpdateData_TotalBet();
    }

    private UpdateData_TotalBet() {

        this.UI_Manager.ShowCurrentBet(this.Data_Player.b);
        this.UI_Manager.ShowCurrentLineBet(this.Data_Player.l);
        this.UI_Manager.ShowCurrentBalance(this.Data_Player.bl);
        let TotalBetValue = this.Data_Player.l * this.Data_Player.b;
        this.Data_Player.tb = TotalBetValue
        this.UI_Manager.TotalBet_Show(this.Data_Player.tb);
        //this.UI_Manager.
    }

    private Balance_Update(): boolean {

        let Balance_Ready: boolean = false;
        let Balance = this.Data_Player.bl - this.Data_Player.tb;
        if (Balance >= 0) {
            this.Data_Player.bl = Balance;
            this.UI_Manager.ShowCurrentBalance(this.Data_Player.bl);
            Balance_Ready = true;
        }
        return Balance_Ready;
    }

    private HidePanal_BalanceNotReady() {
        this.ReelRun = false;
        this.UI_Manager.Balance_ReadytoPlay(false);
    }
}
