import { injectable } from 'inversify';
import { injectService } from '../injector/inject-service.function';
import { SceneService } from '../core/scene.service';
import {
  Color4,
  CreateBox,
  EdgesRenderer,
  type Mesh,
  StandardMaterial,
} from '@babylonjs/core';
import { ConfigService } from '../core/config.service';

@injectable()
export class BoxService {
  private readonly sceneService = injectService(SceneService);
  private readonly configService = injectService(ConfigService);

  public box!: Mesh;

  public constructor() {
    this.init();
  }

  private init() {
    this.initBox();
  }

  private initBox() {
    const { scene } = this.sceneService;
    const faceColors = new Array(6);

    faceColors[0] = new Color4(1, 1, 0, 1);
    faceColors[1] = new Color4(0, 0, 1, 1);
    faceColors[2] = new Color4(1, 0, 0, 1);
    faceColors[3] = new Color4(1, 0, 1, 1);
    faceColors[4] = new Color4(0, 1, 1, 1);
    faceColors[5] = new Color4(0, 1, 0, 1);

    const boxMaterial = new StandardMaterial('box', scene);

    const { boxSize } = this.configService;
    const options: Parameters<typeof CreateBox>[1] = {
      size: boxSize,
      faceColors: faceColors,
    };
    const box = CreateBox('box', options, scene);
    box.setEnabled(false);

    box.material = boxMaterial;

    const edgeRenderer = new EdgesRenderer(box);
    edgeRenderer.lineShader.zOffsetUnits = -10;
    box.enableEdgesRendering();
    box.edgesColor.copyFromFloats(255, 255, 255, 1);
    box.edgesWidth = 5;
    box.edgesShareWithInstances = true;

    this.box = box;
  }

  public createBoxInstance() {
    const { length } = this.box.instances;
    const boxInstance = this.box.createInstance(`box_${length}`);

    return boxInstance;
  }
}
