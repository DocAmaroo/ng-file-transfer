import { DownloadTransfer, FileTransfer } from '../types';

export function isDownloadTransfer(obj: FileTransfer): obj is DownloadTransfer {
  return obj instanceof DownloadTransfer;
}
