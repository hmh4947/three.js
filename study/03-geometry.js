import*as THREE from '../build/three.module.js';
import { OrbitControls } from "../examples/jsm/controls/OrbitControls.js"
import {GLTFLoader} from "../examples/jsm/loaders/GLTFLoader.js"

class App{
    constructor(){
    const divContainer=document.querySelector("#webgl-container");
    this._divContainer=divContainer;

    const renderer=new THREE.WebGLRenderer({ antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    divContainer.appendChild(renderer.domElement);

    this._renderer=renderer;

    const scene = new THREE.Scene();
    this._scene=scene;

    this._setupCamera();
    this._setupLight();
    this._setupModel(); //눈 
    this._setupModel2(); //볼
    this._setupBackground();
    this._setupControls();
  

    window.onresize= this.resize.bind(this);
    this.resize();

    requestAnimationFrame(this.render.bind(this));

    }
    _setupControls(){
        new OrbitControls(this._camera, this._divContainer);
    }
    _setupCamera(){
        const width= this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;
        const camera= new THREE.PerspectiveCamera(
           30,
            width/height,
            0.1,
            1000
        );
          
           camera.position.set(0,10,15);
            this._camera=camera;
            this._scene.add(this._camera);
    }
    _setupLight(){
        const color=0xFFDAB9;
        const intensity=10;
        const light=new THREE.DirectionalLight(color, intensity);
        light.position.set(0,5,15);
        this._scene.add(light);
       

    }
    
    _setupBackground(){
     //  this._scene.background=new THREE.Color("#9b59b6");
        const loader=new THREE.TextureLoader();
        
        loader.load("./Christmas.jpg",texture=>{
           this._scene.background=texture;
           

        });
    }
_setupModel(){  //snow ball
   
    const gltfLoader = new GLTFLoader();
    const url='scene.gltf';
    gltfLoader.load(
     url,
     (gltf)=>{
         const root = gltf.scene;
         this._scene.add(root);


         const audioLoader = new THREE.AudioLoader();
         audioLoader.load( "353-Starry-Night-FLiCo.mp3", ( buffer ) =>{
             const listener = new THREE.AudioListener();
             this._camera.add(listener);
 
             const audio=new THREE.PositionalAudio(listener);
             audio.setBuffer(buffer);
             audio.setLoop(true);
             audio.setVolume(5);
             root.add(audio);
             this._scene.add(root);
          
             window.onclick=()=>{
                 if(!audio.isPlaying) audio.play();
             };
             
         });




     }

    );
    /* Song : FLiCo - Starry Night
        Follow Artist : https://bit.ly/3qd5lol
        Music promoted by DayDreamSound : https://bit.ly/3yBg9mq*/
       
        //camera.add( listener );
        
        // create a global audio source
       
       
}

    _setupModel2(){ 
      
        new GLTFLoader().load("snowAni.glb",(gltf)=>{ //snow
            const model2=gltf.scene;
                

            model2.position.set(0,2,0);
            model2.scale.set(0.2,0.2,0.2);
          //  model.position.set(0,0,-200);
            this._scene.add(model2);
            this._setupAnimations2(gltf);




        });
        
        new GLTFLoader().load("GirlAni.glb",(gltf)=>{ //girl
                const model=gltf.scene;
                
               
                model.position.set(0.8,1,0.2);
               // model.position.set(0,0,-200);
                model.scale.set(0.01,0.01,0.01);
                this._scene.add(model);
                this._setupAnimations(gltf);
    
                
         });
       
    }
      
    
   
    ChangeAnimation(animationName){
        const previousAnimationAction=this._currentAnimationAction;
        this._currentAnimationAction=this._animationsMap[animationName];

        if(previousAnimationAction!==this._currentAnimationAction){
            previousAnimationAction.fadeOut(0.5);
            this._currentAnimationAction.reset().fadeIn(0.5).play();
        }
    }
     _setupAnimations(gltf) {
       
        const model = gltf.scene;
        const mixer = new THREE.AnimationMixer(model);
        const gltfAnimations = gltf.animations;
        const domControls = document.querySelector("#controls");
        const animationsMap = {};
        
        gltfAnimations.forEach(animationClip => {
            const name = animationClip.name;
            console.log(name);

            const domButton = document.createElement("div");
            domButton.classList.add("button");
            domButton.innerText = name;
            domControls.appendChild(domButton);

            domButton.addEventListener("click", () => {
                const animationName = domButton.innerHTML;
                this.ChangeAnimation(animationName);
            });

            const animationAction = mixer.clipAction(animationClip);
            animationsMap[name] = animationAction;
        });

        this._mixer = mixer;
        this._animationsMap = animationsMap;

        this._currentAnimationAction =  this._animationsMap["Idle"];
        this._currentAnimationAction.play();
        
    }
   
    ChangeAnimation2(animationName2){
        const previousAnimationAction2=this._currentAnimationAction2;
        this._currentAnimationAction2=this._animationsMap2[animationName2];

        if(previousAnimationAction2!==this._currentAnimationAction2){
            previousAnimationAction2.fadeOut(0.5);
            this._currentAnimationAction2.reset().fadeIn(0.5).play();
        }
    }
    
    _setupAnimations2(gltf) {
      
        const model2 = gltf.scene;
        const mixer2 = new THREE.AnimationMixer(model2);
        const gltfAnimations2 = gltf.animations;
        const domControls2 = document.querySelector("#controls");
        const animationsMap2 = {};
        
        gltfAnimations2.forEach(animationClip => {
            const name2 = animationClip.name;
            console.log(name2);

            const domButton2 = document.createElement("div");
            domButton2.classList.add("button2");
            domButton2.innerText = name2;
            domControls2.appendChild(domButton2);

            domButton2.addEventListener("click", () => {
                const animationName2 = domButton2.innerHTML;
                this.ChangeAnimation2(animationName2);
            });

            const animationAction2 = mixer2.clipAction(animationClip);
            animationsMap2[name2] = animationAction2;
        });

        this._mixer2 = mixer2;
        this._animationsMap2 = animationsMap2;

        this._currentAnimationAction2 =  this._animationsMap2["Snow"];
        this._currentAnimationAction2.play();
    }
    
    resize(){
        const width= this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;

        this._camera.aspect =width/height;
        this._camera.updateProjectionMatrix();
        
        this._renderer.setSize(width,height)
    }
   
    update(time){


        time*=0.001;
        
      
        if(this._mixer&&this._mixer2){
            const deltaTime=time-this._previousTime;
            this._mixer.update(deltaTime);
            this._mixer2.update(deltaTime);
       }
        this._previousTime=time;

    
        
    }
   
    render(time){
        this._renderer.render(this._scene, this._camera);
        this.update(time);
        requestAnimationFrame(this.render.bind(this));
       
    }
}




window.onload =function(){
    new App();
}