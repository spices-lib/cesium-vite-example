in vec3 position3DHigh;
in vec3 position3DLow;
in float batchId;
in vec2 st;
in vec3 normal;

out vec2 v_st;
out vec3 v_positionEC;
out vec3 v_normalEC;

void main()
{
    v_st = st;
    vec4 p = czm_computePosition();
    v_positionEC = (czm_modelViewRelativeToEye * p).xyz;
    v_normalEC = czm_normal * normal;
    gl_Position = czm_modelViewProjectionRelativeToEye * p;
}