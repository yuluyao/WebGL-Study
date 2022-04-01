{
  let canvas = document.getElementById('canvas');
  let gl = initWebGLRenderingContext(canvas);


//【1】定义 shader source
  let vs_source = `
    attribute vec4 a_Position;
    attribute float a_PointSize;
    void main(){
        gl_Position = a_Position;
        gl_PointSize = a_PointSize;
    }`;
  let fs_source = `
    precision mediump float;
    uniform vec4 u_FragColor;
    void main(){
        gl_FragColor = u_FragColor;
    }`;


  initShader(gl, vs_source, fs_source);
  initVertexBuffer(gl);


  gl.clearColor(0.5, 0.5, 0.5, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.POINTS, 0, 1);
}


function initVertexBuffer(gl,) {
  let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  gl.vertexAttrib3f(a_Position, 0.5, 0.0, 0.0);

  let a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
  gl.vertexAttrib1f(a_PointSize, 40.0);

  let u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  gl.uniform4f(u_FragColor, 0.0, 0.6, 0.6, 1.0);
}
