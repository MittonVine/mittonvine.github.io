const TRAY = document.getElementById('js-tray-slide');

var picker = new jscolor("#color-picker",
  {
    format:'hex',
    onChange:function(s){
      selectSwatch($("#color-picker").val());
    }
  });

var theModel;

//const MODEL_PATH = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/chair.glb";
const MODEL_PATH = "/zoomo/zoomo1.glb";

const colors = [
{
    color: '66533C'
},
{
    color: '173A2F'
},
{
    color: '153944'
},
{
    color: '27548D'
},
{
    color: '438AAC'
}  
]

const BACKGROUND_COLOR = 0xf1f1f1;
// Init the scene
const scene = new THREE.Scene();



var rgbeLoader = new THREE.RGBELoader();
var envMap = rgbeLoader.load("/zoomo/textures/equirectangular/royal_esplanade_1k.hdr");
envMap.mapping = THREE.EquirectangularReflectionMapping;


// Set background
//scene.background = new THREE.Color(BACKGROUND_COLOR );
scene.environment = envMap;
scene.fog = new THREE.Fog(BACKGROUND_COLOR, 20, 100);

const canvas = document.querySelector('#c');

// Init the renderer
const renderer = new THREE.WebGLRenderer({canvas, antialias: true});

//renderer.toneMapping = THREE.ACESFilmicToneMapping;
//renderer.toneMappingExposure = 1;
renderer.outputEncoding = THREE.sRGBEncoding;

renderer.shadowMap.enabled = true;
renderer.setPixelRatio(window.devicePixelRatio); 

var cameraFar = 5;

document.body.appendChild(renderer.domElement);

// Add a camerra
var camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = cameraFar;
camera.position.x = 0;


// Init the object loader
var loader = new THREE.GLTFLoader();
var dracoLoader = new THREE.DRACOLoader();
dracoLoader.setDecoderPath("/zoomo/static/");

var textureLoader = new THREE.TextureLoader();

loader.setDRACOLoader(dracoLoader);



// Initial materials
const FRAME_MTL = new THREE.MeshPhongMaterial( { color: 0xc0c0c0, shininess: 100, side: THREE.DoubleSide } );
const INITIAL_MTL = new THREE.MeshPhongMaterial( { color: 0xf1f1f1, shininess: 0, side: THREE.DoubleSide } );
const BLACK_MTL = new THREE.MeshPhongMaterial( { color: 0x202020, shininess: 25, side: THREE.DoubleSide } );
const ORANGE_MTL = new THREE.MeshPhongMaterial( { color: 0xf00f0f, shininess: 0.5, metalness:1 } );
const YELLOW_MTL = new THREE.MeshPhongMaterial( { color: 0xffff00, shininess: 0.5, metalness:1 } );
const GOLD_MTL = new THREE.MeshStandardMaterial( { color: 0xffff00, roughness: 0.5, metalness: 1 } );
const SILVER_MTL = new THREE.MeshStandardMaterial( { color: 0xf0f0f0, roughness: 0, metalness:1 } );

const INITIAL_MAP = [
  {childID:"", mtl:BLACK_MTL},
  {childID: "frame", mtl: FRAME_MTL},
  {childID: "M4", mtl: BLACK_MTL},
  {childID: "M6", mtl: BLACK_MTL},
  {childID: "brake", mtl: GOLD_MTL},
  {childID: "brakerotor", mtl: SILVER_MTL},
  {childID: "racklightstrip", mtl: ORANGE_MTL},
  {childID: "spring", mtl: SILVER_MTL},
];

loader.load(MODEL_PATH, function(gltf) {
  theModel = gltf.scene;

    theModel.traverse((o) => {
     if (o.isMesh) {
       o.castShadow = true;
       o.receiveShadow = false;
     }
    });
  
// Set the models initial scale   
  theModel.scale.set(2,2,2);
  theModel.rotation.y = Math.PI/2;

  // Offset the y position a bit
  theModel.position.y = -2;

  // Set initial textures
  for (let object of INITIAL_MAP) {
    initColor(theModel, object.childID, object.mtl);
  }

  // Add the model to the scene
  scene.add(theModel);

}, undefined, function(error) {
  console.error(error)
});

// Function - Add the textures to the models
function initColor(parent, type, mtl) {
  parent.traverse((o) => {
   if (o.isMesh) {
     if (o.name.includes(type)) {
          o.material = mtl;
          o.nameID = type; // Set a new property to identify this object
       }
   }
 });
}

// Add lights
var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.61 );
    hemiLight.position.set( 0, 50, 0 );
    // Add hemisphere light to scene   
    scene.add( hemiLight );

var dirLight = new THREE.DirectionalLight( 0xffffff, 0.54 );
    dirLight.position.set( -8, 12, 8 );
    dirLight.castShadow = true;
    dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
    // Add directional Light to scene    
    scene.add( dirLight );


// Floor
var floorGeometry = new THREE.PlaneGeometry(5000, 5000, 1, 1);
var floorMaterial = new THREE.MeshPhongMaterial({
  color: 0xeeeeee,
  shininess: 0
});

var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -0.5 * Math.PI;
floor.receiveShadow = true;
floor.position.y = -2;
scene.add(floor);

// Add controls
var controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.maxPolarAngle = Math.PI / 2;
controls.minPolarAngle = Math.PI / 3;
controls.enableDamping = true;
controls.enablePan = false;
controls.dampingFactor = 0.1;
controls.autoRotate = false; // Toggle this if you'd like the chair to automatically rotate
controls.autoRotateSpeed = 0.2; // 30

function animate() {
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
  
  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
}

animate();

// Function - New resizing method
function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  var width = window.innerWidth;
  var height = window.innerHeight;
  var canvasPixelWidth = canvas.width / window.devicePixelRatio;
  var canvasPixelHeight = canvas.height / window.devicePixelRatio;

  const needResize = canvasPixelWidth !== width || canvasPixelHeight !== height;
  if (needResize) {
    
    renderer.setSize(width, height, false);
  }
  return needResize;
}

// Function - Build Colors

function buildColors(colors) {
  for (let [i, color] of colors.entries()) {
    let swatch = document.createElement('div');
    swatch.classList.add('tray__swatch');

      swatch.style.background = "#" + color.color;

    swatch.setAttribute('data-key', i);
    TRAY.append(swatch);
  }
}

buildColors(colors);

// Swatches
const swatches = document.querySelectorAll(".tray__swatch");

for (const swatch of swatches) {
  swatch.addEventListener('click', selectSwatch);
}

function selectSwatch(color) {
     let new_mtl;

      new_mtl = new THREE.MeshPhongMaterial({
          color: parseInt('0x' + color.substring(1)),
          shininess: 10,
          side: THREE.DoubleSide
        });
    
    setMaterial(theModel, 'frame', new_mtl);
}


function setMaterial(parent, type, mtl) {
  parent.traverse((o) => {
   if (o.isMesh && o.nameID != null) {
     if (o.nameID == type) {
          o.material = mtl;
       }
   }
 });
}