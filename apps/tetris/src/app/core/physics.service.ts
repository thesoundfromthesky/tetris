import { HavokPlugin, type Scene, Vector3 } from '@babylonjs/core';
import HavokPhysics from '@babylonjs/havok';
import { injectable } from 'inversify';

/* 
Add following to the vite.config
optimizeDeps: {
    exclude: ['@babylonjs/havok'],
    },     
*/

@injectable()
export class PhysicsService {
  public havokPlugin!: HavokPlugin;
  public async init(scene: Scene) {
    const havokPhysics = await HavokPhysics(/* {
            locateFile: () => {
              const url = new URL(
                `../../../../node_modules/@babylonjs/havok/lib/esm/HavokPhysics.wasm`,
                import.meta.url
              );
              return url.href;
            },
          } */);
    const gravityVector = new Vector3(0, -9.81, 0);
    const havokPlugin = new HavokPlugin(true, havokPhysics);
    this.havokPlugin = havokPlugin;
    scene.enablePhysics(gravityVector, havokPlugin);
  }
}
