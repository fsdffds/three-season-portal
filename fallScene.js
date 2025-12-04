import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

export function FallScene(scene) {
  // 흙바닥
  const groundGeometry = new THREE.BoxGeometry(10, 1, 10);
  const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x5d4037,
    roughness: 1.0,
    flatShading: true,
  });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.position.y = -0.5;
  ground.receiveShadow = true;
  scene.add(ground);

  // 길
  const pathGeometry = new THREE.BoxGeometry(10, 1.1, 3.5);
  const pathMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x8d6e63,
    roughness: 0.8,
  });
  const path = new THREE.Mesh(pathGeometry, pathMaterial);
  path.position.y = -0.5;
  path.receiveShadow = true;
  scene.add(path);

  // 단풍 나무
  const loader = new GLTFLoader();
  loader.load(
    './assets/maple_tree.glb',
    (gltf) => {
      // 원본 나무
      const originalTree = gltf.scene;
      originalTree.scale.set(4, 4, 4);
      originalTree.traverse((node) => {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });

      const sideZ = [3.2, -3.2]; 

      const startX = -4;
      const endX = 4;
      const stepX = 2;  // 간격

      // 위치
      sideZ.forEach((z) => {
        
        for (let x = startX; x <= endX; x += stepX) {
          const tree = originalTree.clone();
          tree.position.set(x, 0, z);

          // 랜덤 회전 추가
          tree.rotation.y = Math.random() * Math.PI * 2;
          // 크기 랜덤
          const scale = 3.5 + Math.random(); 
          tree.scale.set(scale, scale, scale);
          scene.add(tree);
        }
      });
    }, undefined, 
    (error) => console.error(error)
  );

  // 가로등 함수 (기둥 + 전등 + 전구)
  function createLamp(x, z) {
    // 기둥
    const poleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 4);
    const poleMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x666666,
      roughness: 0.1,
      metalness: 0.9 ,
    });
    const pole = new THREE.Mesh(poleGeometry, poleMaterial);
    pole.castShadow = true;
    pole.receiveShadow = true;
    pole.position.set(x, 2, z);

    // 전등
    const bulbGeometry = new THREE.DodecahedronGeometry(0.2);
    const bulbMaterial = new THREE.MeshBasicMaterial({ color: 0xffffee });
    const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial);
    bulb.position.y = 2;
    bulb.castShadow = false;
    pole.add(bulb);

    // 전구
    const light = new THREE.PointLight(0xffaa00, 7, 7);
    light.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadow.bias = -0.0001;
    bulb.add(light);
    
    scene.add(pole);
  };

  createLamp(-3, 3);
  createLamp(3, 3);
  createLamp(-3, -3);
  createLamp(3, -3);

  // 벤치
    loader.load(
    './assets/bench.glb',
    (gltf) => {
      const bench = gltf.scene;

      bench.scale.set(0.005, 0.005, 0.005);
      bench.position.set(-3.5, 0, -2.3);
      bench.rotation.y = Math.PI;

      bench.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
      scene.add(bench);

      const bench2 = bench.clone();
      bench2.position.set(2.5, 0, -2.3);
      scene.add(bench2);

      const bench3 = bench.clone();
      bench3.position.set(-2.5, 0, 2.3);
      bench3.rotation.y = Math.PI;
      scene.add(bench3);

      const bench4 = bench.clone();
      bench4.position.set(2.5, 0, 2.3);
      bench4.rotation.y = Math.PI;
      scene.add(bench4);

    }, undefined,
  (error) => console.error(error)
);

  // 조명
  const sunLight = new THREE.DirectionalLight(0xffaa33, 2.0); // 주황빛
  sunLight.position.set(5, 10, 3);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(2048, 2048);
  
  // 그림자 범위
  const d = 20;
  sunLight.shadow.camera.left = -d;
  sunLight.shadow.camera.right = d;
  sunLight.shadow.camera.top = d;
  sunLight.shadow.camera.bottom = -d;
  
  scene.add(sunLight);

  const hemiLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 1.5);
  scene.add(hemiLight);
}
