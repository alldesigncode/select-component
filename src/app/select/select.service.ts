import { Injectable } from '@angular/core';
import { SelectComponent } from './select.component';

@Injectable({
  providedIn: 'root',
})
export class SelectService {
  private _parentInstance: SelectComponent;

  init(parent: SelectComponent) {
    this._parentInstance = parent;
  }

  getParent(): SelectComponent {
    return this._parentInstance;
  }
}
