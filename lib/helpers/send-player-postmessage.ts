// sending postmessages to player
const sendPlayerPostMessage = (messageToSend: string) => {
  const player = window.frames['player'];

  if (!player) {
    return null;
  }
  let message = '';

  message = JSON.stringify({
    command: messageToSend,
  });

  if (player && typeof player.postMessage === `function`) {
    player.postMessage(message, '*');
  }
};

export { sendPlayerPostMessage };
