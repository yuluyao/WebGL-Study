let canvas = document.getElementById('canvas');
let gl = canvas.getContext('webgl');


//【1】定义 shader source
let vs_source = `
    attribute vec4 a_Position;
    attribute float a_PointSize;
    void main(){
        gl_Position=a_Position;
        gl_PointSize=a_PointSize;
    }`;
let fs_source = `
    precision mediump float;
    uniform vec4 u_FragColor;
    void main(){
        gl_FragColor=u_FragColor;
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
let a_Position = gl.getAttribLocation(glProgram,'a_Position');
gl.vertexAttrib3f(a_Position, 0.5, 0.0, 0.0);

let a_PointSize = gl.getAttribLocation(glProgram, 'a_PointSize');
gl.vertexAttrib1f(a_PointSize, 40.0);

let u_FragColor = gl.getUniformLocation(glProgram, 'u_FragColor');
gl.uniform4f(u_FragColor, 0.0, 0.6, 0.6, 1.0);

gl.clearColor(0.5, 0.5, 0.5, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

gl.drawArrays(gl.POINTS, 0, 1);
