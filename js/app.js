var p_expression;
var p_age;
var p_gender;
var p_score;
var p_name;
var p_cute;
var ck_error;
var arr = [];

async function init() {    
    console.log('start-init');
    
    //console.log(await document.querySelector('#face-image').src);
    //console.log(img_src);

                        var img = document.createElement("img");
                        img.src = await document.querySelector('#face-image').src;
                        var w;
                        var h;
                        //img.onload = function () {
                            //w = this.width;
                            //h = this.height;
                        var canvas = document.createElement("canvas");
                        var ctx = canvas.getContext("2d");
                        ctx.drawImage(img, 0, 0);
                        console.log(ctx);
                        var MAX_WIDTH = 500;
                        var MAX_HEIGHT = 500;
                        var width = img.width;
                        var height = img.height;
                        console.log(width);
                        if (width > height) {
                            if (width > MAX_WIDTH) {
                                height *= MAX_WIDTH / width;
                                width = MAX_WIDTH;
                            }
                        } else {
                            if (height > MAX_HEIGHT) {
                                width *= MAX_HEIGHT / height;
                                height = MAX_HEIGHT;
                            }
                        }
                        canvas.width = width;
                        canvas.height = height;
                        var ctx = canvas.getContext("2d");
                        ctx.drawImage(img, 0, 0, width, height);
                        dataurl = canvas.toDataURL('image/jpeg');
    //console.log(dataurl);
    console.log(ctx);
                        console.log(canvas);
                        console.log(width);

    console.log('model_bef');
    const image = document.querySelector('#face-image');
    console.log(image);
    //console.log(dataurl);
    var img_resize = document.createElement("img");
    //$("html").append('<img src="' + dataurl + '" class="img-item">');
    img_resize.src = dataurl;
    //console.log(img_resize);
    
    console.time();
    //await faceapi.nets.ssdMobilenetv1.loadFromUri('models');
    //await faceapi.nets.faceExpressionNet.loadFromUri('models');
    //await faceapi.nets.ageGenderNet.loadFromUri('models');
    //await faceapi.nets.ssdMobilenetv1.load('models/ssd_mobilenetv1_model-weights_manifest.json');
    //await faceapi.nets.faceExpressionNet.load('models/face_expression_model-weights_manifest.json');
    //await faceapi.nets.TinyFaceDetector.load('models/tiny_face_detector_model-weights_manifest.json');
    //await faceapi.loadTinyFaceDetectorModel('models');
    await faceapi.loadSsdMobilenetv1Model('models')
    await faceapi.nets.ageGenderNet.load('models/age_gender_model-weights_manifest.json');
    console.timeEnd();
    
    //const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 512, scoreThreshold: 0.3 });
    //const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 160 });
    //const options = new faceapi.SsdMobilenetv1Options();
    const options = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.4 });
    
    console.log('model_aft');
    console.log('detect_start');
    console.time();
    const detection = await faceapi
        .detectAllFaces(img_resize, options)
        //.withFaceExpressions()
        .withAgeAndGender();
    console.log('detect_end');
    console.timeEnd();
    /*
    console.log('test');
    console.log(detection);
    console.log(detection[0]);
    console.log(detection.length);
    */

    if (detection.length == 0) {
        ck_error = 1;
        console.log('error');
    } else {
        console.log('face_start');
        for (let i = 0; i < detection.length; i++) {
            /*
            expresss = Object.keys(detection[i].expressions);
            let max_probab = 0;
            for (let j = 0; j < expresss.length; j++) {
                probab = parseFloat(detection[i].expressions[expresss[j]]).toFixed(2);
                //console.log(expresss[j] + ' : ' + probab);
                if (max_probab < probab) {
                    max_probab = probab;
                    p_expression = expresss[j];
                }
            }
            p_happy = parseFloat(detection[i].expressions[expresss[1]]).toFixed(2);
            p_angry = parseFloat(detection[i].expressions[expresss[3]]).toFixed(2);  
            */
            
            a_x = parseFloat(detection[i].age).toFixed(0);
            p_age = parseFloat((1 / 600) * a_x * a_x + (13 / 12) * a_x - 1).toFixed(0);
            
            if(detection[i].gender == "female") p_gen_bonus = 1.08;
            else p_gen_bonus = 1;
                      
            //p_cute = parseFloat((100 - p_age + (p_happy - p_angry)*20) * p_gen_bonus / 120 * 100).toFixed(0);
            p_cute = parseFloat((100 - p_age) * p_gen_bonus / 110 * 100).toFixed(0);
            
            arr.push({ idx: i, cute: p_cute });
            
            /*
            console.log('인식 : ' + detection[i].detection.score);
            console.log('나이 : ' + detection[i].age);
            console.log('성별 : ' + detection[i].gender);
            console.log('감정 : ' + p_expression);
            console.log('계산나이 : ' + p_age);
            console.log('귀요미수치 : ' + p_cute);
            */
        }
        //console.log(arr);
        $('[id="slide-example"]').hide();
        
        if (arr.length > 1) {
            var sortingField = 'cute';
            arr.sort(function (a, b) {
                return b[sortingField] - a[sortingField];
            });
        }
        for (var key in arr) {
            var i = arr[key].idx;
            p_gender = detection[i].gender;
            xy_offset = 10;
            face_x = detection[i].detection.box._x - xy_offset;
            face_y = detection[i].detection.box._y - xy_offset;
            face_width = detection[i].detection.box._width + xy_offset * 2;
            face_height = detection[i].detection.box._height + xy_offset * 2;
            const regionsToExtract = [new faceapi.Rect(face_x, face_y, face_width, face_height)];
            const face = await faceapi.extractFaces(img_resize, regionsToExtract);

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
