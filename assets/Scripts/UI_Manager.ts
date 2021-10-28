// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class UI_Manager extends cc.Component {

    @property(cc.Button)
    public Spin_Button: cc.Button = null;

    @property(cc.Node)
    private TextShowBonus: cc.Node = null;

    @property(sp.Skeleton)
    private Bonus_Animation: sp.Skeleton = null;

    @property(cc.Label)
    private Balance_Text : cc.Label = null;

    @property(cc.Label)
    private CurrentBet_Text : cc.Label = null;

    @property(cc.Button)
    public Add_Bet : cc.Button = null;

    @property(cc.Button)
    public Del_Bet : cc.Button = null;

    private TextBonus: cc.Label;


    public startPlayBonusAnimation() {
        this.TextBonus = this.TextShowBonus.getComponent(cc.Label);
        this.TextShowBonus.active = false;
        this.Bonus_Animation.animation = "in";
    }
    public PlayerGetBouns() {

        this.Bonus_Animation.animation = "animate";
        this.Bonus_Animation.loop = false;
        setTimeout(() => this.Bonus_Animation.animation = "idle", 800);
        this.Bonus_Animation.loop = true;
        this.TextShowBonus.active = true;
    }

    public ShowPriceBonus(Reward: number) {
        this.TextBonus.string = "Reward : " + Reward.toString();
    }

    public ShowCurrentBalance(Currnet_Balance : string){
        this.Balance_Text.string = Currnet_Balance;
    }

    public ShowCurrentBet(CurrentBet : string){
        this.CurrentBet_Text.string = CurrentBet;
    }

}
