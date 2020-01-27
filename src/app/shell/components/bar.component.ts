import { ChangeDetectionStrategy } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bar',
  template: `
    <div>
      <img alt="RIL Transport Services, Inc." src="assets/images/logo.svg" />
    </div>
  `,
  styleUrls: ['./bar.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BarComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
