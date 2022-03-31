let canvas = document.getElementById('canvas');
let gl = canvas.getContext('webgl');


//【1】定义 shader source
let vs_source = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    varying vec4 v_Color;
    void main(){
        gl_Position = a_Position;
        v_Color = a_Color;
    }`;
let fs_source = `
    precision mediump float;
    varying vec4 v_Color;
    void main(){
        gl_FragColor = v_Color;
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
// 用缓冲区控制顶点
let vertices = new Float32Array([
  0.0, 0.5, 1.0, 0.0, 0.0,
  -0.5, -0.5, 0.0, 1.0, 0.0,
  0.5, -0.5, 0.0, 0.0, 1.0,
]);
let n = 3;//点的个数
let FSIZE = vertices.BYTES_PER_ELEMENT;

let vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);


let a_Position = gl.getAttribLocation(glProgram, 'a_Position');
gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 5 * FSIZE, 0);
gl.enableVertexAttribArray(a_Position);

let a_Color = gl.getAttribLocation(glProgram, 'a_Color');
gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 5 * FSIZE, 2 * FSIZE);
gl.enableVertexAttribArray(a_Color);

gl.bindBuffer(gl.ARRAY_BUFFER, null);


gl.clearColor(0.5, 0.5, 0.5, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

gl.drawArrays(gl.TRIANGLES, 0, n);
