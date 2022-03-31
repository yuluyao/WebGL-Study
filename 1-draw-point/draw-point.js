// 总流程：
// 定义 shader source
// shader source -> shader
// shader -> gl program
// use program

let canvas = document.getElementById('canvas');
let gl = canvas.getContext('webgl');


//【1】定义 shader source
let vs_source = `
    void main(){
        gl_Position=vec4(0.0, 0.5, 0.0, 1.0);
        gl_PointSize=20.0;
    }`;
let fs_source = `
    void main(){
        gl_FragColor=vec4(0.8, 0.0, 0.8, 1.0);
    }`;


//【2】shader source -> shader
let vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vs_source);
gl.compileShader(vertexShader);

let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fs_source);
gl.compileShader(fragmentShader);


//【3】shader -> WebGLProgram
let glProgram = gl.createProgram();

// 先 attach
gl.attachShader(glProgram, vertexShader);
gl.attachShader(glProgram, fragmentShader);

gl.linkProgram(glProgram);
gl.useProgram(glProgram);


//【4】控制着色器（shader），并绘制

// 2.清空屏幕
gl.clearColor(0.5, 0.5, 0.5, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

gl.drawArrays(gl.POINTS, 0, 1);
