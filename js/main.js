var node;
var shown_cards = [];
var asked_questions = [];
var submitted_statements = [];

var settings = {
    logged_in : false,
};

var user = {
    id : null,
    score : 0,
    cards : [],
    questions : [],
    answers : [],
    inputs: [],
    input_counter : 0,
    current_screen : "login"
};

var ui = {
    buttons : {
        login : null,
        logout : null,
        send : null,
    },
    inputs : {
        login_user_id : null,
        main_user_id : null,
        text : null
    },
    overlays : {
        login : null,
        moira : null,
        dashboard: null
    },
    view_changers : [],
    info : {
        score : null,
        cards : null,
        questions : null,
        login_error : null
    }
};

function initialize_ui(){
    ui.buttons.login = document.getElementById("login");
    ui.buttons.logout = document.getElementById("logout");
    ui.buttons.send = document.getElementById("send");
    ui.inputs.login_user_id = document.getElementById("login_username");
    ui.inputs.main_user_id = document.getElementById("username");
    ui.inputs.text = document.getElementById("text");
    ui.overlays.login = document.getElementById("login_overlay");
    ui.overlays.moira = document.getElementById("moira_overlay");
    ui.overlays.dashboard = document.getElementById("dashboard_overlay");
    ui.info.score = document.getElementById("score");
    ui.info.cards = document.getElementById("cards");
    ui.info.questions = document.getElementById("questions");
    ui.info.login_error = document.getElementById("login_error");
    ui.view_changers = document.getElementsByClassName("change_view");
}

function bind_listeners(){
    ui.buttons.login.onclick = login;
    ui.buttons.logout.onclick = logout;
    ui.buttons.send.onclick = send;
    ui.inputs.text.onkeyup = key_pressed;
    for(var i = 0; i < ui.view_changers.length; i++){
	ui.view_changers[i].onclick = function(e){change_view(e.target.getAttribute("data-view"));};
    }
}

function change_view(view){
    user.selected_screen = view;
    update_ui();
}

function login(){
    user.id = ui.inputs.login_user_id.value.charAt(0).toUpperCase() + ui.inputs.login_user_id.value.slice(1);
    if(user.id == null || user.id == ""){
        ui.info.login_error.style.display = "block";
        return;
    }

    node = new CENode(MODELS.CORE, MODELS.SHERLOCK_CORE, MODELS.SHERLOCK_NODE);
    node.set_agent_name(user.id+" agent");
    node.add_sentence("there is a tell card named 'msg_{uid}' that is from the agent '"+node.get_agent_name()+"' and is to the agent '"+node.get_agent_name()+"' and has the timestamp '{now}' as timestamp and has 'there is an agent named \\'"+node.get_agent_name()+"\\'' as content");

    settings.logged_in = true;    
    user.selected_screen = "moira";
    user.score = 0;
    user.cards = [];
    ui.info.login_error.style.display = "none";
    ui.inputs.main_user_id.value = user.id;

    update_ui();
    load_questions();//fetch_questions();
    poll_for_instances();
}

function logout(){
    settings.logged_in = false;
    user.id = null;
    user.selected_screen = "login";
    update_ui();
    node = null;
}

function key_pressed(e){
    if(e.keyCode ==13 ){
        send();
    }
    else if(e.keyCode == 38){
        if(user.input_counter > 0){
            user.input_counter--;
            ui.inputs.text.value = user.inputs[user.input_counter];       
        }
    }
    else if(e.keyCode == 40){
        if(user.input_counter < user.inputs.length-1){
            user.input_counter++;
            ui.inputs.text.value = user.inputs[user.input_counter];
        }
        else{
            ui.inputs.text.value = "";
        }
    }
}

function send(){
    var input = ui.inputs.text.value.trim().replace(/(\r\n|\n|\r)/gm,"");
    user.inputs.push(input);
    user.input_counter = user.inputs.length;
    var sentence = input.replace(/'/g, "\\'");
    var card;
    if(sentence.toLowerCase().indexOf("who ") == 0 || sentence.toLowerCase().indexOf("what ") == 0 || sentence.toLowerCase().indexOf("where ") == 0){
        card = "there is an ask card named 'msg_{uid}' that has '"+sentence+"' as content and is to the agent '"+node.get_agent_name()+"' and is from the individual '"+user.id+"' and has the timestamp '{now}' as timestamp";
        add_card(input, true, null, user.id);
    }
    else{
        card = "there is a tell card named 'msg_{uid}' that has '"+sentence+"' as content and is to the agent '"+node.get_agent_name()+"' and is from the individual '"+user.id+"' and has the timestamp '{now}' as timestamp";
        for(var i = 0; i < user.questions.length; i++){
            var q = user.questions[i];
            if(q.relationship == null && sentence.toLowerCase().indexOf(q.value.toLowerCase()) > -1 && sentence.toLowerCase().indexOf(q.concerns.toLowerCase()) > -1){
                asked_questions.push(user.questions[i].text);
            }
            else if(q.value == null && sentence.toLowerCase().indexOf(q.relationship.toLowerCase()) > -1 && sentence.toLowerCase().indexOf(q.concerns.toLowerCase()) > -1){
                asked_questions.push(user.questions[i].text);
            }
        }
        add_card(input, true, null, user.id);
        ask_question_based_on_input(sentence);

    }
    node.add_sentence(card);
    /*var cards = node.get_instances("tell card");
    for(var i = 0; i < cards.length; i++){
        var from = node.get_instance_relationship(cards[i], "is from").name;
        if(from.toLowerCase() == user.id.toLowerCase()){
            
        }
    }*/

    ui.inputs.text.value = "";
    event.preventDefault();
}

function ask_question_based_on_input(sentence){
    var ins = node.get_instances("sherlock thing", true);
    var concerns;
    var potentials = {};
    for(var i = 0; i < ins.length; i++){
        if(sentence.toLowerCase().indexOf(ins[i].name.toLowerCase()) > -1){
            concerns = ins[i];
            break
        }
    }
    if(concerns == null){return;}
    for(var i  = 0; i < user.questions.length; i++){
        if(user.questions[i].concerns == concerns.name){
            var state = get_question_state(user.questions[i]);
            if(state != "answered" && asked_questions.indexOf(user.questions[i].text) == -1){
                if(potentials[state] == null){potentials[state] = [];}
                potentials[state].push(user.questions[i]);       
            }       
        }
    }
    if(potentials.contested != null){
        add_card(potentials.contested[0].text, false, null, "SHERLOCK");
        asked_questions.push(potentials.contested[0].text);
    }
    else if(potentials.unconfident != null){
        add_card(potentials.unconfident[0].text, false, null, "SHERLOCK");
        asked_questions.push(potentials.unconfident[0].text);
    }
    else if(potentials.unanswered != null){
        add_card(potentials.unanswered[0].text, false, null, "SHERLOCK");
        asked_questions.push(potentials.unanswered[0].text);
    }
}

function update_ui(){
    if(settings.logged_in == true){
        ui.overlays.login.style.display = "none";
        if(user.selected_screen == "moira"){
                ui.overlays.moira.style.display = "block"; 
            ui.overlays.dashboard.style.display = "none";
        }
        else if(user.selected_screen == "dashboard"){
            ui.overlays.dashboard.style.display = "block";
            ui.overlays.moira.style.display = "none";
        }
        ui.info.score.innerHTML = user.score;
    }
    else{
        ui.overlays.login.style.display = "block";
        ui.overlays.moira.style.display = "none"; 
        ui.inputs.login_user_id.value = "";
        ui.info.cards.innerHTML = "";
    }
}

function add_card(card, local, id, author){
    if(id == null || (id != null && shown_cards.indexOf(id) == -1)){
        shown_cards.push(id);
        navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
        var c = '<div class="card';
        if(local){c+=' user';}
        else{
            c+=' friend';
            if(navigator.vibrate){
                navigator.vibrate([70,40,200]);
            }
        }
        c+='">';
        if(author != null){
            c+= '<p class="author">'+author+'</p>';
        }   
        c+='<p>'+card.replace(/(?:\r\n|\r|\n)/g, ' <br /> ').replace(/  /g, '&nbsp;&nbsp;')+'</p>';
        c+='</div>';
        ui.info.cards.innerHTML+=c;
        ui.info.cards.scrollTop = ui.info.cards.scrollHeight;
    }
}

function get_question_state(q){
    if(q.responses.length == 0){return "unanswered";}
    else if(q.responses.length < 3){return "unconfident";}
    else{
        var responses = {};
        var response_vols = [];
        for(var j = 0; j < q.responses.length; j++){
            if(!(q.responses[j] in responses)){responses[q.responses[j]] = 0;}
            responses[q.responses[j]]++;
        }
        for(key in responses){response_vols.push(responses[key]);}
        response_vols.sort().reverse();
        if(response_vols.length == 1){return "answered";}
        else if(response_vols.length > 1 && (response_vols[0]-response_vols[1]) >= 3){return "answered";}
        else{return "contested";}
    }
}

function check_answers(ins){
    ui.info.questions.innerHTML = "";
    for(var i = 0; i < user.questions.length; i++){user.questions[i].responses = [];}
    for(var i = 0; i < ins.length; i++){
        if(node.get_instance_relationships(ins[i], "is to").length > 0){
            var tos = node.get_instance_relationships(ins[i], "is to");
            for(var j = 0; j < tos.length; j++){
                if(tos[j].name.toLowerCase() == user.id.toLowerCase()){
                    add_card(node.get_instance_value(ins[i], "content"), false, ins[i].name, node.get_instance_relationship(ins[i], "is from").name);
                }
            }
        }
        else{
            for(var j = 0; j < user.questions.length; j++){
                var instance = ins[i];
                var question = user.questions[j];
                if(question.concerns.toLowerCase() == instance.name.toLowerCase()){
                    if(question.value != null){
                        for(var k = 0; k < instance.values.length; k++){
                            if(instance.values[k].descriptor == question.value){question.responses.push(instance.values[k].type_name.toLowerCase());}
                        }
                    }
                    if(question.relationship != null){
                        for(var k = 0; k < instance.relationships.length; k++){
                            if(instance.relationships[k].label == question.relationship){question.responses.push(instance.relationships[k].target_name.toLowerCase());}
                        }
                    }
                }
            }
        }
    }
    for(var i = 0; i < user.questions.length ; i++){
        ui.info.questions.innerHTML += '<li onclick="alert(\''+user.questions[i].text+'\');" class="response question '+get_question_state(user.questions[i])+'">'+(i+1)+'</li>';
    }
}

function load_questions(){
    var qs = node.get_instances("question");
    for(var i = 0; i < qs.length; i++){
        var q = {};
        q.responses = [];
        for(var j = 0; j < qs[i].values.length; j++){
            q[qs[i].values[j].descriptor] = qs[i].values[j].type_name;
        }
        for(var j = 0; j < qs[i].relationships.length; j++){
            q[qs[i].relationships[j].label] = qs[i].relationships[j].target_name;
        }
        user.questions.push(q);
    }
}

function poll_for_instances(){
    if(node == null){
        return;
    }
    setTimeout(function(){
        if(node != null){
            check_answers(node.get_instances());
            poll_for_instances();
        }
    },1000);
}

window.onload = function(){
    initialize_ui();
    bind_listeners();
    ui.overlays.moira.style.display = "none";
    ui.overlays.dashboard.style.display = "none";
};
