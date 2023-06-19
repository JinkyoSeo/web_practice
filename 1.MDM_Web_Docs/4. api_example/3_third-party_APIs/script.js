L.mapquest.key = 'UIqwU9jGaWKM8qj3lVO6fP7k1cCz4DyU';

// 'map' refers to a <div> element with the ID map
const map = L.mapquest.map('map', {
  center: [53.480759, -2.242631],
  // 1. change 'map' to 'hybrid', try other type of map
  layers: L.mapquest.tileLayer('map'),
  zoom: 12
});

// 2. Add control
map.addControl(L.mapquest.control());

// 3. Add icon
L.marker([53.480759, -2.242631], {
  icon: L.mapquest.icons.marker({
    primaryColor: '#22407F',
    secondaryColor: '#3B5998',
    shadow: true,
    size: 'md',
    symbol: 'A'
  })
})
.bindPopup('This is Manchester!')
.addTo(map);

// 지도가 뜨지 않은 문제 해결 참고 사이트
// https://codemasterkimc.tistory.com/128