//THIS FILE IMPORTS OBJECTS FROM ALL THE OTHER FILES IN THIS FOLDER AND RENDERS THE SOLAR-SYSTEM SCENE YOU SEE ON THE HOME PAGE
var renderer, scene, camera,
    theEarthAndMoon,
    theEarth,
    theMoon; 


init();
animate();

function onWindowResize() {
   camera.aspect = window.innerWidth / window.innerHeight;
   camera.updateProjectionMatrix();
   renderer.setSize( window.innerWidth, window.innerHeight );
   render();
}

window.addEventListener( 'resize', onWindowResize, false );

function init() {


  // renderer - the space in which all the objects and the camera appears, this is 
  // re-rendered ~60x/second
  renderer = new THREE.WebGLRenderer( { clearColor: 0x000000, alpha: true } );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  $('#containerG').append( renderer.domElement );
//#containerG is the div in galaxy.html that the whole 3D scene is attached to

  // scene - contains all the planets, etc. 
  scene = new THREE.Scene();

  //camera
  //camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
 camera = new THREE.PerspectiveCamera( 20, window.innerWidth / window.innerHeight, 1, 5000 );
  camera.position.z = 150;
  //camera.position.z = 235;
  camera.position.y = 50;

  camera.lookAt(new THREE.Vector3(0,0,0));
   //camera stays fixed on the position occupied by the sun, can be modified with code on line 138 to follow a planet's orbit
  //Camera cannot follow objects (which include planets with their own moons), hence following Mars instead of Earth.


  // scene.add(theEarth); 
  scene.add(theEarthAndMoon);
  theEarthAndMoon.add(theEarth);
  theEarthAndMoon.add(cloudMesh);
  theEarthAndMoon.add(theMoon);

  var aLight = new THREE.AmbientLight( 0x112233 ); // soft white light

  var sunLight8 = new THREE.SpotLight(0xDDDDDD, 2);
  sunLight8.position.set(50, 0, 40);
  sunLight8.target = theEarthAndMoon;
  sunLight8.angle = .65;  
  sunLight8.distance = 200; 


  scene.add( aLight );
  scene.add( sunLight8 );

  const spotLightHelper = new THREE.SpotLightHelper( sunLight8 );
  //scene.add( spotLightHelper );
}

function animate() {

  requestAnimationFrame( animate ); //<-- superior to setInterval because animate stops on inactive tabs, so lighter and more battery friendly

  render();

}

//About the following: All of the below boils down to creating an orbit for each planet around the 0,0,0 position, 
//which is occupied by the Sun.  Each planet has it's own distance from the sun (radians) and it's own orbital speed
//we update the position of the planet based on it's orbital speed and by using Math.cos/Math.sin it's new position follows
// an elliptical pattern.  Decrement/Increment determines which direction it goes around the sun (clockwise, counterclockwise) 

function render() {

 // earthOrbitAngle += earthOrbitSpeed;
  

  var moonRadians = moonOrbitAngle * Math.PI / 180;
  

  //camera.lookAt(theMoon.position); 



   theEarthAndMoon.rotation.y += .001;
   //theEarthAndMoon.rotation.z -= .00002;

  // theEarth.rotation.y -= .01;
  // theEarth.rotation.z -= .00005;

  

  //run the Moon's orbit around the Earth
  moonOrbitAngle += moonOrbitSpeed;

  theMoon.position.y = Math.cos(moonRadians) * moonOrbitRadius;
  theMoon.position.z = Math.sin(moonRadians) * moonOrbitRadius;

  theMoon.rotation.y -= .005;
  theMoon.rotation.z -= .00002;

  cloudMesh.rotation.y -= .0002                                               ; 
  cloudMesh.rotation.z += .0001; 
  // render
  renderer.render( scene, camera );

}
