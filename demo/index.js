const p1 = document.getElementById('p1');
const p2 = document.getElementById('p2');

const event1 = new Event(p1);
const event2 = new Event(p2);

event1
  .add('click', () => { console.log('click'); })
  .add('click', () => { console.log('click again'); });

event2
  .add('custom:after5sec', () => { console.log('5s..'); })
  .add('custom:after5sec', () => { console.log('5s...'); });

setTimeout(() => {
  event2.trigger('custom:after5sec');
}, 5000);