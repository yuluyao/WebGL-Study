{
  let canvas = document.getElementById('canvas');
  let gl = initWebGLRenderingContext(canvas);


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


  initShader(gl, vs_source, fs_source);
  let n = initVertexBuffer(gl);

  gl.clearColor(0.5, 0.5, 0.5, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, n);
}


function initVertexBuffer(gl) {
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

  let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
//将缓冲区对象分配给 a_Position 变量
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
//连接 a_Position 变量与分配给它的缓冲区对象
  gl.enableVertexAttribArray(a_Position);
  return 3;
}
