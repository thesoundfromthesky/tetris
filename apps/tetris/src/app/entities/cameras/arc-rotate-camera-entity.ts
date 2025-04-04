import { injectable } from 'inversify';
import { SceneService } from '../../core/scene.service';
import { WorldService } from '../../core/world.service';
import { ArcRotateCamera, Tools, Vector3 } from '@babylonjs/core';
import { injectService } from '../../injector/inject-service.function';
import { ArcRotateCameraComponent } from '../../components/arc-rotate-camera.component';

@injectable()
export class ArcRotateCameraEntity {
  private readonly worldService = injectService(WorldService);
  private readonly sceneService = injectService(SceneService);

  public constructor() {
    this.initialize();
  }

  private initialize() {
    const { arcRotateCamera } = this.createArcRotateCameraComponent();

    this.worldService
      .getWorld<ArcRotateCameraComponent>()
      .add({ arcRotateCamera });
  }

  private createArcRotateCameraComponent() {
    const { scene } = this.sceneService;
    const alpha = Tools.ToRadians(270);
    // const beta = Tools.ToRadians(0);
    const beta = 0.6782;
    // const beta = 1.7104;
    const radius = 20;
    const arcRotateCamera = new ArcRotateCamera(
      'arc_rotate_camera',
      alpha,
      beta,
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

    return new ArcRotateCameraComponent(arcRotateCamera);
  }
}
