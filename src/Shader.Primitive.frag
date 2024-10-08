in vec2 v_st;
in vec3 v_positionEC;
in vec3 v_normalEC;

float circle(in vec2 _st, in float _radius, in float blurRadius) {
    vec2 dist = _st- vec2(0.5);
    return 1.-smoothstep(_radius-(_radius * blurRadius),
                         _radius+(_radius * blurRadius),
                         dot(dist,dist) * 4.0
    );
}

float ring( vec2 st, float scale, float ringThickness, in float blurRadius) {

    float d1 = circle( st, scale, blurRadius );
    float d2 = circle( st, scale - ringThickness, blurRadius );

    return d1 * ( 1.0 - d2 );

}

void main()
{
    vec3 positionToEyeEC = -v_positionEC;
    vec3 normalEC = normalize(v_normalEC);
    czm_materialInput materialInput;
    materialInput.normalEC = normalEC;
    materialInput.positionToEyeEC = positionToEyeEC;
    materialInput.st = v_st;

    vec3 color = vec3(1.0 - texture(u_intexture, v_st).x);
    float r = ring(v_st - u_ringCenter, u_ringRadius, u_ringThickness, u_blurRadius);
    out_FragColor = vec4(color, r);
}