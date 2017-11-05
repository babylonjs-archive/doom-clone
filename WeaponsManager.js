import * as BABYLON from 'babylonjs';
import { scene, camera, cambox } from './globals';
import opts from './options';
import Sounds from './sounds';
import Utils from './utils';
import MonsterManager from './MonsterManager';
const { debug } = opts;
    // create the user interface including the gun


var WeaponsManager = {
  weapons: {},
  currentWeapon: null,
  init: function(assets) {
    this.materials = assets.materials;
    this.run();
  },
  run: function() {
    this.weapons['shotgun'] = this.initShotgun();
  },
  initShotgun: function() {
    var shotgun = {
      timer: 0,
      offset: 0,
      canShoot: true,
      animationFrame: [0,1,2,3,4,5,6,5,4],
      mesh: BABYLON.MeshBuilder.CreatePlane('weapon', {width: 1}, scene),
      shoot: function() {
        Sounds.shotgunBlast.play();
        this.timer = 55;
        var pickInfo = Utils.getCameraRayCastPickInfo();
        if(pickInfo.pickedMesh) {
          var decalSize = new BABYLON.Vector3(0.1, 0.1, 0.1);
          var decal = BABYLON.MeshBuilder.CreateDecal("decal", pickInfo.pickedMesh, {position: pickInfo.pickedPoint, normal: pickInfo.getNormal(true), size: decalSize});
          decal.material = WeaponsManager.materials.bulletHoleMaterial;
          if(pickInfo && pickInfo.pickedMesh && pickInfo.pickedMesh.name == 'imp') {
            // find the monster in the list, play the death animation, then dispose
            MonsterManager.list[pickInfo.pickedMesh.id].die();
            //MonsterManager.list[pickInfo.pickedMesh.id].sprite.dispose();
          }
        }

      },
      update: function() {
        if(this.timer > 0) {
          this.canShoot = false;
          this.timer--;
        }

        if(this.timer % 6 == 0) {
          this.mesh.material.diffuseTexture.uOffset = this.animationFrame[this.offset]/7;
          this.offset++;
        }

        if(this.timer == 0) {
          this.offset = 0;
          this.canShoot = true;
          this.mesh.material.diffuseTexture.uOffset = this.animationFrame[3]/7;
        }
      }
    }

    shotgun.mesh.material = this.materials.shotgunMaterial;
    shotgun.mesh.position.z += 2;
    shotgun.mesh.position.y -= 0.4;
    shotgun.mesh.isPickable = false;
    shotgun.mesh.parent = cambox;
    shotgun.mesh.material.hasAlpha = true;
    shotgun.mesh.material.alpha = 1;

    window.addEventListener('click', function(e) {
      if(shotgun.canShoot) {
        shotgun.shoot();
      }
    })

    return shotgun;
  }, 
  update: function() {
    for(let weaponName in this.weapons) {
      this.weapons[weaponName].update();
    }
  }
}

export default WeaponsManager;