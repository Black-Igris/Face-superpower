const video = document.getElementById('video')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    resizedDetections.forEach(detection => {
      const { top, left, width, height } = detection.detection.box
      const name = 'L2bc' // Replace with the person's name
      const textY = top > 10 ? top - 5 : top + height + 15

      new faceapi.draw.DrawTextField(
        [name],
        detection.detection.box.topRight
      ).draw(canvas)

      canvas.getContext('2d').fillStyle = '#FFFFFF'
      canvas.getContext('2d').font = '14px Arial'
      canvas.getContext('2d').fillText(name, Right, textY)
    })
  }, 100)
})
