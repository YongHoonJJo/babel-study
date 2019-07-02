### < 확장성과 유연성을 고려한 바벨 설정 방벙 >

바벨 설정 파일에서 사용할 수 있는 속성 중..

```
extends : 다른 속성 파일을 가져와서 확장 가능
env or overrides : 환경별 또는 파일별로 다른 설정 적용가능
```

<br>

패키지 설치

```
> npm i @babel/core @babel/cli @babel/plugin-transform-arrow-functions @babel/plugin-transform-template-literals @babel/preset-react babel-preset-minify
```

<br>

#### extends 속정으로 다른 설정 파일 가져오기

```js
/*** common/.babelrc ***/
{
  "presets": ["@babel/preset-react"],
  "plugins": [
    [
      "@babel/plugin-transform-template-literals",
      {
        "loose": true
      }
    ]
  ]
}
```

> 플러그인에 옵션을 설정할 경우, 배열로 만들어서 두번째 자리에 옵션을 넣는다.

<br>

```js
/*** src/example-extends/.babelrc ***/
{
  "extends": "../../common/.babelrc",
  "plugins": [
    "@babel/plugin-transform-arrow-functions",
    "@babel/plugin-transform-template-literals"
  ]
}
```

> `extends` 속성을 이용해서 다른 파일에 있는 설정을 가져와서, 플러그인을 추가한다.
>
> 플러그인이 중복될 경우, 현재 파일의 옵션으로 결정된다. 

<br>

```js
/*** example-extends/code.js ***/
const element = <div>babel test</div>
const text = `element type is ${element.type}`
const add = (a, b) => a + b
```

<br>

```
> npx babel src/example-extends//code.js 
```

실행결과

```
const element = React.createElement("div", null, "babel test");
const text = "element type is ".concat(element.type);

const add = function (a, b) {
  return a + b;
};
```

> loose 옵션이 적용되지 않았다.

<br>

#### env 속성으로 환경별로 설정하기

```js
/*** example-env/.babelrc ***/
{
  "preset": ["@babel/preset-react"],
  "plugins": [
    "@babel/plugin-transform-template-literals",
    "@babel/plugin-transform-arrow-functions"
  ],
  "env": {
    "production": {
      "presets": ["minify"]
    }
  }
}
```

> `env` 속성을 이용하면 환경별로 다른 설정을 할 수 있는데, 위 코드의 경우, production 환경에서 압축 프리셋을 사용하도록 설정한 상태.
>
> 바벨에서 현재 환경은 `process.env.BABEL_ENV || process.env.NODE_ENV || "development"` 로 결정된다.

<br>

```js
/*** example-env/code.js ***/
const element = <div>babel test</div>
const text = `element type is ${element.type}`
const add = (a, b) => a + b
```

<br>

```
> NODE_ENV=production npx babel ./src/example-env
```

실행결과

```
const element=React.createElement("div",null,"babel test"),text="element type is ".concat(element.type),add=function(c,a){return c+a};
```

> 압축 프리셋이 적용되었다

<br>

```
> npx babel ./src/example-env
```

실행결과

```
const element = React.createElement("div", null, "babel test");
const text = "element type is ".concat(element.type);

const add = function (a, b) {
  return a + b;
};
```

<br>

#### overrides 속성으로 파일별로 설정하기

```js
/*** example-overrides ***/
{
  "presets": ["@babel/preset-react"],
  "plugins": ["@babel/plugin-transform-template-literals"],
  "overrides": [
    {
      "include": "./service1",
      "exclude": "./service1/code2.js",
      "plugins": ["@babel/plugin-transform-arrow-functions"]
    }
  ]
}
```

> `overrides` 속성을 이용하면 파일별로 다른 속성을 적용할 수 있다.
>
> `./service1` 폴더 밑에 있는 파일에는 `@babel/plugin-transform-arrow-functions` 설정을 적용하지만, `./service1/code2.js` 에는 적용하지 않는다.

<br>

```js
/*** src/example-overrides/code.js ***/
const element = <div>babel test</div>
const text = `element type is ${element.type}`
const add = (a, b) => a + b
```

```js
/*** src/example-overrides/service1/code1.js ***/
const element = <div>babel test1</div>
const text = `element type is ${element.type}`
const add = (a, b) => a + b
```

```js
/*** src/example-overrides/service1/code2.js ***/
const element = <div>babel test2</div>
const text = `element type is ${element.type}`
const add = (a, b) => a + b
```

<br>

```
> npx babel ./src/example-overrides
```

overrides 속성으로 컴파일된 결과

```
// code.js
const element = React.createElement("div", null, "babel test");
const text = "element type is ".concat(element.type);

const add = (a, b) => a + b;

// code1.js
const element = React.createElement("div", null, "babel test1");
const text = "element type is ".concat(element.type);

const add = function (a, b) {
  return a + b;
};

// code2.js
const element = React.createElement("div", null, "babel test2");
const text = "element type is ".concat(element.type);

const add = (a, b) => a + b;
```

> `code1.js` 파일만 화살표 함수 플러그인이 적용되었다. 

<br>

##### Reference

<https://github.com/landvibe/book-react/tree/master/7-chapter/2-test-babel-config>