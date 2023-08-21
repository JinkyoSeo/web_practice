const express = require('express');
const app = express();

// env 파일 관리하기 위한 라이브러리 dotenv
require('dotenv').config();

// socket.io로 통신하기
const http = require('http').createServer(app);
const { Server } = require("socket.io");
const io = new Server(http);

// body-parser라이브러리 사용시
// 보낸 데이터를 쉽게 처리 가능
app.use(express.urlencoded({ extended: true }));
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
app.use(session({ secret: '비밀코드', resave: true, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
// -- 로그인

// 라우터 관리 예제
app.use('/', require('./routes/shop.js'));

// 이미지 업로드 라이브러리. multipart/form-data를 통해 업로드된 파일을 매우 쉽게 저장, 이름변경, 처리할 수 있게 도와주는 라이브러리
let multer = require('multer');
const { Socket } = require('dgram');
var storage = multer.diskStorage({

  destination: function (req, file, cb) {
    cb(null, './public/image')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }

});

var upload = multer({
  storage: storage,
  // fileFilter: function (req, file, callback) {
  //   console.log(path);
  //     var ext = path.extname(file.originalname);
  //     if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
  //         return callback(new Error('PNG, JPG만 업로드하세요'))
  //     }
  //     callback(null, true)
  // },
  // limits:{
  //     fileSize: 1024 * 1024 // 파일 사이즈 제한 = 1mb
  // }
});
// @@ 이미지 업로드 라이브러리




var db;

MongoClient.connect(process.env.DB_URL, { useUnifiedTopology: true }, function (에러, client) {
  if (에러) return console.log(에러);
  db = client.db('todoapp');

  // db에 자료 추가 할때
  // db.collection('post').insertOne({/*이름 : 'John', _id : 100*/}, function(에러, 결과){
  //     console.log('저장완료');
  // });

  //서버띄우는 코드 여기로 옮기기
  //   app.listen(process.env.PORT, function () {
  //     console.log('listening on 8080')
  //   });
  // })
  // -> express를 사용해서 서버를띄우다가 / http라는 nodejs기본 라이브러리 + socket.io으로 서버를 띄움
  http.listen(8080, function () {
    console.log('listening on 8080')
  });
});

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@    홈페이지    @@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// sendFile은 파일을 보내고 싶을때 사용
// render은 파일을 보내기 전에 ejs 파일 -> html로 바꾸고 싶을때
app.get('/', function (요청, 응답) {
  응답.render('index.ejs');
})

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@    게시글작성    @@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
app.get('/write', function (요청, 응답) {
  응답.render('write.ejs')
});

app.post('/add', 로그인했니, function (요청, 응답) {
  console.log(요청.user._id);
  db.collection('counter').findOne({ name: '게시물갯수' }, function (에러, 결과) {
    var 총게시물갯수 = 결과.totalPost;
    var post = { _id: 총게시물갯수 + 1, 작성자: 요청.user._id, 작성자이름: 요청.user.id, 제목: 요청.body.title, 날짜: 요청.body.date }
    db.collection('post').insertOne(post, function (에러, 결과) {
      db.collection('counter').updateOne({ name: '게시물갯수' }, { $inc: { totalPost: 1 } }, function (에러, 결과) {
        if (에러) return console.log(에러);
        응답.redirect('/list');
      });
    });
  });
});

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@    게시판리스트    @@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
app.get('/list', function (요청, 응답) {
  db.collection('post').find().toArray(function (에러, 결과) {
    //console.log(결과)
    응답.render('list.ejs', { posts: 결과 })
  })
})

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@    상세페이지    @@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
app.get('/detail/:id', function (요청, 응답) {
  db.collection('post').findOne({ _id: parseInt(요청.params.id) }, function (에러, 결과) {
    응답.render('detail.ejs', { data: 결과 })
  })
});

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@    게시판수정    @@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
app.get('/edit/:id', function (요청, 응답) {
  db.collection('post').findOne({ _id: parseInt(요청.params.id) }, function (에러, 결과) {
    응답.render('edit.ejs', { post: 결과 });
  });
});
app.put('/edit', function (요청, 응답) {
  db.collection('post').updateOne({ _id: parseInt(요청.body.id) }, { $set: { 제목: 요청.body.title, 날짜: 요청.body.date } }, function (에러, 결과) {
    console.log('수정 완료');
    //console.log(요청.body);
    응답.redirect('/list');
  });
});
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@    게시판삭제    @@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
app.delete('/delete', function (요청, 응답) {
  요청.body._id = parseInt(요청.body._id); // _id는 게시물 id
  db.collection('post').deleteOne({ _id: 요청.body._id, 작성자: 요청.user._id }, function (에러, 결과) {
    if (결과.deletedCount === 1 ){
      응답.status(200).send({ message: '성공했습니다.' });
    }
    else {
      console.log('글 작성자가 다름');
      응답.status(403).json({ error: '본인 글이 아닌듯?.' });
    }
  });
})
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@    로그인    @@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
app.get('/login', function (요청, 응답) {
  if (요청.user){
    응답.send("<script>alert('로그인했음;; 오지마셈 ㅠ')</script><script>window.location=\"../\"</script>");
  }
  else{
    응답.render('login.ejs');
  }
});

app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), function (요청, 응답) {
  // passport 어쩌구~ : passport 라이브러리가 제공하는 아이디비번인증 코드 
  //                   -> 응답해주기 전에 local 방식으로 아이디 비번을 인증해주세요 
  //                   -> failureRedirect : 실패시 이동시켜줄 경로
  
  //응답.render('nav.ejs', {id: 요청});
  응답.redirect('/'); // redirect() 다른 페이지로 이동 시켜줌
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

  // 기능 순서
  // 1. DB에서 {id : 입력한 아이디}인 문서를 찾기
  // 2. 있으면 그 문서의 pw값과 입력한 비번을 비교
  // 3. 성공하면 찾은 유저를 출력
  db.collection('login').findOne({ id: 입력한아이디 }, function (에러, 결과) {
    if (에러) return done(에러)

    if (!결과) return done(null, false, { message: '존재하지않는 아이디요' })
    // 원래는 암호화한 pw를 DB에 저장
    // 유저의 비번도 암호화 해서 받고 비교
    if (입력한비번 == 결과.pw) {
      return done(null, 결과)
    } else {
      return done(null, false, { message: '비번틀렸어요' })
    }
  })
}));

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@    회원가입    @@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
app.get('/register', function (요청, 응답) {
  응답.render('register.ejs');
});

app.post('/register', function (요청, 응답) {
  db.collection('login').insertOne({ id: 요청.body.id, pw: 요청.body.pw }, (에러, 결과) => {
    응답.redirect('/');
  });
});

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@    마이페이지    @@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
app.get('/mypage', 로그인했니, function (요청, 응답) {
  응답.render('mypage.ejs', { 사용자: 요청.user });
});

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@   로그인 확인    @@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
function 로그인했니(요청, 응답, next) {
  if (요청.user) { // 요청.user 로그인 한 유저의 DB상 정보 / id, pw, name...
    // 사용하려면 deserializeUser 부분 개발 필요
    // deserializeUser(): 세션아이디를 바탕으로 이 유저의 정보를 DB에서 찾아주세요
    // 요청.user에 꽂아줌
    next();
    console.log('로그인 했음');
    //console.log(요청.user); // { _id: 64c0ad634ad830ef07893ff2, id: 'test', pw: 'test' }
  }
  else {
    응답.send("<script>alert('로그인안했누;;')</script><script>window.location=\"../\"</script>");
  }
}

// 아이디/비번이 DB와 비교했을때 맞는 경우
// sessionID를 쿠키에 넣어서 유저에게 발급
// serializeUser() : 유저의 id 데이터를 바탕으로 세션데이터를 만들어주고 쿠키로 보내줌
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// deserializeUser() : 로그인 된 유저가 마이페이지 같은걸 접속했을때 실행
// DB에서 {id: 세션아이디에 숨겨져 있던 유저 아이디}인 게시물 찾음
// 그 결과를 요청.user에 꽂아줌
passport.deserializeUser(function (아이디, done) {
  db.collection('login').findOne({ id: 아이디 }, function (에러, 결과) {
    done(null, 결과);
  });
});

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@    로그아웃    @@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
app.get('/logout', function (요청, 응답, next) {
  // 요청.logout(); -> 업데이트로 인한 변경 (logout()함수가 동기 -> 비동기로 바뀌면서)
  요청.logout(function (err) {
    if (err) { return next(err); }
    응답.redirect('/');
  });
});

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@    검색    @@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
app.get('/search', (요청, 응답) => {
  //console.log(요청.query.value); // query string 전부 볼 수 있음
  var pattern = 요청.query.value;
  const regex = new RegExp(pattern, "gi"); // 변수를 정규식으로 이용할 경우 객체를 생성해서 적용해야함
  // gi 대소문자 구분 없이 모든 패턴 찾아줌
  db.collection('post').find({ 제목: regex }).toArray((에러, 결과) => { //    // 정규식 문자에 ~가 들어가 있냐 검사
    //                    mongoDB에 만든 인덱스 text -> But 영어 한에서만 효과적 -> mongoDB에서 제공하는 다른 index는 유료
    //db.collection('post').find({$text : { $search : 요청.query.value}})  .toArray((에러, 결과)=>{
    // console.log(결과);
    응답.render('search.ejs', { 검색결과: 결과 });
  });
});

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@    파일 업로드    @@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
app.get('/upload', function (요청, 응답) {
  응답.render('upload.ejs')
});

//                          '프로필': input의 name
app.post('/upload', upload.single('profile'), function (요청, 응답) {
  응답.send('업로드완료')
});

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@    사진보기    @@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
app.get('/image/:imageName', (요청, 응답) => {
  응답.sendFile(__dirname + '/public/image/' + 요청.params.imageName);
});

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@    채팅창    @@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
var ObjectId = require('mongodb').ObjectID;
app.post('/chatroom', function (요청, 응답) {
  //console.log(요청.body.당한사람id);
  var 저장할거 = {
    title: [요청.body.당한사람이름, 요청.user.id],//'무슨무슨채팅방',
    member: [ObjectId(요청.body.당한사람id), 요청.user._id],
    date: new Date()
  }

  // db에 insert, find, delete 이런거 하고 콜백함수 대신 .then()도 가능/ 에러는 .catch()
  db.collection('chatroom').insertOne(저장할거).then(function (에러, 결과) {
    console.log('저장완료');
    응답.send('저장완료') // 응답.send를 해줘야 list.ejs의 ajax post 요청에서 then이 실행됨
  });
});

app.get('/chatroom', 로그인했니, function (요청, 응답) {
  db.collection('chatroom').find({ member: 요청.user._id }).toArray().then((결과) => {
    console.log(결과);
    응답.render('chatroom.ejs', { data: 결과 })
  })
});
// function 채팅중복이니(요청, 응답, next) {
//   if (요청.user) { // 요청.user 로그인 한 유저의 DB상 정보 / id, pw, name...
//     // 사용하려면 deserializeUser 부분 개발 필요
//     // deserializeUser(): 세션아이디를 바탕으로 이 유저의 정보를 DB에서 찾아주세요
//     // 요청.user에 꽂아줌
//     next();
//     console.log(요청.user); // { _id: 64c0ad634ad830ef07893ff2, id: 'test', pw: 'test' }
//   }
//   else {
//     응답.send('로그인 안했누;;');

//   }
// }

app.post('/messages', 로그인했니, (요청, 응답) => {
  var 저장할거 = {
    parent: 요청.body.parent,
    userid: 요청.user._id,
    content: 요청.body.content,
    date: new Date(),
  }

  db.collection('messages').insertOne(저장할거)
    .then((결과) => {
      응답.send(결과);
    })
})

// 실시간 소통채널
app.get('/messages/:parentid', 로그인했니, function (요청, 응답) {
  응답.writeHead(200, {
    "Connection": "keep-alive",
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
  });

  //   // /message/어쩌구로 실시간 채널에접속하면
  //   // db에서 parent: 어쩌구를 가진게시물 다 보여줌
  //   // JSON.stringfy 쓰는 이유 : 실시간 채널은 문자만 전송 가능/ JSON.stringfy <=> JSON.parse()
  db.collection('messages').find({ parent: 요청.params.parentid }).toArray()
    .then((결과) => {
      console.log(결과);
      응답.write('event: test\n');
      응답.write(`data: ${JSON.stringify(결과)}\n\n`);
    });


  const 찾을문서 = [
    { $match: { 'fullDocument.parent': 요청.params.parentid } }
  ];

  const changeStream = db.collection('messages').watch(찾을문서);

  changeStream.on('change', (result) => {
    console.log(result.fullDocument);
    응답.write('event: test\n');
    var 추가된문서 = [result.fullDocument];
    응답.write(`data: ${JSON.stringify(추가된문서)}\n\n`);
  });
});

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@     소켓통신    @@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// 누군가 웹소켓으로 서버에 connection하면 콘솔에 출력
io.on('connection', function (socket) {
  console.log('연결되었어요');
  // console.log(socket); // 소켓으로 메세지를 보낼 때 id와 header 정보도 전달됨
  // 유니크한 id도 확인 가능해서 원하는 사람한테만 메세지전달도 가능

  // io.to(socket.id).emit('broadcast', '서버응답임'); // 원하는 소켓id를 가진 사람한테만 메세지 보내기 가능

  socket.on('user-send', function (data) { // user-send 이벤트가 발생하면
    //console.log(data);
    io.emit('broadcast', 'data'); // io.emit 서버가 유저들에게 메세지를 보내고 싶을때
    // 모든 유저에게 보내는걸 broadcast라고함
    // ->단체 채팅방하고 비슷한듯?
  });

  // 방입장 요청
  socket.on('joinroom', function (data) {
    socket.join("room1");
  });

  // 방내부 사람에게만 내용 전달.
  socket.on('room1-send', function (data) {
    io.to("room1").emit('broadcast', data);
  });

});

app.get('/socket', function (요청, 응답) {
  응답.render('socket.ejs')
});

