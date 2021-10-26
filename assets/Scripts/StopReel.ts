// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class StopReel extends cc.Component {


    public ReelRunn : boolean = false;

    public SpeedMove : number = 5;

    
    @property(cc.Node)
    private Mainnode : cc.Node = null;


    start(){

        this.ReelRunn = true;
    }
    update(DeltaTime){

        if(this.ReelRunn == true){ 
            let GetStartPOs = this.node.position.y ;    
            this.node.setPosition(this.node.x ,GetStartPOs+=this.SpeedMove);       
      
            if(this.node.y >= 80  && this.node.y < 81){
                let node = cc.instantiate(this.node);
                node.setParent(this.Mainnode);
                node.setPosition(this.node.x,-360);                
            }       
            if(this.node.y >= 340 ){
                this.node.destroy();
            }     
        }
    }


    

    /*onLoad() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.StopReel, this);
        
    }

    start() {       
        this.GetTime = this.ReelRun.play();

    }

    ShowCurrentData(){
       
       let a = this.GetTime.clip.events.length;       
      
       let v = this.GetTime.time
       console.log(v);



       
    }

    StopReel(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.space:             
                this.ShowCurrentData();              
                this.ReelRun.stop();                
                break;
        }

    }*/
}
