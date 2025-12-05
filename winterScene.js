import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

export function WinterScene(scene) {
  // 바닥
  const groundGeometry = new THREE.BoxGeometry(10, 1, 10);
  const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x5d4037,
    flatShading: true,
    side: THREE.DoubleSide
  });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.position.y = -0.5;
  scene.add(ground);

  // 바닥에 쌓인 눈
  const snowGeometry = new THREE.BoxGeometry(10, 0.25, 10, 20, 1, 20);
  const snowTexture = new THREE.TextureLoader().load('./assets/texture/snow.jpg');
  const snowMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.5,
    metalness: 0,
    map: snowTexture,
  });
  const snowPos = snowGeometry.attributes.position;

  for (let i = 0; i < snowPos.count; i++) {
    const y = snowPos.getY(i);

    if (y > 0) {
      snowPos.setY(i, y + (Math.random() - 0.5) * 0.2);
    }
  }
  snowGeometry.computeVertexNormals();
  const snow = new THREE.Mesh(snowGeometry, snowMaterial);
  snow.position.y = 0.1; 
  snow.receiveShadow = true;
  snow.castShadow = true;
  
  scene.add(snow);

  // 눈 쌓인 집
  const loader = new GLTFLoader();
  loader.load(
    './assets/glb/snow_hut.glb',
    (gltf) => {
      const hut = gltf.scene;

      hut.scale.set(0.5, 0.5, 0.5);
      hut.position.set(-1, 0.5, -2);
      hut.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
      scene.add(hut);
    }, undefined, 
  (error) => console.error(error)
);

  // 눈 쌓인 나무 함수
  function createSnowTree(x, z, scale = 1) {
    // 공통 material
    const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x4e342e, flatShading: true });
    const leafMaterial = new THREE.MeshStandardMaterial({ color: 0x2e7d32, flatShading: true });
    const snowMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, flatShading: true, roughness: 1 });

    // 기둥
    const trunkGeometry = new THREE.CylinderGeometry(0.15, 0.2, 1, 8);
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.set(x, 0.5 * scale, z); 
    trunk.scale.set(scale, scale, scale);
    
    // 기둥 그림자
    trunk.castShadow = true;
    trunk.receiveShadow = true;

    // 잎 (밑)
    const botConeGeometry = new THREE.ConeGeometry(1.2, 1.5, 8);
    const botCone = new THREE.Mesh(botConeGeometry, leafMaterial);
    botCone.position.y = 1.0; 
    botCone.castShadow = true;
    botCone.receiveShadow = true;
    
    trunk.add(botCone);

    // 잎 (중간)
    const topConeGeometry = new THREE.ConeGeometry(0.9, 1.5, 8);
    const topCone = new THREE.Mesh(topConeGeometry, leafMaterial);
    topCone.position.y = 2.0;
    topCone.castShadow = true;
    topCone.receiveShadow = true;
    trunk.add(topCone);

    // 꼭대기 
    const snowTopGeometry = new THREE.ConeGeometry(0.5, 0.7, 8);
    const snowTop = new THREE.Mesh(snowTopGeometry, snowMaterial);
    snowTop.position.y = 2.6;
    snowTop.castShadow = true;
    trunk.add(snowTop); 

    scene.add(trunk);
  };

  createSnowTree(-3, 3, 1);
  createSnowTree(-1, 1.5, 0.8);

  // 눈사람
  loader.load(
    './assets/glb/snowman.glb',
    (gltf) => {
      const snowman = gltf.scene;

      snowman.scale.set(0.8, 0.8, 0.8);
      snowman.position.set(2, 0.3, 3);
      snowman.rotation.y = Math.PI / 2;
      snowman.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
      scene.add(snowman);
    }, undefined, 
  (error) => console.error(error)
);

  // 울타리
  function createFence(x, z, rotationY) {
    const woodMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x8d6e63, 
      roughness: 1.0 
    });

    // 가로대 2개
    const postGeometry = new THREE.BoxGeometry(0.15, 1.2, 0.15);
    const mainPost = new THREE.Mesh(postGeometry, woodMaterial);

    mainPost.position.set(x, 0.6, z);
    mainPost.rotation.y = rotationY;
    mainPost.castShadow = true;

    // 2. 왼쪽 기둥 (가운데 기둥에 add)
    const leftPost = new THREE.Mesh(postGeometry, woodMaterial);
    leftPost.position.set(-0.8, 0, 0);
    leftPost.castShadow = true;
    mainPost.add(leftPost);

    // 3. 오른쪽 기둥 (가운데 기둥에 add)
    const rightPost = new THREE.Mesh(postGeometry, woodMaterial);
    rightPost.position.set(0.8, 0, 0);
    rightPost.castShadow = true;
    mainPost.add(rightPost);

    // 4. 가로대 (가운데 기둥에 add)
    const railGeometry = new THREE.BoxGeometry(2, 0.1, 0.05);
    const rail1 = new THREE.Mesh(railGeometry, woodMaterial);
    rail1.position.y = 0.2; // 메인 기둥 중심보다 살짝 위
    mainPost.add(rail1);

    const rail2 = new THREE.Mesh(railGeometry, woodMaterial);
    rail2.position.y = -0.2; // 메인 기둥 중심보다 살짝 아래
    mainPost.add(rail2);

    scene.add(mainPost);
  }
  
  const fenceX = [-4, -2, 0, 2, 4];
  const fenceZ = [-4.5];

  fenceX.forEach(x => {
  fenceZ.forEach(z => {
    createFence(x, z, 0);
    createFence(x, -z, Math.PI);  // 반대 방향, 회전 180도 해서 정면 보이게
  });
});

  // 눈 파티클
  const snowParticles = [];
  const snowParticleGeometry = new THREE.DodecahedronGeometry(0.05);
  const snowParticleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

  for (let i = 0; i < 200; i++) {
      const flake = new THREE.Mesh(snowParticleGeometry, snowParticleMaterial);
      const x = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 10;
      const y = Math.random() * 10 + 2;
      flake.position.set(x, y, z);
      
      flake.userData = { 
          speed: 0.02 + Math.random() * 0.03,
          wobble: Math.random() * Math.PI * 2 
      };
      scene.add(flake);
      snowParticles.push(flake);
  }

  // 조명
  const mainLight = new THREE.DirectionalLight(0xffffff, 2.0);
  mainLight.position.set(5, 10, 2);
  mainLight.castShadow = true;
  mainLight.shadow.mapSize.set(2048, 2048);
  scene.add(mainLight);

  const ambient = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambient);

  return snowParticles;
}

export function winterAnimate(snowParticles, time) {
  // 눈 내리기
  if(snowParticles) {
    snowParticles.map(flake => {
      flake.position.y -= flake.userData.speed;
      flake.position.x += Math.sin(time * 0.001 + flake.userData.wobble) * 0.005;

      if (flake.position.y < 0) {
          flake.position.y = 7 + Math.random() * 3;
          flake.position.x = (Math.random() - 0.5) * 10;
          flake.position.z = (Math.random() - 0.5) * 10;
      }
    });
  }
}