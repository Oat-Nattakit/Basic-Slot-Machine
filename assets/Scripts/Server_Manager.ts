// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export class Server_Manager{

    private static Ins : Server_Manager = new Server_Manager();
    private Result : number[];
    private Balance : number = 10000;

    constructor(){
        Server_Manager.Ins = this;
    }

    public static Getinstant() : Server_Manager{
        return Server_Manager.Ins;
    }

    public Player_CurrentBalance() : number{                
        return this.Balance;
    }

    public Set_Slot_Range(Range : number ){
        this.Result = new Array(Range);
    }

    public Slot_Result() : number[]{

        for(let i=0 ; i<this.Result.length ; i++){
            this.Result[i] = Math.floor(Math.random() * 5);            
        }
        return this.Result;
    }

    public Result_Round(Line : number , Bet : number , Current_Balance : number , Total_Bet : number){
        //console.log(Line+" "+Bet+" "+Current_Balance+" "+Total_Bet);
    }

}
