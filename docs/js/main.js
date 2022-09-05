import { editor, editorDiv } from './modules/cmEditor.bundle.js';
import {
  Fragmen,
  canvasDiv,
  option,
  currentMode,
  currentSource,
} from './shaderCanvas/index.js';

async function fetchShader(path) {
  const res = await fetch(path);
  const shaderText = await res.text();
  return shaderText;
}

const logColor = () => {
  const logSuccessColor = '#1da1f2';
  const logWarnColor = 'orangered';
  const logErrorColor = '#ff517b';
  return {
    success: logSuccessColor,
    warn: logWarnColor,
    error: logErrorColor,
  };
};

/* -- loadSource */
let loadSource;
const fsPath = './shaders/fs/fsMain.js';
loadSource = await fetchShader(fsPath);

/* -- set layout */
const editorsWrap = document.createElement('div');
editorsWrap.id = 'wrap';
editorsWrap.style.position = 'relative';
editorsWrap.style.display = 'grid';
editorsWrap.style.gridTemplateRows = '1fr auto';
editorsWrap.style.height = '100%';
editorDiv.style.overflow = 'auto';

const statusLogDiv = document.createElement('div');
statusLogDiv.style.height = '2rem';
// statusLogDiv.style.backgroundColor = '#111';
// todo: 常に下部に表示
statusLogDiv.style.position = 'sticky';
statusLogDiv.style.bottom = 0;
// テキストの上下センター表示
statusLogDiv.style.display = 'flex';
statusLogDiv.style.alignItems = 'center';

const logText = document.createElement('p');
// const logText = document.createElement('span');
logText.style.margin = '0 1rem';
logText.style.fontSize = '0.8rem';
logText.style.fontFamily =
  'Consolas, Menlo, Monaco, source-code-pro, Courier New, monospace';
logText.textContent = ' ● ready';
logText.style.color = logColor['success'];

statusLogDiv.appendChild(logText);
editorsWrap.appendChild(editorDiv);
editorsWrap.appendChild(statusLogDiv);

/* -- main */
const container = document.createElement('main');
container.id = 'mainContainer';
container.style.height = '100%';

container.appendChild(canvasDiv);
container.appendChild(editorsWrap);
document.body.appendChild(container);

const initTransaction = editor.state.update({
  changes: { from: 0, insert: loadSource },
});
editor.dispatch(initTransaction);

const fragmen = new Fragmen(option);
fragmen.onBuild((status, msg) => {
  logText.style.color = logColor[status];
  logText.textContent = msg;
});
fragmen.mode = currentMode;
fragmen.render(loadSource);
