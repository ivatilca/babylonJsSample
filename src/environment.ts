import * as BABYLON from "babylonjs";
import * as helper from "./helper";

export async function setup(scene: BABYLON.Scene, canvas: HTMLCanvasElement) {
    const camera = new BABYLON.ArcRotateCamera(
        "camera",
        Math.PI,
        Math.PI/3,
        8,
        new BABYLON.Vector3(0, 0, 0),
        scene
    );
    camera.attachControl(canvas, true);

    const light = new BABYLON.HemisphericLight(
        "light",
        new BABYLON.Vector3(0, 1, 0),
        scene
    );
    light.intensity = 3.5;

    const meshes = await importMeshes(scene);
    const background = createBackground(scene, meshes.dragonMesh as BABYLON.AbstractMesh);

    return {
        camera: camera,
        light: light,
        magicMeshes: meshes.magicMeshesRoot,
        dragonMesh: meshes.dragonMesh,
        dragon: meshes.dragonFadeBehavior, 
        magicCircle: meshes.magicCircleFadeBehavior,
        skybox: background.skybox
    }
}

export async function importMeshes(scene: BABYLON.Scene) {
    const dragonMeshes = await BABYLON.SceneLoader.ImportMeshAsync("", "assets/", "Dino.glb", scene);
    const dragon = dragonMeshes.meshes[0];
    helper.scaleFromPivot(dragon, new BABYLON.Vector3(0, 0, 0.5), 3000, 3000, 3000);
    dragon.position.y += 4;

    const magicRoot = new BABYLON.TransformNode("magicRoot");
    dragon.parent = magicRoot;

    helper.scaleFromPivot(magicRoot, new BABYLON.Vector3(0, 0, 0), 0.3, 0.3, 0.3);

    const dragonFade = new BABYLON.FadeInOutBehavior();
    dragonFade.fadeInTime = 500;
    helper.addFadeBehavior(dragon, dragonFade);

    const magicFade = new BABYLON.FadeInOutBehavior();
    magicFade.fadeInTime = 300;

    return {
        dragonMesh: dragon,
        magicMeshesRoot: magicRoot,
        dragonFadeBehavior: dragonFade,
        magicCircleFadeBehavior: magicFade
    }
}

export function createBackground(scene: BABYLON.Scene, meshToRender: BABYLON.AbstractMesh) {
    const skybox = BABYLON.Mesh.CreateBox("BackgroundSkybox", 500, scene, undefined, BABYLON.Mesh.BACKSIDE);
    const skyboxMaterial = new BABYLON.BackgroundMaterial("skyboxMaterial", scene);
    var files = [
        "assets/wall1.jpg",
        "assets/roof.jpg",
        "assets/wallfront2.jpg",
        "assets/wallfront1.jpg",
        "assets/floor.jpg",
        "assets/wall2.jpg",
    ];
    skyboxMaterial.reflectionTexture = BABYLON.CubeTexture.CreateFromImages(files, scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skybox.material = skyboxMaterial;

    return {
        skybox: skybox

    }
}