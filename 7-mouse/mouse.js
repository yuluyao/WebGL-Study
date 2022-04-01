//定义一个矩形体：混合构造函数原型模式
function Cuboid(minX, maxX, minY, maxY, minZ, maxZ) {
  this.minX = minX;
  this.maxX = maxX;
  this.minY = minY;
  this.maxY = maxY;
  this.minZ = minZ;
  this.maxZ = maxZ;
}

Cuboid.prototype = {
  constructor: Cuboid,
  CenterX: function () {
    return (this.minX + this.maxX) / 2.0;
  },
  CenterY: function () {
    return (this.minY + this.maxY) / 2.0;
  },
  CenterZ: function () {
    return (this.minZ + this.maxZ) / 2.0;
  },
  LengthX: function () {
    return (this.maxX - this.minX);
  },
  LengthY: function () {
    return (this.maxY - this.minY);
  }
}

let currentAngle = [35.0, 30.0];
let curScale = 1.0;

{
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


  initShader(gl, vs_source, fs_source);


  let cuboid = new Cuboid(399589.072, 400469.072, 3995118.062, 3997558.062, 732, 1268);
  let n = initVertexBuffer(gl, cuboid);

  initEventHandlers(canvas);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  let tick = function () {
    setMvpMatrix(gl, canvas, cuboid);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
    requestAnimationFrame(tick);
  };
  tick();
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);

}


function initVertexBuffer(gl, cuboid) {
  // Create a cube
  //    v6----- v5
  //   /|      /|
  //  v1------v0|
  //  | |     | |
  //  | |v7---|-|v4
  //  |/      |/
  //  v2------v3
  // 顶点坐标和颜色
  var verticesColors = new Float32Array([
    cuboid.maxX, cuboid.maxY, cuboid.maxZ, 1.0, 1.0, 1.0,  // v0 White
    cuboid.minX, cuboid.maxY, cuboid.maxZ, 1.0, 0.0, 1.0,  // v1 Magenta
    cuboid.minX, cuboid.minY, cuboid.maxZ, 1.0, 0.0, 0.0,  // v2 Red
    cuboid.maxX, cuboid.minY, cuboid.maxZ, 1.0, 1.0, 0.0,  // v3 Yellow
    cuboid.maxX, cuboid.minY, cuboid.minZ, 0.0, 1.0, 0.0,  // v4 Green
    cuboid.maxX, cuboid.maxY, cuboid.minZ, 0.0, 1.0, 1.0,  // v5 Cyan
    cuboid.minX, cuboid.maxY, cuboid.minZ, 0.0, 0.0, 1.0,  // v6 Blue
    cuboid.minX, cuboid.minY, cuboid.minZ, 1.0, 0.0, 1.0   // v7 Black
  ]);

  //顶点索引
  var indices = new Uint8Array([
    0, 1, 2, 0, 2, 3,    // 前
    0, 3, 4, 0, 4, 5,    // 右
    0, 5, 6, 0, 6, 1,    // 上
    1, 6, 7, 1, 7, 2,    // 左
    7, 4, 3, 7, 3, 2,    // 下
    4, 7, 6, 4, 6, 5     // 后
  ]);

  let FSIZE = verticesColors.BYTES_PER_ELEMENT;

  // 顶点数据写入缓冲
  let vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

  let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
  gl.enableVertexAttribArray(a_Position);
  let a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
  gl.enableVertexAttribArray(a_Color);

  // 将顶点索引写入到缓冲区对象
  let indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return indices.length;
}



function setMvpMatrix(gl, canvas, cuboid) {
  // 矩阵变换
  let u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  let modelMatrix = new Matrix4();
  modelMatrix.scale(curScale, curScale, curScale);
  modelMatrix.rotate(currentAngle[0], 1, 0, 0);
  modelMatrix.rotate(currentAngle[1], 0, 1, 0);
  modelMatrix.translate(-cuboid.CenterX(), -cuboid.CenterY(), -cuboid.CenterZ());
  let viewMatrix = new Matrix4();
  //计算lookAt()函数初始视点的高度
  let fovy = 60;
  let angle = fovy / 2 * Math.PI / 180.0;
  let eyeHight = (cuboid.LengthY() * 1.2) / 2.0 / angle;
  viewMatrix.lookAt(0, 0, eyeHight, 0, 0, 0, 0, 1, 0);
  let projMatrix = new Matrix4();
  projMatrix.setPerspective(fovy, canvas.width / canvas.height, 1, 10000);
  let mvpMatrix = new Matrix4();
  mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
}


function initEventHandlers(canvas) {
  var dragging = false;         // Dragging or not
  var lastX = -1, lastY = -1;   // Last position of the mouse

  //鼠标按下
  canvas.onmousedown = function (ev) {
    var x = ev.clientX;
    var y = ev.clientY;
    // Start dragging if a moue is in <canvas>
    var rect = ev.target.getBoundingClientRect();
    if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
      lastX = x;
      lastY = y;
      dragging = true;
    }
  };

  //鼠标离开时
  canvas.onmouseleave = function (ev) {
    dragging = false;
  };

  //鼠标释放
  canvas.onmouseup = function (ev) {
    dragging = false;
  };

  //鼠标移动
  canvas.onmousemove = function (ev) {
    var x = ev.clientX;
    var y = ev.clientY;
    if (dragging) {
      var factor = 100 / canvas.height; // The rotation ratio
      var dx = factor * (x - lastX);
      var dy = factor * (y - lastY);
      currentAngle[0] = currentAngle[0] + dy;
      currentAngle[1] = currentAngle[1] + dx;
    }
    lastX = x;
    lastY = y;
  };

  //鼠标缩放
  canvas.onmousewheel = function (event) {
    if (event.wheelDelta > 0) {
      curScale = curScale * 1.1;
    } else {
      curScale = curScale * 0.9;
    }
  };
}
