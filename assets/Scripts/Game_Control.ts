// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Bet_Manager } from "./Bet_Manager";
import { Data_Play } from "./Commence_Class/class_Pattern";
import { hideButton_Command, reward_Text } from "./Commence_Class/enum_Pattern";
import { Payline_Manager } from "./Payline_Manager";
import Reel_Control from "./Reel_Control";
import Reel_Description from "./Reel_Description";
import { Server_Manager } from "./Server_Manager";
import UI_Manager from "./UI_Manager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game_Control extends cc.Component {

    private _ui_Manager: UI_Manager = null;
    private _reel_Control: Reel_Control = null;
    private _payline: Payline_Manager;
    private _bet: Bet_Manager
    private _server: Server_Manager;
    private _data_Player: Data_Play;

    private _reqSymbolStatus: boolean = false;
    private _balance_Status: boolean = false;

    async onLoad() {

        this._server = Server_Manager.getinstance_Server();
        this.gameConnectServer();

        this._ui_Manager = this.node.getComponent(UI_Manager);
        this._reel_Control = this.node.getComponent(Reel_Control);

        this._payline = Payline_Manager.getinstance_Payline();
        this._bet = Bet_Manager.getInstance_Bet();
    }

    private async gameConnectServer() {

        this._data_Player = await this._server.gameGetDataPlayer(this);
        if (this._data_Player == null) {
            this._ui_Manager.connectServer_Error();
        }
        else {
            this.waitingstart();
        }
    }

    public waitingstart() {

        this._ui_Manager.waiting.active = false;
        this._setButton_Function();
        this._setReelButton();
        this._bet.lineBet_Start(this._data_Player.line);
        this.updateData_TotalBet();
        this._ui_Manager.add_ArrayButton();
    }

    private _setButton_Function() {

        this._ui_Manager.spin_Button.node.on('click', this._spin_All_Reel, this);
        this._ui_Manager.balanceNot_reandy.node.on('click', this._hidePanal_BalanceNotReady, this);
        this._ui_Manager.receive_reward.node.on('click', this._hide_UI_Reward, this);

        this._ui_Manager.betPrice.setBtnCallback(this._bet_Manager_Add, this._bet_Manager_Del, this);
        this._ui_Manager.linePayout.setBtnCallback(this._lineBet_Add, this._lineBet_Del, this);
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

    private async _set_DefultReel(): Promise<void> {

        await this._reel_Control._getSymbol_ID_FromServer();        
    }

    private _checkBalance() {

        this._ui_Manager.startPlayBonusAnimation();
        this._balance_Status = this._balance_Update();

        if (this._balance_Status == true) {
            this._request_Symbol();            
        }
    }
    
    private async _request_Symbol(){
        this._reqSymbolStatus = await this._server.requestSlotSymbol();
    }

    private _spin_All_Reel() {

        if (this._reqSymbolStatus == false) {
            this._checkBalance();
        }

        if (this._balance_Status == true) {

            let _waitingTime = 0;
            let _reel_Button = this._reel_Control.reel_Button;
            this._ui_Manager.disableButton_BySpin(hideButton_Command.hideAllButton);
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

        if (this._reqSymbolStatus == false) {
            this._checkBalance();
        }

        if (this._balance_Status == true) {

            let getDescription = ButtonReel.node.getComponent(Reel_Description);
            let _reelNumber: number = getDescription.reel_Description;
            this._reel_Control.reel_PlayAnimation(ButtonReel, _reelNumber);

            this._ui_Manager.disableButton_BySpin(hideButton_Command.hideSomeButton);

            await this._set_DefultReel();
            this._waittingTimeStopReel();
        }
        else {
            this._ui_Manager.balance_ReadytoPlay(true);
        }
    }

    private _waittingTimeStopReel() {

        let _reelNumber: number = this._reel_Control._stack_ReelSpin[0];
        this._stop_Once_Reel(_reelNumber);
    }

    private _stop_Once_Reel(ReelNumber: number) {

        let _waitTimeStopspin = 1000;
        setTimeout(() => this._reel_Control._setPicture_Slot(ReelNumber, this), _waitTimeStopspin);
        this._reel_Control._stack_ReelSpin.splice(0, 1);
    }

    public checkPlayerReward(): void {

        this._payline.checkPayLine_Reward(this._data_Player.line);

        let _waitTime_CheckResult = 200;
        setTimeout(() => this._show_Reward(), _waitTime_CheckResult);
    }

    private _show_Reward(): void {

        let _reward = this._server.reward_Value();
        let _reward_Text = reward_Text.reward;

        if (_reward.totalPayout != 0) {

            let _slotBackground = this._reel_Control.slotBonus();
            let _payline_Bonus = this._payline.payline_Reward();

            for (let i = 0; i < _payline_Bonus.length; i++) {
                this._ui_Manager.active_Line_Payline(_payline_Bonus[i]);
            }
            if (_reward.payout3 != 0) {
                _reward_Text = reward_Text.bonus;
                this._ui_Manager.playerGetBouns();
            }
            this._ui_Manager.setSlot_BG_Bonuse(_slotBackground);
            this._ui_Manager.showPriceBonus(_reward.totalPayout, _reward_Text);
        }

        else {
            this._reel_Control.setDefult_Blackground();
            this._ui_Manager.startPlayBonusAnimation();
        }

        this._endRound_Game();
    }

    private _endRound_Game() {

        this._ui_Manager.showCurrentBalance(this._data_Player.balance);
        this._ui_Manager.activeButton_EndSpin();
        this._reqSymbolStatus = false;
        this._balance_Status = false;
        this._server.getValueRound = false;
    }

    private _hide_UI_Reward() {

        this._reel_Control.setDefult_Blackground();
        this._ui_Manager.hide_ReceiveReward();
    }

    private _bet_Manager_Add() {

        this._bet.bet_Control(this._data_Player, 1);
        this.updateData_TotalBet();
    }

    private _bet_Manager_Del() {

        this._bet.bet_Control(this._data_Player, -1);
        this.updateData_TotalBet();
    }

    private _lineBet_Add() {

        this._bet.line_Control(this._data_Player, 1);
        this._ui_Manager.show_Use_Payline(this._data_Player.line);
        this.updateData_TotalBet();
    }

    private _lineBet_Del() {

        this._bet.line_Control(this._data_Player, -1);
        this._ui_Manager.show_Use_Payline(this._data_Player.line);
        this.updateData_TotalBet();
    }

    public updateData_TotalBet() {

        this._ui_Manager.showCurrentBet(this._data_Player.bet_size);
        this._ui_Manager.showCurrentLineBet(this._data_Player.line);
        this._ui_Manager.showCurrentBalance(this._data_Player.balance);
        let _totalBetValue = this._data_Player.line * this._data_Player.bet_size;
        this._data_Player.total_bet = _totalBetValue
        this._ui_Manager.show_totalBet(this._data_Player.total_bet);
    }

    private _balance_Update(): boolean {

        let _balance_Ready: boolean = false;
        let _balance = this._data_Player.balance - this._data_Player.total_bet;
        if (_balance >= 0) {
            this._ui_Manager.showCurrentBalance(this._data_Player.balance);
            _balance_Ready = true;
        }
        return _balance_Ready;
    }

    private _hidePanal_BalanceNotReady() {

        this._reqSymbolStatus = false;
        this._ui_Manager.balance_ReadytoPlay(false);
    }
}