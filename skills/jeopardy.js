/*
when a player says "Join Jeopardy" add them to the game
if a player can guess, they say "Guess: (their guess)" and sends it into the engine which sees if theyre right
winner needs to select the question
*/
module.exports = function(controller) {
  
//  const parse = require('csv-parse');
    
  var currentQ = 'What is the highest selling video game?'
  var prize = '800';
  var answer = 'Tetris';
  var game;
  
  controller.on('bot_space_join', function(bot, message) {
    bot.reply(message, 'Who is... ready for JEOPARDY?.');
    bot.reply(message, 'If you want to join, just tell me join jeopardy');
    game = new trivia_bot();
    
  });
   
//  controller.on('user_space_join', function(bot, message) {
//
  //  bot.reply(message, 'Welcome to JEOPARDY, ' + message.raw_message.data.personDisplayName);
   // game.addPlayer(message.user);
  //});
  
  controller.hears(['join'], 'direct_message, direct_mention', function(bot, message){
    //bot.reply(message, 'You are already in the game' + message.user);
    if(!game.containsPlayer(message.user)){
      game.addPlayer(message.user);
      bot.reply(message, message.user + ' has joined');
    }
    //else
      //bot.reply(message, 'You are already in the game ' + message.user);
       
  });
  
  controller.hears(['newgame'], 'direct_message,direct_mention', function(bot, message) {
      //currentQ = (get next Q from database);
      //prize = (get next Q prize)?;
      //var data = $.csv.toObjects(csv)
      //bot.reply(message, 'Game reset, type join to join');
      //game = new trivia_bot();
      /*bot.reply(message, game.test());
      bot.reply(message, 'Topic: ' + game.currentQuestion().getTopic());
      bot.reply(message, 'Value: ' + game.currentQuestion().getVal());
      bot.reply(message, 'Question: ' + game.currentQuestion().getQuestion());*/
      bot.createConversation(message, function(err, convo){
            convo.sayFirst('Game reset, type join to join.');
            convo.say(game.test());
            convo.say('Topic: ' + game.currentQuestion().getTopic());
            convo.say('Value: ' + game.currentQuestion().getVal());
            convo.say('Question: ' + game.currentQuestion().getQuestion());
      });
      //bot.reply(message, 'Question: ' + currentQ);
    
  });
  controller.hears(['My ID'], 'direct_message, direct_mention', function(bot, message){
      bot.reply(message, message.user);
       
  });
  controller.hears(['Points'],'direct_message, direct_mention', function(bot, message){
    bot.reply(message, game.getPlayerPoints());
  });
  controller.hears('Answer: (.*)', 'direct_message, direct_mention',function(bot,message){
        var playerAnswer = message.match[1];

        if(game.guessQuestion(message.user, playerAnswer)){
          bot.reply(message, 'Correct!');
        }

        else{
          //update player points
          bot.reply(message, 'Incorrect.');
        }
      bot.reply('New points: \n');
      bot.reply(message, game.getPlayerPoints());
  });
    
  controller.hears(['Question'],'direct_message, direct_mention', function(bot, message){
    bot.reply(message, 'Topic: ' + game.currentQuestion().getTopic());
    bot.reply(message, 'Value: ' + game.currentQuestion().getVal());
    bot.reply(message, 'Question: ' + game.currentQuestion().getQuestion());
  });

  





}

/*class jeopardy_engine  {

  constructor(){
    //this.readInQuestions();
    this.reset();
    var allText =[];
    var allTextLines = [];
    var lines = [];

    var txtFile = new XMLHttpRequest();
    
      $(document).ready(function() {
      $.ajax({
          type: "GET",
          url: "jeopardy.txt",
          dataType: "text",
          success: function(data) {this.processData(data);}
       });
  });
 function processData(allText) {
      var record_num = 4;  // or however many elements there are in each row
      var allTextLines = allText.split(/\r\n|\n/);
      var entries = allTextLines[0].split('\t');
      

      var headings = entries.splice(0,record_num);
      while (entries.length>0) {
          var tarr = [];
          for (var j=0; j<record_num; j++) {
              tarr.push(headings[j]+":"+entries.shift());
          }
          lines.push(tarr);
      }
    //alert(lines);
    }
  
  }
  
  
  
              
  chooseQuestion(topic, val, playerId){
    if(!this.containsPlayer(playerId))
      return 'You are not in the game. If you want to join, message me Join Jeopardy';
    if(!this.availableTopics.includes(topic))
      return 'This topic is not a current topic.';
    if(!(val == 200 || val == 400 || val == 600 || val == 800 || val == 1000))
      return 'There is no question with this value, choose a value which is 200, 400, 600, 800, or 1000';
    if(this.selectQuestion(topic, val))
      return 'You have selected the next question';
    else
      return 'There is no question with that value anymore';
  }
  
  selectQuestion(topic, val){
    if(this.topics.get(topic).getQuestion(val) != null){
      this.curQuestion = this.topics.get(topic).getQuestion(val);
      this.curTopic = topic;
      this.needsQuestion = false;
      return true;
    }
    return false;
  } 
  
  addPlayer(playerId){
    this.players.push(new player(playerId));
  }
  
  reset(){
    this.players = [];
    this.needsQuestion = true;
    /*this.topics = {'Topic':String, 'QuestionData':topic};
    this.scienceQuestions = [];
    this.scienceQuestions.push(new question("What is at the center of the Solar System?", "What is the Sun?"));
    this.scienceQuestions.push(new question("What is the center of an atom?", "What is the nucleus?"));
    this.scienceQuestions.push(new question("Who came with his so called 'Law of Cooling'?", "What is Isaac Newton?"));
    this.scienceQuestions.push(new question("How many dwarf planets are there in the Solar System?", "What is 3 dwarf planets?"));
    this.scienceQuestions.push(new question("What is the scientific term for peeling skin?", "What is Desquamation?"));
    this.scienceTopic = new topic(this.scienceQuestions);
    this.topics.set("Science",this.scienceTopic);
    this.socialQuestions = [];
    this.socialQuestions.push(new question("Who is the first US President?", "What is George Washington?"));
    this.socialQuestions.push(new question("Who originally ruled the 13 colonies?", "What is Great Britain?"));
    this.socialQuestions.push(new question("Who was the US President with the most vetoes?", "What is Andrew Jackson?"));
    this.socialQuestions.push(new question("Who wrote the Star Spangled Banner?", "What is John Stafford Smith?"));
    this.socialQuestions.push(new question("How many verses does the Star Spangled  Banner have?", "What is four?"));
    this.topics.set("Social Science", this.socialQuestions);
    /*this.topics.put("Science",this.topics.get("Science").put("200", this.topics.get("Science").get("200").put(new question("What is at the center of the Solar System?", "What is the Sun?"))));
    this.topics.put("Science",this.topics.get("Science").put("400", this.topics.get("Science").get("400").put(new question("What is the center of an atom?", "What is the nucleus?"))));
    this.topics.put("Science",this.topics.get("Science").put("600", this.topics.get("Science").get("600").put(new question("Who came with his so called 'Law of Cooling'?", "What is Isaac Newton?"))));
    this.topics.put("Science",this.topics.get("Science").put("800", this.topics.get("Science").get("800").put(new question("How many dwarf planets are there in the Solar System?", "What is 3 dwarf planets?"))));
    this.topics.put("Science",this.topics.get("Science").put("1000", this.topics.get("Science").get("1000").put(new question("What is the scientific term for peeling skin?", "What is Desquamation?"))));
    this.topics.put("Social Studies",this.topics.get("Social Studies").put("200", this.topics.get("Social Studies").get("200").put(new question("Who is the first US President?", "What is George Washington?"))));
    this.topics.put("Social Studies",this.topics.get("Social Studies").put("400", this.topics.get("Social Studies").get("400").put(new question("Who originally ruled the 13 colonies?", "What is Great Britain?"))));
    this.topics.put("Social Studies",this.topics.get("Social Studies").put("600", this.topics.get("Social Studies").get("600").put(new question("Who was the US President with the most vetoes?", "What is Andrew Jackson?"))));
    this.topics.put("Social Studies",this.topics.get("Social Studies").put("800", this.topics.get("Social Studies").get("800").put(new question("Who wrote the Star Spangled Banner?", "What is John Stafford Smith?"))));
    this.topics.put("Social Studies",this.topics.get("Social Studies").put("1000", this.topics.get("Social Studies").get("1000").put(new question("How many verses does the Star Spangled  Banner have?", "What is four?"))));*/
  /*}
  canGuess(){
    return !this.needsQuestion;
  }
  guess(playerGuess, playerId){
    for (player in this.players)
      if(player.isPlayer(playerId)){
         player.changeMoney(this.curQuestion.isCorrect(playerGuess), this.topics.getVal(this.curQuestion));
         this.needsQuestion = this.curQuestion.isCorrect(playerGuess);
         this.topics.get(this.curTopic).useQuestion(this.curQuestion); 
      }
  }
  containsPlayer(playerId){
    for (player in this.players)
      if(player.isPlayer(playerId)){
         return true;
      }
    return false;
  }
  
  getRandomIndex(){
    return Math.random() * questions.length;
  }
}*/

class player{
  constructor(playerId){
    this.playerId = playerId;
    this.money = 0;
  }
  
  changeMoney(correct, val){
    if(!correct)
      val *= -1;
    this.money += val;
  }
  isPlayer(playerId){
    return this.playerId === playerId
  }
  getPlayerId(){
    return this.playerId;
  }
  getMoney(){
    return this.money;
  }
}

class trivia_bot{
  constructor(){
    this.reset();
  }
  reset(){
    this.players = [];
    this.questions = this.getQuestions();
    this.nextQuestion();
    
    
  }
  getPlayerPoints(){
    var ptString= '';
    for( player in this.players)
      ptString += player.getPlayerId + ' \t Points: ' + player.getMoney() + '\n';
    return ptString;
  }
  getQuestions(){

    
    /*var allText =[];
    var allTextLines = [];
    var lines = [];
    return null;

    //var txtFile = new XMLHttpRequest();
    
      /*$(document).ready(function() {
      $.ajax({
          type: "GET",
          url: "jeopardy.txt",
          dataType: "text",
          success: function(data) {this.processData(data);}
       });
  });
 function processData(allText) {
      var record_num = 4;  // or however many elements there are in each row
      var allTextLines = allText.split(/\r\n|\n/);
      var entries = allTextLines[0].split('\t');
      

      var headings = entries.splice(0,record_num);
      while (entries.length>0) {
          var tarr = [];
          for (var j=0; j<record_num; j++) {
              tarr.push(headings[j]+":"+entries.shift());
          }
          lines.push(tarr);
      }
    //alert(lines);
    }
    return lines;*/
    var questions = [];
    return questions.push(new question('Test', 0, 'How many inches are in a foot?', '12'));
  }  
  containsPlayer(playerId){
    for(player in this.players)
      if(player.isPlayer(playerId)){
         return true;
      }
    return false;
  }
  nextQuestion(){
    this.curQuestionIndex = Math.floor(Math.random() * this.questions.length);
  }
  addPlayer(playerId){
    this.players.push(new player(playerId));
  }
  guessQuestion(playerId, answer){
    var correct = this.questions[this.curQuestionIndex].isCorrect(answer);
    player.changeMoney(correct, this.questions[this.curQuestionIndex].getVal());
    if(correct){
      this.questions.splice(this.curQuestionIndex, 1);
      this.nextQuestion();
    }
    return correct;
  }
  currentQuestion(){
    return this.questions[this.curQuestionIndex];
  }
  test(){
    return 'test';
  }
}
class question{
  constructor(topic, value, question, answer){
    this.question = question;
    this.answer = answer;
    this.topic = topic;
    this.value = value;
  }
  getQuestion(){
    return this.question;
  }
  getAnswer(){
    return this.answer;
  }
  getVal(){
    return this.value;
  }
  getTopic(){
    return this.topic;
  }
  isCorrect(guess){
    return this.answer.includes(guess);
  }
}
 



//class topic{
  //constructor(questions){
    //this.questions = questions;
  //}
  //getVal(question){
   // return (this.questions.findIndex(question) + 1) * 200;
 // }
  //useQuestion(question){
  //  this.questions[this.questions.findIndex(question)] = null;
 // }
 // getQuestion(val){
  //  return this.questions[val/200 - 1];
  //}
