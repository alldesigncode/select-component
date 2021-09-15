import { animate, style, transition, trigger } from '@angular/animations';

export const selectReveal = trigger('selectAnim', [
  transition('void => *', [
    style({
      opacity: 0,
      visibility: 'hidden',
      height: '0px',
    }),
    animate(
      '200ms ease-in-out',
      style({
        opacity: 1,
        visibility: 'visible',
        height: '*',
      })
    ),
  ]),
  transition('* => void', [
    animate(
      '200ms ease-in-out',
      style({
        opacity: 0,
        visibility: 'hidden',
        height: '0px',
      })
    ),
  ]),
]);
