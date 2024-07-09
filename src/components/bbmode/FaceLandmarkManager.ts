import {  FaceLandmarker,  FilesetResolver,  FaceLandmarkerResult,  DrawingUtils } from "@mediapipe/tasks-vision";
import { useHourglassStore } from "../../../store/hourglassStore";

let timeDoze = 0;
let timeMia = 0;

class FaceLandmarkManager {
  // togglePause = useHourglassStore((state) => state.togglePause);
  // pause = useHourglassStore((state) => state.pause);
  // bbmode = useHourglassStore((state) => state.bbMode);
  private static instance: FaceLandmarkManager = new FaceLandmarkManager();
  private results!: FaceLandmarkerResult;
  faceLandmarker!: FaceLandmarker | null;

  private constructor() {
    this.initializeModel();
  }

  static getInstance(): FaceLandmarkManager {
    return FaceLandmarkManager.instance;
  }

  initializeModel = async () => {
    this.faceLandmarker = null;
    const filesetResolver = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );
    this.faceLandmarker = await FaceLandmarker.createFromOptions(
      filesetResolver,
      {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
          delegate: "GPU",
        },
        outputFaceBlendshapes: true,
        outputFacialTransformationMatrixes: true,
        runningMode: "VIDEO",
        numFaces: 1,
      }
    );
  };

  getResults = () => {
    return this.results;
  };

  detectLandmarks = (videoElement: HTMLVideoElement, time: number) => {
    if (!this.faceLandmarker) return;

    const results = this.faceLandmarker.detectForVideo(videoElement, time);
    this.results = results;
    return results;
  };

  drawLandmarks = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d");
    if (!ctx || !this.results?.faceLandmarks) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const drawingUtils = new DrawingUtils(ctx);

    const lineWidth = 1.3;
    if (this.results.faceLandmarks && this.results.faceLandmarks.length > 0){
      for (const landmarks of this.results.faceLandmarks) {
        drawingUtils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_TESSELATION,
          { color: "#C0C0C070", lineWidth: lineWidth }
        );
        drawingUtils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE,
          { color: "#FF3030", lineWidth: lineWidth }
        );
        drawingUtils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW,
          { color: "#FF3030", lineWidth: lineWidth }
        );
        drawingUtils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_LEFT_EYE,
          { color: "#30FF30", lineWidth: lineWidth }
        );
        drawingUtils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW,
          { color: "#30FF30", lineWidth: lineWidth }
        );
        drawingUtils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_FACE_OVAL,
          { color: "#E0E0E0", lineWidth: lineWidth }
        );
        drawingUtils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_LIPS,
          { color: "#E0E0E0", lineWidth: lineWidth }
        );
        drawingUtils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS,
          { color: "#FF3030", lineWidth: lineWidth }
        );
        drawingUtils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS,
          { color: "#30FF30", lineWidth: lineWidth }
        );
        
        // Eye blink detection logic
        const leftEyeTop = landmarks[159];
        const leftEyeBottom = landmarks[145];
        const leftEyeDistance = Math.hypot(
          leftEyeTop.x - leftEyeBottom.x,
          leftEyeTop.y - leftEyeBottom.y
        );

        const rightEyeTop = landmarks[386];
        const rightEyeBottom = landmarks[374];
        const rightEyeDistance = Math.hypot(
          rightEyeTop.x - rightEyeBottom.x,
          rightEyeTop.y - rightEyeBottom.y
        );

        // 눈이 감겼는지 여부를 판단하는 임계값 설정
        const threshold = 0.01; // 실험을 통해 적절한 값으로 조정 필요
        const leftEyeClosed = leftEyeDistance < threshold;
        const rightEyeClosed = rightEyeDistance < threshold;

        // 눈이 감긴 상태를 콘솔에 출력
        if (leftEyeClosed && rightEyeClosed) {
          console.log('Eyes are closed (drowsiness detected)');

          // bb모드에서 졸면 퍼즈
          // if (this.bbmode && !this.pause) {
          //   timeDoze++;
          //   console.log("timeDoze: " + timeDoze);
          //   if (timeDoze > 100) this.togglePause;
          // }
        } else {
          console.log('Eyes are open');
          // if (timeDoze > 0) timeDoze -=5;
          // if (this.bbmode && this.pause) {
          //   console.log("timeDoze: " + timeDoze);
          //   if (timeDoze < 50) {
          //     this.togglePause;
          //     timeDoze = 0;
          //   }
          // }
        }
      }
      // bb모드에서 자리에 돌아오면 퍼즈 풀기
      // if (timeMia > 0) timeMia -=5;
      // if (this.bbmode && this.pause) {
      //   console.log("timeMia: " + timeMia);
      //   if (timeMia < 50) {
      //     this.togglePause;
      //     timeMia = 0;
      //   }
      // }

    } else {
      
      console.log("얼굴이 화면에서 사라졌습니다");
      // bb모드에서 자리 비우면 퍼즈
      // if (this.bbmode && !this.pause) {
      //   timeMia++;
      //   console.log("timeMia: " + timeMia);
      //   if (timeMia > 100) this.togglePause;
      // }
    };
  }
}

export default FaceLandmarkManager;
