document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const modals = () => {
        function bindModal(triggerSelector, modalSelector, closeSelector) {

            let trigger = document.querySelectorAll(triggerSelector),
                modal = document.querySelector(modalSelector),
                close = document.querySelector(closeSelector);


            trigger.forEach(item => {
                item.addEventListener('click', (e) => {
                    if (e.target) {
                        e.preventDefault();
                    }
                    modal.style.display = 'block';
                    modal.classList.add('animated', 'zoomIn');
                    document.body.classList.add('open-popup');
                });
            });

            close.addEventListener('click', () => {
                modal.style.display = 'none';
                document.body.classList.remove('open-popup');
            });

            window.addEventListener("keydown", function (e) {
                if (e.keyCode === 27) {
                    e.preventDefault();
                    modal.style.display = 'none';
                    document.body.classList.remove('open-popup');
                }
            });
        }

        bindModal('.popup--engineer__button', '.popup--engineer', '.popup--engineer .popup__close');

        bindModal('.popup--callback__button', '.popup--callback', '.popup--callback .popup__close');

        bindModal('.popup--calculate__button', '.popup--calculate', '.popup--calculate .popup__close');
    };
    modals();

    const tabs = () => {
        function tab(tabNavSelector, tabContentSelector) {

            let tabNav = document.querySelectorAll(tabNavSelector);
            let tabContent = document.querySelectorAll(tabContentSelector);
            let tabName;

            tabNav.forEach(item => {
                item.addEventListener('click', selectTabNav)
            });

            function selectTabNav() {
                tabNav.forEach(item => {
                    item.classList.remove('is-active');
                });
                this.classList.add('is-active');
                tabName = this.getAttribute('data-tab-name');
                selectTabContent(tabName);
            }

            function selectTabContent(tabName) {
                tabContent.forEach(item => {
                    item.classList.contains(tabName) ? item.classList.add('is-active', 'animated', 'zoomIn') :
                        item.classList.remove('is-active', 'zoomIn');
                });
            }
        }

        tab('.decoration-nav-tab', '.decoration-tab-content');
        tab('.glazing-nav-tab', '.glazing-tab-content');

    };
    tabs();

    const timer = () => {

        //Служеьная функция
        let addZero = (number) => {
            if (number <= 9) {
                return '0' + number;
            }
            return number;
        };

        let getTimeRemaining = (endTime) => {
            let time = Date.parse(endTime) - Date.parse(new Date()),
                seconds = Math.floor((time / 1000) % 60),
                minutes = Math.floor((time / 1000 / 60) % 60),
                hours = Math.floor((time / 1000 / 60 / 60) % 24),
                days = Math.floor(time / 1000 / 60 / 60 / 24);
            return {
                'total': time,
                'days': days,
                'hours': hours,
                'minutes': minutes,
                'seconds': seconds
            };
        };

        let setTime = (selector, endTime) => {

            let timer = document.querySelector(selector),
                daysSpan = timer.querySelector('.days'),
                hoursSpan = timer.querySelector('.hours'),
                minutesSpan = timer.querySelector('.minutes'),
                secondsSpan = timer.querySelector('.seconds'),

                timeInterval = setInterval(updateClock, 1000);

            //Обновление таймера, записываем в DOM
            function updateClock() {
                let t = getTimeRemaining(endTime);

                daysSpan.textContent = addZero(t.days);
                hoursSpan.textContent = addZero(t.hours);
                minutesSpan.textContent = addZero(t.minutes);
                secondsSpan.textContent = addZero(t.seconds);

                if (t.total <= 0) {
                    clearInterval(timeInterval);
                    daysSpan.textContent = "00";
                    hoursSpan.textContent = "00";
                    minutesSpan.textContent = "00";
                    secondsSpan.textContent = "00";

                    clearInterval(timeInterval);
                }
            }

            updateClock();
        };

        let dedLine = 'August 30 2020';

        setTime('#timer', dedLine);
    };
    timer();

    const forms = () => {

        let form = document.querySelectorAll('form');
        let inputs = document.querySelectorAll('input');
        let phoneFields = document.querySelectorAll('input[type="tel"]');

        //В полях номера телефона вводить только цифры
        phoneFields.forEach(input => {
            input.addEventListener('input', () => {
                input.value = input.value.replace(/\D/, '');
            });
        });

        //Ответы для пользователя
        const answers = {
            loadingMessage: 'Загрузка...',
            successMessage: 'Спасибо! Мы свяжемся с Вами в течении 15 минут',
            failMessage: 'Извините! Что-то пошло не так...',
            loadingImg: './img/answer-loading.gif',
            successImg: './img/answer-success.png'
        };

        //Функция отправки запроса
        const postData = async (url, data) => {
            let response = await fetch(url, {
                method: "POST",
                body: data
            });
            return await response.text();
        };

        //Очистка полей формы после отправки
        const clearFields = () => {
            inputs.forEach(input => {
                input.value = "";
            });
        };

        //Обрабочик на отправку формы Submit
        form.forEach(item => {

            item.addEventListener('submit', (event) => {

                //Отмена стандартного поведения браузера
                event.preventDefault();

                //Блок ответа для пользователя
                let answerPopup = document.createElement('div');
                answerPopup.classList.add('popup__answer');
                document.body.append(answerPopup);

                let answerImg = document.createElement('img');
                answerImg.setAttribute('src', answers.loadingImg);
                answerPopup.append(answerImg);

                let answerText = document.createElement('p');
                answerText.textContent = answers.loadingMessage;
                answerPopup.append(answerText);

                let divFail = document.createElement('div');
                divFail.classList.add('img__failed');

                //Собрание всех данных которые ввел пользователь
                const formData = new FormData(item);

                //Осуществляем post запрос
                postData('./server.php', formData)
                //Успешное выполнение
                    .then(response => {
                        answerImg.setAttribute('src', answers.successImg);
                        answerText.textContent = answers.successMessage;
                    })
                    //Обработка ошибки
                    .catch(() => {
                        answerImg.remove();
                        answerPopup.prepend(divFail);
                        answerText.textContent = answers.failMessage;
                    })
                    .finally(() => {
                        clearFields();
                        setTimeout(() => {
                            answerPopup.classList.remove('flipInX');
                            answerPopup.classList.add('flipOutX');
                            answerPopup.remove();
                        }, 4000);
                    })
            });

        });


    };
    forms();

});










