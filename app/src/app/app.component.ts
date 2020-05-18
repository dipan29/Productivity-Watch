import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import * as shortid from 'shortid';
import { ActivityListItem } from './activity-list-item';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  activityName: String = '';
  activityList: ActivityListItem[] = [];

  title = 'My Timer';

  paused: any = null; // cookie
  startTime: any;
  endTime: any;
  lastUpdated: any = new Date().getTime();
  timeElapsed: any = 0; // cookie
  state: any = 0;
  changed: boolean = false;
  reset: number = 1;
  reset_text: string = 'STOP';

  hours: any = 0;
  minutes: any = 0;
  seconds: any = 0;

  laps: any = [];

  constructor(private cookieService: CookieService) {}

  public ngOnInit(): void {
    this.cookieCheck();

    this.initiate(this.hours, this.minutes, this.seconds);

    let json_str = this.cookieService.get('main-laps');
    if (json_str.length > 1) {
      let laps = JSON.parse(json_str);
      this.laps = laps;
    }
    if (this.state == 1) {
      this.paused = 0;
      this.changed = true;
      this.startTimer();
    }
  }

  addNewActivity(event): void {
    event.preventDefault();

    let tempActivity = new ActivityListItem(
      shortid.generate(),
      this.activityName
    );
    this.activityList.push(tempActivity);
    this.activityName = '';
    console.log(this.activityList);
  }

  startTimer(): void {
    if (this.paused == null || this.paused <= 0) {
      if (!this.changed) this.lastUpdated = new Date().getTime();
      this.state = 1;
      this.reset_text = 'STOP';
      this.reset = 0;
      this.paused = setInterval(() => this.update(), 100);
    }
  }

  pauseTimer() {
    var t = this.paused;
    if (t) {
      clearInterval(this.paused);
      this.paused = -1;
      this.state = 0;
      this.setCookies();
      // set stop cookie = 1;
    } else {
      this.lastUpdated = new Date().getTime();
      this.state = 1;
      this.paused = setInterval(() => this.update(), 100);
      // Change the cookie & set stop = 0
      this.setCookies();
    }
  }

  resetTimer() {
    clearInterval(this.paused);
    this.paused = 0;
    this.timeElapsed = 0;
    this.state = 0;
    if (this.reset_text == 'RESET' && this.reset == 0) {
      this.laps = [];
      this.reset = 1;
      this.hours = this.minutes = this.seconds = '00';
    }
    this.reset_text = 'RESET';
    this.changed = false;
    this.setCookies();
    this.cookieService.deleteAll();
  }

  lapTimer() {
    let currentTime = this.timeElapsed;
    let val = new Date(currentTime);
    val.setHours(val.getHours() - 5);
    val.setMinutes(val.getMinutes() - 30);
    let name =
      this.pad(val.getHours()) +
      ' : ' +
      this.pad(val.getMinutes()) +
      ' : ' +
      this.pad(val.getSeconds());
    let hours = this.pad(val.getHours());
    let minutes = this.pad(val.getMinutes());
    let seconds = this.pad(val.getSeconds());
    let lap = { name, hours, minutes, seconds };
    this.laps.unshift(lap);

    // Set Cookie -
    let expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 1);
    this.cookieService.delete('main-laps');
    var json_str = JSON.stringify(this.laps);
    // console.log(this.laps);
    this.cookieService.set('main-laps', json_str, expiryDate);
  }

  pad(n) {
    return ('00' + n).substr(-2);
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
    this.setCookies();
  }

  initiate(h, m, n) {
    this.hours = ('00' + h).substr(-2);
    this.minutes = ('00' + m).substr(-2);
    this.seconds = ('00' + n).substr(-2);
  }

  closeLap(i) {
    this.laps.splice(i, 1);
    // Update Cookie -
    if (this.laps === undefined || this.laps.length == 0) {
      this.cookieService.delete('main-laps');
    } else {
      let expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 1);
      this.cookieService.delete('main-laps');
      var json_str = JSON.stringify(this.laps);
      this.cookieService.set('main-laps', json_str, expiryDate);
    }
  }

  setCookies() {
    let expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 1);

    this.cookieService.set('main-paused', this.paused, expiryDate);
    this.cookieService.set('main-lastUpdated', this.lastUpdated, expiryDate);
    this.cookieService.set('main-state', this.state, expiryDate);
    this.cookieService.set('main-timeElapsed', this.timeElapsed, expiryDate);
    // Not Much
    this.cookieService.set('main-hours', this.hours, expiryDate);
    this.cookieService.set('main-minutes', this.minutes, expiryDate);
    this.cookieService.set('main-seconds', this.seconds, expiryDate);
  }

  cookieCheck() {
    if (this.cookieService.check('main-timeElapsed')) {
      this.timeElapsed = parseInt(this.cookieService.get('main-timeElapsed'));
    } else {
      this.timeElapsed = 0;
    }

    if (this.cookieService.check('main-lastUpdated')) {
      this.lastUpdated = this.cookieService.get('main-lastUpdated');
    } else {
      // this.lastUpdated = 0;
    }

    if (this.cookieService.check('main-paused')) {
      this.paused = parseInt(this.cookieService.get('main-paused'));
    } else {
      this.paused = 0;
    }

    if (this.cookieService.check('main-state')) {
      this.state = parseInt(this.cookieService.get('main-state'));
    } else {
      this.state = 0;
    }

    // Not much important shit

    if (this.cookieService.check('main-hours')) {
      this.hours = parseInt(this.cookieService.get('main-hours'));
    } else {
      this.hours = 0;
    }

    if (this.cookieService.check('main-minutes')) {
      this.minutes = parseInt(this.cookieService.get('main-minutes'));
    } else {
      this.minutes = 0;
    }

    if (this.cookieService.check('main-seconds')) {
      this.seconds = parseInt(this.cookieService.get('main-seconds'));
    } else {
      this.seconds = 0;
    }
  }
}
