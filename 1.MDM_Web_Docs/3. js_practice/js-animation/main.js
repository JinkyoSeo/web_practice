const aliceTumbling = [
  { transform: 'rotate(0) scale(1)' },
  { transform: 'rotate(360deg) scale(0)' }
];

const aliceTiming = {
  duration: 2000,
  iterations: 1,
  fill: 'forwards'
}

const alice1 = document.querySelector("#alice1");
const alice2 = document.querySelector("#alice2");
const alice3 = document.querySelector("#alice3");

// alice1.animate(aliceTumbling, aliceTiming);
// alice2.animate(aliceTumbling, aliceTiming);
// alice3.animate(aliceTumbling, aliceTiming);

// 함수1().then(함수2).then(함수3).catch(failure Callback);

function func1() {
  return new Promise(function (resolve) {
    console.log("1호 출격");
    alice1.animate(aliceTumbling, aliceTiming);
    setTimeout(function() {
    resolve();
    },2000);
  });
}

function func2() {
  return new Promise(function (resolve) {
    console.log("2호 출격");
    alice2.animate(aliceTumbling, aliceTiming);
    setTimeout(function() {
    resolve();
    },2000);
  });
}

function func3() {
  console.log("3호 출격");
  alice3.animate(aliceTumbling, aliceTiming);
}

func1().then(function(){
  func2().then(function(){
    func3();
  });
});







