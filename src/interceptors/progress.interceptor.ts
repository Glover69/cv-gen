import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ProgressService } from '../services/progress.service';

@Injectable()
export class ProgressInterceptor implements HttpInterceptor {
  constructor(private progressService: ProgressService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Clone the request to add the new header
    const clonedReq = req.clone();

    // Set the progress to 0 at the start of the request
    this.progressService.setProgress(0);

    return next.handle(clonedReq).pipe(
      tap(event => {
        if (event.type === HttpEventType.DownloadProgress || event.type === HttpEventType.UploadProgress) {
          // Calculate the progress percentage
          const progress = Math.round((100 * event.loaded) / (event.total || 1));
          this.progressService.setProgress(progress);
        }
        if (event.type === HttpEventType.Response) {
          // Set progress to 100% when the response is received
          this.progressService.setProgress(100);
        }
      })
    );
  }
}
