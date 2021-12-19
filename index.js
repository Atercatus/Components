const NUM_OF_HOBBY_HORSE = 12;
const OFFSET = 132; // 120 + 6(margin);
const TRANSITION = "transform 0.16s ease-out 0s";

class Carousel {
  _curPos = 0;
  rail;

  constructor() {
    this._renderCarousel();
    this.initButtonListener();
  }

  _renderCarousel() {
    const carousel = document.querySelector(".carousel");
    const rail = document.createElement("ul");
    rail.classList.add("carousel__rail");
    this.rail = rail;
    this.reposition(0);

    const horses = [
      ...this._makeHorse(NUM_OF_HOBBY_HORSE, ["carousel__hobby-horse", "head"]),
      ...this._makeHorse(NUM_OF_HOBBY_HORSE, ["carousel__hobby-horse"]),
      ...this._makeHorse(NUM_OF_HOBBY_HORSE, ["carousel__hobby-horse", "tail"]),
    ];

    horses.forEach((horse) => rail.append(horse));
    carousel.append(rail);
  }

  _makeHorse(nums, horseCssClasses) {
    const result = [];

    Array(nums)
      .fill(0)
      .forEach((_, idx) => {
        const hobbyHorse = document.createElement("li");
        hobbyHorse.innerText = idx;

        horseCssClasses.forEach((cssClass) =>
          hobbyHorse.classList.add(cssClass)
        );

        result.push(hobbyHorse);
      });

    return result;
  }

  initButtonListener() {
    const leftSlideBtn = document.querySelector("#left");
    const rightSlideBtn = document.querySelector("#right");

    leftSlideBtn.addEventListener("click", () => {
      this.slide(-1);
    });

    rightSlideBtn.addEventListener("click", () => {
      this.slide(1);
    });
  }

  slide(number) {
    // NOTE: 현재 translate 가져오는 법
    // const style = window.getComputedStyle(this.rail);
    // const matrix = style.transform;
    // const regex = new RegExp(/matrix\((.+)\)/);
    // const translateX = Number(regex.exec(matrix)[1].split(", ")[4]);

    const prevPos = this._curPos;
    const resultPos = this._curPos + number;
    const quotient =
      resultPos / NUM_OF_HOBBY_HORSE >= 1
        ? 1
        : resultPos / NUM_OF_HOBBY_HORSE < 0
        ? -1
        : 0;
    const remainder = resultPos % NUM_OF_HOBBY_HORSE;
    const CENTER_BASE = NUM_OF_HOBBY_HORSE * -OFFSET;
    let basePosition = CENTER_BASE;
    this._curPos = remainder >= 0 ? remainder : NUM_OF_HOBBY_HORSE + remainder;

    if (basePosition === CENTER_BASE && !quotient) {
      this.rail.style.transition = TRANSITION;
      this.rail.style.transform = `translate(${
        basePosition + this._curPos * -OFFSET
      }px,0px)`;

      return;
    }

    if (quotient >= 1) {
      const head = Array.from(this.rail.children).slice(0, NUM_OF_HOBBY_HORSE);
      head.forEach((ele) => {
        this.rail.appendChild(ele);
      });
      basePosition = 0;
    } else if (quotient < 0) {
      const tail = Array.from(this.rail.children).slice(
        NUM_OF_HOBBY_HORSE,
        NUM_OF_HOBBY_HORSE * 2
      );
      for (let i = tail.length - 1; i >= 0; i--) {
        this.rail.prepend(tail[i]);
      }
      basePosition = NUM_OF_HOBBY_HORSE * 2;
    }

    this.rail.style.transition = "";
    this.rail.style.transform = `translate(${
      (basePosition + prevPos) * -OFFSET
    }px,0px)`;

    // TODO(cattus-cur): 기존에 움직이던 애니메이션이 사라짐 ㅠ_ㅠ
    requestAnimationFrame(() => {
      this.rail.style.transition = TRANSITION;
      this.rail.style.transform = `translate(${
        CENTER_BASE + this._curPos * -OFFSET
      }px,0px)`;
    });

    // FIXME: transition duration 자체를 짧게 잡아서 티가 안나는 것 뿐.
    //   애니메이션 속도를 늦추게 되면 중간 애니메이션이 사라지므로 우선 엘리먼트를 그대로 복사해서 옮긴 후,
    //   transitionend 이벤트 발생 시, viewport 를 재조정한다.
  }

  reposition(position = 0) {
    if (!this.rail) {
      throw Error("rail 초기화 실패");
    }

    this.rail.style.transform = `translate(${
      (NUM_OF_HOBBY_HORSE + position) * -OFFSET
    }px,0px)`;
    this.rail.style.transition = TRANSITION;

    this._curPos = position;
  }
}

function init() {
  new Carousel();
}

document.addEventListener("DOMContentLoaded", () => {
  init();
});
