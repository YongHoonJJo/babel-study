#### < Babel / Polyfill >



자바스크립트의 최신 기능을 모두 상요하면서 오래된 브라우저를 지원하려면, 바벨로 코드 문법을 변환하는 동시에 폴리필도 사용해야 한다.

폴리필은 런타임에 기능을 주입하는 것을 말하며, 런타임에 기능이 존재하는지 검사 후 기능이 없는 경우에만 주입한다.

바벨을 사용하면서 폴리필에 대한 설정은 별도로 해야 한다.

```js
예를 들어, ES8에 추가된 String.padStart() 는 폴리필을 이용해서 추가할 수 있으며, async-await 은 폴리필로 추가할 수 없으며, 컴파일 타임에 코드 변환을 해야한다.

if(!String.prototype.padStart) {
  String.prototype.padStart = func; // func 는 padStart 폴리필 함수
}
```



<br>

##### @babel/polyfill 모듈의 모든 폴리필 사용하기

```js
import '@babel/polyfill'

const p = Promise.resolve(10)
const obj = {
  a: 19,
  b: 20,
  c: 30,
}

const arr = Object.values(obj)
const exist = arr.includes(20)
```

> `@babel/polyfill` 은 바벨에서 폴리필을 위해 공식적으로 지원하는 패키지.
>
> 위와 같이 import 하면, 해당 모듈의 모든 폴리필이 포함되기 때문에, 낮은 버전은 브라우저에서도 Promise, Object.values, 배열의 includes() 메서드를 모두 사용할 수 있다.

<br>

웹팩을 사용 하는 경우

```js
module.exports = {
  entry: ['@babel/polyfill', './src/index.js']
  // ...
}
```

<br>

이렇게 사용할 경우, 불필요한 폴리필까지 포함돼서 번들 파일의 크기가 커지는 단점이 있다.

<br>

##### core-js 모듈에서 필요한 폴리필만 가져오기

```js
import 'core-js/features/promise'
import 'core-js/features/object/values'
import 'core-js/features/array/includes'

const p = Promise.resolve(10)
const obj = {
  a: 19,
  b: 20,
  c: 30,
}

const arr = Object.values(obj)
const exist = arr.includes(20)
```

<br>

@babel/polyfill 패키지는 내부적으로 core-js 패키지를 이용하기 때문에, 위와 같이 직접 필요한 폴리필만 가져올 수 있다. 

이 경우, 번들 파일의 크기는 줄어들지만, 번거로울 수 있다.

<br>

##### @babel/preset-env 프리셋 이용하기

@babel/preset-env 프리셋은 실행 환경에 대한 정보를 설정해 주면 자동으로 필요한 기능을 주입해 준다.

<br>

Ex)

패키지 설치

```
> inp i @babel/core @babel/cli @babel/preset-env
```

<br>

```js
/*** /babel.config.js ***/
const presets = [
  [
    '@babel/preset-env',
    {
      targets: {
        chrome: '40',
      },
      useBuiltIns: 'entry',
    },
  ],
]

module.exports = { presets }
```

> @babel/preset 을 사용해서 크롬 버전 40을 최소 버전으로 설정한다.
>
> useBuiltIns 는 폴리필과 관련된 설정으로, entry 는 지원하는 브라우저에서 필요한 폴리필만 포함시킨다.
>
> 설정 Ref : <https://github.com/browerslist/browserslist#full-list>

<br>

```js
/*** /src/code.js ***/
import '@babel/polyfill'

const p = Promise.resolve(10)
const obj = {
  a: 19,
  b: 20,
  c: 30,
}

const arr = Object.values(obj)
const exist = arr.includes(20)
```

<br>

```
> npx babel src/code.js

"use strict";

require("core-js/modules/es6.array.copy-within");

require("core-js/modules/es6.array.fill");

// ...

require("core-js/modules/web.dom.iterable");

require("regenerator-runtime/runtime");

var p = Promise.resolve(10);
var obj = {
  a: 19,
  b: 20,
  c: 30
};
var arr = Object.values(obj);
var exist = arr.includes(20);
```

> useBuiltIns: entry 속석에 의해수십 줄에 걸쳐 모듈을 가져오는 코드가 출력되는데, 여기서 출력되는 폴리필은 크롬 버전 40에 없는 기능을 위한 것이다. 불필요한 폴리필 코드까지 추가가 된 상태이다.

<br>

```js
/*** /babel.config.js ***/
const presets = [
  [
    '@babel/preset-env',
    {
      targets: {
        chrome: '40',
      },
      useBuiltIns: 'usage',
    },
  ],
]

module.exports = { presets }
```

> 옵션을 usage 로 변경

<br>

```js
/*** /src/code.js ***/
const p = Promise.resolve(10)
const obj = {
  a: 19,
  b: 20,
  c: 30,
}

const arr = Object.values(obj)
const exist = arr.includes(20)
```

> `import '@babel/polyfill'` 삭제

<br>

```
> npx babel src/code.js

"use strict";

require("core-js/modules/es7.array.includes");
require("core-js/modules/es6.string.includes");
require("core-js/modules/web.dom.iterable");
require("core-js/modules/es7.object.values");
require("core-js/modules/es6.promise");
require("core-js/modules/es6.object.to-string");

var p = Promise.resolve(10);
var obj = {
  a: 19,
  b: 20,
  c: 30
};
var arr = Object.values(obj);
var exist = arr.includes(20);
```

> 코드에서 사용된 기능의 폴리필만 추가된다.  또한, 바벨이 코드에서 사용된 변수의 타입을 추론하지 못하게 된 경우 임의의 폴리필이 추가 된다. 

<br>



##### Reference

<https://github.com/landvibe/book-react/tree/master/7-chapter/4-test-babel-env>