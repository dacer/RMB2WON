
    // console.log(id);
var input = [];
var currencyRate;
var realTimeRate;
var unionPayRate;
var supportTouch = ('ontouchstart' in document.documentElement);
var isRMB2WON = true;
var useRealTimeRate = false;

initListener();
//if is weekend ,show the toast
var day = yourDateObject.getDay();
var isWeekend = (day == 6) || (day == 0);
if(isWeekend){
  showToast("今天是周末汇率不更新");
}
//rate
$.ajax({
  url: "huilv",
  context: document.body
}).done(function(data) {
  $("#rate").html(data);
  currencyRate = parseFloat(data);
  unionPayRate = currencyRate;
});

$.ajax({
  url: "huilvdate",
  context: document.body
}).done(function(data) {
  $("#date").html("&nbsp;"+data);
});

// real time rate
$.ajax({
  url: "huilvrealtime",
  context: document.body
}).done(function(data) {
  var array = data.split(',');
  $("#rate-real-time").html(array[1]);
  realTimeRate = array[1];
  //delete the " symbol
  var realTime = array[3];
  realTime = realTime.substring(1, realTime.length-1);
  var realDate = array[2];
  realDate = realDate.substring(1, realDate.length-1);
  realDate = "&nbsp;"+realTime+" "+realDate+"(米国时间)";
  $("#date-real-time").html(realDate);
});



//Conventer
function initListener(){
  for (var i = 11; i >= 0; i--) {
    var id = "#num-"+i;
    $(id).on("touchstart", onTouchStart(i));
    $(id).on("touchend", onTouchEnd(i));
    if (!supportTouch) {
      $(id).on("click", onClickMe(i));
    }
  };

  $("#to-conversion").click(function() {
    $('html, body').animate({
        scrollTop: $("#conventer-div").offset().top
    }, 500);
  });

  $("#btn-back").click(function() {
    $('html, body').animate({
        scrollTop: $("#show-div").offset().top
    }, 500);
  });

  $("#rate-standard").click(function() {
    useRealTimeRate = !useRealTimeRate;
    refreshInput();
  });

}

function onTouchStart(num){
  return function() {
      $("#num-"+num).css("backgroundColor", "rgba(255,255,255,1)");
      $("#num-"+num).css("color", "rgba(0,0,0,1)");
    };
}

function onTouchEnd(num){
  return function() {
      $("#num-"+num).css("backgroundColor", "rgba(0,0,0,0)");
      $("#num-"+num).css("color", "rgba(255,255,255,1)");
      if (supportTouch) {
        onClickOrigin(num);
      }
    };
}

function onClickMe(num){
  return function(){onClickOrigin(num)};
}

function onClickOrigin(num){
  if(num === 10){
    deleteInput();
  }else if (num === 11) {
    changeCurrencyDirection();
  }else{
    addInput(num);
  };
}
function addInput(num){
  input.push(num);
  refreshInput();
}
function deleteInput(){
  input.pop();
  refreshInput();
}

function changeCurrencyDirection(){
  isRMB2WON = !isRMB2WON;
  if(isRMB2WON){
    $("#first-symbol").html("¥");
    $("#second-symbol").html("₩");
  }else{
    $("#first-symbol").html("₩");
    $("#second-symbol").html("¥");
  }
  refreshInput();
}

function refreshInput(){
  if(useRealTimeRate){
    $("#rate-standard").text("基准：实时汇率");
    currencyRate = realTimeRate;
  }else{
    $("#rate-standard").text("基准：银联汇率");
    currencyRate = unionPayRate;
  }
  
  var resultInput = "";
  $.each(input, function( index, value ) {
    resultInput += value;
  });
  $("#first-rate").text(resultInput);

  var floatResult =  parseFloat(resultInput);
  if(isRMB2WON){
    $("#second-rate").text((floatResult*currencyRate).toFixed(0));
  }else{
    $("#second-rate").text((floatResult/currencyRate).toFixed(2));
  }


}

function loadingAnimate(){
  $('#loading-div').css("display","block"); 
}

function stopLoading(){
  $('#loading-div').css("display","none");
}


//http://stackoverflow.com/questions/7837456/comparing-two-arrays-in-javascript
// attach the .compare method to Array's prototype to call it on any array
Array.prototype.compare = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0; i < this.length; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].compare(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}



function showToast(toastText){
  var allAlpha = 0;
  var toastDiv = document.createElement("div");
  toastDiv.setAttribute("id", "toast");
  toastDiv.style.width = "100%";
  toastDiv.style.position = "fixed";
  toastDiv.style.bottom = "35px";
  toastDiv.style.textAlign = "center";

  var toastInner = document.createElement("span");
  toastInner.setAttribute("id", "toastInner");
  toastInner.style.backgroundColor = "black";
  toastInner.style.color = "white";
  toastInner.style.padding = "5px 15px";
  toastInner.style.fontSize = "20px";
  toastInner.style.borderRadius = "3px";
  toastInner.style.boxShadow = "3px 3px 6px black";


  var node = document.createTextNode(toastText);
  toastInner.appendChild(node);
  toastDiv.appendChild(toastInner);
  var body = document.getElementsByTagName("body")[0];
  body.appendChild(toastDiv);


  var toastAnim = setInterval(function(){ 
    toastInner.style.opacity = allAlpha;
    allAlpha += 0.008;
    if (allAlpha > 0.85) {
      clearInterval(toastAnim);
    };
  },10);

// hideToast
  setTimeout(function(){
    var hideToastAnim = setInterval(function(){ 
    toastInner.style.opacity = allAlpha;
    allAlpha -= 0.008;
    if (allAlpha <= 0) {
      clearInterval(hideToastAnim);
    };
  },10);
  },5000);
}
