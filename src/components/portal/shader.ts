// Adapted from the Sanity Machine hero. The hole is now see-through outside its edge,
// so the live page shows around it instead of a painted copy.
export const POINTS = 14;

export const VERTEX = "attribute vec2 a;varying vec2 v;void main(){v=a*.5+.5;gl_Position=vec4(a,0.,1.);}";

export const FRAGMENT = `precision highp float;
uniform sampler2D B;
uniform vec2 R;
uniform float T, O, F, S, H;
uniform vec2 P[${POINTS}];
varying vec2 v;
float n(vec2 p){return sin(p.x*3.1+T*.7)*sin(p.y*2.7-T*.5)+.5*sin(p.x*7.3-T)*sin(p.y*6.1+T*.9);}
float g(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233))+T)*43758.5453);}
void main(){
  vec2 a=vec2(R.x/R.y,1.);
  vec2 q=v*a+.04*vec2(n(v*3.),n(v*3.+4.));
  float base=min(a.x,1.)*(.11+H*.17)*S;
  float f=0.;
  for(int i=0;i<${POINTS};i++){
    float r=base*(1.-float(i)/${(POINTS + 3).toFixed(1)});
    vec2 d=q-P[i]*a;
    f+=r*r/(dot(d,d)+.0005);
  }
  f*=.3;
  f+=F*F*7.*(.72+.28*n(v*2.));
  float m=smoothstep(.97,1.03,f);
  float band=smoothstep(.55,1.,f)*(1.-smoothstep(1.,1.7,f));
  vec2 dir=normalize(q-P[0]*a+.0001);
  vec2 ub=v-vec2(0.,O)+vec2(sin(v.y*26.+T*2.2)*.004,cos(v.x*19.-T*1.7)*.004)-dir*band*.06/a;
  float ab=.001+band*.005;
  vec3 c=vec3(texture2D(B,ub+vec2(ab,0.)).r,texture2D(B,ub).g,texture2D(B,ub-vec2(ab,0.)).b);
  c+=(g(v*R)-.5)*.03;
  float rim=smoothstep(.9,.97,f)*(1.-smoothstep(1.03,1.1,f));
  c=mix(c,vec3(.031),rim);
  float alpha=max(m,rim);
  gl_FragColor=vec4(c*alpha,alpha);
}`;
