import { CdkConnectedOverlay } from '@angular/cdk/overlay';
import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
} from '@angular/core';
import { SelectOptionComponent } from './select-option/select-option.component';
import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { SelectService } from './select.service';
import { take, takeUntil } from 'rxjs/operators';
import {
  A,
  DOWN_ARROW,
  ENTER,
  hasModifierKey,
  LEFT_ARROW,
  RIGHT_ARROW,
  SPACE,
  UP_ARROW,
} from '@angular/cdk/keycodes';
import { Subject } from 'rxjs';
import { selectReveal } from './animations';

@Directive()
export abstract class SelectBase {
  abstract selectOptions: QueryList<SelectOptionComponent>;

  keyManager: ActiveDescendantKeyManager<SelectOptionComponent>;

  @ViewChild(CdkConnectedOverlay, { static: true })
  protected connectedOverlay: CdkConnectedOverlay;

  protected readonly destroy$ = new Subject<void>();

  private _displayOption: SelectedOption;

  private _selectedOption: SelectOptionComponent;

  private _panelOpen = false;

  constructor(protected elementRef: ElementRef) {}

  get panelOpen(): boolean {
    return this._panelOpen;
  }

  get displayOption(): SelectedOption {
    return this._displayOption;
  }

  get selectedOption(): SelectOptionComponent {
    return this._selectedOption;
  }

  get empty(): boolean {
    return !this._selectedOption;
  }

  onSelect(option: SelectOptionComponent) {
    this.keyManager.setActiveItem(option);
    this._selectedOption = option;
    this._displayOption = { id: option.id, value: option.value };
    this.close();
    this.focus();
  }

  initKeyManager() {
    this.keyManager = new ActiveDescendantKeyManager<SelectOptionComponent>(
      this.selectOptions
    )
      .withTypeAhead()
      .withVerticalOrientation()
      .withHorizontalOrientation('ltr')
      .withHomeAndEnd()
      .withAllowedModifierKeys(['shiftKey']);

    this.keyManager.tabOut.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.focus();
      this.close();
    });
  }

  handleClosedKeyDown(event) {
    const keyCode = event.keyCode;
    const isArrowKey =
      keyCode === DOWN_ARROW ||
      keyCode === UP_ARROW ||
      keyCode === LEFT_ARROW ||
      keyCode === RIGHT_ARROW;
    const isOpenKey = keyCode === ENTER || keyCode === SPACE;
    const manager = this.keyManager;

    if (
      (!manager.isTyping() && isOpenKey && !hasModifierKey(event)) ||
      (event.altKey && isArrowKey)
    ) {
      event.preventDefault();
      this._panelOpen = true;
    } else {
      manager.onKeydown(event);
    }
  }

  handleOpenKeyDown(event) {
    const manager = this.keyManager;
    const keyCode = event.keyCode;
    const isArrowKey = keyCode === DOWN_ARROW || keyCode === UP_ARROW;
    const isTyping = manager.isTyping();

    if (isArrowKey && event.altKey) {
      // Close the select on ALT + arrow key to match the native <select>
      event.preventDefault();
      this.close();
    } else if (
      !isTyping &&
      (keyCode === ENTER || keyCode === SPACE) &&
      manager.activeItem &&
      !hasModifierKey(event)
    ) {
      event.preventDefault();
      this.onSelect(manager.activeItem);
    } else {
      manager.onKeydown(event);
    }
  }

  highlightOption(): void {
    if (this.keyManager) {
      if (this.empty) {
        this.keyManager.setFirstItemActive();
      } else {
        this.keyManager.setActiveItem(this._selectedOption);
      }
    }
  }

  focus(options?: FocusOptions) {
    this.elementRef.nativeElement.focus(options);
  }

  togglePanel() {
    this._panelOpen = !this._panelOpen;
  }

  close() {
    if (this.panelOpen) {
      this._panelOpen = false;
    }
  }
}

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  animations: [selectReveal],
})
export class SelectComponent
  extends SelectBase
  implements OnInit, AfterContentInit, OnDestroy
{
  @ContentChildren(SelectOptionComponent)
  selectOptions: QueryList<SelectOptionComponent>;

  @HostBinding('attr.tabIndex') tabIndex = 0;
  @HostBinding('attr.role') role = 'combobox';

  @HostListener('keydown', ['$event']) onKeyDown(event) {
    this.panelOpen
      ? this.handleOpenKeyDown(event)
      : this.handleClosedKeyDown(event);
  }

  constructor(
    protected elementRef: ElementRef,
    private changeDetectorRef: ChangeDetectorRef,
    private selectService: SelectService
  ) {
    super(elementRef);
    this.selectService.init(this);
  }

  ngOnInit(): void {}

  ngAfterContentInit() {
    this.initKeyManager();
  }

  onAttach() {
    this.connectedOverlay.positionChange.pipe(take(1)).subscribe(() => {
      this.changeDetectorRef.detectChanges();
      this.highlightOption();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

export interface SelectedOption {
  id: number;
  value: string;
}
