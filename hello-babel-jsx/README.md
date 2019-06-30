### < JSX 문법을 바벨로 컴파일 하기 >

<br>

#### 바벨(babel)은 자바스크립트 코드를 변환해 주는 컴파일러.

```
- JS ES6+ 문법을 ES5 문법으로 변환
- 콛에서 주석을 제거하거나, 코드를 압축
- JSX 문법으로 작성된 코드를 createElement 함수를 호출하는 코드로 변환 등..
```

<br>

#### Sample code usage

```
> npm install @babel/core @babel/cli @babel/preset-react
> npx babel --watch src --out-dir . --presets @babel/preset-react
```

<br>

npx 명령어는 외부 패키지에 포함된 실행 파일을 실행 할 때 사용.

`npx babel` 은 `./node_modules/.bin/babel` 과 비슷.

src 폴더에 있는 모든 JS 파일을 `@babel/preset-react` 프리셋을 이용해서 변환 후 현재 폴더에 같은 이름의 JS파일을 생성.

(JSX 문법으로 작성된 파일이 `createElement()` 함수로 작성된 파일로 변환된다)

`watch` 모드로 실행했기 때문에, src 폴더의 JS 파일을 수정할 때 마다 자동으로 변환 후 저장한다.





##### Reference

<https://github.com/landvibe/book-react/tree/master/1-chapter/3-hello-world-with-babel>