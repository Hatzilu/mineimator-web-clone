import * as THREE from 'three';



export function createSharpTexture(loader: THREE.TextureLoader, url: string): THREE.Texture {
    let result = loader.load(url)
    result.magFilter = THREE.NearestFilter;
    return result;
}