let canvas = document.getElementById('canvas');
let gl = canvas.getContext('webgl');


//【1】定义 shader source
let vs_source = `
    attribute vec4 a_Position;
    void main(){
        gl_Position = a_Position;
        gl_PointSize = 20.0;
    }`;
let fs_source = `
    void main(){
        gl_FragColor = vec4(0.2, 0.8, 0.6, 1.0);
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
  0.0, 0.5,
  -0.5, -0.5,
  0.5, -0.5
]);
let vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

let a_Position = gl.getAttribLocation(glProgram, 'a_Position');
//将缓冲区对象分配给 a_Position 变量
gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
//连接 a_Position 变量与分配给它的缓冲区对象
gl.enableVertexAttribArray(a_Position);

// let a_PointSize = gl.getAttribLocation(glProgram, 'a_PointSize');
// gl.vertexAttrib1f(a_PointSize, 20.0);

// let u_FragColor = gl.getUniformLocation(glProgram, 'u_FragColor');
// gl.uniform4f(u_FragColor, 0.2, 0.8, 0.6, 1.0);


gl.clearColor(0.5, 0.5, 0.5, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

gl.drawArrays(gl.TRIANGLES, 0, 3);
