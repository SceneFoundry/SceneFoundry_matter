//------------------------------------------------------------------------------
// HLSL Fragment Shader (Pixel Shader) equivalent
//------------------------------------------------------------------------------

// Texture and sampler
TextureCube skybox       : register(t0);
SamplerState samplerLinear : register(s0);

// Scene constant buffer (matches GlobalUbo in GLSL)
struct PointLight
{
    float4 position;
    float4 color;
};

cbuffer GlobalUbo : register(b0)
{
    float4x4 projection;
    float4x4 view;
    float4x4 invView;
    float4 ambientLightColor;
    float4 viewPos;
    PointLight pointLights[10];
    int numLights;
    int padding0;
    int padding1;
    int padding2; // padding to make struct size multiple of 16 bytes
};

// Pixel shader input
struct PS_INPUT
{
    float3 vDirection : TEXCOORD0;
};

// Pixel shader output
struct PS_OUTPUT
{
    float4 outColor : SV_TARGET;
};

PS_OUTPUT main(PS_INPUT input)
{
    PS_OUTPUT output;

    // Normalize direction
    float3 dir = normalize(input.vDirection);

    // Flip Y if needed (to match OpenGL coordinates)
    dir.y = -dir.y;

    // Sample skybox cubemap
    float3 color = skybox.Sample(samplerLinear, dir).rgb;

    output.outColor = float4(color, 1.0f);

    return output;
}
