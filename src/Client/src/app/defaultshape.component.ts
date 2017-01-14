import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'default-shape',
  templateUrl: './defaultshape.component.html',
  styleUrls: ['./defaultshape.component.css']
})
export class DefaultshapeComponent {
    title = 'default shape component';

    createPlane(): void {
        this.title = 'create plane';
    }

    createCube(): void {
        this.title = 'create cube';
    }

    createSphere(): void {
        this.title = 'create sphere';
    }
}