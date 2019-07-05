#### < 전체 설정 파일과 지역 설정 파일 >



##### 바벨 설정 파일

```
- 모든 자바스크립트 파일에 적용되는 설정 파일 
> babel.config.js

- 자바스크립트 파일의 경로에 따라 결정되는 지역 설정 파일 
> .babelrc, .babelrc.js, 바벨 설정이 있는 package.json 파일
```

<br>

##### 패키지 설치

```
> npm i @babel/core @babel/cli @babel/plugin-transform-arrow-functions @babel/plugin-transform-template-literals @babel/preset-react
```

<br>

##### Ex1)

프로젝트 루트 : babel.config.js

```js
const presets = ['@babel/preset-react']
const plugins = [
  [
    '@babel/plugin-transform-template-literals',
    {
      loose: true
    }
  ]
]

module.exports = { presets, plugins }
```

<br>

/src/service1/.babelrc

```json
{
  "plugins": [
    "@babel/plugin-transform-arrow-functions",
    "@babel/plugin-transform-template-literals"
  ]
}
```

<br>

```js
/*** src/service1/code.js ***/
const element = <div>babel test</div>
const text = `element type is ${element.type}`
const add = (a, b) => a + b
```

<br>

```
> npx babel src

const element = React.createElement("div", null, "babel test");
const text = "element type is ".concat(element.type);

const add = function (a, b) {
  return a + b;
};
```

> 바벨을 실행한 결과 전체설정과 지역설정이 적용된 것을 확인할 수 있으며 또한, 지역설정이 전체설정을 덮어쓰는 것도 확인된다. (loose 옵션 적용 x)

<br>

`src/service1/code.js` 파일의 경우 `package.json` , `.babelrc` , `.babelrc.js` 파일을 만날 때 까지 부모 폴더로 이동을 하는데, 지역설정 파일인  `src/service1/.babelrc` 을 만나고, 프로젝트 루트에 있는 전체 설정 파일인 `babel.config.js` 파일을 만난다. 그리고 전체 설정 파일과 지역 설정 파일이 병합된다.

<br>

##### Ex2)

```json
/*** src/service2/.babelrc ***/
{
  "plugins": [
    "@babel/plugin-transform-arrow-functions",
    "@babel/plugin-transform-template-literals"
  ]
}
```

<br>

```js
/*** src/service2/folder1/code.js ***/
const element = <div>babel test</div>
const text = `element type is ${element.type}`
const add = (a, b) => a + b
```

<br>

```
src/service/folder1 > npm init -y
```

> package.json 파일 생성

<br>

```
> npx babel src

const element = React.createElement("div", null, "babel test");
const text = "element type is ".concat(element.type);

const add = function (a, b) {
  return a + b;
};
const element = React.createElement("div", null, "babel test");
const text = "element type is " + element.type;

const add = (a, b) => a + b;
```

> 전체 설정 파일만 적용되었다. 

<br>

`src/service2/folder1/code.js` 파일의 경우, `package.json` 파일을 먼저 만나는데, 여기에는 babel 속성이 없으므로 지역 설정 파일은 없다. 그리고 프로젝트 루트의 babel.config.js 파일이 전체 설정 파일로 적용된다. 