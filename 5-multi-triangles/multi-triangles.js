let canvas = document.getElementById('canvas');
let gl = canvas.getContext('webgl');

//【1】定义 shader source
let vs_source = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    uniform mat4 u_MvpMatrix;
    varying vec4 v_Color;
    void main(){
        gl_Position = u_MvpMatrix * a_Position;
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


// 顶点坐标和颜色
let verticesColors = new Float32Array([
  0.0, 1.0, -4.0, 0.4, 1.0, 0.4,  //绿色在后
  -0.5, -1.0, -4.0, 0.4, 1.0, 0.4,
  0.5, -1.0, -4.0, 1.0, 0.4, 0.4,

  0.0, 1.0, -2.0, 1.0, 1.0, 0.4, //黄色在中
  -0.5, -1.0, -2.0, 1.0, 1.0, 0.4,
  0.5, -1.0, -2.0, 1.0, 0.4, 0.4,

  0.0, 1.0, 0.0, 0.4, 0.4, 1.0,  //蓝色在前
  -0.5, -1.0, 0.0, 0.4, 0.4, 1.0,
  0.5, -1.0, 0.0, 1.0, 0.4, 0.4,
]);

let n = 9;
let FSIZE = verticesColors.BYTES_PER_ELEMENT;

// 顶点数据写入缓冲
let vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

let a_Position = gl.getAttribLocation(glProgram, 'a_Position');
gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
gl.enableVertexAttribArray(a_Position);
let a_Color = gl.getAttribLocation(glProgram, 'a_Color');
gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
gl.enableVertexAttribArray(a_Color);

gl.bindBuffer(gl.ARRAY_BUFFER, null);


// 矩阵变换
let u_MvpMatrix = gl.getUniformLocation(glProgram, 'u_MvpMatrix');
let modelMatrix = new Matrix4();
modelMatrix.setTranslate(0.75, 0, 0);
let viewMatrix = new Matrix4();
viewMatrix.setLookAt(0, 0, 5, 0, 0, -50, 0, 1, 0);
let projMatrix = new Matrix4();
projMatrix.setPerspective(30, canvas.width / canvas.height, 1, 50);
let mvpMatrix = new Matrix4();
mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

// 绘制
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.enable(gl.DEPTH_TEST);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
gl.drawArrays(gl.TRIANGLES, 0, n);

