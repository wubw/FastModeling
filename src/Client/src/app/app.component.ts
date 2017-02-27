import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { DefaultshapeComponent } from './defaultshape.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private webapiUrl = 'http://localhost:5682/api/Greet';
  title: string;
  constructor(private http: Http) {}

  private getTitle(): Observable<string> {
    return this.http.get(this.webapiUrl)
                    .map(r => r.text())
                    .catch(this.handleError);
  }

  ngOnInit(): void {
      this.getTitle().subscribe((t) => {this.title = t;});
  }

  private handleError (error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
