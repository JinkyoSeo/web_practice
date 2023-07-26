const express = require('express');
const app = express();

// body-parser라이브러리 사용시
// 보낸 데이터를 쉽게 처리 가능
app.use(express.urlencoded({extended: true}));
const MongoClient = require('mongodb').MongoClient;
app.set('view engine', 'ejs');

// 노드에게 publick파일이 있는것을 알려줌
app.use('/public', express.static('public'));

// method-override 사용하기 위해서 -> PUT(수정) method를 사용하기 위해서
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

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

  // sendFile은 파일을 보내고 싶을때 사용
  // render은 파일을 보내기 전에 ejs 파일 -> html로 바꾸고 싶을때
app.get('/', function(요청, 응답){
    응답.render('index.ejs');

})

app.get('/write', function(요청, 응답){
    응답.render('write.ejs')
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

app.get('/edit/:id', function(요청, 응답){
    db.collection('post').findOne({_id: parseInt(요청.params.id)}, function(에러, 결과){
        응답.render('edit.ejs', {post: 결과});
    });
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

app.put('/edit', function(요청, 응답){
    db.collection('post').updateOne({_id : parseInt(요청.body.id)}, {$set : {제목 : 요청.body.title, 날짜 : 요청.body.date}}, function(에러, 결과){
        console.log('수정 완료');
        console.log(요청.body);
        응답.redirect('/list');
    });
});


