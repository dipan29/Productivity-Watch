export class ActivityListItem {
  id: String;
  name: String;

  private paused: any = null; // cookie
  //   private startTime: any;
  //   private endTime: any;
  private lastUpdated: any = new Date().getTime();
  private timeElapsed: any = 0; // cookie
  //   private state: any = 0;
  private changed: boolean = false;
  private reset: number = 1;

  reset_text: string = 'STOP';
  hours: any = 0;
  minutes: any = 0;
  seconds: any = 0;

  constructor(_id: String, _name: String) {
    this.id = _id;
    this.name = _name;
    this.startTimer();
  }

  startTimer(): void {
    if (this.paused == null || this.paused <= 0) {
      if (!this.changed) this.lastUpdated = new Date().getTime();
      //   this.state = 1;
      this.reset = 0;
      this.paused = setInterval(() => this.update(), 100);
    }
  }

  pauseTimer() {
    let t = this.paused;
    if (t !== -1) {
      clearInterval(this.paused);
      this.paused = -1;
      //   this.state = 0;
    } else {
      this.lastUpdated = new Date().getTime();
      //   this.state = 1;
      this.paused = setInterval(() => this.update(), 100);
    }
  }

  timerToggle() {}

  resetTimer() {
    clearInterval(this.paused);
    this.paused = 0;
    this.timeElapsed = 0;
    // this.state = 0;
    if (this.reset_text == 'RESET' && this.reset == 0) {
      this.reset = 1;
      this.hours = this.minutes = this.seconds = '00';
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

  //   initiate(h, m, n) {
  //     this.hours = ('00' + h).substr(-2);
  //     this.minutes = ('00' + m).substr(-2);
  //     this.seconds = ('00' + n).substr(-2);
  //   }
}
