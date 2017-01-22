import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class RetrieveModelService {
    constructor() {}
    model: any;
    subject: Subject<any> = new Subject<any>();
    
    retrieveModel(m) {
        console.log(m);
    }

    setModel(m) {
        this.model = m;
        this.subject.next(m);
    }

    modelRetrieved(): Observable<any> {
        return this.subject.asObservable();
    }
}