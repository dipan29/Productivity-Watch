export class ActivityListItem {
  id: String;
  name: String;
  colour: String;

  paused: any = null; // cookie
  //   private startTime: any;
  //   private endTime: any;
  lastUpdated: any = new Date().getTime();
  timeElapsed: any = 0; // cookie
  state: any = 0;
  changed: boolean = false;
  reset: number = 1;
  lastState: number = 0;

  reset_text: string = 'STOP';
  hours: any = 0;
  minutes: any = 0;
  seconds: any = 0;

  constructor(_id: String, _colour: String, _name: String) {
    this.id = _id;
    this.name = _name;
    this.colour = _colour;
    this.hours = '00';
    this.minutes = '00';
    this.seconds = '00';
  }

  public fetchData(
    _lastUpdated: any,
    _timeElapsed: any,
    _state: any,
    _changed: boolean,
    _reset: number,
    _lastState: number,
    _paused: any,
    _hours: any,
    _minutes: any,
    _seconds: any
  ): void {
    this.lastUpdated = _lastUpdated;
    this.timeElapsed = _timeElapsed;
    this.state = _state;
    this.changed = _changed;
    this.reset = _reset;
    this.lastState = _lastState;
    this.paused = _paused;
    this.hours = _hours;
    this.seconds = _seconds;
    this.minutes = _minutes;

    if (_lastState == 1) {
      this.paused = setInterval(() => this.update(), 100);
    }
  }

  startTimer(): void {
    if (this.paused == null || this.paused <= 0) {
      if (!this.changed) this.lastUpdated = new Date().getTime();
      this.state = 1;
      this.reset = 0;
      this.lastState = 1;
      this.paused = setInterval(() => this.update(), 100);
    }
  }

  pauseTimer() {
    let t = this.paused;
    if (t !== -1) {
      clearInterval(this.paused);
      this.paused = -1;
      this.state = 0;
    } else {
      this.lastUpdated = new Date().getTime();
      this.state = 1;
      this.paused = setInterval(() => this.update(), 100);
    }
  }

  public timerToggle(): void {
    this.lastState = 1 - this.lastState;
    if (this.reset) {
      this.startTimer();
    } else {
      this.pauseTimer();
    }
  }

  public getState(): number {
    return this.state;
  }

  resetTimer() {
    clearInterval(this.paused);
    this.paused = 0;
    this.timeElapsed = 0;
    this.state = 0;
    if (this.reset_text == 'RESET' && this.reset == 0) {
      this.reset = 1;
      // this.hours = this.minutes = this.seconds = '00';
    }
    this.reset_text = 'RESET';
    this.changed = false;
  }

  update(): void {
    let now = new Date().getTime();
    let dt = now - this.lastUpdated;
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
