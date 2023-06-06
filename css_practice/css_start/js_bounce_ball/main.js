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

// 볼 생성 정보, 그리기, 업데이트(움직임), 파괴
class Ball {
   // 생성자
   // 공 위치, 공 속도, 색상, 사이즈
   constructor(x, y, velX, velY, color, size) {
      this.x = x;
      this.y = y;
      this.velX = velX;
      this.velY = velY;
      this.color = color;
      this.size = size;
   }

   // 공 그리기.
   draw() {
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
      ctx.fill();
   }

   // 업데이트 -> 공 움직임 갱신
   update() {
      // 공의 x와 size가 >= canvas.width 인 경우
      // x.속도 음수? -> 튕겨서 반대로
      if ((this.x + this.size) >= width) {
         this.velX = -(Math.abs(this.velX)); // Math.abs() -> 절대값 return
      }
      // 공의 x와 size가 <= 0 인 경우
      // x.속도 양수? -> 튕겨서 반대로
      if ((this.x - this.size) <= 0) {
         this.velX = Math.abs(this.velX);
      }
      // 위 x.속도와 같은 개념
      if ((this.y + this.size) >= height) {
         this.velY = -(Math.abs(this.velY));
      }
      // 위 x.속도와 같은 개념
      if ((this.y - this.size) <= 0) {
         this.velY = Math.abs(this.velY);
      }

      // 공의 위치에 속도값 추가
      this.x += this.velX;
      this.y += this.velY;

      // 그럼 업데이트 주기는 어떻게?
      // requestAnimationFrame() 메소드를 사용
   }

   // 공 파괴
   collisionDetect() {
      for (const ball of balls) {
         // 현재 ball 객체와 배열의 ball이 다른 경우
         if (!(this === ball)) {
            // 공 사이의 거리
            const dx = this.x - ball.x;
            const dy = this.y - ball.y;
            const distance = Math.sqrt(dx * dx + dy * dy); // Math.sqrt(x) = x의 제곱근
            // 공이 맞닿은 경우 (공이 접한 경우의 크기보다 거리가 작은 경우)
            if (distance < this.size + ball.size) {
               // 두 공의 색이 랜덤으로 변함
              ball.color = this.color = randomRGB();
            }
         }
      }
   }
}

// ball 배열
const balls = [];

// 공 25개까지 생성
while (balls.length < 25) {
   // 공 사이즈 랜덤
   const size = random(10,20);
   // 공 객체 생성
   const ball = new Ball(
      // ball position always drawn at least one ball width
      // away from the edge of the canvas, to avoid drawing errors
      random(0 + size,width - size),  // x
      random(0 + size,height - size), // y
      random(-7,7),                   // velX
      random(-7,7),                   // velY
      randomRGB(),                    // color
      size                            // size
   );

  balls.push(ball);
}

function loop() {
   ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
   ctx.fillRect(0, 0,  width, height);

   for (const ball of balls) {
     ball.draw();
     ball.update();
     ball.collisionDetect();
   }

   requestAnimationFrame(loop);
}

loop();