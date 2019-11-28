//jQuery________
$(function() {
        
    var loc = location.href;
    
    //現在ページを取得（できなければ 1 を代入）
    var str = /age=\d{1,}/;
    var current = loc.match(str);
    var currentPage = (current) ? current[0].replace('age=','') : 1;
    

    //DOM で pager 部分の最大値を抜き出す
    var max = 1;    
    if($('.pageAnchor').length){ //pagenation の有無を判定
        var pager = $('.pageAnchor a');    
        $array = $.makeArray($(pager));
        var pageNum = [];
        $(pager).each(function() {
            pageNum.push($(this).text()) 
        });
        max = Math.max.apply(null, pageNum);
    }

    //ページ数分の配列を作成
    var page = [];
    for(var i=0; i<max; i++){
        page[i] = i+1;
    }
    
    //現在ページは配列から除外して max を減算
    page = page.filter(function(v){
        return v != currentPage;
    });
    page = shuffle(page);
    max -= 1;
        console.log(page);
    
    
    //基本変数 *scrape より前に要宣言*
    var list = [];
    var items = 0;
    var count = 0;
    var spec = '1280_960\/';

    var device = $('body').attr('class').indexOf('touch-device');
    
    var case1 = "medibang.com/picture/";
    var case2 = "medibang.com/contentsSearch/";
    var case3 = "medibang.com/u/";
    var case4 = "medibang.com/author/";
    
    
    branch($('body'));

    function branch(source){
         if(loc.indexOf(case1) != -1 || loc.indexOf(case2) != -1){
             //デバイス分岐
             if(device == -1){
                scrape(source);
                }else{
                scrape_t(source);    
                };

         }else if(loc.indexOf(case3) != -1 || loc.indexOf(case4) != -1)
            {
             //デバイス分岐
             if(device == -1){
                scrape_u(source);
                }else{
                scrape_u_t(source);    
                }; 
            }
            return list;
    }


 
    //title,author,img の抽出 _________________
    function scrape(source){
        
        //ページ内の件数を取得
        var source = $(source).find('.square-layout');
        var elms = $(source).find(".picturelist-cont-detail").length;
        items += elms;
        
        var tmp = [];
        for (var i=0; i<elms; i++) {
            var img = $(source).find('.picturelist-cont-thumb').eq(i).find('img').attr('src');
            //var originUrl = $(source).find('.picturelist-cont-ttl').eq(i).find('a').attr('href');
            var originUrl = $(source).find('.picturelist-cont-thumb').eq(i).find('a').attr('href');
            var originUrl = originUrl.split("?");
            var originUrl = originUrl[0];
            //var title = $(source).find('.picturelist-cont-ttl').eq(i).find('a').text();
            //var title = $.trim(title);
            var title = "";
            var author = $(source).find('.picturelist-cont-author-name').eq(i).find('a').text();
            var author = $.trim(author);
            
                if(img != undefined){
                    tmp.push([title,author,img,originUrl]);
                }   
            }
            
            tmp = shuffle(tmp);
            list = list.concat(tmp);
            return list;
        }

    
    //touchdevice UI _________________
    function scrape_t(source){
        
        //ページ内の件数を取得
        var source = $(source).find('.square-layout');
        var elms = $(source).find(".illust-item").length;
        items += elms;
        
        var tmp = [];
        for (var i=0; i<elms; i++) {
            var img = $(source).find('.illust-item_image').eq(i).find('img').attr('src');
            //var title = $(source).find('.illust-item_heading').eq(i).find('a').text();
            //var title = $.trim(title);
            var title = "";
            var originUrl = $(source).find('.illust-item_box').eq(i).find('a').attr('href');
            var originUrl = originUrl.split("?");
            var originUrl = originUrl[0];
            var author = $(source).find('.illust-item_link').eq(i).text();
            var author = $.trim(author);

                if(img != undefined){
                    tmp.push([title,author,img,originUrl]);
                }   
            }
        
            tmp = shuffle(tmp);
            list = list.concat(tmp);
            return list;
        }

        
    //authorpage UI _________________
    function scrape_u(source){
        var elms = $(source).find(".box_galleryList article").length;
        items += elms;
                
        var tmp = [];
        for (var i=0; i<elms; i++) {
            var img = $(source).find('.box_gallery').eq(i).find('img').attr('src');
            var originUrl = $(source).find(".box_galleryList article").eq(i).find('.tit').find('a').attr('href');
            var title = $(source).find(".box_galleryList article").eq(i).find('.tit').text();
            var title = $.trim(title);
            var author = $(source).find('.name').text();
            var author = $.trim(author);            
                if(img != undefined){
                    tmp.push([title,author,img,originUrl]);
                }   
            }
            
            tmp = shuffle(tmp);
            list = list.concat(tmp);
            return list;
        }   
    

    //authorpage TouchDevice _________________
    function scrape_u_t(source){
        var elms = $(source).find(".view-item").length;
        items += elms;        

        var tmp = [];
        for (var i=0; i<elms; i++) {
            var img = $(source).find('.view-item_image').eq(i).find('img').attr('src');
            var originUrl = $(source).find('.view-item_image').eq(i).parent().attr('href');
            var title = $(source).find('.view-item_heading').eq(i).text();
            var title = $.trim(title);
            var author = $(source).find('.asAuthorProfile__authorName').text();
            var author = $.trim(author);            
                if(img != undefined){
                    tmp.push([title,author,img,originUrl]);
                }   
            }
            
            tmp = shuffle(tmp);
            list = list.concat(tmp);
            return list;
        }      
    

    
//Fisher–Yates
    function shuffle(array) {
    var n = array.length, t, i;
 
    while (n) {
      i = Math.floor(Math.random() * n--);
      t = array[n];
      array[n] = array[i];
      array[i] = t;
    }
    return array;
    }
    

    
//iframe __________________________________    
    function createIframe(nextNum,count,spec){
        console.log('max :'+max);

        if (current) {
            var nextUrl = loc.replace(str, "age="+page[nextNum]);
        }else if(loc.indexOf('?')!=-1){
            var nextUrl = loc.replace('?', '?page='+page[nextNum]+'&');
             }else{
            var nextUrl = loc + '?page='+page[nextNum];
             }  

        console.log(nextUrl);

        
        var ifm = '<iframe id="ifm" width="1px" height="1px" src="'+nextUrl+'"></iframe>'
        $('html').append(ifm);
        
        
        var result = new Promise(function(resolve,reject) {
            $('#ifm').on('load',function(){
                setTimeout(function(){
                    var source = $('#ifm').contents();
                        resolve(source);                    
                },3000); //念のため
            });
        });
        
        result.then(function(source){
                list = branch(source);
                        
            player(list,items,count,spec);
        } )
            .then(function(){
                $('#ifm').off();
                $('#ifm').remove()
        });
        
    } //createIframe ////////////////       
    
    
    
    
//UI replace_____________
        $('body').empty();    
    
        $('body').append('<div class="control"></div>');
        $(".control").append('<div class="navi"></div>');
        //$(".navi").append('<h1 id="title"></h1><div class="author">Author&nbsp;:&nbsp;</div><div id="author"></div>');
        $(".navi").append('<h1 id="title"><div class="author">Author&nbsp;:&nbsp;</div><div id="author"></div></h1>');
    
        $('.control').append('<div class="overlay"></div>');    
        $('.overlay').append('<div id="settingText"></div>');

        $(".control").append('<footer class="" ontouchstart=""></footer>');
        $(".control").append('<div id="target"></div>');
    
        $("footer").append('<div><a id="originUrl">Open</a></div>');
        $("footer").append('<div id="clip">+Clip</div>');
        $("#clip").append('<div id="result">Added to the Browse History !</div>');
   
    
    //Setting Menu _____________ 
        $("footer").append('<div id="setting">≡ Settings</div>');

        $("#setting").on('click',function(){
            if($(".overlay").hasClass("overlayed"))
            {
                cancelOverlay();
                release();
                $('#settingText').hide();

            }else{
                overlay();
                pause();
                $('#settingText').show();
            }
        });
    
        $('#settingText').append('<div class="settingItem">* CYCLE *</div>');
        $('#settingText').append('<div id="settingCycle" class=""></div>');
                
        $('#settingCycle').append('<div id="slow">SLOW</div>');
        $('#slow').on("mousedown",{duration:24},controlDuration);
                
        $('#settingCycle').append('<div id="basic" class="selected">BASIC</div>');
         $('#basic').on("mousedown",{duration:17},controlDuration);

                    
        $('#settingCycle').append('<div id="quick">QUICK</div>');
        $('#quick').on("mousedown",{duration:10},controlDuration);

    //Image Size
        $('#settingText').append('<div class="settingItem">* IMAGE SPEC *</div>');
        $('#settingText').append('<div id="settingSpec" class=""></div>');
    
        $('#settingSpec').append('<div id="lite">LITE</div>');
        $('#settingSpec').append('<div id="basicSize" class="selected">BASIC</div>');
        $('#settingSpec').append('<div id="high">HIGH</div>');

              
    //skip Elm _____________ 
        $("footer").append('<div id="prev">&lt; Prev</div>');
        $("footer").append('<div id="next">Next &gt;</div>');
    
    
//UI replace ///////////////////
    
    //選択されている画質 _____________ 
    function controlSize(event){
        event.stopPropagation();
        var id = event.data.id;
        $(id).siblings().removeClass('selected');
        $(id).addClass('selected');
        $(id).css('color','#fff');  

    };  

    //表示速度の変更 _____________ 
    function controlDuration(event){
        event.stopPropagation();
        $('#target').css("backgroundImage",""); //画像を消しておかないと変更した duration 位置の画像が表示される
        var val = event.data.duration + 's';
        $('#target').css('animation-duration',val);
        $(this).siblings().removeClass('selected');
        $(this).addClass('selected');
        $(this).css('color','#fff');  

    };      

    //SKIP _____________ 
        function skip( event ) {
            var list = event.data.list;
            var items = event.data.items;
            var direction = event.data.direction;
            var spec = event.data.spec;
                        
            var count = event.data.count;
            if(direction == 'next'){
                count+=1;
            }else if(direction == 'prev'){
                count-=1;
            }
            
            //総数超過または負の値はリセット
            if(count > items-1 || count < 0) count = 0;
                
    //再発火用 _____________ 
            var el = $('.control'),
                newone = el.clone(true);
            el.before(newone);
            $("." + el.attr("class") + ":last").remove();
            player(list,items,count,spec);

        } //SKIP/////////////
    
    
    function clip(event){
        //var title = event.data.title;
        var author = event.data.author;
        var url = event.data.url;
        history.pushState("",author,url);
        document.title = author; //TITLE要素の変更
        $('#result').show(500).fadeOut(3000);
        $('#clip').off();
    } 

    
    if(list.length == 0){
            $('.overlay').addClass('overlayed');
            $('.overlay').append('<div id="overlayText"><p>It doesn\'t work on this page<br></p></div>');
            $('#overlayText').append('<p id="close">RELOAD</p>');
            $('#overlayText').css('display','block');
            $('#close').css('text-decoration','underline');
            $('#close').on('click',function(){location.href = loc;});
    };

    

    //starter_______________________
        player(list,items,count,spec);
 
    
//★Player Function★ ______________________________________________________________  
    
    function player(list,items,count,spec){

        console.log(spec);
        
        if(spec == '440_330\/'){
            $("#target").css('animation-name','slide');
        }else{
            $("#target").css('animation-name','zoom');            
        }
        

        console.log(count+'/'+items);
        var last = ((items-1)-count); 
        console.log(last);
        
        //permalink
        var originUrl = list[count][3];
        
        var img = new Image();        
        img.src = list[count][2];
       
    //image error 時に次の画像へスキップ
        $(img).off();
        $(img).on("error",function(){ 
            console.log("image "+ count +" is not found");
            count++;
            player(list,items,count,spec);
            return false;
        });
        
        
    //表示状態になっているメニュー等のリセット_____________
        $(".navi,footer").css('opacity','');
        $(".navi,footer").fadeOut();          
        $('#settingText').hide();
        $('#overlayText').remove(); 
        $('.overlay').removeClass('overlayed');
        clearTimeout(overlay_timer);
    ///////////メニューのリセット
        
        $('#originUrl').attr('href',originUrl);
        $('#originUrl').attr('target','_blank');
        

        $('#clip').off();
        //$('#clip').on("click",{title:list[count][0] , url:originUrl},clip);
        $('#clip').on("click",{author:list[count][1] , url:originUrl},clip);

        //スキップ機能
        $('#prev').off();
        $('#prev').on("click",{list:list,items:items,count:count,spec:spec,direction:'prev'},skip);

        $('#next').off();
        //連打緩和のための遅延
        if(last != 4) {
            setTimeout(function(){
            $('#next').on("click",{list:list,items:items,count:count,spec:spec,direction:'next'},skip);
            },5000);
            
        } //iframe 読み込み時に無効化

        
        //速度変更時にリスタート
        $("#settingCycle").off();
        $("#settingCycle").on("mouseup",{list:list,items:items,count:count,spec:spec,direction:'reset'},skip);
 
        $("#lite").off();        
        $('#lite').on("mouseup",{list:list,items:items,count:count,direction:'reset',spec:'440_330\/'},skip);
        $('#lite').on("mousedown",{id:'#lite'},controlSize);
  
        $('#basicSize').off();
        $('#basicSize').on("mouseup",{list:list,items:items,count:count,direction:'reset',spec:'1280_960\/'},skip);
        $('#basicSize').on("mousedown",{id:'#basicSize'},controlSize);

        $('#high').off();
        $('#high').on("mouseup",{list:list,items:items,count:count,direction:'reset',spec:''},skip);
        $('#high').on("mousedown",{id:'#high'},controlSize);
        
        
    //image preload
        var next = (last <= 1) ? 0 : count + 1; 
        var nextImg = list[next][2];
        var nextImg = nextImg.replace(/440_330\//, spec);
        $("<img>").attr("src", nextImg);   
        
        
        //メイン画像のload後に実行 ____________________________
        img.onload = function() {

        
        //画像URLの取得と表示    
            var imgUrl = list[count][2].replace(/440_330\//, spec);

            //コミックの画像urlには current という path があるので判別して、画像を置換する
        	if(list[count][2].indexOf('current')!=-1){
        		var imgUrl = imgUrl.replace(/1280_960\//, '');
        	}


            $('#target').fadeIn("3000"); //fadein にしておかないと transform 前の画像が一瞬表示されてしまう
            $('#target').css("backgroundImage","url('"+imgUrl+"')");   
            
        //再生開始    
            $('#target').css("animation-play-state","running");

            
        }//メイン画像の実行ここまで ____________________________
        
        //検証用 $('.navi').append(count+' , ');

        //css animation の開始をトリガー
        target = document.querySelector("#target");
        target.addEventListener('animationstart',animStart);
        function animStart(){
            
            //ナビメニューを表示
            $(".navi,footer").fadeIn();
            $(".navi,footer").addClass('appear');
            $("#author").html(list[count][1]);
            //$("#title").html(list[count][0]);  
                        
            //背景色を白黒切り替え
            if (count % 2 == 0){
            	$("body").addClass('bgc');
			} else {
            	$("body").removeClass('bgc');
			} 
        }
    
        //css transition の終了をトリガー
        navi = document.querySelector(".navi");
        navi.addEventListener('transitionend',naviAppear);
        function naviAppear(){
            $(".navi,footer").removeClass('appear'); 
            navi.removeEventListener('transitionend',naviAppear);
        }
        
        //css animation のループをトリガー
        target.addEventListener('animationiteration',animReset);
        function animReset(){
            $('#target').css("animation-play-state","pause");
            $('#target').fadeOut(1000).hide(); 
            $('#target').css("backgroundImage","");
        //hide しないとスキップ時に残像が出る。ただし animation duration を途中で短く変更した場合 hide されたままになってしまう。

            $(".navi,footer").removeClass('appear');  //念のためナビリセット
    

        //count を追加
            count++; 
        
        //リスト上限の超過を判定して0にリセット
        if(count>=(items) || count < 0){
                count = 0;
                console.log('reset');
            }  
            
        //removeEventListner    
            target.removeEventListener('animationiteration',animStart); 
            target.removeEventListener('animationiteration',animReset);    
            
            
        //css animation 終了　一定時間後に起動
            playTimer = setTimeout(player,1000,list,items,count,spec);
            
         //次のページをロード_____________
        if(max >= 1 && last == 4) {
            nextNum = max-1; //配列番号なので-1
            createIframe(nextNum,count,spec); //iframe で次のページを取得
            max--;
            clearTimeout(playTimer);
            }   

        } ///////anim-reset
        
        
        
    }/////////////// player ____________________
    

   

    //blur 時に動作を一時定時
    var timer = '';
    $(window).focus();
    $(window).on("blur",function(){
        timer = setTimeout(function(){
            pause()
            var blurResult = new Promise(function(resolve,reject) {
                overlay_timer = setTimeout(function(){
                resolve(overlay());                    
                },3000);
            });        
            blurResult.then(function(){                        
                addQuit();
            });
        },8000);
    });
    
    $(window).on("focus",function(){
        clearTimeout(timer);
    });
    

    //クリックで一時停止
    var overlay_timer;
    $(".overlay").on('click', function(){
    var stat = $("#target").css("animation-play-state");
        //動作中なら一時停止させ、overlay が出るのを待って quit を挿入
        if(stat=="running"){
            $("#target").css("animation-play-state","paused"); //関数pause/release を使うとカクつく
            $(".navi,footer").css('opacity','1.0');
            var result = new Promise(function(resolve,reject) {
                overlay_timer = setTimeout(function(){
                        resolve(overlay());                    
                },5000);
            });        
            result.then(function(){                        
                addQuit();
            });

        }else{
            $("#target").css("animation-play-state","running");
            $(".navi,footer").css('opacity','');        
            cancelOverlay();
            clearTimeout(overlay_timer);
            $('#settingText').hide();
        }
    });
    
    
    function overlay() {
        $('#overlayText').remove(); //重複表示回避
        $('.overlay').addClass('overlayed');
    }
    
    function addQuit() {
        $('#settingText').hide();
        $('.overlay').append('<div id="overlayText"></div>');
        $('#overlayText').append('<p>▶️ CONTINUE</p>');
        $('#overlayText').append('<p id="close"><span></span> QUIT</p>');
        $('#overlayText').fadeIn();
        
        $('#close').off();
        $('#close').on('click',function(e){
            e.stopPropagation();
            $("#target").css('filter','blur(5px)');
            location.href = loc;
            });
    }

    function cancelOverlay() {
        $('#overlayText').remove(); 
        $('.overlay').removeClass('overlayed');
    }
    
    
    function release(){
            $("#target").css("animation-play-state","running");
            $(".navi,footer").css('opacity','');        
    }

    function pause(){
            $("#target").css("animation-play-state","paused");
            $(".navi,footer").css('opacity','1.0');
    };

    
    
    //cursor disappear
    /*var cursor_timer = null;
    $('.control').on("mousemove", function() {
	clearTimeout(cursor_timer);
	$('.control').css("cursor","auto");
	cursor_timer = setTimeout(function() {
        $('.control').css("cursor","none");
	}, 3000);
    });*/
    
           });//jQuery________
