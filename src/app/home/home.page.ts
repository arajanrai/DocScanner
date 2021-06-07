import { Component } from '@angular/core';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Camera, CameraResultType } from '@capacitor/camera';
import { DomSanitizer } from '@angular/platform-browser';
import { jsPDF } from 'jspdf';
import domtoimage from 'dom-to-image';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  images = [];
  constructor(
    // private camera: Camera,
    private imagePicker: ImagePicker,
    public sanitization: DomSanitizer
  ) { }

  openGallery() {
    const options = {
      width: 40,
      height: 40,
      quality: 95,
    };
    this.imagePicker.getPictures(options).then((results) => {
      for (const imgs of results) {
        console.log('Image URI: ' + imgs);
      }
    }, (err) => { });
  }

  convertToPdf() {
    const div = document.getElementById('pdfContent');
    const divHeight = div.clientHeight;
    const divWidth = div.clientWidth;
    const options = { background: 'white', width: divWidth, height: divHeight };

    domtoimage.toPng(div, options).then((imgData) => {
      const doc = new jsPDF('p', 'mm', [divWidth, divHeight]);
      const imgProps = doc.getImageProperties(imgData);
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      doc.save('pdfDocument.pdf');
    });
  }

  showImages(url) {
    return this.sanitization.bypassSecurityTrustResourceUrl(url);
  }

  async openCamera() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri
    });

    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    // this.sanitization.bypassSecurityTrustResourceUrl
    const imageUrl = image.webPath;
    this.images.push(imageUrl);
    console.log(imageUrl);
    // const options = {
    //   quality: 100,
    //   destinationType: this.camera.DestinationType.FILE_URI,
    //   encodingType: this.camera.EncodingType.JPEG,
    //   mediaType: this.camera.MediaType.PICTURE
    // };
    // this.camera.getPicture(options).then((imageData) => {
    //   // imageData is either a base64 encoded string or a file URI
    //   // If it's base64 (DATA_URL):
    //   console.log(imageData);
    //   const base64Image = 'data:image/jpeg;base64,' + imageData;
    // }, (err) => {
    //   // Handle error
    // });
  }
}
