import { Component, ElementRef, ViewChild, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { toPairs } from 'lodash';
// import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

import { imagesInfo, Info, trainingImagesInfo } from './images-info';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  // @ViewChild('img') image: ElementRef;
  // imagesInfo: [string, Info][] = toPairs(imagesInfo);
  // model?: mobilenet.MobileNet;
  // index = 0;
  // output = '';
  // select(label: number) {
  //   this.imagesInfo[this.index][1].label = label;
  //   if (this.index < this.imagesInfo.length - 1) {
  //     this.index++;
  //   } else {
  //     this.output = 'DONE';
  //   }
  // }
  trainingImagesInfo = trainingImagesInfo;
  classifications = [];
  @ViewChildren('img') images: QueryList<ElementRef>;
  ngAfterViewInit() {
    this.train();
  }
  async train() {
    const model = await mobilenet.load();
    const images = this.images.toArray();
    for (let i = 0; i < images.length; i++) {
      const img = images[i].nativeElement as HTMLImageElement;
      const logits = await model.infer(img, true);
      console.warn('NUM OF', i, images.length);
      this.classifications.push([this.trainingImagesInfo[i][0], await logits.array()]);
    }
  }
}
