

$(document).ready(function() {
    $('#upload-button').on('click', function() {
        $('#file-input').click();
    });

    $('#file-input').on('change', function() {
        var files = this.files;
        var uploadCount = 0;

        for (var i = 0; i < files.length; i++) {
            uploadFile(files[i]);
        }

        function uploadFile(file) {
            var reader = new FileReader();

            reader.onloadstart = function() {
                $('#upload-loading').html('Uploading...');
            };

            reader.onprogress = function(event) {
                if (event.lengthComputable) {
                    var percentLoaded = Math.round((event.loaded / event.total) * 100);
                    $('#upload-loading').html('Uploading: ' + percentLoaded + '%');
                }
            };

            reader.onload = function(event) {
                var arrayBuffer = event.target.result;
                var blob = new Blob([arrayBuffer], { type: file.type });
                var url = URL.createObjectURL(blob);
                var video = $('<video controls></video>').attr('src', url);
                var downloadBtn = $('<a class="btn btn-primary download" download>Download</a>').attr('href', url);
                var uploadedVideoDiv = $('<div class="uploaded-video"></div>').append(video).append(downloadBtn);
                $('#uploaded-video-container').append(uploadedVideoDiv);
                uploadCount++;
                if (uploadCount === files.length) {
                    $('#upload-loading').html('Upload complete!');
                }

                // Convert to MPD on download
                downloadBtn.on('click', function() {
                    convertToMPD(blob, file.name);
                });
            };

            reader.onerror = function() {
                $('#upload-loading').html('Error occurred while uploading.');
            };

            reader.readAsArrayBuffer(file);
        }
    });

    function convertToMPD(blob, filename) {
        // Simulate conversion process
        setTimeout(function() {
            var mpdContent = '<?xml version="1.0" encoding="utf-8"?><MPD xmlns="urn:mpeg:dash:schema:mpd:2011" profiles="urn:mpeg:dash:profile:isoff-on-demand:2011" type="static" mediaPresentationDuration="PT0H1M30.03S"><Period><AdaptationSet mimeType="video/mp4" frameRate="30/1" segmentAlignment="true" startWithSAP="1" maxWidth="1920" maxHeight="1080" maxFrameRate="30"><Representation id="1" width="1920" height="1080" frameRate="30" bandwidth="2000000" codecs="avc1.640028"><BaseURL>video.mp4</BaseURL><SegmentBase indexRangeExact="true" indexRange="542-1075"><Initialization range="0-541"/></SegmentBase></Representation></AdaptationSet></Period></MPD>';
            var mpdBlob = new Blob([mpdContent], { type: 'application/dash+xml' });
            var url = URL.createObjectURL(mpdBlob);
            var a = document.createElement('a');
            a.href = url;
            a.download = filename.replace(/\.[^/.]+$/, "") + '.mpd';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }, 20); // Simulate 2 seconds for conversion
    }
});



