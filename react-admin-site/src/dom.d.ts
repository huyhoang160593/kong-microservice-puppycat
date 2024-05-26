interface AlertDetail {
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

interface GlobalEventHandlersEventMap {
  'displayalert': CustomEvent<AlertDetail>;
}