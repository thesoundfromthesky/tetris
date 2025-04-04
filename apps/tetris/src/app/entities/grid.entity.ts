import { injectable } from 'inversify';
import { CreateGround, CreatePlane, Vector3 } from '@babylonjs/core';
import { injectService } from '../injector/inject-service.function';
import { SceneService } from '../core/scene.service';
import { GridMaterial } from '@babylonjs/materials';
import { ConfigService } from '../core/config.service';

@injectable()
export class GridEntity {
  private readonly sceneService = injectService(SceneService);
  private readonly configService = injectService(ConfigService);

  public constructor() {
    this.initialize();
  }

  private initialize() {
    this.createGround();
    this.createSides();
  }

  private createGround() {
    const { scene } = this.sceneService;

    const grid = this.createGridMaterial('ground');
    grid.backFaceCulling = false;

    const { boundaryWidth, boundaryDepth, boundaryHalfHeight } =
      this.configService;
    const ground = CreateGround(
      'ground',
      { width: boundaryWidth, height: boundaryDepth },
      scene
    );
    ground.material = grid;

    ground.position.y = -boundaryHalfHeight;
  }

  private createSide(x: number, y: number, z: number, yRot: number) {
    const { scene } = this.sceneService;

    const gridMaterial = this.createGridMaterial('side');

    const { boundaryWidth, boundaryHeight } = this.configService;
    const side = CreatePlane(
      'side',
      { width: boundaryWidth, height: boundaryHeight },
      scene
    );
    side.material = gridMaterial;
    side.position.copyFromFloats(x, y, z);
    side.rotation.y = yRot;

    return side;
  }

  private createSides() {
    const { boundaryHalfWidth } = this.configService;

    const sideTransforms = [
      [0, 0, -boundaryHalfWidth, Math.PI],
      [0, 0, boundaryHalfWidth, 0],
      [boundaryHalfWidth, 0, 0, Math.PI / 2],
      [-boundaryHalfWidth, 0, 0, -Math.PI / 2],
    ];
    const side = this.createSide(0, 0, 0, 0);
    side.setEnabled(false);

    sideTransforms.forEach((sideTransform, i) => {
      const sideInstance = side.createInstance(`side_${i + 1}`);
      sideInstance.position.x = sideTransform[0];
      sideInstance.position.y = sideTransform[1];
      sideInstance.position.z = sideTransform[2];
      sideInstance.rotation.y = sideTransform[3];
    });
  }

  private createGridMaterial(name: string) {
    const { scene } = this.sceneService;
    const grid = new GridMaterial(name, scene);
    //grid.lineColor = BABYLON.Color3.White();
    grid.majorUnitFrequency = 1; //every line is a strong line
    grid.opacity = 0.8; //grid opacity outside of the lines; trasparent if < 1
    grid.gridOffset = new Vector3(0.5, 0, 0.5);

    return grid;
  }
}
