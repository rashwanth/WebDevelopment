var buttonColours = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern=[]
var randomChosenColour;
var hasItStarted = false
var level = 0;

function nextSequence(){
    var randomNumber;
    randomNumber = Math.floor(Math.random()*4);
    // console.log(randomNumber)
    randomChosenColour = buttonColours[randomNumber];
    gamePattern.push(randomChosenColour)
    // console.log("assa"+randomChosenColour);
    playSound(randomChosenColour)
    animatePress(randomChosenColour)
    $('#level-title').text('level '+level);
    level++
}

function playSound(name){
    new Audio('sounds/'+name+'.mp3').play();
}

function animatePress(currentColour){
    $('#'+currentColour).addClass("pressed");
    setTimeout(function () {
        $("#"+currentColour).removeClass("pressed");
    },100);

}
// Game starts
$(document).on("keypress",function(){
    if(!hasItStarted)nextSequence();
    hasItStarted = true
})

$('#'+randomChosenColour).fadeOut(100).fadeIn(100);

// playSound()
$('.btn').on('click',function(event){
    // console.log(event.target.id)
    if(!hasItStarted)return;
    var userChosenColour = event.target.id
    userClickedPattern.push(userChosenColour)
    // console.log(userClickedPattern)
    console.log(gamePattern,userClickedPattern)
    for(var i=0;i<userClickedPattern.length;++i){
        if(userClickedPattern[i]!=gamePattern[i]){
            $('#level-title').text('Game Over, Press Any Key to Restart');
            $('body').addClass('game-over')
            setTimeout(function () {
                $('body').removeClass('game-over')
            },1000);
            hasItStarted = false;
            level=0;
            gamePattern = []
            userClickedPattern = []
            playSound('wrong')
            return
        }
    }
    playSound(userChosenColour)
    animatePress(userChosenColour)
    if(userClickedPattern.length==gamePattern.length){
        userClickedPattern=[]
        setTimeout(function () {
            nextSequence();
        },1000);
    }
})