### TRAIN FRONTEND

### CSS BASIC EDX

1-WEBCAM

step1: set src-object of a <video> element to the live video stream object-webcam.
step2: navigator.getUserMedia(para) Method from the getUserMedia API.
step3:

start

- After successfully retrieving the src, we attach the obtained src to the src-object of the video.(video.play(); chạy)
- Take failure, run to find fault.

stop

- A.getTracks()[0].stop(); (audio)
- A.getTracks()[1].stop(); (video)

linkndemo: https://github.com/GiangNguyen05/Training-Frontend/blob/master/HTMLCSS/Day9/photobooth.html

2-RECORD

step1: Create a mediaRecorder from a stream
step2: Add a "data handler" and call the start() method of the mediaRecorder object
step3: When you've finished recording, tell the mediaRecorder to stop
step4: Create a BLOB (Binary Large OBject) with the collected data, and conect it to the src attribute of an HTML5 video player
step5: Download the captured stream
