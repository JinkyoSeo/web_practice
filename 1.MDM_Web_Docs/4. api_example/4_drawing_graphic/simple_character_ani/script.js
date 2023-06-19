const canvas = document.querySelector('.myCanvas');
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');

ctx.fillStyle = 'rgb(0,0,0)';
ctx.fillRect(0, 0, width, height);
ctx.translate(width / 2, height / 2); // 애니메이션 시작 위치



const image = new Image();         
image.src = "walk-right.png";
image.onload = draw;

let sprite = 0;
let posX = 0;


// 캐릭터 모션 6가지
// 각각 x픽셀 102, y픽셀 148
// -> 각 스프라이트 깔끔하게 표시하려면 -> 단일로 잘라내고 표시
function draw() {
    ctx.fillRect(-(width / 2), -(height / 2), width, height);
    // 9개 매개변수
    // 1. 소스이미지  / 2, 3. 소스이미지에서 잘라낼 왼쪽 상단 모서리
    // 4, 5. 잘라낸 이미지 크기
    // 6, 7. 캔버스에 슬라이스를 그릴 상자의 왼쪽 모서리
    // 8, 9. 캔버스의 이미지 크기 지정.
    ctx.drawImage(image, sprite * 102, 0, 102, 148, 0 + posX, -74, 102, 148);
    //              1           2      3   4    5       6      7    8    9
    if (posX % 13 === 0) {  // 초당 약 매 13번째 프레임 
        if (sprite === 5) { // 또는 5프레임에서만 스프라이트를 업데이트
            sprite = 0;
        } else {
            sprite++;
        }
    }
    // 각 프레임의 값 변경
    if (posX > width / 2) {  // -> 캐릭터가 오른쪽 가장자리를 넘김
        let newStartPos = -(width / 2 + 102); // 오른쪽 넘어가면 왼쪽시작
        posX = Math.ceil(newStartPos);
        console.log(posX);
    } else {
        posX += 2;           // 캐릭터가 화면 넘어가지 않으면 2++
                             // 상승폭이 크면 속도 빨라짐
    }
    window.requestAnimationFrame(draw); // 애니메이션 루프
}

//https://codepen.io/mikethomas/pen/kQjKLW
// 방향키로 움직이는 경우 참고


