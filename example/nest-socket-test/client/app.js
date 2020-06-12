(function() {
  const messages = document.querySelector('#messages');
  const wsButton = document.querySelector('#wsButton');
  const wsSendButton = document.querySelector('#wsSendButton');
  const logout = document.querySelector('#logout');
  const login = document.querySelector('#login');
  const userField = document.querySelector('#user-field');
  const receiverField = document.querySelector('#receiver-field');

  function showMessage(message) {
    messages.textContent += `\n${message}`;
    messages.scrollTop = messages.scrollHeight;
  }

  function handleResponse(response) {
    return response.ok
      ? response.json().then(data => JSON.stringify(data, null, 2))
      : Promise.reject(new Error('Unexpected response'));
  }

  login.onclick = function() {
    fetch('/login?userId=' + userField.value, {
      method: 'POST',
      credentials: 'same-origin',
    })
      .then(handleResponse)
      .then(showMessage)
      .catch(function(err) {
        showMessage(err.message);
      });
  };

  logout.onclick = function() {
    fetch('/logout', { method: 'POST', credentials: 'same-origin' })
      .then(handleResponse)
      .then(showMessage)
      .catch(function(err) {
        showMessage(err.message);
      });
  };

  let ws;

  wsButton.onclick = function() {
    if (ws) {
      ws.onerror = ws.onopen = ws.onclose = null;
      ws.close();
    }

    ws = new WebSocket(`ws://${location.host}/tes`);
    ws.onerror = function() {
      showMessage('WebSocket error');
    };
    ws.onopen = function() {
      showMessage('WebSocket connection established');
    };
    ws.onclose = function() {
      showMessage('WebSocket connection closed');
      ws = null;
    };

    ws.onmessage = function(evt) {
      showMessage('Server response ' + JSON.parse(evt.data).message);
    };
  };

  wsSendButton.onclick = function() {
    if (!ws) {
      showMessage('No WebSocket connection');
      return;
    }

    const receiver = receiverField.value;

    ws.send(
      JSON.stringify({
        event: 'chat',
        data: { message: 'Hi Friend ' + receiver, target: receiver },
      }),
    );
  };
})();
