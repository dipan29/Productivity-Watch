import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { generate } from 'shortid';
import { ActivityListItem } from './activity-list-item';
// import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'My Timer';

  myColours: string[] = [
    '#1abc9c',
    '#16a085',
    '#2ecc71',
    '#27ae60',
    '#3498db',
    '#2980b9',
    '#9b59b6',
    '#8e44ad',
    '#34495e',
    '#2c3e50',
    '#f1c40f',
    '#f39c12',
    '#e67e22',
    '#d35400',
    '#e74c3c',
    '#c0392b',
  ];
  color_set1: string[] = this.myColours;

  paused: any = null; // cookie
  startTime: any;
  endTime: any;
  lastUpdated: any = new Date().getTime();
  timeElapsed: any = 0; // cookie
  state: any = 0;
  changed: boolean = false;
  reset: number = 1;
  reset_text: string = 'STOP';
  start_text: string = 'START';

  hours: any = 0;
  minutes: any = 0;
  seconds: any = 0;

  laps: any = [];
  // lap_name: any = '';

  add_placeholder: string = 'Your Task';
  public tag_name: string = '';
  tags: any = [];
  activities: ActivityListItem[] = [];

  constructor(private cookieService: CookieService) {}

  public ngOnInit(): void {
    this.cookieCheck();

    this.initiate(this.hours, this.minutes, this.seconds);

    var json_str = this.cookieService.get('main-laps');
    if (json_str.length > 1) {
      let laps = JSON.parse(json_str);
      this.laps = laps;
    }
    if (this.state == 1) {
      this.paused = 0;
      this.changed = true;
      this.startTimer();
    }
    this.fetchTimerState();
  }

  public ngOnDestroy(): void {
    // this.saveTimerState();
  }

  startTimer(): void {
    if (this.reset_text == 'RESET' && this.reset == 0) {
      this.resetTimer();
      this.start_text = 'START OVER';
    }

    if (this.paused == null || this.paused <= 0) {
      if (!this.changed) this.lastUpdated = new Date().getTime();

      this.activities.forEach((activity) => {
        if (activity.lastState) {
          activity.startTimer();
        }
      });
      this.state = 1;
      this.reset_text = 'STOP';
      this.reset = 0;
      this.paused = setInterval(() => this.update(), 100);
      this.start_text = 'START';
    }
  }

  pauseTimer() {
    var t = this.paused;
    this.activities.forEach((activity) => {
      if (activity.getState()) activity.pauseTimer();
    });
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
    if (this.reset === 1) return;

    clearInterval(this.paused);
    this.paused = 0;
    this.timeElapsed = 0;
    this.state = 0;
    this.activities.forEach((activity) => {
      activity.resetTimer();
    });
    this.start_text = 'START OVER';

    if (this.reset_text == 'RESET' && this.reset == 0) {
      this.laps = [];
      this.reset = 1;
      this.activities = [];
      this.clearSubTimers();
      this.hours = this.minutes = this.seconds = '00';
      this.start_text = 'START';
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
    let tag = '';
    let lap = { name, hours, minutes, seconds, tag };
    this.laps.unshift(lap);

    // Set Cookie -
    let expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 1);
    this.cookieService.delete('main-laps');
    var json_str = JSON.stringify(this.laps);
    // console.log(this.laps);
    this.cookieService.set('main-laps', json_str, expiryDate);
  }

  nameLap(i) {
    var lap_def = '';
    if (this.laps[i].tag.length > 0) {
      lap_def = this.laps[i].tag;
    } else {
      lap_def = '';
    }
    let lap_name: string = prompt('Customize the Lap Name - ', lap_def);
    if (lap_name.length > 0) {
      this.laps[i].tag = lap_name;
      let expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 1);
      this.cookieService.delete('main-laps');
      var json_str = JSON.stringify(this.laps);
      this.cookieService.set('main-laps', json_str, expiryDate);
    }
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
    this.saveTimerState();
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

  addTag() {
    if (this.tag_name != '') {
      let id = generate();
      var colour = this.color_set1[
        Math.floor(Math.random() * this.color_set1.length)
      ];
      let activity = new ActivityListItem(id, colour, this.tag_name);
      this.activities.push(activity);
      // this.activities.push(this.tag_name);
      for (var i = 0; i < this.color_set1.length; i++) {
        if (this.color_set1[i] === colour) {
          this.color_set1.splice(i, 1);
        }
      }
      this.tag_name = '';
      this.add_placeholder = 'Another Task';
      // console.log(this.activities);
      this.saveTimerState();
    }
  }

  deleteTag(i) {
    this.activities.splice(i, 1);
    this.saveTimerState();
    // Update Cookie -
    if (this.activities === undefined || this.activities.length == 0) {
      this.add_placeholder = 'Your Task';
    }
  }

  startSubTimer(i) {
    this.startTimer();
    this.activities.forEach((activity) => {
      if (activity.getState()) {
        activity.pauseTimer();
        activity.lastState = 0;
      }
    });
    this.activities[i].startTimer();
    this.saveTimerState();
  }

  fetchTimerState(): void {
    // var json_str = this.cookieService.get('main-timers');
    var json_str = localStorage.getItem('main-timers');
    let _activities = [];
    // cookie .length > 0
    if (json_str) {
      _activities = JSON.parse(json_str);
      _activities.forEach((_activity) => {
        // Run the initiate code
        let activity = new ActivityListItem(
          _activity.id,
          _activity.colour,
          _activity.name
        );
        activity.fetchData(
          _activity.lastUpdated,
          _activity.timeElapsed,
          _activity.state,
          _activity.changed,
          _activity.reset,
          _activity.lastState,
          _activity.paused,
          _activity.hours,
          _activity.minutes,
          _activity.seconds
        );
        this.activities.push(activity);

        this.add_placeholder = 'Activities Set!';
      });
    }
  }

  saveTimerState() {
    if (this.activities === undefined || this.activities.length == 0) {
      // this.cookieService.delete('main-timers');
      localStorage.removeItem('main-timers');
    } else {
      let expiryDate = new Date();
      // expiryDate.setDate( expiryDate.getDate() + 1 );
      // this.cookieService.delete('main-timers');
      localStorage.removeItem('main-timers');
      var json_str = JSON.stringify(this.activities);
      // this.cookieService.set('main-timers', json_str, expiryDate);
      localStorage.setItem('main-timers', json_str);
    }
  }

  clearSubTimers() {
    localStorage.removeItem('main-timers');
    this.add_placeholder = 'Your Task';
    // this.cookieService.delete('main-timers');
  }
}
