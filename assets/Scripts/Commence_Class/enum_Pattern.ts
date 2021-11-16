
export enum Bet_Price {
    
    bet_Price1 = 1,
    bet_Price2 = 2,
    bet_Price3 = 5,
    bet_Price4 = 10,
    bet_Price5 = 50,
    bet_Price6 = 100,
}

export enum Reel_Number {

    reel_1 = 0,
    reel_2 = 1,
    reel_3 = 2,
}

export enum TypePayout {

    _payout2 = 2,
    _payout3 = 3,
}

export enum SlotLine {

    slot_0 = 0,
    slot_1 = 1,
    slot_2 = 2,
    slot_3 = 3,
    slot_4 = 4,
    slot_5 = 5,
    slot_6 = 6,
    slot_7 = 7,
    slot_8 = 8,
}

export enum server_Command{    

    server_Connect = "connect",
    server_Connect_Error = "connect_error",    
    prepair_Data = "resetPlayer",
    request_Data = "requestSpin",
}

export enum animation_Command{

    reset_Animation = "in",
    reel_Animation = "reelSpin_animation",
    bouns_Animation = "animate",
    bonus_Idel = "idle",
    easing_Playtype = "sineIn",
}

export enum reward_Text{

    bonus = "Bonus : ",
    reward = "Reward : ",
}

export enum hideButton_Command{

    hideSomeButton = 1,
    hideAllButton = 3,    
}