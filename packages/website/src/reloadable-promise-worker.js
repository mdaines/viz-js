export class TerminatedError extends Error {
  constructor(message) {
    super(message);
    this.name = "TerminatedError";
  }
}

export class UnexpectedMessageError extends Error {
  constructor(message, data) {
    super(message);
    this.name = "UnexpectedMessageError";
    this.data = data;
  }
}

export default class ReloadablePromiseWorker {
  constructor(makeWorker) {
    this.makeWorker = makeWorker;
    this.reloadWorker();
  }

  reloadWorker() {
    if (this.worker) {
      this.worker.terminate();

      if (this.settleFns) {
        this.settleFns.reject(new TerminatedError("worker terminated"));
      }
    }

    this.worker = this.makeWorker();

    delete this.settleFns;

    this.worker.addEventListener("message", (event) => {
      if (this.settleFns) {
        if (event.data.status == "fulfilled") {
          this.settleFns.resolve(event.data.value);
        } else if (event.data.status == "rejected") {
          this.settleFns.reject(event.data.reason);
        } else {
          this.settleFns.reject(new UnexpectedMessageError("unexpected message from worker", event.data));
        }
        delete this.settleFns;
      }
    });

    this.worker.addEventListener("error", (event) => {
      if (this.settleFns) {
        this.settleFns.reject(event);
        delete this.settleFns;
      }
    });

    this.worker.addEventListener("messageerror", (event) => {
      if (this.settleFns) {
        this.settleFns.reject(event);
        delete this.settleFns;
      }
    });
  }

  postMessage(message) {
    if (this.settleFns) {
      this.reloadWorker();
    }

    return new Promise((resolve, reject) => {
      this.settleFns = { resolve, reject };
      this.worker.postMessage(message);
    });
  }
}
