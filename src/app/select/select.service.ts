import { Injectable } from '@angular/core';
import { SelectComponent } from './select.component';

@Injectable({
  providedIn: 'root',
})
export class SelectService {
  private parentInstance: SelectComponent;

  init(parent: SelectComponent) {
    this.parentInstance = parent;
  }

  getParent(): SelectComponent {
    return this.parentInstance;
  }
}
