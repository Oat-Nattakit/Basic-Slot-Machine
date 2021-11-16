// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ButtonNode_Manager from "./ButtonNode_Manager";
import { animation_Command } from "./Class_Pattern/enum_Pattern";

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

    private _listButton: cc.Button[] = new Array();

    private _bonuse_ScaleUp: cc.Tween[] = [];
    private _stack_BackgroundNode: cc.Node[] = null;
    private _stackReel: number = 0;

    public add_ArrayButton() {

        this._listButton.push(this.spin_Button);
        this._listButton.push(this.betPrice.add_Button);
        this._listButton.push(this.betPrice.del_Button);
        this._listButton.push(this.linePayout.add_Button);
        this._listButton.push(this.linePayout.del_Button);
    }

    public startPlayBonusAnimation() {

        this._bonuse_ScaleUp = null;
        this.bonus_Animation.node.active = false;
        this.reward_Node.active = false;
        this.bonus_Animation.animation = animation_Command.reset_Animation;
        this._unactive_Line_Payline();
        clearTimeout(this._timer);
    }

    public disableButton_BySpin(_currentRound: number = 1) {

        this._stackReel += _currentRound;
        let _reel_Range = 3;

        for (let i = 0; i < this._listButton.length; i++) {

            if (this._stackReel >= _reel_Range) {
                this._listButton[i].interactable = false;
            }
            else {
                if (i > 0) {
                    this._listButton[i].interactable = false;
                }
            }
        }
    }

    public activeButton_EndSpin() {
        this._stackReel = 0;
        for (let i = 0; i < this._listButton.length; i++) {
            this._listButton[i].interactable = true;
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

    public connectServer_Error() {
        this.connectGamestatus.string = "Connect Server Error";
    }

    private _unactive_Line_Payline() {

        for (let i = 0; i < this.line_Payline.length; i++) {
            this.line_Payline[i].active = false;
        }
    }

    public show_Use_Payline(_currentLineUse: number) {

        this._unactive_Line_Payline();
        for (let i = _currentLineUse - 1; i >= 0; i--) {
            this.active_Line_Payline(i);
        }
    }

    public active_Line_Payline(_payline_number: number) {

        this.line_Payline[_payline_number].active = true;
    }

    public showCurrentBalance(_currnet_Balance: number) {

        this.balance_Text.string = _currnet_Balance.toString();
    }

    public showCurrentBet(_current_Bet: number) {

        this.betPrice.showValue_Text.string = _current_Bet.toString();
    }

    public showCurrentLineBet(_current_LineBet: number) {

        this.linePayout.showValue_Text.string = _current_LineBet.toString();
    }

    public show_totalBet(_total_BetPrice: number) {
        this.totalBet_Text.string = _total_BetPrice.toString();
    }

    public setSlot_BG_Bonuse(_background_Node: cc.Node[]) {

        this._bonuse_ScaleUp = new Array();
        this._stack_BackgroundNode = _background_Node;

        for (let i = 0; i < _background_Node.length; i++) {

            let _colorGold = new cc.Color(255, 207, 0)
            _background_Node[i].color = _colorGold;
            _background_Node[i].children[0].opacity = 255;

            let _scalUp = cc.tween().to(0.3, { scale: 1.1 }, { easing: animation_Command.easing_Playtype });
            let _scalDown = cc.tween().to(0.3, { scale: 1 }, { easing: animation_Command.easing_Playtype });
            let _play = cc.tween(_background_Node[i]).sequence(_scalUp, _scalDown);
            this._bonuse_ScaleUp.push(cc.tween(_background_Node[i]).repeat(5, _play).start());
        }
    }

    public balance_ReadytoPlay(_playStatus: boolean) {

        this.balanceNot_reandy.node.getParent().active = _playStatus;
    }

    public hide_ReceiveReward() {

        this.receive_reward.node.getParent().active = false;
        if (this._bonuse_ScaleUp != null) {
            this._stopAllTween();
        }
        this.startPlayBonusAnimation();
    }

    private _stopAllTween() {

        for (let i = 0; i < this._bonuse_ScaleUp.length; i++) {
            this._bonuse_ScaleUp[i].stop();
            cc.tween(this._stack_BackgroundNode[i]).to(0.1, { scale: 1 }, { easing: animation_Command.easing_Playtype }).start();
        }

    }
}
