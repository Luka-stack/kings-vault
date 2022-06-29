export enum ActionType {
  // accounts
  LOG_IN = 'log_in',
  LOG_OUT = 'log_out',
  LOG_IN_COMPLETE = 'log_in_complete',
  USER_FORM_ERROR = 'user_form_error',
  USER_UPDATE = 'user_update',
  USER_ERROR = 'user_error',

  // passwords
  PASSWD_UPDATE_ALL = 'passwds_update_all',
  PASSWD_SAVE = 'passwds_save',
  PASSWD_DELETE = 'passwds_delete',

  // toasts
  APPEND_TOAST = 'append_toast',
  REMOVE_TOAST = 'remove_toast',
}
