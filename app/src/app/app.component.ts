import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent implements  OnInit {
  title = 'My Timer';

  paused: any = null;
  startTime: any;
  endTime: any;
  lastUpdated: any = new Date().getTime();
  timeElapsed: any = 0;

  hours: any = 0;
  minutes: any = 0;
  seconds: any = 0;

  ngOnInit(){
    this.hours = ('00' + 0).substr(-2);
    this.minutes = ('00' + 0).substr(-2);
    this.seconds = ('00' + 0).substr(-2);
  }

  startTimer(): void{
    if(this.paused == null || this.paused == 0){
      this.lastUpdated = new Date().getTime();
      this.paused = setInterval(() => this.update(), 1);
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
          this.paused = setInterval(() => this.update(), 1);
          // Change the cookie & set stop = 0
      }
  }

  resetTimer(){
    clearInterval(this.paused);
    this.paused = 0;
    this.timeElapsed = 0;
    this.hours = this.minutes = this.seconds = "00";
  }

  update(): void {
    var now = new Date().getTime();
    var dt = now - this.lastUpdated;
    this.timeElapsed = (this.timeElapsed || 0) + dt;
    // console.log(this.timeElapsed);
    let val = new Date(this.timeElapsed);
    val.setHours(val.getHours()); 
    val.setMinutes(val.getMinutes());
    val.setHours(val.getHours() - 5); 
    val.setMinutes(val.getMinutes() - 30);
    // console.log(val.getSeconds());

    this.hours = ('00' + val.getHours()).substr(-2);
    this.minutes = ('00' + val.getMinutes()).substr(-2);
    this.seconds = ('00' + val.getSeconds()).substr(-2);

    this.lastUpdated = now;
  }
  
}
