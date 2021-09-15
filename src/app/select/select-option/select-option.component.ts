import { Highlightable } from '@angular/cdk/a11y';
import {
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
} from '@angular/core';
import { SelectService } from '../select.service';

@Component({
  selector: 'app-select-option',
  templateUrl: './select-option.component.html',
  styleUrls: ['./select-option.component.scss'],
})
export class SelectOptionComponent implements Highlightable {
  @Input() id: number;

  @Input() value: string;

  @HostBinding('class.active') active = false;

  @HostBinding('class.selected')
  public get selected(): boolean {
    return this.selectService.getParent().selectedOption === this;
  }

  @HostListener('click', ['$event']) onSelect(event: UIEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.selectService.getParent().onSelect(this);
  }

  constructor(
    private elementRef: ElementRef,
    private selectService: SelectService
  ) {}

  setActiveStyles(): void {
    this.focus();
    this.active = true;
  }
  setInactiveStyles(): void {
    this.active = false;
  }

  getLabel(): string {
    return this.value;
  }

  focus(options?: FocusOptions) {
    this.elementRef.nativeElement.focus(options);
  }
}
