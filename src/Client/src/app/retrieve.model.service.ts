import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class RetrieveModelService {
    private model: any;
    private newModel: Subject<any> = new Subject<any>();
    private resetModel: Subject<any> = new Subject<any>();

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