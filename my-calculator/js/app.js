(function () {


  $numbers = document.querySelectorAll(".keybtn.number");
  $operators = document.querySelectorAll(".keybtn.operator");
  $equal = document.querySelector(".keybtn.equal");
  $result = document.querySelector("#result");
  $expression = document.querySelector("#expression");
  $ac = document.querySelector(".ac");
  $del = document.querySelector(".del");
  $sqar = document.querySelector(".sqar");
  $free = document.querySelector(".free");

  let stack = ['0']; // 用于存放需要操作的数,默认第一位0
  let operatorType = ''; // 用于存放算术符号


  let scale = function(ele) {
      let maxWidth = $free.clientWidth * 0.9;
      if ( ele.scrollWidth > maxWidth) {
        ele.style.transform = `scale(${ maxWidth / ele.scrollWidth })`;
        ele.style.transformOrigin = 'center center';
      } else {
        ele.style.transform = `scale(1)`;
      }
    }




  // 显示每次输入的表达式
  let showNumber = function (ifshow) {
    if (ifshow) {
      $expression.innerText = stack[0] + operatorType;
    } else {
      $expression.innerText = stack.join(operatorType);
    }
    scale($expression);
  }

  // 显示计算结果
  let showResult = function () {
    let result = stack[stack.length - 1];
    if(typeof result === 'undefined') result = stack[stack.length - 2];
    $result.innerText = result;
    scale($result);
  }

  //计算
  let calculate = function () {
    if (stack.length === 2 && (typeof stack[1] !== 'undefined')) { //表达式为空
      let result = 0;
      let o1 = Number(stack.shift());
      let o2 = Number(stack.shift());
      switch (operatorType) {
        case '+':
          result = o1 + o2;
          break;
        case '-':
          result = o1 - o2;
          break;
        case '×':
          result = o1 * o2;
          break;
        case '÷':
          if(eval(o2) === 0){
              break;
          }
          result = o1 / o2;
          break;
      }
      result = parseFloat(result.toPrecision(10));
      stack.push(String(result));
    }
  }

  //ac 清空
  $ac.addEventListener('click', function () {
    stack.length = 1;
    stack[0] = '0';
    operatorType = '';
    showNumber();
    showResult();
  })

  //del 逐步删除
  $del.addEventListener('click', function () {
    let len = stack.length;
    let numberStr = stack.pop();
    if (len === 1) {
      if (numberStr.length === 1) {
        stack.push('0');
      } else {
        stack.push(numberStr.substr(0, numberStr.length - 1));
      }
    } else {
      if (typeof numberStr == 'undefined') {
        operatorType = '';
      } else if (numberStr.length === 1) {
        stack.length = 2;
      } else {
        stack.push(numberStr.substr(0, numberStr.length - 1));
      }
    }
    showNumber();
    showResult();
  })

  //平方
  $sqar.addEventListener('click', function () {
    var last = stack.pop();
    if (typeof last !== 'undefined' && last !== '-') {
      let number = Math.pow(Number(last), 2);
      stack.push(String(number)); 
    }else{
      stack.push(last); 
    }
    showNumber();
    showResult();

  })

  //等号
  $equal.addEventListener('click', function () {
    calculate();
    operatorType = ''; //清空操作符
    showNumber();
    showResult();
  })

  let fillZero = function () {
    let len = stack.length;
    if (stack[len - 1].charAt(stack[len - 1].length - 1) === '.') {
      stack[len - 1] += '0';
    }
  }


  //   '+-*/'输入做控制
  for (let $operator of $operators) {
    $operator.addEventListener('click', function (event) {
      let flag = false;
      if(stack[0] === '-')return false;
      if (stack.length === 1 ) {
        fillZero();
        stack.length = 2;
      } else {
        if ((typeof stack[1] !== 'undefined')) { 
          fillZero();
          calculate();
          stack.length = 2;
          flag = true;
        }
      }
      operatorType = event.currentTarget.dataset.type;
      showNumber(flag);
      showResult();
    })
  }

  // 数字键做控制
  for (let $number of $numbers) {
    $number.addEventListener('click', function (event) {
      let curr = event.currentTarget.dataset.num;
      var last = String(stack.pop());
      if (last === 'undefined' || last === '0') {
        last = '';
      }
      let number = last;
      if (curr === '.') {
        if (last.indexOf(".") === -1) { // 无点号
          if (last === '' || last === '-') { // 该位为空则补0
            last += '0';
          }
          number = last + curr;
        }

      } else {
        number = last + curr;
      }
      stack.push(number);
      showNumber();
      showResult();
    });
  }

})()