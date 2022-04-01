
// return WebGLRenderingContext
function initWebGLRenderingContext(canvas) {
  let gl = canvas.getContext('webgl');
  if (!gl) {
    console.log('init WebGLRenderingContext error!')
  }
  return gl;
}

// shader source -> shader obj
// gl program attach shader obj
function initShader(gl, vertex_shader_source, fragment_shader_source) {
  let vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertex_shader_source);
  gl.compileShader(vertexShader);

  let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragment_shader_source);
  gl.compileShader(fragmentShader);

  let glProgram = gl.createProgram();
  gl.attachShader(glProgram, vertexShader);
  gl.attachShader(glProgram, fragmentShader);
  gl.linkProgram(glProgram);
  gl.useProgram(glProgram);
  gl.program = glProgram;
}
