import { Injectable } from '@angular/core';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import { LoggerService } from './oidc.logger.service';

@Injectable()
export class OidcSecuritySilentRenew {
 private sessionIframe: any;
 private sessionIframeLogout: any;
 private _checkForIFrameLogoutSrc: any;

 constructor(private loggerService: LoggerService) {}

 logout(url: string) {
  this.sessionIframeLogout = window.document.createElement('iframe');
  this.sessionIframeLogout.id = 'myiFrameForSilentLogout';
  this.sessionIframeLogout.style.display = 'none';
  window.document.body.appendChild(this.sessionIframeLogout);
  this.sessionIframeLogout.src = url;
  this._checkForIFrameLogoutSrc = window.setInterval(() => {
    this.logoutIFrameCleanUp();
  }, 2000);
  return Observable.create((observer: Observer<any>) => {
   this.sessionIframeLogout.onload = () => {
    observer.next(this.sessionIframeLogout);
    observer.complete();
   };
  });
 }

 logoutIFrameCleanUp() {
  this.sessionIframeLogout.src = '';
  window.clearInterval(this._checkForIFrameLogoutSrc);
  this._checkForIFrameLogoutSrc = null;
  this.sessionIframeLogout = null;
 }

 removeiFrameForSilentLogout() {
  console.log(this.sessionIframeLogout);
 }

 initRenew() {
  let existsparent;
  try {
   const parentdoc = window.parent.document;
   if (!parentdoc) {
    throw new Error('Unaccessible');
   }

   existsparent = parentdoc.getElementById('myiFrameForSilentRenew');
  } catch (e) {
   // not accessible
  }
  const exists = window.document.getElementById('myiFrameForSilentRenew');
  if (existsparent) {
   this.sessionIframe = existsparent;
  } else if (exists) {
   this.sessionIframe = exists;
  }

  if (!exists && !existsparent) {
   this.sessionIframe = window.document.createElement('iframe');
   this.sessionIframe.id = 'myiFrameForSilentRenew';
   this.loggerService.logDebug(this.sessionIframe);
   this.sessionIframe.style.display = 'none';

   window.document.body.appendChild(this.sessionIframe);
  }
 }

 // TODO The return type of this method is never used. Is it needed?
 startRenew(url: string) {
  let existsparent;
  try {
   const parentdoc = window.parent.document;
   if (!parentdoc) {
    throw new Error('Unaccessible');
   }

   existsparent = parentdoc.getElementById('myiFrameForSilentRenew');
  } catch (e) {
   // not accessible
  }
  const exists = window.document.getElementById('myiFrameForSilentRenew');
  if (existsparent) {
   this.sessionIframe = existsparent;
  } else if (exists) {
   this.sessionIframe = exists;
  }

  this.loggerService.logDebug('startRenew for URL:' + url);
  this.sessionIframe.src = url;

  return Observable.create((observer: Observer<any>) => {
   this.sessionIframe.onload = () => {
    observer.next(this);
    observer.complete();
   };
  });
 }
}
