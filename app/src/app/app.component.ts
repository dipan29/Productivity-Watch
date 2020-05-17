import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent implements  OnInit {
  title = 'My Timer';

  interval; hrs = 0; mins = 0; secs = 0;
  hours; minutes; seconds; // Main Timer
  start_time; end_time; lastUpdateTime;
  main_timer = 0;

  ngOnInit(){
      this.updateMain();
  }

  updateMain(){
      // this.hours = this.minutes = this.seconds = "00"
      this.hours = this.pad(this.hrs);
      this.minutes = this.pad(this.mins);
      this.seconds = this.pad(this.secs);
  }

  pad (n) {
    return ('00' + n).substr(-2);
  }

  update(){
    var now = new Date().getTime(),
        dt = now - this.lastUpdateTime;

        this.main_timer += dt;

        var time = new Date(this.main_timer);
        // IST Conversion
        time.setHours(time.getHours() - 5); 
        time.setMinutes(time.getMinutes() - 30);

        this.hrs = (time.getHours());
        this.mins = (time.getMinutes());
        this.secs = (time.getSeconds());

        this.updateMain();
        // cents.innerHTML = pad(Math.floor(time.getMilliseconds() / 10));

        this.lastUpdateTime = now;
  }

  startTimer(e){
    // e.preventDefault();
    // start.style.display = 'none';
    //     stop.style.display = 'block';
    if (!this.interval) {
        this.lastUpdateTime = new Date().getTime();
        this.interval = setInterval(this.update, 1);
    }
  }

  pauseTimer (e) {
    // e.preventDefault();
    var t = this.interval;
    if(t) {
        // start.style.display = 'block';
        // stop.style.display = 'none';
        clearInterval(this.interval);
        this.interval = 0;
        // set stop cookie = 1; 
    } else {
        // start.style.display = 'none';
        // stop.style.display = 'block';
        this.lastUpdateTime = new Date().getTime();
        this.interval = setInterval(this.update, 1);
        // Change the cookie & set stop = 0
    }
  }

  stopTimer (e) {
    // e.preventDefault();
    // stopTimer();
    clearInterval(this.interval);
    this.interval = 0;
    // start.style.display = 'block';
    // stop.style.display = 'none';

    this.main_timer = 0;

    this.minutes = this.seconds = this.hours = this.pad(0);
  }

}
