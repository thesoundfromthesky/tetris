import { injectable } from 'inversify';
import { injectService } from '../injector/inject-service.function';
import { SceneService } from '../core/scene.service';
import {
  Axis,
  Color4,
  CreateBox,
  EdgesRenderer,
  Space,
  StandardMaterial,
  Vector3,
} from '@babylonjs/core';
import { WorldService } from '../core/world.service';
import { ConfigService } from '../core/config.service';
import { InputAxisService } from '../core/input-axis.service';
import { InputActionService } from '../core/input-action.service';

@injectable()
export class BlockEntity {
  private readonly sceneService = injectService(SceneService);
  private readonly worldService = injectService(WorldService);
  private readonly configService = injectService(ConfigService);
  private readonly inputAxisService = injectService(InputAxisService);
  private readonly inputActionService = injectService(InputActionService);

  public constructor() {
    this.init();
  }

  private init() {
    this.initInputAxis();
    this.initInputAction();
    this.createBlock();
  }

  private initInputAxis() {
    this.inputAxisService.setInputAxis({
      ArrowRight: { scale: 1, axis: 'moveRight' },
      ArrowLeft: { scale: -1, axis: 'moveRight' },
      ArrowUp: { scale: 1, axis: 'moveForward' },
      ArrowDown: { scale: -1, axis: 'moveForward' },
      KeyW: { scale: 1, axis: 'rotateX' },
      KeyS: { scale: -1, axis: 'rotateX' },
      KeyA: { scale: 1, axis: 'rotateZ' },
      KeyD: { scale: -1, axis: 'rotateZ' },
      KeyQ: { scale: 1, axis: 'rotateY' },
      KeyE: { scale: -1, axis: 'rotateY' },
    });
  }

  private initInputAction() {
    this.inputActionService.setInputAxis({ Space: { action: 'jump' } });
  }

  private createBlock() {
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

    const createBoxInstance = () => {
      const { length } = box.instances;
      const boxInstance = box.createInstance(`${length}_box`);

      const { startingPosition } = this.configService;

      boxInstance.setAbsolutePosition(startingPosition);

      return boxInstance;
    };

    function isIntersecting(movement: Vector3) {
      const { instances } = box;
      const position = Vector3.Zero();
      const isIntersecting = instances.some((instance) => {
        if (boxInstance === instance) {
          return false;
        }

        position.setAll(0);
        boxInstance.absolutePosition.addToRef(movement, position);
        return position.equals(instance.absolutePosition);
      });

      return isIntersecting;
    }

    let boxInstance = createBoxInstance();

    const dropHard = () => {
      const { boundaryHalfHeight, boxSize } = this.configService;
      const { absolutePosition: boxPosition } = boxInstance;
      if (
        boxPosition.y - boxSize > -boundaryHalfHeight &&
        !isIntersecting(Vector3.DownReadOnly)
      ) {
        boxInstance.translate(Axis.Y, -1, Space.WORLD);
        return true;
      }

      return false;
    };

    let isGameOver = false;
    const dorpSoft = () => {
      const { boundaryHalfHeight, boxSize } = this.configService;

      const { absolutePosition: boxPosition } = boxInstance;

      if (isIntersecting(Vector3.DownReadOnly)) {
        if (boxPosition.y > boundaryHalfHeight) {
          isGameOver = true;
          clearInterval(intervalId);
          return;
        }
        boxInstance = createBoxInstance();
        return;
      } else if (boxPosition.y - boxSize < -boundaryHalfHeight) {
        boxInstance = createBoxInstance();
        return;
      } 
      boxInstance.translate(Axis.Y, -1, Space.WORLD);
    };

    let intervalId = setInterval(dorpSoft, 1000);
    const { boundaryHalfWidth } = this.configService;

    const direction = Vector3.Zero();

    this.inputAxisService.inputAxisObservable.add(
      ({ axis, scale, isPressed }) => {
        if (isGameOver || !isPressed) {
          return;
        }

        const moveRight = axis === 'moveRight' ? scale : 0;
        const moveForward = axis === 'moveForward' ? scale : 0;
        const boxPosition = boxInstance.getAbsolutePosition();
        const desiredPositionX = boxPosition.x + moveRight;
        const desiredPositionZ = boxPosition.z + moveForward;

        if (
          moveRight &&
          boundaryHalfWidth > desiredPositionX &&
          desiredPositionX > -boundaryHalfWidth
        ) {
          direction.setAll(0);
          direction.x = moveRight;
          if (!isIntersecting(direction)) {
            boxInstance.translate(Axis.X, moveRight, Space.WORLD);
          }
        }

        if (
          moveForward &&
          boundaryHalfWidth > desiredPositionZ &&
          desiredPositionZ > -boundaryHalfWidth
        ) {
          direction.setAll(0);
          direction.z = moveForward;
          if (!isIntersecting(direction)) {
            boxInstance.translate(Axis.Z, moveForward, Space.WORLD);
          }
        }
      }
    );

    this.inputActionService.inputActionObservable.add(
      ({ action, isPressed }) => {
        if (isGameOver) {
          return;
        }

        if (action === 'jump' && isPressed) {
          clearInterval(intervalId);
          while (true) {
            const canDrop = dropHard();
            if (!canDrop) {
              dorpSoft();
              intervalId = setInterval(dorpSoft, 1000);
              break;
            }
          }
        }
      }
    );
  }
}
