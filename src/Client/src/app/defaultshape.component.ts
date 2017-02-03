import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { RetrieveModelService } from './retrieve.model.service';

@Component({
  selector: 'default-shape',
  templateUrl: './defaultshape.component.html',
  styleUrls: ['./defaultshape.component.css']
})
export class DefaultshapeComponent {
    constructor(private http: Http, private retrieveModelService: RetrieveModelService) {}

    title = 'default shape component';
    webapiUrl = 'http://localhost:5682/api/DefaultShape';

    createPlane(): void {
        this.title = 'create plane';
        this.createModel(this.webapiUrl + '?type=' + 'plane');
    }

    createCube(): void {
        this.title = 'create cube';
        this.createModel(this.webapiUrl + '?type=' + 'cube');
    }

    createSphere(): void {
        this.title = 'create sphere';
        this.createModel(this.webapiUrl + '?type=' + 'sphere');
    }

    createModel(urlwithquery: string): void {
        var modelPromise = this.http.get(urlwithquery)
             .toPromise()
             .then(r => r.text());
        modelPromise.then(p => {
            if(p) {
                var d = JSON.parse(p);
                this.retrieveModelService.setModel(d);
            }
        });
    }
}