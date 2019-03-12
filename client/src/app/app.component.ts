import { Component, QueryList, ViewChildren, AfterViewInit, ElementRef } from '@angular/core';
import { toPairs } from 'lodash';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as knnClassifier from '@tensorflow-models/knn-classifier';

import { Info, imagesInfo, trainingImagesInfo, trainingImagesClasses } from './images-info';

const classes = [
  'nature',
  'people',
  'objects',
  'buildings',
  'transportation',
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChildren('img') images: QueryList<ElementRef>;
  trainingImagesInfo = trainingImagesInfo;
  trainingImagesClasses = trainingImagesClasses;
  imagesInfo: [string, Info][] = toPairs(imagesInfo);
  model?: mobilenet.MobileNet;

  ngAfterViewInit() {
    this.loadModelAndLabelImages();
  }

  private async loadModelAndLabelImages() {
    // Load the model and classifier
    console.warn('LOADING MODEL..');
    const model = await mobilenet.load();
    const knn = knnClassifier.create();

    // Classify images:
    this.trainingImagesInfo.forEach(img => {
      const label = this.trainingImagesClasses.find(tic => tic[0] === img[0])![1].label;
      knn.addExample(tf.tensor1d(img[1][0]), label);
    });
    
    // Classify the images
    const images = this.images.toArray();
    console.warn('THERE ARE ' + images.length + ' IMAGES');
    for (let i = 0; i < images.length; i++) {
      console.warn('DOING ' + i + ' OF ' + images.length);
      const img: HTMLImageElement = images[i].nativeElement;
      console.log(img);
      const info = this.imagesInfo.find(info => img.src.includes(info[0]))![1];
      const logits = await (await model.infer(img, true)).array();
      const labels = await knn.predictClass(tf.tensor1d(logits[0]));
      info.category = classes[labels.classIndex];
      console.warn('redicted: ', info.category)
    }
  }
}
