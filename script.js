const timezoneSelect = document.querySelector('#timezone');
const locationName = document.querySelector('#location-name');
const cities = {
  'Europe/London': 'London, United Kingdom',
  'America/New_York': 'New York, United States',
  'Asia/Tokyo': 'Tokyo, Japan',
  'Asia/Kolkata': 'Kolkata, India',
  'Australia/Sydney': 'Sydney, Australia',
  'Africa/Cairo': 'Cairo, Egypt',
  'America/Los_Angeles': 'Los Angeles, United States'
};
const hourHand = document.querySelector('#hour-hand');
const minuteHand = document.querySelector('#minute-hand');
const secondHand = document.querySelector('#second-hand');
let alarm = { enabled: false, time: '' };
let lastAlarmMinute = '';

function updateClock() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: timezoneSelect.value, hour: 'numeric', minute: 'numeric', second: 'numeric',
    hour12: false, weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZoneName: 'longOffset'
  }).formatToParts(now);
  const get = (type) => parts.find((part) => part.type === type)?.value || '00';
  const hours = Number(get('hour')) % 12;
  const minutes = Number(get('minute'));
  const seconds = Number(get('second'));
  hourHand.style.transform = `translateX(-50%) rotate(${hours * 30 + minutes * 0.5}deg)`;
  minuteHand.style.transform = `translateX(-50%) rotate(${minutes * 6 + seconds * 0.1}deg)`;
  secondHand.style.transform = `translateX(-50%) rotate(${seconds * 6}deg)`;
  document.querySelector('#digital-time').textContent = `${get('hour')}:${get('minute')}:${get('second')}`;
  document.querySelector('#date-text').textContent = `${get('weekday')}, ${get('month')} ${get('day')}, ${get('year')}`;
  const offset = get('timeZoneName').replace('GMT', 'UTC') || 'UTC';
  document.querySelector('#utc-offset').textContent = offset.replace('UTC', '') || '+00:00';
  checkAlarm(get('hour'), get('minute'));
}
function checkAlarm(hour, minute) {
  if (alarm.enabled && `${hour}:${minute}` === alarm.time && lastAlarmMinute !== `${hour}:${minute}`) {
    lastAlarmMinute = `${hour}:${minute}`;
    document.querySelector('#alarm-notice').textContent = 'Alarm ringing';
    alert('Chronos alarm: it is time.');
  }
}
timezoneSelect.addEventListener('change', () => { locationName.textContent = cities[timezoneSelect.value]; updateClock(); });
setInterval(updateClock, 1000);
updateClock();

let stopwatch = { running: false, start: 0, elapsed: 0 };
function formatStopwatch() {
  const value = stopwatch.running ? stopwatch.elapsed + Date.now() - stopwatch.start : stopwatch.elapsed;
  const milliseconds = value % 1000;
  const seconds = Math.floor(value / 1000) % 60;
  const minutes = Math.floor(value / 60000) % 60;
  const hours = Math.floor(value / 3600000);
  document.querySelector('#stopwatch-time').textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(Math.floor(milliseconds / 10)).padStart(2, '0')}`;
}
setInterval(formatStopwatch, 30);
document.querySelector('#start-stopwatch').addEventListener('click', () => {
  if (stopwatch.running) { stopwatch.elapsed += Date.now() - stopwatch.start; stopwatch.running = false; document.querySelector('#start-stopwatch').innerHTML = 'Start <span>▶</span>'; }
  else { stopwatch.start = Date.now(); stopwatch.running = true; document.querySelector('#start-stopwatch').innerHTML = 'Pause <span>Ⅱ</span>'; }
});
document.querySelector('#reset-stopwatch').addEventListener('click', () => { stopwatch = { running: false, start: 0, elapsed: 0 }; document.querySelector('#start-stopwatch').innerHTML = 'Start <span>▶</span>'; formatStopwatch(); });
document.querySelector('#set-alarm').addEventListener('click', () => { alarm.time = document.querySelector('#alarm-time').value; alarm.enabled = document.querySelector('#alarm-enabled').checked; document.querySelector('#alarm-status').textContent = alarm.enabled && alarm.time ? `Alarm set for ${alarm.time}` : 'No alarm set'; document.querySelector('#alarm-notice').textContent = alarm.enabled && alarm.time ? 'Alarm armed' : ''; });
document.querySelectorAll('.tab').forEach((tab) => tab.addEventListener('click', () => { document.querySelectorAll('.tab').forEach((item) => item.classList.remove('active')); tab.classList.add('active'); document.querySelectorAll('.tool-panel').forEach((panel) => panel.classList.add('hidden')); document.querySelector(`#${tab.dataset.tab}-panel`).classList.remove('hidden'); }));
