
function Mesh (info)
{
	Entity.call(this, createMesh(assets[info.meshName], info), assets[info.vertexShader || "mesh.vert"], assets[info.pixelShader || "texture.frag"], {
		u_texture: twgl.createTexture(gl, { src: info.textureSrc })
	});
}

Mesh.prototype = Object.create(Entity.prototype);
Mesh.prototype.constructor = Mesh;