#version 330 core

layout (location = 0) in vec3 aPos;
layout (location = 1) in vec3 aNormal;
layout (location = 2) in vec2 aTextureCoordinates;
layout (location = 3) in vec3 aTangent;
layout (location = 4) in vec3 aBitangent;

out vec2 textureCoordinates;
out vec3 worldCoordinates;
out vec3 tangent;
out vec3 bitangent;
out vec3 normal;


struct PointLight {
	vec4 position;
	vec4 color;
	};


// Must match the same binding point as in your C++ side using glBindBufferBase(GL_UNIFORM_BUFFER, 0, uboBuffer)
layout(std140) uniform GlobalUbo {
    mat4 projection;
    mat4 view;
    mat4 invView;
    vec4 ambientLightColor;
	 vec4 viewPos;
    PointLight pointLights[10];
    int numLights; // Needs to be padded to 16 bytes in std140 layout
    // Add padding to align to 16 bytes
    int padding1;
    int padding2;
    int padding3;
};

uniform mat4 modelMatrix;
uniform mat4 normalMatrix;           // inverse-transpose of model
//uniform mat4 view2;
//uniform mat4 projection2;

void main() {
	worldCoordinates = (modelMatrix * vec4(aPos, 1.0f)).xyz;
	gl_Position = projection * view * modelMatrix * vec4(aPos, 1.0f);
	textureCoordinates = aTextureCoordinates;

	mat3 mat3Normal = mat3(normalMatrix);

	tangent = normalize(mat3Normal * aTangent);
	bitangent = normalize(mat3Normal * aBitangent);
	normal = normalize(mat3Normal * aNormal);
}