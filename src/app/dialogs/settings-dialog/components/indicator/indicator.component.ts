import { Component, OnInit, AfterViewInit, Input, ViewChild, ElementRef } from '@angular/core';
import { IndicatorRangerComponent } from '../indicator-ranger/indicator-ranger.component';

@Component({
  selector: 'termostat-indicator',
  templateUrl: './indicator.component.html',
  styleUrls: ['./indicator.component.scss']
})
export class IndicatorComponent implements OnInit, AfterViewInit {
  public step: number;
  public maxBorderInRotateDeg: number;
  public minBorderInRotateDeg: number;
  public maxGraduceInNumber: number;

  @ViewChild('indicator', { read: ElementRef }) indicator: ElementRef<HTMLElement>;
  @ViewChild('coolRanger', { read: IndicatorRangerComponent }) coolRanger: IndicatorRangerComponent;

  @Input() coolTemperature: number;
  @Input() hotTemperature: number;
  @Input() mode: string;
  @Input() totalElements: number;
  get totalElementsArr(): any[] {
    return new Array(this.totalElements);
  }

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      this.step = 360 / this.totalElements;
    }, 0);
  }

  ngAfterViewInit(): void {
    this.positionLines();
  }

  positionLines(): void {
    let item: number = 0;
    let angle: number = 0;
    let currentRotate: number = 0;
    let maxGraduce: number = 0;

    const totalElements = this.totalElements;
    const stepRotate = 360 / totalElements;
    const maxlinesInOneQuarter = Math.round(totalElements / 8);

    const topBorderInDeg = maxlinesInOneQuarter*stepRotate;
    const bottomBorderInDeg = 180 - maxlinesInOneQuarter*stepRotate;

    const indicatorW = this.indicator.nativeElement.clientWidth / 2;
    const indicatorH = this.indicator.nativeElement.clientHeight / 2;
    const radius = indicatorW / 1.2;
    const stepAngle = (2 * Math.PI) / totalElements;

    const lineW = 28;
    const lineH = 1;

    while (item < totalElements) {
      const currentEl: any = document.getElementsByClassName(`indicator-line-${item}`)[0];
      const leftPos = Math.round(indicatorW + radius * Math.cos(angle) - lineW/2);
      const topPos = Math.round(indicatorH + radius * Math.sin(angle) - lineH/2);

      if (currentRotate >= topBorderInDeg && currentRotate <= bottomBorderInDeg) {
          currentEl.style.opacity = 0;
          currentEl.style.display = 'none';
      } else {
          currentEl.style.opacity = 1;
          currentEl.style.width = `${lineW}px`;
          currentEl.style.height = `${lineH}px`;
          currentEl.style.left = `${leftPos}px`;
          currentEl.style.top = `${topPos}px`;
          currentEl.style.transform = `rotate(${currentRotate}deg)`;
          currentEl.setAttribute('data-rotate-deg', currentRotate.toFixed(2));

          maxGraduce++;
      }

      angle += stepAngle;
      currentRotate += stepRotate;
      ++item;
    }

    let numberBottomElement = Math.round(totalElements / 8 % 2 == 1 ? totalElements/4 + maxlinesInOneQuarter + 1 : totalElements/4 + maxlinesInOneQuarter);

    this._updateInfoForRanger(maxlinesInOneQuarter - 1, numberBottomElement, maxGraduce - 1);
  }

  updateGraduce(model): void {
    this[model.name] = model.value;
  }
  
  updateGraduceInNumber({ mode, rotateInDeg }): void {
    console.log(mode, rotateInDeg);
  }

  private _updateInfoForRanger(topNumberEl: number, bottomNumberEl: number, maxGraduce: number): void {
    const topElement: HTMLElement = document.querySelector(`.indicator-line-${topNumberEl}`);
    const bottomElement: HTMLElement = document.querySelector(`.indicator-line-${bottomNumberEl}`);

    setTimeout(() => {
        this.maxBorderInRotateDeg = Number(topElement.dataset.rotateDeg);
        this.minBorderInRotateDeg = Number(bottomElement.dataset.rotateDeg);
        this.maxGraduceInNumber = Number(maxGraduce);
    }, 0);
  }

}
