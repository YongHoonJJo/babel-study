### < 바벨을 실행하는 여러가지 방법 >



```
- @babel/cli 로 실행하기
- 웹팩에서 babel-loader로 실행하기
- @babel/core를 직접 실행하기
- @babel/register로 실행하기
```



<br>

#### @babel/cli 로 실행하기

필요한 패키지 설치.

```
> npm i @babel/core @babel/cli @babel/plugin-transform-arrow-functions @babel/plugin-transform-template-literals @babel/preset-react
```

> `@babel/core` 은 바벨을 실행하기 위해 설치해야 하는 필수 패키지
>
> `@babel/preset-react` 은 JSX 문법을 변환하는데 필요한 프리셋
>
> `@babel/plugin-transform-arrow-functions` 은화살표 함수를 변환하는데 필요한 플러그인
>
> `@babel/plugin-transform-template-literals` 은 템플릿 리터럴 코드를 변환하는데 필요한 플러그인

<br>

```jsx
/*** src/code.js ***/
const element = <div>babel test</div>
const etxt = `element type is ${element.type}`
const add = (a, b) => a + b
```

<br>

```
> npx babel src/code.js --presets=@babel/preset-react --plugins=@babel/plugin-transform-template-literals,@babel/plugin-transform-arrow-functions
```

> `@babel/cli` 를 통해 설정값을 표현하여 콘솔에서 바벨을 실행한 결과는 아래와 같다.

```js
const element = React.createElement("div", null, "babel test");
const etxt = "element type is ".concat(element.type);

const add = function (a, b) {
  return a + b;
};
```

<br>

설정할 내용이 많거나, 환경에 따라 설정값이 다른 경우, 설정 파일을 따로 만드는 것이 좋다.

```js
/*** babel.config.js ***/
const presets = ['@babel/preset-react']
const plugins = [
  '@babel/plugin-transform-template-literals',
  '@babel/plugin-transform-arrow-functions'
]

module.exports = { presets, plugins }
```

> 위에서 실행했던 내용과 동일한 설정이다.
>
> 바벨 7 부터는 babel.config.js 파일로 관리하는 것을 추천. (그 전에는 .babelrc 사용)

<br>

```
> npx babel src/code.js
```

> 위에서 실행했던 것과 동일한 결과를 얻을 수 있다.

<br>

컴파일된 결과를 파일로 저장하고 싶은 경우.

```
> npx babel src/code.js --out-file dist.js
> npx babel src --out-dir dist
```

> 위에는 파일 단위로, 아래는 폴더 단위로 처리한다.

<br>

#### 웹팩에서 babel-loader로 실행하기





#### @babel/core를 직접 실행하기





#### @babel/register로 실행하기

`@babel/register` 를 이용하면 Node.js 에서 require 코드가 실행될 때 동적으로 바벨이 실행되게 할 수 있다.