import { FSWatcher, readdirSync, watch } from 'fs';
import EventEmitter from 'events';
import { Tail } from 'tail';
import path from 'path';

type LogType = 'ActionLog' | 'ChatLog';

type Event = {
  line: (item: string, amount: number) => void;
};

export class NgsLog extends EventEmitter {
  private readonly logType: LogType = 'ActionLog';
  private readonly fileNameRegExp: RegExp;
  private readonly logDirectoryPath: string;

  private fsWatch?: FSWatcher;
  private tail?: Tail;

  constructor(options: { logDirectoryPath: string }) {
    super();

    this.fileNameRegExp = new RegExp(`^${this.logType}[0-9]{8}_[0-9]+.txt`);
    this.logDirectoryPath = options.logDirectoryPath.replaceAll(
      /%.*?%/g,
      (match) => process.env[match.replaceAll('%', '')]?.toString() ?? match,
    );
  }

  on<E extends keyof Event>(event: E, listener: Event[E]) {
    return super.on(event, listener);
  }

  emit<E extends keyof Event>(event: E, ...args: Parameters<Event[E]>) {
    return super.emit(event, ...args);
  }

  watch() {
    const dir = this.logDirectoryPath;

    const logFileName = this.getLatestFileName();

    const fsWatch = watch(dir);
    fsWatch.on('change', (eventType, fileName: string) => {
      // NOTE: eventType is 'rename' | 'change'

      // - on Update Latest
      if (eventType == 'rename' && this.fileNameRegExp.test(fileName)) {
        this.updateLogFilePath(path.join(dir, fileName));
      }
    });

    this.fsWatch = fsWatch;

    if (logFileName) this.updateLogFilePath(path.join(dir, logFileName));
  }

  unwatch() {
    this.fsWatch?.close();
    this.fsWatch?.removeAllListeners();
    this.tail?.unwatch();
  }

  private updateLogFilePath(logFilePath: string, watch = true) {
    console.log('logFilePath:', logFilePath);

    if (this.tail) this.tail.unwatch();

    try {
      const tail = new Tail(logFilePath, { encoding: 'utf16le', useWatchFile: true });
      tail.on('line', (line: string) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
        const [date, logId, actionType, playerId, characterName, item, sub, ...other] =
          line.split('\t');

        if (actionType == '[Pickup]') {
          const numBracketReg = /(?<=^Num\()[0-9]+(?=\)$)/; // Num(***)
          const mesetaStr = sub.match(/(?<=^Meseta\()[0-9]+(?=\)$)/)?.[0]; // Meseta(***)

          const amountStr = sub.match(numBracketReg)?.[0];

          if (mesetaStr) this.emit('line', 'Meseta', Number(mesetaStr));
          else this.emit('line', item, Number(amountStr ?? 1));
        }
      });

      tail.on('error', (e) => console.error(e));

      this.tail = tail;
      if (watch) tail.watch();
    } catch (error) {
      console.error(error);
    }
  }

  private getLatestFileName() {
    const files = readdirSync(this.logDirectoryPath, { withFileTypes: true });

    console.log(this.fileNameRegExp);

    const [latestFile] = files.reduce<[string | null, number]>(
      (prev, curr) => {
        if (!curr.isFile() || !this.fileNameRegExp.test(curr.name)) return prev;

        const [, prevDate] = prev;
        const currDate = Number(curr.name.slice(this.logType.length, -1).replaceAll(/[^0-9]/g, ''));

        return prevDate > currDate ? prev : [curr.name, currDate];
      },
      [null, 0],
    );

    return latestFile;
  }
}
