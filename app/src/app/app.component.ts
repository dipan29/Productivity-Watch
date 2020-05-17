import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent implements  OnInit {
  title = 'My Timer';

  paused: any = 0;
  startTime: any;
  endTime: any;
  lastUpdated: any = new Date().getTime();
  timeElapsed: any = 0;

  hours: any;
  minutes: any;
  seconds: any;

  ngOnInit(){
    this.hours = ('00' + 0).substr(-2);
    this.minutes = ('00' + 0).substr(-2);
    this.seconds = ('00' + 0).substr(-2);
  }

  startTimer(){
    if(!this.paused){
      this.lastUpdated = new Date().getTime();
      this.paused = setInterval(this.update, 1);
    }
  }
  
  pauseTimer(){
    var t = this.paused;
      if(t) {
          clearInterval(this.paused);
          this.paused = 0;
          // set stop cookie = 1; 
      } else {
          this.lastUpdated = new Date().getTime();
          this.paused = setInterval(this.update, 1);
          // Change the cookie & set stop = 0
      }
  }

  resetTimer(){
    clearInterval(this.paused);
        this.paused = 0;
        this.timeElapsed = 0;
  }

  update(){
    var now = new Date().getTime();
    var dt = now - this.lastUpdated;
    this.timeElapsed += dt;

    let val = new Date(this.timeElapsed);
    val.setHours(val.getHours() - 5); 
    val.setMinutes(val.getMinutes() - 30);
    console.log(val);
    // this.hrs = val.getHours();
    // this.mins = val.getMinutes();
    // this.secs = val.getSeconds();

    this.hours = val.getHours();
    this.minutes = val.getMinutes();
    this.seconds = val.getSeconds();

    this.lastUpdated = now;
  }
}
