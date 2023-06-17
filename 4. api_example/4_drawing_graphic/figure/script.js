const canvas = document.querySelector('.myCanvas');
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');

function degToRad(degrees) {
    return (degrees * Math.PI) / 180;
  }

ctx.fillStyle = "rgb(255, 0, 0)"; // 빨간색
ctx.beginPath();                  // 0,0 펜 시작
ctx.moveTo(50, 50);               // 50, 50으로 펜 이동 -> 왼쪽 꼭지점

// draw your path
ctx.lineTo(150, 50);                           // 왼쪽 꼭지점 -> 오른쪽 꼭지점으로 선 잇기
const triHeight = 50 * Math.tan(degToRad(60)); // 60도로 꺽기
ctx.lineTo(100, 50 + triHeight);               // 왼쪽, 오른쪽 꼭지점 사이에서 +높이 까지 선 잇기
ctx.lineTo(50, 50);                            // 원점까지 선 잇기
//////////////////
ctx.fill();                                    // 색 채우기
///////////////////////////////////////////////// 위까지가 삼각형

ctx.fillStyle = "rgb(0, 0, 255)";              // 원
ctx.beginPath();
ctx.arc(150, 106, 50, degToRad(0), degToRad(360), false);
ctx.fill();

ctx.fillStyle = "yellow";                      // 팩맨
ctx.beginPath();
ctx.arc(200, 106, 50, degToRad(-45), degToRad(45), true);
ctx.lineTo(200, 106);
ctx.fill();

