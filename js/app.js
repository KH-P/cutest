var p_expression;
var p_age;
var p_gender;
var p_score;
var p_name;
var p_cute;
var ck_error;
var arr = [];

async function init() {
    const image = document.querySelector('#face-image');
    await faceapi.nets.ssdMobilenetv1.loadFromUri('./models');
    await faceapi.nets.faceExpressionNet.loadFromUri('./models');
    await faceapi.nets.ageGenderNet.loadFromUri('./models');
    //await faceapi.nets.faceLandmark68Net.loadFromUri('./models');
    //await faceapi.nets.tinyFaceDetector.loadFromUri('./models');
    const detection = await faceapi
        //.detectSingleFace(image)
        .detectAllFaces(image)
        //.withFaceLandmarks()
        .withFaceExpressions()
        .withAgeAndGender();
    console.log('test');
    console.log(detection);
    console.log(detection[0]);
    console.log(detection.length);

    if (detection.length == 0) {
        ck_error = 1;
        console.log('error');
    } else {
        for (let i = 0; i < detection.length; i++) {
            console.log('인식 : ' + detection[i].detection.score);
            console.log('나이 : ' + detection[i].age);
            console.log('성별 : ' + detection[i].gender);
            expresss = Object.keys(detection[i].expressions);
            let max_probab = 0;
            for (let j = 0; j < expresss.length; j++) {
                probab = parseFloat(detection[i].expressions[expresss[j]]).toFixed(2);
                console.log(expresss[j] + ' : ' + probab);
                if (max_probab < probab) {
                    max_probab = probab;
                    p_expression = expresss[j];
                }
            }
            a_x = parseFloat(detection[i].age).toFixed(0);
            p_age = parseFloat((1 / 600) * a_x * a_x + (13 / 12) * a_x - 1).toFixed(0);
            console.log('감정 : ' + p_expression);
            console.log('계산나이 : ' + p_age);
            
            if(detection[i].gender == "female") p_gen_bonus = 1.08;
            else p_gen_bonus = 1;
            p_happy = parseFloat(detection[i].expressions[expresss[1]]).toFixed(2);
            p_angry = parseFloat(detection[i].expressions[expresss[3]]).toFixed(2);
            
            p_cute = parseFloat((100 - p_age + (p_happy - p_angry)*20) * p_gen_bonus / 120 * 100).toFixed(0);
            console.log('귀요미수치 : ' + p_cute);

            arr.push({ idx: i, cute: p_cute });
        }

        console.log(arr);
        $('[id="slide-example"]').hide();

        if (arr.length > 1) {
            var sortingField = 'cute';
            arr.sort(function (a, b) {
                return b[sortingField] - a[sortingField];
            });
        }

        for (var key in arr) {
            console.log('나이 : ' + detection[0].age);
            var i = arr[key].idx;
            p_gender = detection[i].gender;
            xy_offset = 50;
            face_x = detection[i].detection.box._x - xy_offset;
            face_y = detection[i].detection.box._y - xy_offset;
            face_width = detection[i].detection.box._width + xy_offset * 2;
            face_height = detection[i].detection.box._height + xy_offset * 2;
            const regionsToExtract = [new faceapi.Rect(face_x, face_y, face_width, face_height)];
            const face = await faceapi.extractFaces(image, regionsToExtract);

            if (p_gender == 'male') {
                nan = Math.floor(Math.random() * 100);
                k_gender = '남';
            } else {
                nan = Math.floor(Math.random() * 100 + 100);
                k_gender = '여';
            }
            await $.getJSON('name.json', function (data) {
                p_name = data[nan]['name'];
            });

            if (key == 0) best = "<div class='marker-best'>BEST</div>";
            else best = '';
            
            var p_cute_color;
            if(arr[key].cute >= 90) p_cute_color = "#fa5858";
            else if(arr[key].cute >= 80) p_cute_color = "#FE9A2E";
            else if(arr[key].cute >= 60) p_cute_color = "#2EFE2E";
            else if(arr[key].cute >= 40) p_cute_color = "#5858FA";
            else p_cute_color = "#BDBDBD";

            var html_face =
                "<div class='swiper-slide'>" +
                best +
                "<div class='slide-squre'></div>" +
                "<div class='slide-circle'></div>" +
                "<div class='slide-face'></div>" +
                "<div class='slide-bar'></div>" +
                "<div class='text-name'>" +
                p_name +
                '</div>' +
                "<div class='text-score' style='color:" + p_cute_color + "'>" + arr[key].cute + "%</div>" +
                "<div class='text-score2'>귀요미 수치</div>" +
                "<div class='text-gender'>" +
                k_gender +
                '</div>' +
                "<div class='text-gender2'>성별</div>" +
                '</div>';

            $('.swiper-wrapper').append(html_face);
            $('.slide-face').append(face);
        }
    }
}

async function recommand() {
    if (ck_error) {
        var result_message = '귀요미 분석 실패!';
        $('.result-message').html(result_message);
    } else {
        var result_message = '귀요미 분석 완료!';
        $('.result-message').html(result_message);
    }
}