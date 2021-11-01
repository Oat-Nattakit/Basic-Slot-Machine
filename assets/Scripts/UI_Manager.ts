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
    
    @property(cc.Label)
    private TextBonus: cc.Label = null;

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

    @property(cc.Label)
    private BetLine_Text : cc.Label = null;

    @property(cc.Button)
    public Add_Line : cc.Button = null;

    @property(cc.Button)
    public Del_Line : cc.Button = null;

    @property(cc.Label)
    private TotalBet : cc.Label = null;

    @property(cc.Node)
    private Line_Payline : cc.Node[] = new Array();
    
    private timer: ReturnType<typeof setTimeout> ;

    public startPlayBonusAnimation() {
        this.Bonus_Animation.node.active = false;
        this.TextBonus.node.active = false;        
        this.Bonus_Animation.animation = "in";              
        clearTimeout(this.timer);

        for(let i=0 ; i<this.Line_Payline.length ; i++){
            this.Line_Payline[i].active = false;
        }
    }
    public PlayerGetBouns() {

        this.Bonus_Animation.node.active = true;
        this.Bonus_Animation.animation = "animate";
        this.Bonus_Animation.loop = false;        
        this.timer = setTimeout(() => this.Bonus_Animation.animation = "idle", 800);
        this.Bonus_Animation.loop = true;        
    }

    public ShowPriceBonus(Reward: number) {
        
        this.TextBonus.node.active = true;
        this.TextBonus.string = "Reward : "+ + Reward.toString();        
    }

    public ShowLine_Payline(Payline_number : number){
        this.Line_Payline[Payline_number].active = true;
    }

    public ShowCurrentBalance(Currnet_Balance : number){
        this.Balance_Text.string = Currnet_Balance.toString();
    }

    public ShowCurrentBet(CurrentBet : number){
        this.CurrentBet_Text.string = CurrentBet.toString();
    }

    public ShowCurrentLineBet(CurrentLineBet : number){
        this.BetLine_Text.string = CurrentLineBet.toString();
    }

    public TotalBet_Show(value : number){
        this.TotalBet.string = value.toString();
    }

}
