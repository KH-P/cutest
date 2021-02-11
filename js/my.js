function showClock() {
    var currentDate = new Date();
    var divClock = document.getElementById('divClock');
    var msg;

    if(currentDate.getHours()>9) msg = currentDate.getHours() + ':';
    else msg = '0' + currentDate.getHours() + ':';
    if(currentDate.getMinutes()>9) msg += currentDate.getMinutes() + ' ';
    else msg += '0' + currentDate.getMinutes() + ' ';

    divClock.innerText = msg;

    setTimeout(showClock, 1000);
}