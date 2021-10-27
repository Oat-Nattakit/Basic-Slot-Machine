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
    public Spin_Button : cc.Button = null;

    @property(cc.Button)
    public StopSpin : cc.Button = null;

    @property(sp.Skeleton)
    private Bonus_Animation: sp.Skeleton = null;



    public PlayerGetBouns() {
        this.Bonus_Animation.animation = "animate";
    }
}
