import { Component, AfterViewInit, ViewChild, ElementRef } from "@angular/core";
declare var faceapi: any;
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements AfterViewInit {
  title = "face-apiDemo";
  @ViewChild("video", { static: true }) video: ElementRef; //canvas
  @ViewChild("canvas", { static: true }) canvas: ElementRef;

  model: any;
  isDataLoading = true;

  async ngAfterViewInit() {
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("assets/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("assets/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("assets/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("assets/models")
    ]).then(data => {
      this.isDataLoading = false;
      alert(
        "data Loaded Successfully!!, Next step will ask for camera access!!"
      );
      this.startVideo();
    });
  }

  startVideo() {
    const vid = this.video.nativeElement; // feeding everytime in case firsttime it didn't worked
    if (navigator.mediaDevices.getUserMedia) {
      // this is only working for the local host if the ip is changed to the new one it will not work, see an alternative for this from     somewhere
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(stream => {
          vid.srcObject = stream;
        })
        .catch(error => {
          alert("No media device Found, please connect a camera!!!");
          console.log("Something went wrong!");
        });
    } else {
      alert("No media device Found, please connect a camera!!!");
    }
  }

  onPlay() {
    alert("Starting predictions!!");
    const video = this.video.nativeElement;
    const can = this.canvas.nativeElement;
    const canvas = faceapi.createCanvasFromMedia(video);
    can.append(canvas);
    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);
    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
      if (resizedDetections.length == 0) {
        console.log(
          "No human face found : it may be due to low camera quality"
        );
      }
    }, 2000);
  }
}
