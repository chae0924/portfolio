// svg캐릭터 움직임
gsap.registerPlugin(); // CustomEase, CustomWiggle을 사용하지 않으므로 플러그인 등록 없음

let dizzyIsPlaying = false; // dizzy 상태 변수

// 초기 설정
const meTl = gsap.timeline({
  onComplete: addMouseEvent,
  delay: 1,
});

// 초기 세팅
gsap.set(".bg", { transformOrigin: "50% 50%" });
gsap.set(".ear-right", { transformOrigin: "0% 50%" });
gsap.set(".ear-left", { transformOrigin: "100% 50%" });
gsap.set(".me", { opacity: 1 });

meTl.from(".me", {
  duration: 1,
  yPercent: 100,
  ease: "elastic.out(0.5, 0.4)", // 기본 elastic 이징 사용
}, 0.5)
  .from(".head , .hair , .shadow", {
    duration: 0.9,
    yPercent: 20,
    ease: "elastic.out(0.58, 0.25)", // 기본 elastic 이징 사용
  }, 0.6)
  .from(".ear-right", {
    duration: 1,
    rotate: 40,
    yPercent: 10,
    ease: "elastic.out(0.5, 0.2)", // 기본 elastic 이징 사용
  }, 0.7)
  .from(".ear-left", {
    duration: 1,
    rotate: -40,
    yPercent: 10,
    ease: "elastic.out(0.5, 0.2)", // 기본 elastic 이징 사용
  }, 0.7)
  .to(".glasses", {
    duration: 1,
    keyframes: [{ yPercent: -10 }, { yPercent: 0 }],
    ease: "elastic.out(0.5, 0.2)", // 기본 elastic 이징 사용
  }, 0.75)
  .from(".eyebrow-right , .eyebrow-left", {
    duration: 1,
    yPercent: 300,
    ease: "elastic.out(0.5, 0.2)", // 기본 elastic 이징 사용
  }, 0.7)
  .to(".eye-right , .eye-left", {
    duration: 0.01,
    opacity: 1,
  }, 0.85)
  .to(".eye-right-2 , .eye-left-2", {
    duration: 0.01,
    opacity: 0,
  }, 0.85);

// 흔들림 애니메이션을 기본 GSAP 기능으로 구현
const dizzy = gsap.timeline({
  paused: true,
  onComplete: () => {
    dizzyIsPlaying = false;
  },
});

dizzy
  .to(".eyes", { duration: 0.01, opacity: 0 }, 0)
  .to(".dizzy", { duration: 0.01, opacity: 0.3 }, 0)
  .to(".mouth", { duration: 0.01, opacity: 0 }, 0)
  .to(".oh", { duration: 0.01, opacity: 0.85 }, 0)
  .to(".head, .hair-back, .shadow", {
    duration: 6,
    rotate: 2,
    transformOrigin: "50% 50%",
    ease: "none", // 기본 이징 함수 사용
  }, 0)
  .to(".me", {
    duration: 6,
    rotate: -2,
    transformOrigin: "50% 100%",
    ease: "none", // 기본 이징 함수 사용
  }, 0)
  .to(".me", {
    duration: 4,
    scale: 0.99,
    transformOrigin: "50% 100%",
    ease: "none", // 기본 이징 함수 사용
  }, 0)
  .to(".dizzy-1", {
    rotate: -360,
    duration: 1,
    repeat: 5,
    transformOrigin: "50% 50%",
    ease: "none", // 기본 이징 함수 사용
  }, 0.01)
  .to(".dizzy-2", {
    rotate: 360,
    duration: 1,
    repeat: 5,
    transformOrigin: "50% 50%",
    ease: "none", // 기본 이징 함수 사용
  }, 0.01)
  .to(".eyes", { duration: 0.01, opacity: 1 }, 4)
  .to(".dizzy", { duration: 0.01, opacity: 0 }, 4)
  .to(".oh", { duration: 0.01, opacity: 0 }, 4)
  .to(".mouth", { duration: 0.01, opacity: 1 }, 4);

// mouse event stuff
let xPosition, yPosition;
let height, width;
let meRect, centeredX, centeredY;

function updateScreenCoords(event) {
  if (!dizzyIsPlaying) {
    xPosition = event.clientX;
    yPosition = event.clientY;
  }

  meRect = document.querySelector(".me").getBoundingClientRect();
  centeredX = xPosition - (meRect.left + meRect.width / 2);
  centeredY = yPosition - (meRect.top + meRect.height * 0.05);

  if (!dizzyIsPlaying && Math.abs(event.movementX) > 500) {
    dizzyIsPlaying = true;
    dizzy.restart();
  }
}

const dom = {
  face: document.querySelector(".face"),
  eye: document.querySelectorAll(".eye"),
  innerFace: document.querySelector(".inner-face"),
  hairFront: document.querySelector(".hair-front"),
  hairBack: document.querySelector(".hair-back"),
  shadow: document.querySelectorAll(".shadow"),
  ear: document.querySelectorAll(".ear"),
  eyebrowLeft: document.querySelector(".eyebrow-left"),
  eyebrowRight: document.querySelector(".eyebrow-right"),
};

function animateFace() {
  if (!xPosition) return;

  let x = (centeredX / (width / 2)) * 40;
  let y = (centeredY / (height / 2)) * 30;

  let yHigh = (centeredY / (height / 2)) * 25 - 10;
  let yLow = (centeredY / (height / 2)) * 25 - 50;

  gsap.to(dom.face, { yPercent: yLow / 30, xPercent: x / 30 });
  gsap.to(dom.eye, { yPercent: yLow / 10, xPercent: x * 0.1 });
  gsap.to(dom.innerFace, { yPercent: y / 6, xPercent: x / 8 });
  gsap.to(dom.hairFront, { yPercent: yLow / 30 });
  gsap.to([dom.hairBack, dom.shadow], { yPercent: (yLow / 20) * -1, xPercent: (x / 20) * -1 });
  gsap.to(dom.ear, { yPercent: (y / 1.5) * -1, xPercent: (x / 10) * -1 });
  gsap.to([dom.eyebrowLeft, dom.eyebrowRight], { yPercent: y * 0.2 });
}

// function being called at the end of main timeline
function addMouseEvent() {
  const safeToAnimate = window.matchMedia(
    "(prefers-reduced-motion: no-preference)"
  ).matches;

  if (safeToAnimate) {
    window.addEventListener("mousemove", updateScreenCoords);
    gsap.ticker.add(animateFace);

    // blink 애니메이션 시작
    blink.play();
    glassesTilt.play();
  }
}

// 눈 깜박임 애니메이션 (3초마다 반복)
const blink = gsap.timeline({
  repeat: -1,  // 무한 반복
  repeatDelay: 3, // 3초마다 반복
  paused: true // 초기에는 멈춰 있음
});

blink.to(".eye-right, .eye-left", { duration: 0.1, opacity: 0 }, 0)
     .to(".eye-right-2, .eye-left-2", { duration: 0.1, opacity: 1 }, 0)
     .to(".eye-right, .eye-left", { duration: 0.1, opacity: 1 }, 0.15)
     .to(".eye-right-2, .eye-left-2", { duration: 0.1, opacity: 0 }, 0.15);

// 애교머리 흔들리는 애니메이션
const glassesTilt = gsap.timeline({
  repeat: -1, // 무한 반복
  repeatDelay: 1, // 1초마다 반복
  paused: true // 초기에는 멈춰 있음
});

glassesTilt.to(".glasses", { duration: 0.5, rotate: 10, transformOrigin: "50% 0%" })
           .to(".glasses", { duration: 0.5, rotate: -10, transformOrigin: "50% 0%" })
           .to(".glasses", { duration: 0.5, rotate: 6, transformOrigin: "50% 0%" })
           .to(".glasses", { duration: 0.5, rotate: -6, transformOrigin: "50% 0%" })
           .to(".glasses", { duration: 0.5, rotate: 3, transformOrigin: "50% 0%" })
           .to(".glasses", { duration: 0.5, rotate: -3, transformOrigin: "50% 0%" })
           .to(".glasses", { duration: 0.5, rotate: 0, transformOrigin: "50% 0%" });

const mouthAnim = gsap.timeline({ paused: true, repeat: 0 });

mouthAnim.to(".mouth", { duration: 0.3, opacity: 0 }, 0)
        .to(".smile", { duration: 0.3, opacity: 1 }, 0)
        .to(".smile", { duration: 0.3, opacity: 0 }, 1)
        .to(".mouth", { duration: 0.3, opacity: 1 }, 1);

dizzy.to(".mouth", { duration: 0.01, opacity: 0 }, 0)
    .to(".smile", { duration: 0.01, opacity: 0 }, 0);

// 클릭 시 mouthAnim 실행, dizzy 애니메이션이 실행 중이지 않으면
document.addEventListener("click", () => {
  if (!dizzyIsPlaying && !mouthAnim.isActive()) {
    mouthAnim.restart();
  }
});

// 화면 크기 업데이트 함수
function updateWindowSize() {
  height = window.innerHeight;
  width = window.innerWidth;
}

updateWindowSize();
window.addEventListener("resize", updateWindowSize);


// svg캐릭터 움직임 끝

document.addEventListener("DOMContentLoaded", function () {
  const myTab = document.getElementById("myTab");

  myTab.addEventListener("click", function (e) {
    const target = e.target.getAttribute("href");

    // 탭을 전환할 때마다 모든 카드에서 'show' 클래스 제거
    const allCards = document.querySelectorAll(".card");
    allCards.forEach(card => {
      card.classList.remove("show");
    });

    if (target === "#content2") {
      const cards = document.querySelectorAll("#content2 .card");

      // 각 카드를 순차적으로 나타나게 함 (다시 실행)
      setTimeout(() => {
        cards.forEach((card, index) => {
          setTimeout(() => {
            card.classList.add("show");
          }, index * 100); // 0.1초 간격으로 등장
        });
      }, 100); // 첫 번째 실행 지연
    }
  });
});
