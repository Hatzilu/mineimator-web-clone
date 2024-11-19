'use client';
import { createSharpTexture } from '@/utils/three.utils';
import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer, OutlinePass, RenderPass } from 'three/examples/jsm/Addons.js';

const ViewPort = () => {


    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
    const renderer = new THREE.WebGLRenderer();

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const renderPass = new RenderPass(scene, camera);
    const clock = new THREE.Clock();

    let selectedObjects = [];

    useEffect(() => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.shadowMap.enabled = true;


        outlinePass.visibleEdgeColor.set("#ffffff");
        outlinePass.hiddenEdgeColor.set('#000000');
        outlinePass.edgeStrength = 5;
        outlinePass.edgeGlow = 0;
        outlinePass.edgeThickness = 1;
        outlinePass.pulsePeriod = 0;

        renderPass.setSize(window.innerWidth, window.innerHeight)
        renderPass.renderToScreen = true;
        const effectComposer = new EffectComposer(renderer)
        effectComposer.addPass(renderPass);
        effectComposer.addPass(outlinePass);

        const light2 = new THREE.DirectionalLight(0xffffff, 1);
        light2.position.set(0, 1, 0);
        light2.shadow.mapSize.width = 512;
        scene.add(light2)

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        // scene.add(cube);

        const light = new THREE.AmbientLight(0x404040); // soft white light scene.add( light );
        scene.add(light);


        var groundTexture = new THREE.TextureLoader().load("textures/grass.jpg");

        groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
        groundTexture.repeat.set(100, 100);
        groundTexture.anisotropy = 16;
        groundTexture.magFilter = THREE.NearestFilter;
        groundTexture.encoding = THREE.sRGBEncoding;

        var groundMaterial = new THREE.MeshStandardMaterial({ map: groundTexture });

        var groundMesh = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), groundMaterial);
        groundMesh.position.y = -5.0;
        groundMesh.rotation.x = - Math.PI / 2;
        groundMesh.receiveShadow = true;


        let skyboxTexture = new THREE.TextureLoader().load("textures/skybox.jpeg");
        console.log({ skyboxTexture });

        skyboxTexture.name = 'skybox';
        // skyboxTexture.encoding = THREE.sRGBEncoding;

        let skyboxMaterial = new THREE.MeshBasicMaterial({ map: skyboxTexture, side: THREE.BackSide });

        let sphereGeometry = new THREE.SphereGeometry(100, 100);
        // sphereGeometry.computeVertexNormals();
        let skyboxMesh = new THREE.Mesh(sphereGeometry, skyboxMaterial);
        skyboxMesh.position.y = -10.0;
        skyboxMesh.position.z = -50.0;
        skyboxMesh.receiveShadow = false;
        console.log(skyboxMesh)

        scene.add(groundMesh);
        scene.add(skyboxMesh);

        const controls = new OrbitControls(camera, renderer.domElement);

        function onPointerClick(event: MouseEvent) {
            pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
            pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
            console.log(pointer);

            let objs = scene.children.filter(obj => obj.type === 'Mesh' && obj.name === 'Grass block')
            const intersects = raycaster.intersectObjects(objs);
            console.log({ intersects, objs })
            if (!intersects.length) {
                selectedObjects = [];
                outlinePass.selectedObjects = selectedObjects;
                return;
            }

            for (let i = 0; i < intersects.length; i++) {
                let m = intersects[i].object;
                if (m.name === "Grass block") {
                    selectedObjects = [];
                    selectedObjects.push(m);
                    outlinePass.selectedObjects = selectedObjects;
                }
            }
        }

        function animate() {
            cube.rotation.x += 0.01; cube.rotation.y += 0.01;
            const delta = clock.getDelta()
            // mesh.rotation.y += 0.01;
            // mesh.rotation.x += 0.01;
            controls.update()
            raycaster.setFromCamera(pointer, camera);
            // renderer.render(scene, camera);
            effectComposer.render(delta)
        };

        function onWindowResize() {

            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize(window.innerWidth, window.innerHeight);

        }

        renderer.setAnimationLoop(animate);

        const c = document.querySelector('#canvas');
        if (!c) {
            return;
        }

        c.addEventListener('click', onPointerClick);
        window.addEventListener('resize', onWindowResize)
        c.appendChild(renderer.domElement);

        return () => {
            c.removeEventListener('click', onPointerClick)
            window.removeEventListener('resize', onWindowResize)
        }
    }, [])

    const addGrass = () => {
        let loader = new THREE.TextureLoader();
        loader.setPath("textures/grass/");

        const material = [
            new THREE.MeshStandardMaterial({ map: createSharpTexture(loader, 'side.png') }),
            new THREE.MeshStandardMaterial({ map: createSharpTexture(loader, 'side2.png') }),
            new THREE.MeshStandardMaterial({ map: createSharpTexture(loader, 'top.png') }),
            new THREE.MeshStandardMaterial({ map: createSharpTexture(loader, 'bottom.png') }),
            new THREE.MeshStandardMaterial({ map: createSharpTexture(loader, 'side3.png') }),
            new THREE.MeshStandardMaterial({ map: createSharpTexture(loader, 'side4.png') }),
        ];

        let mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
        mesh.position.y = -4.5;
        mesh.position.x = Math.random() * 5;
        mesh.position.z = Math.random() * 5;
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        mesh.name = "Grass block";
        scene.add(mesh)
    }

    return (
        <div>
            <button className='absolute z-10 bg-gray-400 p-2 rounded-xl' onClick={addGrass}>
                add grass
            </button>
            <div id="canvas"></div>
        </div>
    )
}

export default ViewPort

