export class Scheduler {
  private _timer: NodeJS.Timer | null = null;

  constructor(
    private readonly interval: number,
    private readonly func: () => void
  ) {}

  start(): void {
    if (this._timer) return;

    const intervalInMilliseconds = this.interval * 60 * 1000;
    this._timer = setInterval(this.func, intervalInMilliseconds);
  }

  stop(): void {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  }
}
