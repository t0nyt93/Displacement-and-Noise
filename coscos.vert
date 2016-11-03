#version 330 compatibility


//Variables sent to the fragment shader
out vec4 vTexCoord;
out vec3 vMCposition;


out vec3 vNs;
out vec3 vLs;
out vec3 vEs;
flat out vec3 vNf,vEf,vLf;
uniform float uA;
uniform float uB;
uniform float uC;
uniform float uLightX;
uniform float uLightY;
uniform float uLightZ;

vec3 eyeLightPosition = vec3(uLightX,uLightY,uLightZ);


vec3 calcNorm()
{
vec3 curPosition = gl_Vertex.xyz;

float dzdx = -uA * uB * sin(uB*curPosition.x) * cos(uC*curPosition.y);
float dzdy = -uA * uC * cos(uB * curPosition.x) * sin(uC * curPosition.y);

vec3 Tx = vec3(1.,0.,dzdx);
vec3 Ty = vec3(0.,1.,dzdy);
vec3 temp = normalize(cross(Tx,Ty));

return temp;
}



void main( )
{
	//gl_Vertex.z = uA * cos(uB * gl_Vertex.x) * cos(uC * gl_Vertex.y);
	vec4 customVert = vec4(gl_Vertex.x,gl_Vertex.y,uA * cos(uB * gl_Vertex.x) * cos(uC * gl_Vertex.y),1.);
	vec4 ECposition = gl_ModelViewMatrix * customVert;
	
	vNf = calcNorm();
	vNs = vNf;
	vLf = eyeLightPosition - ECposition.xyz;
	vLs=vLf;
	vEf = vec3(0.,0.,0.) - ECposition.xyz;
	vEs = vEf;
	vTexCoord = gl_MultiTexCoord0;
	vMCposition = (gl_Vertex).xyz;
	
	//vec3 myVert = vec3(gl_Vertex.xy,(uA * cos(uB * gl_Vertex.x) * cos(uC * gl_Vertex.y)))

	gl_Position = gl_ModelViewProjectionMatrix * customVert;
}