import './App.css';
import * as THREE from 'three';
import { useEffect, useRef } from 'react';
import { createNoise2D } from 'simplex-noise';

function App() {
  const size = 16;

  var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  var scene = new THREE.Scene();

  var renderer = new THREE.WebGLRenderer();
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  //Texturas
  const loader = new THREE.TextureLoader();

  var Dirt = [
    new THREE.MeshPhongMaterial({ map: loader.load(require('./textures/GrassBottom.jpg')) }),
    new THREE.MeshPhongMaterial({ map: loader.load(require('./textures/GrassBottom.jpg')) }),
    new THREE.MeshPhongMaterial({ map: loader.load(require('./textures/GrassBottom.jpg')) }),
    new THREE.MeshPhongMaterial({ map: loader.load(require('./textures/GrassBottom.jpg')) }),
    new THREE.MeshPhongMaterial({ map: loader.load(require('./textures/GrassBottom.jpg')) }),
    new THREE.MeshPhongMaterial({ map: loader.load(require('./textures/GrassBottom.jpg')) }),
  ];
  var Grass = [
    new THREE.MeshPhongMaterial({ map: loader.load(require('./textures/GrassSide.jpg')) }),
    new THREE.MeshPhongMaterial({ map: loader.load(require('./textures/GrassSide.jpg')) }),
    new THREE.MeshPhongMaterial({ map: loader.load(require('./textures/GrassTop.jpg')) }),
    new THREE.MeshPhongMaterial({ map: loader.load(require('./textures/GrassBottom.jpg')) }),
    new THREE.MeshPhongMaterial({ map: loader.load(require('./textures/GrassSide.jpg')) }),
    new THREE.MeshPhongMaterial({ map: loader.load(require('./textures/GrassSide.jpg')) }),
  ];
  var Sand = [
    new THREE.MeshPhongMaterial({ map: loader.load(require('./textures/Sand.jpg')) }),
    new THREE.MeshPhongMaterial({ map: loader.load(require('./textures/Sand.jpg')) }),
    new THREE.MeshPhongMaterial({ map: loader.load(require('./textures/Sand.jpg')) }),
    new THREE.MeshPhongMaterial({ map: loader.load(require('./textures/Sand.jpg')) }),
    new THREE.MeshPhongMaterial({ map: loader.load(require('./textures/Sand.jpg')) }),
    new THREE.MeshPhongMaterial({ map: loader.load(require('./textures/Sand.jpg')) }),
  ];
  var Three = [
    new THREE.MeshPhongMaterial({ map: loader.load(require('./textures/ThreeSide.jpg')) }),
    new THREE.MeshPhongMaterial({ map: loader.load(require('./textures/ThreeSide.jpg')) }),
    new THREE.MeshPhongMaterial({ map: loader.load(require('./textures/ThreeBottom.jpg')) }),
    new THREE.MeshPhongMaterial({ map: loader.load(require('./textures/ThreeBottom.jpg')) }),
    new THREE.MeshPhongMaterial({ map: loader.load(require('./textures/ThreeSide.jpg')) }),
    new THREE.MeshPhongMaterial({ map: loader.load(require('./textures/ThreeSide.jpg')) }),
  ];
  var Leaf = [
    new THREE.MeshPhongMaterial({ map: loader.load(require('./textures/Leaf.jpg')) }),
    new THREE.MeshPhongMaterial({ map: loader.load(require('./textures/Leaf.jpg')) }),
    new THREE.MeshPhongMaterial({ map: loader.load(require('./textures/Leaf.jpg')) }),
    new THREE.MeshPhongMaterial({ map: loader.load(require('./textures/Leaf.jpg')) }),
    new THREE.MeshPhongMaterial({ map: loader.load(require('./textures/Leaf.jpg')) }),
    new THREE.MeshPhongMaterial({ map: loader.load(require('./textures/Leaf.jpg')) }),
  ]
  var Water = [
    new THREE.MeshPhongMaterial({ color: 0x4040ff, opacity: 0, transparent: true }),
    new THREE.MeshPhongMaterial({ color: 0x4040ff, opacity: 0, transparent: true }),
    new THREE.MeshPhongMaterial({ map: loader.load(require('./textures/Water.jpg')), opacity: 0.5, transparent: true }),
    new THREE.MeshPhongMaterial({ color: 0x4040ff, opacity: 0, transparent: true }),
    new THREE.MeshPhongMaterial({ color: 0x4040ff, opacity: 0, transparent: true }),
    new THREE.MeshPhongMaterial({ color: 0x4040ff, opacity: 0, transparent: true }),
  ]

  var movimentRef = useRef({});
  var rotationRef = useRef({});

  var rigthRef = useRef({});
  var downRef = useRef({});
  var leftRef = useRef({});
  var upRef = useRef({});

  var f3Ref = useRef({});

  useEffect(() => {
    scene.clear();
    
    gen_world( gen_matrix(size, 10) );

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x87ceeb, 1);

    document.body.appendChild(renderer.domElement);

    observer_object_on_move(rotationRef.current, (a, b) => {
      camera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), a / 7000);
      camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), (1) * b / 4000);
    });

    move_player_while_press(upRef.current, 0, 0.2);
    move_player_while_press(downRef.current, 0, -0.2);
    move_player_while_press(rigthRef.current, -0.2, 0);
    move_player_while_press(leftRef.current, 0.2, 0);

    function sigmoid(z) {
      return 1 / (1 + Math.exp(-z));
    }
    function gen_matrix(size, base) {
      let noise2d = createNoise2D();
      let output = [];
      for (let x = 0; x < size; x++) {
        output.push([]);
        for (let y = 0; y < size; y++) {
          output[x].push(noise2d(x / size, y / size));
        }
      }
      output.map((a, x) =>
        a.map((c, y) =>
          output[x][y] = Math.floor(sigmoid(c) * base)
        )
      )
      return output;
    }
    function gen_world(matriz) {
      matriz.map((array, x) => {
        array.map((y, z) => {

          //Gerando grama e areia;
          let geometry = new THREE.BoxGeometry(1, 1, 1);
          geometry.translate(x, y, z);

          if (y < 4) {
            let cube = new THREE.Mesh(geometry, Sand);
            cube.castShadow = true;
            cube.receiveShadow = true;
            scene.add(cube);
            let _geometry = new THREE.BoxGeometry(1, 1, 1);
            _geometry.translate(x, 4, z);
            let _cube = new THREE.Mesh(_geometry, Water);
            scene.add(_cube);
          } else {
            let cube = new THREE.Mesh(geometry, Grass);
            cube.castShadow = true;
            cube.receiveShadow = true;
            scene.add(cube);
          }

          //Gerando terras sem grama;
          for (var i = y - 1; i > 0; i--) {
            let _geometry = new THREE.BoxGeometry(1, 1, 1);
            _geometry.translate(x, i, z);
            let _cube = new THREE.Mesh(_geometry, Dirt);
            scene.add(_cube);
          }
        })
      });
      if (matriz[4][4] > 4) {
        matriz = three_func(4, matriz[4][4], 4, matriz);
      }

      camera.position.set(size / 2, 10, size / 2);
      const light = new THREE.DirectionalLight(0xAFAFAF, 1);
      light.position.set(size, 40, size);
      light.castShadow = true;
      scene.add(light);
      const hemisphereLight = new THREE.HemisphereLight(0xAFAFAF, 1);
      hemisphereLight.castShadow = true;
      scene.add(hemisphereLight);
      
    }
    function observer_object_on_move(element, action) {
      var initialpos = null
      var pressed = false;
      element.addEventListener('touchstart', () => pressed = true);
      element.addEventListener('touchend', () => {
        pressed = false;
        initialpos = null;
      })
      element.addEventListener('touchcancel', () => {
        pressed = false;
        initialpos = null;
      })
      element.addEventListener('touchmove', function (e) {
        if (pressed) {
          if (initialpos == null) {
            initialpos = { x: e.changedTouches[0].screenX, y: e.changedTouches[0].screenY };
          }
          var varianceX = initialpos.x - e.changedTouches[0].screenX
          var varianceY = initialpos.y - e.changedTouches[0].screenY
          //Executa a função recebida passando os seguintes parametros;
          action(varianceX, varianceY, e.changedTouches[0].screenX, e.changedTouches[0].screenY);
        }
      });
    }
    function move_player_while_press(element, a, b) {
      element.addEventListener("touchstart", () => {
        var touched = true;
        console.log("tocou")
        element.addEventListener("touchend", () => {
          touched = false;
        })
        element.addEventListener("touchcancel", () => {
          touched = false;
        })
        setInterval(() => {
          if (touched) {
            let angle = sigmoid(camera.rotation.y / 2) * 360;
            let latros = { x: -1, y: -1 }
            if (angle >= 0 && angle < 90) {
              latros = { x: 1, y: 1 }
            } else if (angle > 90 && angle < 180) {
              latros = { x: -1, y: -1 }
            } else if (angle >= 180 && angle < 270) {
              latros = { x: -1, y: -1 }
            } else {
              latros = { x: -1, y: 1 }
            }
            camera.translateOnAxis(new THREE.Vector3(1, 0, 0), latros.x * a);
            camera.translateOnAxis(new THREE.Vector3(0, 0, 1), latros.y * b);
          }
        }, 1);
      })
    }
    function three_func(x, y, z, matriz) {
      for (var i = 0; i < 4; i++) {
        let geometry = new THREE.BoxGeometry(1, 1, 1);
        geometry.translate(x, y + 1 + i, z);
        let cube = new THREE.Mesh(geometry, Three);
        cube.castShadow = true;
        cube.receiveShadow = true;
        scene.add(cube);
      }
      for (var k = 0; k < 3; k++) {
        for (var i = 0; i < 5; i++) {
          for (var j = 0; j < 5; j++) {
            let geometry = new THREE.BoxGeometry(1, 1, 1);
            geometry.translate(x - 2 + i, y + 4 + k, z - 2 + j);
            let cube = new THREE.Mesh(geometry, Leaf);
            cube.castShadow = true;
            cube.receiveShadow = true;
            scene.add(cube);
            matriz[(x - 2 + i)][(z - 2 + j)] = 10;
          }
        }
      }
      for (var k = 0; k < 2; k++) {
        for (var i = 0; i < 3; i++) {
          for (var j = 0; j < 3; j++) {
            let geometry = new THREE.BoxGeometry(1, 1, 1);
            geometry.translate(x - 2 + i + 1, y + 4 + k + 3, z - 2 + j + 1);
            let cube = new THREE.Mesh(geometry, Leaf);
            cube.castShadow = true;
            cube.receiveShadow = true;
            scene.add(cube);
            matriz[(x - 2 + i + 1)][(z - 2 + j + 1)] = 11;
          }
        }
      }
      return matriz;
    }
    //Função recursiva de render;
    function render() {
      renderer.render(scene, camera);
      requestAnimationFrame(render)
    }
    render();
  });

  return (
    <>
      <div id="f3" ref={f3Ref}>
      </div>
      <div id="moviment" ref={movimentRef}>
        <div id="up" ref={upRef} className="button"></div>
        <div id="down" ref={downRef} className="button"></div>
        <div id="right" ref={rigthRef} className="button"></div>
        <div id="left" ref={leftRef} className="button"></div>
      </div>
      <div id="rotation" ref={rotationRef}></div>
      <script src="../js/jquery.js"></script>
      <script src="../js/three.js"></script>
      <script src="../js/buffergeometricutils.js"></script>
      <script src="./AppIndex.js"></script>
    </>
  );
}

export default App;
