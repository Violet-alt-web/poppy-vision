/**
 * 罂粟智能识别 - 前端第三阶段
 *
 * 完整识别交互流程（Mock 版）：
 * 选择图片 → 点击开始识别 → loading → Mock 延迟 → 显示类别与置信度。
 * 暂不连接真实后端；后续按队长/后端最终确定的 API 契约替换 mockPredict。
 */
(function () {
  "use strict";

  // ---------- DOM 元素 ----------
  const elements = {
    imageInput: document.getElementById("imageInput"),
    selectImageButton: document.getElementById("selectImageButton"),
    previewEmpty: document.getElementById("previewEmpty"),
    previewImage: document.getElementById("previewImage"),
    startButton: document.getElementById("startButton"),
    loadingArea: document.getElementById("loadingArea"),
    errorArea: document.getElementById("errorArea"),
    errorMessage: document.getElementById("errorMessage"),
    resultLabel: document.getElementById("resultLabel"),
    resultClass: document.getElementById("resultClass"),
    resultConfidence: document.getElementById("resultConfidence"),
  };

  // ---------- 状态 ----------
  let currentObjectUrl = null;
  let hasValidImage = false;
  let isRecognizing = false;
  // 图片变更或识别时自增，用于丢弃过期请求的结果
  let recognizeGeneration = 0;

  // ---------- 类别与置信度 ----------
  const CLASS_NAMES = {
    poppy: "罂粟",
    non_poppy: "非罂粟",
  };

  function mapClassName(cls) {
    if (Object.prototype.hasOwnProperty.call(CLASS_NAMES, cls)) {
      return CLASS_NAMES[cls];
    }
    return cls ? String(cls) : "未知类别";
  }

  function formatConfidence(confidence) {
    const value = Number(confidence);
    if (!Number.isFinite(value)) {
      return "--";
    }
    return (value * 100).toFixed(1) + "%";
  }

  // ---------- 展示辅助 ----------
  function showError(message) {
    elements.errorMessage.textContent = message;
    elements.errorArea.hidden = false;
  }

  function hideError() {
    elements.errorArea.hidden = true;
  }

  function setLoading(loading) {
    elements.loadingArea.hidden = !loading;
    elements.startButton.disabled = loading || !hasValidImage;
  }

  function clearResult() {
    elements.resultLabel.textContent = "--";
    elements.resultClass.textContent = "--";
    elements.resultConfidence.textContent = "--";
  }

  function showResult(result) {
    elements.resultLabel.textContent = mapClassName(result.class);
    elements.resultClass.textContent = mapClassName(result.class);
    elements.resultConfidence.textContent = formatConfidence(result.confidence);
  }

  function showPreview(objectUrl) {
    elements.previewImage.src = objectUrl;
    elements.previewImage.hidden = false;
    elements.previewEmpty.hidden = true;
  }

  function releasePreview() {
    if (currentObjectUrl) {
      URL.revokeObjectURL(currentObjectUrl);
      currentObjectUrl = null;
    }
  }

  // ---------- Mock 识别 ----------
  // 暂定返回结构：{ class: "poppy", confidence: 0.942 }
  // 后续连接真实 FastAPI 时，按最终 API 契约替换本函数。
  function mockPredict(file) {
    // file 参数暂未使用，保留以对齐真实接口的调用方式
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve({ class: "poppy", confidence: 0.942 });
      }, 1000);
    });
  }

  // ---------- 事件处理 ----------
  function handleImageChange() {
    const file = elements.imageInput.files && elements.imageInput.files[0];

    // 取消选择：保留当前状态，不产生错误提示
    if (!file) {
      return;
    }

    // 基本类型校验：非图片文件不显示预览、不启用按钮
    if (!file.type.startsWith("image/")) {
      showError("请选择有效的图片文件");
      return;
    }

    // 新图片生效：使进行中的识别失效，并清除上一张图片的结果
    recognizeGeneration++;
    isRecognizing = false;
    hideError();
    clearResult();

    releasePreview();
    currentObjectUrl = URL.createObjectURL(file);
    showPreview(currentObjectUrl);

    hasValidImage = true;
    setLoading(false);
  }

  function handlePredict() {
    if (!hasValidImage || isRecognizing) {
      return;
    }

    const file = elements.imageInput.files && elements.imageInput.files[0];
    if (!file) {
      return;
    }

    isRecognizing = true;
    const generation = ++recognizeGeneration;

    clearResult();
    hideError();
    setLoading(true);

    mockPredict(file)
      .then(function (result) {
        if (generation !== recognizeGeneration) {
          return;
        }
        hideError();
        showResult(result);
      })
      .catch(function () {
        if (generation !== recognizeGeneration) {
          return;
        }
        showError("识别失败，请稍后重试");
      })
      .finally(function () {
        if (generation !== recognizeGeneration) {
          return;
        }
        isRecognizing = false;
        setLoading(false);
      });
  }

  function init() {
    // 初始状态：隐藏 loading、禁用开始识别按钮
    setLoading(false);

    elements.selectImageButton.addEventListener("click", function () {
      elements.imageInput.click();
    });

    elements.imageInput.addEventListener("change", handleImageChange);
    elements.startButton.addEventListener("click", handlePredict);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
