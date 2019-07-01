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

웹팩을 이용하기 위한 패키지 설치

```
> npm i webpack webpack-cli babel-loader
```



<br>

웹팩 설정 파일

```js
/*** webpack.config.js ***/
const path = require('path')

module.exports = {
  entry: './src/code.js',
  output: {
    path: path.resolve(__dirname, 'dist2'),
    filename: 'code.bundle.js',
  },
  module: {
    rules: [
      { test: /\.js$/, use: 'babel-loader'}
    ],
  },
  optimization: { minimizer: [] },
}
```

> `entry` : 웹팩으로 번들링할 파일을 지정
>
> `output` : 번들링 된 결과를 dist2/code.bundle.js 파일로 저장
>
> `module` : js 파일을 babel-loader 가 처리하도록 설정. 
>
> babel-loader 는 바벨의 설정 파일인 babel.config.js 의 내용을 설정값으로 사용한다. 
>
> `optimization: { minimizer: [] }`  : 웹팩은 기본적으로 js 파일을 압축하지만, 테스트를 위해 압축 기능을 해제하는 옵션

<br>

웹팩 실행

```
> npx webpack
```

> dis2/code.bundle.js 파일이 생성된다.
>
> 파일의 내용은 웹팩의 런타임 코드 + 바벨이 생성한 코드로 구성되어 있다.

<br>

#### @babel/core를 직접 실행하기

@babel/cli 와 babel0loader 는 모두 @babel/core 를 이용해서 바벨을 실행하는 방식이다.

<br>

@babel/core 를 직접 사용하는 코드

```js
const babel = require('@babel/core')
const fs = require('fs')

const filename = './src/code.js'
const source = fs.readFileSync(filename, 'utf8')
const presets = ['@babel/preset-react']
const plugins = [
  '@babel/plugin-transform-template-literals',
  '@babel/plugin-transform-arrow-functions'
]

const { code } = babel.transformSync(source, {
  filename, presets, plugins, 
  configFile: false
})

console.log(code)
```

> `source` 에는 컴파일 할 내용을 담는다.
>
> `babel.transformSync()` 를 통해 바벨을 실행
>
> `configFile: false` 옵션은 babel.config.js 설정 파일을 사용하지 않도록 한다.

<br>

```
> node runBabel.js
```

> 위에서 실행했던 결과를 콘솔에서 확인할 수 있다.
>
> 파일로 저장하려면 fs 모듈을 이용하면 된다. 

<br>

##### AST 를 활용한 바벨 실행

바벨은 컴파일 시 다음의 세 단계를 거친다. 

```
1. 파싱(parse) : 입력된 코드로부터 AST(abstract syntax tree) 를 생성한다.
2. 변환(transform) : AST를 원하는 형태로 변환한다.
3. 생성(generator) : AST를 코드로 출력한다.
```

> AST 는 코드의 syntax 가 분석된 결과를 담고 있는 구조체. 코드가 같다면 AST 도 동일하다.

<br>

```js
/*** runBabel2.js ***/
const babel = require('@babel/core')
const fs = require('fs')

const filename = './src/code.js'
const source = fs.readFileSync(filename, 'utf8')
const presets = ['@babel/preset-react']

const { ast } = babel.transformSync(source, {
  filename, 
  ast: true,
  code: false,
  presets,
  configFile: false
})


const { code: code1 } = babel.transformFromAstSync(ast, source, {
  filename, 
  plugins: ['@babel/plugin-transform-template-literals'],
  configFile: false
})

const { code: code2 } = babel.transformFromAstSync(ast, source, {
  filename, 
  plugins: ['@babel/plugin-transform-arrow-functions'],
  configFile: false
})

console.log({code1})
console.log({code2})
```

> 적용하는 프리셋은 동일하기 때문에 AST 를 만들면서 해당 프리셋만 미리 적용시킨다
>
> 이렇게 만들어진 AST 로부터 각각의 플러그인을 적용시킨 코드를 생성한다.
>
> 이 방식은 설정의 개수가 많아질수록 효율이 높아진다.

<br>

실행결과

```
{ code1:
   'const element = React.createElement("div", null, "babel test");\nconst etxt = "element type is ".concat(element.type);\n\nconst add = (a, b) => a + b;' }
{ code2:
   'const element = React.createElement("div", null, "babel test");\nconst etxt = `element type is ${element.type}`;\n\nconst add = function (a, b) {\n  return a + b;\n};' }
```

<br>

#### @babel/register로 실행하기

`@babel/register` 를 이용하면 Node.js 에서 require 코드가 실행될 때 동적으로 바벨이 실행되게 할 수 있다.

<br>

##### Reference

<https://github.com/landvibe/book-react/tree/master/7-chapter/1-test-babel-how>