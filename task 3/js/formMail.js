var button = document.getElementById('sendMail') //клик по кнопке
button.onclick = sendMail
//функция смены цвета для input
function setColor(element, color) {
  element.style.backgroundColor = color
}

//функция перевода секунд в дату, входной параметр:секунды, тип данных:int, тип возвращаемых данных: date
function toDateTime(secs) {
  //перевод секунд в дату для прибавки 1.5 часа
  var t = new Date(1970, 0, 1)
  t.setSeconds(secs)
  return t
}
//функция валидации данных и создания ajax запроса
function sendMail() {
  var currentdate = new Date() //дата заявки
  var currentdateplus = new Date().getTime() / 1000 + 5400 //дата заявки + 1.5 часа в секундах
  currentdateplus = new Date(currentdateplus * 1000)
  currentdateplus =
    currentdateplus.getFullYear() +
    '-' +
    (currentdateplus.getMonth() + 1) +
    '-' +
    currentdateplus.getDate() +
    ' ' +
    currentdateplus.getHours() +
    ':' +
    currentdateplus.getMinutes() +
    ':' +
    currentdateplus.getSeconds() //дата заявки + 1.5 часа в формате datetime
  var fullname = document.getElementById('inputFullname').value //данные пользователя
  var mail = document.getElementById('inputMail').value.trim()
  var phone = document.getElementById('inputPhone').value.trim()
  var comment = document.getElementById('inputСomment').value
  var time =
    currentdate.getFullYear() + //дата заявки в формате datetime
    '-' +
    (currentdate.getMonth() + 1) +
    '-' +
    currentdate.getDate() +
    ' ' +
    currentdate.getHours() +
    ':' +
    currentdate.getMinutes() +
    ':' +
    currentdate.getSeconds()
  //валидация
  var fio_reg = /[А-я]{1,25} [А-я]{1,25} [А-я]{1,25}/
  var email_reg =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  var phone_reg = /\+?[0-9]{11}/

  if (!fio_reg.test(fullname)) {
    //валидация фио
    setColor(document.getElementById('inputFullname'), 'pink')
    document.getElementById('errorMes').innerHTML = 'Неправильно введено ФИО'
    return false
  } else {
    setColor(document.getElementById('inputFullname'), 'white')
  }
  if (!email_reg.test(mail)) {
    //валидация почты
    setColor(document.getElementById('inputMail'), 'pink')
    document.getElementById('errorMes').innerHTML = 'Неправильно введен email'
    return false
  } else {
    setColor(document.getElementById('inputMail'), 'white')
  }
  if (!phone_reg.test(phone)) {
    //валидация номера телефона
    setColor(document.getElementById('inputPhone'), 'pink')
    document.getElementById('errorMes').innerHTML =
      'Неправильно введен номер телефона'
    return false
  } else {
    setColor(document.getElementById('inputPhone'), 'white')
  }
  if (comment == '') {
    //валидация комментария на пустоту
    setColor(document.getElementById('inputСomment'), 'pink')
    document.getElementById('errorMes').innerHTML = 'Оставьте комментарий'
    return false
  } else {
    setColor(document.getElementById('inputСomment'), 'white')
  }
  setColor(document.getElementById('inputFullname'), 'white')
  setColor(document.getElementById('inputMail'), 'white')
  setColor(document.getElementById('inputPhone'), 'white')
  setColor(document.getElementById('inputСomment'), 'white')

  document.getElementById('errorMes').innerHTML = ''
  //ajax запрос отправки данных
  $(document).ready(function () {
    $.ajax({
      type: 'POST',
      url: './mail.php',
      cache: false,
      data: {
        fullname: fullname,
        mail: mail,
        phone: phone,
        comment: comment,
        time: time,
      },
      dataType: 'text',
      beforeSend: function () {
        //отключение кнопки отправки для предотвращения нескольких заявок
        $('#sendMail').prop('disabled', true)
      },
      success: function (data) {
        //отображение другого div с данными
        if (!data) {
          document.getElementById('form').style.visibility = 'hidden'
          document.getElementById('form2').style.visibility = 'visible'
          document.getElementById('form2').style.position = 'fixed'
          document.getElementById('fullname').innerHTML = fullname
          document.getElementById('mail').innerHTML = mail
          document.getElementById('phone').innerHTML = phone
          document.getElementById('comment').innerHTML = comment
          document.getElementById('curtime').innerHTML =
            'С Вами свяжутся после ' + currentdateplus
        } else {
          //если заявка отправлена в течение прошедшего часа
          $('#sendMail').prop('disabled', false)
          document.getElementById('errorMes').innerHTML =
            'Вы не можете отправить заявку на тот же email в течение часа.'
        }
      },
    })
  })
}
