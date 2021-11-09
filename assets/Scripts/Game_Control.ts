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

    private _ui_Manager: UI_Manager = null;
    private _reel_Control: Reel_Control = null;
    private _payline: Payline_Manager;
    private _bet: Bet_Manager
    private _server: Server_Manager;

    private _reelRun: boolean = false;
    private _checkPlayer_reward: boolean = false;
    private _balance_Status: boolean = false;

    private _totalReel: number = 0;
    private _total_Reward: number = 0;

    private _last_animation: cc.Animation;

    private _data_Player: Data_Play;
    private _list: number = 1;
    private _reelSpin_list: number[] = new Array();


    onLoad() {

        this._ui_Manager = this.node.getComponent(UI_Manager);
        this._reel_Control = this.node.getComponent(Reel_Control);

        this._payline = Payline_Manager.getPayline_Manager();
        this._bet = Bet_Manager.getIns();
        this._server = Server_Manager.getInstant();
        this._ui_Manager.add_ArrayButton();

    }

    start() {

        this._setButton_Function();
        this._setReelButton();

        this._data_Player = this._server.player_DefultData();
        this._bet.lineBet_Start(this._data_Player.l);
        this._updateData_TotalBet();
    }

    private _setButton_Function() {

        this._ui_Manager.spin_Button.node.on('click', this._spin_All_Reel, this);
        this._ui_Manager.balanceNot_reandy.node.on('click', this._hidePanal_BalanceNotReady, this);
        this._ui_Manager.receive_reward.node.on('click', this._hide_UI_Reward, this);

        this._ui_Manager.betPrice.add_Button.node.on('click', this._bet_Manager_Add, this);
        this._ui_Manager.betPrice.del_Button.node.on('click', this.Bet_Manager_Del, this);
        this._ui_Manager.linePayout.add_Button.node.on('click', this._lineBet_Add, this);
        this._ui_Manager.linePayout.del_Button.node.on('click', this._lineBet_Del, this);        
    }

    private _setReelButton() {

        let ReelNode = this._reel_Control.reelNode;
        let Reel_Button: cc.Button[];
        this._reel_Control.reel_Button = new Array(ReelNode.length);
        Reel_Button = this._reel_Control.reel_Button;

        for (let i = 0; i < ReelNode.length; i++) {
            Reel_Button[i] = ReelNode[i].getComponent(cc.Button);
            Reel_Button[i].node.on('click', this._spin_One_Reel, this);
        }
    }
    private async _set_DefultReel() {

        await this._reel_Control.set_SlotSymbol();
        this._payline.checkPayLine_Reward(this._data_Player.l);

    }
    private _checkCurrentBalance() {

        this._reelRun = true;
        this._balance_Status = false;
        this._reelSpin_list = new Array();
        this._ui_Manager.startPlayBonusAnimation();
        this._data_Player = this._server.dataPlayer_BeforeSpin(this._data_Player);
        this._balance_Status = this._balance_Update();
    }

    private async _spin_All_Reel() {

        if (this._reelRun == false) {
            this._checkCurrentBalance();
        }

        if (this._balance_Status == true) {

            let _waitingTime = 0;
            let _reel_Button = this._reel_Control.reel_Button;
            this._ui_Manager.button_Status(false, _reel_Button.length);

            for (let i = 0; i < _reel_Button.length; i++) {
                if (_reel_Button[i].enabled == true) {
                    setTimeout(() => this._spin_One_Reel(_reel_Button[i]), _waitingTime);
                    _waitingTime += 200;
                }
            }
        }
        else {
            this._ui_Manager.balance_ReadytoPlay(true);
        }
    }

    private async _spin_One_Reel(ButtonReel: cc.Button) {

        if (this._reelRun == false) {
            this._checkCurrentBalance();
        }            

        if (this._balance_Status == true) {
            let _reelNumber = ButtonReel.node.getComponent(Reel_Description).reel_Description;
            this._last_animation = this._reel_Control.reel_PlayAnimation(ButtonReel, _reelNumber);
            this._totalReel++;
            this._ui_Manager.button_Status(false, this._totalReel);
            this._reelSpin_list.push(_reelNumber);

            if (this._reelSpin_list.length == 3) {
                this._testwaiting();
            }
            /*await this.Set_DefultReel();
            setTimeout(() => this.Stop_Once_Reel(ReelNumber), 500 * this.List);*/
            //this.List++;
        }
        else {
            this._ui_Manager.balance_ReadytoPlay(true);
        }
    }
    private async _testwaiting() {

        await this._set_DefultReel();    
        for (let i = 0; i < this._reelSpin_list.length; i++) {
            setTimeout(() => this._stop_Once_Reel(this._reelSpin_list[i]), 500 * this._list);
            this._list++;
        }
    }

    private _stop_Once_Reel(ReelNumber: number) {

        setTimeout(() => this._reel_Control._setPicture_Slot(ReelNumber), 100 * this._totalReel);

        if (this._totalReel == this._reel_Control.reelNode.length) {

            this._end_AnimationCheckResult();
        }
    }

    private _end_AnimationCheckResult() {

        this._list = 0;
        this._totalReel = 0;
        this._reelRun = false;
        this._checkPlayer_reward = true;
    }

    update() {

        if (this._checkPlayer_reward == true) {
            //if (this._last_animation.getAnimationState('ReelAnimation').isPlaying == false) {
                if (this._last_animation.getAnimationState('reelSpin_animation').isPlaying == false) {
                this._checkPlayer_reward = false;
                setTimeout(() => this._checkResult_Player(), 200);
            }
        }
    }

    private _checkResult_Player() {

        let _stackPayout2 = this._payline.stackSymbol_Payout2();
        let _stackPayout3 = this._payline.stackSymbol_Payout3();

        let _reward = this._server.player_WinRound(_stackPayout2, _stackPayout3, this._data_Player);

        this._show_Reward(_reward);
    }

    private _show_Reward(_reward: Player_Reward) {

        this._total_Reward = 0;
        this._total_Reward = _reward.payout2 + _reward.payout3;

        let _payline3_Bonus = false;

        if (this._total_Reward != 0) {

            let _slotBackground = this._reel_Control.slotBonus();
            let _payline_Bonus = this._payline.payline_Reward();

            for (let i = 0; i < _payline_Bonus.length; i++) {
                this._ui_Manager.active_Line_Payline(_payline_Bonus[i]);
            }
            if (_reward.payout3 != 0) {
                _payline3_Bonus = true;
                this._ui_Manager.playerGetBouns();
            }
            this._ui_Manager.setSlot_BG_Bonuse(_slotBackground);
            this._ui_Manager.showPriceBonus(this._total_Reward, _payline3_Bonus);
        }

        else {
            this._reel_Control.setDefult_Blackground();
            this._ui_Manager.startPlayBonusAnimation();
        }

        this._endRound_Game();
    }

    private _endRound_Game() {

        this._data_Player.bl += this._total_Reward;
        this._ui_Manager.showCurrentBalance(this._data_Player.bl);
        this._ui_Manager.button_Status(true);
        this._server.getValueRound = false;
    }
    private _hide_UI_Reward() {
        this._reel_Control.setDefult_Blackground();
        this._ui_Manager.hide_ReceiveReward();
    }

    private _bet_Manager_Add() {

        this._bet.bet_Control(this._data_Player, 1);
        this._updateData_TotalBet();
    }

    private Bet_Manager_Del() {

        this._bet.bet_Control(this._data_Player, -1);
        this._updateData_TotalBet();
    }

    private _lineBet_Add() {

        this._bet.line_Control(this._data_Player, 1);
        this._ui_Manager.show_Use_Payline(this._data_Player.l);
        this._updateData_TotalBet();
    }

    private _lineBet_Del() {

        this._bet.line_Control(this._data_Player, -1);
        this._ui_Manager.show_Use_Payline(this._data_Player.l);
        this._updateData_TotalBet();
    }

    private _updateData_TotalBet() {

        this._ui_Manager.showCurrentBet(this._data_Player.b);
        this._ui_Manager.showCurrentLineBet(this._data_Player.l);
        this._ui_Manager.showCurrentBalance(this._data_Player.bl);
        let _totalBetValue = this._data_Player.l * this._data_Player.b;
        this._data_Player.tb = _totalBetValue
        this._ui_Manager.show_totalBet(this._data_Player.tb);
    }

    private _balance_Update(): boolean {

        let _balance_Ready: boolean = false;
        let _balance = this._data_Player.bl - this._data_Player.tb;
        if (_balance >= 0) {
            this._data_Player.bl = _balance;
            this._ui_Manager.showCurrentBalance(this._data_Player.bl);
            _balance_Ready = true;
        }
        return _balance_Ready;
    }

    private _hidePanal_BalanceNotReady() {
        this._reelRun = false;
        this._ui_Manager.balance_ReadytoPlay(false);
    }
}
