import * as BABYLON from 'babylonjs';
import { scene, assetsManager } from './globals';

const Sounds = {};

// put the Babylon name of the song as the key and the file name as the value
const soundFileNames = {
  'shotgunBlast': 'shotgunBlast.wav',
  'pain': 'pain.wav',
  'impDeath1': 'impDeath1.wav',
  'impDeath2': 'impDeath2.wav',
  'doomGuyInPain': 'doomguyinpain.wav',
  'fireball': 'fireball.wav',
  'chaingun': 'chaingun.wav',
  'd_e2m1': 'd_e2m1.mid',
  'sun': 'sun.mp3'
}

for(let name in soundFileNames) {
  Sounds[name] = new BABYLON.Sound(name, `sounds/${soundFileNames[name]}`, scene, {spatialSound: true});
  var tempPlayFunction = Sounds[name].play;
  Sounds[name].play = function(volume) {
    this.setVolume(volume);
    
    tempPlayFunction.call(this);
  }
}  



export default Sounds;