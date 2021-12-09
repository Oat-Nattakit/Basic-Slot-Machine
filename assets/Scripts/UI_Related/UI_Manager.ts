// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { animation_Command } from "../Commence_Class/enum_Pattern";
import ButtonNode_Manager from "./ButtonNode_Manager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UI_Manager extends cc.Component {

    @property(cc.Button)
    public spin_Button: cc.Button = null;

    @property(cc.Button)
    public balanceNot_reandy: cc.Button = null;

    @property(cc.Button)
    public receive_reward: cc.Button = null;

    @property(cc.Label)
    private bonus_Text: cc.Label = null;

    @property(cc.Label)
    private balance_Text: cc.Label = null;

    @property(cc.Label)
    private totalBet_Text: cc.Label = null;

    @property(cc.Label)
    private connectGamestatus: cc.Label = null;

    @property(cc.Node)
    private reward_Node: cc.Node = null;

    @property(cc.Node)
    public waiting: cc.Node = null;

    @property(sp.Skeleton)
    private bonus_Animation: sp.Skeleton = null;

    @property(ButtonNode_Manager)
    public betPrice: ButtonNode_Manager = null;

    @property(ButtonNode_Manager)
    public linePayout: ButtonNode_Manager = null;

    @property(cc.Node)
    private line_Payline: cc.Node[] = new Array();

    private _timer: ReturnType<typeof setTimeout>;

    @property(cc.Node)
    private listButton: cc.Button[] = new Array();


    private _bonuseScaleUp: cc.Tween[] = [];
    private _stackBackgroundNode: cc.Node[] = null;
    private _stackReel: number = 0;

    /*public add_ArrayButton() {

        this.listButton.push(this.spin_Button);
        this.listButton.push(this.betPrice.add_Button);
        this.listButton.push(this.betPrice.del_Button);
        this.listButton.push(this.linePayout.add_Button);
        this.listButton.push(this.linePayout.del_Button);
    }*/

    public startPlayBonusAnimation() {

        this._bonuseScaleUp = null;
        this.bonus_Animation.node.active = false;
        this.reward_Node.active = false;
        this.bonus_Animation.animation = animation_Command.reset_Animation;
        this._unactiveLinePayline();
        clearTimeout(this._timer);
    }

    public disableButtonBySpin(_currentRound: number = 1) {

        this._stackReel += _currentRound;
        let _reel_Range = 3;

        for (let i = 0; i < this.listButton.length; i++) {

            if (this._stackReel >= _reel_Range) {
                this.listButton[i].interactable = false;
            }
            else {
                if (i > 0) {
                    this.listButton[i].interactable = false;
                }
            }
        }
    }

    public activeButtonEndSpin() {
        this._stackReel = 0;
        for (let i = 0; i < this.listButton.length; i++) {
            this.listButton[i].interactable = true;
        }
    }

    public playerGetBouns() {

        this.bonus_Animation.node.active = true;
        this.bonus_Animation.animation = animation_Command.bouns_Animation;
        this.bonus_Animation.loop = false;
        this._timer = setTimeout(() => this.bonus_Animation.animation = animation_Command.bonus_Idel, 800);
        this.bonus_Animation.loop = true;
    }

    public showPriceBonus(_reward: number, _text: string) {

        this.reward_Node.active = true;
        this.receive_reward.node.getParent().active = true;
        this.bonus_Text.string = _text + _reward.toString();
    }

    public connectServerError() {
        this.connectGamestatus.string = "Connect Server Error";
    }

    private _unactiveLinePayline() {

        for (let i = 0; i < this.line_Payline.length; i++) {
            this.line_Payline[i].active = false;
        }
    }

    public showUsePayline(_currentLineUse: number) {

        this._unactiveLinePayline();
        for (let i = _currentLineUse - 1; i >= 0; i--) {
            this.activeLinePayline(i);
        }
    }

    public activeLinePayline(_paylineNumber: number) {

        this.line_Payline[_paylineNumber].active = true;
    }

    public showCurrentBalance(_currnetBalance: number) {

        this.balance_Text.string = _currnetBalance.toString();
    }

    public showCurrentBet(_currentBet: number) {

        this.betPrice.showValue_Text.string = _currentBet.toString();
    }

    public showCurrentLineBet(_currentLineBet: number) {

        this.linePayout.showValue_Text.string = _currentLineBet.toString();
    }

    public showTotalBet(_totalBetPrice: number) {
        this.totalBet_Text.string = _totalBetPrice.toString();
    }

    public setSlotBGBonuse(_backgroundNode: cc.Node[]) {

        this._bonuseScaleUp = new Array();
        this._stackBackgroundNode = _backgroundNode;

        for (let i = 0; i < _backgroundNode.length; i++) {

            let _colorGold = new cc.Color(255, 207, 0)
            _backgroundNode[i].color = _colorGold;
            _backgroundNode[i].children[0].opacity = 255;

            let _scalUp = cc.tween().to(0.3, { scale: 1.1 }, { easing: animation_Command.easing_Playtype });
            let _scalDown = cc.tween().to(0.3, { scale: 1 }, { easing: animation_Command.easing_Playtype });
            let _play = cc.tween(_backgroundNode[i]).sequence(_scalUp, _scalDown);
            this._bonuseScaleUp.push(cc.tween(_backgroundNode[i]).repeat(5, _play).start());
        }
    }

    public balanceReadytoPlay(_playStatus: boolean) {

        this.balanceNot_reandy.node.getParent().active = _playStatus;
    }

    public hideReceiveReward() {

        this.receive_reward.node.getParent().active = false;
        if (this._bonuseScaleUp != null) {
            this._stopAllTween();
        }
        this.startPlayBonusAnimation();
    }

    private _stopAllTween() {

        for (let i = 0; i < this._bonuseScaleUp.length; i++) {
            this._bonuseScaleUp[i].stop();
            cc.tween(this._stackBackgroundNode[i]).to(0.1, { scale: 1 }, { easing: animation_Command.easing_Playtype }).start();
        }

    }
}
