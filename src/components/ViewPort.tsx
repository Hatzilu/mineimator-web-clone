'use client';
import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const ViewPort = () => {


    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer();

    useEffect(() => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

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

        function animate() {
            cube.rotation.x += 0.01; cube.rotation.y += 0.01;
            // mesh.rotation.y += 0.01;
            // mesh.rotation.x += 0.01;
            controls.update()
            renderer.render(scene, camera);
        };

        renderer.setAnimationLoop(animate);

        const c = document.querySelector('#canvas');
        if (!c) {
            return;
        }
        c.appendChild(renderer.domElement);

    }, [])

    const addGrass = () => {
        let texture = new THREE.TextureLoader().load("textures/grass.jpg");

        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(100, 100);
        texture.anisotropy = 16;
        // texture.encoding = THREE.sRGBEncoding;

        let material = new THREE.MeshStandardMaterial({ map: texture });

        let mesh = new THREE.Mesh(new THREE.BoxGeometry(5, 5, 5), material);
        mesh.position.y = Math.random() * 5;
        mesh.position.x = Math.random() * 5;
        mesh.position.z = Math.random() * 5;
        // mesh.rotation.x = - Math.random() * 5;
        mesh.receiveShadow = true;
        scene.add(mesh)
    }

    return (
        <>
            <button onClick={addGrass}>
                add grass
            </button>
            <div id="canvas"></div>
        </>
    )
}

export default ViewPort

