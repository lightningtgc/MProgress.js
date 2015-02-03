(function(){
    //var newMp = new Mprogress('start');
    var mp = new Mprogress();

    var mp2 = new Mprogress({
        template: 2,
        parent: '#demoBuffer'
    });

    var mp3 = new Mprogress({
        template: 3,
        parent: '#demoIn'
    });

    var  mp4 = new Mprogress({
        template: 4,
        parent: '#demoQuery'
    });

    function bindEvent(){

        $("#demoDeStart").click(function() { 
            mp.start();
        });
        $("#demoDeSet").click(function() {
            mp.set(0.4);
        });
        $("#demoDeInc").click(function() { 
            mp.inc(); 
        });
        $("#demoDeEnd").click(function() {
            mp.end(true); 
        });

        // mp2
        $("#demoBufferStart").click(function() { 
            mp2.start();
        });
        $("#demoBufferEnd").click(function() { 
            mp2.end(true);
        });
        $("#demoBufferSet").click(function() {
            mp2.set(0.4);
        });
        $("#demoBufferSetBuffer").click(function() {
            mp2.setBuffer(0.5);
        });
        $("#demoBufferInc").click(function() { 
            mp2.inc();
        });

        // mp3 
        $("#demoInStart").click(function() { 
            mp3.start();
        });
        $("#demoInEnd").click(function() { 
            mp3.end(true);
        });

        // mp4 
        $("#demoQueryStart").click(function() { 
            mp4.start();
        });
        $("#demoQueryEnd").click(function() { 
            mp4.end(true);
        });
    }

    bindEvent();
}())
