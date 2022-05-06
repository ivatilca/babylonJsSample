import * as BABYLON from "babylonjs";
import * as helper from "./helper";

export async function setup(scene: BABYLON.Scene, canvas: HTMLCanvasElement) {
    const camera = new BABYLON.ArcRotateCamera(
        "camera",
        -1.2,
        Math.PI/2.2,
        23,
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
    const background = createBackground(scene, meshes.modelMesh as BABYLON.AbstractMesh);

    return {
        camera: camera,
        light: light,
        modelMesh: meshes.modelMesh,
        model: meshes.modelFadeBehavior,
        skybox: background.skybox
    }
}

export async function importMeshes(scene: BABYLON.Scene) {
    const modelMeshes = await BABYLON.SceneLoader.ImportMeshAsync("", "assets/", "3xm.glb", scene);
    const model = modelMeshes.meshes[5];
    helper.scaleFromPivot(model, new BABYLON.Vector3(0, 90, 0), 0, 0, 0);

    model.position.y += 4;

    const modelFade = new BABYLON.FadeInOutBehavior();
    modelFade.fadeInTime = 500;
    helper.addFadeBehavior(model, modelFade);

    const magicFade = new BABYLON.FadeInOutBehavior();
    magicFade.fadeInTime = 300;

    return {
        modelMesh: model,
        modelFadeBehavior: modelFade,
        magicCircleFadeBehavior: magicFade
    }
}

export function createBackground(scene: BABYLON.Scene, meshToRender: BABYLON.AbstractMesh) {
    const skybox = BABYLON.Mesh.CreateBox("BackgroundSkybox", 100, scene, undefined, BABYLON.Mesh.BACKSIDE);
    skybox.scaling = new BABYLON.Vector3(skybox.scaling.x * 1.2, skybox.scaling.y * 0.5, skybox.scaling.z * 1.2);
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