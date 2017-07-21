var node;
var shownCards = [];
var askedQuestions = [];
var submittedStatements = [];
var scoredCards = [];
var spacePressed = 0;
var lastSpacePressed = 0;
var forbidInput = false;
var multiplayer;
var latestLatitude = null;
var latestLongitude = null;

var loggingConfigs = [
  {url: 'http://logger.cenode.io/cards/sherlock', loggedCards: []},
  {url: 'http://logger2.cenode.io/cards/sherlock', loggedCards: []}
];

var settings = {
  loggedIn : false,
};

var user = {
  id : null,
  cards : [],
  questions : [],
  answers : [],
  inputs: [],
  inputCounter : 0,
  score : 0,
  currentScreen : "login"
};

var log = {
  recordingPresses : false,
  keypresses : 0,
  startTime : 0,
  endTime : 0
};

var ui = {
  buttons : {
    login : null,
    logout : null,
  },
  inputs : {
    loginUserId : null,
    mainUserId : null,
    text : null,
    guess : null,
    autofill : null,
    multiplayer: null
  },
  overlays : {
    login : null,
    moira : null,
    dashboard: null
  },
  viewChangers : [],
  info : {
    cards : null,
    questions : null,
    loginError : null,
    score : null,
    onlineStatus : null
  }
};

function initializeUi(){
  ui.buttons.login = document.getElementById("login");
  ui.inputs.loginUserId = document.getElementById("login_username");
  ui.inputs.mainUserId = document.getElementById("username");
  ui.inputs.text = document.getElementById("text");
  ui.inputs.guess = document.getElementById("guess");
  ui.inputs.autofill = document.getElementById("autofill");
  ui.inputs.multiplayer = document.getElementById("multiplayer");
  ui.overlays.login = document.getElementById("login_overlay");
  ui.overlays.moira = document.getElementById("moira_overlay");
  ui.overlays.dashboard = document.getElementById("dashboard_overlay");
  ui.info.cards = document.getElementById("cards");
  ui.info.questions = document.getElementById("questions");
  ui.info.loginError = document.getElementById("login_error");
  ui.info.score = document.getElementById("score");
  ui.info.onlineStatus = document.getElementById("online_status");
  ui.viewChangers = document.getElementsByClassName("change_view");
}

function bindListeners(){
  ui.buttons.login.onclick = login;
  ui.inputs.loginUserId.onkeyup = login;
  ui.inputs.text.onkeyup = keyUp;
  ui.inputs.text.onkeydown = keyDown;
  for(var i = 0; i < ui.viewChangers.length; i++){
	  ui.viewChangers[i].onclick = function(e){changeView(e.target.getAttribute("data-view"));};
  }
}

function changeView(view){
  user.selectedScreen = view;
  updateUi();
}

function login(e){
  if(e && e.keyCode){
    if(e.keyCode !== 13){
      return;
    }
  }
  user.id = ui.inputs.loginUserId.value.charAt(0).toUpperCase() + ui.inputs.loginUserId.value.slice(1);
  user.id = user.id.trim();
  multiplayer = ui.inputs.multiplayer.checked == true;
  if(user.id == null || user.id == ""){
    ui.info.loginError.style.display = "block";
    return;
  }

  if(multiplayer){
    node = new CENode(CEModels.core, SHERLOCK_CORE_MODEL, SHERLOCK_NODE_MODEL);
    ui.info.onlineStatus.style.display = "block";
    checkOnline();
  }
  else{
    node = new CENode(CEModels.core, SHERLOCK_CORE_MODEL);
    ui.info.onlineStatus.style.display = "none";
  }
  node.attachAgent();
  node.agent.setName(user.id+" agent");
  window.setTimeout(function(){
    node.addSentence("there is a tell card named 'msg_{uid}' that is from the agent '"+node.agent.name.replace(/'/g, "\\'")+"' and is to the agent '"+node.agent.name.replace(/'/g, "\\'")+"' and has the timestamp '{now}' as timestamp and has 'there is an agent named \\'"+node.agent.name.replace(/'/g, "\\\'")+"\\'' as content");
    node.addSentence("there is a feedback policy named 'p3' that has the individual '"+user.id+"' as target and has 'true' as enabled and has 'full' as acknowledgement"); 
  }, 100);

  settings.loggedIn = true;  
  user.selectedScreen = "moira";
  user.cards = [];
  ui.info.loginError.style.display = "none";

  updateUi();
  loadQuestions();
  pollForInstances();
  for(var i = 0; i < loggingConfigs.length; i++){
    logCards(loggingConfigs[i]);
  }
}

function keyDown(e){
  if(forbidInput){
    e.preventDefault();
    return false;
  }
  if(e.keyCode == 9){
    e.preventDefault();
    return false;
  }
  if(e.keyCode == 32){
    spacePressed = new Date().getTime();
    if((spacePressed - lastSpacePressed) < 400 && ui.inputs.text.value.slice(-1) == ' '){
      if(ui.inputs.text.value.length < ui.inputs.guess.value.length && ui.inputs.autofill.checked == true){
          e.preventDefault();
          ui.inputs.text.value = node.nlParser.guessNext(ui.inputs.text.value.substring(0, ui.inputs.text.value.length-1)) + " ";
          return false;
      }
    }
    lastSpacePressed = new Date().getTime();
  }
}

function keyUp(e){
  if(forbidInput){
    e.preventDefault();
    return false;
  }
  if(e.keyCode == 13){
    log.recordingPresses = false;
    log.endTime = parseInt(new Date().getTime());
    send();
  }
  else if(e.keyCode == 38){
    if(user.inputCounter > 0){
      user.inputCounter--;
      ui.inputs.text.value = user.inputs[user.inputCounter];     
    }
    e.preventDefault();
  }
  else if(e.keyCode == 40){
    if(user.inputCounter < user.inputs.length-1){
      user.inputCounter++;
      ui.inputs.text.value = user.inputs[user.inputCounter];
    }
    else{
      ui.inputs.text.value = "";
    }
  }
  else if(e.keyCode == 9){
    ui.inputs.text.value = node.nlParser.guessNext(ui.inputs.text.value);
    e.preventDefault();
    return false;
  }
  else{
    if(log.recordingPresses == false){
      log.recordingPresses = true;
      log.startTime = parseInt(new Date().getTime());
      log.keypresses = 0;
    }
    log.keypresses++;
  }

  if(ui.inputs.autofill.checked == true){
    ui.inputs.guess.value = node.nlParser.guessNext(ui.inputs.text.value);
  }
  else{
    ui.inputs.guess.value = "";
  }
}

function send(){
  var input = ui.inputs.text.value.trim().replace(/(\r\n|\n|\r)/gm,"");

  ui.inputs.text.value = "";
  user.inputs.push(input);
  user.inputCounter = user.inputs.length;

  var sentence = input.replace(/'/g, "\\'");
  var card;
  if(sentence.toLowerCase().trim() == 'show anomalies'){
    addCardSimple(sentence, 'user');
    var objects = node.concepts.object.instances;
    for(var i = 0; i < objects.length; i++){
      addCardSimple(objects[i].gist, 'friend');
    }
    return;
  }
  else if(sentence.toLowerCase().indexOf("who ") == 0 || sentence.toLowerCase().indexOf("what ") == 0 || sentence.toLowerCase().indexOf("where ") == 0 || sentence.toLowerCase().indexOf("list ") == 0){
    card = "there is an ask card named 'msg_{uid}' that has '"+sentence+"' as content and is to the agent '"+node.agent.name.replace(/'/g, "\\'")+"' and is from the individual '"+user.id+"' and has the timestamp '{now}' as timestamp";
    addCardSimple(input, 'user');
  }
  else{
    if(submittedStatements.indexOf(input.toLowerCase()) > -1 ){
      addCardSimple("I cannot accept duplicate information from the same user.", 'friend');
      return window.alert("The input is invalid or you've already entered this information!");
    }
    submittedStatements.push(input.toLowerCase());

    card = "there is an nl card named 'msg_{uid}' that has '"+sentence+"' as content and is to the agent '"+node.agent.name.replace(/'/g, "\\'")+"' and is from the individual '"+user.id+"' and has the timestamp '{now}' as timestamp";
    addCardSimple(input, 'user');
  }
  node.addSentence(card);
}

function confirmCard(id, content){
  document.getElementById("confirm_"+id).style.display = "none";
  document.getElementById("unconfirm_"+id).style.display = "none";
  forbidInput = false;
  ui.inputs.text.focus();

  if(submittedStatements.indexOf(content.toLowerCase()) > -1){
    addCardSimple("I cannot accept duplicate information from the same user.", 'friend');
    return window.alert("You have already entered or conifirmed this statement.");
  }
  submittedStatements.push(content.toLowerCase());

  addCardSimple("Yes.", 'user');
  var card = "there is a tell card named 'msg_{uid}' that has '"+content.replace(/'/g, "\\'")+"' as content and is to the agent '"+node.agent.name.replace(/'/g, "\\'")+"' and is from the individual '"+user.id+"' and has the timestamp '{now}' as timestamp and is in reply to the card '"+id+"'";
  card+=" and has '"+log.keypresses+"' as number of keystrokes";
  card+=" and has '"+log.endTime+"' as submit time";
  card+=" and has '"+log.startTime+"' as start time";
  if(latestLatitude && latestLongitude){
    card+=" and has '"+latestLatitude+"' as latitude";
    card+=" and has '"+latestLongitude+"' as longitude";
  }

  node.addSentence(card);
}

function unconfirmCard(id){
  document.getElementById("confirm_"+id).style.display = "none";
  document.getElementById("unconfirm_"+id).style.display = "none";
  addCardSimple("No.", 'user');
  addCardSimple("OK.", 'friend');
  forbidInput = false;
  ui.inputs.text.focus();
}

function updateUi(){
  if(settings.loggedIn == true){
    ui.overlays.login.style.display = "none";
    ui.info.score.innerHTML = user.score+' points';
    if(user.selectedScreen == "moira"){
      ui.overlays.moira.style.display = "block"; 
      ui.overlays.dashboard.style.display = "none";
    }
    else if(user.selectedScreen == "dashboard"){
      ui.overlays.dashboard.style.display = "block";
      ui.overlays.moira.style.display = "none";
    }
  }
  else{
    ui.overlays.login.style.display = "block";
    ui.overlays.moira.style.display = "none"; 
    ui.inputs.loginUserId.value = "";
    ui.info.cards.innerHTML = "";
  }
}

function addCardSimple(text, user){
  ui.info.cards.innerHTML += '<li class="card '+user+'"><p>'+text+'</p></li>';
  ui.info.cards.scrollTop = ui.info.cards.scrollHeight;
}

function addCard(card){
  var content = card.content;
  var id = card.name;
  var tos = card.is_tos.map(function(to){
    return to.name.toLowerCase();
  });
  var from = card.is_from.name;
  var cardType = card.type;
  var linkedContent = card.linked_content;
  
  if(!content){return;}
  if(id == null || (id != null && shownCards.indexOf(id) == -1)){
    shownCards.push(id);
    navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
    var c = '<li class="card';
    if(tos && tos.indexOf(user.id) > -1){c+=' user';}
    else{
      c+=' friend';
      if(navigator.vibrate){
        navigator.vibrate([70,40,200]);
      }
    }
    c+='">';
    c+='<p>';
    if(cardType != null && cardType.name == "confirm card"){
      c+='OK. Is this what you meant?<br /><br />';
    }
    c+=content.replace(/(?:\r\n|\r|\n)/g, ' <br /> ').replace(/  /g, '&nbsp;&nbsp;')+'</p>';
    if(cardType != null && cardType.name == "confirm card"){
      c+='<button id="confirm_'+id+'" class="confirm" onclick="confirmCard(\''+id+'\', \''+content.replace(/'/g, "\\'")+'\')">Yes</button>';
      c+='<button id="unconfirm_'+id+'" class="unconfirm" onclick="unconfirmCard(\''+id+'\')">No</button>';
      forbidInput = true;
    }
    if(linkedContent != null){
      c+='<img src="'+linkedContent+'" alt="Attachment" />';
    }
    c+='</li>';
    ui.info.cards.innerHTML+=c;
    ui.info.cards.scrollTop = ui.info.cards.scrollHeight;
  }
}

function getQuestionState(q){
  if(q.responses.length == 0){return "unanswered";}
  else if(q.responses.length < 3){return "unconfident";}
  else{
    var responses = {};
    var responseVols = [];
    for(var j = 0; j < q.responses.length; j++){
      if(!(q.responses[j] in responses)){responses[q.responses[j]] = 0;}
      responses[q.responses[j]]++;
    }
    for(key in responses){responseVols.push(responses[key]);}
    responseVols.sort().reverse();
    if(responseVols.length == 1){return "answered";}
    else if(responseVols.length > 1 && (responseVols[0]-responseVols[1]) >= 3){return "answered";}
    else{return "contested";}
  }
}

function loadQuestions(){
  var qs = node.getInstances("question");
  for(var i = 0; i < qs.length; i++){
    var q = {};
    q.responses = [];
    for(var j = 0; j < qs[i].values.length; j++){
      var insName = typeof qs[i].values[j].instance == 'string' ? qs[i].values[j].instance : qs[i].values[j].instance.name;
      q[qs[i].values[j].label] = insName;
    }
    for(var j = 0; j < qs[i].relationships.length; j++){
      q[qs[i].relationships[j].label] = qs[i].relationships[j].instance.name;
    }
    user.questions.push(q);
  }
}

function pollForInstances(){
  if(node == null){
    return;
  }
  setTimeout(function(){
    var ins = node.getInstances();
    for(var i = 0; i < user.questions.length; i++){user.questions[i].responses = [];}
    for(var i = 0; i < ins.length; i++){
      // Detect if type of card. If so, filter and add to UI if necessary
      if(ins[i].type.name.indexOf("card") > -1){
        var tos = ins[i].is_tos;
        if(tos){for(var j = 0; j < tos.length; j++){
          if(tos[j].name.toLowerCase() == user.id.toLowerCase()){
            addCard(ins[i]);
          }
        }}
      }
      else{
        for(var j = 0; j < user.questions.length; j++){
          var instance = ins[i];
          var question = user.questions[j];
          if(question.concerns.toLowerCase() == instance.name.toLowerCase()){
            if(question.value != null){
              for(var k = 0; k < instance.values.length; k++){
                if(instance.values[k].label == question.value){
                  if(typeof instance.values[k].instance == "string"){
                    question.responses.push(instance.values[k].instance.toLowerCase());
                  }
                  else{
                    question.responses.push(instance.values[k].instance.name.toLowerCase());
                  }
                }
              }
            }
            if(question.relationship != null){
              for(var k = 0; k < instance.relationships.length; k++){
                if(instance.relationships[k].label == question.relationship){
                  question.responses.push(instance.relationships[k].instance.name.toLowerCase());
                }
              }
            }
          }
        }
      }
    }
    ui.info.questions.innerHTML = "";
    user.score = 0;
    var ratios = {};
    for(var i = 0; i < user.questions.length ; i++){
      var state = getQuestionState(user.questions[i]);
      ui.info.questions.innerHTML += '<li onclick="alert(\''+user.questions[i].text+'\');" class="response question '+state+'">'+(i+1)+'</li>';
      if(state == 'answered'){
        user.score++;
      }
      if(!(state in ratios)){
        ratios[state] = 0;
      }
      ratios[state]++;
    }
    var bars = document.getElementById('dashboard_indicator').getElementsByTagName('div');
    for(var i = 0; i < bars.length; i++){
      bars[i].style.width = "0%";
    }
    for(var type in ratios){
      document.getElementById(type).style.width = Math.floor(ratios[type] * 100 / parseFloat(user.questions.length))+'%';
    }
    updateUi();
    pollForInstances();
  },1000);
}

function logCards(config){
  return;
  try{
    var cards = node.getInstances("card", true);
    var properties = ['timestamp', 'content', 'is in reply to', 'is from', 'number of keystrokes', 'submit time', 'start time', 'latitude', 'longitude'];
    var unloggedCards = [];
    for(var i = 0; i < cards.length; i++){
      if(config.loggedCards.indexOf(cards[i].name) == -1){
        var cardToLog = {};
        cardToLog.name = cards[i].name;
        cardToLog.type = cards[i].type.name;
        for(var j = 0; j < properties.length; j++){
          var prop = properties[j];
          if(cards[i].property(prop)){
            cardToLog[prop] = cards[i].property(prop).name || cards[i].property(prop);
          }
        }
        unloggedCards.push(cardToLog);
      }  
    }
    if(unloggedCards.length == 0){
      setTimeout(function(){
         logCards(config);
      }, 3000); 
      return;
    }  

    var xhr = new XMLHttpRequest();
    xhr.open("POST", config.url);
    xhr.onreadystatechange = function(){
      if(xhr.readyState == 4 && xhr.status == 200){
        setTimeout(function(){
          for(var i = 0; i < unloggedCards.length; i++){
            config.loggedCards.push(unloggedCards[i].name);
          }
          logCards(config);
        }, 10000);
      }
      else if(xhr.readyState == 4 && xhr.status != 200){
        setTimeout(function(){
          logCards(config);
        }, 5000);
      }
    }
    xhr.send(JSON.stringify(unloggedCards));
  }
  catch(err){
    console.log(err);
    setTimeout(function(){
      logCards(config);
    }, 5000);
  }
}

function checkOnline(){
  var now = new Date().getTime();
  if (node.agent){
    var last = node.agent.policyHandler.lastSuccessfulRequest;
    var diff = now - last;
    if(diff < 5000){
      ui.info.onlineStatus.style.backgroundColor = "green";
    }
    else{
      ui.info.onlineStatus.style.backgroundColor = "rgb(200,200,200)";
    }
  }
  setTimeout(function(){
    checkOnline();
  }, 1000);
}

var recordPosition = function(position){
  latestLongitude = position.coords.longitude;
  latestLatitude = position.coords.latitude;
}

window.onresize = function(event) {
  ui.info.cards.style.height = (window.innerHeight - 200)+'px'; 
  ui.info.cards.scrollTop = ui.info.cards.scrollHeight;
  document.getElementById('wrapper').style.height = window.innerHeight+'px';
}

window.onbeforeunload = function() { 
  return "Quitting Sherlock may mean you can't resume from where you left off."; 
};

window.onload = function(){
  initializeUi();
  bindListeners();
  ui.overlays.moira.style.display = "none";
  ui.overlays.dashboard.style.display = "none";
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(recordPosition);
  }
  ui.inputs.text.focus();
  ui.info.cards.style.height = (window.innerHeight - 200)+'px'; 
  document.getElementById('wrapper').style.height = window.innerHeight+'px';
};
