export class InsufficientDataError extends Error {
  constructor(message = "Not enough data to produce a reliable prediction") {
    super(message);
    this.name = "InsufficientDataError";
  }
}
