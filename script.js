// ===============================
// 获取页面元素
// ===============================

// 测试区域
var testArea = document.getElementById("test-area");

// 结果显示文字
var result = document.getElementById("result");

// ===============================
// 定义全局变量
// ===============================

// 定时器编号
var timer = null;

// 记录变色开始时间
var startTime = 0;

// 当前游戏状态
// idle = 初始状态
// waiting = 等待变色
// ready = 已变色，可以点击
// done = 测试完成
// too-early = 点太早了
var gameState = "idle";

// ===============================
// 设置测试区域的状态和文字
// ===============================
function setAreaState(state, text) {
  // 先重置 class
  testArea.className = "test-area";

  // 再加上新的状态 class
  testArea.classList.add(state);

  // 修改圆圈里的文字
  testArea.textContent = text;
}

// ===============================
// 重置为初始状态
// ===============================
function resetGame() {
  // 清除旧定时器
  clearTimeout(timer);

  // 恢复变量
  timer = null;
  startTime = 0;
  gameState = "idle";

  // 恢复圆圈状态
  setAreaState("idle", "点击开始测试");

  // 恢复结果文字
  result.textContent = "准备好了吗？点击圆圈开始。";
}

// ===============================
// 开始测试
// ===============================
function startGame() {
  // 为了安全，先清掉旧定时器
  clearTimeout(timer);

  // 进入等待状态
  gameState = "waiting";

  // 更新圆圈显示
  setAreaState("waiting", "等待变色后再点击");

  // 更新提示文字
  result.textContent = "请集中注意力，颜色随时会变化...";

  // 随机等待 2000 到 5000 毫秒
  var delay = Math.floor(Math.random() * 3000) + 2000;

  // 到时间后变成可点击状态
  timer = setTimeout(function () {
    gameState = "ready";

    // 记录开始时间
    startTime = new Date().getTime();

    // 圆圈变色
    setAreaState("ready", "现在点击！");

    // 提示文字
    result.textContent = "快点击圆圈！";
  }, delay);
}

// ===============================
// 点击测试区域时执行
// ===============================
function handleAreaClick() {
  // 1. 初始状态：点击后开始测试
  if (gameState === "idle") {
    startGame();
    return;
  }

  // 2. 等待状态：说明点太早了
  if (gameState === "waiting") {
    clearTimeout(timer);

    gameState = "too-early";

    setAreaState("too-early", "点太早了！\n点击重新开始");
    result.textContent = "你点太早了，再点击圆圈会直接开始下一轮。";

    return;
  }

  // 3. 可点击状态：计算反应时间
  if (gameState === "ready") {
    var endTime = new Date().getTime();

    // 反应时间 = 点击时间 - 变色时间
    var reactionTime = endTime - startTime;

    gameState = "done";

    setAreaState("done", "测试完成！\n点击直接再来一次");
    result.textContent = "你的反应时间是 " + reactionTime + " 毫秒。";

    return;
  }

  // 4. 测试完成后：点击直接开始下一轮
  if (gameState === "done") {
    startGame();
    return;
  }

  // 5. 点太早后：点击直接开始下一轮
  if (gameState === "too-early") {
    startGame();
    return;
  }
}

// ===============================
// 绑定点击事件
// ===============================
testArea.addEventListener("click", handleAreaClick);

// ===============================
// 页面打开时初始化
// ===============================
resetGame();
