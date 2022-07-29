function en() {
  recognition.lang = "en-US";
  textbox.innerHTML = "";
  document.querySelector("#en").classList.add("disabled");
  document.querySelector("#ar").classList.add("enabled");
  document.querySelector("#ar").classList.remove("disabled");
  document.querySelector("#en").classList.remove("enabled");
  document.querySelector("#ar").removeAttribute("disabled");
  document.querySelector("#en").setAttribute("disabled", "");
  textbox.style.textAlign = "left";
}
function ar() {
  recognition.lang = "ar-SA";
  textbox.innerHTML = "";
  document.querySelector("#ar").classList.add("disabled");
  document.querySelector("#en").classList.add("enabled");
  document.querySelector("#en").classList.remove("disabled");
  document.querySelector("#ar").classList.remove("enabled");
  document.querySelector("#en").removeAttribute("disabled");
  document.querySelector("#ar").setAttribute("disabled", "");
  textbox.style.textAlign = "right";
}

var speechRecognition =
  window.speechRecognition || window.webkitSpeechRecognition;

var recognition = new speechRecognition();

var textbox = document.querySelector("#text");

var instructions = document.querySelector("#instructions");


recognition.continuous = true;
recognition.lang = "ar-SA";
recognition.onstart = function () {
  textbox.innerHTML = "";
  instructions.innerHTML = "Voice recognition is on 🔴";
  document.querySelector(".enabled").classList.add("disabled");
  document.querySelector(".enabled").setAttribute("disabled", "");
  document.querySelector("#start-btn").classList.add("disabled");
  document.querySelector("#start-btn").setAttribute("disabled", "");
  document.querySelector("#stop-btn").classList.remove("disabled");
  document.querySelector("#stop-btn").removeAttribute("disabled");
  document.querySelector("#connect").classList.add("disabled");
  document.querySelector("#connect").setAttribute("disabled", "");
};

recognition.onend = function () {
  instructions.innerHTML = "Press the start button";
  document.querySelector(".enabled").classList.remove("disabled");
  document.querySelector(".enabled").removeAttribute("disabled");
  document.querySelector("#stop-btn").classList.add("disabled");
  document.querySelector("#stop-btn").setAttribute("disabled", "");
  document.querySelector("#start-btn").classList.remove("disabled");
  document.querySelector("#start-btn").removeAttribute("disabled");
  document.querySelector("#connect").classList.remove("disabled");
  document.querySelector("#connect").removeAttribute("disabled");
};

recognition.onresult = function (event) {
  var current = event.resultIndex;
  var transcript = event.results[current][0].transcript;
  if (
    transcript.toLowerCase().includes("right") ||
    transcript.includes("يمين")
  ) {
    document.querySelector("#right").style.background = "#15217d";
    document.querySelector("#left").style.background = "none";
    writing(180);
  }
  if (
    transcript.toLowerCase().includes("left") ||
    transcript.includes("يسار")
  ) {
    document.querySelector("#left").style.background = "#15217d";
    document.querySelector("#right").style.background = "none";
    writing(0);
  }
  

  textbox.innerHTML = transcript;
};

var port;
document.querySelector("#connect").addEventListener("click", async function () {
  if(port){
    port.close();
  }
  navigator.serial.requestPort().then((value) => {
    port = value;
    console.log(port.getInfo());
    port.open({ baudRate: 9600 });
      document.querySelector("#start-btn").classList.remove("disabled");
      document.querySelector("#start-btn").removeAttribute("disabled");
      instructions.innerHTML = "Press the start button";
    port.addEventListener("disconnect", function (event) {
      document.querySelector("#start-btn").classList.add("disabled");
      document.querySelector("#start-btn").setAttribute("disabled", "");
      recognition.stop();
      instructions.innerHTML = "Connect to a device to start";
    });
  });
  
});


async function writing(value) {
  const writer = port.writable.getWriter();
  const data = new Uint8Array([value]);
  await writer.write(data);

  writer.releaseLock();
}
