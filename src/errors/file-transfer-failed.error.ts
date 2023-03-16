export class FileTransferFailedError extends Error {
  constructor(err: any) {
    super(`The file transfer has failed: ${JSON.stringify(err)}`);
  }
}
