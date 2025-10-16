//skybox_ibl.frag
#version 450 core
layout(set = 1, binding = 0) uniform samplerCube skybox;

layout(location = 0) in vec3 vDirection;
layout(location = 0) out vec4 outColor;

void main() {
    vec3 dir = normalize(vDirection);
    dir.y = -dir.y;
            // 1. Fetch HDR color (linear values, can be > 1.0)
    vec3 hdrColor = texture(skybox, dir).rgb;

    // 2. Apply tonemapping
    // Reinhard operator
    //vec3 mapped = hdrColor / (hdrColor + vec3(1.0));

    // Or ACES tonemap (nicer looking, optional):
    float a = 2.51;
    float b = 0.03;
    float c = 2.43;
    float d = 0.59;
    float e = 0.14;
    vec3 mapped = clamp((hdrColor*(a*hdrColor+b)) / (hdrColor*(c*hdrColor+d)+e), 0.0, 1.0);

    // 3. Gamma correction (convert from linear → sRGB)
    mapped = pow(mapped, vec3(1.0/2.2));

    outColor = vec4(mapped, 1.0);
}