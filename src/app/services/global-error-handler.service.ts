import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { InstanceLogService } from 'src/app/services/instance-log.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
    private logger: InstanceLogService
  ) { }

  handleError(error: any) {
    this.logger.error('Global error', '', {
      message: error.message,
      stack: error.stack,
      ...error
    });
  }
}