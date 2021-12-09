// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Bet_Manager } from "../Bet_Related/Bet_Manager";
import { Payline_Manager } from "../Bet_Related/Payline_Manager";
import { Data_Play, Player_Reward, IResultReelSpin as IResultReelSpin } from "../Commence_Class/class_Pattern";
import { hideButton_Command, Reel_Number, reward_Text } from "../Commence_Class/enum_Pattern";
import { slot_DataPattern } from "../Commence_Class/interface_Pattern";
import Reel_Control from "../Reel_Related/Reel_Control";
import Reel_Description from "../Reel_Related/Reel_Description";
import { Server_Manager } from "../Server_Related/Server_Manager";
import UI_Manager from "../UI_Related/UI_Manager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game_Control extends cc.Component {

    private _uiManager: UI_Manager = null;
    private _reelControl: Reel_Control = null;
    private _payline: Payline_Manager;
    private _bet: Bet_Manager;
    private _server: Server_Manager;
    private _dataPlayer: Data_Play;
    private _reward: Player_Reward;

    private _resultSymbol: number[] = new Array(9);

    private _reqSymbolStatus: boolean = false;
    private _isBalanceEnoughToPlay: boolean = false;

    onLoad() {

        this._server = Server_Manager.getinstanceServer();
        this.gameConnectServer();

        this._uiManager = this.node.getComponent(UI_Manager);
        this._reelControl = this.node.getComponent(Reel_Control);

        this._payline = Payline_Manager.getinstancePayline();
        this._bet = Bet_Manager.getInstanceBet();
    }

    private async gameConnectServer() {

        this._server.gameConnectServer(this);
        this._dataPlayer = await this._server.gameGetDataPlayer();
        if (this._dataPlayer == null) {
            this._uiManager.connectServerError();
        }
        else {
            this.waitingstart();
        }
    }

    public waitingstart() {

        this._uiManager.waiting.active = false;
        this._setButtonFunction();
        this._setReelButton();
        this._bet.lineBetStart(this._dataPlayer.line);
        this.updateDataTotalBet();
    }

    private _setButtonFunction() {

        this._uiManager.spin_Button.node.on('click', this._spinAllReel, this);
        this._uiManager.balanceNot_reandy.node.on('click', this._hidePanalBalanceNotEnough, this);
        this._uiManager.receive_reward.node.on('click', this._hideRewardUI, this);

        this._uiManager.betPrice.setBtnCallback(this._betManagerAdd, this._betManagerDel, this);
        this._uiManager.linePayout.setBtnCallback(this._lineBetAdd, this._lineBetDel, this);
    }

    private _setReelButton() {

        let ReelNode = this._reelControl.reelNode;
        let Reel_Button: cc.Button[];
        this._reelControl.reelButton = new Array(ReelNode.length);
        Reel_Button = this._reelControl.reelButton;

        for (let i = 0; i < ReelNode.length; i++) {
            Reel_Button[i] = ReelNode[i].getComponent(cc.Button);
            Reel_Button[i].node.on('click', this._spinOneReel, this);
        }
    }

    private async _getIDSymbol(): Promise<void> {

        await this._reelControl.isRequestSymbolIDFromServer();
    }

    private _checkBalance() {

        this._uiManager.startPlayBonusAnimation();
        this._isBalanceEnoughToPlay = this._currentBalanceReadytoPlay();

        if (this._isBalanceEnoughToPlay == true) {
            this._uiManager.showCurrentBalance(this._dataPlayer.balance);
            this._requestSymbol();
        }
    }

    private _requestSymbol() {

        let paramiter: Data_Play = {
            balance: this._dataPlayer.balance,
            bet_size: this._dataPlayer.bet_size,
            line: this._dataPlayer.line,
            total_bet: this._dataPlayer.total_bet
        };

        let req_DataSymbol = this._server.requestSlotSymbol(paramiter);
        if (req_DataSymbol != null) {
            this._dataPlayer.balance = this._dataPlayer.balance - this._dataPlayer.total_bet;
            this._resultReelSpin(req_DataSymbol);
        }
    }

    private _resultReelSpin(dataSlotSymbol: slot_DataPattern) {       

        let getResultData: IResultReelSpin = new IResultReelSpin(dataSlotSymbol);
        this._reelControl.slotSymbolData = getResultData.bet_array;

        this._reward = new Player_Reward(getResultData.pay_out2,getResultData.pay_out3,getResultData.total_payout);
        this.updateDataTotalBet();
        this._dataPlayer.balance = getResultData.balance;
    }
    
    private _spinAllReel() {

        if (this._reqSymbolStatus == false) {
            this._checkBalance();
        }

        if (this._isBalanceEnoughToPlay == true) {

            let _waitingTime = 0;
            let _reel_Button = this._reelControl.reelButton;
            this._uiManager.disableButtonBySpin(hideButton_Command.hideAllButton);
            for (let i = 0; i < _reel_Button.length; i++) {
                if (_reel_Button[i].enabled == true) {
                    this.scheduleOnce(() => this._spinOneReel(_reel_Button[i]), _waitingTime);
                    //setTimeout(() => this._spin_One_Reel(_reel_Button[i]), _waitingTime);
                    _waitingTime += 200;
                }
            }
        }
        else {
            this._uiManager.balanceReadytoPlay(true);
        }
    }

    private async _spinOneReel(ButtonReel: cc.Button) {

        if (this._reqSymbolStatus == false) {
            this._checkBalance();
        }

        if (this._isBalanceEnoughToPlay == true) {

            let getDescription = ButtonReel.node.getComponent(Reel_Description);
            let _reelNumber: number = getDescription.reel_Description;
            this._reelControl.reelPlayAnimation(ButtonReel, _reelNumber);

            this._uiManager.disableButtonBySpin(hideButton_Command.hideSomeButton);

            await this._getIDSymbol();
            this._waittingTimeStopReel();
        }
        else {
            this._uiManager.balanceReadytoPlay(true);
        }
    }

    private _waittingTimeStopReel() {

        let _reelNumber: number = this._reelControl.stackReelSpin[0];
        this._stopOnceReel(_reelNumber);
    }

    private _stopOnceReel(ReelNumber: number) {

        let _waitTimeStopspin = 1000;
        //setTimeout(() => this._reel_Control.setPictureSlot(ReelNumber, this), _waitTimeStopspin);
        this.scheduleOnce(() => {
            this._reelControl.setPictureSlot(ReelNumber);
            if (this._reelControl.isSpinComplete) {
                this.checkPlayerReward();
                this._reelControl.resetSlot();
            }
        }, _waitTimeStopspin);
        this._reelControl.stackReelSpin.splice(0, 1);
    }

    public checkPlayerReward(): void {

        this._payline.checkPaylineReward(this._dataPlayer.line);

        let _waitTimeCheckResult = 200;
        //setTimeout(() => this._show_Reward(), _waitTimeCheckResult);
        this.scheduleOnce(() => this._showReward(), _waitTimeCheckResult);
    }

    private _showReward(): void {

        //let _reward = this._server.rewardValue();
        let _reward = this._reward;
        let _rewardText = reward_Text.reward;

        if (_reward.totalPayout != 0) {

            let _slotBackground = this._reelControl.slotBonus();
            let _paylineBonus = this._payline.paylineReward();

            for (let i = 0; i < _paylineBonus.length; i++) {
                this._uiManager.activeLinePayline(_paylineBonus[i]);
            }
            if (_reward.payout3 != 0) {
                _rewardText = reward_Text.bonus;
                this._uiManager.playerGetBouns();
            }
            this._uiManager.setSlotBGBonuse(_slotBackground);
            this._uiManager.showPriceBonus(_reward.totalPayout, _rewardText);
        }

        else {
            this._reelControl.setDefultBackground();
            this._uiManager.startPlayBonusAnimation();
        }

        this._endRoundGame();
    }

    private _endRoundGame() {

        this._uiManager.showCurrentBalance(this._dataPlayer.balance);
        this._uiManager.activeButtonEndSpin();
        this._reqSymbolStatus = false;
        this._isBalanceEnoughToPlay = false;
    }

    private _betManagerAdd() {

        this._bet.betControl(this._dataPlayer, 1);
        this.updateDataTotalBet();
    }

    private _betManagerDel() {

        this._bet.betControl(this._dataPlayer, -1);
        this.updateDataTotalBet();
    }

    private _lineBetAdd() {

        this._bet.lineControl(this._dataPlayer, 1);
        this._uiManager.showUsePayline(this._dataPlayer.line);
        this.updateDataTotalBet();
    }

    private _lineBetDel() {

        this._bet.lineControl(this._dataPlayer, -1);
        this._uiManager.showUsePayline(this._dataPlayer.line);
        this.updateDataTotalBet();
    }

    public updateDataTotalBet() {

        this._uiManager.showCurrentBet(this._dataPlayer.bet_size);
        this._uiManager.showCurrentLineBet(this._dataPlayer.line);
        this._uiManager.showCurrentBalance(this._dataPlayer.balance);
        let _totalBetValue = this._dataPlayer.line * this._dataPlayer.bet_size;
        this._dataPlayer.total_bet = _totalBetValue
        this._uiManager.showTotalBet(this._dataPlayer.total_bet);
    }

    private _currentBalanceReadytoPlay(): boolean {

        let _balanceEnoughtoPlay: boolean = false;
        let _balance = this._dataPlayer.balance - this._dataPlayer.total_bet;
        if (_balance >= 0) {
            _balanceEnoughtoPlay = true;
        }
        return _balanceEnoughtoPlay;
    }

    private _hidePanalBalanceNotEnough() {

        this._uiManager.balanceReadytoPlay(false);
    }

    private _hideRewardUI() {

        this._reelControl.setDefultBackground();
        this._uiManager.hideReceiveReward();
    }
}