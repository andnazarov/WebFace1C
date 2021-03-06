$("*").on("pagecreate", function(event) {
  if (event.target.attributes.id.value === "divisions_page") {
    divisions_page_create(event);
  } else if (event.target.attributes.id.value === "questions_page") {
    questions_page_show(event);
  } else if (event.target.attributes.id.value === "question_page") {
    question_page_show(event);
  } else if (event.target.attributes.id.value === "answer_page") {
    answer_page_show(event);
  } else if (event.target.attributes.id.value === "problem_questions_page") {
    problem_questions_page_show(event);
  }
});

function divisions_page_create(event) {
  $.get("divisions.json", function(itemList) {
    jQuery.data(document.body, "data", itemList);

    var itemList = jQuery.data(document.body, "data");
    var divsList = $("#divsList");

    itemList.forEach(function(item, i, itemList) {
      var element =
        '<li id="div' +
        item.id +
        '"><a href="#questions_page">' +
        item.id +
        ". " +
        item.caption +
        '<span class="ui-li-count">' +
        item.questions.length.toString() +
        "</span></a></li>";
      divsList.append(element);
    });

    divsList.listview("refresh");

    $("#divsList li a").attr("style", "white-space: normal;");

    // Обработка нажатия на раздел.
    $("#divsList li").click(function() {
      jQuery.data(document.body, "isExamMode", false);
      var divId = this.id.replace("div", "");
      var index = Number.parseInt(divId) - 1;
      jQuery.data(document.body, "current_division_index", index);
    });

    // Обработка нажатия на кнопку Экзамен.
    $("#startExam").click(function() {
      jQuery.data(document.body, "isExamMode", true);

      index = 0;
      jQuery.data(document.body, "current_division_index", index);
      var exam_mistakes_counter = { questions_count: 0, mistakes_count: 0 };
      jQuery.data(
        document.body,
        "exam_mistakes_counter",
        exam_mistakes_counter
      );
    });
  });
}

// Вызывается перед показом формы списка вопросов.
function questions_page_show(event) {
  $("#questions_page").on("pagebeforeshow", function(event) {
    var current_division_index = jQuery.data(
      document.body,
      "current_division_index"
    );

    if (current_division_index === undefined) {
      return;
    }

    // Установка заголовка формы.
    var current_division_index_string = (current_division_index + 1).toString();
    var questions_page_header = $("#questions_page_header");
    questions_page_header.empty();
    questions_page_header.append(
      "<h1>Раздел " + current_division_index_string + "</h1>"
    );
    questions_page_header.toolbar("refresh");

    var itemList = jQuery.data(document.body, "data");
    var division = itemList[current_division_index];

    // Перерисовываем список вопросов текущего раздела.
    var questionsList = $("#questionsList");
    questionsList.empty();
    division.questions.forEach(function(item, i, itemList) {
      var element =
        '<li id="ques' +
        i.toString() +
        '"><a href="#question_page"><p>' +
        item.number +
        ". " +
        item.caption +
        "</p></a></li>";
      questionsList.append(element);
    });

    questionsList.listview("refresh");

    $("#questionsList li a p").attr("style", "white-space: normal;");

    // Обработка нажатия на вопрос.
    $("#questionsList li").click(function() {
      var quesId = this.id.replace("ques", "");
      var index = Number.parseInt(quesId);
      jQuery.data(document.body, "current_question_index", index);
    });
  });
}

function question_page_show(event) {
  $("#question_page").on("pagebeforeshow", function(event) {
    var isExamMode = jQuery.data(document.body, "isExamMode");

    var current_division_index = jQuery.data(
      document.body,
      "current_division_index"
    );

    if (current_division_index === undefined) {
      return;
    }

    var itemList = jQuery.data(document.body, "data");

    if (isExamMode === true) {
      var current_question_index = getRandomArbitary(
        0,
        itemList[current_division_index].questions.length - 1
      );
      jQuery.data(
        document.body,
        "current_question_index",
        current_question_index
      );
      $("#return_to_questions")
        .hide()
        .trigger("updatelayout");
    } else {
      var current_question_index = jQuery.data(
        document.body,
        "current_question_index"
      );
      $("#return_to_questions")
        .show()
        .trigger("updatelayout");
    }

    var question =
      itemList[current_division_index].questions[current_question_index];
    var answers = question.answers;

    $("#questionh1").html("Вопрос " + question.number);

    var questionDescP = $("#question_text");
    questionDescP.html(question.caption);

    var answersList = $("#answersList");
    answersList.empty();

    answers.forEach(function(item, i, itemList) {
      var element =
        '<li id="ans' +
        i.toString() +
        '"><a href="#answer_page" data-transition="flip"><p>' +
        item.number +
        ". " +
        item.text +
        "</p></a></li>";
      answersList.append(element);
    });

    answersList.listview("refresh");

    $("#answersList li a p").attr("style", "white-space: normal;");

    // Обработка нажатия на ответ.
    $("#answersList li").click(function() {
      var ansId = this.id.replace("ans", "");
      var index = Number.parseInt(ansId);
      jQuery.data(document.body, "current_answer_index", index);
      jQuery.data(
        document.body,
        "current_answer_correct",
        question.correctIndex === ansId
      );
    });
  });
}

function answer_page_show(event) {
  $("#answer_page").on("pagebeforeshow", function(event) {
    var current_division_index = jQuery.data(
      document.body,
      "current_division_index"
    );

    if (current_division_index === undefined) {
      $("#repeat_question")
        .hide()
        .trigger("updatelayout");
      $("#next_question")
        .hide()
        .trigger("updatelayout");
      return;
    }

    var isExamMode = jQuery.data(document.body, "isExamMode");

    var itemList = jQuery.data(document.body, "data");

    var current_question_index = jQuery.data(
      document.body,
      "current_question_index"
    );

    var question =
      itemList[current_division_index].questions[current_question_index];
    var answers = question.answers;
    var answer = answers[current_answer_index];

    var current_answer_index = jQuery.data(
      document.body,
      "current_answer_index"
    );

    var current_answer_correct = jQuery.data(
      document.body,
      "current_answer_correct"
    );

    $("#answerh1").html("Ответ на " + question.number);

    answer_head = $("#answer_head");

    if (current_answer_correct === true) {
      answer_head.html("Правильно!");
      // Если ответ правильный, то кнопку "Повторить вопрос" надо спрятать, а следующий вопрос - показать
      $("#next_question")
        .show()
        .trigger("updatelayout");
      $("#repeat_question")
        .hide()
        .trigger("updatelayout");
    } else {
      answer_head.html("Не правильно!");
      if (isExamMode === true) {
        $("#next_question")
          .show()
          .trigger("updatelayout");
        $("#repeat_question")
          .hide()
          .trigger("updatelayout");
        $("#return_to_questions_from_answer")
          .hide()
          .trigger("updatelayout");
      } else {
        $("#next_question")
          .hide()
          .trigger("updatelayout");
        $("#repeat_question")
          .show()
          .trigger("updatelayout");
        $("#return_to_questions_from_answer")
          .show()
          .trigger("updatelayout");
      }
      proplem_question_add({"d" : current_division_index, "q" : current_question_index});
    }
    $("#question_text_answer").html(question.number + ". " + question.caption);
    $("#answer_text").html(
      answers[current_answer_index].number +
        ". " +
        answers[current_answer_index].text
    );

    $("#next_question").click(function() {
      if (isExamMode === true) {
        current_division_index = current_division_index + 1;
        jQuery.data(
          document.body,
          "current_division_index",
          current_division_index
        );
      } else if (
        current_division_index === itemList.length - 1 &&
        current_question_index ===
          itemList[current_division_index].questions.length - 1
      ) {
        // Это конец. Нужно потом как-то это обработать.
        alert("Конец!");
      } else if (
        current_question_index ===
        itemList[current_division_index].questions.length - 1
      ) {
        // Нужно перейти в другой раздел.
        current_question_index = 0;
        current_division_index = current_division_index + 1;
        jQuery.data(
          document.body,
          "current_division_index",
          current_division_index
        );
        jQuery.data(
          document.body,
          "current_question_index",
          current_question_index
        );
      } else {
        // Не нужно переходить в другой раздел.
        current_question_index = current_question_index + 1;
        jQuery.data(
          document.body,
          "current_question_index",
          current_question_index
        );
      }
    });
  });
}

function problem_questions_page_show(event) {
  console.log(Cookies.getJSON("problem_questions"));
}

function getRandomArbitary(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function proplem_question_add(questionData) {

  var problem_questions = Cookies.getJSON("problem_questions");
  if (problem_questions === undefined) {
    var problem_questions = [];
  };

  var question_str = zeroPad(questionData.d, 2) + '.' + zeroPad(questionData.q, 3);
  problem_questions.push(question_str);
  problem_questions = unique(problem_questions);
  problem_questions.sort();

  Cookies.set("problem_questions", problem_questions);

}

function proplem_question_delete(questionData) {

  var problem_questions = Cookies.getJSON("problem_questions");
  
  var question_str = zeroPad(questionData.d, 2) + '.' + zeroPad(questionData.q, 3);

  var index = problem_questions.indexOf(question_str);
  if (index === -1) {
    return;
  } else {
    question_str.delete(index);
  };

  Cookies.set("problem_questions", problem_questions);

}

function zeroPad(num,count) {
  var numZeropad = num + '';
  while(numZeropad.length < count) {
      numZeropad = "0" + numZeropad;
  }
  return numZeropad;
}

function unique(arr) {
  var obj = {};

  for (var i = 0; i < arr.length; i++) {
    var str = arr[i];
    obj[str] = true; // запомнить строку в виде свойства объекта
  }

  return Object.keys(obj); // или собрать ключи перебором для IE8-
}
