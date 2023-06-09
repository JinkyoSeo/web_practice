// set up canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// function to generate random number

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function to generate random RGB color value

function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

// 최상위 클래스로 Shape 생성
// 좌표, 속도를 가짐
class Shape{
   constructor(x, y, velX, velY){
      this.x = x;
      this.y = y;
      this.velX = velX;
      this.velY = velY;
   }
}

// Ball
// Shape 모든 속성 상속
// color, boolean exists 속성 추가
class Ball extends Shape{

   constructor(x, y, velX, velY, color, size)
    {
      super(x, y, velX, velY);
      this.color = color;
      this.size = size;
      this.exists = true;
   }

   // 원 그리기
   draw() {
      ctx.beginPath();            // 새로운 경로를 만든다. 도형을 이루는(선, 아치)의 집합을 경로로 가짐
                                  // 이 메소드가 호출 될 때 마다 하위 경로 모음은 초기화 -> 새로운 도형을 그릴 수 있다.
      ctx.fillStyle = this.color; // 색
      ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);  // 중점 좌표(x,y), 반지름, startAngle, endAngle
      ctx.fill();                 // 색 채우기
   }  

   // 원이 벽에 부딪힌 경우
   update() {
      if ((this.x + this.size) >= width) {
         this.velX = -(Math.abs(this.velX));
      }

      if ((this.x - this.size) <= 0) {
         this.velX = Math.abs(this.velX);
      }

      if ((this.y + this.size) >= height) {
         this.velY = -(Math.abs(this.velY));
      }

      if ((this.y - this.size) <= 0) {
         this.velY = Math.abs(this.velY);
      }

      this.x += this.velX;
      this.y += this.velY;
   }

   // 공끼리 부딪힌 경우
   collisionDetect() {
      for (const ball of balls) {
         if (!(this === ball) && ball.exists) {
            const dx = this.x - ball.x;
            const dy = this.y - ball.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + ball.size) {
              ball.color = this.color = randomRGB();
            }
         }
      }
   }

}

// 볼 없애는 원
class EvilCircle extends Shape{
   constructor(x, y){
      super(x, y, 20, 20);
      this.x = x;
      this.y = y;
      this.color = 'white';
      this.size = 10;

      // wasd를 누르면 원이 이동 -> class 안에다 넣네
      window.addEventListener("keydown", (e) => {
         switch (e.key) {
           case "a":
             this.x -= this.velX;
             break;
           case "d":
             this.x += this.velX;
             break;
           case "w":
             this.y -= this.velY;
             break;
           case "s":
             this.y += this.velY;
             break;
         }
       });
   }

   // 원 그리기 -> stroke사용 -> 원 안이 빈 원?
   draw() {
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = this.color;
      ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
      ctx.stroke();
   }

   // 사방 벽에 부딪힌 경우
   checkBounds() {
      // 오른쪽 벽에 부딪힘 -> 잘 작동
      if ((this.x + this.size) >= width) {
         this.x = width - this.size;
      }
      // 왼쪽 벽에 부딪힘 -> 잘 작동
      if ((this.x - this.size) <= 0) {
         this.x = this.size;
      }
      // 아래쪽 벽에 부딪힘 -> 잘 작동
      if ((this.y + this.size) >= height) {
         this.y = height - this.size;
      }
      // 위쪽 벽에 부딪힘 -> 잘 작동
      if ((this.y - this.size) <= 0) {
         this.y = this.size;
      }
   }

   // 원이 볼을 부딪힌 경우 -> 잡아 먹음
   collisionDetect() {
      for (let i = 0; i < balls.length; i++) {
         if (balls[i].exists) {
            const dx = this.x - balls[i].x;
            const dy = this.y - balls[i].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < this.size + balls[i].size) {
              balls[i].exists = false;
              balls.splice(i, 1);
            }
         }
      }
   
   }
}

// 볼 리스트 생성
const balls = [];
// Evilcircle 생성
const evilCircle = new EvilCircle(   
   random(10 ,width - 10),
   random(10 ,height - 10),
);

// 볼이 25개 생성된 때 까지 경우 반복
// 볼 생성
while (balls.length < 25) {
   const size = random(10,20);
   const ball = new Ball(
      // ball position always drawn at least one ball width
      // away from the edge of the canvas, to avoid drawing errors,
      random(0 + size,width - size),
      random(0 + size,height - size),
      random(-7,7),
      random(-7,7),
      randomRGB(),
      size
   );

  balls.push(ball);
}

// 공 개수 남은거 출력
const para = document.querySelector("p");

// 게임 반복되는 동안 루프
function loop() {
   ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
   ctx.fillRect(0, 0,  width, height);

   // 공 움직임을 계속 그리기
   for (const ball of balls) {
     ball.draw();
     ball.update();
     ball.collisionDetect();

     evilCircle.draw();
     evilCircle.checkBounds();
     evilCircle.collisionDetect();
     

     para.textContent = `ball count: ${balls.length}`;
     para.append();
     

     
   }
   // 브라우저에게 수행하기를 원하는 애니메이션을 알리고
   // 다음 리페인트 바로 전에 브라우저가 애니메이션을 업데이트할 지정된 함수를
   // 호출하도록 요청
   // requestAnimationFrame(반복할 함수)
   requestAnimationFrame(loop);
}

// 게임 시작
loop();