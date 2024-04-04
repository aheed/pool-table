# Pool Table

Virtual pool table base on Three.js and physics.
Work in progress.

### To do


Try out physics engine
  https://threejs.org/docs/#manual/en/introduction/Libraries-and-Plugins

Get selected meshes from loaded model and turn into Cannon static bodies.
  For debug: also add copies of those meshes to the scene (change its color), move it up a bit. To make sure we got the right mesh.
Change table top from plane to trimesh.
Add plane at floor level. For balls jumping over the edge and perhaps bottomless pockets.
Cannon based pool balls with texture mapping

Use world coordinates only for table parts.
How to get convert BufferGeometry from Object3D with scale/position/rotation to BufferGeometry with 1:1 scale world coordinates?
  Do BufferGeometry methods change all vertices? yes*
     https://threejs.org/docs/#api/en/core/BufferGeometry
     Can be used to normalize scale?
       .applyMatrix4  does not do what we want: not same result as calling .applyMatrix4(transform) on the parent object3D.
Why is world matrix the same as local matrix for children of scene when the scene has been rotated/tranlated ??

Try next: pass translation, rotation and scale as separate params and use it to normalize buffergeometry.

?
Why is SketchUp053 not green?