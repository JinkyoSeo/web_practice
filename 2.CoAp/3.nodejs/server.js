const express = require('express');
const app = express();

// body-parser라이브러리 사용시
// 보낸 데이터를 쉽게 처리 가능
app.use(express.urlencoded({extended: true}));
const MongoClient = require('mongodb').MongoClient;
app.set('view engine', 'ejs');

// 노드에게 public파일이 있는것을 알려줌
app.use('/public', express.static('public'));

// method-override 사용하기 위해서 -> PUT(수정) method를 사용하기 위해서
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

// 로그인을 위한
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

// app.use -> 미들웨어를 쓰겠다라는 뜻 -> 미들 웨어란? 요청과 응답사이에 뭔가 실행시키는 코드
app.use(session({secret : '비밀코드', resave : true, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session()); 
// -- 로그인

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

app.get('/login', function(요청, 응답){
    응답.render('login.ejs');
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

app.post('/login',passport.authenticate('local', {failureRedirect : '/fail'}) , function(요청, 응답){
    // passport 어쩌구~ : passport 라이브러리가 제공하는 아이디비번인증 코드 
    //                   -> 응답해주기 전에 local 방식으로 아이디 비번을 인증해주세요 
    //                   -> failureRedirect : 실패시 이동시켜줄 경로
    
    응답.redirect('/'); // redirect() 다른 페이지로 이동 시켜줌
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
        //console.log(요청.body);
        응답.redirect('/list');
    });
});

//                로컬 방식으로 아이디/ 비번 검사
passport.use(new LocalStrategy({
    // 설정부분
    usernameField: 'id',      // 사용자가 제출한 아이디가 어디 적혔는지
    passwordField: 'pw',      //  ..            비번이      ..
    session: true,            // 세션을 만들건지
    passReqToCallback: false, // 아이디/비번 말고 다른 정보 검사가 필요한지
  }, function (입력한아이디, 입력한비번, done) {
    //console.log(입력한아이디, 입력한비번);
    db.collection('login').findOne({ id: 입력한아이디 }, function (에러, 결과) {
      if (에러) return done(에러)
  
      if (!결과) return done(null, false, { message: '존재하지않는 아이디요' })
      if (입력한비번 == 결과.pw) {
        return done(null, 결과)
      } else {
        return done(null, false, { message: '비번틀렸어요' })
      }
    })
  }));


