import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class RetrieveModelService {
    constructor() {}
    model: any;
    newModel: Subject<any> = new Subject<any>();
    resetModel: Subject<any> = new Subject<any>();

    addModel(m) {
        this.model = m;
        this.newModel.next(m);
    }

    reset() {
        this.model = null;
        this.resetModel.next(this.model);
    }

    modelRetrieved(): Observable<any> {
        return this.newModel.asObservable();
    }

    modelReset(): Observable<any> {
        return this.resetModel.asObservable();
    }
}