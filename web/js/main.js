function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

const activityTimerStatus = {
  paused: 0,
  started: 1,
};

class ActivityTimer {
  startTime = 0;
  totalTime = 0;
  status = activityTimerStatus.paused;
  constructor(_id, _name) {
    this.id = _id;
    this.name = _name;
    this.startTime = Date.now();
    this.status = activityTimerStatus.started;
    this.curretntTime = Date.now();
    this.totalTime = 0;

    setInterval(this.updateTime);

    setCookie(`${this.id}_${this.name}`, this.startTime, 1);
  }

  startTimer() {
    this.status = activityTimerStatus.started;
  }

  pauseTimer() {
    this.status = activityTimerStatus.paused;
  }

  updateTime() {
    if (this.status === activityTimerStatus.started) {
      this.curretntTime = Date.now();
      this.totalTime = this.curretntTime - this.startTime;
    } else {
      this.startTime = Date.now();
      setCookie(`${this.id}_${this.name}`, this.startTime, 1);
    }
  }
}

var activites = [];
var stopped = 1;

let updateActivityDisplay = () => {
  let tags_display = document.getElementById("tags_display");

  tags_display.innerHTML = "";

  activites.forEach((e) => {
    tags_display.innerHTML += `
        <div class="col-lg-3 col-4" id="${e.name}">
            <div class="alert alert-light alert-dismissible fade show" role="alert">
                ${e.name} - ${e.totalTime}
                <button type="button" class="close" aria-label="Close" id="x_${e.id}">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        </div>
        `;
  });

  activites.forEach((e) => {
    document.getElementById(`x_${e.id}`).addEventListener("click", () => {
      // console.log(`${e} clicked`)
      activites = activites.filter((activity) => activity.id !== e.id);
      // console.log(activites);
      updateActivityDisplay();
    });

    document.getElementById(`${e.name}`).addEventListener("click", () => {
      // console.log(`${e} clicked`)
      e.pauseTimer();
      // activites = activites.filter((activity) => activity.id !== e.id);
      // console.log(activites);
      updateActivityDisplay();
    });
  });
};

document.getElementById("activity_form").addEventListener("submit", (event) => {
  event.preventDefault();
  let activity_tag = document.getElementById("activity_tag").value;

  let newActivity = new ActivityTimer(
    Math.round(Math.random() * 1000),
    activity_tag
  );
  //in future we will create & push the object directly
  activites.push(newActivity);

  updateActivityDisplay();
  document.getElementById("activity_tag").value = "";
});

// Stop Watch
var ss = document.getElementsByClassName("stopwatch");

[].forEach.call(ss, function (s) {
  updateActivityDisplay();
  var currentTimer = 0,
    interval = 0,
    lastUpdateTime = new Date().getTime(),
    start = s.querySelector("button.start"),
    stop = s.querySelector("button.stop"),
    reset = s.querySelector("button.reset"),
    hrs = s.querySelector("span.hours"),
    mins = s.querySelector("span.minutes"),
    secs = s.querySelector("span.seconds");
  // cents = s.querySelector('span.centiseconds');

  // Params to get current time from cookie

  start.addEventListener("click", startTimer);
  stop.addEventListener("click", stopTimer);
  reset.addEventListener("click", resetTimer);

  function pad(n) {
    return ("00" + n).substr(-2);
  }

  function update() {
    var now = new Date().getTime(),
      dt = now - lastUpdateTime;

    currentTimer += dt;

    var time = new Date(currentTimer);
    // IST Conversion
    time.setHours(time.getHours() - 5);
    time.setMinutes(time.getMinutes() - 30);

    hrs.innerHTML = pad(time.getHours());
    mins.innerHTML = pad(time.getMinutes());
    secs.innerHTML = pad(time.getSeconds());
    // cents.innerHTML = pad(Math.floor(time.getMilliseconds() / 10));

    lastUpdateTime = now;
  }

  function startTimer() {
    start.style.display = "none";
    stop.style.display = "block";
    if (!interval) {
      stopped = 0;
      lastUpdateTime = new Date().getTime();
      interval = setInterval(update, 1);
    }
  }

  function stopTimer() {
    var t = interval;
    if (t) {
      start.style.display = "block";
      stop.style.display = "none";
      clearInterval(interval);
      interval = 0;
      // set stop cookie = 1;
    } else {
      start.style.display = "none";
      stop.style.display = "block";
      lastUpdateTime = new Date().getTime();
      interval = setInterval(update, 1);
      // Change the cookie & set stop = 0
    }
  }

  function resetTimer() {
    // stopTimer();
    stopped = 1;
    clearInterval(interval);
    interval = 0;
    start.style.display = "block";
    stop.style.display = "none";

    currentTimer = 0;

    mins.innerHTML = secs.innerHTML = pad(0);
  }
});
