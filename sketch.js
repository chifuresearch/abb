let video;
let poseNet;
let poses = [];

// 貼圖
let moji;
let newcenter={x:0,y:0}//新圖的中心位置
let newsize;//新圖的中心位置
let newangle;

function preload(){
  moji = loadImage('asset/moji.png');
}
function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  // 使用poseNet
  poseNet = ml5.poseNet(video, modelReady);
  // 取得 pose 結果
  poseNet.on("pose", function(results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();
}

function modelReady() {
}

function draw() {
  //抓取圖片後
  image(video, 0, 0, width, height);
  // 畫特徵點
  drawKeypoints();
  // 畫骨骼連線
  drawSkeleton();
  // 畫表情
  drawMoji();
}

function drawKeypoints() {
  for (let i = 0; i < poses.length; i += 1) {
    const pose = poses[i].pose;
    // 將pose底下所有關節點出
    for (let j = 0; j < pose.keypoints.length; j += 1) {
      const keypoint = pose.keypoints[j];
      if (keypoint.score > 0.2) {
        fill(255, 0, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
      
      
    }
    // 表情資料
    // 0:nose(中心) / 1:Leye / 2:Reye / 3:Lear 4:Rear(左右大小)
      if(i==0) {
        // 新中心
        newcenter.x = pose.keypoints[0].position.x;
        newcenter.y = pose.keypoints[0].position.y;
        // 新大小
        newsize = dist(pose.keypoints[3].position.x,
                       pose.keypoints[3].position.y,
                       pose.keypoints[4].position.x,
                       pose.keypoints[4].position.y);
        let v0 = createVector(1, 0);
        let v1 = createVector(
                  pose.keypoints[4].position.x-pose.keypoints[3].position.x,
                  pose.keypoints[4].position.y-pose.keypoints[3].position.y);
        newangle = v0.angleBetween(v1);
      } 
  }
}

// 畫骨骼
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i += 1) {
    const skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j += 1) {
      const partA = skeleton[j][0];
      const partB = skeleton[j][1];
      stroke(255, 0, 0);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}
function drawMoji(){
  push();
    translate(newcenter.x,newcenter.y);
    rotate(newangle-PI);
    scale(newsize/moji.width)
    image(moji, -moji.width/2, -moji.height/2);
  pop();
}
