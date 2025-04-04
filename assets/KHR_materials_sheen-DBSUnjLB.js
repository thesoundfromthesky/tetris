import{I as d,C as i,u as c,r as m}from"./index-CfS70t6F.js";import{G as a}from"./glTFLoader-DQB8554u.js";import"./objectModelMapping-D4YYZYlG.js";const h="KHR_materials_sheen";class l{constructor(n){this.name=h,this.order=190,this._loader=n,this.enabled=this._loader.isExtensionUsed(h)}dispose(){this._loader=null}loadMaterialPropertiesAsync(n,s,e){return a.LoadExtensionAsync(n,s,this.name,(r,o)=>{const u=new Array;return u.push(this._loader.loadMaterialPropertiesAsync(n,s,e)),u.push(this._loadSheenPropertiesAsync(r,o,e)),Promise.all(u).then(()=>{})})}_loadSheenPropertiesAsync(n,s,e){if(!(e instanceof d))throw new Error(`${n}: Material type not supported`);const r=new Array;return e.sheen.isEnabled=!0,e.sheen.intensity=1,s.sheenColorFactor!=null?e.sheen.color=i.FromArray(s.sheenColorFactor):e.sheen.color=i.Black(),s.sheenColorTexture&&r.push(this._loader.loadTextureInfoAsync(`${n}/sheenColorTexture`,s.sheenColorTexture,o=>{o.name=`${e.name} (Sheen Color)`,e.sheen.texture=o})),s.sheenRoughnessFactor!==void 0?e.sheen.roughness=s.sheenRoughnessFactor:e.sheen.roughness=0,s.sheenRoughnessTexture&&(s.sheenRoughnessTexture.nonColorData=!0,r.push(this._loader.loadTextureInfoAsync(`${n}/sheenRoughnessTexture`,s.sheenRoughnessTexture,o=>{o.name=`${e.name} (Sheen Roughness)`,e.sheen.textureRoughness=o}))),e.sheen.albedoScaling=!0,e.sheen.useRoughnessFromMainTexture=!1,Promise.all(r).then(()=>{})}}c(h);m(h,!0,t=>new l(t));export{l as KHR_materials_sheen};
