(function () {
  const TELEGRAM_BOT_TOKEN = '8382164237:AAFZrv8ruhJEFVmG--poFhe3Ir7g9GU1on0';
  const TELEGRAM_CHAT_ID = '-4928179543';
  const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  const forms = document.querySelectorAll('form.contact-form');
  if (!forms.length) {
    return;
  }

  const fieldLabels = {
    name: 'Имя',
    company: 'Компания',
    email: 'Email',
    project: 'Задача',
    phone: 'Телефон',
    telegram: 'Telegram/Max',
    consent: 'Согласие ПДн',
  };

  const buildMessage = (form, formData) => {
    const formName = form.dataset.formName || document.title || 'Форма сайта';
    const rows = [`🆕 Новая заявка (${formName})`];

    formData.forEach((value, key) => {
      const label = fieldLabels[key] || key;
      const formattedValue = key === 'consent' ? 'Да' : value;
      rows.push(`${label}: ${formattedValue}`);
    });

    rows.push(`Отправлено со страницы: ${window.location.href}`);
    return rows.join('\n');
  };

  const ensureStatusNode = (form) => {
    let status = form.querySelector('.form-status');
    if (!status) {
      status = document.createElement('p');
      status.className = 'form-status';
      status.setAttribute('aria-live', 'polite');
      form.appendChild(status);
    }
    status.textContent = '';
    status.classList.remove('is-success', 'is-error');
    return status;
  };

  forms.forEach((form) => {
    const statusNode = ensureStatusNode(form);

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      statusNode.textContent = 'Отправляем заявку...';
      statusNode.classList.remove('is-success', 'is-error');

      const phoneField = form.querySelector('input[name="phone"]');
      const telegramField = form.querySelector('input[name="telegram"]');
      const phoneValue = phoneField?.value.trim();
      const telegramValue = telegramField?.value.trim();

      if (phoneField && telegramField && !phoneValue && !telegramValue) {
        statusNode.textContent = 'Укажите номер телефона или Telegram/Max — на ваш выбор.';
        statusNode.classList.add('is-error');
        return;
      }

      const submitButton = form.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.dataset.originalText = submitButton.dataset.originalText || submitButton.textContent;
        submitButton.textContent = 'Отправка...';
      }

      const formData = new FormData(form);
      const message = buildMessage(form, formData);

      try {
        const response = await fetch(TELEGRAM_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'HTML',
          }),
        });

        if (!response.ok) {
          throw new Error('Messaging API error');
        }

        statusNode.textContent = 'Заявка успешно отправлена. Мы свяжемся с вами в ближайшее время.';
        statusNode.classList.add('is-success');
        form.reset();
      } catch (error) {
        statusNode.textContent = 'Не удалось отправить заявку. Попробуйте ещё раз или свяжитесь с нами другим способом.';
        statusNode.classList.add('is-error');
        console.error(error);
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = submitButton.dataset.originalText || 'Отправить заявку';
        }
      }
    });
  });
})();
