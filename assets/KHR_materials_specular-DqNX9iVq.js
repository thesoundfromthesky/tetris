import{I as u,C as n,u as i,r as d}from"./index-CfS70t6F.js";import{G as m}from"./glTFLoader-DQB8554u.js";import"./objectModelMapping-D4YYZYlG.js";const l="KHR_materials_specular";class p{constructor(s){this.name=l,this.order=190,this._loader=s,this.enabled=this._loader.isExtensionUsed(l)}dispose(){this._loader=null}loadMaterialPropertiesAsync(s,e,r){return m.LoadExtensionAsync(s,e,this.name,(a,o)=>{const t=new Array;return t.push(this._loader.loadMaterialPropertiesAsync(s,e,r)),t.push(this._loadSpecularPropertiesAsync(a,o,r)),Promise.all(t).then(()=>{})})}_loadSpecularPropertiesAsync(s,e,r){if(!(r instanceof u))throw new Error(`${s}: Material type not supported`);const a=new Array;return e.specularFactor!==void 0&&(r.metallicF0Factor=e.specularFactor),e.specularColorFactor!==void 0&&(r.metallicReflectanceColor=n.FromArray(e.specularColorFactor)),e.specularTexture&&(e.specularTexture.nonColorData=!0,a.push(this._loader.loadTextureInfoAsync(`${s}/specularTexture`,e.specularTexture,o=>{o.name=`${r.name} (Specular)`,r.metallicReflectanceTexture=o,r.useOnlyMetallicFromMetallicReflectanceTexture=!0}))),e.specularColorTexture&&a.push(this._loader.loadTextureInfoAsync(`${s}/specularColorTexture`,e.specularColorTexture,o=>{o.name=`${r.name} (Specular Color)`,r.reflectanceTexture=o})),Promise.all(a).then(()=>{})}}i(l);d(l,!0,c=>new p(c));export{p as KHR_materials_specular};
