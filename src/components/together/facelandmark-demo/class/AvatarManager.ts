import * as THREE from "three";
import { loadGltf } from "@/components/together/facelandmark-demo/utils/loaders";
import { FaceLandmarkerResult } from "@mediapipe/tasks-vision";
import { decomposeMatrix } from "../utils/decomposeMatrix";

class AvatarManager {
  private static instance: AvatarManager = new AvatarManager();
  private scene!: THREE.Scene;
  isModelLoaded = false;
  private avatarVisible = true;
  private blinkStartTime: number | null = null;
  private blinkEndTime: number | null = null;
  private blinkThreshold = 0.1 * 1000; // 1 second in milliseconds
  private visibilityDuration = 5 * 1000; // 5 seconds in milliseconds

  private constructor() {
    this.scene = new THREE.Scene();
  }

  static getInstance(): AvatarManager {
    return AvatarManager.instance;
  }

  getScene = () => {
    return this.scene;
  };

  loadModel = async (url: string) => {
    this.isModelLoaded = false;
    if (this.scene.children.length === 1) {
      this.scene.children[0].removeFromParent();
    }
    const gltf = await loadGltf(url);
    gltf.scene.traverse((obj) => (obj.frustumCulled = false));
    this.scene.add(gltf.scene);

    // make hands invisible
    const LeftHand = this.scene.getObjectByName("LeftHand");
    const RightHand = this.scene.getObjectByName("RightHand");
    LeftHand?.scale.set(0, 0, 0);
    RightHand?.scale.set(0, 0, 0);
    this.isModelLoaded = true;
  };

  updateFacialTransforms = (results: FaceLandmarkerResult, flipped = true) => {
    // 얼굴이 감지되는지 확인
    if (!results || !this.isModelLoaded || !results.faceLandmarks?.length) {
      return 3;
    }

    const isBlinking = this.checkBlinking(results);
    // this.updateBlinkTime(isBlinking);

    // const shouldShowAvatar = this.shouldAvatarBeVisible();
    // this.setAvatarVisibility(shouldShowAvatar);

    if (this.avatarVisible) {
      this.updateBlendShapes(results, flipped);
      this.updateTranslation(results, flipped);
    }

    // 눈이 감긴 상태인지 아닌지 확인
    if (isBlinking) {
      return 1;
    } else {
      return 2;
    }
  };

  checkBlinking = (results: FaceLandmarkerResult): boolean => {
    if (!results.faceBlendshapes) return false;

    const blendShapes = results.faceBlendshapes[0]?.categories;
    if (!blendShapes) return false;

    const leftEyeBlink = blendShapes.find((shape) => shape.categoryName === "eyeBlinkLeft")?.score ?? 0;
    const rightEyeBlink = blendShapes.find((shape) => shape.categoryName === "eyeBlinkRight")?.score ?? 0;

    // You may need to adjust this threshold value based on your specific use case
    const blinkThreshold = 0.5;
    return leftEyeBlink > blinkThreshold && rightEyeBlink > blinkThreshold;
  };

  updateBlinkTime = (isBlinking: boolean) => {
    if (isBlinking) {
      if (this.blinkStartTime === null) {
        this.blinkStartTime = Date.now();
      }
      this.blinkEndTime = null;
    } else {
      if (this.blinkStartTime !== null) {
        this.blinkEndTime = Date.now();
      }
      this.blinkStartTime = null;
    }
  };

  shouldAvatarBeVisible = (): boolean => {
    if (!this.isModelLoaded) {
      return false;
    }

    if (this.blinkStartTime !== null) {
      return Date.now() - this.blinkStartTime >= this.blinkThreshold;
    }
    if (this.blinkEndTime !== null) {
      return Date.now() - this.blinkEndTime < this.visibilityDuration;
    }
    return false;
  };

  setAvatarVisibility = (visible: boolean) => {
    if (this.avatarVisible !== visible) {
      this.avatarVisible = visible;
      this.scene.traverse((obj) => {
        obj.visible = visible;
      });
    }
  };

  updateBlendShapes = (results: FaceLandmarkerResult, flipped = true) => {
    if (!results.faceBlendshapes) return;

    const blendShapes = results.faceBlendshapes[0]?.categories;
    if (!blendShapes) return;

    this.scene.traverse((obj) => {
      if ("morphTargetDictionary" in obj && "morphTargetInfluences" in obj) {
        const morphTargetDictionary = obj.morphTargetDictionary as { [key: string]: number };
        const morphTargetInfluences = obj.morphTargetInfluences as Array<number>;

        for (const { score, categoryName } of blendShapes) {
          let updatedCategoryName = categoryName;
          if (flipped && categoryName.includes("Left")) {
            updatedCategoryName = categoryName.replace("Left", "Right");
          } else if (flipped && categoryName.includes("Right")) {
            updatedCategoryName = categoryName.replace("Right", "Left");
          }
          const index = morphTargetDictionary[updatedCategoryName];
          if (index !== undefined) {
            morphTargetInfluences[index] = score;
          }
        }
      }
    });
  };

  updateTranslation = (results: FaceLandmarkerResult, flipped = true) => {
    if (!results.facialTransformationMatrixes) return;

    const matrixes = results.facialTransformationMatrixes[0]?.data;
    if (!matrixes) return;

    const { translation, rotation, scale } = decomposeMatrix(matrixes);
    const euler = new THREE.Euler(rotation.x, rotation.y, rotation.z, "ZYX");
    const quaternion = new THREE.Quaternion().setFromEuler(euler);
    if (flipped) {
      // flip to x axis
      quaternion.y *= -1;
      quaternion.z *= -1;
      translation.x *= -1;
    }

    const Head = this.scene.getObjectByName("Head");
    Head?.quaternion.slerp(quaternion, 1.0);

    const root = this.scene.getObjectByName("AvatarRoot");
    // values empirically calculated
    root?.position.set(
      translation.x * 0.01,
      translation.y * 0.01,
      (translation.z + 50) * 0.02
    );
  };
}

export default AvatarManager;
