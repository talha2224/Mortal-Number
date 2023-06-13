const { ErrorResponse } = require("../../Error/Utils");
const {GameModel,RewardsModel, SetterInfo,GetterInfo,NotificationModel, DeviceTokenSchema} = require("../../Models")
const admin = require('firebase-admin')
const serviceAccount = require('../../push-notification-611cf-firebase-adminsdk-gh2h0-4e9015eec7.json')

// FIREBASE PUSH NOTIFICATION CODDE 
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://push-notification-611cf.firebaseio.com' 
}) 

const postGame = async (id,winningnumber,stake,prize,hours,minutes,second) => {
  let findSetter = await GameModel.findOne({active: true,setterId: id,}).populate("setterId");
  let setter = await SetterInfo.findById(id);
  if (findSetter) {
    throw new ErrorResponse("your have already posted a game", 429);
  }
  if (!setter){
    throw new ErrorResponse("Wrong Setter Id",404)
  }
  
  else if (setter.accountBlocked===true) {
    throw new ErrorResponse("your account has been blocked", 403);
  } 
  else {
      let setterId = await SetterInfo.findById(id);
      if (setterId.credit >= prize) {
        let updateSetterCredit = await SetterInfo.findByIdAndUpdate(id,{$set: {credit: setterId.credit - prize}},{ new: true });
        const duration = {hours: hours,min: minutes,sec: second};
        let createGame = await GameModel.create({setterId: id,winningNumber: winningnumber,stake: stake,prize: prize,duration: duration});
        if (createGame) {
          let createNoti = await NotificationModel.create({setterId:id,gameId:createGame._id,title:"New Game Posted"})
          let createSetterAmount = await NotificationModel.create({setterId:id,gameId:createGame._id,role:"setter",amount:prize,won:false,title:`You posted a new game ${prize} deducted from your account`})
          let createReward= await RewardsModel.create({setterId:id,amount:prize,gameId:createGame._id,won:false,role:"setter"})
          return createGame;
        } 
        else {
          throw new ErrorResponse("failed to post game", 409);
        }
      } 
      else {
        throw new ErrorResponse("you donot have enough credit", 402);
      }
  }
};

//  GUESSER GET GAME
const getGame = async (getterId) => {
  let allGame = await GameModel.find({}).sort({ createdAt: -1 }).populate("setterId","-OTP -otpValidTill -otpVerified -credit -email -password -phonenumber -dateOfBirth -country -createdAt -updatedAt").exec();
  if (allGame.length > 0) {
    const modifiedGame = allGame.map((game) => {

      if (game.winBy.includes(getterId)) {
        return { ...game.toObject(), win: true };
      } 
      else if (!game.winBy.includes(getterId)){
        return { ...game.toObject(), win: false};
      }
    });
    return modifiedGame;
  } 
  else {
    throw new ErrorResponse("NO GAME FOUND OR YOU HAVE ALREADY PLAYED ALL THE POSTED GAMES",404);
  }
};

// SINGLE GAME
const singleGame = async (id) => {
  let singleGame = await GameModel.findOne({ _id: id}).populate("setterId","-OTP -otpValidTill -otpVerified -credit -email -password -phonenumber -_id  -dateOfBirth -country");
  if (singleGame) {
    return singleGame;
  } 
  else {
    throw new ErrorResponse("NO GAME FOUND PLEASE ADD SOME", 404);
  }
};

//FIND BY SETTER ID
const findGameforSetter = async (id) => {
  let findGame = await GameModel.find({ setterId: id }).sort({ createdAt: -1 });
  if (findGame.length > 0) {
    return findGame;
  } else {
    return { msg: "No game posted yet" };
  }
};

// ALREDAY POSTED FOR SETTER
const checkGame = async (id) => {
  let findGame = await GameModel.findOne({ setterId: id });
  if (findGame) {
    throw new ErrorResponse("you have alreday posted a game", 500);
  } else {
    return { msg: "No game posted yet" };
  }
};

const deleteGame = async (id) => {
  let deleteGame = await GameModel.findByIdAndDelete(id);
  if (deleteGame) {
    return { msg: "GAME DELETED", status: 200 };
  } else {
    throw new ErrorResponse("NO GAME FOUND FAILED TO DELETE", 404);
  }
};

const updateGame = async (id, winningnumber,deletewinningnumber,stake,prize,winners,deleteWinner) => {
  let updated = await GameModel.findByIdAndUpdate(id,{
        $push: {
            winBy: winners,
            winningNumber: winningnumber,
        },
        $set: {
            stake: stake,
            prize: prize,
        },
        $pull: {
            winBy: deleteWinner,
            winningNumber: deletewinningnumber,
        },},{ new: true });
    if (updated) {
        return updated;
    } 
    else {
        throw new ErrorResponse("Failed To Update", 304);
    }
};

const playGame = async (getterid, gameid) => {
  let findUserCredit = await GetterRegisterModel.findById(getterid);
  if (!findUserCredit) throw new ErrorResponse("No Getter found", 404);
  let findGameId = await GameModel.findById(gameid);
  if (!findGameId) throw new ErrorResponse("No Game found", 404);
  let alreadyWin = findGameId.winBy.includes(getterid);
  if (alreadyWin) {
    throw new ErrorResponse("you alreday win the game", 403);
  } 
};


const afterGame = async (getterid, gameid, answer, setterid) => {

  let findUserCredit = await GetterInfo.findById(getterid);
  if (!findUserCredit) throw new ErrorResponse("No Getter found", 404);

  let findGameId = await GameModel.findById(gameid);
  if (!findGameId) throw new ErrorResponse("No Game found", 404);

  let alreadyPlayed = findGameId.winBy.includes(getterid);
  let check = findGameId.winningNumber.every((item) => answer.includes(item));

  if (alreadyPlayed) {
    throw new ErrorResponse("you alreday win the game", 403);
  } 
  let updateUserCredit = await GetterInfo.findByIdAndUpdate(getterid,{$set:{credit:findUserCredit.credit-findGameId.stake}},{new:true})

  if (findGameId.stake>findUserCredit.credit){
    throw new ErrorResponse ('you donot have enough credit to play this game',402)
  }

  else if (check) {

    let updateGetterAmount = await GetterInfo.findByIdAndUpdate(
      getterid,
      { $set: { credit: updateUserCredit.credit + findGameId.prize } },
      { new: true }
    );
    let getSetterDeatil = await SetterInfo.findById(setterid)
    let updateSetterAmount = await SetterInfo.findByIdAndUpdate(setterid,{$set:{
      credit : findGameId.stake
    }})
    let postNotication = await NotificationModel.create({
      role:"guesser",
      amount: findGameId.prize,
      won: true,
      guesserId:getterid,
      setterId:setterid,
      gameId:gameid
    });

    let postReward= await RewardsModel.create({
      role:"guesser",
      guesserId:getterid,
      won:true,
      amount:findGameId.prize,
      gameId:gameid,
      setterId:setterid
    })

    let updateGame = await GameModel.findByIdAndUpdate(gameid,{
        $push: {
          winBy: getterid,
        },
    },
      { new: true }
    );

    if (updateGetterAmount && postReward && updateGame) {
      return {
        msg: `You Won The Amount`,
        amount: findGameId.prize,
        totalAmount: updateUserCredit.credit + findGameId.prize,
      };
    } 
    else {
      throw new ErrorResponse("CHECK YOUR BACKEND CODE ON LINE 170", 400);
    }
  } 

  else if (!check){

    let Guesser_PostNotification = await NotificationModel.create({
      role:"guesser",
      amount: findGameId.prize,
      won: false,
      guesserId: getterid,
      setterId:setterid,
      gameId:gameid
    });
    let getSetterDetails = await SetterInfo.findById(setterid);
    let updateSetterAmount = await SetterInfo.findByIdAndUpdate(
      setterid,
      {
        $set: {
          credit: getSetterDetails.credit + findGameId.stake,
        },
      }
    );
    let guesserpostReward= await RewardsModel.create({
      role:"guesser",
      guesserId:getterid,
      won:false,
      amount:findGameId.prize,
      gameId:gameid,
      setterId:setterid
    })
    let updateGame = await GameModel.findByIdAndUpdate(gameid,{$set:{
      totalEarn:findGameId.totalEarn+findGameId.stake,
    }},{new:true})
    let postSetterNotification = await NotificationModel.create({
      role:"setter",
      amount: findGameId.stake,
      won: true,
      setterId: setterid,
      guesserId:getterid,
      gameId:gameid,
    });
    let setterpostRewrad= await RewardsModel.create({
      role:"setter",
      setterId:setterid,
      won:true,
      amount:findGameId.prize,
      gameId:gameid,
      guesserId:getterid
    })
    return {
      msg: "You Lost The Game",
      creditLeftInYourAccount: updateUserCredit.credit,
      statusCode:201
    };
  }
};

//GET ACTIVE GAME FOR ADMIN
const showAdminGame = async () => {
  let allActiveGame = await GameModel.find({ active: true }).sort({ createdAt: -1 }).populate("setterId","-OTP -otpValidTill -otpVerified -credit -email -password -phonenumber -dateOfBirth -country -createdAt -updatedAt").exec();
  if (allActiveGame.length > 0) {
    return allActiveGame;
  } else {
    throw new ErrorResponse("no active game yet", 404);
  }
};

module.exports = {postGame,getGame,singleGame,deleteGame,updateGame,playGame,afterGame,findGameforSetter,checkGame,showAdminGame,};