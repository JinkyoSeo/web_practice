const express = require('express');
const app = express();

// body-parser라이브러리 사용시
// 보낸 데이터를 쉽게 처리 가능
app.use(express.urlencoded({extended: true})) 

app.listen(8080, function(){
    console.log('listening on 8080')
});

app.get('/', function(요청, 응답){
    응답.sendFile(__dirname + '/index.html')
    // sendFile 파일을 보내는 함수
    // __dirname은 현재 파일의 경로
})

app.get('/write', function(요청, 응답){
    응답.sendFile(__dirname + '/write.html')
});

app.post('/add', function(요청, 응답){
    console.log(요청.body); // 폼에 입력한 제목과 날짜 데이터
    응답.send('전송완료')
})