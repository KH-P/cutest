            var slider;
            var people = 2;
            for (let i = 0; i < people; i++) {
                if (i == 0) {
                    slider =
                        "<div class='swiper-slide' id='slide-example'> " +
                        "<div class='marker-best'>BEST</div>" +
                        "<div class='slide-squre'></div>" +
                        "<div class='slide-circle'></div>" +
                        "<div class='slide-face'><img src='img/example_girl.png' /></div>" +
                        "<div class='slide-bar'></div>" +
                        "<div class='text-name'>영희</div>" +
                        "<div class='text-score'>95%</div>" +
                        "<div class='text-score2'>귀요미 수치</div>" +
                        "<div class='text-gender'>여</div>" +
                        "<div class='text-gender2'>성별</div>" +
                        '</div>';
                } else if (i == 1) {
                    slider +=
                        "<div class='swiper-slide' id='slide-example'> " +
                        "<div class='slide-squre'></div>" +
                        "<div class='slide-circle'></div>" +
                        "<div class='slide-face'><img src='img/example_boy.png' /></div>" +
                        "<div class='slide-bar'></div>" +
                        "<div class='text-name'>철수</div>" +
                        "<div class='text-score'>92%</div>" +
                        "<div class='text-score2'>귀요미 수치</div>" +
                        "<div class='text-gender'>남</div>" +
                        "<div class='text-gender2'>성별</div>" +
                        '</div>';
                }
            }
            //$('.swiper-wrapper').append(slider);
            //$('[id="slide-example"]').hide();





var p_expression;
var p_age;
var p_gender;
var p_score;
var p_name;
var ck_error;

async function init() {
    await faceapi.nets.ssdMobilenetv1.loadFromUri('./models');
    await faceapi.nets.faceExpressionNet.loadFromUri('./models');
    await faceapi.nets.ageGenderNet.loadFromUri('./models');
    //await faceapi.nets.faceLandmark68Net.loadFromUri('./models');
    //await faceapi.nets.tinyFaceDetector.loadFromUri('./models');
    const image = document.querySelector('#face-image');
    const detection = await faceapi
        //.detectSingleFace(image)
        .detectAllFaces(image)
        //.withFaceLandmarks()
        .withFaceExpressions()
        .withAgeAndGender();
    console.log('test');

    
    console.log(detection[0]);
    console.log(detection[0].age);
    console.log(detection.length);
    
    for (let i = 0; i < detection.length; i++) {
    if (!detection[i]) {
        ck_error = 1;
        console.log('error');
    } else {
        console.log('인식 : ' + detection.detection.score);
        console.log('나이 : ' + detection.age);
        console.log('성별 : ' + detection.gender);
        expresss = Object.keys(detection.expressions);
        let max_probab = 0;
        for (let i = 0; i < expresss.length; i++) {
            probab = parseFloat(detection.expressions[expresss[i]]).toFixed(2);
            console.log(expresss[i] + ' : ' + probab);
            if (max_probab < probab) {
                max_probab = probab;
                p_expression = expresss[i];
            }
        }
        console.log('감정 : ' + p_expression);
        a_x = parseFloat(detection.age).toFixed(0);
        p_age = parseFloat((1 / 600) * a_x * a_x + (13 / 12) * a_x - 1).toFixed(0);
        console.log('계산나이 : ' + p_age);
        p_gender = detection.gender;
        p_score = parseFloat(detection.detection.score).toFixed(2);

        xy_offset = 10;
        face_x = detection.detection.box._x - xy_offset;
        face_y = detection.detection.box._y - xy_offset;
        face_width = detection.detection.box._width + xy_offset * 2;
        face_height = detection.detection.box._height + xy_offset * 2;
        console.log('x : ' + face_x);
        console.log('y : ' + face_y);
        console.log('_width : ' + face_width);
        console.log('_height : ' + face_height);
        const regionsToExtract = [new faceapi.Rect(face_x, face_y, face_width, face_height)];
        const face = await faceapi.extractFaces(image, regionsToExtract);

        if (p_gender == 'male') {
            nan = Math.floor(Math.random() * 100);
            k_gender = "남";
        }
        else {
            nan = Math.floor(Math.random() * 100 + 100);
            k_gender = "여";
        }
        await $.getJSON('name.json', function (data) {
            p_name = data[nan]['name'];
        });

        var html_face =
            "<div class='swiper-slide'>" +
            "<div class='marker-best'>BEST</div>" +
            "<div class='slide-squre'></div>" +
            "<div class='slide-circle'></div>" +
            "<div class='slide-face'></div>" +
            "<div class='slide-bar'></div>" +
            "<div class='text-name'>" +
            p_name +
            '</div>' +
            "<div class='text-score'>95%</div>" +
            "<div class='text-score2'>귀요미 수치</div>" +
            "<div class='text-gender'>" +
            k_gender +
            '</div>' +
            "<div class='text-gender2'>성별</div>" +
            '</div>';
        $('[id="slide-example"]').hide();
        $('.swiper-wrapper').append(html_face);
        $('.slide-face').append(face);
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
    /*
    var result_message = "▼ AI쵸프가 추천드리는 선물입니다! <i class='fas fa-gift'></i> ▼";
    $('.result-message').html(result_message);
    var result_add = '<script>new PartnersCoupang.G({ id:' + cupang_id + ' });</script>';
    $('.ins-add').append(result_add);
    $('ins').not($('.kakao_ad_area')).insertAfter('.ins-add');
    }
    */
}