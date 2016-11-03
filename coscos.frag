#version 330 compatibility


uniform float uKa,uKd,uKs;
uniform vec4 uColor;
uniform vec4 uSpecularColor;
uniform float uShininess;
uniform sampler3D Noise3;
uniform float uNoiseAmp;
uniform float uNoiseFreq;
uniform bool uFlat;

in vec3 vNs;
in vec3 vLs;
in vec3 vEs;
flat in vec3 vLf;
flat in vec3 vNf;
flat in vec3 vEf;

in vec3 vMCposition;
in vec3 vST;

vec3
RotateNormal( float angx, float angy, vec3 n )
{
        float cx = cos( angx );
        float sx = sin( angx );
        float cy = cos( angy );
        float sy = sin( angy );

        // rotate about x:
        float yp =  n.y*cx - n.z*sx;    // y'
        n.z      =  n.y*sx + n.z*cx;    // z'
        n.y      =  yp;
        // n.x      =  n.x;

        // rotate about y:
        float xp =  n.x*cy + n.z*sy;    // x'
        n.z      = -n.x*sy + n.z*cy;    // z'
        n.x      =  xp;
        // n.y      =  n.y;

        return normalize( n );
}


void main( )
{	
	
	
	vec4 nvx = uNoiseAmp * texture3D(Noise3, uNoiseFreq * vMCposition);
	vec4 nvy = uNoiseAmp * texture3D(Noise3, uNoiseFreq * vec3(vMCposition.xy,vMCposition.z+0.5));
	float arg1 = nvx.r + nvx.b + nvx.g + nvx.a;
	arg1 -= 2;
	float arg2 = nvy.r + nvy.b + nvy.g + nvy.a;
	arg2 -= 2;
	
	
	vec3 Normal;
	vec3 Light;
	vec3 Eye;
	if( uFlat )
	{
		Normal = RotateNormal(arg1,arg2,vNf);
		Light = normalize(vLf);
		Eye = normalize(vEf);
	}
	
	else
	{
		Normal = RotateNormal(arg1,arg2,vNs);
		Light = normalize(vLs);
		Eye = normalize(vEs);
	}
	
	float d = max(dot(Normal,Light),0.);
	
	float s = 0.;
	
	if(dot(Normal,Light) > 0.)
	{
		vec3 ref = normalize(2. * Normal* dot(Normal,Light) - Light);
		s = pow(max(dot(Eye,ref),0.),uShininess);
	}

	vec4 specular = uKs * s * uSpecularColor;
	vec4 ambient = uKa *uColor;
	vec4 diffuse = uKd * d * uColor;
	gl_FragColor = vec4(ambient.rgb + diffuse.rgb + specular.rgb,1.);
	
	
}
