
    // console.log(id);
var input = [];
var currencyRate;
var supportTouch = ('ontouchstart' in document.documentElement);

initListener();

function initListener(){
  for (var i = 11; i >= 0; i--) {
    var id = "#num-"+i;
    $(id).on("touchstart", onTouchStart(i));
    $(id).on("touchend", onTouchEnd(i));
    if (!supportTouch) {
      $(id).on("click", onClickMe(i));
    }
  };
  $("#btn-back").on("click", backAnimation());

  $("#to-conversion").click(function() {
    $('html, body').animate({
        scrollTop: $("#conventer-div").offset().top
    }, 800);
  });

  $("#btn-back").click(function() {
    $('html, body').animate({
        scrollTop: $("#show-div").offset().top
    }, 800);
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

function refreshInput(){
  var resultInput = "";
  $.each(input, function( index, value ) {
    resultInput += value;
  });
  $("#first-rate").text(resultInput);

  var floatResult =  parseFloat(resultInput);

  $("#second-rate").text(floatResult*2);
}

function backAnimation(){
  return function(){
    $('#main-div').animate({"marginTop":"250px"}, 500, function() {
      $('#main-div').animate({"marginTop":"-880px"},888,function(){
        // location.reload();
        alert("Enter!");
      });
    });
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
