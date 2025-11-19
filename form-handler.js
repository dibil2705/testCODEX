(function () {
  const TELEGRAM_BOT_TOKEN = '8382164237:AAFZrv8ruhJEFVmG--poFhe3Ir7g9GU1on0';
  const TELEGRAM_CHAT_ID = '7425813994';
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
  };

  const buildMessage = (form, formData) => {
    const formName = form.dataset.formName || document.title || 'Форма сайта';
    const rows = [`🆕 Новая заявка (${formName})`];

    formData.forEach((value, key) => {
      const label = fieldLabels[key] || key;
      rows.push(`${label}: ${value}`);
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
          throw new Error('Telegram API error');
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
