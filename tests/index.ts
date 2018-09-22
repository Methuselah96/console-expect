import {expect} from "chai";
import MockConsole from "../src/";

describe("Mock Console", function() {
  describe("Expectations", function() {
    let mockConsole = new MockConsole();

    afterEach("cleanup", () => {
      mockConsole.revert(true);
    });

    it("Throws when it expects one message but it had received another", function() {
      mockConsole.wrapConsole();

      expect(() => {
        console.log("one");
        mockConsole.expectLog("another");
      }).to.throw(`Log error, expected message:
> {"type":"log","arguments":["another"]}
But had received message:
> {"type":"log","arguments":["one"]}`);
    });

    it("Throws when it receives one message but it had expected another", function() {
      mockConsole.wrapConsole();

      expect(() => {
        mockConsole.expectLog("another");
        console.log("one");
      }).to.throw(`Log error, expected message:
> {"type":"log","arguments":["another"]}
But received message:
> {"type":"log","arguments":["one"]}`);
    });

    it("Throws when it receives messages but did not expect them", function() {
      mockConsole.wrapConsole();

      expect(() => {
        console.log("one", "two");
        console.warn("two", "three");
        console.error("three", "four");

        mockConsole.revert();
      }).to.throw(`Messages received but not expected:
0: {"type":"log","arguments":["one","two"]}
1: {"type":"warn","arguments":["two","three"]}
2: {"type":"error","arguments":["three","four"]}
`);
    });

    it("Throws when it expects messages but did not receive them", function() {
      mockConsole.wrapConsole();

      expect(() => {
        mockConsole.expectLog("one", "two");
        mockConsole.expectWarn("two", "three");
        mockConsole.expectError("three", "four");

        mockConsole.revert();
      }).to.throw(`Messages expected but not received:
0: {"type":"log","arguments":["one","two"]}
1: {"type":"warn","arguments":["two","three"]}
2: {"type":"error","arguments":["three","four"]}
`);
    });

    it("Throws when it expects one kind of message but received another", function() {
      mockConsole.wrapConsole();

      expect(() => {
        mockConsole.expectLog("one", "two");
        console.warn("one", "two");
      }).to.throw(`Log error, expected message:
> {"type":"log","arguments":["one","two"]}
But received message:
> {"type":"warn","arguments":["one","two"]}`);
    });

    it("Throws when it received one kind of message but expected another", function() {
      mockConsole.wrapConsole();

      expect(() => {
        console.warn("one", "two");
        mockConsole.expectLog("one", "two");
      }).to.throw(`Log error, expected message:
> {"type":"log","arguments":["one","two"]}
But had received message:
> {"type":"warn","arguments":["one","two"]}`);
    });

    it("Doesn't throw when it receives messages in allowed messages", function() {
      mockConsole.wrapConsole();

      expect(() => {
        mockConsole.allow({
          args: ["three"],
          match: (allowedMessage, receivedMessage) => (
            receivedMessage.type === allowedMessage.type
            && receivedMessage.args[0] === allowedMessage.args[0]
          ),
          type: "error",
        });
        console.log("one", "two");
        console.warn("two", "three");
        mockConsole.allow({
          args: ["one", "two"],
          type: "log",
        });
        console.error("three", "four");
        mockConsole.allow({
          args: ["two", "three"],
          type: "warn",
        });

        mockConsole.revert();
      }).to.not.throw();
    });

    it("Doesn't throw when it receives messages in allowed messages", function() {
      mockConsole.wrapConsole();

      expect(() => {
        mockConsole.expectLog("THREE.WebGLRenderer", "95");
        mockConsole.allow({
          args: ["THREE.WebGLShader: gl.getShaderInfoLog()"],
          match: (allowedMessage, receivedMessage) => (
            receivedMessage.type === allowedMessage.type
            && receivedMessage.args[0] === allowedMessage.args[0]
          ),
          type: "warn",
        });
        console.warn("THREE.WebGLShader: gl.getShaderInfoLog()","vertex","0:2(12): warning: extension `GL_ARB_gpu_shader5' unsupported in vertex shader\n","1: precision highp float;\n2: precision highp int;\n3: #define SHADER_NAME MeshLambertMaterial\n4: #define VERTEX_TEXTURES\n5: #define GAMMA_FACTOR 2\n6: #define MAX_BONES 0\n7: #define BONE_TEXTURE\n8: uniform mat4 modelMatrix;\n9: uniform mat4 modelViewMatrix;\n10: uniform mat4 projectionMatrix;\n11: uniform mat4 viewMatrix;\n12: uniform mat3 normalMatrix;\n13: uniform vec3 cameraPosition;\n14: attribute vec3 position;\n15: attribute vec3 normal;\n16: attribute vec2 uv;\n17: #ifdef USE_COLOR\n18: \tattribute vec3 color;\n19: #endif\n20: #ifdef USE_MORPHTARGETS\n21: \tattribute vec3 morphTarget0;\n22: \tattribute vec3 morphTarget1;\n23: \tattribute vec3 morphTarget2;\n24: \tattribute vec3 morphTarget3;\n25: \t#ifdef USE_MORPHNORMALS\n26: \t\tattribute vec3 morphNormal0;\n27: \t\tattribute vec3 morphNormal1;\n28: \t\tattribute vec3 morphNormal2;\n29: \t\tattribute vec3 morphNormal3;\n30: \t#else\n31: \t\tattribute vec3 morphTarget4;\n32: \t\tattribute vec3 morphTarget5;\n33: \t\tattribute vec3 morphTarget6;\n34: \t\tattribute vec3 morphTarget7;\n35: \t#endif\n36: #endif\n37: #ifdef USE_SKINNING\n38: \tattribute vec4 skinIndex;\n39: \tattribute vec4 skinWeight;\n40: #endif\n41: \n42: #define LAMBERT\n43: varying vec3 vLightFront;\n44: #ifdef DOUBLE_SIDED\n45: \tvarying vec3 vLightBack;\n46: #endif\n47: #define PI 3.14159265359\n48: #define PI2 6.28318530718\n49: #define PI_HALF 1.5707963267949\n50: #define RECIPROCAL_PI 0.31830988618\n51: #define RECIPROCAL_PI2 0.15915494\n52: #define LOG2 1.442695\n53: #define EPSILON 1e-6\n54: #define saturate(a) clamp( a, 0.0, 1.0 )\n55: #define whiteCompliment(a) ( 1.0 - saturate( a ) )\n56: float pow2( const in float x ) { return x*x; }\n57: float pow3( const in float x ) { return x*x*x; }\n58: float pow4( const in float x ) { float x2 = x*x; return x2*x2; }\n59: float average( const in vec3 color ) { return dot( color, vec3( 0.3333 ) ); }\n60: highp float rand( const in vec2 uv ) {\n61: \tconst highp float a = 12.9898, b = 78.233, c = 43758.5453;\n62: \thighp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );\n63: \treturn fract(sin(sn) * c);\n64: }\n65: struct IncidentLight {\n66: \tvec3 color;\n67: \tvec3 direction;\n68: \tbool visible;\n69: };\n70: struct ReflectedLight {\n71: \tvec3 directDiffuse;\n72: \tvec3 directSpecular;\n73: \tvec3 indirectDiffuse;\n74: \tvec3 indirectSpecular;\n75: };\n76: struct GeometricContext {\n77: \tvec3 position;\n78: \tvec3 normal;\n79: \tvec3 viewDir;\n80: };\n81: vec3 transformDirection( in vec3 dir, in mat4 matrix ) {\n82: \treturn normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );\n83: }\n84: vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {\n85: \treturn normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );\n86: }\n87: vec3 projectOnPlane(in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal ) {\n88: \tfloat distance = dot( planeNormal, point - pointOnPlane );\n89: \treturn - distance * planeNormal + point;\n90: }\n91: float sideOfPlane( in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal ) {\n92: \treturn sign( dot( point - pointOnPlane, planeNormal ) );\n93: }\n94: vec3 linePlaneIntersect( in vec3 pointOnLine, in vec3 lineDirection, in vec3 pointOnPlane, in vec3 planeNormal ) {\n95: \treturn lineDirection * ( dot( planeNormal, pointOnPlane - pointOnLine ) / dot( planeNormal, lineDirection ) ) + pointOnLine;\n96: }\n97: mat3 transposeMat3( const in mat3 m ) {\n98: \tmat3 tmp;\n99: \ttmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );\n100: \ttmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );\n101: \ttmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );\n102: \treturn tmp;\n103: }\n104: float linearToRelativeLuminance( const in vec3 color ) {\n105: \tvec3 weights = vec3( 0.2126, 0.7152, 0.0722 );\n106: \treturn dot( weights, color.rgb );\n107: }\n108: \n109: #if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP ) || defined( USE_EMISSIVEMAP ) || defined( USE_ROUGHNESSMAP ) || defined( USE_METALNESSMAP )\n110: \tvarying vec2 vUv;\n111: \tuniform mat3 uvTransform;\n112: #endif\n113: \n114: #if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )\n115: \tattribute vec2 uv2;\n116: \tvarying vec2 vUv2;\n117: #endif\n118: #ifdef USE_ENVMAP\n119: \t#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG )\n120: \t\tvarying vec3 vWorldPosition;\n121: \t#else\n122: \t\tvarying vec3 vReflect;\n123: \t\tuniform float refractionRatio;\n124: \t#endif\n125: #endif\n126: \n127: float punctualLightIntensityToIrradianceFactor( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {\n128: \tif( decayExponent > 0.0 ) {\n129: #if defined ( PHYSICALLY_CORRECT_LIGHTS )\n130: \t\tfloat distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );\n131: \t\tfloat maxDistanceCutoffFactor = pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );\n132: \t\treturn distanceFalloff * maxDistanceCutoffFactor;\n133: #else\n134: \t\treturn pow( saturate( -lightDistance / cutoffDistance + 1.0 ), decayExponent );\n135: #endif\n136: \t}\n137: \treturn 1.0;\n138: }\n139: vec3 BRDF_Diffuse_Lambert( const in vec3 diffuseColor ) {\n140: \treturn RECIPROCAL_PI * diffuseColor;\n141: }\n142: vec3 F_Schlick( const in vec3 specularColor, const in float dotLH ) {\n143: \tfloat fresnel = exp2( ( -5.55473 * dotLH - 6.98316 ) * dotLH );\n144: \treturn ( 1.0 - specularColor ) * fresnel + specularColor;\n145: }\n146: float G_GGX_Smith( const in float alpha, const in float dotNL, const in float dotNV ) {\n147: \tfloat a2 = pow2( alpha );\n148: \tfloat gl = dotNL + sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );\n149: \tfloat gv = dotNV + sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );\n150: \treturn 1.0 / ( gl * gv );\n151: }\n152: float G_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {\n153: \tfloat a2 = pow2( alpha );\n154: \tfloat gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );\n155: \tfloat gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );\n156: \treturn 0.5 / max( gv + gl, EPSILON );\n157: }\n158: float D_GGX( const in float alpha, const in float dotNH ) {\n159: \tfloat a2 = pow2( alpha );\n160: \tfloat denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;\n161: \treturn RECIPROCAL_PI * a2 / pow2( denom );\n162: }\n163: vec3 BRDF_Specular_GGX( const in IncidentLight incidentLight, const in GeometricContext geometry, const in vec3 specularColor, const in float roughness ) {\n164: \tfloat alpha = pow2( roughness );\n165: \tvec3 halfDir = normalize( incidentLight.direction + geometry.viewDir );\n166: \tfloat dotNL = saturate( dot( geometry.normal, incidentLight.direction ) );\n167: \tfloat dotNV = saturate( dot( geometry.normal, geometry.viewDir ) );\n168: \tfloat dotNH = saturate( dot( geometry.normal, halfDir ) );\n169: \tfloat dotLH = saturate( dot( incidentLight.direction, halfDir ) );\n170: \tvec3 F = F_Schlick( specularColor, dotLH );\n171: \tfloat G = G_GGX_SmithCorrelated( alpha, dotNL, dotNV );\n172: \tfloat D = D_GGX( alpha, dotNH );\n173: \treturn F * ( G * D );\n174: }\n175: vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {\n176: \tconst float LUT_SIZE  = 64.0;\n177: \tconst float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;\n178: \tconst float LUT_BIAS  = 0.5 / LUT_SIZE;\n179: \tfloat dotNV = saturate( dot( N, V ) );\n180: \tvec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );\n181: \tuv = uv * LUT_SCALE + LUT_BIAS;\n182: \treturn uv;\n183: }\n184: float LTC_ClippedSphereFormFactor( const in vec3 f ) {\n185: \tfloat l = length( f );\n186: \treturn max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );\n187: }\n188: vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {\n189: \tfloat x = dot( v1, v2 );\n190: \tfloat y = abs( x );\n191: \tfloat a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;\n192: \tfloat b = 3.4175940 + ( 4.1616724 + y ) * y;\n193: \tfloat v = a / b;\n194: \tfloat theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;\n195: \treturn cross( v1, v2 ) * theta_sintheta;\n196: }\n197: vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {\n198: \tvec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];\n199: \tvec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];\n200: \tvec3 lightNormal = cross( v1, v2 );\n201: \tif( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );\n202: \tvec3 T1, T2;\n203: \tT1 = normalize( V - N * dot( V, N ) );\n204: \tT2 = - cross( N, T1 );\n205: \tmat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );\n206: \tvec3 coords[ 4 ];\n207: \tcoords[ 0 ] = mat * ( rectCoords[ 0 ] - P );\n208: \tcoords[ 1 ] = mat * ( rectCoords[ 1 ] - P );\n209: \tcoords[ 2 ] = mat * ( rectCoords[ 2 ] - P );\n210: \tcoords[ 3 ] = mat * ( rectCoords[ 3 ] - P );\n211: \tcoords[ 0 ] = normalize( coords[ 0 ] );\n212: \tcoords[ 1 ] = normalize( coords[ 1 ] );\n213: \tcoords[ 2 ] = normalize( coords[ 2 ] );\n214: \tcoords[ 3 ] = normalize( coords[ 3 ] );\n215: \tvec3 vectorFormFactor = vec3( 0.0 );\n216: \tvectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );\n217: \tvectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );\n218: \tvectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );\n219: \tvectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );\n220: \tfloat result = LTC_ClippedSphereFormFactor( vectorFormFactor );\n221: \treturn vec3( result );\n222: }\n223: vec3 BRDF_Specular_GGX_Environment( const in GeometricContext geometry, const in vec3 specularColor, const in float roughness ) {\n224: \tfloat dotNV = saturate( dot( geometry.normal, geometry.viewDir ) );\n225: \tconst vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );\n226: \tconst vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );\n227: \tvec4 r = roughness * c0 + c1;\n228: \tfloat a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;\n229: \tvec2 AB = vec2( -1.04, 1.04 ) * a004 + r.zw;\n230: \treturn specularColor * AB.x + AB.y;\n231: }\n232: float G_BlinnPhong_Implicit( ) {\n233: \treturn 0.25;\n234: }\n235: float D_BlinnPhong( const in float shininess, const in float dotNH ) {\n236: \treturn RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );\n237: }\n238: vec3 BRDF_Specular_BlinnPhong( const in IncidentLight incidentLight, const in GeometricContext geometry, const in vec3 specularColor, const in float shininess ) {\n239: \tvec3 halfDir = normalize( incidentLight.direction + geometry.viewDir );\n240: \tfloat dotNH = saturate( dot( geometry.normal, halfDir ) );\n241: \tfloat dotLH = saturate( dot( incidentLight.direction, halfDir ) );\n242: \tvec3 F = F_Schlick( specularColor, dotLH );\n243: \tfloat G = G_BlinnPhong_Implicit( );\n244: \tfloat D = D_BlinnPhong( shininess, dotNH );\n245: \treturn F * ( G * D );\n246: }\n247: float GGXRoughnessToBlinnExponent( const in float ggxRoughness ) {\n248: \treturn ( 2.0 / pow2( ggxRoughness + 0.0001 ) - 2.0 );\n249: }\n250: float BlinnExponentToGGXRoughness( const in float blinnExponent ) {\n251: \treturn sqrt( 2.0 / ( blinnExponent + 2.0 ) );\n252: }\n253: \n254: uniform vec3 ambientLightColor;\n255: vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {\n256: \tvec3 irradiance = ambientLightColor;\n257: \t#ifndef PHYSICALLY_CORRECT_LIGHTS\n258: \t\tirradiance *= PI;\n259: \t#endif\n260: \treturn irradiance;\n261: }\n262: #if 0 > 0\n263: \tstruct DirectionalLight {\n264: \t\tvec3 direction;\n265: \t\tvec3 color;\n266: \t\tint shadow;\n267: \t\tfloat shadowBias;\n268: \t\tfloat shadowRadius;\n269: \t\tvec2 shadowMapSize;\n270: \t};\n271: \tuniform DirectionalLight directionalLights[ 0 ];\n272: \tvoid getDirectionalDirectLightIrradiance( const in DirectionalLight directionalLight, const in GeometricContext geometry, out IncidentLight directLight ) {\n273: \t\tdirectLight.color = directionalLight.color;\n274: \t\tdirectLight.direction = directionalLight.direction;\n275: \t\tdirectLight.visible = true;\n276: \t}\n277: #endif\n278: #if 0 > 0\n279: \tstruct PointLight {\n280: \t\tvec3 position;\n281: \t\tvec3 color;\n282: \t\tfloat distance;\n283: \t\tfloat decay;\n284: \t\tint shadow;\n285: \t\tfloat shadowBias;\n286: \t\tfloat shadowRadius;\n287: \t\tvec2 shadowMapSize;\n288: \t\tfloat shadowCameraNear;\n289: \t\tfloat shadowCameraFar;\n290: \t};\n291: \tuniform PointLight pointLights[ 0 ];\n292: \tvoid getPointDirectLightIrradiance( const in PointLight pointLight, const in GeometricContext geometry, out IncidentLight directLight ) {\n293: \t\tvec3 lVector = pointLight.position - geometry.position;\n294: \t\tdirectLight.direction = normalize( lVector );\n295: \t\tfloat lightDistance = length( lVector );\n296: \t\tdirectLight.color = pointLight.color;\n297: \t\tdirectLight.color *= punctualLightIntensityToIrradianceFactor( lightDistance, pointLight.distance, pointLight.decay );\n298: \t\tdirectLight.visible = ( directLight.color != vec3( 0.0 ) );\n299: \t}\n300: #endif\n301: #if 0 > 0\n302: \tstruct SpotLight {\n303: \t\tvec3 position;\n304: \t\tvec3 direction;\n305: \t\tvec3 color;\n306: \t\tfloat distance;\n307: \t\tfloat decay;\n308: \t\tfloat coneCos;\n309: \t\tfloat penumbraCos;\n310: \t\tint shadow;\n311: \t\tfloat shadowBias;\n312: \t\tfloat shadowRadius;\n313: \t\tvec2 shadowMapSize;\n314: \t};\n315: \tuniform SpotLight spotLights[ 0 ];\n316: \tvoid getSpotDirectLightIrradiance( const in SpotLight spotLight, const in GeometricContext geometry, out IncidentLight directLight  ) {\n317: \t\tvec3 lVector = spotLight.position - geometry.position;\n318: \t\tdirectLight.direction = normalize( lVector );\n319: \t\tfloat lightDistance = length( lVector );\n320: \t\tfloat angleCos = dot( directLight.direction, spotLight.direction );\n321: \t\tif ( angleCos > spotLight.coneCos ) {\n322: \t\t\tfloat spotEffect = smoothstep( spotLight.coneCos, spotLight.penumbraCos, angleCos );\n323: \t\t\tdirectLight.color = spotLight.color;\n324: \t\t\tdirectLight.color *= spotEffect * punctualLightIntensityToIrradianceFactor( lightDistance, spotLight.distance, spotLight.decay );\n325: \t\t\tdirectLight.visible = true;\n326: \t\t} else {\n327: \t\t\tdirectLight.color = vec3( 0.0 );\n328: \t\t\tdirectLight.visible = false;\n329: \t\t}\n330: \t}\n331: #endif\n332: #if 0 > 0\n333: \tstruct RectAreaLight {\n334: \t\tvec3 color;\n335: \t\tvec3 position;\n336: \t\tvec3 halfWidth;\n337: \t\tvec3 halfHeight;\n338: \t};\n339: \tuniform sampler2D ltc_1;\tuniform sampler2D ltc_2;\n340: \tuniform RectAreaLight rectAreaLights[ 0 ];\n341: #endif\n342: #if 0 > 0\n343: \tstruct HemisphereLight {\n344: \t\tvec3 direction;\n345: \t\tvec3 skyColor;\n346: \t\tvec3 groundColor;\n347: \t};\n348: \tuniform HemisphereLight hemisphereLights[ 0 ];\n349: \tvec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in GeometricContext geometry ) {\n350: \t\tfloat dotNL = dot( geometry.normal, hemiLight.direction );\n351: \t\tfloat hemiDiffuseWeight = 0.5 * dotNL + 0.5;\n352: \t\tvec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );\n353: \t\t#ifndef PHYSICALLY_CORRECT_LIGHTS\n354: \t\t\tirradiance *= PI;\n355: \t\t#endif\n356: \t\treturn irradiance;\n357: \t}\n358: #endif\n359: \n360: #ifdef USE_COLOR\n361: \tvarying vec3 vColor;\n362: #endif\n363: #ifdef USE_FOG\n364:   varying float fogDepth;\n365: #endif\n366: \n367: #ifdef USE_MORPHTARGETS\n368: \t#ifndef USE_MORPHNORMALS\n369: \tuniform float morphTargetInfluences[ 8 ];\n370: \t#else\n371: \tuniform float morphTargetInfluences[ 4 ];\n372: \t#endif\n373: #endif\n374: #ifdef USE_SKINNING\n375: \tuniform mat4 bindMatrix;\n376: \tuniform mat4 bindMatrixInverse;\n377: \t#ifdef BONE_TEXTURE\n378: \t\tuniform sampler2D boneTexture;\n379: \t\tuniform int boneTextureSize;\n380: \t\tmat4 getBoneMatrix( const in float i ) {\n381: \t\t\tfloat j = i * 4.0;\n382: \t\t\tfloat x = mod( j, float( boneTextureSize ) );\n383: \t\t\tfloat y = floor( j / float( boneTextureSize ) );\n384: \t\t\tfloat dx = 1.0 / float( boneTextureSize );\n385: \t\t\tfloat dy = 1.0 / float( boneTextureSize );\n386: \t\t\ty = dy * ( y + 0.5 );\n387: \t\t\tvec4 v1 = texture2D( boneTexture, vec2( dx * ( x + 0.5 ), y ) );\n388: \t\t\tvec4 v2 = texture2D( boneTexture, vec2( dx * ( x + 1.5 ), y ) );\n389: \t\t\tvec4 v3 = texture2D( boneTexture, vec2( dx * ( x + 2.5 ), y ) );\n390: \t\t\tvec4 v4 = texture2D( boneTexture, vec2( dx * ( x + 3.5 ), y ) );\n391: \t\t\tmat4 bone = mat4( v1, v2, v3, v4 );\n392: \t\t\treturn bone;\n393: \t\t}\n394: \t#else\n395: \t\tuniform mat4 boneMatrices[ MAX_BONES ];\n396: \t\tmat4 getBoneMatrix( const in float i ) {\n397: \t\t\tmat4 bone = boneMatrices[ int(i) ];\n398: \t\t\treturn bone;\n399: \t\t}\n400: \t#endif\n401: #endif\n402: \n403: #ifdef USE_SHADOWMAP\n404: \t#if 0 > 0\n405: \t\tuniform mat4 directionalShadowMatrix[ 0 ];\n406: \t\tvarying vec4 vDirectionalShadowCoord[ 0 ];\n407: \t#endif\n408: \t#if 0 > 0\n409: \t\tuniform mat4 spotShadowMatrix[ 0 ];\n410: \t\tvarying vec4 vSpotShadowCoord[ 0 ];\n411: \t#endif\n412: \t#if 0 > 0\n413: \t\tuniform mat4 pointShadowMatrix[ 0 ];\n414: \t\tvarying vec4 vPointShadowCoord[ 0 ];\n415: \t#endif\n416: #endif\n417: \n418: #ifdef USE_LOGDEPTHBUF\n419: \t#ifdef USE_LOGDEPTHBUF_EXT\n420: \t\tvarying float vFragDepth;\n421: \t#endif\n422: \tuniform float logDepthBufFC;\n423: #endif\n424: #if 0 > 0 && ! defined( PHYSICAL ) && ! defined( PHONG )\n425: \tvarying vec3 vViewPosition;\n426: #endif\n427: \n428: void main() {\n429: #if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP ) || defined( USE_EMISSIVEMAP ) || defined( USE_ROUGHNESSMAP ) || defined( USE_METALNESSMAP )\n430: \tvUv = ( uvTransform * vec3( uv, 1 ) ).xy;\n431: #endif\n432: #if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )\n433: \tvUv2 = uv2;\n434: #endif\n435: #ifdef USE_COLOR\n436: \tvColor.xyz = color.xyz;\n437: #endif\n438: \n439: vec3 objectNormal = vec3( normal );\n440: \n441: #ifdef USE_MORPHNORMALS\n442: \tobjectNormal += ( morphNormal0 - normal ) * morphTargetInfluences[ 0 ];\n443: \tobjectNormal += ( morphNormal1 - normal ) * morphTargetInfluences[ 1 ];\n444: \tobjectNormal += ( morphNormal2 - normal ) * morphTargetInfluences[ 2 ];\n445: \tobjectNormal += ( morphNormal3 - normal ) * morphTargetInfluences[ 3 ];\n446: #endif\n447: \n448: #ifdef USE_SKINNING\n449: \tmat4 boneMatX = getBoneMatrix( skinIndex.x );\n450: \tmat4 boneMatY = getBoneMatrix( skinIndex.y );\n451: \tmat4 boneMatZ = getBoneMatrix( skinIndex.z );\n452: \tmat4 boneMatW = getBoneMatrix( skinIndex.w );\n453: #endif\n454: #ifdef USE_SKINNING\n455: \tmat4 skinMatrix = mat4( 0.0 );\n456: \tskinMatrix += skinWeight.x * boneMatX;\n457: \tskinMatrix += skinWeight.y * boneMatY;\n458: \tskinMatrix += skinWeight.z * boneMatZ;\n459: \tskinMatrix += skinWeight.w * boneMatW;\n460: \tskinMatrix  = bindMatrixInverse * skinMatrix * bindMatrix;\n461: \tobjectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;\n462: #endif\n463: \n464: vec3 transformedNormal = normalMatrix * objectNormal;\n465: #ifdef FLIP_SIDED\n466: \ttransformedNormal = - transformedNormal;\n467: #endif\n468: \n469: \n470: vec3 transformed = vec3( position );\n471: \n472: #ifdef USE_MORPHTARGETS\n473: \ttransformed += ( morphTarget0 - position ) * morphTargetInfluences[ 0 ];\n474: \ttransformed += ( morphTarget1 - position ) * morphTargetInfluences[ 1 ];\n475: \ttransformed += ( morphTarget2 - position ) * morphTargetInfluences[ 2 ];\n476: \ttransformed += ( morphTarget3 - position ) * morphTargetInfluences[ 3 ];\n477: \t#ifndef USE_MORPHNORMALS\n478: \ttransformed += ( morphTarget4 - position ) * morphTargetInfluences[ 4 ];\n479: \ttransformed += ( morphTarget5 - position ) * morphTargetInfluences[ 5 ];\n480: \ttransformed += ( morphTarget6 - position ) * morphTargetInfluences[ 6 ];\n481: \ttransformed += ( morphTarget7 - position ) * morphTargetInfluences[ 7 ];\n482: \t#endif\n483: #endif\n484: \n485: #ifdef USE_SKINNING\n486: \tvec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );\n487: \tvec4 skinned = vec4( 0.0 );\n488: \tskinned += boneMatX * skinVertex * skinWeight.x;\n489: \tskinned += boneMatY * skinVertex * skinWeight.y;\n490: \tskinned += boneMatZ * skinVertex * skinWeight.z;\n491: \tskinned += boneMatW * skinVertex * skinWeight.w;\n492: \ttransformed = ( bindMatrixInverse * skinned ).xyz;\n493: #endif\n494: \n495: vec4 mvPosition = modelViewMatrix * vec4( transformed, 1.0 );\n496: gl_Position = projectionMatrix * mvPosition;\n497: \n498: #ifdef USE_LOGDEPTHBUF\n499: \t#ifdef USE_LOGDEPTHBUF_EXT\n500: \t\tvFragDepth = 1.0 + gl_Position.w;\n501: \t#else\n502: \t\tgl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;\n503: \t\tgl_Position.z *= gl_Position.w;\n504: \t#endif\n505: #endif\n506: \n507: #if 0 > 0 && ! defined( PHYSICAL ) && ! defined( PHONG )\n508: \tvViewPosition = - mvPosition.xyz;\n509: #endif\n510: \n511: #if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP )\n512: \tvec4 worldPosition = modelMatrix * vec4( transformed, 1.0 );\n513: #endif\n514: \n515: #ifdef USE_ENVMAP\n516: \t#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG )\n517: \t\tvWorldPosition = worldPosition.xyz;\n518: \t#else\n519: \t\tvec3 cameraToVertex = normalize( worldPosition.xyz - cameraPosition );\n520: \t\tvec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );\n521: \t\t#ifdef ENVMAP_MODE_REFLECTION\n522: \t\t\tvReflect = reflect( cameraToVertex, worldNormal );\n523: \t\t#else\n524: \t\t\tvReflect = refract( cameraToVertex, worldNormal, refractionRatio );\n525: \t\t#endif\n526: \t#endif\n527: #endif\n528: \n529: vec3 diffuse = vec3( 1.0 );\n530: GeometricContext geometry;\n531: geometry.position = mvPosition.xyz;\n532: geometry.normal = normalize( transformedNormal );\n533: geometry.viewDir = normalize( -mvPosition.xyz );\n534: GeometricContext backGeometry;\n535: backGeometry.position = geometry.position;\n536: backGeometry.normal = -geometry.normal;\n537: backGeometry.viewDir = geometry.viewDir;\n538: vLightFront = vec3( 0.0 );\n539: #ifdef DOUBLE_SIDED\n540: \tvLightBack = vec3( 0.0 );\n541: #endif\n542: IncidentLight directLight;\n543: float dotNL;\n544: vec3 directLightColor_Diffuse;\n545: #if 0 > 0\n546: \t\n547: #endif\n548: #if 0 > 0\n549: \t\n550: #endif\n551: #if 0 > 0\n552: \t\n553: #endif\n554: #if 0 > 0\n555: \t\n556: #endif\n557: \n558: #ifdef USE_SHADOWMAP\n559: \t#if 0 > 0\n560: \t\n561: \t#endif\n562: \t#if 0 > 0\n563: \t\n564: \t#endif\n565: \t#if 0 > 0\n566: \t\n567: \t#endif\n568: #endif\n569: \n570: \n571: #ifdef USE_FOG\n572: fogDepth = -mvPosition.z;\n573: #endif\n574: }\n575: ")
        console.log("THREE.WebGLRenderer", "95");
        mockConsole.revert();
      }).to.not.throw();
    });
  });

  describe("events", () => {
    let mockConsole = new MockConsole();

    afterEach("cleanup", () => {
      mockConsole.revert(true);
    });

    it("Emits an empty event when the expected messages have been received", () => {
      let called = false;

      mockConsole.wrapConsole();

      mockConsole.onceEmpty(() => {
        called = true;
      });

      expect(called, "Callback should have been called on an empty console").to.be.true;
    });

    it("Does not emit an empty event when there are messages to be expected", () => {
      let called = false;

      mockConsole.wrapConsole();

      console.log("!");

      mockConsole.onceEmpty(() => {
        called = true;
      });

      expect(called, "Callback should not have been called").to.be.false;

      mockConsole.expectLog("!");
    });

    it("Does not emit an empty event when there are messages to be received", () => {
      let called = false;

      mockConsole.wrapConsole();

      mockConsole.expectLog("!");

      mockConsole.onceEmpty(() => {
        called = true;
      });

      expect(called, "Callback should not have been called").to.be.false;
    });

    it("Does emit an empty event when the received messages have been expected", () => {
      let called = false;

      mockConsole.wrapConsole();

      console.log("!");

      mockConsole.onceEmpty(() => {
        called = true;
      });

      expect(called, "Callback should not have been called").to.be.false;

      mockConsole.expectLog("!");

      expect(called, "Callback should have been called").to.be.true;
    });

    // TODO go through the expectations and fill them in

    it("Does emit an empty event when the expected messages have been received", () => {
      let called = false;

      mockConsole.wrapConsole();

      mockConsole.expectLog("a");
      mockConsole.expectLog("b");
      mockConsole.expectWarn("c");

      mockConsole.onceEmpty(() => {
        called = true;
      });

      console.log("a");
      console.log("b");

      expect(called, "Callback should not have been called before all messages are received").to.be.false;

      console.warn("c");

      expect(called, "Callback should have been called").to.be.true;
    });
  });
});
