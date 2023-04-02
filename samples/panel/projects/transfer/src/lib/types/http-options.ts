import { HttpRequest } from '@angular/common/http';

export class HttpOptions {
  static fromRequest(req: HttpRequest<any>): Partial<HttpOptions> {
    return {
      context: req.context,
      params: req.params,
      headers: req.headers,
      withCredentials: req.withCredentials,
      reportProgress: req.reportProgress,
    };
  }
}
