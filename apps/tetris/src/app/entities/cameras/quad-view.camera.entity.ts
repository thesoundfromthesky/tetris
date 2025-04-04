import { injectable } from 'inversify';
import { injectService } from '../../injector/inject-service.function';
import { SceneService } from '../../core/scene.service';
import { ArcRotateCamera, Tools, Vector3, Viewport } from '@babylonjs/core';

// https://www.babylonjs-playground.com/#YQP5RH#1

@injectable()
export class QuadViewCameraEntity {
  private readonly sceneService = injectService(SceneService);

  public constructor() {
    this.init();
  }

  public init() {
    this.initCameras();
  }

  public initCameras() {
    const { scene } = this.sceneService;

    const viewPorts: [x: number, y: number, width: number, height: number][] = [
      [0, 0.5, 0.5, 0.5],
      [0.5, 0.5, 0.5, 0.5],
      [0, 0, 0.5, 0.5],
      [0.5, 0, 0.5, 0.5],
    ];

    const rotations = [
      [Tools.ToRadians(270), 0],
      [5.3253, 1.0027],
      [Tools.ToRadians(270), Tools.ToRadians(90)],
      [Tools.ToRadians(360), Tools.ToRadians(90)],
    ];

    Array.from({ length: 4 }, (_, i) => {
      if (!scene.activeCameras) {
        scene.activeCameras = [];
      }
      const camera = this.createArcRotateCamera(i + 1);
      camera.viewport = new Viewport(...viewPorts[i]);
      const rotation = rotations[i];
      camera.alpha = rotation[0];
      camera.beta = rotation[1];

      scene.activeCameras.push(camera);
    });
  }

  public createArcRotateCamera(index: number) {
    const { scene } = this.sceneService;

    const radius = 20;
    const arcRotateCamera = new ArcRotateCamera(
      `arc_rotate_camera_${index}`,
      0,
      0,
      radius,
      Vector3.Zero(),
      scene
    );
    // arcRotateCamera.attachControl();
    // universalCamera.speed = 0.2;
    // universalCamera.setTarget(Vector3.Zero());
    arcRotateCamera.minZ = 0;
    // universalCamera.maxZ = 9999999;
    // universalCamera.inputs.clear();

    return arcRotateCamera;
  }
}
