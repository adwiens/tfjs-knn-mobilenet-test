import { Component, QueryList, ViewChildren, AfterViewInit, ElementRef } from '@angular/core';
import { MatCardImage } from '@angular/material';
import { toPairs } from 'lodash';
// import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

import { imagesInfo, Info } from './images-info';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChildren('img') images: QueryList<ElementRef>;
  imagesInfo: [string, Info][] = toPairs(imagesInfo);
  model?: mobilenet.MobileNet;

  ngAfterViewInit() {
    this.loadModelAndLabelImages();
  }

  private async loadModelAndLabelImages() {
    // Load the model
    console.warn('LOADING MODEL..');
    const model = await mobilenet.load();
    
    // Classify the images
    const images = this.images.toArray();
    console.warn('THERE ARE ' + images.length + ' IMAGES');
    for (let i = 0; i < images.length; i++) {
      console.warn('DOING ' + i + ' OF ' + images.length);
      const img: HTMLImageElement = images[i].nativeElement;
      console.log(img);
      const info = this.imagesInfo.find(info => img.src.includes(info[0]))![1];
      const predictions = await model.classify(img);
      info.categories = predictions[0].className.split(', ').slice(0, 2);
    }
  }
}
