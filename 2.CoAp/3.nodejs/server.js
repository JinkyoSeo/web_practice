const express = require('express');
const app = express();
// body-parser라이브러리 사용시
// 보낸 데이터를 쉽게 처리 가능
app.use(express.urlencoded({extended: true}));
const MongoClient = require('mongodb').MongoClient;
app.set('view engine', 'ejs');

var db;
MongoClient.connect('mongodb+srv://admin:qwer1234@cluster0.75bsb1m.mongodb.net/?retryWrites=true&w=majority',{ useUnifiedTopology: true }, function(에러, client){
    if (에러) return console.log(에러);
    db = client.db('todoapp');

    // db에 자료 추가 할때
    // db.collection('post').insertOne({/*이름 : 'John', _id : 100*/}, function(에러, 결과){
    //     console.log('저장완료');
    // });

    //서버띄우는 코드 여기로 옮기기
    app.listen('8080', function(){
      console.log('listening on 8080')
    });
  })

app.get('/', function(요청, 응답){
    응답.sendFile(__dirname + '/index.html')
    // sendFile 파일을 보내는 함수
    // __dirname은 현재 파일의 경로
})

app.get('/write', function(요청, 응답){
    응답.sendFile(__dirname + '/write.html')
});

app.get('/list', function(요청, 응답){
    db.collection('post').find().toArray(function(에러, 결과){
        //console.log(결과)
        응답.render('list.ejs', {posts : 결과})
    })
})

app.get('/detail/:id', function(요청, 응답){
    db.collection('post').findOne({ _id : parseInt(요청.params.id) }, function(에러, 결과){
      응답.render('detail.ejs', {data : 결과} )
    })
  });
  
app.post('/add', function(요청, 응답){
    db.collection('counter').findOne({name: '게시물갯수'}, function(에러, 결과){
        var 총게시물갯수 = 결과.totalPost;
       
        db.collection('post').insertOne({_id : (총게시물갯수 + 1),제목: 요청.body.title, 날짜: 요청.body.date}, function(){
            db.collection('counter').updateOne({name:'게시물갯수'}, {$inc : {totalPost: 1}}, function(에러,결과){
                if(에러) return console.log(에러);
                응답.send('전송완료');
            });
        });
    });
});

app.delete('/delete', function(요청, 응답){
    요청.body._id = parseInt(요청.body._id);
    db.collection('post').deleteOne(요청.body, function(에러, 결과){
        console.log('삭제완료');
    });

    응답.send('삭제완료');
})


